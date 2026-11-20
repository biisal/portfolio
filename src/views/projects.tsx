import { BlogList } from "@/components/blog/blog-list";
import { PageShell } from "@/components/page-shell";
import type { BlogPost } from "@/lib/types";

export default function ProjectsPage({ projects }: { projects: BlogPost[] }) {

  return (
    <PageShell>
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-normal mb-4 text-blog-white md:text-6xl">
          Projects
        </h1>
        <p className="text-xl text-blog-fg opacity-80">
          A collection of things I&apos;ve built.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-lg text-blog-fg opacity-80">No projects found.</p>
      ) : (
        <BlogList posts={projects} />
      )}
    </PageShell>
  );
}
