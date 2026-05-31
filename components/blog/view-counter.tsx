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
      <EyeIcon className="w-4 h-4" />
      {views.toLocaleString()} Reads
    </span>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
