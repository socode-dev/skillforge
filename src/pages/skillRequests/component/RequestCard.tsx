import {
  CheckCircle2Icon,
  CircleAlert,
  CircleX,
  Clock,
  Palette,
  User,
  type LucideIcon,
} from "lucide-react";
import { colors } from "@/data/colors";
import clsx from "clsx";
import CardButton from "@/pages/skillRequests/component/CardButton";
import { formatTime } from "@/utils/formatTime";
import useAuthStore from "@/store/useAuthStore";
import type { RequestStatus } from "@/store/useRequestsStore";
import type { Timestamp } from "firebase/firestore";

interface RequestType {
  requestId: string;
  skillId: string;
  skillName: string;
  skillDesc: string;
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ownerUserId: string;
  requesterUserId: string;
  name: string;
  role: string;
  avatar: string | undefined;
}

interface StatusContentType {
  PENDING: { colors: string; icon: LucideIcon };
  ACCEPTED: { colors: string; icon: LucideIcon };
  COMPLETED: { colors: string; icon: LucideIcon };
  CANCELLED: { colors: string; icon: LucideIcon };
  DECLINED: { colors: string; icon: LucideIcon };
}

const statusContent: StatusContentType = {
  PENDING: { colors: "bg-amber-300/20 text-amber-600", icon: CircleAlert },
  ACCEPTED: {
    colors: "bg-green-300/20 text-green-800",
    icon: CheckCircle2Icon,
  },
  COMPLETED: {
    colors: "bg-green-300/20 text-green-800",
    icon: CheckCircle2Icon,
  },
  DECLINED: { colors: "bg-red-300/20 text-red-800", icon: CircleX },
  CANCELLED: { colors: "bg-red-300/20 text-red-800", icon: CircleX },
};

const RequestCard = ({ request }: { request: RequestType }) => {
  const { currentUser } = useAuthStore();
  const isIncoming =
    request.ownerUserId === currentUser?.profile.userId &&
    request.requesterUserId !== currentUser.profile.userId;

  const requestType = isIncoming ? "incoming" : "outgoing";

  const Icon: LucideIcon =
    statusContent[request.status as keyof typeof statusContent].icon;

  const randomColor: string = colors[Math.floor(Math.random() * colors.length)];

  const acceptRequestData = {
    ownerUserId: request.ownerUserId,
    requesterUserId: request.requesterUserId,
    skillId: request.skillId,
    skillName: request.skillName
  }
  
  
  return (
    <figure className="w-full py-5 px-3 bg-card text-card-foreground border-l-4 border-primary rounded-radius-xl flex gap-4 shadow relative overflow-hidden">
      <div className="absolute -right-20 top-12 bg-accent/5 w-30 h-30 rounded-full" />

      <div className="h-14 w-14 rounded-full bg-soft-primary border-2 border-accent/20 text-primary p-0.5 flex justify-center items-center">
        {request.avatar ? (
          <img
            src={request.avatar}
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
            <h3 className="text-base">{request.name}</h3>
            <p
              className={clsx(
                "w-fit mt-1 text-xs text-muted-foreground",
                requestType === "incoming" &&
                  `${randomColor} py-0.5 px-3 rounded-full`
              )}
            >
              {request.role}
            </p>
          </div>

          {requestType === "outgoing" && (
            <p
              className={clsx(
                "flex gap-1.5 items-center py-1 px-3 rounded-full text-[0.65em]",
                statusContent[request.status as keyof typeof statusContent]
                  .colors
              )}
            >
              <Icon size={12} />
              <span>{request.status}</span>
            </p>
          )}
        </div>

        <div className="w-full p-2 bg-accent/5 rounded-radius flex gap-2 mt-3">
          <Palette size={15} className="text-primary" />

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {requestType === "incoming" ? "Wants to learn" : "Learning"}
            </p>
            <p className="text-sm text-primary">{request.skillName}</p>
          </div>
        </div>

        <time className="flex items-center gap-1.5 text-xs text-muted-foreground my-4">
          <Clock size={14} />{" "}
          <span>{formatTime(request.updatedAt)}</span>
        </time>

        <CardButton
          status={request.status}
          type={requestType}
          requestId={request.requestId}
          acceptRequestData={acceptRequestData}
        />
      </figcaption>
    </figure>
  );
};

export default RequestCard;
