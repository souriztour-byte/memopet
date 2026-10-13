import type { Collection, Image, Product, ProductVariant } from "@/lib/commerce/types";
import { locales, type Locale } from "@/i18n/config";

/**
 * Local catalog used when Shopify is not configured (demo mode).
 *
 * These are the shop's four supplier products (CJ Dropshipping). Names,
 * materials, sizes, colours and photos come from the supplier listings; the
 * home copy and badges come from the HTML prototype (mimopets_4.html). The
 * Spanish text is a translation of the same facts.
 *
 * Prices are the shop's proposed retail prices in euros (VAT included), set
 * to cover the supplier cost and shipping to Spain. Photos live in
 * public/photos/<handle>/. Once Shopify is connected, all products, prices,
 * variants and photos come from Shopify.
 */

/** The shop sells to Spain, so demo prices are in euros. */
export const DEMO_CURRENCY = "EUR";
const money = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: DEMO_CURRENCY });

type Text = Record<Locale, string>;

const COLLECTIONS: { handle: string; title: Text; description: Text }[] = [
  {
    handle: "grooming-care",
    title: { en: "Grooming & care", es: "Higiene y cuidado" },
    description: {
      en: "Paw washers for muddy walks",
      es: "Limpiapatas para los paseos con barro",
    },
  },
  {
    handle: "comfort-beds",
    title: { en: "Comfort & beds", es: "Confort y camas" },
    description: { en: "Cozy beds for cats & dogs", es: "Camas acogedoras para gatos y perros" },
  },
];

const SIZE: Text = { en: "Size", es: "Talla" };
const COLOUR: Text = { en: "Colour", es: "Color" };
const same = (label: string): Text => ({ en: label, es: label });
/** Shown under images that were made with AI rather than photographed. */
const AI_SCENE: Text = {
  en: "AI-generated illustration of the product in use",
  es: "Ilustración generada con IA del producto en uso",
};

type OptionDef = { name: Text; values: { key: string; label: Text }[] };

type ProductDef = {
  handle: string;
  collections: string[];
  title: Text;
  badge: Text | null;
  petType: Text;
  illustration: Product["illustration"];
  tile: Product["tile"];
  /** Paragraphs of the description. */
  description: Record<Locale, string[]>;
  options: OptionDef[];
  /** One entry per variant: its value key for each option (in order), price and photo. */
  variants: { values: string[]; price: number; photo?: string }[];
  /**
   * Files in public/photos/<handle>/, 1200 px square (one per language when the photo has
   * text on it), with an optional note shown under the photo.
   */
  photos: { file: string | Text; alt: Text; note?: Text }[];
  /** A 16:11 version of the first photo for product cards, so nothing gets cropped. */
  card?: string;
};

