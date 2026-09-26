"use client";

import { ArrowRight, FileCode2 } from "lucide-react";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";

import SocialLinks from "./social-links";
import { TerminalPrompt } from "./terminal-prompt";
import { Button } from "./ui/button";

const Intro = () => {
  return (
    <div className="flex flex-col gap-7">
      <BlurFade delay={0.25} inView>
        <TerminalPrompt />
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
          <Button size={"xl"} asChild>
            <Link href="/blog">
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant={"outline"} size={"xl"}>
            <Link href="/#projects">
              Browse selected work
              <FileCode2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.65} inView>
        <SocialLinks />
      </BlurFade>
    </div>
  );
};

export default Intro;
