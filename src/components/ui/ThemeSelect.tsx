import type { ChangeEvent } from "react";
import useThemeStore from "../../store/useThemeStore";

const ThemeSelect = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as "light" | "dark" | "system");
  };

  return (
    <select
      name="theme"
      value={theme}
      onChange={handleThemeChange}
      className="border-1 border-border rounded-radius px-4 py-1 text-sm focus:border-ring cursor-pointer transition"
    >
      <option value="light" className="bg-muted cursor-pointer transition">
        Light
      </option>
      <option value="dark" className="bg-muted cursor-pointer transition">
        Dark
      </option>
      <option value="system" className="bg-muted cursor-pointer transition">
        System
      </option>
    </select>
  );
};

export default ThemeSelect;
