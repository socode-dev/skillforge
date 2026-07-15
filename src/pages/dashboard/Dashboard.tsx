import { ScrollToTop } from "@/layouts/ScrollToTop";
import DiscoverRecommendation from "@/pages/dashboard/components/DiscoverRecommendations";
import Hero from "@/pages/dashboard/components/Hero";
import MessagesOverview from "@/pages/dashboard/components/MessagesOverview";
import OngoingLearning from "@/pages/dashboard/components/OngoingLearning";
import OverviewStats from "@/pages/dashboard/components/OverviewStats";
import RequestsOverview from "@/pages/dashboard/components/RequestsOverview";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-10 w-full pb-10 px-6 md:px-8 lg:px-10"
    >
      <ScrollToTop />
      <Hero />
      <OverviewStats />
      <OngoingLearning />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RequestsOverview />
        <MessagesOverview />
      </section>
      <DiscoverRecommendation />
    </motion.main>
  );
};

export default Dashboard;
