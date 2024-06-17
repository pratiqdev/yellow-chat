import { StateProvider } from "@/lib/provider";
import { SetupModal } from "@/components/setup-modal";
import { lazy, Suspense } from "react";
import './index.css'

const ChannelList = lazy(() => import("@/components/channel-list"))
const ChannelModal = lazy(() => import("@/components/channel-modal"))
const ChatWindow = lazy(() => import("@/components/chat-window"))
const UsernameModal = lazy(() => import("@/components/username-modal"))


const App = () => {
    return (
        <>

        <div className="flex w-screen p-2 gap-2">

            <StateProvider>
                <SetupModal />

                <Suspense fallback={<p>Loading channels...</p>}>
                    <ChannelList />
                </Suspense>
                
                <Suspense fallback={<p>Loading chat...</p>}>
                    <ChatWindow /> 
                </Suspense>
                
                <Suspense fallback={<p>Loading modal...</p>}>
                    <UsernameModal />
                </Suspense>

                <Suspense fallback={<p>Loading modal...</p>}>
                    <ChannelModal />
                </Suspense>

            </StateProvider>
        </div>
        </>
    )
}

export default App