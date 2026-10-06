import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";
import type { PolicyHandle } from "@/lib/commerce/types";
import * as en from "./en";
import * as es from "./es";

export type LocalPolicy = {
  handle: PolicyHandle;
  title: string;
  navLabel: string;
  description: string;
  Body: ComponentType;
};

/**
 * Drafted policies, used until the matching policy is written in Shopify
 * admin (Settings → Policies). Order here is the order in navigation.
 * Handles (and URLs) are the same in every language.
 */
const policies: Record<Locale, LocalPolicy[]> = {
  en: [
    {
      handle: "shipping-policy",
      title: "Shipping Policy",
      navLabel: "Shipping",
      description: "Where orders ship from, processing and delivery times, costs and tracking.",
      Body: en.ShippingPolicy,
    },
    {
      handle: "refund-policy",
      title: "Refund Policy",
      navLabel: "Returns & refunds",
      description: "How to cancel an order, send items back and get your refund.",
      Body: en.RefundPolicy,
    },
    {
      handle: "privacy-policy",
      title: "Privacy Policy",
      navLabel: "Privacy",
      description: "What personal data we collect, how we use it and your rights.",
      Body: en.PrivacyPolicy,
    },
    {
      handle: "terms-of-service",
      title: "Terms of Service",
      navLabel: "Terms",
      description: "The terms that apply when you use our website and buy from us.",
      Body: en.TermsOfService,
    },
  ],
  es: [
    {
      handle: "shipping-policy",
      title: "Política de envíos",
      navLabel: "Envíos",
      description:
        "Desde dónde se envían los pedidos, plazos de preparación y entrega, costes y seguimiento.",
      Body: es.ShippingPolicy,
    },
    {
      handle: "refund-policy",
      title: "Política de reembolsos",
      navLabel: "Devoluciones y reembolsos",
      description: "Cómo cancelar un pedido, devolver artículos y recibir tu reembolso.",
      Body: es.RefundPolicy,
    },
    {
      handle: "privacy-policy",
      title: "Política de privacidad",
      navLabel: "Privacidad",
      description: "Qué datos personales recogemos, cómo los usamos y cuáles son tus derechos.",
      Body: es.PrivacyPolicy,
    },
    {
      handle: "terms-of-service",
      title: "Términos del servicio",
      navLabel: "Términos",
      description: "Las condiciones que se aplican cuando usas nuestra web y nos compras.",
      Body: es.TermsOfService,
    },
  ],
};

export const getLocalPolicies = (lang: Locale): LocalPolicy[] => policies[lang];

export const findLocalPolicy = (lang: Locale, handle: string) =>
  policies[lang].find((p) => p.handle === handle);

/** Policy handles, for static params and the sitemap. */
export const policyHandles = policies.en.map((p) => p.handle);