const PRODUCTS: ProductDef[] = [
  {
    handle: "silicone-paw-washer",
    collections: ["grooming-care"],
    title: { en: "Silicone Paw Washer", es: "Limpiapatas de silicona" },
    badge: { en: "Best seller", es: "Más vendido" },
    petType: { en: "Cat & dog", es: "Gato y perro" },
    illustration: "care",
    tile: "t3",
    description: {
      en: [
        "Made for pet parents tired of muddy floors. Add a little water, dip in each paw, and the soft, flexible silicone bristles lift the mud and dirt away — no towels, no mess.",
        "The cup is easy to take apart for cleaning and clicks back together. Its firm body stands steady and won't tip over like a soft cup.",
        "Material: silicone. In the box: 1 cup.",
        "Size S: 9 cm across the top, 7 cm at the base, 13.7 cm tall. Size M: 11 cm across the top, 8 cm at the base, 16.5 cm tall. Green comes in size M.",
      ],
      es: [
        "Pensado para quienes están cansados de los suelos llenos de barro. Añade un poco de agua, mete cada pata y las cerdas de silicona, suaves y flexibles, retiran el barro y la suciedad: sin toallas y sin ensuciar.",
        "El vaso se desmonta fácilmente para limpiarlo y se vuelve a montar en un momento. Su cuerpo firme se mantiene estable y no se vuelca como un vaso blando.",
        "Material: silicona. Incluye: 1 vaso.",
        "Talla S: 9 cm de diámetro arriba, 7 cm en la base y 13,7 cm de alto. Talla M: 11 cm arriba, 8 cm en la base y 16,5 cm de alto. El verde está disponible en talla M.",
      ],
    },
    options: [
      {
        name: COLOUR,
        values: [
          { key: "blue", label: { en: "Blue", es: "Azul" } },
          { key: "pink", label: { en: "Pink", es: "Rosa" } },
          { key: "green", label: { en: "Green", es: "Verde" } },
        ],
      },
      { name: SIZE, values: [{ key: "s", label: same("S") }, { key: "m", label: same("M") }] },
    ],
    variants: [
      { values: ["blue", "s"], price: 17.9, photo: "blue.jpg" },
      { values: ["blue", "m"], price: 22.9, photo: "blue.jpg" },
      { values: ["pink", "s"], price: 17.9, photo: "pink.jpg" },
      { values: ["pink", "m"], price: 22.9, photo: "pink.jpg" },
      { values: ["green", "m"], price: 22.9, photo: "green.jpg" },
    ],
    card: "card.jpg",
    photos: [
      { file: "dog-and-cats.jpg", alt: { en: "A dog and two cats with the blue paw washer", es: "Un perro y dos gatos con el limpiapatas azul" } },
      { file: "in-use-ai.jpg", note: AI_SCENE, alt: { en: "A dog with one paw in the blue paw washer", es: "Un perro con una pata dentro del limpiapatas azul" } },
      { file: "blue.jpg", alt: { en: "Blue silicone paw washer", es: "Limpiapatas de silicona azul" } },
      { file: "pink.jpg", alt: { en: "Pink silicone paw washer", es: "Limpiapatas de silicona rosa" } },
      { file: "green.jpg", alt: { en: "Green silicone paw washer", es: "Limpiapatas de silicona verde" } },
      { file: "colours.jpg", alt: { en: "The paw washer in pink, blue and green", es: "El limpiapatas en rosa, azul y verde" } },
      { file: "from-above.jpg", alt: { en: "Paw washers from above, showing the soft bristles inside", es: "Limpiapatas vistos desde arriba, con las cerdas suaves del interior" } },
      { file: "dogs.jpg", alt: { en: "Dogs behind the paw washers, showing the bristles inside", es: "Perros detrás de los limpiapatas, con las cerdas a la vista" } },
      {
        file: { en: "sizes-en.jpg", es: "sizes-es.jpg" },
        alt: { en: "Size S: 9 cm wide, 13.7 cm tall. Size M: 11 cm wide, 16.5 cm tall", es: "Talla S: 9 cm de ancho y 13,7 cm de alto. Talla M: 11 cm de ancho y 16,5 cm de alto" },
      },
    ],
  },
  {
    handle: "luxury-cat-sofa-bed",
    collections: ["comfort-beds"],
    title: { en: "Luxury Cat Sofa Bed", es: "Sofá cama de lujo para gatos" },
    badge: { en: "Premium", es: "Premium" },
    petType: { en: "Cat", es: "Gato" },
    illustration: "sofa",
    tile: "t2",
    description: {
      en: [
        "A plush little sofa with a thick, soft backrest, for Sphynx and other small cats who love to curl up.",
        "Anti-slip pellets on the bottom keep it in place and help keep damp out. A matching cushion is included.",
        "Material: soft plush fabric. In the box: 1 sofa bed and 1 cushion.",
        "Size M: 55 × 38 × 18 cm, for cats up to about 4 kg. Size L: 65 × 46 × 30 cm, for cats up to about 9 kg.",
      ],
      es: [
        "Un pequeño sofá de peluche con un respaldo grueso y suave, para gatos Sphynx y otros gatos pequeños a los que les encanta acurrucarse.",
        "La base lleva gránulos antideslizantes que lo mantienen en su sitio y ayudan a aislarlo de la humedad. Incluye un cojín a juego.",
        "Material: tejido de peluche suave. Incluye: 1 sofá cama y 1 cojín.",
        "Talla M: 55 × 38 × 18 cm, para gatos de hasta unos 4 kg. Talla L: 65 × 46 × 30 cm, para gatos de hasta unos 9 kg.",
      ],
    },
    options: [
      {
        name: COLOUR,
        values: [
          { key: "coffee", label: { en: "Coffee", es: "Café" } },
          { key: "beige", label: { en: "Beige", es: "Beige" } },
          { key: "pink", label: { en: "Pink", es: "Rosa" } },
        ],
      },
      { name: SIZE, values: [{ key: "m", label: same("M") }, { key: "l", label: same("L") }] },
    ],
    variants: [
      { values: ["coffee", "m"], price: 34.9, photo: "coffee.jpg" },
      { values: ["coffee", "l"], price: 42.9, photo: "coffee.jpg" },
      { values: ["beige", "m"], price: 34.9, photo: "beige.jpg" },
      { values: ["beige", "l"], price: 42.9, photo: "beige.jpg" },
      { values: ["pink", "m"], price: 34.9, photo: "pink.jpg" },
      { values: ["pink", "l"], price: 42.9, photo: "pink.jpg" },
    ],
    photos: [
      { file: "cat-lounging.jpg", alt: { en: "A grey cat lounging on the sofa bed", es: "Un gato gris tumbado en el sofá cama" } },
      { file: "cat-playing.jpg", alt: { en: "A grey cat climbing onto the sofa bed", es: "Un gato gris subiendo al sofá cama" } },
      { file: "coffee.jpg", alt: { en: "Coffee sofa bed with its matching cushion", es: "Sofá cama color café con su cojín a juego" } },
      { file: "beige.jpg", alt: { en: "Beige sofa bed with its matching cushion", es: "Sofá cama beige con su cojín a juego" } },
      { file: "pink.jpg", alt: { en: "Pink sofa bed with its matching cushion", es: "Sofá cama rosa con su cojín a juego" } },
      {
        file: { en: "sizes-en.jpg", es: "sizes-es.jpg" },
        alt: {
          en: "Size M: 55 × 38 × 18 cm, for cats up to about 4 kg. Size L: 65 × 46 × 30 cm, for cats up to about 9 kg",
          es: "Talla M: 55 × 38 × 18 cm, para gatos de hasta unos 4 kg. Talla L: 65 × 46 × 30 cm, para gatos de hasta unos 9 kg",
        },
      },
    ],
  },
  {
    handle: "paw-washer-cup",
    collections: ["grooming-care"],
    title: { en: "Paw Washer Cup", es: "Vaso limpiapatas" },
    badge: null,
    petType: { en: "Cat & dog", es: "Gato y perro" },
    illustration: "care",
    tile: "t3",
    description: {
      en: [
        "A paw washer cup for cats and dogs. The soft silicone bristles inside give muddy paws a deep clean after every walk.",
        "It comes apart for washing, so keeping the cup itself clean is easy.",
        "Material: PP and TPR. In the box: 1 cup.",
        "Size S: 9 cm wide, 13 cm tall. Size L: 10 cm wide, 15 cm tall.",
      ],
      es: [
        "Un vaso limpiapatas para gatos y perros. Las cerdas de silicona suave de su interior limpian a fondo las patas llenas de barro después de cada paseo.",
        "Se desmonta para lavarlo, así que mantener limpio el propio vaso es muy fácil.",
        "Material: PP y TPR. Incluye: 1 vaso.",
        "Talla S: 9 cm de ancho y 13 cm de alto. Talla L: 10 cm de ancho y 15 cm de alto.",
      ],
    },
    options: [
      {
        name: COLOUR,
        values: [
          { key: "green", label: { en: "Green", es: "Verde" } },
          { key: "grey", label: { en: "Grey", es: "Gris" } },
          { key: "pink", label: { en: "Pink", es: "Rosa" } },
        ],
      },
      { name: SIZE, values: [{ key: "s", label: same("S") }, { key: "l", label: same("L") }] },
    ],
    variants: [
      { values: ["green", "s"], price: 16.9, photo: "green.jpg" },
      { values: ["green", "l"], price: 19.9, photo: "green.jpg" },
      { values: ["grey", "s"], price: 16.9, photo: "grey.jpg" },
      { values: ["grey", "l"], price: 19.9, photo: "grey.jpg" },
      { values: ["pink", "s"], price: 16.9, photo: "pink.jpg" },
      { values: ["pink", "l"], price: 19.9, photo: "pink.jpg" },
    ],
    photos: [
      { file: "corgi.jpg", alt: { en: "A corgi resting next to the paw washer cup", es: "Un corgi descansando junto al vaso limpiapatas" } },
      { file: "in-use-ai.jpg", note: AI_SCENE, alt: { en: "A corgi with one paw in the paw washer cup", es: "Un corgi con una pata dentro del vaso limpiapatas" } },
      { file: "green.jpg", alt: { en: "Green paw washer cup", es: "Vaso limpiapatas verde" } },
      { file: "grey.jpg", alt: { en: "Grey paw washer cup", es: "Vaso limpiapatas gris" } },
      { file: "pink.jpg", alt: { en: "Pink paw washer cup", es: "Vaso limpiapatas rosa" } },
      { file: "colours.jpg", alt: { en: "The cup in three colours, cleaning a small dog's paw", es: "El vaso en tres colores, limpiando la pata de un perro pequeño" } },
      { file: "brushes.jpg", alt: { en: "The soft silicone bristles inside the cup", es: "Las cerdas de silicona suave del interior" } },
      { file: "sizes.jpg", alt: { en: "Size S: 9 × 13 cm. Size L: 10 × 15 cm", es: "Talla S: 9 × 13 cm. Talla L: 10 × 15 cm" } },
    ],
  },
  {
    handle: "warming-sleeping-bag-bed",
    collections: ["comfort-beds"],
    title: { en: "Warming Sleeping Bag Bed", es: "Cama saco de dormir térmica" },
    badge: null,
    petType: { en: "Cat & small dog", es: "Gato y perro pequeño" },
    illustration: "sleeping-bag",
    tile: "t1",
    description: {
      en: [
        "A soft, warming plush nest with little bear ears, for cats and small dogs who love to burrow in and sleep.",
        "Colour: grey outside, with a cream plush lining. Material: cotton.",
        "Size S: 42 × 42 × 30 cm. Size M: 52 × 52 × 32 cm.",
      ],
      es: [
        "Un nido de peluche suave y calentito con orejitas de oso, para gatos y perros pequeños a los que les encanta acurrucarse para dormir.",
        "Color: gris por fuera, con forro de peluche crema. Material: algodón.",
        "Talla S: 42 × 42 × 30 cm. Talla M: 52 × 52 × 32 cm.",
      ],
    },
    options: [{ name: SIZE, values: [{ key: "s", label: same("S") }, { key: "m", label: same("M") }] }],
    variants: [
      { values: ["s"], price: 36.9 },
      { values: ["m"], price: 44.9 },
    ],
    photos: [
      { file: "cat-sleeping.jpg", alt: { en: "A cat asleep in the sleeping bag bed", es: "Un gato dormido en la cama saco" } },
      { file: "bed.jpg", alt: { en: "The grey sleeping bag bed with its cream lining", es: "La cama saco gris con su forro crema" } },
      { file: "cats.jpg", alt: { en: "Cats curled up in the bed", es: "Gatos acurrucados en la cama" } },
      {
        file: { en: "sizes-en.jpg", es: "sizes-es.jpg" },
        alt: { en: "Size S: 42 × 42 × 30 cm. Size M: 52 × 52 × 32 cm", es: "Talla S: 42 × 42 × 30 cm. Talla M: 52 × 52 × 32 cm" },
      },
    ],
  },
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type DemoProduct = Product & { collections: string[] };

function buildProduct(def: ProductDef, lang: Locale): DemoProduct {
  const fileOf = (p: ProductDef["photos"][number]) => (typeof p.file === "string" ? p.file : p.file[lang]);
  const image = (file: string, alt: Text, width = 1200, height = width): Image => ({
    url: `/photos/${def.handle}/${file}`,
    altText: alt[lang],
    width,
    height,
  });
  const photo = (file: string): Image => {
    const found = def.photos.find((p) => fileOf(p) === file);
    if (!found) throw new Error(`Missing photo ${file} for ${def.handle}`);
    return { ...image(file, found.alt), note: found.note?.[lang] ?? null };
  };
  const images = def.photos.map((p) => photo(fileOf(p)));
  const card = def.card ? image(def.card, def.photos[0].alt, 1200, 825) : null;

  const label = (option: OptionDef, key: string) => {
    const value = option.values.find((v) => v.key === key);
    if (!value) throw new Error(`Unknown option value ${key} for ${def.handle}`);
    return value.label[lang];
  };
  const variants: ProductVariant[] = def.variants.map((v) => {
    const selectedOptions = def.options.map((option, i) => ({
      name: option.name[lang],
      value: label(option, v.values[i]),
    }));
    return {
      id: `demo:variant:${def.handle}:${v.values.join("-")}`,
      title: selectedOptions.map((o) => o.value).join(" / "),
      availableForSale: true,
      selectedOptions,
      price: money(v.price),
      compareAtPrice: null,
      image: v.photo ? photo(v.photo) : null,
    };
  });

  const prices = def.variants.map((v) => v.price);
  const paragraphs = def.description[lang];
  return {
    id: `demo:product:${def.handle}`,
    handle: def.handle,
    title: def.title[lang],
    collections: def.collections,
    availableForSale: true,
    featuredImage: card ?? images[0] ?? null,
    images,
    priceRange: {
      minVariantPrice: money(Math.min(...prices)),
      maxVariantPrice: money(Math.max(...prices)),
    },
    badge: def.badge?.[lang] ?? null,
    petType: def.petType[lang],
    illustration: def.illustration,
    tile: def.tile,
    singleVariantId: variants.length === 1 ? variants[0].id : null,
    updatedAt: null,
    vendor: null,
    description: paragraphs.join(" "),
    descriptionHtml: paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join(""),
    seo: { title: null, description: null },
    options: def.options.map((option) => ({
      name: option.name[lang],
      values: option.values.map((v) => v.label[lang]),
    })),
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
