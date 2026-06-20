import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { error, success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { blog: ["update"] },
      },
      headers: await headers(),
    });

    if (!success || error) {
      return NextResponse.json(
        { error: error || "Unauthorized" },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const body = await request.json();

    const post = await prisma.blogPost.update({
      where: { slug },
      data: body,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { error, success } = await auth.api.userHasPermission({
      body: {
        role: "admin",
        permission: { blog: ["delete"] },
      },
      headers: await headers(),
    });

    if (!success || error) {
      return NextResponse.json(
        { error: error || "Unauthorized" },
        { status: 401 },
      );
    }

    const { slug } = await params;

    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
