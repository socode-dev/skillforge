import Card from "../../../components/ui/Card";
import { processData, type Data } from "../data/processData";
import clsx from "clsx";
import { motion } from "framer-motion";

const Process = () => {
  return (
    <section
      id="process"
      className="bg-background flex flex-col items-center pt-20 pb-15 px-6 md:px-12 lg:px-18 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-fit bg-soft-primary border-ring/20 border-1 py-1 px-4 rounded-full mb-4">
          <span className="text-sm text-primary">Simple Process</span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4">How It Works</h3>

        <p className="text-lg text-muted-foreground mb-14">
          Three simple steps to start your learnig journey
        </p>
      </motion.div>

      <div className="relative flex flex-col md:flex-row md:justify-between gap-8 md:gap-6 tablet:gap-10">
        {/* Horizontal rule */}
        <div className="max-md:hidden absolute top-[50%] translate-y-[50%] h-1 w-full bg-muted" />
        {/* card */}
        {processData.map((process: Data) => {
          const Icon = process.icon;

          return (
            <Card
              key={process.id}
              className={clsx(
                "relative cursor-default group transition",
                process.backgroundHoverColor
              )}
              whileHover={{
                y: -5,
                boxShadow: "10px 0 30px 15px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div
                className={clsx(
                  "p-6 bg-gradient-to-br text-white rounded-2xl hover:animate-spin",
                  process.iconGradientColor
                )}
              >
                <Icon size={30} />
              </div>

              <h4 className="text-xl text-card-foreground">
                {process.heading}
              </h4>

              <p className="text-base text-muted-foreground">{process.desc}</p>

              <span className="absolute top-3 right-5 text-6xl text-muted group-hover:text-muted-foreground/20 transition">
                {process.id}
              </span>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Process;
