import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/collection/CategoryGrid";
import { Price } from "@/components/product/Price";
import { ProductGrid } from "@/components/product/ProductGrid";
import { GiftIcon, LockIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt, plural } from "@/i18n/format";
import { getCollections, getProduct, getProducts } from "@/lib/commerce";
import { HERO_PHOTO, SPOTLIGHT } from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import { offerMoney, offers } from "@/lib/content/offers";
import { policySettings } from "@/lib/content/policy-settings";
import { getShipping } from "@/lib/content/shipping";
import { formatMoney } from "@/lib/format";
import styles from "./home.module.css";

export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  return hasLocale(lang) ? { alternates: alternatesFor(lang, "/") } : {};
}

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.home;
  const href = (path: string) => localizePath(lang, path);
  const shipping = getShipping(lang, dict);
  const returnDays = policySettings.returnWindowDays;
  const money = (amount: number) => formatMoney(offerMoney(amount), lang);

  const [collections, products, spotlight] = await Promise.all([
    getCollections(lang),
    getProducts(lang, { sort: "best-selling", limit: 8 }),
    getProduct(lang, SPOTLIGHT.handle),
  ]);
  const spotlightOption = spotlight?.options[0];

  const promises = [
    {
      icon: <TruckIcon />,
      title: fmt(t.promiseShipping, { amount: money(offers.shipping.freeFrom) }),
      text: fmt(t.promiseShippingText, {
        rate: money(offers.shipping.standardRate),
        destination: offers.shipping.destination[lang],
        days: shipping.primaryEstimate.days,
      }),
    },
    {
      icon: <GiftIcon />,
      title: fmt(t.promiseBundle, { percent: offers.bundle.percent }),
      text: t.promiseBundleText,
    },
    {
      icon: <ReturnIcon />,
      title: fmt(t.promiseReturns, { days: returnDays }),
      text: fmt(t.promiseReturnsText, { days: returnDays }),
    },
    { icon: <LockIcon />, title: t.promiseSecure, text: t.promiseSecureText },
  ];

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src={HERO_PHOTO.src}
          alt={dict.photos[HERO_PHOTO.alt]}
          fill
          preload
          quality={90}
          sizes="100vw"
          className={styles.heroPhoto}
        />
        <div className={`wrap ${styles.heroText}`}>
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            {t.heroTitleLine1}
            <br />
            <em>{t.heroTitleLine2}</em>
          </h1>
          <p className={styles.heroLead}>{t.heroLead}</p>
          <div className={styles.cta}>
            <Link className="btn btn-gold" href={href("/shop")}>
              {t.ctaDiscover}
            </Link>
            <Link className="btn btn-ghost" href={href("/collections/comfort-beds")}>
              {t.ctaBeds}
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <ul className={styles.promises} aria-label={t.promisesLabel}>
          {promises.map((p) => (
            <li key={p.title}>
              {p.icon}
              <span>
                <b>{p.title}</b>
                <small>{p.text}</small>
              </span>
            </li>
          ))}
        </ul>

        <section className="block" id="products" aria-labelledby="products-title">
          <div className="head">
            <div>
              <p className="eyebrow">{plural(lang, products.length, t.collectionCount)}</p>
              <h2 id="products-title">{t.collectionTitle}</h2>
            </div>
            <span className={styles.headLinks}>
              <span className={styles.swipe} aria-hidden="true">
                {t.swipe} →
              </span>
              <Link href={href("/shop")} className={styles.viewAll}>
                {t.viewAll}
              </Link>
            </span>
          </div>
          <ProductGrid products={products} rail />
        </section>
      </div>

      {spotlight ? (
        <section className={styles.spotlight} aria-labelledby="spotlight-title">
          <div className={`wrap ${styles.spotlightInner}`}>
            <div className={styles.spotlightPic}>
              <Image
                src={SPOTLIGHT.photo}
                alt={t.spotlightPhoto}
                fill
                quality={90}
                sizes="(max-width: 900px) 100vw, 640px"
                className={styles.cover}
              />
              <span className={styles.badge}>{t.spotlightBadge}</span>
            </div>
            <div className={styles.spotlightText}>
              <p className="eyebrow">{t.spotlightEyebrow}</p>
              <h2 id="spotlight-title">
                {t.titleLine1}
                <br />
                <em>{t.titleLine2}</em>
              </h2>
              <p className={styles.spotlightLead}>{fmt(t.spotlightLead, { name: siteConfig.name })}</p>
              {spotlightOption ? (
                <ul className={styles.values} aria-label={spotlightOption.name}>
                  {spotlightOption.values.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              ) : null}
              <div className={styles.buy}>
                <Price
                  className={styles.spotlightPrice}
                  min={spotlight.priceRange.minVariantPrice}
                  max={spotlight.priceRange.maxVariantPrice}
                />
                <Link className="btn btn-gold" href={href(`/products/${spotlight.handle}`)}>
                  {t.spotlightCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="wrap">
        <section className={`block ${styles.categories}`} id="categories" aria-labelledby="categories-title">
          <div className="head">
            <div>
              <p className="eyebrow">{t.categoriesEyebrow}</p>
              <h2 id="categories-title">{t.categoriesTitle}</h2>
            </div>
          </div>
          <CategoryGrid collections={collections} />
        </section>
      </div>
    </>
  );
}
