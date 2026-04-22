import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  ChefHat,
  BellRing,
  UtensilsCrossed,
  XCircle,
  Clock,
} from "lucide-react";
import { useStore, OrderStatus } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

const STEPS: {
  key: OrderStatus;
  label: string;
  desc: string;
  icon: typeof CheckCircle2;
}[] = [
  { key: "Taken", label: "Order Taken", desc: "We received your order", icon: CheckCircle2 },
  { key: "Cooking", label: "In the Kitchen", desc: "Chef is preparing your food", icon: ChefHat },
  { key: "Ready", label: "Ready", desc: "Your food is ready to serve", icon: BellRing },
  { key: "Served", label: "Served", desc: "Enjoy your meal!", icon: UtensilsCrossed },
];

// Public order tracking — no login required.
// Customers find their order by Order ID (e.g. ORD-1234) or by table number.
const TrackOrder = () => {
  const { orders } = useStore();
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [, force] = useState(0);

  // Live re-render so the stage progresses while the customer watches.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1500);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) setParams({ q });
    else setParams({});
  };

  const results = useMemo(() => {
    const q = (params.get("q") ?? "").trim().toLowerCase();
    if (!q) return [];
    // Match by order id (case-insensitive, allow without ORD- prefix) or by table number.
    return orders.filter((o) => {
      if (o.id.toLowerCase().includes(q)) return true;
      if (`ord-${q}` === o.id.toLowerCase()) return true;
      if (String(o.table) === q) return true;
      return false;
    });
  }, [orders, params]);

  const hasQuery = (params.get("q") ?? "").trim().length > 0;

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-3xl flex items-center gap-3 py-4 px-4">
          <Link
            to="/"
            className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">Track Your Order</h1>
            <p className="text-xs text-muted-foreground">No login required</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-5 space-y-5">
        <form
          onSubmit={submit}
          className="bg-card rounded-3xl shadow-card p-5 space-y-3"
        >
          <label className="text-sm font-semibold">Order ID or Table number</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. ORD-1234 or 5"
                className="w-full h-12 pl-9 pr-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              className="px-5 h-12 rounded-xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-95 transition"
            >
              Track
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            View-only — you can see your food's current stage but cannot edit the order.
          </p>
        </form>

        {hasQuery && results.length === 0 && (
          <div className="bg-card rounded-3xl shadow-card p-6 text-center text-sm text-muted-foreground">
            No orders found for{" "}
            <span className="font-mono font-semibold text-foreground">
              "{params.get("q")}"
            </span>
            . Double-check your Order ID or table number.
          </div>
        )}

        {results.map((order) => {
          const cancelled = order.status === "Cancelled";
          const stepIndex = STEPS.findIndex((s) => s.key === order.status);
          const elapsedMin = Math.max(
            0,
            Math.floor((Date.now() - order.createdAt) / 60000)
          );

          return (
            <section
              key={order.id}
              className="bg-card rounded-3xl shadow-card p-5 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className="font-bold text-lg leading-tight truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{order.id}</span> · Table{" "}
                    {order.table}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {elapsedMin}m ago
                  </p>
                  <p className="text-sm font-bold mt-1">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {cancelled ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 p-4 text-center">
                  <XCircle className="h-6 w-6 mx-auto mb-1" />
                  <p className="font-semibold">Order Cancelled</p>
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "rounded-2xl p-4 mb-5 flex items-center gap-3",
                      order.status === "Served"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-gradient-warm/10 border border-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                        order.status === "Served"
                          ? "bg-green-600 text-white"
                          : "bg-gradient-warm text-primary-foreground shadow-glow"
                      )}
                    >
                      {(() => {
                        const Icon = STEPS[stepIndex]?.icon ?? CheckCircle2;
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-base leading-tight">
                        {STEPS[stepIndex]?.label}
                        {order.status === "Served" && " ✓"}
                      </p>
                      <p className="text-xs opacity-80">
                        {STEPS[stepIndex]?.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    {STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const done = i <= stepIndex;
                      return (
                        <div
                          key={s.key}
                          className="flex-1 flex flex-col items-center"
                        >
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
                </>
              )}

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Items
                </p>
                <ul className="space-y-1.5">
                  {order.items.map((c) => (
                    <li
                      key={c.item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="truncate pr-2">
                        {c.item.name}{" "}
                        <span className="text-muted-foreground">
                          × {c.quantity}
                        </span>
                      </span>
                      <span className="font-semibold shrink-0">
                        ${(c.item.price * c.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/order/${order.id}`}
                className="mt-4 block w-full h-11 rounded-xl bg-secondary hover:bg-muted text-sm font-semibold text-center inline-flex items-center justify-center transition"
              >
                Open full order page
              </Link>
            </section>
          );
        })}

        {!hasQuery && (
          <div className="bg-card rounded-3xl shadow-card p-6 text-center text-sm text-muted-foreground">
            Enter your <span className="font-semibold text-foreground">Order ID</span>{" "}
            (shown after checkout) or your{" "}
            <span className="font-semibold text-foreground">Table number</span> to
            see the live cooking stage of your food.
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackOrder;
