import ThreadHeader from "@/pages/messages/components/ThreadHeader";
import ThreadConversation from "@/pages/messages/components/ThreadConversation";
import ThreadInput from "@/pages/messages/components/ThreadInput";

const ChatThread = () => {

    return(
        <main className="relative h-[100dvh] overflow-hidden">
            <ThreadHeader />
            <ThreadConversation />
            <ThreadInput />
        </main>
    )
}

export default ChatThread;