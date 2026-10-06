import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { getShipping } from "@/lib/content/shipping";

export function ShippingPolicy() {
  const shipping = getShipping("en", en);
  return (
    <>
      <p>
        This policy explains how and when your MimiPets order is prepared and delivered. If you have a
        question that isn&rsquo;t answered here, <ContactLine lang="en" />.
      </p>

      <h2>Where your order ships from</h2>
      <p>
        Our products are shipped directly from our fulfilment partner&rsquo;s warehouse in{" "}
        <strong>{shipping.shipsFrom}</strong>.
      </p>

      <h2>Processing time</h2>
      <p>
        After you place your order, it is prepared for dispatch within{" "}
        <strong>{shipping.processing.days}</strong> for {shipping.processing.share}.
      </p>

      <h2>Estimated delivery times</h2>
      <p>Once your order has been dispatched, estimated delivery times are:</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Destination</th>
            <th scope="col">Shipping method</th>
            <th scope="col">Estimated delivery after dispatch</th>
          </tr>
        </thead>
        <tbody>
          {shipping.deliveryEstimates.map((e) => (
            <tr key={e.destination}>
              <td>{e.destination}</td>
              <td>{e.method}</td>
              <td>{e.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        For other destinations, the shipping options available for your address are shown at
        checkout. Delivery times are estimates provided by our fulfilment partner and carriers, not
        guarantees. Busy periods, customs checks and carrier delays can occasionally add extra time.
      </p>

      <h2>Shipping costs</h2>
      <p>
        Shipping costs are calculated from your delivery address and shown at checkout before you
        pay.
      </p>

      <h2>Order confirmation and tracking</h2>
      <p>
        You&rsquo;ll receive an order confirmation email as soon as your order is placed. When your
        order ships, we&rsquo;ll send a shipping confirmation email, including tracking details whenever
        they are available for your shipping method.
      </p>

      <h2>Orders with several items</h2>
      <p>
        If you order more than one item, your products may be shipped in separate packages and arrive
        on different days.
      </p>

      <h2>Import duties and taxes</h2>
      <p>
        Depending on your country, import duties or taxes may apply. Where these can be collected at
        checkout, they are shown there before you pay.
      </p>

      <h2>Delivery address</h2>
      <p>
        Please check that your delivery address is complete and correct before placing your order. If
        you notice a mistake, <ContactLine lang="en" /> straight away — once an order has
        been dispatched, we can no longer change the address.
      </p>

      <h2>Late, lost or damaged parcels</h2>
      <p>
        If your parcel hasn&rsquo;t arrived after the estimated delivery time, or it arrives damaged,
        please contact us with your order number (and a photo of any damage). We&rsquo;ll look into it
        with the carrier and, where a parcel is lost or damaged in transit, send a replacement or a
        refund. See our{" "}
        <Link href={localizePath("en", "/policies/refund-policy")}>refund policy</Link> for more on
        returns.
      </p>
    </>
  );
}
