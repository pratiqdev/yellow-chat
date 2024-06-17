
export interface ChannelMessage {
    channel: string;
    timetoken: string;
    message: string;
}

export interface FetchedMessage extends ChannelMessage {
    messageType?: number;
    uuid?: string;
}

export interface NewMessage extends ChannelMessage {
    subscription?: string;
    actualChannel?: string;
    subscribedChannel?: string;
    publisher?: string;
}

export type MessageType = FetchedMessage | NewMessage;

export type ChannelMapItem = {
    users: string[];
    messages: MessageType[];
    text: string;
}

export type GlobalState = {
    showSetupModal: boolean;
    showChannelMenu: boolean;
    showChannelModal: boolean;
    showUsernameModal: boolean;
    step: number;
    username: string;
    channelMap: Record<string, ChannelMapItem>;
    activeChannel: string;
}

export type ContextProps = {
    state: GlobalState;
    // setState: React.Dispatch<SetStateAction<GlobalState>>;
    updateUsername: (username:string) => void;
    addChannel: (name:string) => void;
    leaveChannel: (name: string) => void;
    deleteChannel: (name: string) => void;
    setActiveChannel: (name: string) => void;
    sendMessage: () => void;
    updateText: (text: string) => void;
    toggleShowSetupModal: () => void;
    toggleShowChannelMenu: () => void;
    toggleShowChannelModal: () => void;
    toggleShowUsernameModal: () => void;
    setStep: (step:number) => void;

    resetState: () => void;
}
