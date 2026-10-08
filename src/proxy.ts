import { NextResponse, type NextRequest } from "next/server";
import { negotiateLocale, splitLocale } from "@/i18n/config";

/**
 * Pages live under a language prefix (`/en/…`, `/es/…`). A request without one
 * — including old links such as `/shop` — is redirected to the same path in
 * the visitor's preferred language (from the browser's Accept-Language
 * header), falling back to English.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (splitLocale(pathname).lang) return;

  const lang = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Skip API routes, Next.js internals, the generated /apple-icon and files such
  // as /icon.svg, /robots.txt, /sitemap.xml, /manifest.webmanifest.
  matcher: ["/((?!api/|_next/|apple-icon|.*\\.[^/]+$).*)"],
};
