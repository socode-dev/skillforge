import clsx from "clsx";
import { ArrowRight, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useChatStore from "@/store/useChatStore";
import type { LastMessage } from "@/types/message.types";
import { getCreatedAtDate } from "@/utils/groupMessagesByDate";
import { formatTime } from "@/utils/formatTime";
import { useUserPresence } from "@/hooks/useUserPresence";
import { isUserOnline } from "@/utils/userPresence";

const MessageOverviewRow = ({
  message,
  isLast,
}: {
  message: LastMessage;
  isLast: boolean;
}) => {
  const navigate = useNavigate();
  const presence = useUserPresence(message.participantId);
  const online = isUserOnline(presence);

  return (
    <button
      type="button"
      onClick={() => navigate(`/home/messages/thread/${message.slug}`)}
      className={clsx(
        "w-full flex items-center gap-4 py-2 border-border text-left cursor-pointer",
        !isLast && "border-b-1"
      )}
    >
      <div className="relative w-11 h-11 shrink-0 bg-soft-primary text-primary rounded-full grid place-items-center">
        {message.senderDisplay.avatar ? (
          <img
            src={message.senderDisplay.avatar}
            alt={`${message.senderDisplay.name}'s avatar`}
            className="h-full w-full object-cover"
          />
        ) : (
          <User size={15} />
        )}
        <span
          className={clsx(
            "w-2 h-2 absolute top-0.5 right-0 rounded-full",
            online ? "bg-primary" : "bg-muted-foreground"
          )}
        ></span>
      </div>

      <div className="grow min-w-0 max-w-md">
        <h6 className="text-sm truncate">{message.senderDisplay.name}</h6>
        <p className="text-xs text-muted-foreground truncate">
          {message.text}
        </p>
      </div>

      <p className="text-xs text-muted-foreground whitespace-nowrap">
        {formatTime(message.createdAt)}
      </p>
    </button>
  );
};

const MessagesOverview = () => {
  const lastMessages = useChatStore((state) => state.lastMessages);
  const messages = Object.values(lastMessages)
    .sort(
      (a, b) =>
        getCreatedAtDate(b.createdAt).getTime() -
        getCreatedAtDate(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="bg-card text-card-foreground border-1 border-border rounded-radius-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />

          <span>Messages</span>
        </h5>

        <Link
          to={"/home/messages"}
          className="flex gap-2 items-center text-primary text-sm font-medium"
        >
          <span>View All</span>

          <ArrowRight size={15} />
        </Link>
      </div>

      <div>
        {!messages.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}

        {messages.map((message, i) => (
          <MessageOverviewRow
            key={message.chatId}
            message={message}
            isLast={i + 1 === messages.length}
          />
        ))}
      </div>
    </div>
  );
};

export default MessagesOverview;
