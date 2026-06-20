/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

import { CommentUser } from "./types";

export function UserAvatar({
  user,
  size = "md",
}: {
  user: CommentUser;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm";
  return user.image ? (
    <img
      src={user.image}
      alt={user.name}
      className={cn("rounded-full object-cover", dim)}
    />
  ) : (
    <div
      className={cn(
        "rounded-full bg-primary/60 flex items-center justify-center text-blog-white font-bold",
        dim,
      )}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}
