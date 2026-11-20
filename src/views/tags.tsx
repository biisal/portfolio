import { Link } from "@/components/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function TagsIndexPage({
  tags,
}: {
  tags: { name: string; count: number }[];
}) {

  return (
    <PageShell>
      <header className="mb-16">
        <Link
          to="/blog"
          className="text-blog-orange hover:underline mb-8 inline-block font-mono text-sm"
        >
          ← Back to All Blogs
        </Link>
        <h1 className="font-serif text-5xl font-normal tracking-normal mb-4 text-blog-white md:text-6xl">
          All Tags
        </h1>
        <p className="text-lg text-blog-fg opacity-80">
          Browse posts by topic.
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-blog-fg opacity-80">No tags found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <Button
              key={tag.name}
              variant="outline"
              asChild
              className="relative h-auto px-4 py-2.5"
            >
              <Link to={`/tags/${encodeURIComponent(tag.name)}`}>
                <span className="font-medium text-blog-white text-base">
                  {tag.name}
                </span>
                <span className="absolute -top-2 -right-2 text-[10px] font-mono opacity-100 bg-blog-selection-bg text-blog-cyan px-1.5 py-0.5 rounded-full border border-border flex items-center justify-center min-w-[20px]">
                  {tag.count}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </PageShell>
  );
}
