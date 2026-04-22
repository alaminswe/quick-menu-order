// Backwards-compatible thin wrapper around the unified store.
import { ReactNode } from "react";
import { StoreProvider, useStore } from "@/store/StoreContext";

export type { CartItem } from "@/store/StoreContext";

export const CartProvider = ({ children }: { children: ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
);

export const useCart = () => {
  const s = useStore();
  return {
    items: s.cart,
    addToCart: s.addToCart,
    increment: s.increment,
    decrement: s.decrement,
    remove: s.remove,
    clear: s.clearCart,
    totalCount: s.cartCount,
    totalPrice: s.cartTotal,
  };
};