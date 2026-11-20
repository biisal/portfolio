import * as React from "react";

import type { BlogPost } from "@/lib/types";
import { BlogCard } from "@/components/blog/blog-card";

import { BlogSortFilter, SortOption } from "./blog-sort-filter";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
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
      return 0;
    });
  }, [posts, sort]);

  return (
    <div className="flex flex-col gap-8">
      <BlogSortFilter currentSort={sort} onSortChange={setSort} />

      <div className="divide-y divide-border border-y border-border">
        {sortedPosts.map((post) => (
          <div key={post.id} className="w-full">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
