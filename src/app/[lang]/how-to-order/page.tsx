import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderSteps } from "@/components/content/OrderSteps";
import { PageIntro } from "@/components/content/PageIntro";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { siteConfig } from "@/lib/config";
import { getShipping } from "@/lib/content/shipping";

export async function generateMetadata(props: PageProps<"/[lang]/how-to-order">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { howToOrder } = getDictionary(lang);
  return {
    title: howToOrder.metaTitle,
    description: fmt(howToOrder.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/how-to-order"),
  };
}

export default async function HowToOrderPage(props: PageProps<"/[lang]/how-to-order">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.howToOrder;
  const shipping = getShipping(lang, dict);
  const { primaryEstimate } = shipping;
  const href = (path: string) => localizePath(lang, path);

  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="block" aria-label={t.stepsLabel}>
        <OrderSteps />
      </section>

      <section className="block" aria-labelledby="after-title">
        <div className="head">
          <div>
            <p className="eyebrow">{t.afterEyebrow}</p>
            <h2 id="after-title">{t.afterTitle}</h2>
          </div>
        </div>
        <ol className="how">
          <li className="step">
            <h3>{t.confirmedTitle}</h3>
            <p>{t.confirmedText}</p>
          </li>
          <li className="step">
            <h3>{fmt(t.preparedTitle, { days: shipping.processing.days })}</h3>
            <p>
              {fmt(t.preparedText, {
                days: shipping.processing.days,
                share: shipping.processing.share,
              })}
            </p>
          </li>
          <li className="step">
            <h3>{t.onTheWayTitle}</h3>
            <p>
              {fmt(t.onTheWayText, {
                destination: primaryEstimate.destination,
                days: primaryEstimate.days,
              })}
            </p>
          </li>
        </ol>
        <p className="small" style={{ marginTop: 18 }}>
          {rich(t.readMore, {
            policy: (
              <Link href={href("/policies/shipping-policy")} className="text-link">
                {t.readMorePolicy}
              </Link>
            ),
            faq: (
              <Link href={href("/faq")} className="text-link">
                {t.readMoreFaq}
              </Link>
            ),
          })}
        </p>
      </section>

      <section className="block">
        <Link href={href("/shop")} className="btn btn-pink">
          {dict.common.startShopping}
        </Link>
      </section>
    </div>
  );
}
