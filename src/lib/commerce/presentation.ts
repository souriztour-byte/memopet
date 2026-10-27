import type { Dictionary } from "@/i18n/dictionaries/en";
import { photoUrl } from "@/lib/photos";
import type { Illustration } from "./types";

/**
 * Images made with AI rather than photographed carry a note under the photo.
 * In Shopify, start the image's alt text with this sentence (in each language).
 */
export const AI_IMAGE_NOTE = {
  en: "AI-generated illustration of the product in use",
  es: "Ilustración generada con IA del producto en uso",
} as const;

export const aiNoteFor = (altText: string | null) =>
  (altText && Object.values(AI_IMAGE_NOTE).find((note) => altText.startsWith(note))) || null;

/* ─── Pairs well with ─────────────────────────────────────────────────── */

const kindOf = (illustration: Illustration) => (illustration === "care" ? "care" : "comfort");

/**
 * Suggestions to go with what the shopper is looking at or has in the cart:
 * products not already chosen, from the other category first (a paw washer
 * goes with a bed, and the other way round).
 */
export function pairsWith<T extends { handle: string; illustration: Illustration }>(
  all: T[],
  chosen: { handle: string; illustration: Illustration }[],
  limit: number,
): T[] {
  const handles = new Set(chosen.map((c) => c.handle));
  const kinds = new Set(chosen.map((c) => kindOf(c.illustration)));
  return all
    .filter((p) => !handles.has(p.handle))
    .sort((a, b) => Number(kinds.has(kindOf(a.illustration))) - Number(kinds.has(kindOf(b.illustration))))
    .slice(0, limit);
}

/* ─── Colour swatches ────────────────────────────────────────────────── */

/** Option names that hold colours, in English and Spanish. */
export const isColourOption = (name: string) => /^(colou?r|colores?)$/i.test(name.trim());

/**
 * Swatch shades for the colour names used in Shopify, matched to the product
 * photos. A colour missing here shows its name instead of a dot.
 */
const SWATCHES: Record<string, string> = {
  blue: "#3b9be0",
  azul: "#3b9be0",
  pink: "#f0a7b8",
  rosa: "#f0a7b8",
  green: "#86cdbd",
  verde: "#86cdbd",
  grey: "#a7a7a4",
  gray: "#a7a7a4",
  gris: "#a7a7a4",
  coffee: "#b08562",
  café: "#b08562",
  cafe: "#b08562",
  beige: "#e8dac4",
  black: "#2b2724",
  negro: "#2b2724",
  white: "#f6f4ef",
  blanco: "#f6f4ef",
};
export const swatchFor = (value: string) => SWATCHES[value.trim().toLowerCase()] ?? null;

/* ─── Before & after ─────────────────────────────────────────────────── */

/**
 * A product shows a before/after comparison when two of its Shopify images
 * have alt text starting with "Before" and "After" (or "Antes" / "Después").
 */
export function beforeAfterImages<T extends { altText: string | null }>(images: T[]) {
  const find = (re: RegExp) => images.find((i) => i.altText && re.test(i.altText.trim()));
  const before = find(/^(before|antes)\b/i);
  const after = find(/^(after|despu[eé]s)\b/i);
  return before && after ? { before, after } : null;
}

/** Alt text for the prototype's photos lives in `dict.photos`. */
type PhotoAlt = keyof Dictionary["photos"];

/**
 * Presentation details that Shopify has no native field for.
 *
 * In Shopify, add product tags to control them:
 *   badge:Best seller   → card label (badge-es:… for the Spanish site)
 *   pet:Cat & dog       → "for" line on the card (pet-es:… for the Spanish site)
 *   art:sofa            → fallback illustration when a product has no photo
 *                         (care, beds, sofa, sleeping-bag, toys, collars)
 */
export function readTag(tags: string[], key: string) {
  const prefix = `${key}:`;
  const tag = tags.find((t) => t.toLowerCase().startsWith(prefix));
  return tag ? tag.slice(prefix.length).trim() || null : null;
}

/**
 * Shopify can't translate tags, so a language-specific tag wins when present:
 *   badge-es:Más vendido  → Spanish pages
 *   badge:Best seller     → every other language
 */
export function readLocalizedTag(tags: string[], key: string, lang: string) {
  return readTag(tags, `${key}-${lang}`) ?? readTag(tags, key);
}

const ILLUSTRATIONS: Illustration[] = ["care", "beds", "sofa", "sleeping-bag", "toys", "collars"];

