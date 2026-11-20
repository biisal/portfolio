import { Navigate, Route, Routes } from "react-router-dom";

import Dock from "@/components/dock";
import { KeyboardScroll } from "@/components/keyboard-scroll";
import { ScrollStickman } from "@/components/scroll-stickman";
import { Seo } from "@/components/seo";
import { Toaster } from "@/components/ui/sonner";
import { useScrollToHash } from "@/lib/use-scroll-to-hash";
import BlogIndex from "@/pages/blog-index";
import Home from "@/pages/home";
import NotFoundPage from "@/pages/not-found";
import Post from "@/pages/post";
import ProjectsPage from "@/pages/projects";
import TagPage from "@/pages/tag";
import TagsIndexPage from "@/pages/tags";

export default function App() {
  useScrollToHash();

  return (
    <>
      <Seo
        title="Avisek Ray (biisal) | Full-Stack Developer Portfolio"
        description="Avisek Ray (biisal) is a full-stack developer from India specializing in backend development with Python and Go, and frontend development with Next.js, React, and Svelte."
      />
      <Dock />
      <ScrollStickman />
      <KeyboardScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<Post />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tags" element={<TagsIndexPage />} />
        <Route path="/tags/:tag" element={<TagPage />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
