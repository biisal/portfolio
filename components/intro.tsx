"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BlurFade } from "@/components/ui/blur-fade";

const BAI_URL = "https://bai.codeltix.com";

/** Shown fanned out one after another on hover. Add more URLs here. */
const BAI_IMAGES = [
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1792298841/b95bf6b8d509752c894039a2fa5ed70e42c36b1df7fdd94985a2e35f0985bbcb_z2gp0i.png",
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1792297867/bai-rounded_z70yyj.png",
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1792298324/11e53698fae295ba6966bb3ce973caf290a97e81d2ffcec128cbc801fb8ba4ae_fwdrtf.png",
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1792298531/992486499008c4cafde1683f29e06c17996f733a5282f591041a00a75e012969_nahczm.png",
];

/** Cloudinary trims the transparent margin baked into the screenshots. */
const trimEdges = (url: string) => url.replace("/upload/", "/upload/e_trim/");

const CARD_W = 460;
/** Rough card height, used only to keep the fan on screen. */
const CARD_H = 260;
const OFFSET = 24;
/** Horizontal / vertical space the fan takes up beside the cursor. */
const FAN_W = CARD_W + 180;
const FAN_H = CARD_H + 80;

/** Position beside the cursor, flipping to the other side near screen edges. */
const place = (x: number, y: number) => ({
  x:
    x + OFFSET + FAN_W > window.innerWidth
      ? Math.max(0, x - OFFSET - FAN_W)
      : x + OFFSET,
  y: Math.max(
    0,
    y + OFFSET + FAN_H > window.innerHeight ? y - OFFSET - FAN_H : y + OFFSET
  ),
});

/** Link that fans out a stack of images beside the cursor while hovered. */
const HoverPreview = ({
  href,
  images,
  children,
}: {
  href: string;
  images: string[];
  children: React.ReactNode;
}) => {
  const preview = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const tick = () => {
    const el = preview.current;
    if (!el) return;
    current.current.x += (target.current.x - current.current.x) * 0.15;
    current.current.y += (target.current.y - current.current.y) * 0.15;
    el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    frame.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  useEffect(() => stop, []);

  const mid = (images.length - 1) / 2;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1 text-blog-white underline decoration-border underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
      onMouseEnter={(e) => {
        target.current = place(e.clientX, e.clientY);
        current.current = { ...target.current };
        setOpen(true);
        if (frame.current === null) frame.current = requestAnimationFrame(tick);
      }}
      onMouseMove={(e) => {
        target.current = place(e.clientX, e.clientY);
      }}
      onMouseLeave={() => {
        setOpen(false);
        stop();
      }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      {mounted
        ? createPortal(
            <span
              ref={preview}
              aria-hidden
              style={{ width: CARD_W, height: CARD_H }}
              className="pointer-events-none fixed left-0 top-0 z-9999 will-change-transform"
            >
              {images.map((src, i) => {
                const rotate = (i - mid) * 7;
                const x = i * 64;
                const y = (i - mid) * -14;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={trimEdges(src)}
                    alt=""
                    style={{
                      zIndex: i + 1,
                      transitionDelay: open ? `${i * 90}ms` : "0ms",
                      transform: open
                        ? `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(1)`
                        : "translate(0px, 24px) rotate(0deg) scale(0.85)",
                    }}
                    className={`absolute left-0 top-0 h-auto w-full origin-bottom-left drop-shadow-2xl transition-all duration-300 ease-out ${
                      open ? "opacity-100" : "opacity-0"
                    }`}
                  />
                );
              })}
            </span>,
            document.body
          )
        : null}
    </a>
  );
};

const Intro = () => {
  return (
    <div className="flex flex-col gap-10">
      <BlurFade delay={0.15} inView>
        <p className="font-serif text-4xl leading-[1.2] tracking-normal text-blog-white md:text-6xl md:leading-[1.15]">
          I build <span className="whitespace-nowrap">full-stack</span> systems
          and <span className="whitespace-nowrap">AI-powered</span> products.
        </p>
        <p className="mt-4 max-w-xl text-lg text-blog-fg md:text-xl">
          I enjoy learning new technologies, but I love exploring how the old
          ones actually work.
          <br />
          My goal is in my .env
        </p>
      </BlurFade>

      <BlurFade delay={0.3} inView>
        <p className="max-w-xl text-lg text-blog-fg md:text-xl">
          <span className="mr-3 font-mono text-xs">building</span>
          <HoverPreview href={BAI_URL} images={BAI_IMAGES}>
            bAI
          </HoverPreview>
          , a coding harness.
        </p>
      </BlurFade>
    </div>
  );
};

export default Intro;
