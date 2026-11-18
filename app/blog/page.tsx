import { Metadata } from "next";
import { headers } from "next/headers";

import { BlogList } from "@/components/blog/blog-list";
import { getblogPost } from "@/lib/actions/blogs";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Blog | Avisek Ray (biisal)",
  description:
    "Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering.",
  openGraph: {
    title: "Blog | Avisek Ray (biisal)",
    description:
      "Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering.",
    url: "https://codeltix.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Avisek Ray (biisal)",
    description: "Thoughts, ideas, and code snippets from the void.",
  },
};

export default async function BlogIndex() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allPosts = await getblogPost();

  return (
    <PageShell>
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-normal mb-4 text-blog-white md:text-6xl">
          Blogs
        </h1>
        <p className="text-2xl text-blog-fg opacity-80">
          Things I&apos;ve written.
          <br />
          <span className="text-xs text-muted-foreground blur-[1px] hover:blur-none transition-all duration-300 clean:blur-none">
            I may be wrong sometimes, so don’t trust everything I say 100%.
          </span>
        </p>
      </header>

      {!allPosts || allPosts.length === 0 ? (
        <p className="text-lg text-blog-fg opacity-80">No posts found.</p>
      ) : (
        <BlogList posts={allPosts} session={session} />
      )}
    </PageShell>
  );
}
