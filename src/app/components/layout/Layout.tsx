import { Suspense, useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";

import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { THEME_MODES, THEME_STORAGE_KEY } from "../../lib/constants";
import type { ThemeMode } from "../../types/portfolio";

/**
 * Read the resolved theme synchronously so the first React render
 * matches what the inline <head> script already painted on the page.
 * Priority: localStorage → prefers-color-scheme → light
 */
function resolveInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === THEME_MODES.DARK || saved === THEME_MODES.LIGHT) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_MODES.DARK
      : THEME_MODES.LIGHT;
  } catch {
    return THEME_MODES.LIGHT;
  }
}

export function Layout() {
  // Lazy initialiser: runs once synchronously on first render.
  // Reading from the same sources as the blocking script ensures
  // React's initial state never disagrees with the painted page.
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme);

  // Keep the <html> class in sync whenever the state changes.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME_MODES.DARK);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      // Persist the explicit user choice so future visits skip the OS lookup.
      try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:border focus:border-border focus:text-foreground focus:text-sm"
      >
        Skip to content
      </a>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
