import clsx from "clsx";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import useRequestsStore from "@/store/useRequestsStore";
import useAuthStore from "@/store/useAuthStore";
import { colors } from "@/data/colors";
import type { SkillDataType } from "@/store/useUsersAndSkillsStore";
import useUsersAndSkillsStore from "@/store/useUsersAndSkillsStore";
import { Users } from "lucide-react";

interface SkillCardProps {
  skill: SkillDataType;
  className?: string;
  size?: string;
}

const generateInitialIcon = (name: string) => {
  if (!name) return "";

  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-radius text-xl font-semibold shadow-lg",
        randomColor
      )}
    >
      {firstLetter}
    </div>
  );
};

const SkillCard = ({
  skill,
  className,
  size = "w-68 h-auto",
}: SkillCardProps) => {
  const { currentUser } = useAuthStore();
  const { disablebutton } = useUsersAndSkillsStore();
  const {
    skillRequests,
    getSkillRequestButtonChildren,
    onSendRequest,
    loading,
  } = useRequestsStore();

  if (!currentUser) return;

  const skillRequestStatus = skillRequests.find(
    (s) => s.skillId === skill.skillId
  )?.status;

  const { text: buttonText, icon: ButtonIcon } =
    getSkillRequestButtonChildren(skillRequestStatus);

  const requestData = {
    skillId: skill.skillId,
    skillName: skill.skillName,
    skillDesc: skill.skillDesc,

    owner: {
      userId: skill.ownerId,
      name: skill.ownerName,
      role: skill.ownerRole,
      avatar: skill.ownerAvatar,
    },

    requester: {
      userId: currentUser.profile.userId,
      name: currentUser.profile.name,
      role: currentUser.profile.role,
      avatar: currentUser.profile.avatar,
    },
  };

  const isButtonDisabled = disablebutton(skillRequestStatus);

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
      {generateInitialIcon(skill.skillName)}

      <h4 className="my-2">{skill.skillName}</h4>

      <p className="grow text-sm text-muted-foreground">{skill.skillDesc}</p>

      <div className="flex justify-between items-center gap-4 mt-4">
        <p className="flex gap-2 text-xs text-muted-foreground">
          <Users size={15} />
          <span>
            {skill.learnersCount}{" "}
            {skill.learnersCount === 1 ? "learner" : "learners"}
          </span>
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={() => onSendRequest(requestData)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          isDisabled={isButtonDisabled}
          className="flex items-center py-2 gap-2 text-sm font-semibold"
        >
          {loading.isRequesting[skill.skillId] ? (
            "Requesting..."
          ) : (
            <>
              <ButtonIcon size={18} />
              <span>{buttonText}</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
