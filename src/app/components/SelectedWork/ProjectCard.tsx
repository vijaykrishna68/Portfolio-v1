import { type Project } from "../../lib/content";
import { INTERACTION } from "../../lib/interaction";

type ProjectCardProps = {
  project: Project;
  isLast?: boolean;
  /**
   * "default" — the unchanged, full-detail treatment used by the /projects
   * catalog (ProjectsIndex), where thorough browsing is the point.
   * "dominant" / "compact" — homepage-only, curated "proof not documentation"
   * treatment: the Engineering Challenge prose is dropped entirely, and only
   * the primary project keeps a one-line description.
   */
  variant?: "default" | "dominant" | "compact";
};

export function ProjectCard({ project, isLast = false, variant = "default" }: ProjectCardProps) {
  if (variant === "dominant") return <DominantCard project={project} />;
  if (variant === "compact") return <CompactCard project={project} />;
  return <DefaultCard project={project} isLast={isLast} />;
}

function TechPills({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.technologies.map((tech) => (
        <span
          key={tech}
          className={`px-2.5 py-1 text-[11px] border border-border text-muted-foreground hover:border-[#68b1f5] hover:bg-[rgba(104,177,245,0.06)] ${INTERACTION.border}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

// showIndex controls the catalog displayIndex ("01", "02"...) only — it
// reads correctly as "this project's position in /projects" there, but is
// confusing on the homepage where featuredIndex (not displayIndex) decides
// order. The year is always shown; only the catalog number is optional.
function IndexMeta({ project, showIndex = true }: { project: Project; showIndex?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {showIndex && (
        <>
          <span className="text-[10px] text-[#68b1f5] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>
            {project.displayIndex}
          </span>
          <div className="w-6 h-px bg-border" />
        </>
      )}
      <span className="text-[10px] text-muted-foreground tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
        {project.year}
      </span>
    </div>
  );
}

// The unchanged original card — every published project, every field shown.
// Still used as-is by ProjectsIndex ("/projects"), which is a catalog page
// where full detail per card is the point, unlike the curated homepage.
function DefaultCard({ project, isLast }: { project: Project; isLast: boolean }) {
  return (
    <div className={`group/card py-16 border-t border-border ${INTERACTION.lift} hover:border-[#68b1f5]/20 ${isLast ? "border-b" : ""}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className={`lg:col-span-5 ${project.displayLayout === "flip" ? "lg:order-2" : "lg:order-1"}`}>
          <div className="mb-6">
            <IndexMeta project={project} />
          </div>

          <h3 className="text-2xl md:text-[1.875rem] text-foreground leading-snug mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {project.title}
          </h3>

          <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">{project.description}</p>

          <div className="mb-8 pl-4 border-l-2 border-[#68b1f5]/25">
            <p className="text-[10px] uppercase tracking-widest text-[#68b1f5] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Engineering Challenge
            </p>
            <p className="text-[14px] text-foreground/75 leading-relaxed">{project.challenge}</p>
          </div>

          <div className="mb-8">
            <TechPills project={project} />
          </div>

          <div className="p-4 border-l-2 border-[#ffdf60] bg-[#ffdf60]/5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Impact
            </p>
            <p className="text-[14px] text-foreground font-medium leading-snug">{project.impact}</p>
          </div>
        </div>

        <div className={`lg:col-span-7 ${project.displayLayout === "flip" ? "lg:order-1" : "lg:order-2"} overflow-hidden`}>
          <div
            className={`relative overflow-hidden bg-muted border border-border group-hover/card:border-[#68b1f5]/30 ${
              project.featuredIndex === "01" ? "aspect-[9/4]" : "aspect-[16/10]"
            }`}
          >
            <img
              src={project.cover}
              alt={project.coverAlt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover/card:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-foreground/8 group-hover/card:bg-transparent transition-colors duration-[250ms] ease-out" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage — the primary featured project. Large image, spotlight hover,
// and the one place on the homepage a project keeps its description line.
function DominantCard({ project }: { project: Project }) {
  return (
    <div className={`group/card pt-16 pb-14 border-t border-b border-border ${INTERACTION.lift} hover:border-[#68b1f5]/20`}>
      <div className="mb-7">
        <IndexMeta project={project} showIndex={false} />
      </div>

      <div className="relative overflow-hidden bg-muted aspect-[9/4] border border-border group-hover/card:border-[#68b1f5]/30 group-hover/card:shadow-glow transition-shadow duration-300">
        <img
          src={project.cover}
          alt={project.coverAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-foreground/8 group-hover/card:bg-transparent transition-colors duration-300" />
      </div>

      <div className="mt-9 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <h3 className="text-display-section text-foreground leading-[1.08]" style={{ fontFamily: "var(--font-display)" }}>
            {project.title}
          </h3>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed max-w-[42rem]">{project.description}</p>
          <div className="mt-6">
            <TechPills project={project} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="p-5 border border-signal/30 bg-signal-soft">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Impact
            </p>
            <p className="text-[15px] text-foreground font-medium leading-snug">{project.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage — supporting projects. Small thumbnail, title, tech pills, and a
// single-line impact mention. No description, no challenge prose — the full
// story is one click away on the project's detail page.
function CompactCard({ project }: { project: Project }) {
  return (
    <div className={`group/card flex gap-5 py-8 border-t border-border md:px-8 first:md:pl-0 last:md:pr-0 ${INTERACTION.subtleLift}`}>
      <div className="relative w-24 sm:w-32 flex-none self-start overflow-hidden bg-muted aspect-[4/3] border border-border group-hover/card:border-[#68b1f5]/30">
        <img
          src={project.cover}
          alt={project.coverAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.04]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2">
          <IndexMeta project={project} showIndex={false} />
        </div>

        <h3 className="text-[17px] text-foreground leading-snug" style={{ fontFamily: "var(--font-display)" }}>
          {project.title}
        </h3>

        <div className="mt-2.5">
          <TechPills project={project} />
        </div>

        <div className="mt-3 pl-2.5 border-l-2 border-signal/70">
          <p className="text-[12px] text-foreground/85 leading-snug line-clamp-2">{project.impact}</p>
        </div>
      </div>
    </div>
  );
}
