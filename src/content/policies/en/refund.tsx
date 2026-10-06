import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { policySettings } from "@/lib/content/policy-settings";

export function RefundPolicy() {
  const days = policySettings.returnWindowDays;
  return (
    <>
      <p>
        We want you and your pet to be happy with your order. This policy explains how to cancel an
        order, return an item and get a refund. It does not affect your statutory rights as a
        consumer.
      </p>

      <h2>Your right to cancel</h2>
      <p>
        You can cancel your order within <strong>{days} days</strong> of the day you (or someone you
        name) receive the goods, without giving any reason. If your order arrives in several
        packages, the {days} days start from the day you receive the last one.
      </p>
      <p>
        To cancel, <ContactLine lang="en" /> with your order number and a clear statement
        that you wish to cancel. You don&rsquo;t need to use a particular form.
      </p>

      <h2>Sending items back</h2>
      <ul>
        <li>Please contact us before sending anything back, so we can give you the return address.</li>
        <li>
          Send the items back within {days} days of telling us you want to cancel.
        </li>
        <li>
          Unless the item arrived damaged, faulty or incorrect, the cost of returning it is paid by
          you.
        </li>
        <li>
          Please handle items only as you would in a shop while you decide. If an item has been used
          beyond what is needed to check it, we may reduce your refund to reflect the loss in value.
        </li>
      </ul>

      <h2>Your refund</h2>
      <p>
        We&rsquo;ll refund the price of the returned items and the standard delivery cost you paid,
        within 14 days of receiving your cancellation. We may wait until we have received the items
        back, or you have shown proof that you&rsquo;ve sent them, whichever happens first.
      </p>
      <p>
        Refunds go back to the original payment method. Depending on your bank or card provider, it
        can take a few extra days for the money to appear in your account.
      </p>

      <h2>Damaged, faulty or incorrect items</h2>
      <p>
        If your item arrives damaged or faulty, or isn&rsquo;t what you ordered, please{" "}
        <ContactLine lang="en" /> as soon as possible with your order number and a photo of
        the problem. We&rsquo;ll arrange a replacement or a full refund, including any shipping costs,
        at no cost to you. This is in addition to your legal rights for goods that are not as
        described or not fit for purpose.
      </p>

      <h2>Lost parcels</h2>
      <p>
        If your order hasn&rsquo;t arrived after the estimated delivery time in our{" "}
        <Link href={localizePath("en", "/policies/shipping-policy")}>shipping policy</Link>, please
        contact us and we&rsquo;ll help.
      </p>
    </>
  );
}
