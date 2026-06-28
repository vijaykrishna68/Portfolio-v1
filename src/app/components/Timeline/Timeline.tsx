import { useState } from "react";

import { Container } from "../shared/Container";
import { SectionLabel } from "../shared/SectionLabel";
import { timeline } from "../../content/projects";

import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-36 border-t border-border bg-secondary/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-3">
            <SectionLabel>Timeline</SectionLabel>
            <h2 className="mt-3 max-w-[10ch] text-3xl md:text-4xl text-foreground leading-[1.08]" style={{ fontFamily: "var(--font-display)" }}>
              How I got here.
            </h2>
            <p className="mt-4 text-[14px] text-muted-foreground leading-[1.7] max-w-[20rem]">
              A non-linear path through code, curiosity, and occasional chaos.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-5">
            <div className="relative">
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />
              {timeline.map((item, index) => {
                const isOpen = open === index;
                return <TimelineItem key={item.year} item={item} isOpen={isOpen} onToggle={() => setOpen(isOpen ? null : index)} />;
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}