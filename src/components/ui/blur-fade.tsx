import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Wait until scrolled into view (handled by the observer script in Base.astro). */
  inView?: boolean;
}

/**
 * CSS-only blur/fade-in. Server-rendered, so there is no hydration flicker;
 * styles live in globals.css (`.fade`) and only apply once JS has run.
 */
export function BlurFade({ children, className, delay = 0, inView }: BlurFadeProps) {
  return (
    <div
      data-fade={inView ? "view" : "load"}
      className={cn("fade", className)}
      style={{ "--fade-delay": `${0.04 + delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
