import clsx from "clsx";
import Card from "../../../components/ui/Card";
import { featuresData, type FeatureType } from "../data/featuresData";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <section
      id="features"
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
          <span className="text-sm text-primary">Platform Features</span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4">
          Everything You Need
        </h3>

        <p className="text-lg text-muted-foreground mb-14">
          Powerful features designed to make learning and teaching effortless
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 tablet:gap-10">
        {featuresData.map((feature: FeatureType) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.id}
              className={clsx(
                "items-start text-left py-10 cursor-default group transition",
                feature.backgroundHoverColor
              )}
              whileHover={{
                scale: 1.04,
                boxShadow: "10px 0 30px 15px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div
                className={clsx(
                  "p-4 bg-gradient-to-br text-white rounded-2xl hover:animate-tilt",
                  feature.iconGradientColor
                )}
              >
                <Icon size={30} />
              </div>

              <h4 className="text-xl text-card-foreground">
                {feature.heading}
              </h4>

              <p className="text-base text-muted-foreground">{feature.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
