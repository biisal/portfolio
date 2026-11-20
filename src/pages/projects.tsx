import { BlogList } from "@/components/blog/blog-list";
import { PageShell } from "@/components/page-shell";
import { Seo } from "@/components/seo";
import { getPosts } from "@/lib/blogs";

export default function ProjectsPage() {
  const projects = getPosts("project");

  return (
    <PageShell>
      <Seo
        title="Projects | Avisek Ray (biisal)"
        description="Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure."
        path="/projects"
      />
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
