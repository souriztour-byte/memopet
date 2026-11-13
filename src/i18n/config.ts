/**
 * Languages the storefront is published in, the main one first. Every page
 * lives under a language prefix (`/es/…`, `/en/…`); `src/proxy.ts` sends
 * visitors without one to the main language, Spanish.
 */

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";


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
