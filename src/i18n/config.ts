/**
 * Languages the storefront is published in. Every page lives under a
 * language prefix (`/en/…`, `/es/…`); `src/proxy.ts` sends visitors without
 * one to the language their browser prefers.
 */

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string | undefined | null): value is Locale =>
  (locales as readonly string[]).includes(value ?? "");

/** Each language's own name, shown in the language switcher. */
export const localeNames: Record<Locale, string> = { en: "English", es: "Español" };

/** Storefront API `LanguageCode` for `@inContext(language: …)`. */
export const shopifyLanguage: Record<Locale, "EN" | "ES"> = { en: "EN", es: "ES" };

/** Locale for number and date formatting. The English copy uses British spelling. */
export const intlLocale: Record<Locale, string> = { en: "en-GB", es: "es-ES" };

/** Open Graph `og:locale`. */
export const ogLocale: Record<Locale, string> = { en: "en_GB", es: "es_ES" };

/** "/shop" → "/es/shop"; "/" → "/es". Leaves absolute URLs and anchors alone. */
export function localizePath(lang: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** "/es/shop?q=x" → { lang: "es", rest: "/shop?q=x" }. */
export function splitLocale(pathname: string): { lang: Locale | null; rest: string } {
  const [, first, ...more] = pathname.split("/");
  if (hasLocale(first)) {
    const rest = `/${more.join("/")}`;
    return { lang: first, rest };
  }
  return { lang: null, rest: pathname };
}

/** The same page in another language. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(target, splitLocale(pathname).rest);
}

/** Metadata `alternates` for a page that exists in every language. */
export function alternatesFor(lang: Locale, path: string) {
  return {
    canonical: localizePath(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizePath(l, path)])),
      "x-default": localizePath(defaultLocale, path),
    },
  };
}

/** Picks the best supported language from an `Accept-Language` header. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}
