"use client";
import { motion } from "framer-motion";
import {
  BookOpenText,
  CircleUserRound,
  Folder as ProjectsIcon,
  HomeIcon,
  Mail as ContactIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const Dock = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("/");

  const routes = [
    {
      id: "/",
      name: "Home",
      icon: HomeIcon,
    },
    {
      id: "/blog",
      name: "Blog",
      icon: BookOpenText,
    },
    {
      id: "about",
      name: "About",
      icon: CircleUserRound,
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

    const sectionIds = ["intro", "projects", "about", "contact"];

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
            } else {
              setActiveSection(id);
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
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
    <div className="">
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border border-blog-inactive-border bg-blog-bg/90 px-2 py-2 shadow-lg shadow-black/30 backdrop-blur-md">
        {routes.map((route, index) => (
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
            <button
              onClick={() => handleClick(route.id)}
              className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                isActive(route.id)
                  ? "text-blog-bg"
                  : "text-blog-fg/70 hover:text-blog-white"
              }`}
            >
              <route.icon className="h-4 w-4" />
              <span className="hidden md:inline">{route.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dock;
