import { useEffect, useState } from "react";

import { NameCard } from "../components/NameCard/NameCard";
import { THEME_MODES, THEME_STORAGE_KEY } from "../lib/constants";
import type { ThemeMode } from "../types/portfolio";

function resolveInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === THEME_MODES.DARK || saved === THEME_MODES.LIGHT) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
  } catch {
    return THEME_MODES.LIGHT;
  }
}

export default function NameCardPage() {
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME_MODES.DARK);
  }, [theme]);

  // Title and noindex apply to this route only; restore both on leave.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Vijay Krishna";
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    if (robots) robots.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (robots && previousRobots !== undefined) robots.content = previousRobots;
    };
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
      return next;
    });
  }

  return <NameCard theme={theme} toggleTheme={toggleTheme} />;
}
