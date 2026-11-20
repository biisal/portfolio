import fm from "front-matter";

import type { BlogPost } from "@/lib/types";

interface Frontmatter {
  title: string;
  slug?: string;
  excerpt?: string;
  authorName?: string;
  coverImage?: string | null;
  audio?: string | null;
  tags?: string[];
  isProject?: boolean;
  published?: boolean;
  date: string | Date;
  updated?: string | Date;
}

const files = import.meta.glob("/content/blog/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const allPosts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => {
    const { attributes, body } = fm<Frontmatter>(raw);
    const slug =
      attributes.slug ||
      path
        .split("/")
        .pop()!
        .replace(/\.html$/, "");
    const created = new Date(attributes.date);
    return {
      id: slug,
      slug,
      title: attributes.title,
      excerpt: attributes.excerpt ?? "",
      content: body.trim(),
      authorName: attributes.authorName ?? "Avisek Ray",
      coverImage: attributes.coverImage || null,
      audio: attributes.audio || null,
      published: attributes.published ?? true,
      tags: attributes.tags ?? [],
      isProject: attributes.isProject ?? false,
      created_at: created,
      updated_at: attributes.updated ? new Date(attributes.updated) : created,
    } satisfies BlogPost;
  })
  .filter((p) => p.published)
  .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

export const getPosts = (filter: "all" | "project" = "all", limit?: number) => {
  const posts =
    filter === "project" ? allPosts.filter((p) => p.isProject) : allPosts;
  return limit ? posts.slice(0, limit) : posts;
};

export const getPost = (slug: string) =>
  allPosts.find((p) => p.slug === slug) ?? null;

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
