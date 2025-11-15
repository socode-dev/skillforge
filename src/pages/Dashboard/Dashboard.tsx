import DiscoverRecommendation from "./components/DiscoverRecommendations";
import Hero from "./components/Hero";
import MessagesOverview from "./components/MessagesOverview";
import OngoingLearning from "./components/OngoingLearning";
import OverviewStats from "./components/OverviewStats";
import RequestsOverview from "./components/RequestsOverview";

const Dashboard = () => {
  return (
    <main className="space-y-10 w-full pb-10">
      <Hero />
      <OverviewStats />
      <OngoingLearning />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RequestsOverview />
        <MessagesOverview />
      </section>
      <DiscoverRecommendation />
    </main>
  );
};

export default Dashboard;
