import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

import { ButtonLink } from "../shared/Button";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useNoHover } from "../../hooks/useNoHover";
import { HeroStatus } from "./HeroStatus";
import { HeroTechCluster } from "./HeroTechCluster";

// Touch devices have no cursor, so the hover-driven name-color interaction
// never fires there. Instead, on devices with no hover capability, the two
// existing color states simply alternate on a fixed 3s timer — desktop is
// completely unaffected (showAltName never becomes true when hover works).
const NAME_ALT_INTERVAL_MS = 3000;

export function Hero() {
  const noHover = useNoHover();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showAltName, setShowAltName] = useState(false);

  useEffect(() => {
    if (!noHover || prefersReducedMotion) {
      setShowAltName(false);
      return;
    }
    const id = window.setInterval(() => {
      setShowAltName((current) => !current);
    }, NAME_ALT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [noHover, prefersReducedMotion]);

  return (
    <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-10 max-w-[1320px] mx-auto pt-20 pb-14 md:pb-16">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
        {/* Main content block — entrance animation on page load */}
        <Reveal delay={60} className="md:col-span-7 max-w-4xl md:max-w-none">
          <SectionLabel>Portfolio · 2026</SectionLabel>

          <h1
            className="mt-9 leading-[0.9] tracking-[-0.03em] group cursor-default select-none max-w-[10ch] font-display"
            style={{
              fontSize: "clamp(3.75rem, 10vw, 9rem)",
            }}
          >
            <span className={`inline-block ${showAltName ? "text-accent" : "text-foreground"} group-hover:text-accent transition-colors duration-700 ease-in-out`}>
              Vijay
            </span>
            <br />
            <span className={`inline-block ${showAltName ? "text-tension" : "text-foreground"} group-hover:text-tension transition-colors duration-700 ease-in-out delay-75`}>
              Krishna.
            </span>
          </h1>

          <p
            className="mt-7 text-foreground/75 font-light leading-[1.35] max-w-[34rem]"
            style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)" }}
          >
            I build software that solves real problems.
          </p>

          <HeroStatus />

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-[13px] font-mono">
            <span>Full Stack Engineer</span>
            <span className="text-accent">·</span>
            <span>Pragmatic Developer</span>
            <span className="text-accent">·</span>
            <span>Open to Freelance Work</span>
          </div>

          <div className="mt-12 flex items-center gap-3 flex-wrap">
            <ButtonLink href="#work" variant="solid">
              View Work <ArrowRight size={13} strokeWidth={2} />
            </ButtonLink>
            <ButtonLink href="#journal" variant="outline">
              Read Journal <ExternalLink size={13} strokeWidth={1.5} />
            </ButtonLink>
          </div>

          {/* Mobile: same technology chips, static and unanimated */}
          <HeroTechCluster variant="mobile" className="mt-12 md:hidden" />
        </Reveal>

        {/* Technology ecosystem visual — reduced cluster on tablet, full cluster on desktop */}
        <Reveal delay={200} className="hidden md:block lg:hidden md:col-span-5">
          <HeroTechCluster variant="tablet" />
        </Reveal>
        <Reveal delay={200} className="hidden lg:block lg:col-span-5">
          <HeroTechCluster variant="desktop" />
        </Reveal>
      </div>

      {/* Scroll indicator — delayed so it appears after the heading settles */}
      <Reveal delay={500} className="mt-auto pb-12 pt-20 flex items-center gap-3">
        <div className="w-10 h-px bg-border" />
        <span
          className="text-label uppercase tracking-[0.2em] text-muted-foreground font-mono"
        >
          Scroll to explore
        </span>
      </Reveal>

    </section>
  );
}
