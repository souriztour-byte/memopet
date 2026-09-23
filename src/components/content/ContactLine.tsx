import Link from "next/link";
import { siteConfig } from "@/lib/config";

/** "email us at …" when a support email is configured, else a Contact page link. */
export function ContactLine({ prefix = "email us at" }: { prefix?: string }) {
  const { email } = siteConfig.contact;
  if (email) {
    return (
      <>
        {prefix} <a href={`mailto:${email}`}>{email}</a>
      </>
    );
  }
  return (
    <>
      reach us through our <Link href="/contact">contact page</Link>
    </>
  );
}
