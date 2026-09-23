import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ClockIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import { getProduct, getProductHandles, getProducts } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";
import { policySettings } from "@/lib/content/policy-settings";
import { primaryEstimate, shipping } from "@/lib/content/shipping";
import styles from "./product.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const handles = await getProductHandles();
  return handles.map(({ handle }) => ({ handle }));
}

export async function generateMetadata(props: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);
  if (!product) return {};
  const description = product.seo.description || product.description.slice(0, 160);
  const image = product.featuredImage;
  return {
    title: product.seo.title || product.title,
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description,
      images: image ? [{ url: image.url, alt: image.altText || product.title }] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getProducts({ sort: "best-selling", limit: 8 }))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    url: `${siteConfig.url}/products/${product.handle}`,
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
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <ProductDetail product={product} />

      <div className={styles.details}>
        <section aria-labelledby="about-title">
          <h2 id="about-title" className={styles.h2}>
            About this product
          </h2>
          {product.descriptionHtml ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          ) : (
            <p className="muted">{product.description}</p>
          )}
        </section>

        <aside aria-labelledby="delivery-title" className={styles.facts}>
          <h2 id="delivery-title" className={styles.h2}>
            Delivery &amp; returns
          </h2>
          <ul>
            <li>
              <span className={styles.icon}>
                <TruckIcon />
              </span>
              <span>
                <b>Ships from {shipping.shipsFrom}</b>
                <small>Shipping costs are shown at checkout.</small>
              </span>
            </li>
            <li>
              <span className={styles.icon}>
                <ClockIcon />
              </span>
              <span>
                <b>Prepared in {shipping.processing.days}</b>
                <small>
                  Then an estimated {primaryEstimate.days} to {primaryEstimate.destination}.
                </small>
              </span>
            </li>
            <li>
              <span className={styles.icon}>
                <ReturnIcon />
              </span>
              <span>
                <b>{policySettings.returnWindowDays}-day returns</b>
                <small>Change your mind within {policySettings.returnWindowDays} days of delivery.</small>
              </span>
            </li>
          </ul>
          <p className="small">
            <Link href="/policies/shipping-policy" className="text-link">
              Shipping policy
            </Link>{" "}
            ·{" "}
            <Link href="/policies/refund-policy" className="text-link">
              Refund policy
            </Link>
          </p>
        </aside>
      </div>

      {related.length ? (
        <section className="block" aria-labelledby="related-title">
          <div className="head">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2 id="related-title">More from MimoPets</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
