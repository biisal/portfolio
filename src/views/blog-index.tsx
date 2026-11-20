import { BlogList } from "@/components/blog/blog-list";
import { PageShell } from "@/components/page-shell";
import type { BlogPost } from "@/lib/types";

export default function BlogIndex({ allPosts }: { allPosts: BlogPost[] }) {

  return (
    <PageShell compact>
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-normal mb-4 text-blog-white md:text-6xl">
          Blogs
        </h1>
        <p className="text-2xl text-blog-fg opacity-80">
          Things I&apos;ve written.
          <br />
          <span className="text-xs text-muted-foreground">
            I may be wrong sometimes, so don’t trust everything I say 100%.
          </span>
        </p>
      </header>

      {allPosts.length === 0 ? (
        <p className="text-lg text-blog-fg opacity-80">No posts found.</p>
      ) : (
        <BlogList posts={allPosts} />
      )}
    </PageShell>
  );
}
