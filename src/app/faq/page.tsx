import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/content/FaqList";
import { PageIntro } from "@/components/content/PageIntro";
import { faqGroups } from "@/content/faq";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, shipping, returns and our products.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.text },
      })),
    ),
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageIntro
        eyebrow="FAQ"
        title="A few helpful answers"
        lead="Everything about ordering, delivery, returns and our products in one place."
      />
      <nav aria-label="FAQ topics" className={styles.topics}>
        {faqGroups.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="pill">
            {g.title}
          </a>
        ))}
      </nav>
      {faqGroups.map((group) => (
        <section key={group.id} id={group.id} className={styles.group} aria-labelledby={`${group.id}-title`}>
          <h2 id={`${group.id}-title`} className={styles.groupTitle}>
            {group.title}
          </h2>
          <FaqList items={group.items} />
        </section>
      ))}
      <section className="block">
        <div className="note">
          <p>
            <strong>Still have a question?</strong>{" "}
            <Link href="/contact" className="text-link">
              Get in touch
            </Link>{" "}
            — we&rsquo;re happy to help.
          </p>
        </div>
      </section>
    </div>
  );
}
