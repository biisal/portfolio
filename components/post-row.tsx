import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";

interface PostRowProps {
  post: BlogPost;
}

export function PostRow({ post }: PostRowProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid gap-1 py-6 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:gap-6"
    >
      <span className="pt-1 font-mono text-xs text-blog-fg">{date}</span>

      <div className="min-w-0">
        <h3 className="text-lg font-medium leading-snug text-blog-white underline-offset-4 group-hover:underline md:text-xl">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-blog-fg">
          {post.excerpt}
        </p>
        {post.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-blog-fg/70">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <ArrowUpRight className="hidden h-5 w-5 text-blog-fg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blog-white sm:block" />
    </Link>
  );
}
