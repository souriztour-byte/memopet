import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DayChapter } from "@/components/home/DayChapter";
import { DayProduct, type DayProductData } from "@/components/home/DayProduct";
import { HomeMotion } from "@/components/home/HomeMotion";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { ProductVideos } from "@/components/media/ProductVideos";
import { SoftImage } from "@/components/ui/SoftImage";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getProduct, getProducts } from "@/lib/commerce";
import { beforeAfterImages, sizeChartImage } from "@/lib/commerce/presentation";
import type { Product } from "@/lib/commerce/types";
import { DAY_TIMES, dayLineup, opening, type DayEntry } from "@/lib/content/day";
import { offerMoney, offers } from "@/lib/content/offers";
import { policySettings } from "@/lib/content/policy-settings";
import { formatMoney } from "@/lib/format";
import styles from "@/components/home/Day.module.css";

export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  return hasLocale(lang) ? { alternates: alternatesFor(lang, "/") } : {};
}

const slim = (p: Product): DayProductData => ({
  handle: p.handle,
  title: p.title,
  badge: p.badge,
  petType: p.petType,
  illustration: p.illustration,
  featuredImage: p.featuredImage,
  options: p.options,
  variants: p.variants,
});

/**
 * The home page is one good day, from sunrise to lights out: the walk, clean
 * paws at the door, the long nap, a warm night. Each product has its moment
 * and can be bought right there.
 */
