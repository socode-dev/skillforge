import { ArrowRight, MessageCircle, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import useAuthStore from "@/store/useAuthStore";
import useRequestsStore from "@/store/useRequestsStore";
import useChatStore from "@/store/useChatStore";

const OngoingLearning = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const skillRequests = useRequestsStore((state) => state.skillRequests);
  const lastMessages = useChatStore((state) => state.lastMessages);
  const currentUserId = currentUser?.profile.userId;

  const ongoingRequests = skillRequests
    .filter(
      (request) =>
        request.requester.userId === currentUserId &&
        request.status === "ACCEPTED"
    )
    .slice(0, 4);

  return (
    <section className="space-y-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h4 className="text-base">Ongoing Learning</h4>

        <Link
          to={"/home/skill-requests"}
          className="flex gap-2 items-center text-primary text-sm font-medium"
        >
          <span>View All</span>

          <ArrowRight size={15} />
        </Link>
      </div>

      {!ongoingRequests.length && (
        <div className="bg-card border-1 border-border rounded-radius-xl px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No active learning yet. Explore skills and send a request to begin.
          </p>
          <Link
            to="/home/discover"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary"
          >
            <span>Discover Skills</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="flex gap-4 w-max snap-x snap-mandatory px-1">
          {ongoingRequests.map((request) => {
            const chat = request.chatId ? lastMessages[request.chatId] : null;
            const messagePath = chat?.slug
              ? `/home/messages/thread/${chat.slug}`
              : "/home/messages";

            return (
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={request.requestId}
                className="bg-card py-6 px-4 w-68 small:w-76 border-1 border-border shadow rounded-radius-xl snap-start shrink-0 group"
              >
                <h5 className="text-base small:text-lg font-semibold mb-3">
                  {request.skillName}
                </h5>

                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1 h-fit w-fit text-primary bg-soft-primary rounded-full">
                    <User size={15} />
                  </span>

                  <p className="text-sm text-muted-foreground truncate">
                    {request.owner.name}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mb-6 min-w-full line-clamp-2">
                  {request.skillDesc}
                </p>

                <div className="flex justify-between items-center mb-6 text-xs text-muted-foreground">
                  <span>Accepted</span>
                  <span>{request.completionStatus === "REQUESTED" ? "Awaiting confirmation" : "In progress"}</span>
                </div>

                <Button
                  type="button"
                  onClick={() => navigate(messagePath)}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-3 py-2.5 text-sm font-medium group-hover:scale-105"
                >
                  <MessageCircle size={15} />
                  <span>Message</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OngoingLearning;
