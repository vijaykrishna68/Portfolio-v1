import { ArrowRight, ExternalLink } from "lucide-react";

import { ButtonLink } from "../shared/Button";
import { SectionLabel } from "../shared/SectionLabel";
import { HeroStatus } from "./HeroStatus";

export function Hero() {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-10 max-w-[1320px] mx-auto pt-20 pb-14 md:pb-16">
      <div className="max-w-4xl lg:max-w-[920px]">
        <SectionLabel>Portfolio · 2025</SectionLabel>

        <h1
          className="mt-9 leading-[0.9] tracking-[-0.03em] group cursor-default select-none max-w-[10ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.75rem, 10vw, 9rem)",
          }}
        >
          <span className="inline-block text-foreground group-hover:text-[#68b1f5] transition-colors duration-700 ease-in-out">
            Vijay
          </span>
          <br />
          <span className="inline-block text-foreground group-hover:text-[#ffdf60] transition-colors duration-700 ease-in-out delay-75">
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

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-[13px]" style={{ fontFamily: "var(--font-mono)" }}>
          <span>Backend Engineer</span>
          <span className="text-[#68b1f5]">·</span>
          <span>Product Builder</span>
          <span className="text-[#68b1f5]">·</span>
          <span>Design Enthusiast</span>
        </div>

        <div className="mt-12 flex items-center gap-3 flex-wrap">
          <ButtonLink
            href="#work"
            variant="solid"
          >
            View Work <ArrowRight size={13} strokeWidth={2} />
          </ButtonLink>
          <ButtonLink
            href="#journal"
            variant="outline"
          >
            Read Journal <ExternalLink size={13} strokeWidth={1.5} />
          </ButtonLink>
        </div>
      </div>

      <div className="mt-auto pb-12 pt-20 flex items-center gap-3">
        <div className="w-10 h-px bg-border" />
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Scroll to explore
        </span>
      </div>
    </section>
  );
}