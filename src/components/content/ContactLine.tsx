import Link from "next/link";
import { localizePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { rich } from "@/i18n/rich";
import { siteConfig } from "@/lib/config";

/**
 * "email us at …" when a support email is configured, else a link to the
 * Contact page. `capitalize` for the start of a sentence.
 */
export function ContactLine({ lang, capitalize = false }: { lang: Locale; capitalize?: boolean }) {
  const { contact } = getDictionary(lang);
  const cap = (s: string) => (capitalize ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const { email } = siteConfig.contact;
  if (email) {
    return (
      <>
        {cap(contact.emailUs)} <a href={`mailto:${email}`}>{email}</a>
      </>
    );
  }
  return (
    <>
      {rich(cap(contact.contactPage), {
        link: <Link href={localizePath(lang, "/contact")}>{contact.contactPageLink}</Link>,
      })}
    </>
  );
}
