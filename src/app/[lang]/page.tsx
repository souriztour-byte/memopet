import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AfterWalk } from "@/components/home/AfterWalk";
import { BrandStory } from "@/components/home/BrandStory";
import { ComfortStory } from "@/components/home/ComfortStory";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMotion } from "@/components/home/HomeMotion";
import { PetRail } from "@/components/home/PetRail";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ProductVideos } from "@/components/media/ProductVideos";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getProduct, getProducts } from "@/lib/commerce";
import {
  AI_IMAGE_NOTE,
  beforeAfterImages,
  HERO_SLIDES,
  HOME_PHOTOS,
} from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import { offerMoney, offers } from "@/lib/content/offers";
import { policySettings } from "@/lib/content/policy-settings";
import { getShipping } from "@/lib/content/shipping";
import { formatMoney } from "@/lib/format";
import styles from "./home.module.css";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  return hasLocale(lang) ? { alternates: alternatesFor(lang, "/") } : {};
}

type Photo = { src: string; alt: string };

/**
 * The home page tells the shop's story in scenes (docs/MOTION.md): a
 * full-screen hero, the collection to drag through, a pinned comfort story,
 * the paw washer step by step, the bestseller ready to buy, and our story.
 */
export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.home;
  const href = (path: string) => localizePath(lang, path);
  const shipping = getShipping(lang, dict);
  const returnDays = policySettings.returnWindowDays;
  const money = (amount: number) => formatMoney(offerMoney(amount), lang);
  const photo = (p: { src: string; alt: keyof typeof dict.photos }): Photo => ({
    src: p.src,
    alt: dict.photos[p.alt],
  });

  const [products, pawWasher] = await Promise.all([
    getProducts(lang, { sort: "best-selling", limit: 12 }),
    getProduct(lang, siteConfig.featuredProductHandle),
  ]);
  // Shown once the paw washer has a video, or Before/After photos, in Shopify.
  const compare = pawWasher ? beforeAfterImages(pawWasher.images) : null;
  const video = pawWasher?.videos[0] ?? null;

  const promises = [
    {
      title: fmt(t.promiseShipping, {
        amount: money(offers.shipping.freeFrom),
      }),
      text: fmt(t.promiseShippingText, {
        rate: money(offers.shipping.standardRate),
        destination: offers.shipping.destination[lang],
        days: shipping.primaryEstimate.days,
      }),
    },
    {
      title: fmt(t.promiseBundle, { percent: offers.bundle.percent }),
      text: t.promiseBundleText,
    },
    {
      title: fmt(t.promiseReturns, { days: returnDays }),
      text: fmt(t.promiseReturnsText, { days: returnDays }),
    },
    { title: t.promiseSecure, text: t.promiseSecureText },
  ];

  const guides = [
    {
      href: "/how-to-order",
      title: t.guideOrderTitle,
      text: t.guideOrderText,
      photo: photo(HOME_PHOTOS.guideOrder),
    },
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
    {
      href: "/faq",
      title: t.guideFaqTitle,
      text: t.guideFaqText,
      photo: photo(HOME_PHOTOS.guideFaq),
    },
  ];
  const guideMain = photo(HOME_PHOTOS.guideMain);

  const comfort = [
    { title: t.comfort1Title, text: t.comfort1Text },
    { title: t.comfort2Title, text: t.comfort2Text },
    { title: t.comfort3Title, text: t.comfort3Text },
  ].map((s, i) => ({ ...s, photo: photo(HOME_PHOTOS.comfort[i]) }));
  const care = [
    { title: t.care1Title, text: t.care1Text },
    { title: t.care2Title, text: t.care2Text },
    { title: t.care3Title, text: t.care3Text },
    { title: t.care4Title, text: t.care4Text },
  ].map((s, i) => {
    const p: { src: string; alt: keyof typeof dict.photos; ai?: boolean } =
      HOME_PHOTOS.care[i];
    return { ...s, photo: photo(p), ai: p.ai ?? false };
  });

  return (
    <HomeMotion>
      <HomeHero
        slides={HERO_SLIDES.map((s) => ({
          ...photo(s),
          ai: s.ai,
          focus: "focus" in s ? s.focus : undefined,
        }))}
        eyebrow={t.heroEyebrow}
        line1={t.heroLine1}
        line2={t.heroLine2}
        lead={t.heroLead}
        primary={{ href: href("/shop"), label: t.ctaDiscover }}
        secondary={{ href: href("/quiz"), label: t.ctaQuiz }}
        ticker={promises.map((p) => p.title)}
        labels={{
          scroll: t.scroll,
          slides: t.slidesLabel,
          pause: t.pause,
          play: t.play,
          aiNote: AI_IMAGE_NOTE[lang],
        }}
      />

      <div className="wrap">
        <section className={styles.collection} aria-labelledby="products-title">
          <div className={styles.sectionHead}>
            <p className="eyebrow">{t.collectionLead}</p>
            <h2 id="products-title" className={styles.sectionTitle} data-rise>
              {t.collectionTitle}
            </h2>
          </div>
          <PetRail products={products} viewAllHref={href("/shop")} />
        </section>

        <ComfortStory
          eyebrow={t.comfortEyebrow}
          title={t.comfortTitle}
          steps={comfort}
          cta={{ href: href("/collections/comfort-beds"), label: t.comfortCta }}
        />
      </div>

      <AfterWalk
        eyebrow={t.careEyebrow}
        title={t.careTitle}
        lead={t.careLead}
        scenes={care}
        cta={{ href: href("/collections/grooming-care"), label: t.careCta }}
        dragLabel={t.drag}
        aiNote={AI_IMAGE_NOTE[lang]}
      />

      <div className="wrap">
        {pawWasher ? (
          <FeaturedProduct
            product={pawWasher}
            eyebrow={t.featuredEyebrow}
            lead={t.featuredLead}
            detailsHref={href(`/products/${pawWasher.handle}`)}
            detailsLabel={t.featuredDetails}
          />
        ) : null}

        {pawWasher && (compare || video) ? (
          <section
            className={styles.proof}
            aria-labelledby="proof-title"
            data-reveal
          >
            <p className="eyebrow">{t.proofEyebrow}</p>
            <h2 id="proof-title" className={styles.sectionTitle}>
              {compare
                ? dict.product.beforeAfterTitle
                : dict.product.videoTitle}
            </h2>
            <div className={compare && video ? styles.proofTwo : undefined}>
              {compare ? (
                <BeforeAfter before={compare.before} after={compare.after} />
              ) : null}
              {video ? (
                <ProductVideos videos={[video]} title={pawWasher.title} />
              ) : null}
            </div>
          </section>
        ) : null}
      </div>

      <BrandStory
        eyebrow={t.storyEyebrow}
        text={t.storyText}
        cta={{ href: href("/shop"), label: t.storyCta }}
      />

      <div className="wrap">
        <section
          className={styles.quizTeaser}
          aria-labelledby="quiz-title"
          data-reveal
        >
          <p className="eyebrow">{dict.quiz.eyebrow}</p>
          <h2 id="quiz-title">{dict.quiz.teaserTitle}</h2>
          <p className={styles.quizText}>{dict.quiz.teaserText}</p>
          <Link href={href("/quiz")} className="btn btn-gold">
            {dict.quiz.teaserCta}
          </Link>
        </section>

        <ul
          className={styles.promises}
          aria-label={t.promisesLabel}
          data-reveal
        >
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
          <div className={styles.guideGrid} data-reveal>
            <Link href={href("/shop")} className={styles.guideMain}>
              <span className={`${styles.guideMainPic} unveil`} data-drift>
                <Image
                  src={guideMain.src}
                  alt={guideMain.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 760px"
                  className={styles.cover}
                />
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
                      <Image
                        src={g.photo.src}
                        alt={g.photo.alt}
                        fill
                        sizes="120px"
                        className={styles.cover}
                      />
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
    </HomeMotion>
  );
}
