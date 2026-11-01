"use client";

import { useEffect } from "react";

import { isTyping } from "@/lib/is-typing";

/** Distance one key event pushes the scroll target (a native arrow key is 40). */
const STEP = 40;
/** Glide time constant in ms: lower is snappier. */
const GLIDE_MS = 70;

/**
 * `j` scrolls the page down and `k` scrolls it up, like the arrow keys, and
 * does nothing while a text field is focused. Self-contained: it has no
 * connection to anything else on the page.
 *
 * Each key event pushes a target 40px further and the page glides towards it,
 * so holding the key is one continuous smooth motion.
 */
export function KeyboardScroll() {
  useEffect(() => {
    let target: number | null = null;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      if (target === null) return;
      const dt = Math.min(50, last ? now - last : 16);
      last = now;
      const y = window.scrollY;
      const diff = target - y;
      if (Math.abs(diff) < 0.5) {
        window.scrollTo({ top: target, behavior: "instant" });
        target = null;
        last = 0;
        return;
      }
      window.scrollTo({
        top: y + diff * (1 - Math.exp(-dt / GLIDE_MS)),
        behavior: "instant",
      });
      raf = requestAnimationFrame(frame);
    };

    const nudge = (delta: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, (target ?? window.scrollY) + delta));
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key !== "j" && e.key !== "k") return;
      if (isTyping(e.target)) return;
      nudge(e.key === "j" ? STEP : -STEP);
    };

    // The wheel or a touch takes over: drop the keyboard glide.
    const cancel = () => {
      target = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
  }, []);

  return null;
}
