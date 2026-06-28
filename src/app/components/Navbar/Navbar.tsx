import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { ButtonLink } from "../shared/Button";
import { NAV_LINKS, NAV_SCROLL_THRESHOLD, THEME_MODES } from "../../lib/constants";
import { Container } from "../shared/Container";
import type { ThemeMode } from "../../types/portfolio";
import { INTERACTION } from "../../lib/interaction";

type NavbarProps = {
  theme: ThemeMode;
  toggleTheme: () => void;
  activeSection: string;
};

export function Navbar({ theme, toggleTheme, activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="h-[58px] flex items-center justify-between">
          <a
            href="#"
            className="text-[17px] text-foreground hover:opacity-60 transition-opacity leading-none select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VK
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
                className={`text-[13px] relative group ${INTERACTION.color} ${
                  activeSection === link.href.slice(1) ? "text-[#68b1f5]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-[#68b1f5] ${INTERACTION.underline} ${
                    activeSection === link.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ButtonLink
              href="#contact"
              variant="nav"
              className="hidden md:inline-flex"
            >
              Get in touch
            </ButtonLink>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-1.5 text-muted-foreground hover:text-foreground ${INTERACTION.icon}`}
            >
              <span className="relative block h-[15px] w-[15px]">
                <Moon
                  size={15}
                  strokeWidth={1.5}
                  className={`absolute inset-0 ${INTERACTION.icon} ${
                    theme === THEME_MODES.LIGHT ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-45"
                  }`}
                />
                <Sun
                  size={15}
                  strokeWidth={1.5}
                  className={`absolute inset-0 ${INTERACTION.icon} ${
                    theme === THEME_MODES.DARK ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-45"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>
    </nav>
  );
}