import Link from "next/link";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { JetBrainsMono } from "@/fonts";
import { getblogPost } from "@/lib/actions/blogs";
import { cn } from "@/lib/utils";

import { BlurFade } from "./ui/blur-fade";

export default async function BlogPreview() {
  const allPosts = await getblogPost();
  if (allPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-24 max-w-6xl">
      <div className="mb-16">
        <BlurFade delay={0.25} inView>
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl md:text-6xl font-bold flex items-start justify-start flex-wrap gap-3">
              <span className="text-blog-orange">Latest</span>
              <span className="text-white">Posts</span>
            </h2>
            <p className="text-blog-fg/80 text-base md:text-lg mt-2">
              Thoughts, tutorials, and insights from my journey
            </p>
          </div>
        </BlurFade>
      </div>

      <div className="ml-4 md:ml-6 mt-8">
        <Timeline defaultValue={1} className="w-full">
          {allPosts.map((post, index) => (
            <BlurFade key={post.slug} delay={0.25 + index * 0.1} inView>
              <TimelineItem step={index + 1}>
                <TimelineHeader>
                  <TimelineDate className="text-blog-fg/50 font-mono text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </TimelineDate>
                  <TimelineTitle>
                    <Link
                      href={`/blog/${post.slug}`}
                      className={cn(
                        "text-2xl font-bold hover:text-blog-orange transition-colors text-blog-white",
                        JetBrainsMono.className,
                      )}
                    >
                      {post.title}
                    </Link>
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineIndicator className="bg-[#090b17] border-white/20 group-hover/timeline-item:border-blog-orange group-hover/timeline-item:bg-blog-orange/20 transition-all duration-300" />
                <TimelineSeparator
                  className={cn(
                    "bg-white/10",
                    index !== allPosts.length - 1 ? "!block" : "hidden",
                  )}
                />
                <TimelineContent>
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <p className="text-blog-fg/70 max-w-2xl line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-2 text-blog-orange text-sm font-semibold inline-flex items-center gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Read Article <span className="text-lg">→</span>
                    </div>
                  </Link>
                </TimelineContent>
              </TimelineItem>
            </BlurFade>
          ))}
        </Timeline>
      </div>

      <div className="mt-16 ml-4 md:ml-6 pl-8 md:pl-12">
        <Link
          href="/blog"
          className={cn(
            "inline-flex items-center gap-2 text-blog-orange font-bold hover:gap-4 transition-all duration-300",
            JetBrainsMono.className,
          )}
        >
          View All Posts <span className="text-xl">→</span>
        </Link>
      </div>
    </section>
  );
}
