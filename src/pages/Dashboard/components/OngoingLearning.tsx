import { ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { ongoingLearningData } from "../data/ongoingLearningData";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";

const OngoingLearning = () => {
  return (
    <section className="space-y-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h4 className="text-base">Ongoing Learning</h4>

        <Link
          to={"/home"}
          className="flex gap-2 items-center text-primary text-sm font-medium"
        >
          <span>View All</span>

          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="flex gap-6 w-max snap-x snap-mandatory px-1">
          {ongoingLearningData.map((data) => {
            const ringStyle = {
              background: `conic-gradient(var(--color-primary) 0% ${data.progress}%, rgb(245, 245, 245) 100%)`,
            };

            return (
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={data.id}
                className="bg-card py-6 px-4 w-68 small:w-76 border-1 border-border shadow rounded-radius-xl snap-start shrink-0 group"
              >
                <h5 className="text-base small:text-lg font-semibold mb-3">
                  {data.heading}
                </h5>

                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1 h-fit w-fit text-primary bg-soft-primary rounded-full">
                    <User size={15} />
                  </span>

                  <p className="text-sm text-muted-foreground">{data.name}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-6 min-w-full line-clamp-2">
                  {data.desc}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-muted-foreground">Progress</p>

                  <div style={ringStyle} className="p-1 rounded-full">
                    <p className="text-xs bg-card h-8 w-8 flex justify-center items-center rounded-full text-primary">
                      {data.progress}%
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => console.log("Lesson:", data.heading)}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-3 py-2.5 text-sm font-medium group-hover:scale-105"
                >
                  <span>Continue</span>
                  <ArrowRight size={15} />
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
