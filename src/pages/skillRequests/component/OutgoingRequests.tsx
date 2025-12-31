import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import useRequestsStore from "../../../store/useRequestsStore";
import RequestCard from "./RequestCard";
import { motion } from "framer-motion";

const OutgoingRequests = () => {
  const navigate = useNavigate();
  const { skillRequests } = useRequestsStore();

  const outgoingRequests = skillRequests.filter(
    (request) => request.type === "outgoing"
  );

  const requests = outgoingRequests.map((request) => ({
    docID: request.docID,
    skillID: request.skillID,
    skillName: request.skillName,
    userID: request.incomingUserID,
    userName: request.incomingUserName,
    userRole: request.incomingUserRole,
    userAvatar: request.incomingUserAvatar,
    type: request.type,
    status: request.status,
    time: request.time,
  }));

  if (!requests.length) {
    return (
      <section className="w-full flex flex-col items-center gap-4 mt-16 text-center">
        <p className="text-lg text-muted-foreground">
          You haven't requested any skill. Make a request below.
        </p>

        <Button
          onClick={() => navigate("/home/discover")}
          type="button"
          variant="primary"
          className="w-fit py-2"
        >
          Request for Skills
        </Button>
      </section>
    );
  }

  return (
    <motion.section
      key="outgoing-requests"
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: 100, y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {requests.map((request) => (
        <RequestCard key={request.docID} request={request} />
      ))}
    </motion.section>
  );
};

export default OutgoingRequests;
