import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { BlogCard } from "@/components/blog/blog-card";
import { prisma } from "@/lib/prisma";

import { BlurFade } from "./ui/blur-fade";

const ProjectsIntro = async () => {
  let projects: BlogPost[] = [];
  try {
    projects = await prisma.blogPost.findMany({
      where: { published: true, isProject: true },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24">
      <div className="mb-12">
        <BlurFade delay={0.25} inView>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl md:text-5xl font-bold text-blog-white">
                <span className="text-blog-orange">Selected</span> Work
              </h2>
              <p className="mt-2 text-base text-blog-fg/80 md:text-lg">
                A smaller set of things worth opening after the writing.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-blog-orange transition-colors hover:text-blog-white mt-3"
            >
              View all
            </Link>
          </div>
        </BlurFade>
      </div>

      <div className="grid gap-6">
        {projects.map((post, index) => (
          <BlurFade key={post.id} delay={0.3 + index * 0.08} inView>
            <BlogCard post={post} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default ProjectsIntro;
