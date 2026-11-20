import { useEffect, useRef } from "react";

/**
 * Highlights `<pre><code class="language-x">` blocks inside an HTML post with
 * Shiki (`vitesse-dark` theme).
 * Shiki is loaded lazily, and only when a post actually has code blocks.
 */
export function useHighlightCode(html: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("pre > code"));
    if (blocks.length === 0) return;

    let cancelled = false;
    import("shiki").then(async ({ codeToHtml, bundledLanguages }) => {
      for (const code of blocks) {
        const pre = code.parentElement!;
        const lang = /language-([\w-]+)/.exec(code.className)?.[1] ?? "text";
        const out = await codeToHtml(code.textContent ?? "", {
          lang: lang in bundledLanguages ? lang : "text",
          theme: "vitesse-dark",
        });
        if (cancelled || !pre.isConnected) return;
        const tpl = document.createElement("template");
        tpl.innerHTML = out;
        const shiki = tpl.content.firstElementChild as HTMLElement;
        shiki.classList.add("code-block");
        pre.replaceWith(shiki);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [html]);

  return ref;
}
