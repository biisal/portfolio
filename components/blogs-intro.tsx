"use client";

import { ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";
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
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-5 rounded-lg border border-blog-inactive-border bg-blog-bg p-5 transition-colors hover:border-blog-orange sm:flex-row"
            >
              {post.coverImage && (
                <div className="relative w-full shrink-0 overflow-hidden rounded-lg border border-blog-inactive-border aspect-video sm:w-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-blog-black md:text-sm">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.views} Reads
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold leading-snug text-blog-white transition-colors group-hover:text-blog-orange md:text-2xl">
                  {post.title}
                </h3>
                <p className="max-w-3xl text-base leading-7 text-blog-fg md:text-lg">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-start justify-end text-blog-black transition group-hover:text-blog-orange sm:self-start">
                <ArrowRight className="h-5 w-5 shrink-0" />
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default BlogsIntro;
