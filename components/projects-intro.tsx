import Link from "next/link";

import { Project } from "@/.generated/client";
import {
  Timeline,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@/components/reui/timeline";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

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
    <div id="projects" className="max-w-6xl mb-20 py-24">
      <div className="mb-16">
        <BlurFade delay={0.25} inView>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-6xl font-bold flex items-start justify-start flex-wrap gap-3">
              <span className="text-primary">Selected</span>
              <span className="text-white">Works</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-2">
              A collection of projects I&apos;ve built and designed
            </p>
          </div>
        </BlurFade>
      </div>

      <div className="mt-8 ml-4 md:ml-6">
        <Timeline defaultValue={1} className="w-full">
          {projects?.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <BlurFade key={index} delay={0.25 + index * 0.1} inView>
                <TimelineItem step={index + 1} className="group pb-12">
                  <TimelineIndicator className="bg-background border-white/20 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300" />
                  <TimelineSeparator
                    className={cn(
                      "bg-white/10",
                      index !== projects.length - 1 ? "!block" : "hidden",
                    )}
                  />

                  <TimelineContent className="mt-0 pt-0">
                    <Link
                      href={`/project/${project.slug}`}
                      className="block w-full"
                    >
                      <div
                        className={cn(
                          "grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8",
                          "p-6 md:p-8 rounded-2xl",
                          "bg-gradient-to-br from-muted/5 via-muted/10 to-transparent",
                          "border border-white/5",
                          "group-hover:border-primary/30",
                          "group-hover:shadow-2xl group-hover:shadow-primary/10",
                          "transition-all duration-500 backdrop-blur-sm",
                        )}
                      >
                        <div
                          className={cn(
                            "lg:col-span-3",
                            isEven ? "lg:order-1" : "lg:order-2",
                          )}
                        >
                          <ProjectSmallCard
                            img_url={project.thumbnail}
                            title={project.title}
                            excerpt={project.excerpt}
                          />
                        </div>

                        <div
                          className={cn(
                            "lg:col-span-2 flex flex-col justify-center gap-4",
                            isEven ? "lg:order-2" : "lg:order-1",
                          )}
                        >
                          <div className="text-6xl font-bold text-primary/10 leading-none">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                            {project.title}
                          </h3>

                          <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3">
                            {project.excerpt}
                          </p>

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground px-3 py-1">
                                  +{project.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-2 group-hover:gap-4 transition-all duration-300">
                            <span>View Project</span>
                            <svg
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </TimelineContent>
                </TimelineItem>
              </BlurFade>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

export default ProjectsIntro;
