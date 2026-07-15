import { useTheme } from "../context/ThemeContext";
import { IconSun, IconMoon } from "./icons";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={`theme-toggle-icon ${isDark ? "is-dark" : "is-light"}`}>
        {isDark ? <IconMoon size={16} /> : <IconSun size={16} />}
      </span>
    </button>
  );
}

export default ThemeToggle;
