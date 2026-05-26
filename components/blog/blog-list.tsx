"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BlogPost } from "@/.generated/client";
import { AdminControls } from "@/components/blog/admin-controls";
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
            <Link
              href={`/blog/${post.slug}`}
              className="flex flex-col sm:flex-row gap-6 group border border-blog-inactive-border hover:border-blog-orange rounded-lg p-6 bg-blog-bg transition-colors duration-200 w-full"
            >
              {post.coverImage && (
                <div className="relative w-full sm:w-48 shrink-0 aspect-video rounded-lg overflow-hidden border border-blog-inactive-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blog-orange transition-colors text-blog-white flex justify-between items-start">
                  <span className="flex items-center gap-2">
                    {post.title}
                    {!post.published && (
                      <span className="text-xs bg-blog-selection-bg text-blog-cyan px-2 py-0.5 rounded font-normal font-mono">
                        Draft
                      </span>
                    )}
                  </span>
                  {session && <AdminControls slug={post.slug} />}
                </h2>
                <div className="text-sm mb-4 text-blog-black font-mono flex items-center gap-4">
                  {new Date(post.created_at).toLocaleDateString()}
                  <span className="text-blog-fg opacity-60 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {(post.views || 0).toLocaleString()} Reads
                  </span>
                </div>
                <p className="text-blog-fg text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
