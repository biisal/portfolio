import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { CommentType } from "./types";
import { UserAvatar } from "./user-avatar";

export function CommentItem({
  comment,
  onDelete,
}: {
  comment: CommentType;
  onDelete?: (id: string) => void;
}) {
  return (
    <div
      id={comment.id}
      className="group flex gap-3 p-3.5 rounded-xl bg-blog-bg border border-blog-inactive-border hover:border-blog-fg/20 transition-colors duration-150 relative"
    >
      <div className="shrink-0">
        <UserAvatar user={comment.user} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-sm font-medium text-blog-white">
            {comment.user.name}
          </span>
          <span className={cn("text-[11px] text-blog-fg/40")}>
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="text-[13px] text-blog-fg/70 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md text-blog-fg/40 hover:text-red-400 hover:bg-red-400/10"
          aria-label="Delete comment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
