import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://codeltix.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blog/editor", "/projects/form", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
