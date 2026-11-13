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
            className={`inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground ${INTERACTION.color} font-mono`}
          >
            <ArrowLeft size={12} />
            All projects
          </Link>
        </Container>
      </div>

      {/* Hero */}
      <section className="pt-10 pb-16 border-b border-hairline">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-label text-accent tracking-widest uppercase font-mono"
              >
                {project.displayIndex}
              </span>
              <div className="w-6 h-px bg-hairline" />
              <span
                className="text-label text-muted-foreground tracking-wider font-mono"
              >
                {project.year}
              </span>
              {project.role && (
                <>
                  <div className="w-6 h-px bg-hairline" />
                  <span
                    className="text-label text-muted-foreground tracking-wider font-mono"
                  >
                    {project.role}
                  </span>
                </>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl text-foreground leading-[1.05] mb-5 font-display"
            >
              {project.title}
            </h1>

            {project.hook && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-5">
                {project.hook}
              </p>
            )}

            <p className="text-body text-muted-foreground leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Cover */}
      {project.cover && (
        <div className="border-b border-hairline bg-muted">
          <div className="max-w-5xl mx-auto">
            <img
              src={project.cover}
              alt={project.coverAlt ?? project.title}
              loading="lazy"
              decoding="async"
              className="w-full object-cover aspect-[16/9]"
            />
          </div>
        </div>
      )}

      {/* Impact row */}
      <section className="py-10 border-b border-hairline">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
            <div>
              <p
                className="text-label uppercase tracking-widest text-muted-foreground mb-1.5 font-mono"
              >
                Engineering Challenge
              </p>
              <p className="text-caption text-foreground/75 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="p-5 border border-signal/30 bg-signal-soft">
                <p
                  className="text-label uppercase tracking-widest text-muted-foreground mb-1.5 font-mono"
                >
                  Impact
                </p>
                <p className="text-caption text-foreground font-medium leading-snug">
                  {project.impact}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MDX Body */}
      <section className="py-16 border-b border-hairline">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Body components={MDX_COMPONENTS} />
          </div>
        </Container>
      </section>

      {/* Technologies */}
      <section className="py-12 border-b border-hairline">
        <Container>
          <div className="max-w-2xl mx-auto">
            <p
              className="text-label uppercase tracking-widest text-muted-foreground mb-5 font-mono"
            >
              Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 text-label border border-border text-muted-foreground hover:border-accent hover:bg-accent/5 ${INTERACTION.border} font-mono`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* External links */}
      {project.links &&
        (project.links.github || project.links.live || project.links.writeup || project.links.caseStudy) && (
        <section className="py-10 border-b border-hairline">
          <Container>
            <div className="max-w-2xl mx-auto flex flex-wrap gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-caption px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent ${INTERACTION.border}`}
                >
                  GitHub <ArrowUpRight size={12} />
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-caption px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent ${INTERACTION.border}`}
                >
                  Live demo <ArrowUpRight size={12} />
                </a>
              )}
              {project.links.writeup && (
                <a
                  href={project.links.writeup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-caption px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent ${INTERACTION.border}`}
                >
                  Writeup <ArrowUpRight size={12} />
                </a>
              )}
              {project.links.caseStudy && (
                <a
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-caption px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent ${INTERACTION.border}`}
                >
                  Case study <ArrowUpRight size={12} />
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
                className="text-label uppercase tracking-widest text-muted-foreground mb-4 font-mono"
              >
                Next project
              </p>
              <Link
                to={`/projects/${next.slug}`}
                className={`group inline-flex items-center gap-2 text-foreground hover:text-accent ${INTERACTION.color} font-display`}
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
