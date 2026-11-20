import { SITE } from "@/lib/site";

export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap-index.xml\n`);
