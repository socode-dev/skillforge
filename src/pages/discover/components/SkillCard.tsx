import clsx from "clsx";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  RotateCcw,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import type { SkillsFeedDataType } from "../../../lib/buildDiscoverFeeds";
import useRequestsStore, {
  type SkillRequests,
} from "../../../store/useRequestsStore";
import useAuthStore from "../../../store/useAuthStore";
import { colors } from "../../../data/colors";
import { v4 as uuidV4 } from "uuid";

const generateInitialIcon = (name: string) => {
  if (!name) return "";

  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={clsx(
        "w-12 h-12 flex items-center justify-center rounded-radius text-xl font-semibold shadow-lg",
        randomColor
      )}
    >
      {firstLetter}
    </div>
  );
};

const SkillCard = ({
  data,
  className,
  size = "w-68 h-auto",
}: {
  data: SkillsFeedDataType;
  className?: string;
  size?: string;
}) => {
  const { currentUser } = useAuthStore();
  const { handleSendSkillRequest, skillRequests } = useRequestsStore();

  if (!currentUser) return;

  const requestData: SkillRequests = {
    docID: uuidV4(),
    skillID: data.skillID,
    skillName: data.skillName,
    incomingUserID: data.ownerID,
    incomingUserRole: data.role,
    incomingUserName: data.name,
    incomingUserAvatar: data.avatar,
    outgoingUserID: currentUser.uid,
    outgoingUserName: currentUser.name,
    outgoingUserRole: currentUser.role,
    outgoingUserAvatar: currentUser.avatar,
    status: "pending",
    type: "outgoing",
    time: Date.now(),
  };

  const skillRequestStatus = skillRequests.find(
    (skill) => skill.skillName === data.skillName
  )?.status;

  const handleClick = () => {
    if (skillRequestStatus === "accepted") {
      console.log("Message");
    } else if (skillRequestStatus === "pending") {
      return;
    } else {
      handleSendSkillRequest(requestData);
    }
  };

  let isButtonDisabled: boolean;
  let buttonMessage:
    | "Request"
    | "Requested"
    | "Message"
    | "Request Again"
    | "Completed";
  let ButtonIcon: LucideIcon;

  switch (skillRequestStatus) {
    case "pending":
      isButtonDisabled = true;
      break;
    case "completed":
      isButtonDisabled = true;
      break;
    default:
      isButtonDisabled = false;
  }

  switch (skillRequestStatus) {
    case "pending":
      buttonMessage = "Requested";
      ButtonIcon = Clock;
      break;
    case "accepted":
      buttonMessage = "Message";
      ButtonIcon = MessageCircle;
      break;
    case "declined":
      buttonMessage = "Request Again";
      ButtonIcon = RotateCcw;
      break;
    case "completed":
      buttonMessage = "Completed";
      ButtonIcon = CheckCircle2;
      break;
    default:
      buttonMessage = "Request";
      ButtonIcon = Send;
  }

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "flex flex-col bg-card text-card-foreground p-4 border-border border-1 rounded-radius-xl",
        className,
        size
      )}
    >
      {generateInitialIcon(data.skillName)}

      <h4 className="my-2">{data.skillName}</h4>

      <p className="grow text-sm text-muted-foreground">{data.skillDesc}</p>

      <div className="flex justify-between items-center gap-4 mt-4">
        <p className="flex gap-2 text-xs text-muted-foreground">
          <Users size={15} />
          <span>
            {data.skillLearners}{" "}
            {data.skillLearners === 1 ? "learner" : "learners"}
          </span>
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          isDisabled={isButtonDisabled}
          className="flex items-center py-2 gap-2 text-sm font-semibold"
        >
          <ButtonIcon size={18} />
          <span>{buttonMessage}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
