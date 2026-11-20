import "@/styles/html-post.css";

import type { BlogPost } from "@/lib/types";
import { useHighlightCode } from "@/lib/use-highlight-code";
import { cn } from "@/lib/utils";

import { BlogTags } from "./blog-tags";
import { Player } from "../player";

interface BlogPreviewProps {
  post: BlogPost;
  className?: string;
}

export function BlogPreview({ post, className }: BlogPreviewProps) {
  const ref = useHighlightCode(post.content);

  return (
    <article
      className={cn(
        "relative wrap-break-words max-w-none text-blog-fg",
        className
      )}
    >
      {post.audio && (
        <Player url={post.audio} className="sticky top-20  mb-4 z-40" />
      )}
      <div
        ref={ref}
        className="html-post"
        // Content is authored in this repo, not user input.
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <BlogTags tags={post.tags} className="my-8" />
    </article>
  );
}
