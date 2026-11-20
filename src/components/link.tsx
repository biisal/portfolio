import type { AnchorHTMLAttributes } from "react";

/** Plain anchor with the old router-style `to` prop; pages are real static HTML. */
export function Link({
  to,
  ...props
}: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={to} {...props} />;
}
