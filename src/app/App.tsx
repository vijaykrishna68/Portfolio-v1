import { useEffect, useState } from "react";

import { About } from "./components/About/About";
import { Footer } from "./components/Footer/Footer";
import { Hero } from "./components/Hero/Hero";
import { Journal } from "./components/Journal/Journal";
import { Navbar } from "./components/Navbar/Navbar";
import { Playground } from "./components/Playground/Playground";
import { SelectedWork } from "./components/SelectedWork/SelectedWork";
import { Timeline } from "./components/Timeline/Timeline";
import { useActiveSection } from "./hooks/useActiveSection";
import { THEME_MODES } from "./lib/constants";
import type { ThemeMode } from "./types/portfolio";

const SECTION_IDS = ["work", "timeline", "journal", "playground", "about", "contact"];

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(THEME_MODES.LIGHT);
  const activeSection = useActiveSection({ ids: SECTION_IDS, fallback: "work" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME_MODES.DARK);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar
        theme={theme}
        activeSection={activeSection}
        toggleTheme={() =>
          setTheme((current) =>
            current === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT,
          )
        }
      />
      <main>
        <Hero />
        <SelectedWork />
        <Timeline />
        <Journal />
        <Playground />
        <About />
      </main>
      <Footer />
    </div>
  );
}