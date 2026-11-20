import { bundledLanguages, codeToHtml } from "shiki";

const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&amp;/g, "&");

/**
 * Build-time syntax highlighting: swaps every `<pre><code class="language-x">`
 * in a post for Shiki's output, so the browser ships no highlighter at all.
 */
export async function highlightCode(html: string): Promise<string> {
  const re = /<pre[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/g;
  const matches = [...html.matchAll(re)];
  const out = await Promise.all(
    matches.map(async ([, attrs, code]) => {
      const lang = /language-([\w-]+)/.exec(attrs)?.[1] ?? "text";
      return codeToHtml(decode(code), {
        lang: lang in bundledLanguages ? lang : "text",
        theme: "vitesse-dark",
        transformers: [
          {
            pre(node) {
              this.addClassToHast(node, "code-block");
            },
          },
        ],
      });
    })
  );
  let i = 0;
  return html.replace(re, () => out[i++]);
}
