import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [placed, setPlaced] = useState(false);

  const handlePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone");
      return;
    }
    setPlaced(true);
    toast.success("Order placed successfully!");
    setTimeout(() => {
      clear();
      navigate("/");
    }, 2500);
  };

  if (placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-gradient-warm flex items-center justify-center shadow-glow mb-5">
          <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Thank you, {name}!</h1>
        <p className="text-muted-foreground mt-2">Your order has been placed.</p>
        <p className="text-sm text-muted-foreground mt-1">Redirecting to menu…</p>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-5 space-y-6">
        <section className="bg-card rounded-3xl shadow-card p-5 animate-fade-in">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items in your cart.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((c) => (
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
              ${totalPrice.toFixed(2)}
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
          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full h-13 py-4 rounded-2xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Order · ${totalPrice.toFixed(2)}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;