import type { Collection, Product } from "@/lib/commerce/types";

/**
 * Local catalog used when Shopify is not configured (demo mode).
 *
 * Every value here comes from one of two sources — nothing is invented:
 *   • the HTML prototype (mimopets_4.html): names, prices, labels, copy
 *   • the supplier listing for the paw washer: product type, the
 *     silicone brush, cat & dog use, and the S / M sizes
 *
 * Prices are the prototype's sample prices. Once Shopify is connected, all
 * products, prices, variants and photos come from Shopify instead.
 */

const USD = "USD";
const money = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: USD });
const range = (amount: number) => ({ minVariantPrice: money(amount), maxVariantPrice: money(amount) });

export const DEMO_COLLECTIONS: Collection[] = [
  {
    id: "demo:collection:grooming-care",
    handle: "grooming-care",
    title: "Grooming & care",
    description: "Our bestselling paw washer",
    image: null,
    seo: { title: null, description: null },
  },
  {
    id: "demo:collection:comfort-beds",
    handle: "comfort-beds",
    title: "Comfort & beds",
    description: "Cozy beds for cats & dogs",
    image: null,
    seo: { title: null, description: null },
  },
];

type DemoProduct = Product & { collections: string[] };

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "demo:product:silicone-paw-washer",
    handle: "silicone-paw-washer",
    title: "Silicone Paw Washer",
    collections: ["grooming-care"],
    availableForSale: true,
    featuredImage: null,
    images: [],
    priceRange: range(15),
    badge: "Best seller",
    petType: "Cat & dog",
    illustration: "care",
    tile: "t3",
    singleVariantId: null,
    updatedAt: null,
    vendor: null,
    description:
      "The MimoPets Paw Washer lifts mud and dirt from every walk — no towels, no mess. A cleaning cup with a silicone washing brush inside, made for cats and dogs. Available in two sizes: S and M.",
    descriptionHtml:
      "<p>The MimoPets Paw Washer lifts mud and dirt from every walk — no towels, no mess.</p><p>A cleaning cup with a silicone washing brush inside, made for cats and dogs. Available in two sizes: S and M.</p>",
    seo: { title: null, description: null },
    options: [{ name: "Size", values: ["S", "M"] }],
    variants: [
      {
        id: "demo:variant:silicone-paw-washer:s",
        title: "S",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }],
        price: money(15),
        compareAtPrice: null,
        image: null,
      },
      {
        id: "demo:variant:silicone-paw-washer:m",
        title: "M",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }],
        price: money(15),
        compareAtPrice: null,
        image: null,
      },
    ],
  },
  {
    id: "demo:product:luxury-cat-sofa-bed",
    handle: "luxury-cat-sofa-bed",
    title: "Luxury Cat Sofa Bed",
    collections: ["comfort-beds"],
    availableForSale: true,
    featuredImage: null,
    images: [],
    priceRange: range(45),
    badge: "Premium",
    petType: "Cat",
    illustration: "beds",
    tile: "t2",
    singleVariantId: "demo:variant:luxury-cat-sofa-bed:default",
    updatedAt: null,
    vendor: null,
    description: "A sofa-style comfort bed for cats who love to curl up.",
    descriptionHtml: "<p>A sofa-style comfort bed for cats who love to curl up.</p>",
    seo: { title: null, description: null },
    options: [],
    variants: [
      {
        id: "demo:variant:luxury-cat-sofa-bed:default",
        title: "Default",
        availableForSale: true,
        selectedOptions: [],
        price: money(45),
        compareAtPrice: null,
        image: null,
      },
    ],
  },
  {
    id: "demo:product:warming-sleeping-bag-bed",
    handle: "warming-sleeping-bag-bed",
    title: "Warming Sleeping Bag Bed",
    collections: ["comfort-beds"],
    availableForSale: true,
    featuredImage: null,
    images: [],
    priceRange: range(39),
    badge: null,
    petType: "Dog",
    illustration: "beds",
    tile: "t2",
    singleVariantId: "demo:variant:warming-sleeping-bag-bed:default",
    updatedAt: null,
    vendor: null,
    description: "A sleeping-bag style comfort bed for dogs who love to curl up.",
    descriptionHtml: "<p>A sleeping-bag style comfort bed for dogs who love to curl up.</p>",
    seo: { title: null, description: null },
    options: [],
    variants: [
      {
        id: "demo:variant:warming-sleeping-bag-bed:default",
        title: "Default",
        availableForSale: true,
        selectedOptions: [],
        price: money(39),
        compareAtPrice: null,
        image: null,
      },
    ],
  },
];
