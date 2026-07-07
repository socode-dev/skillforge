import { Check, User, X } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import useRequestsStore from "@/store/useRequestsStore";
import useAuthStore from "@/store/useAuthStore";
import { formatTime } from "@/utils/formatTime";

const IncomingRequestOverview = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { skillRequests, onAcceptRequest, onDeclineRequest, loading } =
    useRequestsStore();
  const currentUserId = currentUser?.profile.userId;
  const requests = skillRequests
    .filter(
      (request) =>
        request.owner.userId === currentUserId &&
        request.requester.userId !== currentUserId &&
        request.status === "PENDING"
    )
    .slice(0, 2);

  return (
    <motion.div
      initial={{ x: -50, y: 20 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: 50, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {!requests.length && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No incoming requests yet.
        </p>
      )}

      {requests.map((request, index) => (
        <div
          key={request.requestId}
          className={clsx(
            "flex items-center gap-4 py-2 border-border",
            index + 1 !== requests.length && "border-b-1"
          )}
        >
          <div className="relative w-11 h-11 shrink-0 bg-soft-primary text-primary rounded-full grid place-items-center overflow-hidden">
            {request.requester.avatar ? (
              <img
                src={request.requester.avatar}
                alt={`${request.requester.name}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={17} />
            )}
          </div>

          <div className="grow max-w-md min-w-0">
            <h6 className="text-sm truncate">{request.requester.name}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {request.skillName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(request.updatedAt)}
            </p>

            <button
              type="button"
              aria-label="Accept request"
              disabled={loading.isAccepting[request.requestId]}
              onClick={() =>
                onAcceptRequest({
                  requestId: request.requestId,
                  ownerUserId: request.owner.userId,
                  requesterUserId: request.requester.userId,
                  skillId: request.skillId,
                  skillName: request.skillName,
                })
              }
              className={clsx("p-2 bg-primary text-primary-foreground rounded-radius hover:bg-primary-dark transition cursor-pointer", loading.isAccepting[request.requestId] && "opacity-90")}
            >
              <Check size={15} />
            </button>
            <button
              type="button"
              aria-label="Decline request"
              disabled={loading.isDeclining[request.requestId]}
              onClick={() => onDeclineRequest(request.requestId)}
              className="p-2 border-border border-1 rounded-radius text-destructive cursor-pointer hover:bg-muted transition"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default IncomingRequestOverview;
