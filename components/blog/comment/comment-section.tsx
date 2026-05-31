"use client";

import { Github, Loader2, LogOut } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createComment, deleteComment } from "@/lib/actions/comments";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { CommentItem } from "./comment-item";
import { CommentType, CommentUser } from "./types";
import { UserAvatar } from "./user-avatar";

export function CommentSection({
  postId,
  slug,
  comments,
}: {
  postId: string;
  slug: string;
  comments: CommentType[];
}) {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = session?.user;
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollToId = searchParams.get("scrollTo");
    if (scrollToId) {
      document
        .getElementById(scrollToId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const result = await createComment(postId, content, slug);
    setIsSubmitting(false);

    if (result.success) {
      setContent("");
      toast.success("Comment posted successfully");
    } else {
      toast.error(result.error || "Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (user?.role !== "admin") return;
    const toastId = toast.loading("Deleting comment...");
    const result = await deleteComment(commentId, slug);
    if (result.success) {
      toast.success("Comment deleted", { id: toastId });
    } else {
      toast.error(result.error || "Failed to delete comment", { id: toastId });
    }
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: `/blog/${slug}?scrollTo=comments`,
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    setIsLoggingOut(false);
    toast.success("Logged out");
  };

  return (
    <div
      id="comments"
      className="mt-16 pt-8 border-t border-blog-inactive-border"
    >
      <h2 className="text-2xl font-bold text-blog-white mb-8">Comments</h2>

      {isSessionLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="animate-spin text-blog-orange" />
        </div>
      ) : (
        <div
          className={cn(
            "mb-10 rounded-xl border border-blog-inactive-border overflow-hidden transition-opacity duration-300",
            isLoggingOut && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between gap-3  py-3 border-b border-blog-inactive-border bg-blog-bg">
            {user && (
              <div className="flex items-center gap-2.5">
                <UserAvatar user={user as CommentUser} size="sm" />
                <span className="text-sm font-medium text-blog-white">
                  {user.name}
                </span>
              </div>
            )}

            {user && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <Textarea
            value={content}
            rows={5}
            onChange={(e) => setContent(e.target.value)}
            placeholder={user ? "Leave a comment..." : "Login to comment..."}
            disabled={isSubmitting || isLoggingOut || !user}
            className="border-2 focus:border-primary border-foreground/30 disabled:border-foreground/30 disabled:opacity-100 rounded-md bg-blog-bg 
            text-blog-fg placeholder:text-blog-fg/30 min-h-24 focus-visible:ring-0 resize-none px-4 py-3"
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-blog-inactive-border bg-blog-bg">
            <span
              className={cn(
                "text-xs font-mono",
                content.length > 2000 ? "text-red-500" : "text-blog-fg/50",
              )}
            >
              {content.length}/2000
            </span>
            <div>
              {user ? (
                <Button
                  onClick={handleSubmit}
                  type="button"
                  disabled={
                    !content.trim() ||
                    content.length > 2000 ||
                    isSubmitting ||
                    isLoggingOut
                  }
                  className="bg-blog-orange text-blog-bg hover:bg-blog-orange/90 h-8 text-sm px-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Post Comment
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  type="button"
                  className="bg-blog-orange text-blog-bg hover:bg-blog-orange/90 h-8 text-sm px-4"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Login with GitHub
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-7">
        {comments.length === 0 ? (
          <p className="text-blog-fg/50 italic text-sm">
            {content !== ""
              ? "Go ahead 😁"
              : "No one has commented yet! 🥲 That’s common… but you could be the first one to change."}
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={
                user?.role === "admin"
                  ? () => handleDeleteComment(comment.id)
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
