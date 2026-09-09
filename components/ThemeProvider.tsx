"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readStoredTheme, saveTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  mounted: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextTheme = readStoredTheme();

      setTheme(nextTheme);
      applyTheme(nextTheme);
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
    saveTheme(theme);
  }, [mounted, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === "dark",
      mounted,
      toggleTheme: () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
      },
    }),
    [mounted, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
