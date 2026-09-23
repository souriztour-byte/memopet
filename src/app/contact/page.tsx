import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/content/PageIntro";
import { siteConfig } from "@/lib/config";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order or a product? Message MimoPets.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { email, instagram } = siteConfig.contact;
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Contact"
        title="Questions? Just message us"
        lead="We're happy to help with orders, delivery, returns or choosing the right product."
      />
      <section className="block" aria-label="Ways to contact us">
        <div className={styles.contact}>
          <div className="cbox">
            <p className="eyebrow">Email</p>
            <p>
              {email ? (
                <a href={`mailto:${email}`} className="text-link">
                  {email}
                </a>
              ) : (
                <strong className="ph">Coming soon</strong>
              )}
            </p>
          </div>
          <div className="cbox">
            <p className="eyebrow">Instagram</p>
            <p>
              {instagram ? (
                <a href={instagram.url} className="text-link" target="_blank" rel="noopener noreferrer">
                  {instagram.handle}
                </a>
              ) : (
                <strong className="ph">Coming soon</strong>
              )}
            </p>
          </div>
          <div className="cbox">
            <p className="eyebrow">Help centre</p>
            <p>
              Many answers are already in our{" "}
              <Link href="/faq" className="text-link">
                FAQ
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="note" style={{ marginTop: 24 }}>
          <p>
            <strong>Writing about an order?</strong> Please include your order number, and a photo if
            something arrived damaged — it helps us sort things out faster.
          </p>
        </div>
      </section>
    </div>
  );
}
