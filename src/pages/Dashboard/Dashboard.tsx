import { ScrollToTop } from "../../Layouts/ScrollToTop";
import DiscoverRecommendation from "./components/DiscoverRecommendations";
import Hero from "./components/Hero";
import MessagesOverview from "./components/MessagesOverview";
import OngoingLearning from "./components/OngoingLearning";
import OverviewStats from "./components/OverviewStats";
import RequestsOverview from "./components/RequestsOverview";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 1, x: 1 }}
      exit={{ opacity: 0, x: -50, y: 50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-10 w-full pb-10"
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
