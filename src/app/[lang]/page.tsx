import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroIllustration } from "@/components/art/Illustration";
import { CategoryGrid, PhotoCredit } from "@/components/collection/CategoryGrid";
import { FaqList } from "@/components/content/FaqList";
import { OrderSteps } from "@/components/content/OrderSteps";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChatIcon, CheckIcon, ClockIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { featuredFaqIds, getFaqGroups } from "@/content/faq";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getCollections, getProducts } from "@/lib/commerce";
import { HERO_PHOTO } from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import { policySettings } from "@/lib/content/policy-settings";
import { getShipping } from "@/lib/content/shipping";
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

  const [collections, products] = await Promise.all([
    getCollections(lang),
    getProducts(lang, { sort: "best-selling", limit: 8 }),
  ]);
  const featuredFaqs = getFaqGroups(lang)
    .flatMap((g) => g.items)
    .filter((item) => featuredFaqIds.includes(item.id));

  return (
    <div className="wrap">
      <section className={styles.hero}>
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className={styles.title}>
            {t.titleLine1}
            <br />
            <span className={styles.pink}>{t.titleLine2}</span>
          </h1>
          <p className="lead">{fmt(t.lead, { name: siteConfig.name })}</p>
          <div className={styles.cta}>
            <Link className="btn btn-pink" href={href(`/products/${siteConfig.featuredProductHandle}`)}>
              {t.ctaProduct}
            </Link>
            <Link className="btn btn-ghost" href={href("/collections")}>
              {t.ctaCategories}
            </Link>
          </div>
          <ul className={styles.trust}>
            <li>
              <CheckIcon />
              {t.trustBestseller}
            </li>
            <li>
              <CheckIcon />
              {t.trustPets}
            </li>
            <li>
              <CheckIcon />
              {t.trustBeds}
            </li>
          </ul>
        </div>
        <div className={styles.art}>
          <div className={styles.blob} />
          <HeroIllustration className={styles.ill} />
          <Photo
            src={HERO_PHOTO.src}
            alt={dict.photos[HERO_PHOTO.alt]}
            fill
            preload
            sizes="(max-width: 860px) 360px, 460px"
            className={styles.photo}
          />
          <div className={`${styles.chip} ${styles.c1}`}>
            <span className={styles.dot}>
              <TruckIcon />
            </span>
            <span>
              <b>{t.chip1Title}</b>
              <small>{t.chip1Text}</small>
            </span>
          </div>
          <div className={`${styles.chip} ${styles.c2}`}>
            <span className={styles.dot}>
              <ChatIcon />
            </span>
            <span>
              <b>{t.chip2Title}</b>
              <small>{t.chip2Text}</small>
            </span>
          </div>
        </div>
      </section>

      <ul className={styles.facts} aria-label={t.factsLabel}>
        <li>
          <span className={styles.factIcon}>
            <ClockIcon />
          </span>
          <span>
            <b>{fmt(t.factsPrepared, { days: shipping.processing.days })}</b>
            <small>{fmt(t.factsPreparedText, { share: shipping.processing.share })}</small>
          </span>
        </li>
        <li>
          <span className={styles.factIcon}>
            <TruckIcon />
          </span>
          <span>
            <b>
              {fmt(t.factsDelivery, {
                days: shipping.primaryEstimate.days,
                destination: shipping.primaryEstimate.destination,
              })}
            </b>
            <small>{t.factsDeliveryText}</small>
          </span>
        </li>
        <li>
          <span className={styles.factIcon}>
            <ReturnIcon />
          </span>
          <span>
            <b>{fmt(t.factsReturns, { days: returnDays })}</b>
            <small>{fmt(t.factsReturnsText, { days: returnDays })}</small>
          </span>
        </li>
      </ul>

      <section className="block" id="categories" aria-labelledby="categories-title">
        <div className="head">
          <div>
            <p className="eyebrow">{t.categoriesEyebrow}</p>
            <h2 id="categories-title">{t.categoriesTitle}</h2>
          </div>
          <Link href={href("/collections")} className="btn btn-ghost btn-sm">
            {t.categoriesLink}
          </Link>
        </div>
        <CategoryGrid collections={collections} />
        <PhotoCredit />
      </section>

      <section className="block" id="products" aria-labelledby="products-title">
        <div className="head">
          <div>
            <p className="eyebrow">{t.productsEyebrow}</p>
            <h2 id="products-title">{products.length === 3 ? t.productsTitleThree : t.productsTitle}</h2>
            <p className="lead">{t.productsLead}</p>
          </div>
          <Link href={href("/shop")} className="btn btn-ghost btn-sm">
            {dict.common.shopAll}
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="block" id="how" aria-labelledby="how-title">
        <div className="head">
          <div>
            <p className="eyebrow">{t.howEyebrow}</p>
            <h2 id="how-title">{t.howTitle}</h2>
          </div>
          <Link href={href("/how-to-order")} className="btn btn-ghost btn-sm">
            {t.howLink}
          </Link>
        </div>
        <OrderSteps />
      </section>

      <section className="block" id="faq" aria-labelledby="faq-title">
        <div className="head">
          <div>
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2 id="faq-title">{t.faqTitle}</h2>
          </div>
          <Link href={href("/faq")} className="btn btn-ghost btn-sm">
            {t.faqLink}
          </Link>
        </div>
        <FaqList items={featuredFaqs} />
      </section>
    </div>
  );
}
