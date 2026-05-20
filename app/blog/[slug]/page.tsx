import "@/app/globals.css";

import { Metadata } from "next";
import Link from "next/link";

import { BlogPreview } from "@/components/blog/blog-preview";
import { ViewCounter } from "@/components/blog/view-counter";
import { JetBrainsMono } from "@/fonts";
import { getBlogPost } from "@/lib/actions/blogs";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | Avisek Ray",
    };
  }

  const title = `${post.title} | Avisek Ray Blog`;
  const description = post.excerpt;
  const ogImage =
    post.coverImage ||
    "https://res.cloudinary.com/dorxspa9g/image/upload/v1760437739/green-stick_holso5.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://biisal.codeltix.com/blog/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.created_at.toISOString(),
      authors: [post.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return (
    <div
      className={cn(
        "min-h-screen p-8 md:p-20 text-blog-fg",
        JetBrainsMono.className,
      )}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="text-blog-orange hover:underline mb-8 block"
        >
          ← Back to Blog
        </Link>
        {!post ? (
          <h1 className="text-4xl font-bold text-blog-red">Post not found</h1>
        ) : (
          <article>
            {post.coverImage && (
              <div className="mb-8 relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-blog-inactive-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h1 className="text-blog-white mb-4 text-4xl font-bold">
              {post.title}
            </h1>
            <div className="text-blog-black mb-8 font-mono flex items-center gap-4 text-sm">
              {new Date(post.created_at).toLocaleDateString()}
              <ViewCounter slug={post.slug} initialViews={post.views} />
            </div>
            <BlogPreview content={post.content} />
          </article>
        )}
      </div>
    </div>
  );
}
