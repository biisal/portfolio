"use client";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { BlogPreview } from "@/components/blog/blog-preview";
import { Button } from "@/components/ui/button";
import { JetBrainsMono } from "@/fonts";
import { ProjectInterface } from "@/lib/schema/project.schema";
import { cn } from "@/lib/utils";

import ProjectSmallCard from "./project-small-card";
import { BlurFade } from "./ui/blur-fade";

const ProjectShow = ({ project }: { project: ProjectInterface }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={cn(
        "pb-28 pt-8 px-8 md:px-20 md:pt-20",
        JetBrainsMono.className,
      )}
    >
      <div className="mx-auto min-h-screen max-w-4xl">
        <div className="flex flex-col gap-14">
          <div className="w-full flex flex-col items-start justify-start">
            <BlurFade delay={0.08} inView>
              <Link
                href="/#projects"
                className="mb-8 inline-flex items-center gap-2 text-sm text-blog-fg/65 transition-colors hover:text-blog-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to selected work
              </Link>
            </BlurFade>

            <BlurFade delay={0.12} inView>
              <h2 className="text-3xl font-bold text-blog-white md:text-4xl lg:text-5xl">
                {project.title}
              </h2>
            </BlurFade>

            <div className="mb-8 flex flex-col gap-4">
              {formattedDate && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blog-black">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              )}

              <p className="max-w-3xl text-base leading-8 text-blog-fg md:text-lg">
                {project.excerpt}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="rounded-full border border-blog-orange/20 bg-blog-orange/8 px-3 py-1 text-xs font-medium text-blog-orange"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {project.link && (
                  <Button
                    size="lg"
                    className="rounded-lg border border-blog-orange bg-blog-orange px-6 py-6 text-base font-semibold text-blog-bg shadow-none transition hover:opacity-90"
                    asChild
                  >
                    <Link
                      href={project.link}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-5 h-5" />
                      View Live
                      <ArrowRight className="w-4 h-4 -rotate-45" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="block relative">
              <BlurFade delay={0.25} inView>
                <div className="rounded-lg border border-blog-inactive-border bg-blog-bg p-4 md:p-5">
                  <ProjectSmallCard
                    img_url={project.thumbnail}
                    title={project.title}
                    excerpt={project.excerpt}
                  />
                </div>
              </BlurFade>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="relative">
                <BlurFade delay={0.4} inView>
                  <div className="rounded-lg border border-blog-inactive-border bg-blog-bg p-6 md:p-8">
                    <h2 className="mb-6 text-2xl font-bold text-blog-white md:text-3xl">
                      Tech Stack
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {project.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-blog-inactive-border bg-[#0d1020] px-4 py-3 text-center text-sm font-medium text-blog-fg transition-colors duration-300 hover:border-blog-orange hover:text-blog-white"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </BlurFade>
              </div>
            )}

            {project.description && (
              <div className="relative">
                <BlurFade delay={0.5} inView>
                  <div className="rounded-lg border border-blog-inactive-border bg-blog-bg p-6 md:p-8">
                    <h2 className="mb-6 text-2xl font-bold text-blog-white md:text-3xl">
                      Project Overview
                    </h2>

                    <BlogPreview content={project.description} />
                  </div>
                </BlurFade>
              </div>
            )}

            <BlurFade delay={0.6} inView>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-blog-orange/20 to-transparent"></div>
              <div className="relative pt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <Link
                    href="/#projects"
                    className="group inline-flex items-center gap-2 text-blog-fg/70 transition-colors hover:text-blog-orange"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to selected work
                  </Link>

                  {project.link && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-lg border-blog-orange/30 text-blog-orange hover:border-blog-orange hover:bg-blog-orange/10"
                      asChild
                    >
                      <Link
                        href={project.link}
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShow;
