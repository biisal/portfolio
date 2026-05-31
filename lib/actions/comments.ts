"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCommentsByPostId(postId: string) {
  try {
    return await prisma.comment.findMany({
      where: { postId, isDeleted: false },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(
  postId: string,
  content: string,
  slug: string,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!content.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    if (content.length > 2000) {
      return { success: false, error: "Comment cannot exceed 2000 characters" };
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";
    const commentLink = `${baseUrl}/blog/${slug}?scrollTo=${comment.id}`;
    const tgMessage = `💬 New Comment on ${slug}\n\nFrom: ${session.user.name}\n\n${content}\n\nLink: ${commentLink}`;
    await import("@/lib/telegram").then((m) => m.sendTgMessage(tgMessage));

    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deleteComment(commentId: string, slug: string) {
  try {
    const { error, success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { comment: ["delete"] },
      },
      headers: await headers(),
    });

    if (!success || error) {
      return { success: false, error: "Forbidden" };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
