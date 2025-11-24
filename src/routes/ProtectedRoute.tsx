import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { type ReactNode, useRef, useEffect } from "react";
import useMultiStepsStore from "../store/useMultiStepsStore";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuthStore();
  const setCurrentStep = useMultiStepsStore((state) => state.setCurrentStep);
  const lastProcessedStep = useRef<number | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.signupStepsCompleted < 4) {
      const newStep = currentUser.signupStepsCompleted + 1;
      if (lastProcessedStep.current !== newStep) {
        setCurrentStep(newStep);
        lastProcessedStep.current = newStep;
      }
    }
    return () => {
      lastProcessedStep.current = null;
    };
  }, [currentUser]);

  if (loading) {
    return <p className="text-lg text-center mt-20">Loading...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser && currentUser.signupStepsCompleted < 4) {
    const step = currentUser.signupStepsCompleted + 1;
    return <Navigate to={`/signup/step-${step}`} replace />;
  }

  return children;
};
