import { ArrowRight, ExternalLink } from "lucide-react";

import { ButtonLink } from "../shared/Button";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { HeroStatus } from "./HeroStatus";
import { HeroComposition } from "./HeroComposition";

export function Hero() {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-10 max-w-[1320px] mx-auto pt-20 pb-14 md:pb-16">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
        {/* Main content block — entrance animation on page load */}
        <Reveal delay={60} className="md:col-span-7 max-w-4xl md:max-w-none">
          <SectionLabel>Portfolio · 2026</SectionLabel>

          <h1
            className="mt-9 leading-[0.9] tracking-[-0.03em] cursor-default select-none max-w-[10ch] font-display text-ink"
            style={{
              fontSize: "clamp(3.75rem, 10vw, 9rem)",
            }}
          >
            <span className="inline-block">Vijay</span>
            <br />
            <span className="inline-block">Krishna.</span>
          </h1>

          <p
            className="mt-7 text-foreground/75 font-light leading-[1.35] max-w-[34rem]"
            style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)" }}
          >
            I build software that solves real problems.
          </p>

          <HeroStatus />

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-caption font-mono">
            <span>Full Stack Engineer</span>
            <span>·</span>
            <span>Pragmatic Developer</span>
            <span>·</span>
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

          {/* Mobile: the composition sits under the text */}
          <HeroComposition className="mt-12 md:hidden" />
        </Reveal>

        {/* Right column: one accent slab with the VK mark, one tension block, one lit sun */}
        <Reveal delay={200} className="hidden md:block md:col-span-5">
          <HeroComposition className="ml-auto" />
        </Reveal>
      </div>

      {/* Scroll indicator — delayed so it appears after the heading settles */}
      <Reveal delay={500} className="mt-auto pb-12 pt-20 flex items-center gap-3">
        <div className="w-10 h-px bg-hairline" />
        <span
          className="text-label uppercase tracking-[0.2em] text-muted-foreground font-mono"
        >
          Scroll to explore
        </span>
      </Reveal>

    </section>
  );
}
