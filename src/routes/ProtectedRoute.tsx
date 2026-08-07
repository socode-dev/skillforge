import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { type ReactNode } from "react";
import useMultiStepsStore from "../store/useMultiStepsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading, authResolved } = useAuthStore();
  const { currentStep } = useMultiStepsStore();

  if (!authResolved || loading) {
    return <LoadingSpinner label="Preparing your SkillForge Account..." />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.profile.signupStepsCompleted < 4) {
    console.log(
      "Signup Steps Completed:",
      currentUser.profile.signupStepsCompleted
    );
    console.log("Current Step:", currentStep);

    return <Navigate to={`/signup/step-${currentStep}`} replace />;
  }

  return children;
};
