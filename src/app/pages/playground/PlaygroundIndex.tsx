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
            className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Experiments & explorations.
          </h1>
          <p className="mt-3 text-[14px] text-muted-foreground max-w-[22rem] leading-[1.7]">
            Tools, visualizations, and prototypes built to understand things better.
          </p>
        </div>

        {items.length === 0 && (
          <p className="text-[15px] text-muted-foreground py-16">No experiments yet.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/playground/${item.slug}`}
              className="block group"
            >
              <div className="relative overflow-hidden bg-muted aspect-[4/3]">
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/30 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className="text-[9px] tracking-widest uppercase text-white/55 mb-1 block"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.tags[0]}
                  </span>
                  <h2 className="text-[15px] font-medium text-white leading-tight">{item.title}</h2>
                  <p className="text-[12px] text-white/55 mt-0.5 line-clamp-1">{item.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
