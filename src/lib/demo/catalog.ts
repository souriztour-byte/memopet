import type { Collection, Product } from "@/lib/commerce/types";
import { locales, type Locale } from "@/i18n/config";

/**
 * Local catalog used when Shopify is not configured (demo mode).
 *
 * Every value here comes from one of two sources — nothing is invented:
 *   • the HTML prototype (mimopets_4.html): names, prices, labels, copy
 *   • the supplier listing for the paw washer: product type, the
 *     silicone brush, cat & dog use, and the S / M sizes
 * The Spanish text is a translation of the same facts.
 *
 * Prices are the prototype's sample prices. Once Shopify is connected, all
 * products, prices, variants and photos come from Shopify instead.
 */

const USD = "USD";
const money = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: USD });
const range = (amount: number) => ({ minVariantPrice: money(amount), maxVariantPrice: money(amount) });

type Text = Record<Locale, string>;

const COLLECTIONS: { handle: string; title: Text; description: Text }[] = [
  {
    handle: "grooming-care",
    title: { en: "Grooming & care", es: "Higiene y cuidado" },
    description: { en: "Our bestselling paw washer", es: "Nuestro limpiapatas más vendido" },
  },
  {
    handle: "comfort-beds",
    title: { en: "Comfort & beds", es: "Confort y camas" },
    description: { en: "Cozy beds for cats & dogs", es: "Camas acogedoras para gatos y perros" },
  },
];

type ProductDef = {
  handle: string;
  collections: string[];
  price: number;
  title: Text;
  badge: Text | null;
  petType: Text;
  illustration: Product["illustration"];
  tile: Product["tile"];
  /** Paragraphs of the description. */
  description: Record<Locale, string[]>;
  /** One option with its values, or none for single-variant products. */
  option: { name: Text; values: string[] } | null;
};

const PRODUCTS: ProductDef[] = [
  {
    handle: "silicone-paw-washer",
    collections: ["grooming-care"],
    price: 15,
    title: { en: "Silicone Paw Washer", es: "Limpiapatas de silicona" },
    badge: { en: "Best seller", es: "Más vendido" },
    petType: { en: "Cat & dog", es: "Gato y perro" },
    illustration: "care",
    tile: "t3",
    description: {
      en: [
        "The MimiPets Paw Washer lifts mud and dirt from every walk — no towels, no mess.",
        "A cleaning cup with a silicone washing brush inside, made for cats and dogs. Available in two sizes: S and M.",
      ],
      es: [
        "El limpiapatas de MimiPets elimina el barro y la suciedad de cada paseo: sin toallas y sin ensuciar.",
        "Un vaso de limpieza con un cepillo de silicona en su interior, pensado para gatos y perros. Disponible en dos tallas: S y M.",
      ],
    },
    option: { name: { en: "Size", es: "Talla" }, values: ["S", "M"] },
  },
  {
    handle: "luxury-cat-sofa-bed",
    collections: ["comfort-beds"],
    price: 45,
    title: { en: "Luxury Cat Sofa Bed", es: "Sofá cama de lujo para gatos" },
    badge: { en: "Premium", es: "Premium" },
    petType: { en: "Cat", es: "Gato" },
    illustration: "sofa",
    tile: "t2",
    description: {
      en: ["A sofa-style comfort bed for cats who love to curl up."],
      es: ["Una cama confortable con forma de sofá para gatos a los que les encanta acurrucarse."],
    },
    option: null,
  },
  {
    handle: "warming-sleeping-bag-bed",
    collections: ["comfort-beds"],
    price: 39,
    title: { en: "Warming Sleeping Bag Bed", es: "Cama saco de dormir térmica" },
    badge: null,
    petType: { en: "Dog", es: "Perro" },
    illustration: "sleeping-bag",
    tile: "t1",
    description: {
      en: ["A sleeping-bag style comfort bed for dogs who love to curl up."],
      es: ["Una cama confortable con forma de saco de dormir para perros a los que les encanta acurrucarse."],
    },
    option: null,
  },
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type DemoProduct = Product & { collections: string[] };

function buildProduct(def: ProductDef, lang: Locale): DemoProduct {
  const variantId = (key: string) => `demo:variant:${def.handle}:${key}`;
  const variants = def.option
    ? def.option.values.map((value) => ({
        id: variantId(value.toLowerCase()),
        title: value,
        availableForSale: true,
        selectedOptions: [{ name: def.option!.name[lang], value }],
        price: money(def.price),
        compareAtPrice: null,
        image: null,
      }))
    : [
        {
          id: variantId("default"),
          title: "Default",
          availableForSale: true,
          selectedOptions: [],
          price: money(def.price),
          compareAtPrice: null,
          image: null,
        },
      ];
  const paragraphs = def.description[lang];
  return {
    id: `demo:product:${def.handle}`,
    handle: def.handle,
    title: def.title[lang],
    collections: def.collections,
    availableForSale: true,
    featuredImage: null,
    images: [],
    priceRange: range(def.price),
    badge: def.badge?.[lang] ?? null,
    petType: def.petType[lang],
    illustration: def.illustration,
    tile: def.tile,
    singleVariantId: def.option ? null : variants[0].id,
    updatedAt: null,
    vendor: null,
    description: paragraphs.join(" "),
    descriptionHtml: paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join(""),
    seo: { title: null, description: null },
    options: def.option ? [{ name: def.option.name[lang], values: def.option.values }] : [],
    variants,
  };
}

const catalogs = Object.fromEntries(
  locales.map((lang) => [
    lang,
    {
      products: PRODUCTS.map((p) => buildProduct(p, lang)),
      collections: COLLECTIONS.map(
        (c): Collection => ({
          id: `demo:collection:${c.handle}`,
          handle: c.handle,
          title: c.title[lang],
          description: c.description[lang],
          image: null,
          seo: { title: null, description: null },
        }),
      ),
    },
  ]),
) as Record<Locale, { products: DemoProduct[]; collections: Collection[] }>;

export const getDemoCatalog = (lang: Locale) => catalogs[lang];
