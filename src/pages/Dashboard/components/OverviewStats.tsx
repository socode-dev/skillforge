import { overviewStatsData } from "../data/overviewStatsData";
import { motion } from "framer-motion";

const OverviewStats = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewStatsData.map((stats) => {
        return (
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            key={stats.id}
            className="flex items-center gap-4 bg-card p-6 border-1 border-border rounded-radius-xl shadow group"
          >
            <span className="text-3xl group-hover:scale-125 transition">
              {stats.emoji}
            </span>
            <div className="space-y-1">
              <h3 className="text-3xl text-primary">{stats.count}</h3>
              <p className="text-sm text-muted-foreground">{stats.label}</p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default OverviewStats;
