/** Prefix a `public/` path (e.g. "/icons/x.svg") with the deploy base path. */
export const asset = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, "") + path;
