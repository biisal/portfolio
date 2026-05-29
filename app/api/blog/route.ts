import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { BlogFormSchema } from "@/components/blog/blog-editor-schema";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const apiSchema = BlogFormSchema.omit({ authorName: true }).extend({
  author: z.object({ name: z.string().min(1, "Author name is required") }),
  published: z.boolean().optional(),
  originalSlug: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const posts = await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { blog: ["create"] },
      },
      headers: await headers(),
    });

    if (!success || error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const result = apiSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const existing = await prisma.blogPost.findUnique({
      where: { slug: result.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: result.data.title,
        excerpt: result.data.excerpt,
        content: result.data.content,
        slug: result.data.slug,
        authorName: result.data.author.name,
        coverImage: result.data.coverImage,
        published: result.data.published || false,
        views: result.data.views ?? 0,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { error, success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { blog: ["update"] },
      },
      headers: await headers(),
    });

    if (!success || error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const result = apiSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 },
      );
    }

    if (
      result.data.originalSlug &&
      result.data.slug !== result.data.originalSlug
    ) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: result.data.slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const post = await prisma.blogPost.update({
      where: { slug: result.data.originalSlug || result.data.slug },
      data: {
        title: result.data.title,
        excerpt: result.data.excerpt,
        content: result.data.content,
        slug: result.data.slug,
        authorName: result.data.author.name,
        coverImage: result.data.coverImage,
        published: result.data.published,
        views: result.data.views,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}
