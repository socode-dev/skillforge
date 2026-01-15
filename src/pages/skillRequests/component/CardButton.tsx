import type { SkillRequest } from "@/store/useRequestsStore";
import Button from "@/components/ui/Button";
import useRequestsStore from "@/store/useRequestsStore";

interface CardButtonProps extends Pick<SkillRequest, "status" | "requestId"> {
  type: "incoming" | "outgoing";
}

const CardButton = ({ status, type, requestId }: CardButtonProps) => {
  const { onCancelRequest, onDeclineRequest, onAcceptRequest, loading } =
    useRequestsStore();

  if (type === "incoming") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={() => onAcceptRequest(requestId)}
          type="button"
          variant="primary"
          className="text-sm sm:text-base"
        >
          Accept
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
      <Button
        type="button"
        onClick={() => console.log("Message")}
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
