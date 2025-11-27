import { ArrowRight, Sparkles } from "lucide-react";
import { recommendationsData } from "../data/recommendationsData";
import Button from "../../../components/ui/Button";
import clsx from "clsx";
import { motion } from "framer-motion";

const DiscoverRecommendation = () => {
  return (
    <section>
      <h4 className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-primary" />
        <span className="text-base text-foreground">
          Discover Recommendations
        </span>
      </h4>

      <div className="relative w-full max-sm:overflow-x-auto max-sm:overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="max-sm:flex gap-4 w-max max-w-full max-sm:snap-x max-sm:snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3">
          {recommendationsData.map((data) => (
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              key={data.id}
              className="min-w-64 p-4 bg-card border-1 border-border rounded-radius-xl shadow group"
            >
              <p
                className={clsx(
                  "w-fit text-xs px-4 py-1 rounded-full mb-2",
                  data.categoryColor,
                  data.categoryBackground
                )}
              >
                {data.category}
              </p>

              <h5 className="text-base text-card-foreground mb-4">
                {data.skill}
              </h5>

              <p className="text-sm text-muted-foreground mb-3">{data.desc}</p>

              <Button
                onClick={() => console.log("Explore")}
                type="button"
                variant="outline"
                className="w-full flex justify-center items-center gap-3 text-primary py-2 text-sm font-semibold group-hover:scale-105"
              >
                <span>Explore</span>
                <ArrowRight size={15} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverRecommendation;
