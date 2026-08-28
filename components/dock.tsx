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
import { startTransition, useEffect, useRef, useState } from "react";

const Dock = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("/");
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isBlogPage = pathname.startsWith("/blog");

  // Show/hide on scroll for blog pages
  useEffect(() => {
    if (!isBlogPage) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const isNearBottom = currentScrollY + windowHeight >= docHeight - 600;

      // Always show dock when near the bottom
      if (isNearBottom) {
        setVisible(true);
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBlogPage]);

  const routes = [
    {
      id: "/",
      name: "Me",
      icon: CircleUserRound,
    },
    {
      id: "blogs",
      name: "Blogs",
      icon: BookOpenText,
    },
    {
      id: "opensource",
      name: "Open Source",
      icon: GitPullRequest,
    },
    {
      id: "skills",
      name: "Skills",
      icon: SkillsIcon,
    },
    {
      id: "projects",
      name: "Projects",
      icon: ProjectsIcon,
    },
    {
      id: "contact",
      name: "Contact",
      icon: ContactIcon,
    },
  ];

  useEffect(() => {
    startTransition(() => {
      if (pathname === "/") {
        setActiveSection("/");
      } else if (pathname.startsWith("/project")) {
        setActiveSection("projects");
      } else {
        setActiveSection(pathname);
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = [
      "intro",
      "blogs",
      "opensource",
      "skills",
      "projects",
      "contact",
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          startTransition(() => {
            if (id === "intro") {
              setActiveSection("/");
            } else if (window.scrollY >= 100) {
              setActiveSection(id);
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("/");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const handleClick = (id: string) => {
    if (id.charAt(0) === "/") {
      if (id === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      router.push(id);
      return;
    }
    if (pathname !== "/") {
      router.push("/#" + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (routeId: string) => {
    if (pathname === "/") {
      if (routeId === "/") {
        return activeSection === "/";
      }
      return activeSection === routeId;
    } else {
      if (routeId === "/") return false;
      return pathname.includes(routeId.replace("/", ""));
    }
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border border-blog-inactive-border bg-blog-bg/90 px-2 py-2 shadow-lg shadow-black/30 backdrop-blur-md"
    >
      {routes.map((route) => (
        <div key={route.id} className="relative px-1">
          {isActive(route.id) && (
            <motion.div
              layoutId={pathname === "/" ? "navbar-pill" : undefined}
              className="absolute inset-0 rounded-full bg-blog-orange"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleClick(route.id)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isActive(route.id)
                      ? "text-blog-bg"
                      : "text-blog-fg/70 hover:text-blog-white"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border border-blog-inactive-border bg-blog-bg/95 text-blog-fg text-xs"
              >
                {route.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </motion.div>
  );
};

export default Dock;
