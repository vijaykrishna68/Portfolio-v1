import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Container } from "../shared/Container";
import { Headline } from "../shared/Headline";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { getPlaygroundItems } from "../../lib/content";

import { PlaygroundCard } from "./PlaygroundCard";

/**
 * Desktop layout: a 3-column, 2-row grid that three tiles fill exactly: the
 * largest tile spans 2x2 on the left, the other two stack in the third column.
 * The MDX `layout.desktop` classes still say how big each tile is (col-span-N,
 * row-span-N); their explicit start positions (col-start-N, row-start-N) are
 * ignored so the tiles auto-place, largest first, with no empty cell. No MDX
 * frontmatter is touched. With a different number of tiles the grid still
 * flows, but may leave a gap: rebalance the spans in the MDX if that happens.
 */
function desktopTiles(items: ReturnType<typeof getPlaygroundItems>) {
  const area = (cls: string) =>
    Number(cls.match(/col-span-(\d+)/)?.[1] ?? 1) * Number(cls.match(/row-span-(\d+)/)?.[1] ?? 1);
  return [...items]
    .sort((a, b) => area(b.layout.desktop) - area(a.layout.desktop))
    .map((item) => ({ item, cls: item.layout.desktop.replace(/\b(?:col|row)-start-\d+\b/g, "").replace(/\s+/g, " ").trim() }));
}

export function Playground() {
  const items = getPlaygroundItems();

  return (
    <section id="playground" className="py-36 border-t border-hairline">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <Reveal>
            <div>
              <SectionLabel>Playground</SectionLabel>
              <Headline as="h2" className="mt-3 max-w-[12ch] text-3xl md:text-4xl text-foreground leading-[1.08]">
                Experiments & explorations.
              </Headline>
              <p className="mt-3 text-caption text-muted-foreground max-w-[22rem] leading-[1.7]">
                Tools, visualizations, and prototypes built to understand things better.
              </p>
            </div>
          </Reveal>
          <Link
            to="/playground"
            className="hidden md:flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground transition-colors group"
          >
            All experiments
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Desktop grid — Reveal wraps the container; PlaygroundCard keeps its placement class */}
        <Reveal className="hidden md:grid grid-cols-3 grid-rows-2 gap-6 h-[520px]">
          {desktopTiles(items).map(({ item, cls }) => (
            <PlaygroundCard key={item.slug} item={item} className={cls} />
          ))}
        </Reveal>

        {/* Mobile grid */}
        <Reveal className="md:hidden grid grid-cols-2 gap-6">
          {items.map((item) => (
            <PlaygroundCard key={item.slug} item={item} className={item.layout.mobile} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
