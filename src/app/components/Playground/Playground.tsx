import { Container } from "../shared/Container";
import { SectionLabel } from "../shared/SectionLabel";
import { playground } from "../../content/projects";

import { PlaygroundCard } from "./PlaygroundCard";

export function Playground() {
  return (
    <section id="playground" className="py-36 border-t border-border bg-secondary/30">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <div>
            <SectionLabel>Playground</SectionLabel>
            <h2 className="mt-3 max-w-[12ch] text-3xl md:text-4xl text-foreground leading-[1.08]" style={{ fontFamily: "var(--font-display)" }}>
              Experiments & explorations.
            </h2>
            <p className="mt-3 text-[14px] text-muted-foreground max-w-[22rem] leading-[1.7]">
              Tools, visualizations, and prototypes built to understand things better.
            </p>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[520px]">
          {playground.map((item) => (
            <PlaygroundCard key={item.id} item={item} className={item.gridClass} />
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-3">
          {playground.map((item) => (
            <PlaygroundCard key={item.id} item={item} className={item.mobileClass} />
          ))}
        </div>
      </Container>
    </section>
  );
}