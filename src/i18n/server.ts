import { notFound } from "next/navigation";
import { lang as langParam } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/**
 * Current language in Server Components, read from the `[lang]` root segment.
 * (Server Actions and Route Handlers can't read root params — they receive the
 * language as an argument instead.)
 */
export async function getLocale(): Promise<Locale> {
  const lang = await langParam();
  if (!hasLocale(lang)) notFound();
  return lang;
}

export async function getI18n() {
  const lang = await getLocale();
  return { lang, dict: getDictionary(lang) };
}