export function illustrationFor(tags: string[], productType = "", title = ""): Illustration {
  const explicit = readTag(tags, "art");
  if (explicit && (ILLUSTRATIONS as string[]).includes(explicit)) return explicit as Illustration;
  const hay = `${productType} ${title} ${tags.join(" ")}`.toLowerCase();
  // English and Spanish words, so both languages pick the same art.
  if (/\b(sleeping[ -]?bag|saco)/.test(hay)) return "sleeping-bag";
  if (/\b(sofa|couch|sof[aá])/.test(hay)) return "sofa";
  if (/\b(bed|sleep|cushion|blanket|cama|coj[ií]n|manta)/.test(hay)) return "beds";
  if (/\b(toy|ball|chew|juguete|pelota|mordedor)/.test(hay)) return "toys";
  if (/\b(collar|leash|harness|correa|arn[eé]s)/.test(hay)) return "collars";
  return "care";
}

/** Tile colours from the prototype: care → cream, beds → pink, other → lilac. */
export function tileFor(illustration: Illustration): "t1" | "t2" | "t3" {
  if (illustration === "care") return "t3";
  if (illustration === "beds" || illustration === "sofa") return "t2";
  return "t1";
}

type CollectionPresentation = {
  tile: "t1" | "t2" | "t3";
  illustration: Illustration;
  photo?: { src: string; alt: PhotoAlt };
};

/**
 * Category photos: the shop's own product photos (public/photos). Keyed by
 * collection handle — create collections with these handles in Shopify to
 * reuse them, or give a collection its own image there.
 */
const COLLECTION_PRESENTATION: Record<string, CollectionPresentation> = {
  "grooming-care": {
    tile: "t3",
    illustration: "care",
    photo: {
      src: photoUrl("silicone-paw-washer/colours.jpg"),
      alt: "groomingCare",
    },
  },
  "comfort-beds": {
    tile: "t2",
    illustration: "beds",
    photo: {
      src: photoUrl("luxury-cat-sofa-bed/cat-lounging.jpg"),
      alt: "comfortBeds",
    },
  },
};

export function collectionPresentation(handle: string, title = ""): CollectionPresentation {
  const known = COLLECTION_PRESENTATION[handle];
  if (known) return known;
  const illustration = illustrationFor([], "", `${handle} ${title}`);
  return { tile: tileFor(illustration), illustration };
}

/**
 * Photos the home hero cross-fades between (the first one loads first).
 * `ai` marks an AI illustration, which shows the AI note while it's on screen;
 * `focus` is the part of the photo to keep in view when it's cropped.
 */
export const HERO_SLIDES = [
  { src: photoUrl("luxury-cat-sofa-bed/cat-lounging.jpg"), alt: "comfortBeds", ai: false },
  { src: photoUrl("warming-sleeping-bag-bed/cat-sleeping.jpg"), alt: "catAsleep", ai: false },
  { src: photoUrl("paw-washer-cup/in-use-ai.jpg"), alt: "corgiInUse", ai: true, focus: "center 12%" },
  { src: photoUrl("luxury-cat-sofa-bed/cat-playing.jpg"), alt: "sofaPlay", ai: false },
] as const satisfies readonly { src: string; alt: PhotoAlt; ai: boolean; focus?: string }[];

/** Photos for the home page's story sections and guide (public/photos). */
export const HOME_PHOTOS = {
  comfort: [
    { src: photoUrl("luxury-cat-sofa-bed/cat-lounging.jpg"), alt: "comfortBeds" },
    { src: photoUrl("warming-sleeping-bag-bed/cat-sleeping.jpg"), alt: "catAsleep" },
    { src: photoUrl("warming-sleeping-bag-bed/ears.jpg"), alt: "bedEars" },
  ],
  care: [
    { src: photoUrl("paw-washer-cup/colours.jpg"), alt: "cupColours" },
    { src: photoUrl("silicone-paw-washer/dog-and-cats.jpg"), alt: "pawInCup" },
    { src: photoUrl("silicone-paw-washer/in-use-ai.jpg"), alt: "dogInUse", ai: true },
    { src: photoUrl("paw-washer-cup/brushes.jpg"), alt: "cupBrushes" },
  ],
  guideMain: { src: photoUrl("warming-sleeping-bag-bed/cat-sleeping.jpg"), alt: "catAsleep" },
  guideOrder: { src: photoUrl("paw-washer-cup/brushes.jpg"), alt: "cupBrushes" },
  guideDelivery: { src: photoUrl("luxury-cat-sofa-bed/coffee.jpg"), alt: "sofaCoffee" },
  guideFaq: { src: photoUrl("warming-sleeping-bag-bed/ears.jpg"), alt: "bedEars" },
} as const satisfies {
  comfort: readonly { src: string; alt: PhotoAlt }[];
  care: readonly { src: string; alt: PhotoAlt; ai?: boolean }[];
} & Record<`guide${string}`, { src: string; alt: PhotoAlt }>;
