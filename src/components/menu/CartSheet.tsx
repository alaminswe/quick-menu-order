import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: Props) => {
  const { items, increment, decrement, remove, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90vh] flex flex-col p-0 border-0"
      >
        <SheetHeader className="p-5 border-b border-border text-left">
          <SheetTitle className="text-2xl font-bold">Your Order</SheetTitle>
          <p className="text-sm text-muted-foreground">{items.length} item(s) in cart</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-3 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((c) => (
              <div
                key={c.item.id}
                className="flex gap-3 p-3 bg-muted/50 rounded-2xl"
              >
                <img
                  src={c.item.image}
                  alt={c.item.name}
                  loading="lazy"
                  className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-sm leading-tight">{c.item.name}</h4>
                    <button
                      onClick={() => remove(c.item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {c.instructions && (
                    <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                      Note: {c.instructions}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 bg-card rounded-full p-1 shadow-soft">
                      <button
                        onClick={() => decrement(c.item.id)}
                        className="h-7 w-7 rounded-full bg-muted flex items-center justify-center active:scale-90 transition"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-semibold text-sm w-5 text-center">{c.quantity}</span>
                      <button
                        onClick={() => increment(c.item.id)}
                        className="h-7 w-7 rounded-full bg-gradient-warm text-primary-foreground flex items-center justify-center active:scale-90 transition"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-primary">
                      ${(c.item.price * c.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3 bg-card">
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-2xl">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-13 py-4 rounded-2xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-[0.98] transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;