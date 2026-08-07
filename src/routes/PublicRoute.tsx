import { type ReactNode } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import useMultiStepsStore from "@/store/useMultiStepsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { authResolved, loading, currentUser } = useAuthStore();
  const { currentStep } = useMultiStepsStore();
  const location = useLocation();

  if (!authResolved || loading) {
    return <LoadingSpinner />;
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

      return <Navigate to={`/signup/step-${currentStep}`} replace />;
    }

    if (!isOnAllowedRoute && currentSignupStep === null) {

      return <Navigate to={`/signup/step-${currentStep}`} replace />;
    }
  }

  if (currentUser && currentUser.profile.signupStepsCompleted >= 4) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
