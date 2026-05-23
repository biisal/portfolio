import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { email, social } from "@/lib/config";

const SocialLinks = () => {
  return (
    <div className="flex flex-col gap-4 border-t border-blog-inactive-border pt-5 text-sm text-blog-fg/60 md:flex-row md:items-center md:justify-between">
      <Link
        href={`mailto:${email}`}
        className="flex items-center gap-2 transition-colors hover:text-blog-white"
      >
        <Mail className="h-4 w-4 text-blog-orange" />
        <span>{email}</span>
      </Link>
      <div className="flex items-center gap-4">
        {social.map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-blog-inactive-border bg-blog-bg transition-colors hover:border-blog-orange hover:bg-blog-orange/6"
          >
            <Image src={icon} alt={label} width={22} height={22} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
