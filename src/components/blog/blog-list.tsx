import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPost } from "@/lib/types";

/** Posts are already sorted newest-first by `getPosts`. */
export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
