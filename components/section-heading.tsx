import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  description?: string;
  href?: string;
  hrefLabel?: string;
  size?: "lg" | "md";
  className?: string;
}

export const SectionHeading = ({
  title,
  description,
  href,
  hrefLabel = "All",
  size = "lg",
  className,
}: SectionHeadingProps) => {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col gap-5", className)}>
        {href ? (
          <div className="flex justify-end font-mono text-xs uppercase tracking-[0.18em] text-blog-fg">
            <Link
              href={href}
              className="inline-flex items-center gap-1 transition-colors hover:text-blog-white"
            >
              {hrefLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <h2
            className={cn(
              "font-serif leading-[1.15] tracking-normal text-blog-white",
              size === "lg" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm leading-relaxed text-blog-fg md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </BlurFade>
  );
};
