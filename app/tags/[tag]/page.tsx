import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { BlogList } from "@/components/blog/blog-list";
import { getPostsByTag } from "@/lib/actions/blogs";
import { auth } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decodedTag}" | Avisek Ray (biisal)`,
    description: `All blog posts and projects associated with the tag: ${decodedTag}`,
  };
}

export default async function TagsPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to get session:", error);
  }

  const posts = await getPostsByTag(decodedTag);

  return (
    <div className="min-h-screen p-8 md:p-20 text-blog-fg">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <Link
            href="/blog"
            className="text-blog-orange hover:underline mb-8 inline-block font-mono text-sm"
          >
            ← Back to All Blogs
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blog-white">
            Tagged:<span className="text-blog-orange">{decodedTag}</span>
          </h1>
          <p className="text-lg text-blog-fg opacity-80">
            All posts associated with the{" "}
            <span className="font-semibold text-blog-white">{decodedTag}</span>{" "}
            tag.
          </p>
        </header>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 border border-blog-inactive-border rounded-lg bg-blog-bg">
            <h2 className="text-2xl font-bold text-blog-white mb-2">
              No posts found
            </h2>
            <p className="text-blog-fg opacity-80">
              There are currently no published posts with the tag &quot;
              {decodedTag}&quot;.
            </p>
          </div>
        ) : (
          <BlogList posts={posts} session={session} />
        )}
      </div>
    </div>
  );
}
