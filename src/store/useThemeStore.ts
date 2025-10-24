import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.remove("light", "dark");

        if (theme === "system") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          document.documentElement.classList.add(
            prefersDark ? "dark" : "light"
          );
        } else {
          document.documentElement.classList.add(theme);
        }
      },

      initializeTheme: () => {
        const stored = localStorage.getItem("theme-storage");
        const theme: Theme = stored ? JSON.parse(stored).state.theme : "system";
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";

        document.documentElement.classList.add(
          theme === "system" ? systemTheme : theme
        );
      },
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
