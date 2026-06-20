"use client";

import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { BlogCard } from "@/components/blog/blog-card";
import { BlurFade } from "@/components/ui/blur-fade";

interface BlogsIntroProps {
  latestPosts: BlogPost[];
}

const BlogsIntro = ({ latestPosts }: BlogsIntroProps) => {
  return (
    <div className="grid gap-6">
      <BlurFade delay={0.25} inView>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blog-white md:text-3xl">
            Latest Posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-blog-orange transition-colors hover:text-blog-white"
          >
            View all
          </Link>
        </div>
      </BlurFade>

      <div className="grid gap-6">
        {latestPosts.map((post, index) => (
          <BlurFade key={post.id} delay={0.3 + index * 0.08} inView>
            <BlogCard post={post} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default BlogsIntro;
