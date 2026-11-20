import { getPosts } from "@/lib/blogs";
import { NAME, SITE, SITE_DESC } from "@/lib/site";

const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET = () => {
  const items = getPosts()
    .map(
      (p) =>
        `<item><title>${esc(p.title)}</title><link>${SITE}/blog/${p.slug}</link><guid>${SITE}/blog/${p.slug}</guid><pubDate>${p.created_at.toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(NAME)}</title><link>${SITE}</link><description>${esc(SITE_DESC)}</description>\n${items}\n</channel></rss>\n`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } }
  );
};
