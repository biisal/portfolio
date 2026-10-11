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
          <h1 className="font-serif text-5xl font-normal tracking-normal mb-4 text-blog-white md:text-6xl">
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
                className="relative h-auto px-4 py-2.5"
              >
                <Link href={`/tags/${encodeURIComponent(tag.name)}`}>
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
      </div>
    </div>
  );
}
