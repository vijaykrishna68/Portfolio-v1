import { type Project } from "../../types/portfolio";
import { INTERACTION } from "../../lib/interaction";

type ProjectCardProps = {
  project: Project;
  isLast: boolean;
};

export function ProjectCard({ project, isLast }: ProjectCardProps) {
  return (
    <div className={`group/card py-16 border-t border-border ${INTERACTION.lift} hover:border-[#68b1f5]/20 ${isLast ? "border-b" : ""}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className={`lg:col-span-5 ${project.flip ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] text-[#68b1f5] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              {project.num}
            </span>
            <div className="w-6 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
              {project.year}
            </span>
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

          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className={`px-2.5 py-1 text-[11px] border border-border text-muted-foreground hover:border-[#68b1f5] hover:bg-[rgba(104,177,245,0.06)] ${INTERACTION.border}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="p-4 border-l-2 border-[#ffdf60] bg-[#ffdf60]/5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Impact
            </p>
            <p className="text-[14px] text-foreground font-medium leading-snug">{project.impact}</p>
          </div>
        </div>

        <div className={`lg:col-span-7 ${project.flip ? "lg:order-1" : "lg:order-2"} overflow-hidden`}>
          <div
            className="relative overflow-hidden bg-muted aspect-[16/10] border border-border group-hover/card:border-[#68b1f5]/30"
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              className={`w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover/card:scale-[1.03]`}
            />
            <div className="absolute inset-0 bg-foreground/8 group-hover/card:bg-transparent transition-colors duration-[250ms] ease-out" />
          </div>
        </div>
      </div>
    </div>
  );
}