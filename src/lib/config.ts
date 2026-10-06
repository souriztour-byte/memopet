/**
 * Store-wide settings. Anything that is a business fact (contact details,
 * legal entity) comes from environment variables so nothing is invented in
 * code — when a value is missing the UI says "Coming soon" instead, exactly
 * like the prototype did. Interface text lives in `src/i18n/dictionaries`.
 */

const clean = (value: string | undefined) => {
  const v = value?.trim();
  return v ? v : null;
};

// Set by Vercel on every build, without "https://".
const vercelDomain = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);

const instagramHandle = clean(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE)?.replace(/^@/, "") ?? null;

export const siteConfig = {
  name: "MimiPets",
  /**
   * Public address used for canonical links, the sitemap and robots.txt. On Vercel it
   * falls back to the project's production domain (e.g. mimipets.shop once connected).
   */
  url:
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
    (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000"),
  /** Handle of the hero product (the paw washer) — match it to the Shopify product handle. */
  featuredProductHandle:
    clean(process.env.NEXT_PUBLIC_FEATURED_PRODUCT_HANDLE) ?? "silicone-paw-washer",

  contact: {
    email: clean(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
    instagram: instagramHandle
      ? { handle: `@${instagramHandle}`, url: `https://www.instagram.com/${instagramHandle}/` }
      : null,
  },

  legal: {
    businessName: clean(process.env.NEXT_PUBLIC_LEGAL_BUSINESS_NAME),
    businessAddress: clean(process.env.NEXT_PUBLIC_LEGAL_BUSINESS_ADDRESS),
  },
} as const;

/** Header navigation; labels come from `dict.nav`. */
export const navLinks = [
  { href: "/shop", key: "shop" },
  { href: "/collections", key: "collections" },
  { href: "/how-to-order", key: "howToOrder" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;
