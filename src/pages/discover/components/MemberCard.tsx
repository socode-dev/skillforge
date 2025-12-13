import { MessageCircle, UserPlus } from "lucide-react";
import Button from "../../../components/ui/Button";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { UsersFeedDataType } from "../../../lib/buildDiscoverFeeds";
import useRequestsStore, {
  type InvitationData,
} from "../../../store/useRequestsStore";
import useAuthStore from "../../../store/useAuthStore";

interface MemberCardProps {
  user: UsersFeedDataType;
  index: number;
}

const getInitial = (value: string) => {
  if (!value) return "";

  const splittedValue = value.split(" ");
  const firstLetterCap = splittedValue.map((value) =>
    value.slice(0, 1).toUpperCase()
  );

  return firstLetterCap.join("");
};

const MemberCard = ({ user, index }: MemberCardProps) => {
  const { currentUser } = useAuthStore();
  const { handleSendInvitation, invitations } = useRequestsStore();

  const isInvitationSent = invitations.find(
    (invite) => invite.receiverID === user.id
  );

  if (!currentUser) return;

  const invitationData: InvitationData = {
    receiverID: user.id,
    requesterID: currentUser.uid,
    requesterName: user.name,
    requesterRole: user.role,
    requesterAvatar: user.avatar,
    status: "pending",
    type: "outgoing",
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-card text-card-foreground p-4 border-1 border-border rounded-radius-xl"
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 flex justify-center items-center bg-soft-primary text-primary rounded-full">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name} avatar`}
              className="w-full h-full rounded-full"
            />
          ) : (
            <p>{getInitial(user.name)}</p>
          )}
        </div>

        <div>
          <h4 className={clsx(index % 2 && "text-lg font-semibold")}>
            {user.name}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">{user.role}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {user.skills.map((skill) => (
          <p
            key={skill.id}
            className="py-1 px-4 bg-muted text-muted-foreground text-xs rounded-full"
          >
            {skill.skillName}
          </p>
        ))}
      </div>

      <div className="w-full flex gap-4 mt-4">
        <Button
          type="button"
          onClick={() => handleSendInvitation(invitationData)}
          isDisabled={!!isInvitationSent}
          variant="primary"
          className="grow flex justify-center items-center gap-2 text-sm font-semibold"
        >
          {isInvitationSent ? (
            "Pending"
          ) : (
            <>
              <UserPlus size={15} />
              <span>Connect</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => console.log(`Message ${user.name}`)}
          type="button"
          variant="outline"
        >
          <MessageCircle />
        </Button>
      </div>
    </motion.div>
  );
};

export default MemberCard;
