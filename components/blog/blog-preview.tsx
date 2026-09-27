"use client";

import "@/styles/streamdown.css";

import { code as codePlugin } from "@streamdown/code";
import { Streamdown } from "streamdown";

import { BlogPost } from "@/.generated/client";
import { cn } from "@/lib/utils";

import { BlogTags } from "./blog-tags";
import { Player } from "../player";

interface BlogPreviewProps {
  post: BlogPost;
  className?: string;
}

export function BlogPreview({ post, className }: BlogPreviewProps) {
  return (
    <article
      className={cn(
        "prose relative prose-invert prose-lg wrap-break-words max-w-none text-blog-fg",
        className
      )}
    >
      {post.audio && <Player url={post.audio} className="sticky top-20 z-40" />}
      <Streamdown
        mode="static"
        plugins={{ code: codePlugin }}
        shikiTheme={["gruvbox-dark-hard", "gruvbox-dark-hard"]}
        lineNumbers={false}
        controls={{
          table: false,
          code: {
            download: false,
          },
        }}
      >
        {post.content}
      </Streamdown>
      <BlogTags tags={post.tags} className="my-8" />
    </article>
  );
}
