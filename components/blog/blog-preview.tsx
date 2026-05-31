"use client";

import "@/styles/streamdown.css";

import { code as codePlugin } from "@streamdown/code";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { defaultRemarkPlugins, Streamdown } from "streamdown";

import SocialShare from "@/components/blog/social-share";
import { cn } from "@/lib/utils";

interface BlogPreviewProps {
  content: string;
  className?: string;
  title?: string;
  excerpt?: string;
}

export function BlogPreview({
  content,
  className,
  title,
  excerpt,
}: BlogPreviewProps) {
  return (
    <article
      className={cn(
        "prose prose-invert prose-lg wrap-break-words max-w-none text-blog-fg",
        className,
      )}
    >
      <Streamdown
        mode="static"
        controls={{ code: false }}
        plugins={{ code: codePlugin }}
        remarkPlugins={[...Object.values(defaultRemarkPlugins), remarkBreaks]}
        rehypePlugins={[[rehypeRaw]]}
      >
        {content}
      </Streamdown>

      {title && excerpt && <SocialShare title={title} excerpt={excerpt} />}
    </article>
  );
}
