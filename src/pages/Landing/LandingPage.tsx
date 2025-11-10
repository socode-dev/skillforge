import { useNavigate } from "react-router-dom";
import { ScrollToTop } from "../../Layouts/ScrollToTop";
import CallToAction from "./components/CallToAction";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Process from "./components/Process";
import { motion } from "framer-motion";
import useMultiStepsStore from "../../store/useMultiStepsStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const setCurrentStep = useMultiStepsStore((state) => state.setCurrentStep);

  const handleSignupClick = (): void => {
    setCurrentStep(1);
    navigate("/signup/step-1");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col"
    >
      <ScrollToTop />
      <Hero handleSignupClick={handleSignupClick} />
      <Process />
      <Features />
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.3 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="self-center flex items-center gap-4 my-15 py-6 px-4 mx-4 max-w-[400px] bg-soft-primary border-1 border-ring/20 rounded-full"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full absolute z-10 -top-4 border-2 border-muted bg-gradient-to-br from-primary/90 to-primary/50"></div>
          <div className="w-8 h-8 rounded-full absolute z-20 -top-4 left-5 border-2 border-muted bg-gradient-to-br from-primary/90 to-primary/50"></div>
          <div className="w-8 h-8 rounded-full absolute z-30 -top-4 left-10 border-2 border-muted bg-gradient-to-br from-primary/90 to-primary/50"></div>
          <div className="w-8 h-8 rounded-full absolute z-40 -top-4 left-15 border-2 border-muted bg-gradient-to-br from-primary/90 to-primary/50"></div>
        </div>
        <span className="ml-20 text-primary text-sm">
          Join thousands of learners and teachers
        </span>
      </motion.div>
      <CallToAction handleSignupClick={handleSignupClick} />
    </motion.main>
  );
};

export default LandingPage;
