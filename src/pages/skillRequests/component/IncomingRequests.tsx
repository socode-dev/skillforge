import { motion } from "framer-motion";
import useRequestsStore from "@/store/useRequestsStore";
import RequestCard from "@/pages/skillRequests/component/RequestCard";
import useAuthStore from "@/store/useAuthStore";
import { useMemo } from "react";

const IncomingRequests = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const skillRequests = useRequestsStore(state => state.skillRequests);

  const filteredRequests = useMemo(() => skillRequests.filter(
    (req) =>
      req.owner.userId === currentUser?.profile.userId &&
      req.requester.userId !== currentUser?.profile.userId &&
      (req.status === "PENDING" ||
        (req.status === "ACCEPTED" && req.completionStatus === "REQUESTED"))
  ), [skillRequests, currentUser]);

  const requests = useMemo(() => filteredRequests.map((req) => {
    const {
      skillId,
      skillName,
      skillDesc,
      owner: { userId: ownerUserId },
      requester: { userId: requesterUserId, name, role, avatar },
      requestId,
      status,
      completionStatus,
      createdAt,
      updatedAt,
    } = req;

    return {
      requestId,
      skillId,
      skillName,
      skillDesc,
      status,
      completionStatus,
      createdAt,
      updatedAt,
      ownerUserId,
      requesterUserId,
      name,
      role,
      avatar,
    };
  }), [filteredRequests]);

  if (!requests.length) {
    return (
      <section className="w-full flex flex-col items-center gap-4 mt-16 text-center">
        <p className="text-lg text-muted-foreground">
          You have no incoming skill requests.
        </p>
      </section>
    );
  }

  return (
    <motion.section
      key="incoming-requests"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {requests.map((request) => (
        <RequestCard key={request.requestId} request={request} />
      ))}
    </motion.section>
  );
};

export default IncomingRequests;
