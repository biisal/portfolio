import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogTagsProps {
  tags: string[];
  className?: string;
}

export function BlogTags({ tags, className }: BlogTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag) => (
        <Button key={tag} variant="outline" asChild size="sm">
          <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
        </Button>
      ))}
    </div>
  );
}
