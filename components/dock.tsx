"use client";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Briefcase,
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
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/lib/use-scroll-spy";
import { Button } from "./ui/button";

const ROUTES = [
  { id: "/", name: "Me", icon: CircleUserRound },
  { id: "blogs", name: "Blogs", icon: BookOpenText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "opensource", name: "Open Source", icon: GitPullRequest },
  { id: "skills", name: "Skills", icon: SkillsIcon },
  { id: "projects", name: "Projects", icon: ProjectsIcon },
  { id: "contact", name: "Contact", icon: ContactIcon },
] as const;

/** Home-page sections tracked while scrolling, in page order. */
const HOME_SECTION_IDS = [
  "blogs",
  "experience",
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
  const [routeActive, setRouteActive] = useState("/");

  // Non-home routes: derive directly from the path.
  useEffect(() => {
    if (pathname !== "/") {
      setRouteActive(pathname.startsWith("/project") ? "projects" : pathname);
    }
  }, [pathname]);

  // Home route: derive from the section being read ("" = still at the top).
  const spy = useScrollSpy(HOME_SECTION_IDS, pathname === "/");

  return pathname === "/" ? spy || "/" : routeActive;
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
    <motion.nav
      aria-label="Primary"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-border/50 bg-background/75 px-2 py-1.5"
    >
      <TooltipProvider delayDuration={200}>
        {ROUTES.map((route) => {
          const activeItem = isActive(route.id);

          return (
            <Tooltip key={route.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={route.name}
                  aria-current={activeItem ? "true" : undefined}
                  className={cn(
                    "relative rounded-full text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    activeItem && "text-foreground"
                  )}
                  onClick={() => handleClick(route.id)}
                >
                  <route.icon className="h-4 w-4" />
                  {activeItem && (
                    <motion.span
                      layoutId={pathname === "/" ? "dock-dot" : undefined}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {route.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </motion.nav>
  );
};

export default Dock;
