"use client";

import { ChevronRight } from "lucide-react";

interface TerminalPromptProps {
  className?: string;
}

export const TerminalPrompt = ({ className }: TerminalPromptProps) => {
  return (
    <p
      className={`flex text-lg items-center gap-0 text-blog-orange/90 ${className || ""}`}
    >
      biisal@<span className="text-blog-white">codeltix-dot-com</span>
      <ChevronRight className="h-4 w-4 ml-2" />
      <span className="h-5 w-2 bg-blog-white/90 animate-pulse" />
    </p>
  );
};
