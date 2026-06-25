import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import type { SkillRequest } from "@/store/useRequestsStore";
import useRequestsStore from "@/store/useRequestsStore";
import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export interface CompletionActionRequest {
  requestId: string;
  skillName: string;
  status: SkillRequest["status"];
  completionStatus?: SkillRequest["completionStatus"];
  owner: {
    userId: string;
  };
  requester: {
    userId: string;
  };
}

interface SkillCompletionActionProps {
  request?: CompletionActionRequest;
  currentUserId?: string;
  className?: string;
  compact?: boolean;
}

const SkillCompletionAction = ({
  request,
  currentUserId,
  className,
  compact = false,
}: SkillCompletionActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { onRequestCompletion, onConfirmCompletion, loading } =
    useRequestsStore();

  if (!request || !currentUserId) return null;

  const isRequester = request.requester.userId === currentUserId;
  const isOwner = request.owner.userId === currentUserId;
  const isAccepted = request.status === "ACCEPTED";
  const completionRequested = request.completionStatus === "REQUESTED";
  const isCompleted = request.status === "COMPLETED";

  const canRequestCompletion =
    isAccepted && isRequester && !completionRequested;
  const canConfirmCompletion = isAccepted && isOwner && completionRequested;
  const isRequesting =
    loading.isRequestingCompletion?.[request.requestId] ?? false;
  const isConfirming =
    loading.isConfirmingCompletion?.[request.requestId] ?? false;

  if (isCompleted) {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center gap-1.5 rounded-radius bg-green-300/20 text-green-800 text-xs",
          compact ? "px-2 py-1.5" : "w-full px-3 py-2",
          className
        )}
      >
        <CheckCircle2 size={14} />
        <span className={clsx(compact && "hidden sm:inline")}>Completed</span>
      </span>
    );
  }

  if (isRequester && completionRequested) {
    return (
      <Button
        type="button"
        variant="outline"
        isDisabled
        className={clsx(
          "inline-flex items-center justify-center",
          compact ? "px-2 sm:px-3 text-xs" : "w-full text-sm",
          className
        )}
      >
        <CheckCircle2 size={14} />
        <span className={clsx("ml-1.5", compact && "hidden sm:inline")}>
          Awaiting Confirm
        </span>
      </Button>
    );
  }

  if (canRequestCompletion) {
    return (
      <Button
        type="button"
        variant="primary"
        aria-label="Mark lesson completed"
        onClick={() => onRequestCompletion(request.requestId)}
        isDisabled={isRequesting}
        className={clsx(
          "inline-flex items-center justify-center",
          compact ? "px-2 sm:px-3 text-xs" : "w-full text-sm",
          className
        )}
      >
        <CheckCircle2 size={14} />
        <span className={clsx("ml-1.5", compact && "hidden sm:inline")}>
          {isRequesting ? "Sending..." : "Completed"}
        </span>
      </Button>
    );
  }

  if (!canConfirmCompletion) return null;

  return (
    <>
      <Button
        type="button"
        variant="primary"
        aria-label="Confirm lesson completion"
        onClick={() => setIsConfirmOpen(true)}
        isDisabled={isConfirming}
        className={clsx(
          "inline-flex items-center justify-center",
          compact ? "px-2 sm:px-3 text-xs" : "w-full text-sm",
          className
        )}
      >
        <CheckCircle2 size={14} />
        <span className={clsx("ml-1.5", compact && "hidden sm:inline")}>
          {isConfirming ? "Confirming..." : "Confirm"}
        </span>
      </Button>

      {isConfirmOpen && (
        <Dialog className="max-w-[420px] gap-5">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Confirm completion</h3>
            <p className="text-sm text-muted-foreground">
              Confirm that "{request.skillName}" is complete. The escrowed coins
              will be released to you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              isDisabled={isConfirming}
              onClick={async () => {
                await onConfirmCompletion(request.requestId);
                setIsConfirmOpen(false);
              }}
              className="w-full"
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default SkillCompletionAction;
