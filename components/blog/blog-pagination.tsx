"use client";

import Link from "next/link";

interface BlogPostLink {
  title: string;
  slug: string;
}

interface BlogPaginationProps {
  prevPost?: BlogPostLink | null;
  nextPost?: BlogPostLink | null;
}

export default function BlogPagination({
  prevPost,
  nextPost,
}: BlogPaginationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <div className="mt-16 pt-12 border-t border-blog-selection-bg/30 grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div className="flex flex-col items-start">
        {prevPost && (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex flex-col gap-2 items-start max-w-full text-left"
          >
            <span className="text-xs uppercase tracking-wider text-blog-fg/50 group-hover:text-blog-orange transition-colors">
              ← Previous Post
            </span>
            <span className="text-lg font-bold text-blog-white group-hover:text-blog-orange transition-colors line-clamp-2 leading-snug">
              {prevPost.title}
            </span>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-end text-right">
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex flex-col gap-2 items-end max-w-full text-right"
          >
            <span className="text-xs uppercase tracking-wider text-blog-fg/50 group-hover:text-blog-orange transition-colors">
              Next Post →
            </span>
            <span className="text-lg font-bold text-blog-white group-hover:text-blog-orange transition-colors line-clamp-2 leading-snug">
              {nextPost.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
