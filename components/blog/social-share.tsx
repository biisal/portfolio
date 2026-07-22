"use client";

import { Check, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SocialShareProps {
  title: string;
  excerpt: string;
}

export default function SocialShare({ title, excerpt }: SocialShareProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(window.location.href);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setHasNativeShare(true);
    }
  }, []);

  const handleOtherShare = async () => {
    const url = shareUrl || window.location.href;
    if (hasNativeShare) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  const shareLinks = [
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <Image
          src="/icons/x-twitter.svg"
          alt="X / Twitter"
          width={16}
          height={16}
          className="opacity-90 invert dark:invert-0"
        />
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        excerpt
      )}&source=${encodeURIComponent(shareUrl)}`,
      icon: (
        <Image
          src="/icons/linkedin.svg"
          alt="LinkedIn"
          width={16}
          height={16}
          className="opacity-90"
        />
      ),
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        title + " - " + excerpt + "\n" + shareUrl
      )}`,
      icon: (
        <Image
          src="/icons/whatsapp.svg"
          alt="WhatsApp"
          width={16}
          height={16}
          className="opacity-90"
        />
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(title + "\n\n" + excerpt)}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.47-.52-.18L7.74 13.3 3.64 12c-.89-.28-.9-.89.19-1.31l16.03-6.17c.74-.27 1.39.18 1.17 1.22l-2.73 12.85c-.2 1-.8 1.25-1.63.78l-4.15-3.06-2 1.93c-.22.22-.4.4-.82.4z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(title)}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 11.5c0-.94.76-1.7 1.7-1.7.67 0 1.27.4 1.53 1-1.38.74-2.5 1.76-3.14 2.9-.06-.16-.09-.33-.09-.5v-1.7zm6.7 4.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm10.6 2.3c-2.3 1.5-5.9 1.5-8.2 0-.27-.2-.36-.58-.16-.85.2-.27.58-.36.85-.16 1.8 1.2 4.6 1.2 6.4 0 .27-.2.65-.1.85.16.2.27.1.65-.16.85zm-.2-4.3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5-1.4c-.64-1.14-1.76-2.16-3.14-2.9.26-.6.86-1 1.53-1 .94 0 1.7.76 1.7 1.7v1.7c0 .17-.03.34-.09.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-blog-selection-bg/30">
      <h3 className="text-xl font-bold text-blog-white mb-4">
        Share this post
      </h3>
      <div className="flex flex-wrap gap-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blog-selection-bg/10 border border-blog-selection-bg/50 text-blog-fg hover:text-blog-orange hover:border-blog-orange transition duration-300 font-sans text-sm"
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}

        <button
          onClick={handleOtherShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blog-selection-bg/10 border border-blog-selection-bg/50 text-blog-fg hover:text-blog-orange hover:border-blog-orange transition duration-300 font-sans text-sm cursor-pointer"
        >
          {copied ? (
            <Check className="h-4 w-4 text-blog-green" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span>
            {hasNativeShare ? "Share / More" : copied ? "Copied!" : "Copy Link"}
          </span>
        </button>
      </div>
    </div>
  );
}
