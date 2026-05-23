"use client";

import { ArrowRight, ChevronRight, Eye, FileCode2 } from "lucide-react";
import Link from "next/link";

import { BlogPost } from "@/.generated/client";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

import SocialLinks from "./social-links";

interface IntroProps {
  latestPosts: BlogPost[];
}

const Intro = ({ latestPosts }: IntroProps) => {
  return (
    <section
      id="intro"
      className={cn(
        "relative flex min-h-screen w-full flex-col justify-center py-16 text-blog-fg md:py-20",
      )}
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-7">
          <BlurFade delay={0.25} inView>
            <p className="flex text-lg items-center gap-0 text-blog-orange/90 ">
              biisal@<span className="text-blog-white">codeltix-dot-com</span>
              {"  "}
              <ChevronRight className="h-4 w-4 ml-2" />
              <div className="h-5 w-2  bg-blog-white/90 animate-pulse"></div>
            </p>
          </BlurFade>

          <BlurFade delay={0.35} inView>
            <div className="flex max-w-3xl flex-col gap-4">
              <h1 className="text-5xl font-bold tracking-tight text-blog-orange md:text-6xl">
                Avisek Ray
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-blog-white/90 md:text-2xl">
                Database, Backend Design, Frontend Engineering and notes from
                the terminal.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.45} inView>
            <div className="max-w-2xl space-y-4 text-base leading-8 text-blog-fg/72 md:text-lg">
              <p className="">
                I like to make things that help people using my programming
                skills. Also, I’m a freelancer. My goal is to keep learning,
                explore new technologies, and contribute to projects that make a
                real difference.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.55} inView>
            <div className="flex flex-col gap-3 md:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-blog-orange bg-blog-orange px-5 py-3 text-sm font-semibold text-blog-bg transition hover:opacity-90"
              >
                Read the blog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-blog-inactive-border bg-blog-bg px-5 py-3 text-sm font-semibold text-blog-white transition hover:border-blog-orange hover:text-blog-orange"
              >
                Browse selected work
                <FileCode2 className="h-4 w-4" />
              </Link>
            </div>
          </BlurFade>

          <BlurFade delay={0.65} inView>
            <SocialLinks />
          </BlurFade>
        </div>

        <div className="grid gap-6">
          <BlurFade delay={0.75} inView>
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
              <BlurFade key={post.id} delay={0.8 + index * 0.08} inView>
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
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
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
      </div>
    </section>
  );
};

export default Intro;
