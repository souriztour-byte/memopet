"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { addItemAction, updateItemAction } from "@/app/actions/cart";
import type { Cart } from "@/lib/commerce/types";

type CartContextValue = {
  cart: Cart | null;
  /** False until the visitor's cart has been loaded. */
  ready: boolean;
  demoMode: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Line id currently being updated, for per-line pending states. */
  pendingLineId: string | null;
  addItem: (merchandiseId: string, quantity?: number) => Promise<boolean>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children, demoMode }: { children: ReactNode; demoMode: boolean }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { cart: null }))
      .then((data: { cart: Cart | null }) => {
        if (!cancelled) setCart(data.cart);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      const result = await addItemAction(merchandiseId, quantity);
      if (!result.ok) {
        notify(result.error);
        return false;
      }
      setCart(result.cart);
      notify("Added to cart");
      return true;
    },
    [notify],
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      setPendingLineId(lineId);
      try {
        const result = await updateItemAction(lineId, quantity);
        if (result.ok) setCart(result.cart);
        else notify(result.error);
      } finally {
        setPendingLineId(null);
      }
    },
    [notify],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      demoMode,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      pendingLineId,
      addItem,
      updateItem,
      notify,
    }),
    [cart, ready, demoMode, isOpen, pendingLineId, addItem, updateItem, notify],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {toast}
      </p>
      {toast ? (
        <div className="toast" aria-hidden="true">
          {toast}
        </div>
      ) : null}
    </CartContext.Provider>
  );
}
