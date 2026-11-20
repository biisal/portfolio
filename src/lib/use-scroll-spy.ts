import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently being read.
 *
 * The active section is the last one (in `ids` order) whose top edge has
 * passed a reference line near the top of the viewport. When the page is
 * scrolled to the very bottom, the last id wins, so short final sections
 * (like Contact) can still become active.
 *
 * Returns "" before the first section is reached. `ids` should be a stable
 * (module-level) array.
 */
export function useScrollSpy(ids: readonly string[], enabled = true): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const { scrollY, innerHeight } = window;
      const atBottom =
        scrollY + innerHeight >= document.documentElement.scrollHeight - 4;

      if (atBottom && scrollY > 0) {
        setActive(ids[ids.length - 1] ?? "");
        return;
      }

      const line = innerHeight * 0.35;
      let current = "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }

      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids, enabled]);

  return active;
}
