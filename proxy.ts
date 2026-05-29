import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const protectedRoute = ["/blog/editor", "/projects/form"];

const matchRoute = (route: string, routes: string[]) =>
  routes.some((r) => route === r || route.startsWith(r + "/"));
const isProtectedRoute = (currentRoute: string) =>
  matchRoute(currentRoute, protectedRoute);

export async function proxy(request: NextRequest) {
  const currentRoute = request.nextUrl.pathname;
  if (isProtectedRoute(currentRoute)) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || session.user.role !== "admin") {
        if (isProtectedRoute(currentRoute)) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      if (isProtectedRoute(currentRoute)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/editor/:path*", "/projects/form/:path*"],
};
