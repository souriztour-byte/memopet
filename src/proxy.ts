import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, splitLocale } from "@/i18n/config";

/**
 * Pages live under a language prefix (`/es/…`, `/en/…`). A request without one
 * — including old links such as `/shop` — is redirected to the same path in
 * Spanish, the shop's main language, on every device. English is one tap
 * away with the language switch, and its pages keep their own addresses.
 *
 * Pages asked for on www.… are sent to the same page without "www.", so the
 * shop has one address on any host.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // The public address, as the host's proxy (Railway, Vercel) received it.
  // request.nextUrl can hold the server's internal address instead.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? request.nextUrl.protocol.replace(":", "");
  if (host.startsWith("www.")) {
    return NextResponse.redirect(`https://${host.slice(4)}${pathname}${search}`, 308);
  }
  if (splitLocale(pathname).lang) return;

  const path = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(`${proto}://${host}${path}${search}`);
}

export const config = {
  // Skip API routes, Next.js internals, the generated /apple-icon and files such
  // as /icon.svg, /robots.txt, /sitemap.xml, /manifest.webmanifest.
  matcher: ["/((?!api/|_next/|apple-icon|.*\\.[^/]+$).*)"],
};
