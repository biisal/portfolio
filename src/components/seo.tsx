const SITE = "https://biisal.github.io";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

/** React 19 hoists <title>/<meta>/<link> into <head>, so no helmet library needed. */
export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
}: SeoProps) {
  const url = path ? `${SITE}${path}` : undefined;
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
