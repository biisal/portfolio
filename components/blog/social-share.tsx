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
        title,
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
        shareUrl,
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        excerpt,
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
        title + " - " + excerpt + "\n" + shareUrl,
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
        shareUrl,
      )}&text=${encodeURIComponent(title + "\n\n" + excerpt)}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.47-.52-.18L7.74 13.3 3.64 12c-.89-.28-.9-.89.19-1.31l16.03-6.17c.74-.27 1.39.18 1.17 1.22l-2.73 12.85c-.2 1-.8 1.25-1.63.78l-4.15-3.06-2 1.93c-.22.22-.4.4-.82.4z" />
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
