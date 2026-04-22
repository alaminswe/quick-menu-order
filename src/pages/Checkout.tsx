import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, CreditCard, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore, PaymentMethod } from "@/store/StoreContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Checkout = () => {
  const { cart, cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const table = Number(params.get("table") ?? 1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [preOrder, setPreOrder] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Pre-order forces online payment.
  const togglePreOrder = (v: boolean) => {
    setPreOrder(v);
    if (v) setPayment("online");
  };

  const completeOrder = () => {
    const order = placeOrder({ table, customerName: name, phone, payment, preOrder });
    toast.success("SMS sent successfully");
    navigate(`/order/${order.id}`);
  };

  const handlePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (payment === "online") {
      setProcessing(true);
      // Simulated Stripe payment
      setTimeout(() => {
        setProcessing(false);
        const success = Math.random() > 0.25;
        if (!success) {
          toast.error("Payment failed — please try again");
          return;
        }
        toast.success("Payment successful");
        completeOrder();
      }, 2200);
    } else {
      completeOrder();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-3xl flex items-center gap-3 py-4">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-xs text-muted-foreground">Table {table}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-5 space-y-6">
        <section className="bg-card rounded-3xl shadow-card p-5 animate-fade-in">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items in your cart.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((c) => (
                <li key={c.item.id} className="flex justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium text-sm">
                        {c.item.name}{" "}
                        <span className="text-muted-foreground">× {c.quantity}</span>
                      </p>
                      <span className="font-semibold text-sm whitespace-nowrap">
                        ${(c.item.price * c.quantity).toFixed(2)}
                      </span>
                    </div>
                    {c.instructions && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">
                        Note: {c.instructions}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-2xl bg-gradient-warm bg-clip-text text-transparent">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        </section>

        <form
          onSubmit={handlePlace}
          className="bg-card rounded-3xl shadow-card p-5 space-y-4 animate-fade-in"
        >
          <h2 className="font-bold text-lg">Your Details</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <div>
              <p className="font-semibold text-sm">Pre-order</p>
              <p className="text-xs text-muted-foreground">
                Schedule for later · requires online payment
              </p>
            </div>
            <Switch checked={preOrder} onCheckedChange={togglePreOrder} />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayment("online")}
                className={cn(
                  "rounded-xl border p-3 flex flex-col items-center gap-1 text-sm font-semibold transition",
                  payment === "online"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:bg-muted"
                )}
              >
                <CreditCard className="h-5 w-5" /> Pay Online
              </button>
              <button
                type="button"
                onClick={() => !preOrder && setPayment("counter")}
                disabled={preOrder}
                className={cn(
                  "rounded-xl border p-3 flex flex-col items-center gap-1 text-sm font-semibold transition",
                  payment === "counter"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:bg-muted",
                  preOrder && "opacity-50 cursor-not-allowed"
                )}
              >
                <Wallet className="h-5 w-5" /> Pay at Counter
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cart.length === 0 || processing}
            className="w-full h-13 py-4 rounded-2xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Processing payment…
              </span>
            ) : (
              <>Place Order · ${cartTotal.toFixed(2)}</>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;