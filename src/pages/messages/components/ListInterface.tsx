import type { LastMessage } from "@/types/message.types";
import { User } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { getMessageStatusIcon } from "@/utils/deriveMessageStatus";
import clsx from "clsx";

const ListInterface = ({lastMessage}: {lastMessage: LastMessage}) => {
  const navigate = useNavigate();
  const {currentUser} = useAuthStore();
  const {slug, senderId, senderDisplay, text, createdAt, unreadCount, status} = lastMessage;
  
  if (!currentUser) return null;
  const newMessageCount = unreadCount?.[currentUser.profile.userId] ?? 0;
  
  const StatusIcon = getMessageStatusIcon(status);

  const isLastMessageMine = senderId === currentUser.profile.userId;

    return (
        <fieldset
        onClick={() => navigate(`/home/messages/thread/${slug}`)}
          role="button"
          className="w-full flex gap-2.5 bg-muted/20 border-t-1 border-b-1 border-border py-4 px-6 md:px-8 cursor-pointer hover:bg-muted/35 transition"
        >
          <div className="relative min-w-13 max-w-13 h-13 max-h-13 flex justify-center items-center bg-primary text-primary-foreground rounded-full">
            {senderDisplay?.avatar ? (
              <img src={senderDisplay?.avatar} alt={`${senderDisplay?.name}'s avatar`} className="w-full h-full rounded-full" />
            ) : (
            <User size={25} />
            )}       
            <span className="w-3 h-3 absolute bottom-1 -right-0.5 bg-green-500 rounded-full border-2 border-background"></span>
          </div>

          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-sm font-semibold">{senderDisplay?.name}</h3>
              <time className="text-xs text-muted-foreground">{formatTime(createdAt)}</time>
            </div>

            <div className="w-full flex justify-between items-center mt-0.5">
              <p className="text-xs text-muted-foreground">{senderDisplay?.role}</p>
              {newMessageCount > 0 && (<span className="min-w-4 h-4 grid place-items-center text-xs bg-primary text-primary-foreground rounded-full">
                {newMessageCount}
              </span>)}
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              {isLastMessageMine && (
                <StatusIcon size={13} className={clsx("text-muted-foreground", status === "READ" && "text-primary", status === "FAILED" && "text-destructive")}/>
              )}
              <p className="text-xs text-foreground">{text}</p>
              </div>
          </div>

        </fieldset>
    )
}

export default ListInterface;