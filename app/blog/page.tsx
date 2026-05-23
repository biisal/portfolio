import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { AdminControls } from "@/components/blog/admin-controls";
import { ViewCounter } from "@/components/blog/view-counter";
import { JetBrainsMono } from "@/fonts";
import { getblogPost } from "@/lib/actions/blogs";
import { auth, Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog | Avisek Ray (biisal)",
  description:
    "Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering.",
  openGraph: {
    title: "Blog | Avisek Ray (biisal)",
    description:
      "Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering.",
    url: "https://biisal.codeltix.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Avisek Ray (biisal)",
    description: "Thoughts, ideas, and code snippets from the void.",
  },
};

export default async function BlogIndex() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allPosts = await getblogPost();

  return (
    <div
      className={cn(
        "min-h-screen p-8 md:p-20 text-blog-fg",
        JetBrainsMono.className,
      )}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blog-orange">Blogs</h1>
          <p className="text-xl text-blog-fg opacity-80">
            Things I&apos;ve written.
          </p>
        </header>

        {!allPosts || allPosts.length === 0 ? (
          <p className="text-lg text-blog-fg opacity-80">No posts found.</p>
        ) : (
          <div className="grid gap-8">
            <BlogCards posts={allPosts} session={session} />
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCards({
  posts,
  session,
}: {
  posts: BlogPost[];
  session: Session | null;
}) {
  return (
    <>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="flex flex-col sm:flex-row gap-6 group border border-blog-inactive-border hover:border-blog-orange rounded-lg p-6 bg-blog-bg transition-colors duration-200"
        >
          {post.coverImage && (
            <div className="relative w-full sm:w-48 shrink-0 aspect-video rounded-lg overflow-hidden border border-blog-inactive-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-500 "
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blog-orange transition-colors text-blog-white flex justify-between items-start">
              <span className="flex items-center gap-2">
                {post.title}
                {!post.published && (
                  <span className="text-xs bg-blog-selection-bg text-blog-cyan px-2 py-0.5 rounded font-normal font-mono">
                    Draft
                  </span>
                )}
              </span>
              {session && <AdminControls slug={post.slug} />}
            </h2>
            <div className="text-sm mb-4 text-blog-black font-mono flex items-center gap-4">
              {new Date(post.created_at).toLocaleDateString()}
              <ViewCounter
                slug={post.slug}
                initialViews={post.views}
                trackView={false}
              />
            </div>
            <p className="text-blog-fg text-lg leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
