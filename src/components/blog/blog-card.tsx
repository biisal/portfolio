import { ArrowUpRight } from "lucide-react";
import { Link } from "@/components/link";

import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link to={`/blog/${post.slug}`} className="group block py-6">
      <div className="flex items-start gap-5 sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-xs text-blog-fg">
            <span>{date}</span>
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
          <ArrowUpRight className="h-5 w-5 text-blog-fg transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        </div>
      </div>
    </Link>
  );
}
