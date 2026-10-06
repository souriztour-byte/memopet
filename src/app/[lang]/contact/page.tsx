import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { siteConfig } from "@/lib/config";
import styles from "./contact.module.css";

export async function generateMetadata(props: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { contact } = getDictionary(lang);
  return {
    title: contact.metaTitle,
    description: fmt(contact.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/contact"),
  };
}

export default async function ContactPage(props: PageProps<"/[lang]/contact">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.contact;
  const { email, instagram } = siteConfig.contact;
  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="block" aria-label={t.waysLabel}>
        <div className={styles.contact}>
          <div className="cbox">
            <p className="eyebrow">{t.email}</p>
            <p>
              {email ? (
                <a href={`mailto:${email}`} className="text-link">
                  {email}
                </a>
              ) : (
                <strong className="ph">{dict.common.comingSoon}</strong>
              )}
            </p>
          </div>
          <div className="cbox">
            <p className="eyebrow">{t.instagram}</p>
            <p>
              {instagram ? (
                <a href={instagram.url} className="text-link" target="_blank" rel="noopener noreferrer">
                  {instagram.handle}
                </a>
              ) : (
                <strong className="ph">{dict.common.comingSoon}</strong>
              )}
            </p>
          </div>
          <div className="cbox">
            <p className="eyebrow">{t.helpCentre}</p>
            <p>
              {rich(t.helpText, {
                link: (
                  <Link href={localizePath(lang, "/faq")} className="text-link">
                    {t.helpLink}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
        <div className="note" style={{ marginTop: 24 }}>
          <p>
            <strong>{t.noteTitle}</strong> {t.noteText}
          </p>
        </div>
      </section>
    </div>
  );
}
