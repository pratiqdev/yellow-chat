import { useState } from "react";
import { useCtx } from "@/lib/provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stringToSlug } from "@/lib/utils";

const StepOne: React.FC = () => {
    const { state, updateUsername, setStep } = useCtx()
    const [username, setUsername] = useState(state.username)
    return (
        <div className="flex flex-col items-center" >
            <p className="text-xl">Enter your username</p>
            <p className="text-sm">Let others know who you are!</p>
            <Input id="step-1-input" className="text-center my-4" value={username} onChange={e => setUsername(e.target.value)} />
            <div className="flex justify-between w-full gap-4">
                {/* <Button id="step-1-close" className="w-full" variant="secondary" onClick={() => { updateUsername(username); setStep(3) }}>I'm ready!</Button> */}
                <Button id="step-1-next" className="w-full" onClick={() => { updateUsername(username); setStep(1) }}>Next</Button>
            </div>
        </div>
    )
}

const StepTwo: React.FC = () => {
    const { addChannel, setStep } = useCtx()
    const [channel, setChannel] = useState('chat')
    return (
        <div className="flex flex-col items-center" >
            <p className="text-xl">Add a channel</p>
            <p className="text-sm">Give you channel a unique name!</p>
            <Input id="step-2-input" className="text-center my-4" value={channel} onChange={e => setChannel(stringToSlug(e.target.value))} />
            <div className="flex justify-between w-full gap-4">
                <Button id="step-2-close" className="w-full" variant="secondary" onClick={() => { addChannel(channel); setStep(3) }}>I'm ready!</Button>
                <Button id="step-2-next" className="w-full" onClick={() => { addChannel(channel); setStep(2) }}>Next</Button>
            </div>
        </div>
    )
}
const StepThree: React.FC = () => {
    const { state, setStep } = useCtx()

    const copyLink = () => {
        window?.navigator?.clipboard?.writeText(`localhost:5173/${state.activeChannel}`)
    }

    return (
        <div className="flex flex-col items-center" >
            <p className="text-xl">Share the link</p>
            <p className="text-sm">or channel name for others to join!</p>
            <Input id="step-3-input" className="text-center my-4" defaultValue={state.activeChannel} onClick={copyLink} readOnly />

            <div className="flex justify-between w-full gap-4">
                <Button id="step-3-next" className="w-full" onClick={() => { copyLink(); setStep(3)}}>Let's go!</Button>
            </div>
        </div>
    )
}
export const SetupModal = () => {
    const { state, setStep } = useCtx()

    return (
        <Dialog open={state.step <= 2} onOpenChange={() => setStep(3)} >
            <DialogContent className="flex flex-col items-center w-auto bg-gray-200">
                <h2 className="text-3xl font-bold"><span className="text-yellow-400">Yellow</span>Chat</h2>
                <p className="text-center text-lg mb-2">Simple real-time chat app<br/>
                built with PubNub and React</p>
                
                {state.step === 0 && <StepOne />}
                {state.step === 1 && <StepTwo />}
                {state.step === 2 && <StepThree />}
            </DialogContent>
        </Dialog>
    )
}
