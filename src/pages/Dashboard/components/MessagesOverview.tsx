import clsx from "clsx";
import { ArrowRight, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

interface MessagesDataType {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  isActive: boolean;
}

const messagesData: MessagesDataType[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    lastMessage: "Thanks for the React lesson! Really helpful.",
    time: "5m ago",
    isActive: true,
  },
  {
    id: 2,
    name: "Alex Chen",
    lastMessage: "Can we schedule our next session for tomorrow?",
    time: "1h ago",
    isActive: true,
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    lastMessage: "I've prepared the materials for our next lesson.",
    time: "3h ago",
    isActive: false,
  },
];

const MessagesOverview = () => {
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
        {messagesData.map((data, i) => (
          <div
            key={data.id}
            className={clsx(
              "flex items-center gap-4 py-2 border-border",
              i + 1 !== messagesData.length && "border-b-1"
            )}
          >
            <div className="relative w-fit h-fit p-3 bg-soft-primary text-primary rounded-full">
              <User size={15} />
              {data.isActive && (
                <span className="w-2.5 h-2.5 absolute top-0.5 right-0 bg-primary rounded-full border-2 border-background"></span>
              )}
            </div>

            <div className="grow min-w-0 max-w-md">
              <h6 className="text-sm truncate">{data.name}</h6>
              <p className="text-xs text-muted-foreground truncate">
                {data.lastMessage}
              </p>
            </div>

            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {data.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesOverview;
