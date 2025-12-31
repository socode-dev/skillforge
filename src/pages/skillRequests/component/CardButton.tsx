import Button from "../../../components/ui/Button";
import useRequestsStore, {
  type SkillRequests,
} from "../../../store/useRequestsStore";

interface CardButtonProps
  extends Pick<SkillRequests, "status" | "type" | "skillName"> {
  skillID: string;
  incomingUserID: string;
}

const CardButton = ({
  status,
  type,
  skillID,
  skillName,
  incomingUserID,
}: CardButtonProps) => {
  const {
    handleCancelRequest,
    handleDeclineRequest,
    handleAcceptSkillRequest,
  } = useRequestsStore();

  if (type === "incoming") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={() =>
            handleAcceptSkillRequest(skillID, skillName, incomingUserID)
          }
          type="button"
          variant="primary"
          className="text-sm sm:text-base"
        >
          Accept
        </Button>
        <Button
          onClick={() => handleDeclineRequest(skillID, incomingUserID)}
          type="button"
          variant="outline"
          className="text-sm sm:text-base text-muted-foreground"
        >
          Decline
        </Button>
      </div>
    );
  } else if (type === "outgoing" && status === "pending") {
    return (
      <Button
        type="button"
        onClick={() => handleCancelRequest(skillID, incomingUserID)}
        variant="outline"
        className="w-full text-sm sm:text-base"
      >
        Cancel Request
      </Button>
    );
  } else if (type === "outgoing" && status === "accepted") {
    return (
      <Button
        type="button"
        onClick={() => console.log("Message", incomingUserID)}
        variant="outline"
        className="w-full"
      >
        Message
      </Button>
    );
  } else {
    return null;
  }
};

export default CardButton;
