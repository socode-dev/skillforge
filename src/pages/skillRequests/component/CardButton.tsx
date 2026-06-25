import type { SkillRequest } from "@/store/useRequestsStore";
import Button from "@/components/ui/Button";
import useRequestsStore from "@/store/useRequestsStore";
import { useNavigate } from "react-router-dom";
import SkillCompletionAction from "@/components/skillRequest/SkillCompletionAction";
import useAuthStore from "@/store/useAuthStore";

interface CardButtonProps extends Pick<SkillRequest, "status" | "requestId"> {
  completionStatus?: SkillRequest["completionStatus"];
  acceptRequestData: {
    ownerUserId: string;
    requesterUserId: string;
    skillId: string;
    skillName: string;
  }
  type: "incoming" | "outgoing";
}

const CardButton = ({
  status,
  type,
  requestId,
  completionStatus,
  acceptRequestData,
}: CardButtonProps) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const {
    onCancelRequest,
    onDeclineRequest,
    onAcceptRequest,
    loading,
  } =
    useRequestsStore();
  const completionRequest = {
    requestId,
    skillName: acceptRequestData.skillName,
    status,
    completionStatus,
    owner: {
      userId: acceptRequestData.ownerUserId,
    },
    requester: {
      userId: acceptRequestData.requesterUserId,
    },
  };

  if (type === "incoming" && status === "PENDING") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={() => onAcceptRequest({requestId, ...acceptRequestData})}
          type="button"
          variant="primary"
          className="text-sm sm:text-base"
        >
          {loading.isAccepting[requestId] ? "Accepting..." : "Accept"}
        </Button>
        <Button
          onClick={() => onDeclineRequest(requestId)}
          type="button"
          variant="outline"
          className="text-sm sm:text-base text-muted-foreground"
        >
          {loading.isDeclining[requestId] ? "Declining..." : "Decline"}
        </Button>
      </div>
    );
  } else if (
    type === "incoming" &&
    status === "ACCEPTED" &&
    completionStatus === "REQUESTED"
  ) {
    return (
      <SkillCompletionAction
        request={completionRequest}
        currentUserId={currentUser?.profile.userId}
      />
    );
  } else if (type === "outgoing" && status === "PENDING") {
    return (
      <Button
        type="button"
        onClick={() => onCancelRequest(requestId)}
        variant="outline"
        className="w-full text-sm sm:text-base"
      >
        {loading.isCancelling[requestId] ? "Cancelling..." : "Cancel Request"}
      </Button>
    );
  } else if (type === "outgoing" && status === "ACCEPTED") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={() => navigate("/home/messages")}
          variant="outline"
          className="text-sm sm:text-base"
        >
          Message
        </Button>
        <SkillCompletionAction
          request={completionRequest}
          currentUserId={currentUser?.profile.userId}
          className="text-sm sm:text-base"
        />
      </div>
    );
  } else {
    return null;
  }
};

export default CardButton;
