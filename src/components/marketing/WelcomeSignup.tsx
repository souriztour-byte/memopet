"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { subscribeAction } from "@/app/actions/welcome";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, MailIcon } from "@/components/ui/icons";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { rich } from "@/i18n/rich";
import { siteConfig } from "@/lib/config";
import { offers } from "@/lib/content/offers";
import styles from "./WelcomeSignup.module.css";

/**
 * The MimiPets Club: the email list. Its perks are only what's real — the
 * welcome code (see `offers.welcome`), new-arrival news and pet-care tips.
 */
export function WelcomeSignup() {
  const { lang, dict } = useI18n();
  const { replaceCart } = useCart();
  const t = dict.welcome;
  const { percent } = offers.welcome;
  const name = siteConfig.name;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await subscribeAction(lang, email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.cart) replaceCart(result.cart);
      setCode(result.code);
    });
  };

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is on screen to copy by hand.
    }
  };

  return (
    <section className={styles.band} aria-labelledby="welcome-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{fmt(t.eyebrow, { name })}</p>
          <h2 id="welcome-title" className={styles.title}>
            {code ? fmt(t.successTitle, { name }) : fmt(t.title, { name })}
          </h2>
          <p className="muted" aria-live="polite">
            {code ? fmt(t.successText, { code, percent }) : t.lead}
          </p>
          {code ? null : (
            <ul className={styles.perks}>
              {t.perks.map((perk) => (
                <li key={perk}>
                  <CheckIcon />
                  {fmt(perk, { percent })}
                </li>
              ))}
            </ul>
          )}
        </div>

        {code ? (
          <div className={styles.codeRow}>
            <span className={styles.code}>{code}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
              {copied ? t.copied : t.copy}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.fields}>
              <label htmlFor="welcome-email" className="sr-only">
                {t.emailLabel}
              </label>
              <span className={styles.inputWrap}>
                <MailIcon className={styles.inputIcon} />
                <input
                  id="welcome-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={254}
                  placeholder={t.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "welcome-error" : "welcome-consent"}
                />
              </span>
              <button type="submit" className="btn btn-gold" disabled={pending}>
                {pending ? t.sending : t.submit}
              </button>
            </div>
            {error ? (
              <p id="welcome-error" className={styles.error} role="alert">
                {error}
              </p>
            ) : null}
            <p id="welcome-consent" className="small">
              {rich(fmt(t.consent, { name }), {
                privacy: (
                  <Link href={localizePath(lang, "/policies/privacy-policy")} className="text-link">
                    {t.privacy}
                  </Link>
                ),
              })}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
