"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { cache } from "react";

import { Prisma } from "@/.generated/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getblogPost = cache(
  async (filter: "all" | "project" = "all", limit?: number) => {
    try {
      let includeDrafts = false;
      try {
        const hasPermission = await auth.api.userHasPermission({
          body: {
            permission: { blog: ["read"] },
          },
          headers: await headers(),
        });
        includeDrafts = hasPermission.success;
      } catch {
        includeDrafts = false;
      }

      const where: Prisma.BlogPostWhereInput = includeDrafts
        ? {}
        : { published: true };
      if (filter === "project") {
        where.isProject = true;
      }

      return await prisma.blogPost.findMany({
        where,
        orderBy: { created_at: "desc" },
        ...(limit ? { take: limit } : {}),
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }
);

export const getPublishedBlogPosts = cache(async () => {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return [];
  }
});

export const getBlogPost = cache(async (slug: string) => {
  try {
    let includeDrafts = false;
    try {
      const hasPermission = await auth.api.userHasPermission({
        body: {
          role: "admin",
          permission: { blog: ["create"] },
        },
        headers: await headers(),
      });
      includeDrafts = hasPermission.success;
    } catch {
      includeDrafts = false;
    }
    return await prisma.blogPost.findFirst({
      where: includeDrafts ? { slug } : { slug, published: true },
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
});

export async function incrementView(slug: string) {
  try {
    const post = await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    return post.views;
  } catch (error) {
    console.error("Error incrementing view:", error);
    return null;
  }
}

export async function deleteBlogPost(slug: string) {
  try {
    const { success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { blog: ["create"] },
      },
      headers: await headers(),
    });
    if (!success) {
      throw new Error("Unauthorized");
    }

    await prisma.blogPost.delete({
      where: { slug },
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

export const getPostsByTag = cache(async (tag: string) => {
  try {
    let includeDrafts = false;
    try {
      const hasPermission = await auth.api.userHasPermission({
        body: {
          permission: { blog: ["read"] },
        },
        headers: await headers(),
      });
      includeDrafts = hasPermission.success;
    } catch {
      includeDrafts = false;
    }

    const decodedTag = decodeURIComponent(tag);

    const where: Prisma.BlogPostWhereInput = {
      tags: { has: decodedTag },
    };

    if (!includeDrafts) {
      where.published = true;
    }

    return await prisma.blogPost.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching blog posts by tag:", error);
    return [];
  }
});

export const getAllTagsWithCount = cache(async () => {
  try {
    let includeDrafts = false;
    try {
      const hasPermission = await auth.api.userHasPermission({
        body: {
          permission: { blog: ["read"] },
        },
        headers: await headers(),
      });
      includeDrafts = hasPermission.success;
    } catch {
      includeDrafts = false;
    }

    const where: Prisma.BlogPostWhereInput = includeDrafts
      ? {}
      : { published: true };

    const posts = await prisma.blogPost.findMany({
      where,
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Convert to array and sort by count descending, then alphabetically
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
});
