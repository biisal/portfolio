import { Metadata } from "next";
import { headers } from "next/headers";

import { BlogList } from "@/components/blog/blog-list";
import { getblogPost } from "@/lib/actions/blogs";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Projects | Avisek Ray (biisal)",
  description:
    "Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure.",
  openGraph: {
    title: "Projects | Avisek Ray (biisal)",
    description:
      "Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure.",
    url: "https://codeltix.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Avisek Ray (biisal)",
    description:
      "Portfolio of projects built with Next.js, Go, Python, and more.",
  },
};

export const revalidate = 600;

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allPosts = await getblogPost();
  const projects = allPosts.filter((post) => post.isProject);

  return (
    <div className="min-h-screen p-8 md:p-20 text-blog-fg">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blog-orange">Projects</h1>
          <p className="text-xl text-blog-fg opacity-80">
            A collection of things I&apos;ve built.
          </p>
        </header>

        {!projects || projects.length === 0 ? (
          <p className="text-lg text-blog-fg opacity-80">No projects found.</p>
        ) : (
          <BlogList posts={projects} session={session} />
        )}
      </div>
    </div>
  );
}
