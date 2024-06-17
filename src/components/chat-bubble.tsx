import { useCtx } from "@/lib/provider";
import { FetchedMessage, MessageType, NewMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TimetokenUtils } from "@pubnub/chat";

export type ChatBubbleProps = { 
    item: MessageType
}
const ChatBubble: React.FC<ChatBubbleProps> = ({ item }) => {
    const { state } = useCtx()

    const user = (item as NewMessage).publisher ?? (item as FetchedMessage).uuid;
    const own = user === state.username

    return (
        <>
        <div key={item.timetoken} className={cn(
            "flex px-2", 
            own ? "justify-end" : "justify-start",
            
        )}>
            <div>
                
                <div className={cn(
                    "p-2 rounded-lg min-w-[8rem] border",
                    own ? "bg-gray-100" : "bg-white"
                )}>
                    <p className={cn("font-medium text-sm", own ? "text-right" : "text-left")}>{user}</p>
                    <div className="text-md">{item.message.split('</br>').map((line, i) => <p key={line + i}>{line}</p>)}</div>
                </div>
            <small className={cn("hidden lg:block text-gray-700 text-xs w-full w-full mb-2", own ? 'text-right' : 'text-left')}>{TimetokenUtils.timetokenToDate(item.timetoken).toLocaleTimeString()}</small>
            </div>
        </div>
            <small className="block lg:hidden text-gray-700 text-xs w-full w-full text-center mb-2">{TimetokenUtils.timetokenToDate(item.timetoken).toLocaleTimeString()}</small>
        </>
    )
}

export default ChatBubble