export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.home;
  const href = (path: string) => localizePath(lang, path);
  const money = (amount: number) => formatMoney(offerMoney(amount), lang);

  // Every product in full (photos, description), placed in its moment of the day.
  const summaries = await getProducts(lang, { sort: "best-selling", limit: 8 });
  const products = (await Promise.all(summaries.map((p) => getProduct(lang, p.handle)))).filter(
    (p): p is Product => p !== null,
  );
  const lineup = dayLineup(products);
  const at = (moment: DayEntry<Product>["moment"]) => lineup.filter((e) => e.moment === moment);
  const [clean, nap, night] = [at("clean"), at("nap"), at("night")];

  const count = lineup.length;
  const word = t.numberWords[count] ?? String(count);
  const things = count === 1 ? t.thingsOne : fmt(t.thingsMany, { n: word });
  const numberOf = (e: DayEntry<Product>) => fmt(t.number, { n: e.number });
  const sceneOf = (p: Product) => p.images[0] ?? p.featuredImage;
  const measurementsOf = (p: Product) => sizeChartImage(p.images)?.altText ?? null;
  const from = (p: Product) =>
    `${Number(p.priceRange.maxVariantPrice.amount) > Number(p.priceRange.minVariantPrice.amount) ? `${dict.product.from} ` : ""}${formatMoney(p.priceRange.minVariantPrice, lang)}`;
  const em = (text: string) => <em>{text}</em>;

  const first = lineup[0];
  const firstScene = first ? sceneOf(first.product) : null;
  // Shown once a paw washer has a video, or Before/After photos, in Shopify.
  const washer = clean[0]?.product ?? null;
  const compare = washer ? beforeAfterImages(washer.images) : null;
  const video = washer?.videos[0] ?? null;

  const feature = (e: DayEntry<Product>, i: number, eyebrow: string, title: string, titleEm: string, titleId: string) => (
    <DayProduct
      key={e.product.handle}
      product={slim(e.product)}
      layout="feature"
      flip={e.moment === "night" ? i % 2 === 0 : i % 2 === 1}
      number={numberOf(e)}
      scene={sceneOf(e.product)}
      measurements={measurementsOf(e.product)}
      href={href(`/products/${e.product.handle}`)}
      intro={
        <>
          {i === 0 ? (
            <div className={styles.featureHead}>
              <p className="mono">{eyebrow}</p>
              <h2 id={titleId} className={styles.title} data-rise>
                {rich(title, { em: em(titleEm) })}
              </h2>
            </div>
          ) : null}
          <p className={styles.text}>{opening(e.product.description)}</p>
        </>
      }
    />
  );

  const facts = [
    {
      label: t.bundleLabel,
      title: fmt(t.bundle, { min: offers.bundle.minItems, percent: offers.bundle.percent }),
      text: t.bundleText,
    },
    {
      label: fmt(t.shippingLabel, { destination: offers.shipping.destination[lang] }),
      title: fmt(t.shipping, { amount: money(offers.shipping.freeFrom) }),
      text: fmt(t.shippingText, { rate: money(offers.shipping.standardRate) }),
    },
    {
      label: t.returnsLabel,
      title: fmt(t.returns, { days: policySettings.returnWindowDays }),
      text: t.returnsText,
    },
  ];

  // The chapters the day dial can jump to.
  const stops = [
    { id: "dawn", label: t.dawnEyebrow, show: true },
    { id: "walk", label: t.walkEyebrow, show: true },
    { id: "clean", label: t.cleanEyebrow, show: clean.length > 0 },
    { id: "nap", label: t.napEyebrow, show: nap.length > 0 },
    { id: "night", label: t.nightEyebrow, show: night.length > 0 },
  ]
    .filter((s) => s.show)
    .map((s) => ({
      id: s.id as keyof typeof DAY_TIMES,
      label: s.label,
      // The products met at that moment.
      products: lineup.filter((e) => e.moment === s.id).map((e) => e.product.title),
    }));

  return (
    <HomeMotion>
      {/* The day dial: a sun that travels as the page scrolls, with a stop for each chapter. */}
      <nav className={styles.dial} aria-label={t.dialLabel} data-day-dial>
        <span className={styles.dialTrack} aria-hidden="true" />
        <span className={styles.dialFill} aria-hidden="true" />
        <span className={styles.dialSunWrap} aria-hidden="true">
          <span className={styles.dialSun} />
        </span>
        {stops.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-day-link={s.id}
            style={{ "--at": i / stops.length } as React.CSSProperties}
          >
            <span className="mono">
              {DAY_TIMES[s.id]} · {s.label}
            </span>
          </a>
        ))}
      </nav>

      {/* The day's list: opens from the time stamp, to jump to another moment. */}
      <dialog className={styles.sheet} aria-label={t.dialLabel} data-day-sheet>
        <div className={styles.sheetBody}>
          <div className={styles.sheetHead}>
            <span className="mono">{t.dialLabel}</span>
            <button type="button" className="x" aria-label={t.sheetClose} data-day-close>
              ×
            </button>
          </div>
          <ol>
            {stops.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} data-day-jump={s.id}>
                  <span className="mono">{DAY_TIMES[s.id]}</span>
                  <b>{s.label}</b>
                  {s.products.length ? <span>{s.products.join(" · ")}</span> : null}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </dialog>

      {/* 07:30 */}
      <DayChapter moment="dawn" paws={6} labelledBy="dawn-title" dayLabel={t.dialLabel}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className="mono">{t.dawnEyebrow}</p>
            <h1 id="dawn-title" className={styles.heroTitle}>
              <span>{t.dawnLine1}</span>
              <span>{rich(t.dawnLine2, { things: em(things) })}</span>
            </h1>
            <p className={styles.lead}>{t.dawnLead}</p>
            <div className={styles.cta}>
              <a href="#walk" className="btn btn-gold">
                {t.start} <span aria-hidden="true">↓</span>
              </a>
              <Link href={href("/shop")} className="btn btn-ghost">
                {count > 1 ? fmt(t.shopAll, { n: word }) : t.shopAllPlain}
              </Link>
            </div>
          </div>
          {first && firstScene ? (
            <div className={styles.window}>
              <span className={styles.sunrise} aria-hidden="true" data-sun />
              <Link
                href={href(`/products/${first.product.handle}`)}
                className={styles.arch}
                tabIndex={-1}
                aria-hidden="true"
                data-drift
              >
                <SoftImage
                  src={firstScene.url}
                  alt=""
                  fill
                  preload
                  quality={90}
                  sizes="(max-width: 760px) 86vw, 410px"
                  className={styles.cover}
                />
              </Link>
              <Link href={href(`/products/${first.product.handle}`)} className={styles.caption}>
                <span className="mono">
                  {numberOf(first)} · {first.time}
                </span>
                <b>{first.product.title}</b>
                <span>{from(first.product)}</span>
              </Link>
            </div>
          ) : null}
        </div>
        {count ? (
          <ol className={styles.lineup} aria-label={t.lineupLabel}>
            {lineup.map((e) => (
              <li key={e.product.handle}>
                <a href={`#no-${e.number}`}>
                  {/* Phones: the line-up is a row of cards to swipe, each with its photo. */}
                  <span className={styles.thumb}>
                    {e.product.featuredImage ? (
                      <SoftImage
                        src={e.product.featuredImage.url}
                        alt=""
                        fill
                        sizes="72px"
                        className={styles.cover}
                      />
                    ) : null}
                  </span>
                  <span className="mono">
                    {numberOf(e)} · {e.time}
                  </span>
                  <b>{e.product.title}</b>
                  <span>{from(e.product)}</span>
                </a>
              </li>
            ))}
          </ol>
        ) : null}
      </DayChapter>

      {/* 08:15 */}
      <DayChapter moment="walk" paws={3} labelledBy="walk-title" dayLabel={t.dialLabel}>
        <div className={styles.walkGrid}>
          <div>
            <p className="mono">{t.walkEyebrow}</p>
            <h2 id="walk-title" className={styles.title} data-rise>
              {rich(t.walkTitle, { em: em(t.walkTitleEm) })}
            </h2>
            <p className={styles.text}>{t.walkText}</p>
          </div>
          <svg className={styles.splat} viewBox="0 0 340 300" aria-hidden="true" data-splat>
          <g transform="translate(20 150) rotate(-18 46 48) scale(0.46)">
            <PawShape />
          </g>
          <g transform="translate(130 70) rotate(10 46 48) scale(0.46)">
            <PawShape />
          </g>
          <g transform="translate(236 0) rotate(-8 46 48) scale(0.46)">
            <PawShape />
          </g>
          <circle cx="118" cy="214" r="6" />
          <circle cx="246" cy="150" r="4" />
          <circle cx="96" cy="120" r="3" />
          <circle cx="214" cy="52" r="5" />
          <circle cx="310" cy="128" r="3" />
          </svg>
        </div>
      </DayChapter>

      {/* 08:45 */}
      {clean.length ? (
        <DayChapter moment="clean" paws={6} labelledBy="clean-title" dayLabel={t.dialLabel}>
          <div className={styles.chead}>
            <div>
              <p className="mono">{t.cleanEyebrow}</p>
              <h2 id="clean-title" className={styles.title} data-rise>
                {rich(t.cleanTitle, { em: em(t.cleanTitleEm) })}
              </h2>
            </div>
            <ol className={styles.how} aria-label={t.cleanStepsLabel}>
              {t.cleanSteps.map((step, i) => (
                <li key={step}>
                  {i + 1} · {step}
                </li>
              ))}
            </ol>
          </div>
          {clean.length > 1 ? (
            <p className={`mono ${styles.swipe}`} aria-hidden="true">
              {t.swipe} <span>→</span>
            </p>
          ) : null}
          <div className={styles.plates} data-reveal>
            {clean.map((e) => (
              <DayProduct
                key={e.product.handle}
                product={slim(e.product)}
                layout="plate"
                number={numberOf(e)}
                measurements={measurementsOf(e.product)}
                href={href(`/products/${e.product.handle}`)}
              />
            ))}
          </div>
          {washer && (compare || video) ? (
            <div className={styles.proof} data-reveal>
              <p className="mono">{t.proofEyebrow}</p>
              <h3 className={styles.proofTitle}>
                {compare ? dict.product.beforeAfterTitle : dict.product.videoTitle}
              </h3>
              <div className={compare && video ? styles.proofTwo : undefined}>
                {compare ? <BeforeAfter before={compare.before} after={compare.after} /> : null}
                {video ? <ProductVideos videos={[video]} title={washer.title} /> : null}
              </div>
            </div>
          ) : null}
        </DayChapter>
      ) : null}

      {/* 14:00 */}
      {nap.length ? (
        <DayChapter moment="nap" paws={4} labelledBy="nap-title" dayLabel={t.dialLabel}>
          <div className={styles.features} data-reveal>
            {nap.map((e, i) => feature(e, i, t.napEyebrow, t.napTitle, t.napTitleEm, "nap-title"))}
          </div>
        </DayChapter>
      ) : null}

      {/* 22:30 */}
      {night.length ? (
        <DayChapter moment="night" paws={4} labelledBy="night-title" dayLabel={t.dialLabel}>
          <div className={styles.features} data-reveal>
            {night.map((e, i) => feature(e, i, t.nightEyebrow, t.nightTitle, t.nightTitleEm, "night-title"))}
          </div>
        </DayChapter>
      ) : null}

      {/* And then */}
      <DayChapter moment="end" labelledBy="end-title" dayLabel={t.dialLabel}>
        <p className="mono">{t.endEyebrow}</p>
        <h2 id="end-title" className={styles.endTitle} data-rise>
          {rich(t.endTitle, { em: em(t.endTitleEm) })}
        </h2>
        <ul className={styles.three} aria-label={t.factsLabel}>
          {facts.map((f) => (
            <li key={f.title}>
              <span className="mono">{f.label}</span>
              <b>{f.title}</b>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
        <div className={styles.endLinks}>
          <Link href={href("/quiz")} className={`mono ${styles.quiz}`}>
            {t.quiz} <span aria-hidden="true">→</span>
          </Link>
          <a href="#dawn" className={`mono ${styles.quiz} ${styles.again}`}>
            {t.backToMorning} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </DayChapter>
    </HomeMotion>
  );
}

/** The paw print's shapes, for drawing several inside one picture. */
function PawShape() {
  return (
    <>
      <ellipse cx="38" cy="92" rx="19" ry="25" transform="rotate(-24 38 92)" />
      <ellipse cx="78" cy="48" rx="20" ry="27" transform="rotate(-8 78 48)" />
      <ellipse cx="124" cy="48" rx="20" ry="27" transform="rotate(8 124 48)" />
      <ellipse cx="164" cy="92" rx="19" ry="25" transform="rotate(24 164 92)" />
      <path d="M101 198 C60 200 36 172 52 142 C66 116 136 116 150 142 C166 172 142 200 101 198 Z" />
    </>
  );
}
