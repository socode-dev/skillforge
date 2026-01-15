import SignupProgress from "./components/SignupProgress";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthHeader from "./components/AuthHeader";
import { motion } from "framer-motion";
import Skills from "./components/Skills";
import Profile from "./components/Profile";
import Done from "./components/Done";
import Account from "./components/Account";
import useMultiStepsStore from "../../store/useMultiStepsStore";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";
import { ScrollToTop } from "../../Layouts/ScrollToTop";
import { useEffect } from "react";

interface StepsState {
  [index: number]: JSX.Element;
}

const Signup = () => {
  const signupErr = useAuthStore((state) => state.signupErr);
  const currentStep = useMultiStepsStore((state) => state.currentStep);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const steps = ["Account", "Skills", "Profile", "Done"];

  // Reactively update URL when currentStep changes
  useEffect(() => {
    const expectedPath = `/signup/step-${currentStep}`;
    const currentPath = `/signup/${slug}`;

    // Only update URL if it doesn't match the current step
    if (currentPath !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [currentStep, navigate, slug]);

  const stepsComponents: StepsState = {
    0: <Account />,
    1: <Skills />,
    2: <Profile />,
    3: <Done />,
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-auto px-6 md:px-12 lg:px-18 space-y-10"
    >
      <AuthHeader />

      <section className="w-full max-w-2xl mx-auto space-y-10">
        <SignupProgress currentStep={currentStep} steps={steps} />

        {signupErr && (
          <p className="w-fit text-destructive text-sm bg-soft-destructive px-10 py-2 mx-auto rounded-radius">
            {signupErr}
          </p>
        )}

        <form className="bg-card text-card-foreground p-8 border-border border-1 rounded-radius-xl shadow">
          <ScrollToTop />
          <AnimatePresence mode="wait">
            {stepsComponents[currentStep - 1]}
          </AnimatePresence>
        </form>

        <p className="text-center text-muted-foreground text-sm mb-15">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-accent hover:underline hover:text-accent-dark font-semibold"
          >
            Log in
          </Link>
        </p>
      </section>
    </motion.main>
  );
};

export default Signup;
