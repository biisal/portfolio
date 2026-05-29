"use client";

import { useEffect, useRef } from "react";

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
        className="bg-blog-bg border border-blog-inactive-border rounded-lg p-6 h-full overflow-y-auto scroll-smooth"
      >
        <h2 className="text-2xl font-bold text-blog-orange mb-6">
          Live Preview
        </h2>

        {title && (
          <>
            <h1 className="text-blog-white text-4xl font-bold mb-4">{title}</h1>
            <div className="text-blog-black mb-8 font-mono">
              {new Date().toLocaleDateString()}
            </div>
          </>
        )}

        {content ? (
          <>
            <BlogPreview content={content} />
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
