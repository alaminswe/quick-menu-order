import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { MenuItem } from "@/data/menu";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  instructions: string;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: MenuItem, instructions: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, instructions: string) => {
    setItems((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1, instructions: instructions || c.instructions }
            : c
        );
      }
      return [...prev, { item, quantity: 1, instructions }];
    });
  };

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((c) => (c.item.id === id ? { ...c, quantity: c.quantity + 1 } : c))
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev
        .map((c) => (c.item.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((c) => c.item.id !== id));

  const clear = () => setItems([]);

  const { totalCount, totalPrice } = useMemo(() => {
    return items.reduce(
      (acc, c) => {
        acc.totalCount += c.quantity;
        acc.totalPrice += c.quantity * c.item.price;
        return acc;
      },
      { totalCount: 0, totalPrice: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, increment, decrement, remove, clear, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};