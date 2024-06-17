import { useCtx } from "@/lib/provider"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { lazy, Suspense } from 'react'

const ChannelItem = lazy(() => import("@/components/channel-item"))

const ChannelList: React.FC = () => {
    const { state, toggleShowChannelMenu, toggleShowChannelModal, resetState } = useCtx()

    if (!state) return <p>Loading...</p>

    return (
        <div className={cn(
            "z-10 p-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] lg:w-[24rem] transition-ease duration-200 bg-yellow-100 border border-yellow-200 rounded-lg",
            "absolute lg:relative",
            "translate-x-[-110%] lg:translate-x-[0]",
            state.showChannelMenu && "translate-x-[0]"
        )}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Channels</h3>
                <div className="flex items-center gap-2">
                    <Button id="channel-list-open-channel-modal" onClick={toggleShowChannelModal} className="flex gap-2">Create a channel <Plus size="16" /></Button>

                    <Button className="flex lg:hidden" size="icon" onClick={toggleShowChannelMenu}><X size="18"/></Button>
                </div>
            </div>
            <div id="channel-list-list-container" className="h-[calc(90%)]">
                {!Object.keys(state.channelMap)?.length 
                    ? <p>No channels!</p> 
                    : Object.entries(state.channelMap)
                    .map(([channel, item]) => 
                        <Suspense key={channel} fallback={<p>Loading channel...</p>}>
                            <ChannelItem channel={channel} item={item} />
                        </Suspense>
                    )
                }
            </div>
            <Button variant="secondary" onClick={resetState}>Delete data</Button>
            
        </div>
    )
}
export default ChannelList
