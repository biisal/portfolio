import { posts } from "@/data/posts";
import type { BlogPost } from "@/lib/types";

const bodies = import.meta.glob("/content/blog/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const allPosts: BlogPost[] = posts
  .filter((p) => p.published)
  .map((p) => {
    const body = bodies[`/content/blog/${p.file}`];
    if (body === undefined) throw new Error(`Missing blog file: ${p.file}`);
    const created = new Date(p.date);
    return {
      id: p.slug,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: body.trim(),
      authorName: p.authorName ?? "Avisek Ray",
      coverImage: p.coverImage,
      audio: p.audio,
      published: p.published,
      tags: p.tags,
      isProject: p.isProject,
      created_at: created,
      updated_at: p.updated ? new Date(p.updated) : created,
    } satisfies BlogPost;
  })
  .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

export const getPosts = (filter: "all" | "project" = "all", limit?: number) => {
  const posts =
    filter === "project" ? allPosts.filter((p) => p.isProject) : allPosts;
  return limit ? posts.slice(0, limit) : posts;
};

export const getPostsByTag = (tag: string) =>
  allPosts.filter((p) => p.tags.includes(tag));

export const getAllTagsWithCount = () => {
  const counts: Record<string, number> = {};
  for (const post of allPosts) {
    for (const tag of post.tags) counts[tag] = (counts[tag] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const getAdjacentPosts = (slug: string) => {
  const i = allPosts.findIndex((p) => p.slug === slug);
  if (i === -1) return { prevPost: null, nextPost: null };
  return {
    prevPost: i > 0 ? allPosts[i - 1] : null,
    nextPost: i < allPosts.length - 1 ? allPosts[i + 1] : null,
  };
};

/** List-safe copy: drops the HTML body so client islands don't ship every post. */
export const summary = (post: BlogPost): BlogPost => ({ ...post, content: "" });
