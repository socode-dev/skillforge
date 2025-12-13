import clsx from "clsx";
import { Send, Users } from "lucide-react";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import type { SkillsFeedDataType } from "../../../lib/buildDiscoverFeeds";
import useRequestsStore, {
  type SkillRequests,
} from "../../../store/useRequestsStore";
import useAuthStore from "../../../store/useAuthStore";

const colors: string[] = [
  "bg-red-500/10  text-red-500 shadow-red-500/10",
  "bg-blue-500/10 text-blue-500 shadow-blue-500/10",
  "bg-yellow-500/10 text-yellow-500 shadow-yellow-500/10",
  "bg-purple-500/10 text-purple-500 shadow-purple-500/10",
  "bg-pink-500/10 text-pink-500 shadow-pink-500/10",
  "bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10",
  "bg-amber-500/10 text-amber-500 shadow-amber-500/10",
  "bg-gray-500/10 text-gray-500 shadow-gray-500/10",
  "bg-violet-500/10 text-violet-500 shadow-violet-500/10",
  "bg-rose-500/10 text-rose-500 shadow-rose-500/10",
  "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10",
  "bg-orange-500/10 text-orange-500 shadow-orange-500/10",
];

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
    receiverID: data.ownerID,
    requesterID: currentUser?.uid,
    skillID: data.skillID,
    skillName: data.skillName,
    requesterRole: data.role,
    requesterName: data.name,
    requesterAvatar: data.avatar,
    status: "pending",
    type: "outgoing",
  };

  const isSkillRequested = skillRequests.find(
    (skill) => skill.skillID === data.skillID
  );

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
          <span>{data.skillLearners} learners</span>
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={() => handleSendSkillRequest(requestData)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          isDisabled={!!isSkillRequested}
          className="flex items-center py-2 gap-2 text-sm font-semibold"
        >
          <Send size={18} />
          <span>{isSkillRequested ? "Requested" : "Request"}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
