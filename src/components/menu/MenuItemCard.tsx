import { useState } from "react";
import { Plus, Check, AlertTriangle } from "lucide-react";
import { MenuItem } from "@/data/menu";
import { useStore } from "@/store/StoreContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HealthBadge from "./HealthBadge";

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const { addToCart } = useStore();
  const [instructions, setInstructions] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!item.available) return;
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
        {!item.available && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base leading-tight">{item.name}</h3>
            <HealthBadge score={item.healthScore} />
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.diets.map((d) => (
              <span
                key={d}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {d}
              </span>
            ))}
            {item.allergens.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200"
                title={`Contains ${a}`}
              >
                <AlertTriangle className="h-2.5 w-2.5" /> {a}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            {item.nutrition.calories} kcal · P{item.nutrition.protein} · C{item.nutrition.carbs} · F{item.nutrition.fat}
          </p>
        </div>
        <Input
          placeholder="Special instructions (e.g. no onion)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="h-10 rounded-xl bg-muted border-0 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!item.available}
          className="w-full h-11 rounded-xl bg-gradient-warm text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-soft active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default MenuItemCard;