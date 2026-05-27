"use client";

import Link from "next/link";

import { TerminalPrompt } from "./terminal-prompt";

interface NotFoundProps {
  text?: string;
  backLink?: string;
  backText?: string;
}

const NotFound = ({
  text = "No such page",
  backLink = "/#projects",
  backText = "Back to selected work",
}: NotFoundProps) => {
  return (
    <div className="pb-28 pt-8 px-8 md:px-20 md:pt-20">
      <div className="mx-auto max-w-4xl flex flex-col items-start gap-7">
        <TerminalPrompt />
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-blog-orange md:text-6xl">
            404
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-blog-white/90 md:text-2xl">
            {text}
          </p>
        </div>
        <div className="max-w-2xl space-y-4 text-base leading-8 text-blog-fg/72 md:text-lg">
          <p>
            The path you followed doesn&apos;t exist or may have been moved.
            Double-check the URL or head back to familiar ground.
          </p>
        </div>
        <Link
          href={backLink}
          className="inline-flex items-center justify-center gap-3 rounded-lg  bg-blog-bg  text-sm font-semibold text-blog-white transition hover:border-blog-orange hover:text-blog-orange"
        >
          {"<--"} {backText}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
