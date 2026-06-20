import { headers } from "next/headers";
import { redirect } from "next/navigation";

import BlogEditor from "@/components/blog/blog-editor";
import { getBlogPost } from "@/lib/actions/blogs";
import { auth } from "@/lib/auth";

export default async function BlogEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const { slug } = await searchParams;
  let initialPost = null;

  if (slug) {
    initialPost = await getBlogPost(slug);
  }

  return <BlogEditor initialPost={initialPost} />;
}
