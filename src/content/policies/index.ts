import type { ComponentType } from "react";
import type { PolicyHandle } from "@/lib/commerce/types";
import { PrivacyPolicy } from "./privacy";
import { RefundPolicy } from "./refund";
import { ShippingPolicy } from "./shipping";
import { TermsOfService } from "./terms";

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
 */
export const localPolicies: LocalPolicy[] = [
  {
    handle: "shipping-policy",
    title: "Shipping Policy",
    navLabel: "Shipping",
    description: "Where orders ship from, processing and delivery times, costs and tracking.",
    Body: ShippingPolicy,
  },
  {
    handle: "refund-policy",
    title: "Refund Policy",
    navLabel: "Returns & refunds",
    description: "How to cancel an order, send items back and get your refund.",
    Body: RefundPolicy,
  },
  {
    handle: "privacy-policy",
    title: "Privacy Policy",
    navLabel: "Privacy",
    description: "What personal data we collect, how we use it and your rights.",
    Body: PrivacyPolicy,
  },
  {
    handle: "terms-of-service",
    title: "Terms of Service",
    navLabel: "Terms",
    description: "The terms that apply when you use our website and buy from us.",
    Body: TermsOfService,
  },
];

export const findLocalPolicy = (handle: string) => localPolicies.find((p) => p.handle === handle);
