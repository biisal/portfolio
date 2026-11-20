# Portfolio (Vite + React, static)

Static SPA for GitHub Pages. Blogs are HTML files in `content/blog/*.md`.

## Writing a post

Create `content/blog/<slug>.html`:

```html
---
title: "My post"
slug: "my-post"
excerpt: "One-line summary"
coverImage: ""
audio: ""
tags: ["go", "backend"]
isProject: false
published: true
date: 2026-01-01T00:00:00.000Z
---

<p>Plain semantic HTML body…</p>
<pre><code class="language-go">fmt.Println("hi")</code></pre>
```

No inline styles, no own `<head>`/fonts: the site styles everything (`src/styles/html-post.css`).
Code blocks are highlighted with Shiki. Extras: `.callout`, `<figure>/<figcaption>`.
`isProject: true` lists it under Projects. `published: false` hides it.

**SEO:** `scripts/postbuild.mjs` prerenders every route (title, OG/Twitter, canonical, JSON-LD, body text),
plus `sitemap.xml`, `robots.txt`, `feed.xml`.

## Scripts

`pnpm dev` · `pnpm build` (typecheck + vite build + 404.html/sitemap/robots) · `pnpm preview`

## Deploy

Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/`.
In the repo: Settings → Pages → Source: **GitHub Actions**. For a custom domain, add `public/CNAME`
and set `SITE_URL` (default `https://codeltix.com`) for canonical links and the sitemap.
