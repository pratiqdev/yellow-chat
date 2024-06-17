import { useState } from "react"
import { useCtx } from "@/lib/provider"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"


const UsernameModal: React.FC = () => {
    const { state, updateUsername, toggleShowUsernameModal } = useCtx()
    const [text, setText] = useState('')

    const update = () => {
        updateUsername(text)
        setText('')
        toggleShowUsernameModal()
    }

    if (!state) return <p>Loading...</p>

    return (
        <div className={cn(
        )}>
            
            <Dialog open={state.showUsernameModal} onOpenChange={toggleShowUsernameModal} >
                <DialogContent className="flex flex-col items-center w-auto bg-gray-200">
                    <h2 className="text-xl font-bold">Update your username</h2>
                    <p className="text-center text-md mb-2">Names can be changed at any time.
                    Try to pick something unique!</p>
                    <small className="text-sm">Signed in as <span className="font-medium">{state.username}</span></small>

                <Input placeholder='New username' id="username-modal-input" value={text} onChange={e => setText(e.target.value)} />
                <div className="flex gap-2 w-full">
                    <Button id="username-modal-cancel" className="w-full" variant="secondary" onClick={toggleShowUsernameModal}>Cancel</Button>
                    <Button id="username-modal-update" className="w-full" onClick={update}>Update</Button>
                </div>
                </DialogContent>
            </Dialog>
            
        </div>
    )
}
export default UsernameModal
