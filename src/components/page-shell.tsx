import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Page frame for the blog, projects and tag pages: one centred column.
 * In clean mode it narrows to the same column as the home page.
 * `className` adjusts the inner column (e.g. its padding).
 */
export function PageShell({
  children,
  className,
  compact,
}: {
  children: ReactNode;
  className?: string;
  /** Always use the clean-mode column, whether or not clean mode is on. */
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen text-blog-fg">
      <div
        className={cn(
          compact
            ? "box-border max-w-(--clean-page) px-6 pt-16 pb-32 md:px-10"
            : "box-content max-w-4xl p-8 md:p-20 clean:box-border clean:max-w-(--clean-page) clean:px-6 clean:pt-16 clean:pb-32 md:clean:px-10",
          "mx-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
