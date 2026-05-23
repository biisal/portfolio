"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getblogPost = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const includeDrafts = session?.user;

    return await prisma.blogPost.findMany({
      where: includeDrafts ? {} : { published: true },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
});

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const includeDrafts = session?.user;
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
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
