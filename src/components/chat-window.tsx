import { useCtx } from "@/lib/provider";
import { Button } from "./ui/button";
import { MoreHorizontal, Send, Plus } from "lucide-react";
import InputEmoji from 'react-input-emoji'
import { lazy, Suspense } from 'react'

const ChatBubble = lazy(() => import("@/components/chat-bubble"))


const ChatWindow: React.FC = () => {
    const { state, updateText, sendMessage, toggleShowChannelMenu, toggleShowChannelModal, toggleShowUsernameModal } = useCtx()

    // tell the user to create a chat, if they have none
    if(!state.activeChannel || !Object.keys(state.channelMap).length) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-xl font-medium">Nothing here...</p>
            <p className="text-md flex items-center gap-2 mb-6">Create a channel to start chatting!</p>
            <Button onClick={toggleShowChannelModal} className="flex gap-2">Create a channel <Plus size="16"/></Button>
        </div>
    )

    // create some awful chaining to handle undefined activeChannel (hacky)
    const { messages } = state?.channelMap?.[state?.activeChannel] ?? {
        text: '', messages: [], users: []
    }

    return (
        <div className="w-full pr-2 h-[calc(100vh-1rem)] flex flex-col">
            <div className="flex justify-between h-14 items-center">
                <p id="chat-window-channel-name" className="text-lg font-medium w-full ml-2">#{state.activeChannel}</p>
                <div className="flex items-center gap-2">
                    <Button id="chat-window-open-user-modal" onClick={toggleShowUsernameModal} variant="ghost" className="flex items-center whitespace-nowrap ">Signed in as <span id="chat-window-current-user" className="font-bold ml-[.4em]">{state.username}</span></Button>
                    <Button className="flex lg:hidden" size="icon" variant="ghost" onClick={() => toggleShowChannelMenu()}>
                        <MoreHorizontal />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col flex-1  overflow-auto" >
                {messages?.length
                    ? messages.map(item => 
                        <Suspense key={item.timetoken} fallback={<p>Loading content...</p>}>
                            <ChatBubble key={item.timetoken} item={item} />
                        </Suspense>
                    )
                    : null
                }
            </div>
            <div className="flex items-center gap-2">
            <InputEmoji value={state?.channelMap?.[state?.activeChannel]?.text ?? ''} onChange={v => updateText(v)} shouldReturn shouldConvertEmojiToImage={false} borderRadius={6} borderColor={''}/>
            <Button size="icon" variant="ghost" onClick={() => sendMessage()}><Send className="text-gray-500" /></Button>
            </div>
        </div>
    )
}
export default ChatWindow