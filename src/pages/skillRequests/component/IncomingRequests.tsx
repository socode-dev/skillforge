import { motion } from "framer-motion";
import useRequestsStore from "@/store/useRequestsStore";
import RequestCard from "@/pages/skillRequests/component/RequestCard";

const IncomingRequests = () => {
  const { skillRequests } = useRequestsStore();

  const incomingRequests = skillRequests.filter(
    (request) => request.type === "incoming" && request.status === "pending"
  );

  const requests = incomingRequests.map((request) => ({
    docID: request.docID,
    skillID: request.skillID,
    skillName: request.skillName,
    userID: request.outgoingUserID,
    userName: request.outgoingUserName,
    userRole: request.outgoingUserRole,
    userAvatar: request.outgoingUserAvatar,
    type: request.type,
    status: request.status,
    time: request.time,
  }));

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
      initial={{ x: -100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: -100, y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {requests.map((request) => (
        <RequestCard key={request.docID} request={request} />
      ))}
    </motion.section>
  );
};

export default IncomingRequests;
