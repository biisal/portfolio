"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";

import { Button } from "./ui/button";

const Intro = () => {
  return (
    <div className="flex flex-col gap-10">
      <BlurFade delay={0.15} inView>
        <p className="font-serif text-4xl leading-[1.2] tracking-normal text-blog-white md:text-6xl md:leading-[1.15]">
          I build <span className="whitespace-nowrap">full-stack</span> systems
          and <span className="whitespace-nowrap">AI-powered</span> products.
        </p>
        <p className="mt-2 max-w-xl text-lg  text-blog-fg md:text-xl">
          I enjoy learning new technologies, but I love exploring how the old
          ones actually work.
          <br />
          My goal is in my .env
        </p>
      </BlurFade>

      <BlurFade delay={0.3} inView>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="xl" asChild>
            <Link href="/blog">
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="xl">
            <Link href="/#projects">Selected work</Link>
          </Button>
        </div>
      </BlurFade>
    </div>
  );
};

export default Intro;
