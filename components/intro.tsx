"use client";

import { ArrowRight, ChevronRight, FileCode2 } from "lucide-react";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";

import SocialLinks from "./social-links";

const Intro = () => {
  return (
    <div className="flex flex-col gap-7">
      <BlurFade delay={0.25} inView>
        <p className="flex text-lg items-center gap-0 text-blog-orange/90 ">
          biisal@<span className="text-blog-white">codeltix-dot-com</span>
          {"  "}
          <ChevronRight className="h-4 w-4 ml-2" />
          <span className="h-5 w-2  bg-blog-white/90 animate-pulse"></span>
        </p>
      </BlurFade>

      <BlurFade delay={0.35} inView>
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-blog-orange md:text-6xl">
            Avisek Ray
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-blog-white/90 md:text-2xl">
            Database, Backend Design, Frontend Engineering and notes from the
            terminal.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.45} inView>
        <div className="max-w-2xl space-y-4 text-base leading-8 text-blog-fg/72 md:text-lg">
          <p className="">
            I like to make things that help people using my programming skills.
            Also, I’m a freelancer. My goal is to keep learning, explore new
            technologies, and contribute to projects that make a real
            difference.
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
  );
};

export default Intro;
