"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { JetBrainsMono } from "@/fonts";
import { cn } from "@/lib/utils";

interface BlogPreviewProps {
  content: string;
  className?: string;
}

export function BlogPreview({ content, className }: BlogPreviewProps) {
  const processedContent = content
    .replace(/\r\n/g, "\n")
    .split(/(```[\s\S]*?```)/g)
    .map((part, index) => {
      if (index % 2 === 0) {
        return part.replace(/\n{3,}/g, (match) => {
          const extra = match.length - 2;
          return "\n\n" + "<br>\n".repeat(extra) + "\n";
        });
      }
      return part;
    })
    .join("");

  return (
    <article
      className={cn(
        "prose prose-invert prose-lg wrap-break-words max-w-none text-blog-fg",
        JetBrainsMono.className,
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          br() {
            return <br className="my-4" />;
          },
          h1({ children }) {
            return (
              <h1 className="text-4xl font-bold mt-8 mb-4 text-blog-orange">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-3xl font-bold mt-8 mb-4 text-blog-orange">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-2xl font-semibold mt-6 mb-3 text-blog-green">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-xl font-semibold mt-6 mb-3 text-blog-green-light">
                {children}
              </h4>
            );
          },
          p({ children }) {
            return <p className="text-base leading-relaxed mb-6">{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-outside ml-6 mb-6 text-blog-fg marker:text-blog-orange">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-outside ml-6 mb-6 text-blog-fg marker:text-blog-orange">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="mb-2 pl-2">{children}</li>;
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-blog-red">{children}</strong>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blog-cyan pl-4 italic text-blog-cyan my-6">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <table className="w-full my-6 border-collapse border border-blog-cyan">
                {children}
              </table>
            );
          },
          thead({ children }) {
            return <thead className="bg-blog-black">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="border-b border-blog-cyan">{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="border border-blog-cyan px-4 py-2 text-left font-semibold text-blog-orange">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-blog-cyan px-4 py-2 text-blog-fg">
                {children}
              </td>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className={cn(
                    `bg-blog-black text-blog-orange px-1.5 py-0.5 rounded text-sm`,
                    JetBrainsMono.className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="my-6 rounded-lg border border-blog-selection-bg"
                customStyle={{
                  padding: "1rem",
                  background: "#16161E",
                  fontSize: "0.875rem",
                }}
                codeTagProps={{
                  className: JetBrainsMono.className,
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
