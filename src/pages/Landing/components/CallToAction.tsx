import { ArrowRight, CircleCheck, Sparkles, Star, Zap } from "lucide-react";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="px-6 md:px-12 lg:px-18 py-18 bg-linear-to-br/shorter from-primary via-accent to-primary flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="w-fit p-6 rounded-full bg-accent/50 backdrop-blur-md border border-accent/50 text-white animate-spin-scale mb-6"
      >
        <Sparkles size={30} />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-3xl md:text-3xl text-white text-center mb-6"
      >
        Ready to Unlock Your Potential?
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-lg text-center text-white mb-8"
      >
        Join SkillForge today and start exchanging skills with a vibrant
        community of learners and teachers worlwide.
      </motion.p>

      <Button
        onClick={() => navigate("/signup")}
        initial={{ opacity: 0, y: 100, rotate: 360 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        type="button"
        variant="secondary"
        className="bg-white flex items-center gap-4 py-3 font-semibold text-xl transition"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
          Get Started Now
        </span>{" "}
        <ArrowRight size={18} />
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-wrap items-center gap-6 text-white mt-8"
      >
        <div className="flex items-center gap-2 text-sm">
          <Zap size={16} /> <span>Instant Access</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-fit rounded-full bg-white text-accent">
            <CircleCheck size={16} />
          </div>{" "}
          <span>No Credit Card Required</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star size={16} /> <span>Rated 4.9/5</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CallToAction;
