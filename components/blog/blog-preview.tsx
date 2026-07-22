"use client";

import "@/styles/streamdown.css";

import { code as codePlugin } from "@streamdown/code";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { defaultRemarkPlugins, Streamdown } from "streamdown";

import { BlogPost } from "@/.generated/client";
import { cn } from "@/lib/utils";

import { BlogTags } from "./blog-tags";
import { ListenBtn } from "./listen-btn";

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
      {post.audio && (
        <div className="sticky top-20 z-40">
          <ListenBtn url={post.audio} />
        </div>
      )}
      <Streamdown
        mode="static"
        controls={{ code: false }}
        plugins={{ code: codePlugin }}
        remarkPlugins={[...Object.values(defaultRemarkPlugins), remarkBreaks]}
        rehypePlugins={[[rehypeRaw]]}
      >
        {post.content}
      </Streamdown>
      <BlogTags tags={post.tags} className="my-8" />
    </article>
  );
}
