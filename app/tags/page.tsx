import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAllTagsWithCount } from "@/lib/actions/blogs";

export const metadata: Metadata = {
  title: "Tags | Avisek Ray (biisal)",
  description: "Browse all topics and tags from the blog.",
};

export default async function TagsIndexPage() {
  const tags = await getAllTagsWithCount();

  return (
    <div className="min-h-screen p-8 md:p-20 text-blog-fg">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <Link
            href="/blog"
            className="text-blog-orange hover:underline mb-8 inline-block font-mono text-sm"
          >
            ← Back to All Blogs
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blog-white">
            All Tags
          </h1>
          <p className="text-lg text-blog-fg opacity-80">
            Browse posts by topic.
          </p>
        </header>

        {!tags || tags.length === 0 ? (
          <p className="text-blog-fg opacity-80">No tags found.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {tags.map((tag) => (
              <Button
                key={tag.name}
                variant="outline"
                asChild
                className="h-auto py-2.5 px-4 text-blog-fg hover:text-blog-orange border-blog-selection-bg/50 hover:border-blog-orange rounded-lg flex items-center transition-all duration-300 bg-blog-selection-bg/10 relative"
              >
                <Link href={`/tags/${encodeURIComponent(tag.name)}`}>
                  <span className="font-medium text-blog-white text-base">
                    {tag.name}
                  </span>
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono opacity-100 bg-blog-selection-bg text-blog-cyan px-1.5 py-0.5 rounded-full font-bold shadow-sm border border-blog-inactive-border/50 flex items-center justify-center min-w-[20px]">
                    {tag.count}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
