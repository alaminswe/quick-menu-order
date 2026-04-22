import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartButton = ({ onClick }: { onClick: () => void }) => {
  const { totalCount, totalPrice } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="container max-w-3xl pointer-events-auto">
        <button
          onClick={onClick}
          className="w-full bg-gradient-warm text-primary-foreground rounded-2xl shadow-glow px-5 py-4 flex items-center justify-between animate-slide-up active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-card text-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCount}
              </span>
            </div>
            <span className="font-semibold">View Cart</span>
          </div>
          <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

export default CartButton;