import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { AdminControls } from "@/components/blog/admin-controls";
interface BlogCardProps {
  post: BlogPost;
  isAdmin?: boolean;
}

export function BlogCard({ post, isAdmin }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-6 rounded-lg border border-blog-inactive-border bg-blog-bg p-6 transition-colors hover:border-blog-orange sm:flex-row w-full"
    >
      {post.coverImage && (
        <div className="relative w-full shrink-0 overflow-hidden rounded-lg border border-blog-inactive-border aspect-video sm:w-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold mb-2 group-hover:text-blog-orange transition-colors text-blog-white flex justify-between items-start">
          <span className="flex items-center gap-2">
            {post.title}
            {!post.published && (
              <span className="text-xs bg-blog-selection-bg text-blog-cyan px-2 py-0.5 rounded font-normal font-mono">
                Draft
              </span>
            )}
          </span>
          {isAdmin && <AdminControls slug={post.slug} />}
        </h2>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-mono text-blog-black md:text-sm">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-2 text-blog-fg opacity-60">
            {(post.views || 0).toLocaleString()} Reads
          </span>
        </div>

        <p className="max-w-3xl text-base leading-relaxed text-blog-fg md:text-lg">
          {post.excerpt}
        </p>
      </div>

      {!isAdmin && (
        <div className="flex items-start justify-end text-blog-black transition group-hover:text-blog-orange sm:self-start">
          <ArrowRight className="h-5 w-5 shrink-0" />
        </div>
      )}
    </Link>
  );
}
