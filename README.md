# MimoPets — headless Shopify storefront

A Next.js storefront for **MimoPets** (“Little things. Happier pets.”), built from the
`mimopets_4.html` prototype. It uses the same palette, fonts (Poppins + Nunito Sans), logo,
illustrations and copy. Products, prices, the cart and checkout come from Shopify through the
**Storefront API**.

- **Next.js 16** (App Router, React 19, TypeScript), plain CSS with CSS Modules — no UI framework.
- **Shopify Storefront API** (GraphQL) for catalog, collections, cart and store policies.
  Checkout runs on Shopify’s hosted checkout.
- **Demo mode**: with no Shopify credentials the site runs on a small local catalog taken from
  the prototype, so you can develop and review it before connecting a store.

## Pages

Every page is its own route:

| Route | What it is |
| --- | --- |
| `/` | Home: hero, categories, best sellers, how to order, FAQ highlights |
| `/shop` | All products, with search (`?q=`), sort (`?sort=`) and category filter (`?category=`) |
| `/collections` | All categories |
| `/collections/[handle]` | One category and its products |
| `/products/[handle]` | Product page: photos, options, quantity, add to cart, delivery facts |
| `/cart` | Full cart page (there is also a slide-out cart drawer on every page) |
| `/how-to-order` | Ordering steps and what happens after you order |
| `/faq` | Frequently asked questions, grouped by topic (with FAQPage structured data) |
| `/contact` | Email and Instagram (shows “Coming soon” until configured) |
| `/policies` | Index of store policies |
| `/policies/shipping-policy` | Shipping policy |
| `/policies/refund-policy` | Returns & refunds |
| `/policies/privacy-policy` | Privacy policy |
| `/policies/terms-of-service` | Terms of service |

Plus `sitemap.xml`, `robots.txt`, a 404 page and `/api/revalidate` for Shopify webhooks.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — leave Shopify empty for demo mode
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Connecting Shopify

1. In Shopify admin, install the **Headless** sales channel and create a storefront. You can also
   create a custom app with Storefront API access.
2. Copy the **public Storefront API access token** into `.env.local`, and set your store domain:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   ```
   You can use `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` instead. All Shopify calls run on the server.
   The API version defaults to `2026-07`; override it with `SHOPIFY_STOREFRONT_API_VERSION`.
3. Restart the dev server. Demo mode switches off automatically and checkout goes to Shopify.

### Setting up products in Shopify

These conventions keep the storefront looking like the prototype:

- **Collections**: create `grooming-care` (“Grooming & care”) and `comfort-beds` (“Comfort &
  beds”). They reuse the prototype’s category photos. Other collections work too; prefix a handle
  with `hidden-` to keep it off the site.
- **Paw washer handle**: the hero and announcement bar link to `silicone-paw-washer`. If your
  product handle is different, set `NEXT_PUBLIC_FEATURED_PRODUCT_HANDLE`.
- **Product tags**:
  - `badge:Best seller` → label on the product card
  - `pet:Cat & dog` → the small “for” line above the title
  - `art:care` / `art:beds` / `art:toys` / `art:collars` → illustration shown while a product
    has no photo. It is guessed from the title when there is no tag.
- **Policies**: policies written in *Settings → Policies* replace the local drafts automatically,
  one by one.

### Keeping pages fresh

Catalog pages are cached for an hour. For instant updates, add Shopify webhooks for product and
collection create/update/delete. Point them at `https://<your-site>/api/revalidate`, then set
`SHOPIFY_WEBHOOK_SECRET` to the signing secret shown under *Settings → Notifications → Webhooks*.
The route checks each webhook’s HMAC signature before it clears the cache.

## Store details

Business facts are never hard-coded. Set these and the Contact page, FAQ and policies pick them up:

```
NEXT_PUBLIC_SITE_URL=https://mimopets.com
NEXT_PUBLIC_SUPPORT_EMAIL=hello@mimopets.com
NEXT_PUBLIC_INSTAGRAM_HANDLE=mimopets
NEXT_PUBLIC_LEGAL_BUSINESS_NAME=...
NEXT_PUBLIC_LEGAL_BUSINESS_ADDRESS=...
```

## Where the content comes from

The site states nothing that isn’t in one of these sources:

| Content | Source |
| --- | --- |
| Colours, fonts, logo, illustrations, hero copy, card labels | HTML prototype |
| Demo products and prices (Silicone Paw Washer $15, Luxury Cat Sofa Bed $45, Warming Sleeping Bag Bed $39) | HTML prototype (its sample data) |
| Paw washer: silicone brush in a cleaning cup, for cats and dogs, sizes S and M | Supplier listing (CJ Dropshipping) |
| Ships from China; processing 1–3 days for ~90% of orders; delivery 8–18 days to Spain | Supplier listing, *CJPacket Ordinary* to ES — `src/lib/content/shipping.ts` |
| FAQ and the four policies | Drafted from the facts above, in `src/content/` |

Supplier costs (for example €6.55 + €8.49 shipping) and supplier SKUs are **not** shown anywhere.

## Before launch — please confirm

- [ ] **Retail prices and currency.** Demo prices are the prototype’s samples, in USD. The
      supplier listing is priced in EUR for delivery to Spain. Live prices come from Shopify.
- [ ] **Paw washer colours.** The supplier offers many cup/brush colour combinations, but only
      “Blue and Light Blue” was legible in the reference. Create colour variants in Shopify with
      the exact names you sell.
- [ ] **Product photos.** None are bundled; upload them in Shopify. Until then, the prototype’s
      illustrations are shown.
- [ ] **Bed details.** No specifications were available for the two beds, so their descriptions
      only restate the product names.
- [ ] **Delivery estimates for other countries.** Only Spain is known. Add more to
      `src/lib/content/shipping.ts`.
- [ ] **Policies.** The drafts use a 14-day return window (`src/lib/content/policy-settings.ts`)
      and describe EU/UK-style consumer rights. Have them reviewed for your business and markets,
      or write your own in Shopify admin.
- [ ] **Privacy policy vs. analytics.** The privacy policy says the site sets one cart cookie and
      no analytics or advertising cookies, which is true of this code. Update it if you add
      tracking.
- [ ] **Contact details and legal entity** (environment variables above).
- [ ] **Dark mode.** The prototype ships light-only (`<html data-theme="light">`). The dark palette
      is kept in `globals.css`; remove the attribute in `src/app/layout.tsx` to enable it.

## Project structure

```
src/
  app/                    routes (one folder per page), actions/cart.ts, api/cart, api/revalidate
  components/             layout, cart, product, collection, shop, content, brand, art, ui
  content/                faq.tsx, policies/*.tsx — editable copy
  lib/
    commerce/             store-agnostic types + entry point (Shopify or demo)
    shopify/              Storefront API client, GraphQL documents, provider
    demo/                 local demo catalog
    content/              shipping facts, policy settings, policy resolution
    config.ts             site name, navigation, env-driven store details
```

The cart ID is stored in an httpOnly cookie (`mimo_cart`), and cart changes run as Server
Actions. The cart is capped at 99 per line, like the prototype.
