import { User } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import useRequestsStore from "@/store/useRequestsStore";
import useAuthStore from "@/store/useAuthStore";
import { formatTime } from "@/utils/formatTime";
import { useMemo } from "react";

const OutgoingRequestOverview = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const skillRequests = useRequestsStore((state) => state.skillRequests);
  
  const currentUserId = currentUser?.profile.userId;
  
  const requests = useMemo(() => skillRequests
    .filter(
      (request) =>
        request.requester.userId === currentUserId &&
        request.owner.userId !== currentUserId
    )
    .slice(0, 2), [skillRequests, currentUserId]);

  return (
    <motion.div
      initial={{ x: 50, y: 20 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: -50, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {!requests.length && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No outgoing requests yet.
        </p>
      )}

      {requests.map((request, i) => (
        <div
          key={request.requestId}
          className={clsx(
            "flex items-center gap-4 py-2 border-border",
            i + 1 !== requests.length && "border-b-1"
          )}
        >
          <div className="relative w-11 h-11 shrink-0 bg-soft-primary text-primary rounded-full grid place-items-center overflow-hidden">
            {request.owner.avatar ? (
              <img
                src={request.owner.avatar}
                alt={`${request.owner.name}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={15} />
            )}
          </div>

          <div className="grow min-w-0 max-w-md">
            <h6 className="text-sm truncate">{request.owner.name}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {request.skillName}
            </p>
            <p className="mt-1 text-[11px] font-medium text-primary">
              {request.status}
            </p>
          </div>

          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(request.updatedAt)}
          </p>
        </div>
      ))}
    </motion.div>
  );
};

export default OutgoingRequestOverview;
