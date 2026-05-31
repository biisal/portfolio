import { incrementView } from "@/lib/actions/blogs";
import { cn } from "@/lib/utils";

interface ViewCounterProps {
  slug: string;
  initialViews?: number;
  trackView?: boolean;
  className?: string;
}

export async function ViewCounter({
  slug,
  trackView = true,
  initialViews,
  className,
}: ViewCounterProps) {
  let views = initialViews || 0;
  try {
    if (trackView) views = (await incrementView(slug)) || 0;
  } catch (error) {
    console.error("Error incrementing view:", error);
  }

  return (
    <span
      className={cn(
        "text-blog-fg opacity-60 flex items-center gap-1",
        className,
      )}
    >
      {views.toLocaleString()} Reads
    </span>
  );
}
