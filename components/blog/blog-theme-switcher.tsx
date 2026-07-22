"use client";

import { Check, Palette } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    colors: ["#090b17", "#7aa2f7", "#ff9e64"],
  },
  {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    colors: ["#1e1e2e", "#cba6f7", "#fab387"],
  },
  {
    id: "gruber-darker",
    name: "Gruber Darker",
    colors: ["#181818", "#f43841", "#ffdd33"],
  },
  {
    id: "monokai-darker",
    name: "Monokai Darker",
    colors: ["#1e1f1c", "#fd971f", "#f92672"],
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    colors: ["#0d1117", "#58a6ff", "#3fb950"],
  },
] as const;

export function BlogThemeSwitcher() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isBlogRoute =
    pathname.startsWith("/blog") || pathname.startsWith("/tags");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!isBlogRoute || !mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="fixed left-4 top-4 z-50 md:left-10 md:top-8 flex cursor-pointer list-none items-center gap-2 rounded-full border border-blog-inactive-border bg-blog-bg/90 px-3.5 py-2.5 text-sm font-medium text-blog-white shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-blog-orange hover:text-blog-orange focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blog-orange">
          <Palette className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Theme</span>
          <span className="sr-only">Choose a reading theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 rounded-xl border border-blog-inactive-border bg-blog-bg/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-blog-fg/55 font-sans">
          Reading theme
        </DropdownMenuLabel>
        <DropdownMenuGroup className="space-y-1">
          {themes.map((option) => {
            const selected = option.id === theme;

            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => setTheme(option.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-blog-fg transition-colors hover:bg-blog-selection-bg/60 hover:text-blog-white focus:bg-blog-selection-bg/60 focus:text-blog-white"
              >
                <span className="flex -space-x-1" aria-hidden="true">
                  {option.colors.map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full border border-blog-bg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="flex-1 font-sans">{option.name}</span>
                {selected && (
                  <Check
                    className="h-4 w-4 text-blog-orange"
                    aria-hidden="true"
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
