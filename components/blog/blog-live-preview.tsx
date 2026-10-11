"use client";

import { useEffect, useRef } from "react";

import { BlogPost } from "@/.generated/client";
import { BlogPreview } from "@/components/blog/blog-preview";

interface BlogLivePreviewProps {
  title: string;
  content: string;
}

export function BlogLivePreview({ title, content }: BlogLivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    if (isNearBottom) {
      const timeoutId = setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [content]);

  return (
    <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
      <div
        ref={containerRef}
        className="bg-blog-bg border border-border rounded-lg p-6 h-full overflow-y-auto scroll-smooth"
      >
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-blog-fg">
          Live preview
        </p>

        {title && (
          <>
            <h1 className="mb-4 font-serif text-4xl font-normal leading-[1.15] tracking-normal text-blog-white md:text-5xl">
              {title}
            </h1>
            <div className="mb-8 font-mono text-sm">
              <span className="text-blog-fg">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </>
        )}

        {content ? (
          <>
            <BlogPreview post={{ title, content } as BlogPost} />
            <div className="h-32" />
          </>
        ) : (
          <p className="text-blog-fg opacity-50 italic">
            Start writing to see the preview...
          </p>
        )}
      </div>
    </div>
  );
}
