import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Container } from "../../components/shared/Container";
import { getProjectBySlug, getProjects } from "../../lib/content";
import { MDX_COMPONENTS } from "../../lib/mdx/components";
import { INTERACTION } from "../../lib/interaction";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug!);

  usePageTitle(project?.title);

  if (!project) return <Navigate to="/404" replace />;

  const Body = project.Component;

  const allProjects = getProjects();
  const idx = allProjects.findIndex((p) => p.slug === slug);
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : allProjects[0];
  // console.log("PROJECT:", project);
  // console.log("COVER:", project.cover);
  // alert(project.cover);
  return (
    <article>
      {/* Back */}
      <div className="pt-24 pb-0">
        <Container>
          <Link
            to="/projects"
            className={`inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground ${INTERACTION.color}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft size={12} />
            All projects
          </Link>
        </Container>
      </div>

      {/* Hero */}
      <section className="pt-10 pb-16 border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-[10px] text-[#68b1f5] tracking-widest uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {project.displayIndex}
              </span>
              <div className="w-6 h-px bg-border" />
              <span
                className="text-[10px] text-muted-foreground tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {project.year}
              </span>
              {project.role && (
                <>
                  <div className="w-6 h-px bg-border" />
                  <span
                    className="text-[10px] text-muted-foreground tracking-wider"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {project.role}
                  </span>
                </>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl text-foreground leading-[1.05] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h1>

            {project.hook && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-5">
                {project.hook}
              </p>
            )}

            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Cover */}
      {project.cover && (
        <div className="border-b border-border bg-muted">
          <div className="max-w-5xl mx-auto">
            <img
              src={project.cover}
              alt={project.coverAlt ?? project.title}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        </div>
      )}

      {/* Impact row */}
      <section className="py-10 border-b border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Engineering Challenge
              </p>
              <p className="text-[13px] text-foreground/75 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div className="md:col-span-2">
              <p
                className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Impact
              </p>
              <p className="text-[14px] text-foreground font-medium leading-snug">
                {project.impact}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* MDX Body */}
      <section className="py-16 border-b border-border">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Body components={MDX_COMPONENTS} />
          </div>
        </Container>
      </section>

      {/* Technologies */}
      <section className="py-12 border-b border-border">
        <Container>
          <div className="max-w-2xl mx-auto">
            <p
              className="text-[10px] uppercase tracking-widest text-muted-foreground mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] border border-border text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* External links */}
      {project.links && (project.links.github || project.links.live) && (
        <section className="py-10 border-b border-border">
          <Container>
            <div className="max-w-2xl mx-auto flex flex-wrap gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[13px] px-4 py-2 border border-border text-foreground hover:border-[#68b1f5] hover:text-[#68b1f5] ${INTERACTION.border}`}
                >
                  GitHub <ArrowUpRight size={12} />
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[13px] px-4 py-2 border border-border text-foreground hover:border-[#68b1f5] hover:text-[#68b1f5] ${INTERACTION.border}`}
                >
                  Live demo <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Next project */}
      {next && (
        <section className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto">
              <p
                className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Next project
              </p>
              <Link
                to={`/projects/${next.slug}`}
                className={`group inline-flex items-center gap-2 text-foreground hover:text-[#68b1f5] ${INTERACTION.color}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-2xl">{next.title}</span>
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
