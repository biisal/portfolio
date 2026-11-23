import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// Fully static output: every route (home, blog posts, tags) is prerendered to
// HTML at build time and served straight from Vercel's CDN. No adapter needed.
export default defineConfig({
  site: "https://codeltix.com",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
      transformers: [
        {
          pre(node) {
            this.addClassToHast(node, "code-block");
          },
        },
      ],
    },
  },
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      provider: fontProviders.local(),
      fallbacks: ["Georgia", "Times New Roman", "serif"],
      options: {
        variants: [
          { src: ["./src/assets/fonts/newsreader-latin-opsz-normal.woff2"], weight: "200 800", style: "normal" },
          { src: ["./src/assets/fonts/newsreader-latin-opsz-italic.woff2"], weight: "200 800", style: "italic" },
        ],
      },
    },
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      provider: fontProviders.local(),
      fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      options: {
        variants: [400, 500, 600].map((weight) => ({
          src: [`./src/assets/fonts/ibm-plex-mono-latin-${weight}-normal.woff2`],
          weight,
          style: "normal",
        })),
      },
    },
  ],
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
});
