import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { DeliveryEstimate } from "@/components/product/DeliveryEstimate";
import { ClockIcon, GiftIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import { alternatesFor, hasLocale, localizePath, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getProduct, getProductHandles, getProducts } from "@/lib/commerce";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ProductVideos } from "@/components/media/ProductVideos";
import { beforeAfterImages, pairsWith } from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import { policySettings } from "@/lib/content/policy-settings";
import { offerMoney, offers } from "@/lib/content/offers";
import { getShipping } from "@/lib/content/shipping";
import { formatMoney } from "@/lib/format";
import styles from "./product.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const handles = await getProductHandles();
  return handles.map(({ handle }) => ({ handle }));
}

export async function generateMetadata(props: PageProps<"/[lang]/products/[handle]">): Promise<Metadata> {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) return {};
  const product = await getProduct(lang, handle);
  if (!product) return {};
  const description = product.seo.description || product.description.slice(0, 160);
  return {
    title: product.seo.title || product.title,
    description,
    alternates: alternatesFor(lang, `/products/${product.handle}`),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocale[lang],
      title: product.title,
      description,
      // The image is ./opengraph-image.tsx: photo or illustration, name and price.
    },
  };
}

export default async function ProductPage(props: PageProps<"/[lang]/products/[handle]">) {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) notFound();
  const product = await getProduct(lang, handle);
  if (!product) notFound();

  const dict = getDictionary(lang);
  const t = dict.product;
  const shipping = getShipping(lang, dict);
  const { primaryEstimate } = shipping;
  const href = (path: string) => localizePath(lang, path);
  const days = policySettings.returnWindowDays;
  const shipTo = offers.shipping.destination[lang];
  const freeFrom = formatMoney(offerMoney(offers.shipping.freeFrom), lang);
  const rate = formatMoney(offerMoney(offers.shipping.standardRate), lang);

  const compare = beforeAfterImages(product.images);
  const related = pairsWith(await getProducts(lang, { sort: "best-selling", limit: 8 }), [product], 3);

  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => new URL(i.url, siteConfig.url).href),
    url: `${siteConfig.url}${href(`/products/${product.handle}`)}`,
    inLanguage: lang,
    ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: minVariantPrice.currencyCode,
      lowPrice: minVariantPrice.amount,
      highPrice: maxVariantPrice.amount,
      offerCount: product.variants.length,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label={t.breadcrumb} className={styles.crumbs}>
        <ol>
          <li>
            <Link href={href("/")}>{dict.common.home}</Link>
          </li>
          <li>
            <Link href={href("/shop")}>{dict.common.shop}</Link>
          </li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <ProductDetail
        product={product}
        perks={
          // Elements passed from a Server Component in a prop other than `children` need a key.
          <ul key="perks" className={styles.perks} aria-label={t.perksLabel}>
            <li>
              <ClockIcon />
              <DeliveryEstimate {...shipping.dates} />
            </li>
            <li>
              <TruckIcon />
              <span>{fmt(t.perkShipping, { destination: shipTo, amount: freeFrom })}</span>
            </li>
            <li>
              <GiftIcon />
              <span>{fmt(t.perkBundle, { percent: offers.bundle.percent })}</span>
            </li>
          </ul>
        }
      >
        <aside aria-labelledby="delivery-title" className={styles.facts}>
          <h2 id="delivery-title" className={styles.h2}>
            {t.delivery}
          </h2>
          <ul>
            <li>
              <span className={styles.icon}>
                <TruckIcon />
              </span>
              <span>
                <b>{fmt(t.shipsFrom, { country: shipping.shipsFrom })}</b>
                <small>{fmt(t.shippingRates, { rate, destination: shipTo, amount: freeFrom })}</small>
              </span>
            </li>
            <li>
              <span className={styles.icon}>
                <ClockIcon />
              </span>
              <span>
                <b>{fmt(t.preparedIn, { days: shipping.processing.days })}</b>
                <small>
                  {fmt(t.thenEstimate, {
                    days: primaryEstimate.days,
                    destination: primaryEstimate.destination,
                  })}
                </small>
              </span>
            </li>
            <li>
              <span className={styles.icon}>
                <ReturnIcon />
              </span>
              <span>
                <b>{fmt(t.returnsTitle, { days })}</b>
                <small>{fmt(t.returnsText, { days })}</small>
              </span>
            </li>
          </ul>
          <p className="small">
            <Link href={href("/policies/shipping-policy")} className="text-link">
              {t.shippingPolicy}
            </Link>{" "}
            ·{" "}
            <Link href={href("/policies/refund-policy")} className="text-link">
              {t.refundPolicy}
            </Link>
          </p>
        </aside>
      </ProductDetail>

      <div className={styles.details}>
        <section aria-labelledby="about-title">
          <h2 id="about-title" className={styles.h2}>
            {t.about}
          </h2>
          {product.descriptionHtml ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          ) : (
            <p className="muted">{product.description}</p>
          )}
        </section>
      </div>

      {product.videos.length ? (
        <section className={styles.media} aria-labelledby="video-title">
          <h2 id="video-title" className={styles.h2}>
            {t.videoTitle}
          </h2>
          <ProductVideos videos={product.videos} title={product.title} />
        </section>
      ) : null}

      {compare ? (
        <section className={styles.media} aria-labelledby="compare-title">
          <h2 id="compare-title" className={styles.h2}>
            {t.beforeAfterTitle}
          </h2>
          <BeforeAfter before={compare.before} after={compare.after} />
        </section>
      ) : null}

      {related.length ? (
        <section className="block" aria-labelledby="related-title">
          <div className="head">
            <div>
              <p className="eyebrow">{t.relatedEyebrow}</p>
              <h2 id="related-title">{fmt(t.relatedTitle, { percent: offers.bundle.percent })}</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
