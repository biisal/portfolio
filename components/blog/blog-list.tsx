"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BlogPost } from "@/.generated/client";
import { AdminControls } from "@/components/blog/admin-controls";
import { BlogCard } from "@/components/blog/blog-card";
import { type Session } from "@/lib/auth";

import { BlogSortFilter, SortOption } from "./blog-sort-filter";

interface BlogListProps {
  posts: BlogPost[];
  session: Session | null;
}

export function BlogList({ posts, session }: BlogListProps) {
  const [sort, setSort] = React.useState<SortOption>("latest");

  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sort === "latest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sort === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sort === "popular") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });
  }, [posts, sort]);

  return (
    <div className="flex flex-col gap-8">
      <BlogSortFilter currentSort={sort} onSortChange={setSort} />

      <div className="grid gap-8">
        {sortedPosts.map((post) => (
          <div key={post.id} className="w-full">
            <BlogCard post={post} isAdmin={session?.user.role === "admin"} />
          </div>
        ))}
      </div>
    </div>
  );
}
