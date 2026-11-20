/** Current pathname. Only call from `client:only` islands (never server-rendered). */
export const usePathname = () => window.location.pathname.replace(/(.)\/$/, "$1");
