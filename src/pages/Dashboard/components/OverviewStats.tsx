import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock3, GraduationCap } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import useRequestsStore from "@/store/useRequestsStore";

const OverviewStats = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const skillRequests = useRequestsStore((state) => state.skillRequests);
  const currentUserId = currentUser?.profile.userId;

  const stats = [
    {
      id: "active-learning",
      icon: BookOpen,
      count: skillRequests.filter(
        (request) =>
          request.requester.userId === currentUserId &&
          request.status === "ACCEPTED"
      ).length,
      label: "Active Skills Learning",
    },
    {
      id: "active-teaching",
      icon: GraduationCap,
      count: skillRequests.filter(
        (request) =>
          request.owner.userId === currentUserId &&
          request.status === "ACCEPTED"
      ).length,
      label: "Active Skills Teaching",
    },
    {
      id: "pending-requests",
      icon: Clock3,
      count: skillRequests.filter((request) => request.status === "PENDING")
        .length,
      label: "Pending Skill Requests",
    },
    {
      id: "completed-skills",
      icon: CheckCircle2,
      count: skillRequests.filter((request) => request.status === "COMPLETED")
        .length,
      label: "Completed Skills",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            key={stat.id}
            className="flex items-center gap-4 bg-card p-6 border-1 border-border rounded-radius-xl shadow group"
          >
            <span className="grid h-12 w-12 place-items-center rounded-radius bg-soft-primary text-primary group-hover:scale-110 transition">
              <Icon size={22} />
            </span>
            <div className="space-y-1">
              <h3 className="text-3xl text-primary">{stat.count}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default OverviewStats;
