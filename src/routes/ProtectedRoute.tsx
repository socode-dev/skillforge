import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { type ReactNode } from "react";
import useMultiStepsStore from "../store/useMultiStepsStore";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading, authResolved } = useAuthStore();
  const { currentStep } = useMultiStepsStore();

  if (!authResolved || loading) {
    return <p className="text-lg text-center mt-20">Loading...</p>;
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
