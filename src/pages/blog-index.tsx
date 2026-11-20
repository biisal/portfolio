import { BlogList } from "@/components/blog/blog-list";
import { PageShell } from "@/components/page-shell";
import { Seo } from "@/components/seo";
import { getPosts } from "@/lib/blogs";

export default function BlogIndex() {
  const allPosts = getPosts();

  return (
    <PageShell compact>
      <Seo
        title="Blog | Avisek Ray (biisal)"
        description="Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering."
        path="/blog"
      />
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
