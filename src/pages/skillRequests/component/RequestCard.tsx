import {
  CheckCircle2Icon,
  CircleAlert,
  CircleX,
  Clock,
  Palette,
  User,
  type LucideIcon,
} from "lucide-react";
import { colors } from "../../../data/colors";
import clsx from "clsx";
import CardButton from "./CardButton";
import { formatTimeDistance } from "../../../utils/formatTimeDistance";
import type { SkillRequests } from "../../../store/useRequestsStore";

interface RequestType extends Pick<SkillRequests, "status" | "type"> {
  skillID: string;
  skillName: string;
  userID: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  time: number;
}

interface StatusContentType {
  pending: { colors: string; icon: LucideIcon };
  accepted: { colors: string; icon: LucideIcon };
  declined: { colors: string; icon: LucideIcon };
}

const statusContent: StatusContentType = {
  pending: { colors: "bg-amber-300/20 text-amber-600", icon: CircleAlert },
  accepted: {
    colors: "bg-green-300/20 text-green-800",
    icon: CheckCircle2Icon,
  },
  declined: { colors: "bg-red-300/20 text-red-800", icon: CircleX },
};

const RequestCard = ({ request }: { request: RequestType }) => {
  const Icon: LucideIcon =
    statusContent[request.status as keyof typeof statusContent].icon;

  const randomColor: string = colors[Math.floor(Math.random() * colors.length)];
  return (
    <figure className="w-full py-5 px-3 bg-card text-card-foreground border-l-4 border-primary rounded-radius-xl flex gap-4 shadow relative overflow-hidden">
      <div className="absolute -right-20 top-12 bg-accent/5 w-30 h-30 rounded-full" />

      <div className="h-14 w-14 rounded-full bg-soft-primary border-2 border-accent/20 text-primary p-0.5 flex justify-center items-center">
        {request.userAvatar ? (
          <img
            src={request.userAvatar}
            alt="User avatar"
            className="w-full h-full object-fill rounded-full"
          />
        ) : (
          <User size={25} />
        )}
      </div>

      <figcaption className="grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base">{request.userName}</h3>
            <p
              className={clsx(
                "w-fit mt-1 text-xs text-muted-foreground",
                request.type === "incoming" &&
                  `${randomColor} py-0.5 px-3 rounded-full`
              )}
            >
              {request.userRole}
            </p>
          </div>

          {request.type === "outgoing" && (
            <p
              className={clsx(
                "flex gap-1.5 items-center py-1 px-3 rounded-full text-[0.65em]",
                statusContent[request.status as keyof typeof statusContent]
                  .colors
              )}
            >
              <Icon size={12} />
              <span>{request.status.toUpperCase()}</span>
            </p>
          )}
        </div>

        <div className="w-full p-2 bg-accent/5 rounded-radius flex gap-2 mt-3">
          <Palette size={15} className="text-primary" />

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {request.type === "incoming" ? "Wants to learn" : "Learning"}
            </p>
            <p className="text-sm text-primary">{request.skillName}</p>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground my-4">
          <Clock size={14} /> <span>{formatTimeDistance(request.time)}</span>
        </p>

        <CardButton
          status={request.status}
          type={request.type}
          skillID={request.skillID}
          skillName={request.skillName}
          incomingUserID={request.userID}
        />
      </figcaption>
    </figure>
  );
};

export default RequestCard;
