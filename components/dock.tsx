"use client";
import { motion } from "framer-motion";
import {
  BookOpenText,
  CircleUserRound,
  Folder as ProjectsIcon,
  GitPullRequest,
  Mail as ContactIcon,
  Terminal as SkillsIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const ROUTES = [
  { id: "/", name: "Me", icon: CircleUserRound },
  { id: "blogs", name: "Blogs", icon: BookOpenText },
  { id: "opensource", name: "Open Source", icon: GitPullRequest },
  { id: "skills", name: "Skills", icon: SkillsIcon },
  { id: "projects", name: "Projects", icon: ProjectsIcon },
  { id: "contact", name: "Contact", icon: ContactIcon },
] as const;

const SECTION_IDS = [
  "intro",
  "blogs",
  "opensource",
  "skills",
  "projects",
  "contact",
];

/** Hides the dock when scrolling down on blog pages, always shows it near the page bottom. */
function useDockVisibility(enabled: boolean) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      const nearBottom =
        scrollY + innerHeight >= document.documentElement.scrollHeight - 600;
      const scrollingDown = scrollY > lastScrollY.current && scrollY > 100;

      setVisible(nearBottom || !scrollingDown);
      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  return visible;
}

/** Tracks which nav item should be highlighted: route-based off the homepage, scroll-based on it. */
function useActiveSection(pathname: string) {
  const [active, setActive] = useState("/");

  // Non-home routes: derive directly from the path.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.startsWith("/project") ? "projects" : pathname);
    }
  }, [pathname]);

  // Home route: derive from which section is in view.
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      if (window.scrollY < 100) setActive("/");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (id === "intro") setActive("/");
          else if (window.scrollY >= 100) setActive(id);
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return active;
}

const Dock = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  const visible = useDockVisibility(isBlogPage);
  const active = useActiveSection(pathname);

  const isActive = (routeId: string) =>
    pathname === "/"
      ? active === routeId
      : routeId !== "/" && pathname.includes(routeId.replace("/", ""));

  const handleClick = (id: string) => {
    if (id.startsWith("/")) {
      if (id === pathname) window.scrollTo({ top: 0, behavior: "smooth" });
      else router.push(id);
      return;
    }
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 rounded-lg items-center  bg-blog-bg border-foreground/5 border px-2 py-2 shadow-lg shadow-black/30 "
    >
      {ROUTES.map((route) => (
        <div
          key={route.id}
          className="relative flex flex-col items-center px-1"
        >
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="z-40 text-foreground bg-blog-bg"
                  onClick={() => handleClick(route.id)}
                >
                  <route.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border border-blog-inactive-border bg-blog-bg/95 text-blog-fg text-xs"
              >
                {route.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="mt-1 h-1 w-1">
            {isActive(route.id) && (
              <motion.div
                layoutId={pathname === "/" ? "dock-dot" : undefined}
                className="h-1 w-1 rounded-full bg-foreground"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default Dock;
