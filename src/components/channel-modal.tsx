import { useState } from "react"
import { useCtx } from "@/lib/provider"
import { Dialog, DialogContent } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { stringToSlug } from "@/lib/utils"

const ChannelModal: React.FC = () => {
    const { state, addChannel, toggleShowChannelModal } = useCtx()
    const [text, setText] = useState('')

    const update = () => {
        addChannel(text)
        setText('')
        toggleShowChannelModal()
    }

    return (
        <Dialog open={state.showChannelModal} onOpenChange={() => {}} >
            <DialogContent className="flex flex-col items-center w-auto bg-gray-200">
                <h2 className="text-xl font-bold">Create or join a channel</h2>
                <p className="text-center text-md mb-2">Channels can be added or removed at any time.<br />
                    Paste the name of an existing channel to join</p>

                <Input id="channel-modal-input" placeholder='Channel name' value={text} onChange={e => setText(stringToSlug(e.target.value))} />
                <div className="flex gap-2 w-full">
                    <Button id="channel-modal-cancel" className="w-full" variant="secondary" onClick={toggleShowChannelModal}>Cancel</Button>
                    <Button id="channel-modal-update" className="w-full" onClick={update}>Add channel</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChannelModal