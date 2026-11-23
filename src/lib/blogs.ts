import { getCollection } from "astro:content";
import type { BlogPost } from "@/lib/types";

const entries = await getCollection("blog", ({ data }) => data.published);

const allPosts: BlogPost[] = entries
  .map(({ id, data }) => ({
    id,
    slug: id,
    title: data.title,
    excerpt: data.excerpt,
    authorName: data.authorName,
    coverImage: data.coverImage,
    audio: data.audio,
    published: data.published,
    tags: data.tags,
    isProject: data.isProject,
    created_at: data.date,
    updated_at: data.updated ?? data.date,
  }) satisfies BlogPost)
  .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

/** Content-collection entry for a slug; render it with `render(entry)`. */
export const getPostEntry = (slug: string) => entries.find((e) => e.id === slug)!;

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
