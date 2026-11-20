import { Link, useParams } from "react-router-dom";

import { BlogList } from "@/components/blog/blog-list";
import { PageShell } from "@/components/page-shell";
import { Seo } from "@/components/seo";
import { getPostsByTag } from "@/lib/blogs";

export default function TagsPage() {
  const { tag = "" } = useParams();
  const posts = getPostsByTag(tag);

  return (
    <PageShell>
      <Seo
        title={`Posts tagged "${tag}" | Avisek Ray (biisal)`}
        description={`All blog posts and projects associated with the tag: ${tag}`}
        path={`/tags/${encodeURIComponent(tag)}`}
      />
      <header className="mb-16">
        <Link
          to="/blog"
          className="text-blog-orange hover:underline mb-8 inline-block font-mono text-sm"
        >
          ← Back to All Blogs
        </Link>
        <h1 className="font-serif text-4xl font-normal tracking-normal mb-4 text-blog-white md:text-5xl">
          Tagged:<span className="text-blog-orange">{tag}</span>
        </h1>
        <p className="text-lg text-blog-fg opacity-80">
          All posts associated with the{" "}
          <span className="font-semibold text-blog-white">{tag}</span> tag.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-blog-inactive-border rounded-lg bg-blog-bg">
          <h2 className="text-xl font-medium tracking-tight text-blog-white mb-2">
            No posts found
          </h2>
          <p className="text-blog-fg opacity-80">
            There are currently no published posts with the tag &quot;{tag}
            &quot;.
          </p>
        </div>
      ) : (
        <BlogList posts={posts} />
      )}
    </PageShell>
  );
}
