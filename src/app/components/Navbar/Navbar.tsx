import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Moon, Sun } from "lucide-react";

import { ButtonLink } from "../shared/Button";
import { NAV_LINKS, NAV_SCROLL_THRESHOLD, THEME_MODES } from "../../lib/constants";
import { Container } from "../shared/Container";
import type { ThemeMode } from "../../types/portfolio";
import { INTERACTION } from "../../lib/interaction";
import { useActiveSection } from "../../hooks/useActiveSection";

type NavbarProps = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const HOME_SECTION_IDS = ["work", "timeline", "journal", "playground", "about"];

const ROUTE_MAP: Record<string, string> = {
  "#work": "/projects",
  "#timeline": "/",
  "#journal": "/journal",
  "#playground": "/playground",
  "#about": "/",
};

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const activeSection = useActiveSection({
    ids: HOME_SECTION_IDS,
    fallback: HOME_SECTION_IDS[0],
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string): boolean {
    if (isHome) return activeSection === href.slice(1);
    const route = ROUTE_MAP[href];
    return route !== "/" && pathname.startsWith(route);
  }

  function linkClassName(href: string) {
    const active = isActive(href);
    return `text-[13px] relative group ${INTERACTION.color} ${
      active ? "text-[#68b1f5]" : "text-muted-foreground hover:text-foreground"
    }`;
  }

  function underlineClassName(href: string) {
    const active = isActive(href);
    return `absolute -bottom-0.5 left-0 h-px bg-[#68b1f5] ${INTERACTION.underline} ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`;
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="h-[58px] flex items-center justify-between">
          {isHome ? (
            <a
              href="#"
              className="text-[17px] text-foreground hover:opacity-60 transition-opacity leading-none select-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VK
            </a>
          ) : (
            <Link
              to="/"
              className="text-[17px] text-foreground hover:opacity-60 transition-opacity leading-none select-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VK
            </Link>
          )}

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              isHome ? (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={linkClassName(link.href)}
                >
                  {link.label}
                  <span className={underlineClassName(link.href)} />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={ROUTE_MAP[link.href]}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={linkClassName(link.href)}
                >
                  {link.label}
                  <span className={underlineClassName(link.href)} />
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <ButtonLink
              href={isHome ? "#contact" : "/#contact"}
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
