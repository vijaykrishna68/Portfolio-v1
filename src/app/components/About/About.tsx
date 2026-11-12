import { Container } from "../shared/Container";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { aboutStats, PORTRAIT_SRC } from "../../content/site";

export function About() {
  return (
    <section id="about" className="py-36 border-t border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left column — portrait (if set) + quote */}
          <Reveal delay={0} className="lg:col-span-4">
            {PORTRAIT_SRC && (
              <div className="mb-10 w-[78%] max-w-[300px] overflow-hidden rounded-slab bg-muted aspect-[3/4]">
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
                className="font-text font-semibold text-subhead text-foreground max-w-[28ch]"
              >
                "Software should solve problems, not create them."
              </p>
            </div>
            <div className="mt-8 w-10 h-0.5 bg-accent" />
          </Reveal>

          {/* Right column — bio + stats */}
          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-5 text-body text-foreground/80 leading-[1.75] max-w-[40rem]">
              <p>
                I'm Vijay Krishna, a backend engineer based in Chennai / Bangalore, India. I care deeply
                about building systems that are simple, correct, and maintainable — in roughly
                that order.
              </p>
              <p>
                My background is in distributed systems and API design. I've built pipelines that
                process patient vitals in real-time and scheduling engines for factory floors.
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
                  <p className="text-label uppercase tracking-widest text-muted-foreground mb-1 font-mono">
                    {label}
                  </p>
                  <p className="text-caption text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
