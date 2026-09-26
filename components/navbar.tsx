"use client";
import { BookText, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  if (isBlogPage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 md:top-8 md:right-10">
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link href="/blog">
            <span>Open Blog</span>
            <BookText className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link
            target="_blank"
            href="https://drive.google.com/file/d/1wcR-9LoLmYQQ3lh-m35V7NxV1AdURNda/view?usp=drive_link"
          >
            <span>CV</span>
            <Download className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
