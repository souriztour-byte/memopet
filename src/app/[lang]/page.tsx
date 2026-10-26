import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getProducts } from "@/lib/commerce";
import { HERO_PHOTO, HOME_PHOTOS } from "@/lib/commerce/presentation";
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

type Photo = { src: string; alt: string };

/** Product on a stone tile with its story, beside a lifestyle photo. */
function Feature({
  id,
  eyebrow,
  title,
  text,
  href,
  cta,
  tile,
  scene,
  flip,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  tile: Photo;
  scene: Photo;
  flip?: boolean;
}) {
  return (
    <section className={`${styles.feature} ${flip ? styles.flip : ""}`} aria-labelledby={id}>
      <div className={styles.featureTile}>
        <div className={styles.featureProduct}>
          <Image src={tile.src} alt={tile.alt} fill sizes="(max-width: 760px) 80vw, 420px" className={styles.contain} />
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className={styles.featureTitle}>
          {title}
        </h2>
        <p className={styles.featureText}>{text}</p>
        <Link href={href} className={styles.more}>
          {cta} →
        </Link>
      </div>
      <div className={styles.featureScene}>
        <Image src={scene.src} alt={scene.alt} fill quality={90} sizes="(max-width: 760px) 100vw, 640px" className={styles.cover} />
      </div>
    </section>
  );
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
  const photo = (p: (typeof HOME_PHOTOS)[keyof typeof HOME_PHOTOS]): Photo => ({
    src: p.src,
    alt: dict.photos[p.alt],
  });

  const products = await getProducts(lang, { sort: "best-selling", limit: 8 });

  const promises = [
    {
      title: fmt(t.promiseShipping, { amount: money(offers.shipping.freeFrom) }),
      text: fmt(t.promiseShippingText, {
        rate: money(offers.shipping.standardRate),
        destination: offers.shipping.destination[lang],
        days: shipping.primaryEstimate.days,
      }),
    },
    { title: fmt(t.promiseBundle, { percent: offers.bundle.percent }), text: t.promiseBundleText },
    {
      title: fmt(t.promiseReturns, { days: returnDays }),
      text: fmt(t.promiseReturnsText, { days: returnDays }),
    },
    { title: t.promiseSecure, text: t.promiseSecureText },
  ];

  const guides = [
    { href: "/how-to-order", title: t.guideOrderTitle, text: t.guideOrderText, photo: photo(HOME_PHOTOS.guideOrder) },
    {
      href: "/policies/shipping-policy",
      title: t.guideDeliveryTitle,
      text: fmt(t.guideDeliveryText, {
        prepared: shipping.processing.days,
        days: shipping.primaryEstimate.days,
        destination: shipping.primaryEstimate.destination,
        returns: returnDays,
      }),
      photo: photo(HOME_PHOTOS.guideDelivery),
    },
    { href: "/faq", title: t.guideFaqTitle, text: t.guideFaqText, photo: photo(HOME_PHOTOS.guideFaq) },
  ];
  const guideMain = photo(HOME_PHOTOS.guideMain);

  return (
    <div className="wrap">
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src={HERO_PHOTO.src}
          alt={dict.photos[HERO_PHOTO.alt]}
          fill
          preload
          quality={90}
          sizes="(max-width: 1360px) 100vw, 1280px"
          className={styles.heroPhoto}
        />
        <div className={styles.heroText}>
          <h1 id="hero-title" className={styles.heroName}>
            {siteConfig.name}
          </h1>
          <p className={styles.heroTagline}>{dict.brand.tagline}</p>
          <p className={styles.heroLead}>{t.heroLead}</p>
          <Link href={href("/shop")} className={`${styles.more} ${styles.heroMore}`}>
            {t.ctaDiscover} →
          </Link>
        </div>
      </section>

      <section className={styles.collection} aria-labelledby="products-title">
        <div className={styles.kickerRow}>
          <h2 id="products-title" className={styles.kicker}>
            {t.collectionTitle}
          </h2>
          <span className={styles.swipe} aria-hidden="true">
            {t.swipe} →
          </span>
        </div>
        <ProductGrid products={products} rail />
        <p className={styles.center}>
          <Link href={href("/shop")} className={styles.more}>
            {t.viewAll} →
          </Link>
        </p>
      </section>

      <Feature
        id="grooming-title"
        eyebrow={t.groomingEyebrow}
        title={t.groomingTitle}
        text={t.groomingText}
        href={href("/collections/grooming-care")}
        cta={t.discover}
        tile={photo(HOME_PHOTOS.groomingTile)}
        scene={photo(HOME_PHOTOS.groomingScene)}
      />
      <Feature
        id="beds-title"
        eyebrow={t.bedsEyebrow}
        title={t.bedsTitle}
        text={t.bedsText}
        href={href("/collections/comfort-beds")}
        cta={t.discover}
        tile={photo(HOME_PHOTOS.bedsTile)}
        scene={photo(HOME_PHOTOS.bedsScene)}
        flip
      />

      <ul className={styles.promises} aria-label={t.promisesLabel}>
        {promises.map((p) => (
          <li key={p.title}>
            <b>{p.title}</b>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>

      <section className={styles.guide} aria-labelledby="guide-title">
        <h2 id="guide-title" className={styles.kicker}>
          {t.guideEyebrow}
        </h2>
        <div className={styles.guideGrid}>
          <Link href={href("/shop")} className={styles.guideMain}>
            <span className={styles.guideMainPic}>
              <Image src={guideMain.src} alt={guideMain.alt} fill sizes="(max-width: 900px) 100vw, 760px" className={styles.cover} />
            </span>
            <span className={styles.guideMainText}>
              <b>{t.guideMainTitle}</b>
              <span>{t.guideMainText}</span>
              <span className={styles.more}>{t.readMore} →</span>
            </span>
          </Link>
          <ul className={styles.guideList}>
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={href(g.href)} className={styles.guideItem}>
                  <span className={styles.guideThumb}>
                    <Image src={g.photo.src} alt={g.photo.alt} fill sizes="120px" className={styles.cover} />
                  </span>
                  <span className={styles.guideItemText}>
                    <b>{g.title}</b>
                    <span>{g.text}</span>
                    <span className={styles.more}>{t.readMore} →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
