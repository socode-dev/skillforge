import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import useRequestsStore from "@/store/useRequestsStore";
import RequestCard from "@/pages/skillRequests/component/RequestCard";
import { motion } from "framer-motion";
import useAuthStore from "@/store/useAuthStore";

const OutgoingRequests = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { skillRequests } = useRequestsStore();

  const filteredRequests = skillRequests.filter(
    (req) =>
      req.requester.userId === currentUser?.profile.userId &&
      req.owner.userId !== currentUser.profile.userId
  );

  const requests = filteredRequests.map((req) => {
    const {
      skillId,
      skillName,
      skillDesc,
      owner: { userId: ownerUserId, name, role, avatar },
      requester: { userId: requesterUserId },
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
  });

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {requests.map((request) => (
        <RequestCard key={request.requestId} request={request} />
      ))}
    </motion.section>
  );
};

export default OutgoingRequests;
