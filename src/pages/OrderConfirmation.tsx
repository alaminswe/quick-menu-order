import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChefHat, UtensilsCrossed, BellRing, ArrowLeft, XCircle, FileText } from "lucide-react";
import { useStore, OrderStatus, CANCEL_WINDOW_MS } from "@/store/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const OrderConfirmation = () => {
  const { id } = useParams();
  const { orders, cancelOrder } = useStore();
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
  const cancelled = order.status === "Cancelled";
  const cancelMsLeft = Math.max(
    0,
    CANCEL_WINDOW_MS - (Date.now() - order.createdAt)
  );
  const cancelEligible = order.status === "Taken" && cancelMsLeft > 0;
  const cancelSecLeft = Math.ceil(cancelMsLeft / 1000);

  const handleCancel = () => {
    const r = cancelOrder(order.id);
    if (r.ok) toast.success("Order cancelled. Refund will be processed.");
    else toast.error(r.reason ?? "Cannot cancel");
  };

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
          {cancelled ? (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 p-4 text-center">
              <XCircle className="h-6 w-6 mx-auto mb-1" />
              <p className="font-semibold">Order Cancelled</p>
            </div>
          ) : (
          <>
          {/* Current stage spotlight — what the customer most wants to know */}
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
          </>
          )}

          {!cancelled && (
            <div className="mt-5 border-t border-border pt-4">
              {cancelEligible ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    You can cancel within{" "}
                    <span className="font-semibold text-foreground">
                      {cancelSecLeft}s
                    </span>{" "}
                    — only before the kitchen starts cooking.
                  </p>
                  <button
                    onClick={handleCancel}
                    className="w-full h-12 rounded-xl bg-red-600 text-white font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition"
                  >
                    <XCircle className="h-4 w-4" /> Cancel Order
                  </button>
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Cancellation window has closed. Please ask a waiter for help.
                </p>
              )}
            </div>
          )}
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

        {/* Invoice — available once payment is confirmed (online payments) */}
        {order.payment === "online" && !cancelled && (
          <Link
            to={`/invoice/${order.id}`}
            className="block w-full h-13 py-4 rounded-2xl bg-card border-2 border-primary text-primary font-semibold text-center active:scale-[0.98] transition"
          >
            <span className="inline-flex items-center gap-2">
              <FileText className="h-5 w-5" /> View Invoice
            </span>
          </Link>
        )}
      </main>
    </div>
  );
};

export default OrderConfirmation;