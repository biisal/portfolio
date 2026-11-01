/**
 * Scroll stick figure: DOM measuring.
 *
 * Finds the elements the figure may walk on and turns them into document-space
 * `Platform`s. Runs only on mount / resize / layout change, never per frame.
 */

import { makeFloor, type Platform, thinPlatforms, TUNING } from "./engine";

const SELECTOR = "h1, h2, h3, hr, [data-stick-walk], .divide-y > *";

/** Stable ids per element, so a re-measure keeps the figure attached to its line. */
const ids = new WeakMap<Element, string>();
let nextId = 0;
function idFor(el: Element): string {
  let id = ids.get(el);
  if (!id) {
    id = `p${nextId++}`;
    ids.set(el, id);
  }
  return id;
}

const elements = new Map<string, WeakRef<Element>>();

/** The DOM element a platform was measured from, if it still exists. */
export function platformElement(id: string): Element | null {
  return elements.get(id)?.deref() ?? null;
}

export interface Measured {
  platforms: Platform[];
  floor: Platform;
}

/** True if the element (or an ancestor) is fixed/sticky, so it doesn't scroll with the page. */
function isPinned(el: Element): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    const pos = getComputedStyle(node).position;
    if (pos === "fixed" || pos === "sticky") return true;
  }
  return false;
}

/** The box around an element's actual text, so the figure walks along the words. */
function textRect(el: Element): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect();
}

export function measurePlatforms(): Measured {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const vw = document.documentElement.clientWidth;
  const gutter = vw < 640 ? 16 : 24;

  const found: Platform[] = [];

  for (const el of document.querySelectorAll(SELECTOR)) {
    if (el.closest("[data-stick-ignore]") || isPinned(el)) continue;

    const isLine = el.tagName === "HR" || el.matches(".divide-y > *");
    const rect = isLine ? el.getBoundingClientRect() : textRect(el);
    if (rect.width < TUNING.minPlatformWidth) continue;
    if (rect.height === 0 && !isLine) continue;

    // Text: feet on the cap line. Lines: on the top border.
    const surface = isLine
      ? rect.top
      : rect.top + rect.height * TUNING.textFootRatio;

    elements.set(idFor(el), new WeakRef(el));
    found.push({
      id: idFor(el),
      kind: isLine ? "line" : "text",
      docY: surface + scrollY,
      x1: rect.left + scrollX,
      x2: rect.right + scrollX,
    });
  }

  // Floor spans the content column when there is one, else the whole width.
  const main = document.querySelector("main");
  const mr = main?.getBoundingClientRect();
  const floor =
    mr && mr.width > 200
      ? makeFloor(mr.left + scrollX, mr.right + scrollX)
      : makeFloor(gutter, vw - gutter);

  return {
    platforms: thinPlatforms(found, TUNING.minPlatformGap),
    floor,
  };
}
