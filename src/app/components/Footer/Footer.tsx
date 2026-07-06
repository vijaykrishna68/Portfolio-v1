import { ArrowRight } from "lucide-react";

import { Container } from "../shared/Container";
import { Reveal } from "../shared/Reveal";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "../../content/site";
import { INTERACTION } from "../../lib/interaction";

export function Footer() {
  return (
    <footer id="contact" className="py-24 border-t border-border">
      <Container>
        <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-end">

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              Contact
            </p>
            <h2 className="mt-3 max-w-[10ch] text-3xl md:text-4xl text-foreground leading-[1.08]" style={{ fontFamily: "var(--font-display)" }}>
              Let's build something
              <br />
              worth building.
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`mt-6 inline-flex items-center gap-2 text-[15px] text-[#68b1f5] hover:gap-3 ${INTERACTION.border}`}
            >
              {CONTACT_EMAIL} <ArrowRight size={14} />
            </a>
          </div>

          <div className="md:text-right">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:justify-end">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`flex items-center gap-2 text-[13px] text-muted-foreground group ${INTERACTION.color} hover:text-[#68b1f5]`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span className="relative inline-flex items-center pb-0.5">
                    {label}
                    <span className={`absolute left-0 -bottom-0.5 h-px w-0 bg-[#68b1f5] ${INTERACTION.underline} group-hover:w-full`} />
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-10 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              Vijay Krishna · {new Date().getFullYear()} · Bengaluru, India
            </p>
          </div>

        </Reveal>
      </Container>
    </footer>
  );
}
