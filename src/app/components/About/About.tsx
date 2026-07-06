import { Container } from "../shared/Container";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { aboutStats, PORTRAIT_SRC } from "../../content/site";

import { TechStrip } from "./TechStrip";

export function About() {
  return (
    <section id="about" className="py-36 border-t border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left column — portrait (if set) + quote */}
          <Reveal delay={0} className="lg:col-span-4">
            {PORTRAIT_SRC && (
              <div className="mb-10 w-[78%] overflow-hidden rounded-[6px] bg-muted aspect-[3/4]">
                <img
                  src={PORTRAIT_SRC}
                  alt="Portrait of Vijay Krishna"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}
            <SectionLabel>About</SectionLabel>
            <div className="mt-10">
              <p
                className="text-foreground leading-[1.08] tracking-tight max-w-[11ch]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.9rem, 3.5vw, 3rem)",
                  fontStyle: "italic",
                }}
              >
                "Software should solve problems, not create them."
              </p>
            </div>
            <div className="mt-8 w-10 h-0.5 bg-[#ffdf60]" />
          </Reveal>

          {/* Right column — bio + stats + tech strip */}
          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-5 text-[16px] text-foreground/80 leading-[1.75] max-w-[40rem]">
              <p>
                I'm Vijay Krishna, a backend engineer based in Bengaluru, India. I care deeply
                about building systems that are simple, correct, and maintainable — in roughly
                that order.
              </p>
              <p>
                My background is in distributed systems and API design. I've built pipelines that
                process patient vitals in real-time, scheduling engines for factory floors, and
                gateways serving millions of requests per day.
              </p>
              <p>
                I think the best engineers are also good product thinkers. Code is a means, not an
                end. The best systems are the ones you barely notice.
              </p>
              <p>
                When I'm not writing code, I'm reading about systems design, writing for this
                journal, or building small tools just to understand how something works.
              </p>
            </div>

            <div className="mt-11 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-7 border-t border-border">
              {aboutStats.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                    {label}
                  </p>
                  <p className="text-[13px] text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <TechStrip />
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
