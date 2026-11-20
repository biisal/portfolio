// Runs after `vite build`. Prerenders one HTML file per route (real <title>,
// OG/Twitter tags, canonical, JSON-LD and crawlable body text) so link-preview
// bots and search engines don't need JS. React replaces the body on load.
// Also writes 404.html, sitemap.xml, robots.txt and feed.xml.
import fm from "front-matter";
import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const BLOG = "content/blog";
const BASE = (process.env.BASE_PATH || "/").replace(/\/$/, ""); // "" or "/portfolio"
const SITE = (process.env.SITE_URL || "https://codeltix.com").replace(
  /\/$/,
  ""
);
const NAME = "Avisek Ray (biisal)";
const DEFAULT_IMG =
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1792387419/og-img-portfolio_wneeqb.png";
const SITE_DESC =
  "Avisek Ray (biisal) is a full-stack developer from India specializing in backend development with Python and Go, and frontend development with Next.js, React, and Svelte.";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- load posts -----------------------------------------------------------
const posts = fs
  .readdirSync(BLOG)
  .filter((f) => f.endsWith(".html"))
  .map((file) => {
    const { attributes: a, body } = fm(
      fs.readFileSync(path.join(BLOG, file), "utf8")
    );
    const slug = a.slug || file.replace(/\.html$/, "");
    const html = body;
    return {
      slug,
      title: a.title,
      excerpt: a.excerpt ?? "",
      coverImage: a.coverImage || null,
      tags: a.tags ?? [],
      isProject: !!a.isProject,
      published: a.published ?? true,
      date: new Date(a.date),
      updated: new Date(a.updated ?? a.date),
      html,
    };
  })
  .filter((p) => p.published)
  .sort((a, b) => b.date - a.date);

const tagSet = [...new Set(posts.flatMap((p) => p.tags))];

// ---- template -------------------------------------------------------------
const template = fs
  .readFileSync(path.join(DIST, "index.html"), "utf8")
  .replace('href="/feed.xml"', `href="${BASE}/feed.xml"`);
fs.writeFileSync(path.join(DIST, "404.html"), template);

// Per-page tags replace the template's generic ones.
const stripped = template
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta\s+property="og:(type|url|image)"[^>]*>/g, "");

const jsonLd = (obj) =>
  `<script type="application/ld+json" data-prerender>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function render({
  route,
  title,
  description,
  image = DEFAULT_IMG,
  type = "website",
  ld,
  body,
}) {
  const url = `${SITE}${route === "/" ? "" : route}`;
  const head = [
    `<title data-prerender>${esc(title)}</title>`,
    `<meta data-prerender name="description" content="${esc(description)}" />`,
    `<link data-prerender rel="canonical" href="${url}" />`,
    `<meta data-prerender property="og:type" content="${type}" />`,
    `<meta data-prerender property="og:url" content="${url}" />`,
    `<meta data-prerender property="og:title" content="${esc(title)}" />`,
    `<meta data-prerender property="og:description" content="${esc(description)}" />`,
    `<meta data-prerender property="og:image" content="${esc(image)}" />`,
    `<meta data-prerender name="twitter:title" content="${esc(title)}" />`,
    `<meta data-prerender name="twitter:description" content="${esc(description)}" />`,
    `<meta data-prerender name="twitter:image" content="${esc(image)}" />`,
    ld ? jsonLd(ld) : "",
  ].join("\n    ");
  return stripped
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function write(route, html) {
  const file =
    route === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const postList = (list) =>
  `<ul>${list
    .map(
      (p) =>
        `<li><a href="${BASE}/blog/${p.slug}">${esc(p.title)}</a> — ${esc(p.excerpt)}</li>`
    )
    .join("")}</ul>`;

// ---- routes ---------------------------------------------------------------
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Avisek Ray",
  alternateName: "biisal",
  url: SITE,
  sameAs: ["https://github.com/biisal"],
};

write(
  "/",
  render({
    route: "/",
    title: `${NAME} | Full-Stack Developer Portfolio`,
    description: SITE_DESC,
    ld: [
      person,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: NAME,
        url: SITE,
      },
    ],
    body: `<main><h1>${NAME}</h1><p>${esc(SITE_DESC)}</p><h2>Latest posts</h2>${postList(posts.slice(0, 4))}</main>`,
  })
);

write(
  "/blog",
  render({
    route: "/blog",
    title: `Blog | ${NAME}`,
    description:
      "Thoughts, ideas, and code snippets from the void. Exploring full-stack development, cloud infrastructure, and software engineering.",
    body: `<main><h1>Blogs</h1>${postList(posts)}</main>`,
  })
);

write(
  "/projects",
  render({
    route: "/projects",
    title: `Projects | ${NAME}`,
    description:
      "Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure.",
    body: `<main><h1>Projects</h1>${postList(posts.filter((p) => p.isProject))}</main>`,
  })
);

write(
  "/tags",
  render({
    route: "/tags",
    title: `Tags | ${NAME}`,
    description: "Browse all topics and tags from the blog.",
    body: `<main><h1>All Tags</h1><ul>${tagSet
      .map(
        (t) =>
          `<li><a href="${BASE}/tags/${encodeURIComponent(t)}">${esc(t)}</a></li>`
      )
      .join("")}</ul></main>`,
  })
);

for (const tag of tagSet) {
  write(
    `/tags/${encodeURIComponent(tag)}`,
    render({
      route: `/tags/${encodeURIComponent(tag)}`,
      title: `Posts tagged "${tag}" | ${NAME}`,
      description: `All blog posts and projects associated with the tag: ${tag}`,
      body: `<main><h1>Tagged: ${esc(tag)}</h1>${postList(posts.filter((p) => p.tags.includes(tag)))}</main>`,
    })
  );
}

for (const p of posts) {
  const image = p.coverImage || DEFAULT_IMG;
  write(
    `/blog/${p.slug}`,
    render({
      route: `/blog/${p.slug}`,
      title: `${p.title} | Avisek Ray Blog`,
      description: p.excerpt,
      image,
      type: "article",
      ld: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        image,
        datePublished: p.date.toISOString(),
        dateModified: p.updated.toISOString(),
        keywords: p.tags.join(", "),
        author: { "@type": "Person", name: "Avisek Ray", url: SITE },
        mainEntityOfPage: `${SITE}/blog/${p.slug}`,
      },
      body: `<main><article><h1>${esc(p.title)}</h1>${p.html}</article></main>`,
    })
  );
}

// ---- sitemap, robots, feed ------------------------------------------------
const urls = [
  { loc: "/" },
  { loc: "/blog" },
  { loc: "/projects" },
  { loc: "/tags" },
  ...tagSet.map((t) => ({ loc: `/tags/${encodeURIComponent(t)}` })),
  ...posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updated.toISOString(),
  })),
];
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc === "/" ? "" : u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`
  )
  .join("\n")}
</urlset>
`
);
fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
);
fs.writeFileSync(
  path.join(DIST, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(NAME)}</title><link>${SITE}</link><description>${esc(SITE_DESC)}</description>
${posts
  .map(
    (p) =>
      `<item><title>${esc(p.title)}</title><link>${SITE}/blog/${p.slug}</link><guid>${SITE}/blog/${p.slug}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`
  )
  .join("\n")}
</channel></rss>
`
);

console.log(
  `postbuild: prerendered ${urls.length} routes + 404.html, sitemap.xml, robots.txt, feed.xml`
);
