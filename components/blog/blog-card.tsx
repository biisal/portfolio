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
      className="group block py-5 transition-colors"
    >
      <div className="flex gap-5 sm:gap-6">
        {post.coverImage && (
          <div className="relative hidden h-28 w-44 shrink-0 overflow-hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-mono text-blog-fg/40">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{(post.views || 0).toLocaleString()} reads</span>
            {!post.published && <span className="text-blog-cyan">Draft</span>}
          </div>

          <h2 className="text-xl font-semibold leading-tight text-blog-white transition-colors group-hover:text-blog-orange md:text-2xl">
            {post.title}
          </h2>

          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-blog-fg/65 md:text-base">
            {post.excerpt}
          </p>
        </div>

        <div className="shrink-0 pt-1">
          {isAdmin ? (
            <AdminControls slug={post.slug} />
          ) : (
            <ArrowRight className="h-5 w-5 text-blog-fg/30 transition-colors group-hover:text-blog-orange" />
          )}
        </div>
      </div>
    </Link>
  );
}
