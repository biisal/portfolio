"use client";
import { BookText, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  if (isBlogPage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 md:top-8 md:right-10">
      <div className="flex items-center gap-4">
        <Link
          href="/blog"
          className="hidden items-center gap-2 rounded-full border border-blog-inactive-border bg-blog-bg/90 px-5 py-2.5 text-sm font-medium text-blog-white transition-colors hover:border-blog-orange hover:text-blog-orange backdrop-blur-md md:flex"
        >
          <span>Open Blog</span>
          <BookText className="h-4 w-4" />
        </Link>
        <Link
          target="_blank"
          href="https://drive.google.com/file/d/1wcR-9LoLmYQQ3lh-m35V7NxV1AdURNda/view?usp=drive_link"
          className="flex items-center gap-2 rounded-full border border-blog-inactive-border bg-blog-bg/90 px-5 py-2.5 text-sm font-medium text-blog-white transition-colors hover:border-blog-orange hover:text-blog-orange backdrop-blur-md"
        >
          <span>CV</span>
          <Download className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
