import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AnimatePresence } from "framer-motion";
import useThemeStore from "./store/useThemeStore";
import { useEffect } from "react";
import AppIntializer from "./routes/AppInitializer";

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleColorSchemeChange = () => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(
        mediaQuery.matches ? "dark" : "light"
      );
    };

    mediaQuery.addEventListener<"change">("change", handleColorSchemeChange);

    return () =>
      mediaQuery.removeEventListener<"change">(
        "change",
        handleColorSchemeChange
      );
  }, []);

  return (
    <BrowserRouter>
      <AppIntializer />
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
