import { type ReactNode } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import useMultiStepsStore from "@/store/useMultiStepsStore";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { authResolved, loading, currentUser } = useAuthStore();
  const { currentStep } = useMultiStepsStore();
  const location = useLocation();

  if (!authResolved || loading) {
    return <p className="text-lg text-center mt-20">Loading...</p>;
  }

  const allowedRoutes = ["/", "/login", "/signup/step-1"];
  const isOnAllowedRoute = allowedRoutes.includes(location.pathname);

  const signupStepMatch = location.pathname.match(/\/signup\/step-(\d+)/);
  const currentSignupStep = signupStepMatch
    ? parseInt(signupStepMatch[1], 10)
    : null;

  if (currentUser && currentUser.profile.signupStepsCompleted < 4) {
    if (isOnAllowedRoute) {
      return children;
    }

    if (currentSignupStep !== null && currentSignupStep !== currentStep) {
      console.log(
        "Signup Steps Completed:",
        currentUser.profile.signupStepsCompleted
      );
      console.log("Current Step:", currentStep);
      console.log("Redirecting to correct step");

      return <Navigate to={`/signup/step-${currentStep}`} replace />;
    }

    if (!isOnAllowedRoute && currentSignupStep === null) {
      console.log(
        "Signup Steps Completed:",
        currentUser.profile.signupStepsCompleted
      );
      console.log("Current Step:", currentStep);
      console.log("Redirecting to signup step");

      return <Navigate to={`/signup/step-${currentStep}`} replace />;
    }
  }

  if (currentUser && currentUser.profile.signupStepsCompleted >= 4) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
