import { Suspense, useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";

import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { THEME_MODES } from "../../lib/constants";
import type { ThemeMode } from "../../types/portfolio";

export function Layout() {
  const [theme, setTheme] = useState<ThemeMode>(THEME_MODES.LIGHT);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME_MODES.DARK);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:border focus:border-border focus:text-foreground focus:text-sm"
      >
        Skip to content
      </a>
      <Navbar
        theme={theme}
        toggleTheme={() =>
          setTheme((t) =>
            t === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT,
          )
        }
      />
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
