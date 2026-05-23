import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Project } from "@/.generated/client";
import { prisma } from "@/lib/prisma";

import ProjectSmallCard from "./project-small-card";
import { BlurFade } from "./ui/blur-fade";

const ProjectsIntro = async () => {
  let projects: Project[] = [];
  try {
    projects = await prisma.project.findMany();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  if (projects.length === 0) return "lol";

  return (
    <section id="projects" className="py-24">
      <div className="mb-12">
        <BlurFade delay={0.25} inView>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-white">
              <span className="text-blog-orange">Selected</span> Work
            </h2>
            <p className="mt-2 text-base text-blog-fg/80 md:text-lg">
              A smaller set of things worth opening after the writing.
            </p>
          </div>
        </BlurFade>
      </div>

      <div className="mt-8 grid gap-5">
        {projects?.map((project, index) => (
          <BlurFade key={project.id} delay={0.25 + index * 0.08} inView>
            <Link
              href={`/project/${project.slug}`}
              className="group flex flex-col gap-6 rounded-lg border border-blog-inactive-border bg-blog-bg p-5 transition-colors hover:border-blog-orange sm:flex-row md:gap-8 md:p-6"
            >
              <div className="relative w-full shrink-0 sm:w-64 md:w-72">
                <ProjectSmallCard
                  img_url={project.thumbnail}
                  title={project.title}
                  excerpt={project.excerpt}
                />
              </div>

              <div className="min-w-0 flex-1 py-1">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-mono text-blog-fg/60 md:text-sm">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-blog-fg/30">—</span>
                  {project.tags?.[0] && <span>{project.tags[0]}</span>}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-blog-white transition-colors group-hover:text-blog-orange md:text-3xl">
                  {project.title}
                </h3>
                <p className="max-w-2xl line-clamp-3 text-base leading-7 text-blog-fg/80 md:text-lg">
                  {project.excerpt}
                </p>

                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="rounded-md border border-blog-orange/20 
                        bg-blog-orange/8 px-3 py-1 text-xs font-medium text-blog-orange"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blog-orange">
                  <span>View project</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default ProjectsIntro;
