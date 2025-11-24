import { type ReactNode } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { loading, userLoggedIn, currentUser } = useAuthStore();

  if (loading) {
    return <p className="text-lg text-center mt-20">Loading...</p>;
  }

  if (userLoggedIn && currentUser && currentUser.signupStepsCompleted >= 4) {
    return <Navigate to={"/home"} replace />;
  }

  return children;
};

export default PublicRoute;
