import useAuthStore from "@/store/useAuthStore";
import type { UIMessage } from "@/types/message.types";
import { getMessageStatusIcon } from "@/utils/deriveMessageStatus";
import clsx from "clsx";
import { User } from "lucide-react";

interface MessageBubbleProps {
    message: UIMessage;
    isMine: boolean;
    senderName: string;
    senderAvatar?: string;
    time: string;
}

const MessageBubble = ({message, isMine, senderName, senderAvatar, time}: MessageBubbleProps) => {
    const currentUser = useAuthStore(state => state.currentUser);

    if(!currentUser) return null;

    const StatusIcon = getMessageStatusIcon(message.status);

    return(
        <div className={clsx("max-w-[80%] flex items-end gap-2", isMine ? "self-end" : "self-start")}>

                {!isMine && <div className="min-w-9 max-w-9 h-9 bg-primary text-primary-foreground rounded-full flex justify-center items-center">
                    {senderAvatar ? (
                        <img src={senderAvatar} alt={`${senderName}'s avatar`} className="w-full h-full rounded-full"/>
                    ) : (
                        <User size={15} />
                    )}
                </div>}

                <div className="flex flex-col space-y-1 group">
                    <p className={clsx("w-full py-3 px-5 text-sm rounded-full", isMine ? "rounded-br-none bg-primary text-primary-foreground" : "bg-muted text-foreground rounded-bl-none")}>{message.text}</p>

                    <div className={clsx("flex items-center gap-2", isMine ? "justify-end" : "justify-start")}>
                        {message.status !== "PENDING" && (
                            <time className="text-xs text-muted-foreground invisible group-hover:visible transition duration-500">{time}</time>
                        )}
                        {isMine && (
                            <span className={clsx("transition duration-300", message.status === "READ" && "text-primary")}><StatusIcon size={14} /></span>
                        )}
                    </div>
                </div>
            </div>
    )
}

export default MessageBubble;