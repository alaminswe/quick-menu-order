import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const { addToCart } = useCart();
  const [instructions, setInstructions] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item, instructions);
    setAdded(true);
    setInstructions("");
    toast.success(`${item.name} added to cart`);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="bg-card rounded-3xl shadow-card overflow-hidden animate-fade-in">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={512}
          height={320}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-soft">
          <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-base leading-tight">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        </div>
        <Input
          placeholder="Special instructions (e.g. no onion)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="h-10 rounded-xl bg-muted border-0 text-sm"
        />
        <button
          onClick={handleAdd}
          className="w-full h-11 rounded-xl bg-gradient-warm text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-soft active:scale-95 transition-transform"
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default MenuItemCard;