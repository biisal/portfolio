/**
 * Scroll stick figure: DOM measuring.
 *
 * Finds the elements the figure may walk on and turns them into document-space
 * `Platform`s. Runs only on mount / resize / layout change, never per frame.
 */

import { makeFloor, type Platform, thinPlatforms, TUNING } from "./engine";

/** Article bodies (blog posts) get paragraphs, quotes and code blocks to stand on too. */
const PROSE = ".prose p, .prose blockquote, .prose pre";

const SELECTOR = `h1, h2, h3, hr, [data-stick-walk], .divide-y > *, ${PROSE}`;

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

/**
 * The box around the FIRST LINE of an element's text, so the figure stands on
 * the top of the first line (not the middle of a wrapped block) and walks along
 * the words that are really there.
 */
function textRect(el: Element): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects()).filter(
    (r) => r.width > 0 && r.height > 0
  );
  if (rects.length === 0) return range.getBoundingClientRect();

  const first = rects[0];
  // Inline children (links, bold) give several boxes on one line: join them.
  const line = rects.filter(
    (r) => Math.abs(r.top - first.top) < first.height * 0.6
  );
  const left = Math.min(...line.map((r) => r.left));
  const right = Math.max(...line.map((r) => r.right));
  return new DOMRect(left, first.top, right - left, first.height);
}

export function measurePlatforms(): Measured {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const vw = document.documentElement.clientWidth;
  const gutter = vw < 640 ? 16 : 24;

  const found: Platform[] = [];

  for (const el of document.querySelectorAll(SELECTOR)) {
    if (el.closest("[data-stick-ignore]") || isPinned(el)) continue;

    const isLine =
      el.tagName === "HR" ||
      el.tagName === "PRE" ||
      el.matches(".divide-y > *");
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
