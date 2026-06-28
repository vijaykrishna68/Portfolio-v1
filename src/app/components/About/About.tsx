import { Container } from "../shared/Container";
import { SectionLabel } from "../shared/SectionLabel";
import { aboutStats } from "../../content/site";

export function About() {
  return (
    <section id="about" className="py-36 border-t border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
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
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
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
          </div>
        </div>
      </Container>
    </section>
  );
}