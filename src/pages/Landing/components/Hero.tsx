import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../../../components/ui/Button";
import teamCollaborationImage from "../../../assets/images/team-collaboration.webp";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="flex flex-col md:flex-row justify-between items-center gap-10 pt-32 pb-15 px-6 md:px-12 lg:px-18 bg-gradient-to-r from-primary/10 to-primary/0"
    >
      <div className="md:max-w-[500px] flex flex-col items-center text-center md:items-start md:text-left gap-6">
        <motion.div
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-fit flex items-center gap-2 px-4 py-1 text-base text-primary bg-soft-primary rounded-full border-ring/20 border-1"
        >
          <Sparkles size={20} />
          <span>Join 10000+ Learners</span>
        </motion.div>

        <motion.h2
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl"
        >
          Learn and Share Skills with a{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/50 to-primary">
            Global Community
          </span>
        </motion.h2>

        <motion.p
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-lg text-muted-foreground"
        >
          SkillForge helps people teach what they know and learn what they
          don't, connecting learners and teachers around the world.
        </motion.p>

        <Button
          onClick={() => navigate("/signup")}
          type="button"
          variant="primary"
          className="flex items-center gap-4 h-12 text-lg font-semibold shadow-primary shadow"
          initial={{ y: 1000, opacity: 0, rotate: 360 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span>Start Learning</span>
          <ArrowRight size={17} />
        </Button>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        className="max-w-[500px] w-full min-w-[300px] max-h-[300px] relative rounded-2xl overflow-hidden shadow-subtle self-center"
      >
        <img
          src={teamCollaborationImage}
          alt="Picture of team collaborating"
          loading="lazy"
          className="w-full hero-image transition-transform duration-200 ease-out"
        />

        {/* Overlay */}
        <div className="absolute z-10 inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent"></div>

        <div className="absolute top-8/12 left-1/12 z-20 flex items-center gap-2 text-sm py-3 px-5 bg-muted rounded-radius">
          <div className="p-2 bg-gradient-to-br from-primary to-primary/50 text-primary-foreground rounded-radius">
            <Sparkles className="animate-spin-scale" />
          </div>
          <div>
            <p>Live Sessions</p>
            <span className="text-xs text-muted-foreground">active now</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
