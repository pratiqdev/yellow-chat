import { useCtx } from "@/lib/provider"
import { ChannelMapItem } from "@/lib/types"
import { Trash2, LogOut, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { truncateText } from "@/lib/utils"

export type ChannelItemProps = { 
    channel: string, 
    item: ChannelMapItem 
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel, item }) => {
    const { leaveChannel, deleteChannel, setActiveChannel } = useCtx()
    return (
        <div className="mb-2">
            <div className="flex items-center">
                <p className="flex-1 font-medium w-full">#{truncateText(channel)}</p>
                <div>
                    <Button id="channel-item-delete" size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteChannel(channel)}><Trash2 size="18" /></Button>
                    <Button id="channel-item-leave" size="icon" variant="ghost" className="h-8 w-8" onClick={() => leaveChannel(channel)}><LogOut size="18" /></Button>
                    <Button id="channel-item-activate" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setActiveChannel(channel)}><ArrowRight size="18" /></Button>
                </div>
            </div>
            <p className="text-xs">{item.users.length} users</p>
        </div>
    )
}
export default ChannelItem