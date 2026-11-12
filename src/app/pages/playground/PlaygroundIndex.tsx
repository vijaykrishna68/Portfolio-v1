import { Link } from "react-router";

import { Container } from "../../components/shared/Container";
import { SectionLabel } from "../../components/shared/SectionLabel";
import { getPlaygroundItems } from "../../lib/content";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PlaygroundIndex() {
  usePageTitle("Playground");
  const items = getPlaygroundItems();

  return (
    <section className="pt-36 pb-24">
      <Container>
        <div className="mb-16">
          <SectionLabel>Playground</SectionLabel>
          <h1
            className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight font-display"
          >
            Experiments & explorations.
          </h1>
          <p className="mt-3 text-caption text-muted-foreground max-w-[22rem] leading-[1.7]">
            Tools, visualizations, and prototypes built to understand things better.
          </p>
        </div>

        {items.length === 0 && (
          <p className="text-body text-muted-foreground py-16">No experiments yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/playground/${item.slug}`}
              className="block group"
            >
              <div className="relative overflow-hidden bg-muted aspect-[4/3] border border-dashed border-transparent transition-[transform,border-color] duration-200 ease-out hover:z-10 hover:scale-[1.015] hover:-rotate-[0.4deg] hover:border-accent/45">
                {item.cover && (
                  <img
                    src={item.cover}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                )}
                <div className="playground-scrim absolute inset-0 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                  <span
                    className="text-label tracking-widest uppercase text-glass-ink mb-1 block font-mono"
                  >
                    {item.tags[0]}
                  </span>
                  <h2 className="text-body font-medium text-glass-ink leading-tight">{item.title}</h2>
                  <p className="text-caption text-glass-ink mt-0.5 line-clamp-1">{item.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
