/**
 * Scroll stick figure: breaking the text it lands on.
 *
 * DOM only. On impact the heading is split into per-letter spans, the letters
 * near the landing point get knocked loose (tilted, shifted, chipped, a couple
 * dropped), and a moment later everything heals and the original text nodes are
 * put back exactly as they were, so React never notices.
 */

/** Letters within this many px of the landing point are affected. */
const RADIUS = 130;
/** Letters this close to the landing point fall out completely. */
const SHATTER = 24;
const BROKEN_MS = 2400;
const HEAL_MS = 600;
/** Reading pages (blog posts): break briefly and recover fast. */
const QUICK_BROKEN_MS = 500;
const QUICK_HEAL_MS = 250;

const BROKEN_ATTR = "data-stick-broken";

/** Jagged chunks that can be missing from a letter. */
const CHIPS = [
  "polygon(0 0, 100% 0, 100% 100%, 62% 100%, 48% 72%, 0 82%)",
  "polygon(0 0, 100% 0, 100% 62%, 70% 52%, 78% 100%, 0 100%)",
  "polygon(18% 0, 100% 0, 100% 100%, 0 100%, 0 38%, 34% 30%)",
  "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 70%, 38% 58%, 22% 38%, 0 36%)",
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

interface Split {
  original: Text;
  first: Node;
  last: Node;
  chars: HTMLSpanElement[];
}

/** Replace a text node with word > letter spans; whitespace stays as text. */
function split(node: Text): Split | null {
  const text = node.data;
  if (!text.trim()) return null;

  const frag = document.createDocumentFragment();
  const chars: HTMLSpanElement[] = [];

  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      frag.append(document.createTextNode(part));
      continue;
    }
    const word = document.createElement("span");
    word.style.cssText = "display:inline-block;white-space:nowrap;";
    for (const ch of part) {
      const c = document.createElement("span");
      c.textContent = ch;
      c.style.cssText = "display:inline-block;will-change:transform;";
      chars.push(c);
      word.append(c);
    }
    frag.append(word);
  }

  const first = frag.firstChild!;
  const last = frag.lastChild!;
  // Swap in place; remember the original node so it can be put back.
  node.replaceWith(frag);
  return { original: node, first, last, chars };
}

/** Put the original text node back where the split pieces are. */
function restore(s: Split): void {
  const { first, last, original } = s;
  if (!first.parentNode) return; // the element is gone, nothing to fix
  const range = document.createRange();
  range.setStartBefore(first);
  range.setEndAfter(last);
  range.deleteContents();
  range.insertNode(original);
}

/**
 * Break `el`. `local` (a heading) wrecks the letters around viewport x `hitX`;
 * `all` (a line / row) shakes every letter evenly, with nothing shattered.
 * Returns false if it was already broken (so the caller can skip the sound).
 */
export function breakText(
  el: HTMLElement,
  hitX: number,
  mode: "local" | "all" = "local",
  quick = false
): boolean {
  if (el.hasAttribute(BROKEN_ATTR) || !el.isConnected) return false;

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    textNodes.push(n as Text);
  }

  const splits = textNodes.map(split).filter((s): s is Split => s !== null);
  if (splits.length === 0) {
    // No letters (a bare rule): the whole element jolts and settles evenly.
    if (mode === "all") {
      el.setAttribute(BROKEN_ATTR, "");
      el.animate(
        [
          { transform: "translateY(0) rotate(0deg)" },
          { transform: "translateY(3px) rotate(-0.6deg)", offset: 0.2 },
          { transform: "translateY(-1px) rotate(0.4deg)", offset: 0.5 },
          { transform: "translateY(0) rotate(0deg)" },
        ],
        { duration: 500, easing: "ease-out" }
      ).onfinish = () => el.removeAttribute(BROKEN_ATTR);
      return true;
    }
    return false;
  }

  el.setAttribute(BROKEN_ATTR, "");
  const chars = splits.flatMap((s) => s.chars);

  // Read every position first, then write, to avoid layout thrash.
  const centers = chars.map((c) => {
    const r = c.getBoundingClientRect();
    return r.left + r.width / 2;
  });

  chars.forEach((c, i) => {
    if (mode === "all") {
      // Even all over: every letter gets the same kind of light damage.
      c.style.transition = "transform 0.14s cubic-bezier(0.2, 1.8, 0.4, 1)";
      c.style.transform = `translate(${rand(-2, 2).toFixed(1)}px, ${rand(0, 3).toFixed(1)}px) rotate(${rand(-14, 14).toFixed(1)}deg)`;
      if (Math.random() < 0.35) {
        c.style.clipPath = CHIPS[Math.floor(Math.random() * CHIPS.length)];
      }
      return;
    }
    const d = Math.abs(centers[i] - hitX);
    if (d > RADIUS) return;
    const w = 1 - d / RADIUS;
    const dir = centers[i] < hitX ? -1 : 1; // knocked away from the landing

    let rot = rand(-1, 1) * 30 * w;
    let tx = dir * rand(0.5, 4) * w;
    let ty = rand(0, 5) * w;
    let opacity = 1;

    if (d < SHATTER) {
      // Right under its feet: the letter falls out.
      ty = rand(14, 26);
      rot = rand(-1, 1) * 55;
      tx = dir * rand(2, 8);
      opacity = 0.4;
    } else if (w > 0.3 && Math.random() < 0.6) {
      c.style.clipPath = CHIPS[Math.floor(Math.random() * CHIPS.length)];
    }

    c.style.transition = "transform 0.14s cubic-bezier(0.2, 1.8, 0.4, 1)";
    c.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
    c.style.opacity = String(opacity);
  });

  const brokenMs = quick ? QUICK_BROKEN_MS : BROKEN_MS;
  const healMs = quick ? QUICK_HEAL_MS : HEAL_MS;

  window.setTimeout(() => {
    // Heal: ease everything back, then swap the original text back in.
    for (const c of chars) {
      c.style.transition = `transform ${healMs}ms ease-out, opacity ${healMs}ms ease-out`;
      c.style.transform = "";
      c.style.opacity = "1";
      c.style.clipPath = "";
    }
    window.setTimeout(() => {
      for (const s of splits) restore(s);
      el.removeAttribute(BROKEN_ATTR);
    }, healMs + 50);
  }, brokenMs);

  return true;
}
