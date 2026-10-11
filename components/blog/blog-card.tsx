import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { AdminControls } from "@/components/blog/admin-controls";

interface BlogCardProps {
  post: BlogPost;
  isAdmin?: boolean;
}

export function BlogCard({ post, isAdmin }: BlogCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="flex items-start gap-5 sm:gap-6">
        {post.coverImage && (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border sm:h-24 sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-xs text-blog-fg">
            <span>{date}</span>
            <span aria-hidden>·</span>
            <span>{(post.views || 0).toLocaleString()} reads</span>
            {!post.published && <span className="text-signal">Draft</span>}
          </div>

          <h2 className="text-lg font-medium leading-snug tracking-tight text-blog-white transition-colors group-hover:text-signal md:text-xl">
            {post.title}
          </h2>

          <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-blog-fg">
            {post.excerpt}
          </p>

          {post.tags?.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-blog-fg/70">
              {post.tags.slice(0, 4).map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="shrink-0 pt-1">
          {isAdmin ? (
            <AdminControls slug={post.slug} />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-blog-fg transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
          )}
        </div>
      </div>
    </Link>
  );
}
