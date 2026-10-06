import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Illustration } from "./types";

/** Alt text for the prototype's photos lives in `dict.photos`. */
type PhotoAlt = Exclude<keyof Dictionary["photos"], "credit">;

/**
 * Presentation details that Shopify has no native field for.
 *
 * In Shopify, add product tags to control them:
 *   badge:Best seller   → card label (badge-es:… for the Spanish site)
 *   pet:Cat & dog       → "for" line on the card (pet-es:… for the Spanish site)
 *   art:beds            → fallback illustration when a product has no photo
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

const ILLUSTRATIONS: Illustration[] = ["care", "beds", "toys", "collars"];

export function illustrationFor(tags: string[], productType = "", title = ""): Illustration {
  const explicit = readTag(tags, "art");
  if (explicit && (ILLUSTRATIONS as string[]).includes(explicit)) return explicit as Illustration;
  const hay = `${productType} ${title} ${tags.join(" ")}`.toLowerCase();
  // English and Spanish words, so both languages pick the same art.
  if (/\b(bed|sofa|sleep|cushion|blanket|cama|sof[aá]|saco|coj[ií]n|manta)/.test(hay)) return "beds";
  if (/\b(toy|ball|chew|juguete|pelota|mordedor)/.test(hay)) return "toys";
  if (/\b(collar|leash|harness|correa|arn[eé]s)/.test(hay)) return "collars";
  return "care";
}

/** Tile colours from the prototype: care → cream, beds → pink, other → lilac. */
export function tileFor(illustration: Illustration): "t1" | "t2" | "t3" {
  if (illustration === "care") return "t3";
  if (illustration === "beds") return "t2";
  return "t1";
}

type CollectionPresentation = {
  tile: "t1" | "t2" | "t3";
  illustration: Illustration;
  photo?: { src: string; alt: PhotoAlt };
};

/**
 * Category photography from the prototype (Unsplash). Keyed by collection
 * handle — create collections with these handles in Shopify to reuse them.
 */
const COLLECTION_PRESENTATION: Record<string, CollectionPresentation> = {
  "grooming-care": {
    tile: "t3",
    illustration: "care",
    photo: {
      src: "https://images.unsplash.com/photo-1672426637977-1c84fb473464?auto=format&fit=crop&w=1200&q=80",
      alt: "groomingCare",
    },
  },
  "comfort-beds": {
    tile: "t2",
    illustration: "beds",
    photo: {
      src: "https://images.unsplash.com/photo-1564350711178-50a75122c3ea?auto=format&fit=crop&w=1200&q=80",
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

export const HERO_PHOTO = {
  src: "https://images.unsplash.com/photo-1509205477838-a534e43a849f?auto=format&fit=crop&w=1000&q=85",
  alt: "hero",
} as const satisfies { src: string; alt: PhotoAlt };
