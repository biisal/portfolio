# Portfolio (Astro, static)

Fully static site built with Astro + React islands and Tailwind v4, deployed on
Vercel. Blog metadata lives in `src/data/posts.ts` and each post body is a plain HTML
file in `content/blog/`; every
post, tag and list page is prerendered at build time (code is highlighted with
Shiki during the build, so no highlighter ships to the browser).

```
pnpm dev        # local dev server
pnpm build      # type-check + static build into dist/
pnpm preview    # serve dist/
```

Deploy: import the repo in Vercel (framework preset: Astro). `vercel.json`
sets clean URLs and long-lived caching for `/_astro/*`.

Adding a post: drop `content/blog/<slug>.html` (body only) and add an entry to
`src/data/posts.ts` (`slug`, `file`, `title`, `excerpt`, `date`, `tags`,
`coverImage`, `isProject`, `published`).
