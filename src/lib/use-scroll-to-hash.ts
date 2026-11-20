import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map<string, number>();
let currentPath: string | null = null;
let previousPath: string | null = null;

/** Pathname the user navigated from (null on a fresh page load). */
export const getPreviousPath = () => previousPath;

/**
 * Client-side navigation scrolling:
 *  - back/forward (POP) restores the scroll position of that history entry
 *  - new navigation scrolls to the `#hash` target, or to the top
 */
export function useScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const currentKey = useRef(key);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const save = () => positions.set(currentKey.current, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  useLayoutEffect(() => {
    // Switch the key first so scroll events from the new page (including the
    // browser clamping the old offset) never overwrite the old entry's position.
    currentKey.current = key;
    if (currentPath !== pathname) {
      previousPath = currentPath;
      currentPath = pathname;
    }

    if (navType === "POP") {
      const y = positions.get(key);
      if (y !== undefined) {
        window.scrollTo({ top: y, behavior: "instant" });
        return;
      }
    }
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key, navType]);
}
