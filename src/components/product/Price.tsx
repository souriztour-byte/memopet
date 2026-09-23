import type { Money } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";

type Props = {
  min: Money;
  max?: Money;
  compareAt?: Money | null;
  className?: string;
};

/** Shows "From $X" when variants are priced differently. */
export function Price({ min, max, compareAt, className }: Props) {
  const varies = max && Number(max.amount) > Number(min.amount);
  const onSale = compareAt && Number(compareAt.amount) > Number(min.amount);
  return (
    <span className={className}>
      {varies ? "From " : null}
      {formatMoney(min)}
      {onSale ? (
        <>
          {" "}
          <s aria-label={`was ${formatMoney(compareAt)}`} style={{ color: "var(--muted)", fontWeight: 500 }}>
            {formatMoney(compareAt)}
          </s>
        </>
      ) : null}
    </span>
  );
}
