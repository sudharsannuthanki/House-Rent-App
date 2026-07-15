import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "houserent-theme"; // "light" | "dark"

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return getSystemTheme();
}

function applyThemeClass(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  // Lets native form controls, scrollbars etc. pick up the right color-scheme too.
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [hasManualPreference, setHasManualPreference] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) !== null
  );

  // Apply immediately (and on every change) so the class is always in sync.
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  // If the user never explicitly chose a theme, keep following system changes.
  useEffect(() => {
    if (hasManualPreference || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setTheme(event.matches ? "dark" : "light");
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [hasManualPreference]);

  const setThemeManually = useCallback((next) => {
    setTheme(next);
    setHasManualPreference(true);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeManually(theme === "dark" ? "light" : "dark");
  }, [theme, setThemeManually]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeManually }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
