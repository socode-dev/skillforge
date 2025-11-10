import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AppIntializer = () => {
  const navigate = useNavigate();
  const { startAuthListener, stopAuthListener } = useAuthStore();

  useEffect(() => {
    startAuthListener(navigate);

    return () => {
      stopAuthListener();
    };
  }, []);

  return null;
};

export default AppIntializer;
