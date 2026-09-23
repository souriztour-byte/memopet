"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";

type Props = {
  merchandiseId: string;
  title: string;
  className?: string;
  okClassName?: string;
};

/** The prototype's "+ Add" button: adds one, flashes a check mark. */
export function QuickAdd({ merchandiseId, title, className, okClassName }: Props) {
  const { addItem } = useCart();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);

  return (
    <button
      type="button"
      className={`${className ?? ""} ${ok ? (okClassName ?? "") : ""}`}
      aria-label={`Add ${title} to cart`}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          if (await addItem(merchandiseId, 1)) {
            setOk(true);
            setTimeout(() => setOk(false), 900);
          }
        })
      }
    >
      {ok ? (
        <CheckIcon />
      ) : (
        <>
          <PlusIcon /> Add
        </>
      )}
    </button>
  );
}
