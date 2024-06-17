import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ChannelMapItem, ContextProps, GlobalState, MessageType } from '@/lib/types';
import PubNub, { MessageEvent, PresenceEvent } from 'pubnub';
import { v4 } from 'uuid';
import { useUpdateEffect } from '@/lib/hooks';
import { DEFAULT_STATE, DEFAULT_USER, STORAGE_PREFIX } from '@/lib/constants';

const StateContext = createContext<ContextProps | undefined>(undefined);

export type ContextProviderProps = {
    children?: ReactNode;
}



const pubnub = new PubNub({
    publishKey: import.meta.env.VITE_PUBNUB_PUB_KEY,
    subscribeKey: import.meta.env.VITE_PUBNUB_SUB_KEY,
    uuid: `${STORAGE_PREFIX}_${v4()}`
});

// This Context provider is responsible for storing and managing state for the app
// initialization takes place here using some lifecycle methods
// convenience methods are created and provided to all components for interacting with the state
export const StateProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [state, setState] = useState<GlobalState>(DEFAULT_STATE)

    // declare some methods for interacting with the state via useCtx().
    const updateUsername = (name:string) => {
        // update the state (storage updates take place in useEffect)
        setState(s => ({ 
            ...s, 
            username: name?.length ? name : 'Anon'
        }))
        // update the pubnub uuid
        pubnub.setUUID(name ?? 'Anon')
    }

    const addChannel = (name:string) => {
        // prevent duplicate channels
        if (!name || name in state.channelMap) return
        setState(s => ({
            ...s, 
            activeChannel: name,
                channelMap: {
                ...s.channelMap,
                [name]: {
                    // users list should contain current user 
                    users: [pubnub.getUUID()],
                    messages: [],
                    text: '',
                }
        }}))
    }

    const leaveChannel = async (name: string) => {
        if (!(name in state.channelMap)) return
        delete state.channelMap[name]

        if (!(state.activeChannel in state.channelMap)){
            state.activeChannel = ''
        }
        setState({ ...state })
    }

    const deleteChannel = async (name: string) => {
        if (!(name in state.channelMap)) return
        console.log('>> deleteChannel | deleting channel:', name)
        try{

            await pubnub.deleteMessages({
                channel: name
            })
        await pubnub.objects.removeChannelMembers({
            channel: name,
            uuids: state.channelMap[name].users
        })
        delete state.channelMap[name]

        if (!(state.activeChannel in state.channelMap)) {
            state.activeChannel = ''
        }
        updateStorage(state)
        setState({ ...state })
        }catch(err){
            console.log('>> deleteChannel | error:', err)
        }
    }

    const setActiveChannel = (name:string) => {
        setState(s => ({ ...s, activeChannel: name, showChannelMenu: false }))
    }

    // insert new messages into the channels map
    const handleMessage = (event: MessageEvent) => {
        console.log('>> New message event:', event)
        setState(s => ({
            ...s,
            channelMap: {
                ...s.channelMap,
                [event.channel]: {
                    users: [],
                    messages: [...new Set([...s.channelMap[event.channel].messages, event])],
                    text: s.channelMap[event.channel].text,
                }
            }
        }))
    };

    // add or remove users from a channels user list on presence events
    const handlePresence = (event: PresenceEvent) => {
        console.log('>> New presence event:', `${event.uuid} ${event.action} ${event.channel}`)
        if(!event.channel || !Object.keys(state.channelMap) || typeof state.channelMap[event.channel] !== 'object') return
        setState(s => ({
            ...s,
            channelMap: {
                ...s.channelMap,
                [event.channel]: {
                    ...(s?.channelMap?.[event?.channel] ?? {}),
                    users: event.action !== 'join'
                        ? s.channelMap?.[event?.channel]?.users?.filter(id => event.uuid !== id) ?? []
                        : [...new Set([...s.channelMap[event.channel]?.users ?? [] , event.uuid])]
                }
            }
        }))
    };

    // publish a message to the current channel and add message to local state
    const sendMessage = async () => {
        console.log('>> Sending message:', state)
        const text = state?.channelMap?.[state?.activeChannel]?.text
        if (text && state.activeChannel) {
            await pubnub.publish({
                message: text,
                channel: state.activeChannel,
                storeInHistory: true
            })
                
            setState(s => ({
                ...s,
                channelMap: {
                    ...s.channelMap,
                    [s.activeChannel]: {
                        ...s.channelMap[s.activeChannel],
                        
                    }
                }
            }))
        }
    };

    // sets the current chat text into mapped state for continued messages
    const updateText = async (text:string) => {
        if (!state.activeChannel) return
        setState(s =>({
            ...s,
            channelMap: {
                ...s.channelMap,
                [state.activeChannel]: {
                    ...s.channelMap[state.activeChannel],
                    text
                }
            }
        }))
    }

    // get message history and present users
    const fetchHistory = async () => {
        // grab the channel names
        const keys = Object.keys(state.channelMap)
        // return if there is no channels or pn
        if(!pubnub || !keys.length) return
        console.log('>> fetching history for channels:', keys)

        // try to fetch channel history and add messages to channelMap
        try{
            const { channels } = await pubnub.fetchMessages({
                channels: keys,
                // includeMessageActions: true,
                // includeMeta: true
                
            })

            // using the callback is the only way to access the error message
            // pubnub.hereNow({
            //     channels: keys
            // }, (res, data) => {
            //     console.log('hereNow:', res, data)
            // })
            
            const { channels: hereData } = await pubnub.hereNow({
                channels: keys
            })
            // console.log('>> here now:', hereData)

            const history:Record<string, ChannelMapItem> = {}

            Object.entries(channels).forEach(([channel, data]) => {
                console.log('got history for channel:', channel, data)
                if (channel in history) {
                    history[channel].messages = data as MessageType[]
                }else{
                    history[channel] = {
                        ...state.channelMap[channel],
                        messages: data as MessageType[],
                    }
                }
            })

            Object.entries(hereData).forEach(([channel, data]) => {
                if (channel in history) {
                    console.log('updating history:', channel, data)
                    history[channel] = {
                        ...history[channel],
                        users: data.occupants.map(occ => occ.uuid) ?? []
                    }
                } else {
                    console.log('updating history:', channel, data)
                    history[channel] = {
                        ...state.channelMap[channel],
                        users: data.occupants.map(occ => occ.uuid) ?? [],
                    }
                }
            })
            setState(s => ({
                ...s,
                channelMap: {
                    ...s.channelMap,
                    ...history
                }
            }))
            
            console.log('>> history:', channels)
        }catch(err){
            console.log('>> error fetching history:', err)
        }
        
    }


    const toggleShowSetupModal = () => setState(s => ({ ...s, showSetupModal: !s.showSetupModal }))
    
    const toggleShowChannelMenu = () => setState(s => ({ ...s, showChannelMenu: !s.showChannelMenu }))

    const toggleShowChannelModal = () => setState(s => ({ ...s, showChannelModal: !s.showChannelModal }))
    
    const toggleShowUsernameModal = () => setState(s => ({ ...s, showUsernameModal: !s.showUsernameModal }))

    // stringify the state object and set to local storage, some derived state is calc here because its invoked on every state change
    const updateStorage = (customState?:GlobalState) => {
        const s = customState ?? state

        // if no username or default user, toggle showSetupModal to true
        s.showSetupModal = !s.username || s.username === DEFAULT_USER ? true : false;
        // update the contents of localStorage
        window?.localStorage.setItem(`${STORAGE_PREFIX}_state`, JSON.stringify(s))
        // update pubnub with the new username
        pubnub?.setUUID(s.username)
    }

    // steps are used to track a new users progress thru setting up their account
    const setStep = (step:number) => {
        setState(s => ({ ...s, step: step }))
    }

    // force reset the state for testing
    const resetState = () => {
        setState(DEFAULT_STATE)
        window?.localStorage.removeItem(`${STORAGE_PREFIX}_state`)
    }

    const init = () => {
        try {
            const loadedState = window?.localStorage?.getItem(`${STORAGE_PREFIX}_state`) ?? JSON.stringify(state) ?? '{}'
            const parsedState = JSON.parse(loadedState)
            console.log('>> setting loaded state:', parsedState)

            // toggle the setup modal on the first mount, also checked on storage update
            parsedState.showSetupModal = !parsedState.username || parsedState.username === DEFAULT_USER ? true : false;

            setState(parsedState)

            // join chat with link
            // grab the slug from the pathname, if it exists and join the channel
            const channelPath = window?.location?.pathname?.split('/')[1]
            if (channelPath && !parsedState.channelMap[channelPath]) {
                console.log('>> adding channel:', channelPath)
                addChannel(channelPath)
            }

        } catch (err) {
            resetState()
            console.log('|| INIT - error parsing channels from storage')
        }
    }


    // refetch channel history and subscribe when the activeChannel changes
    // useUpdateEffect is used to delay listener attachement until a channel is created or selected
    useUpdateEffect(() => {
        const listenerParams = { message: handleMessage, presence: handlePresence }
        pubnub.addListener(listenerParams);
        pubnub.subscribe({ channels: Object.keys(state.channelMap), withPresence: true });
        fetchHistory()
        return () => {
            resetState()
            pubnub.unsubscribe({ channels: Object.keys(state.channelMap) })
            pubnub.removeListener(listenerParams)
        }
    }, [state.activeChannel])


    useUpdateEffect(updateStorage, [state])
    
    // initialize the store and pubnub on first mount
    // load relevant data from localStorage
    useEffect(init, [])

    return (
        <StateContext.Provider value={{ 
            state, 
            // setState, // avoid using setState directly, use provided methods
            updateUsername,
            addChannel,
            leaveChannel,
            deleteChannel,
            setActiveChannel,
            sendMessage,
            updateText,
            toggleShowSetupModal,
            toggleShowChannelMenu,
            toggleShowChannelModal,
            toggleShowUsernameModal,
            setStep,

            resetState,
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useCtx = (): ContextProps => {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useCtx must be used within a StateProvider');
    }
    return context;
};
