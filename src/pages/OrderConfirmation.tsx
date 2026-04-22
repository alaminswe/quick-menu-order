import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChefHat, UtensilsCrossed, BellRing, ArrowLeft } from "lucide-react";
import { useStore, OrderStatus } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

const STEPS: { key: OrderStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { key: "Taken", label: "Order Taken", icon: CheckCircle2 },
  { key: "Cooking", label: "Cooking", icon: ChefHat },
  { key: "Ready", label: "Ready", icon: BellRing },
  { key: "Served", label: "Served", icon: UtensilsCrossed },
];

const OrderConfirmation = () => {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);
  const [, force] = useState(0);

  // Re-render every second so the live tracker feels alive.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-muted-foreground">Order not found.</p>
        <Link to="/" className="mt-4 underline text-primary">
          Back to menu
        </Link>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-3xl flex items-center gap-3 py-4">
          <Link
            to="/"
            className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Order Confirmed</h1>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-5 space-y-6">
        <section className="bg-card rounded-3xl shadow-card p-6 text-center animate-fade-in">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-warm flex items-center justify-center shadow-glow mb-3">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Thank you, {order.customerName}!</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Order <span className="font-mono font-semibold">{order.id}</span> · Table {order.table}
          </p>
          <p className="text-sm mt-2">
            Estimated time: <span className="font-semibold">{order.estimatedMinutes} min</span>
          </p>
        </section>

        <section className="bg-card rounded-3xl shadow-card p-5">
          <h3 className="font-bold mb-4">Live Status</h3>
          <div className="flex justify-between gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i <= stepIndex;
              return (
                <div key={s.key} className="flex-1 flex flex-col items-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition",
                      done
                        ? "bg-gradient-warm text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={cn(
                      "text-[11px] mt-1 text-center",
                      done ? "font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-card rounded-3xl shadow-card p-5">
          <h3 className="font-bold mb-3">Items</h3>
          <ul className="space-y-2">
            {order.items.map((c) => (
              <li key={c.item.id} className="flex justify-between text-sm">
                <span>
                  {c.item.name} <span className="text-muted-foreground">× {c.quantity}</span>
                </span>
                <span className="font-semibold">
                  ${(c.item.price * c.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border mt-4 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderConfirmation;