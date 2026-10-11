import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";

interface PostRowProps {
  post: BlogPost;
}

export function PostRow({ post }: PostRowProps) {
  const reads = (post.views || 0).toLocaleString();

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="flex items-start gap-5 sm:gap-6">
        {post.coverImage ? (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border sm:h-24 sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="mb-1.5 font-mono text-xs text-blog-fg">{reads} reads</p>
          <h3 className="text-lg font-medium leading-snug tracking-tight text-blog-white transition-colors group-hover:text-signal md:text-xl">
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

        <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-blog-fg transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal sm:block" />
      </div>
    </Link>
  );
}
