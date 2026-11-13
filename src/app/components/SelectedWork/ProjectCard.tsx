import { type Project } from "../../lib/content";
import { INTERACTION } from "../../lib/interaction";
import { Figure } from "../shared/Figure";
import { Label } from "../shared/Label";
import { Slab } from "../shared/Slab";

type ProjectCardProps = {
  project: Project;
  isLast?: boolean;
  /**
   * "default" — the full-detail treatment used by the /projects catalog
   * (ProjectsIndex), where thorough browsing is the point.
   * "dominant" / "compact" — homepage-only, curated "proof not documentation"
   * treatment: the Engineering Challenge prose is dropped entirely, and only
   * the primary project keeps a one-line description.
   */
  variant?: "default" | "dominant" | "compact";
};

/** Every card is a Slab: panel face, 2px radius, 1.5px line border, no shadow. */
export function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  if (variant === "dominant") return <DominantCard project={project} />;
  if (variant === "compact") return <CompactCard project={project} />;
  return <DefaultCard project={project} />;
}

function TechPills({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.technologies.map((tech) => (
        <span key={tech} className="type-label px-2.5 py-1 rounded-slab bg-stone text-ink">
          {tech}
        </span>
      ))}
    </div>
  );
}

// showIndex controls the catalog displayIndex ("01", "02"...) only: it reads as
// "this project's position in /projects" there, but is confusing on the
// homepage where featuredIndex decides order. The year is always shown.
function IndexMeta({ project, showIndex = true }: { project: Project; showIndex?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {showIndex && (
        <>
          <span className="type-label text-accent">{project.displayIndex}</span>
          <div className="w-6 h-px bg-hairline" />
        </>
      )}
      <Label>{project.year}</Label>
    </div>
  );
}

/**
 * The outcome. When the project states a real number (frontmatter `figure`,
 * copied from the impact sentence) it is a Figure: Doto digits, label, and the
 * impact sentence as the caption. Otherwise it is a quiet mist band with the text.
 */
export function Outcome({ project, size }: { project: Project; size?: number }) {
  if (project.figure) {
    return (
      <Figure
        value={project.figure.value}
        unit={project.figure.unit}
        label={project.figure.label}
        caption={project.impact}
        size={size}
        variant="stone"
      />
    );
  }
  return (
    <Slab variant="mist">
      <Label className="block mb-2 !text-ink">Impact</Label>
      <p className="text-body text-ink font-semibold leading-snug">{project.impact}</p>
    </Slab>
  );
}

function CoverFrame({ project, ratio, className = "" }: { project: Project; ratio: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-stone border-stroke border-line rounded-slab ${ratio} ${className}`.trim()}>
      <img
        src={project.cover}
        alt={project.coverAlt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
      />
    </div>
  );
}

// Every published project, every field shown (ProjectsIndex).
function DefaultCard({ project }: { project: Project }) {
  return (
    <Slab padded={false} className={`group/card p-6 md:p-8 ${INTERACTION.lift}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className={`lg:col-span-5 ${project.displayLayout === "flip" ? "lg:order-2" : "lg:order-1"}`}>
          <div className="mb-6">
            <IndexMeta project={project} />
          </div>

          <h3 className="text-2xl md:text-headline-s text-foreground leading-[0.95] mb-5 font-display">{project.title}</h3>

          <p className="text-body text-ink-muted mb-8">{project.description}</p>

          <div className="mb-8 pl-4 border-l-[length:var(--stroke-slab)] border-accent">
            <Label className="block mb-1.5">Engineering Challenge</Label>
            <p className="text-caption text-ink-muted">{project.challenge}</p>
          </div>

          <div className="mb-8">
            <TechPills project={project} />
          </div>

          <Outcome project={project} />
        </div>

        <div className={`lg:col-span-7 ${project.displayLayout === "flip" ? "lg:order-1" : "lg:order-2"}`}>
          <CoverFrame project={project} ratio={project.featuredIndex === "01" ? "aspect-[16/9]" : "aspect-[16/10]"} />
        </div>
      </div>
    </Slab>
  );
}

// Homepage: the primary featured project. Large image and the one place on the
// homepage a project keeps its description line.
function DominantCard({ project }: { project: Project }) {
  return (
    <Slab padded={false} className={`group/card p-6 md:p-8 ${INTERACTION.lift}`}>
      <div className="mb-6">
        <IndexMeta project={project} showIndex={false} />
      </div>

      <CoverFrame project={project} ratio="aspect-[16/9]" />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <h3 className="text-display-section text-foreground leading-[0.95] font-display">{project.title}</h3>
          <p className="mt-4 text-body text-ink-muted max-w-[62ch]">{project.description}</p>
          <div className="mt-6">
            <TechPills project={project} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <Outcome project={project} />
        </div>
      </div>
    </Slab>
  );
}

// Homepage: supporting projects. Small thumbnail, title, tech pills and a
// short impact mention; the full story is one click away.
function CompactCard({ project }: { project: Project }) {
  return (
    <Slab padded={false} className={`group/card flex gap-5 p-5 h-full ${INTERACTION.subtleLift}`}>
      <div className="relative w-24 sm:w-32 flex-none self-start overflow-hidden bg-stone aspect-[4/3] border-stroke border-line rounded-slab">
        <img
          src={project.cover}
          alt={project.coverAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2">
          <IndexMeta project={project} showIndex={false} />
        </div>

        <h3 className="text-xl text-foreground leading-[0.95] font-display">{project.title}</h3>

        <div className="mt-3">
          <TechPills project={project} />
        </div>

        <div className="mt-3 pl-2.5 border-l-[length:var(--stroke-slab)] border-accent">
          <p className="text-caption text-ink line-clamp-2">{project.impact}</p>
        </div>
      </div>
    </Slab>
  );
}
