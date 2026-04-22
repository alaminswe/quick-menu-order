import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MenuItem, menuItems as initialMenu } from "@/data/menu";

export type OrderStatus = "Taken" | "Cooking" | "Ready" | "Served" | "Cancelled";
export type PaymentMethod = "online" | "counter";

// Customer can cancel within this window (ms) and only before Cooking starts.
export const CANCEL_WINDOW_MS = 2 * 60 * 1000;

export interface CartItem {
  item: MenuItem;
  quantity: number;
  instructions: string;
}

export interface Order {
  id: string;
  table: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  phone: string;
  payment: PaymentMethod;
  preOrder: boolean;
  createdAt: number;
  startedCookingAt?: number;
  estimatedMinutes: number;
}

interface StoreValue {
  // menu
  menu: MenuItem[];
  addMenuItem: (m: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleAvailability: (id: string) => void;

  // cart
  cart: CartItem[];
  addToCart: (item: MenuItem, instructions: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // orders
  orders: Order[];
  placeOrder: (data: {
    table: number;
    customerName: string;
    phone: string;
    payment: PaymentMethod;
    preOrder: boolean;
  }) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => { ok: boolean; reason?: string };
  canCancel: (id: string) => boolean;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

const STORAGE_KEY = "rqr_orders_v1";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
      return [];
    }
  });

  // Persist orders so KDS / waiter / admin tabs stay in sync via storage events.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Simulated real-time engine: progress orders Taken -> Cooking -> Ready every 6s.
  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status === "Taken" && Date.now() - o.createdAt > 6000) {
            return { ...o, status: "Cooking", startedCookingAt: Date.now() };
          }
          if (
            o.status === "Cooking" &&
            o.startedCookingAt &&
            Date.now() - o.startedCookingAt > 8000
          ) {
            return { ...o, status: "Ready" };
          }
          return o;
        })
      );
    }, 2000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  // ----- menu -----
  const addMenuItem: StoreValue["addMenuItem"] = (m) => {
    setMenu((prev) => [...prev, { ...m, id: `m_${Date.now()}` }]);
  };
  const updateMenuItem: StoreValue["updateMenuItem"] = (id, patch) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };
  const deleteMenuItem: StoreValue["deleteMenuItem"] = (id) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };
  const toggleAvailability: StoreValue["toggleAvailability"] = (id) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  };

  // ----- cart -----
  const addToCart: StoreValue["addToCart"] = (item, instructions) => {
    setCart((prev) => {
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
  const increment: StoreValue["increment"] = (id) =>
    setCart((prev) => prev.map((c) => (c.item.id === id ? { ...c, quantity: c.quantity + 1 } : c)));
  const decrement: StoreValue["decrement"] = (id) =>
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  const remove: StoreValue["remove"] = (id) =>
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  const clearCart = () => setCart([]);

  const { cartTotal, cartCount } = useMemo(
    () =>
      cart.reduce(
        (acc, c) => {
          acc.cartCount += c.quantity;
          acc.cartTotal += c.quantity * c.item.price;
          return acc;
        },
        { cartTotal: 0, cartCount: 0 }
      ),
    [cart]
  );

  // ----- orders -----
  const placeOrder: StoreValue["placeOrder"] = useCallback(
    ({ table, customerName, phone, payment, preOrder }) => {
      const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const total = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
      const order: Order = {
        id,
        table,
        items: cart,
        total,
        status: "Taken",
        customerName,
        phone,
        payment,
        preOrder,
        createdAt: Date.now(),
        estimatedMinutes: 15 + Math.floor(Math.random() * 10),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart]
  );

  const setOrderStatus: StoreValue["setOrderStatus"] = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              startedCookingAt:
                status === "Cooking" ? Date.now() : o.startedCookingAt,
            }
          : o
      )
    );
  };

  const canCancel: StoreValue["canCancel"] = (id) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return false;
    if (o.status !== "Taken") return false;
    return Date.now() - o.createdAt <= CANCEL_WINDOW_MS;
  };

  const cancelOrder: StoreValue["cancelOrder"] = (id) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return { ok: false, reason: "Order not found" };
    if (o.status !== "Taken")
      return { ok: false, reason: "Order is already being prepared" };
    if (Date.now() - o.createdAt > CANCEL_WINDOW_MS)
      return { ok: false, reason: "Cancellation window expired" };
    setOrders((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "Cancelled" } : x))
    );
    return { ok: true };
  };

  const value: StoreValue = {
    menu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    cart,
    addToCart,
    increment,
    decrement,
    remove,
    clearCart,
    cartTotal,
    cartCount,
    orders,
    placeOrder,
    setOrderStatus,
    cancelOrder,
    canCancel,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};