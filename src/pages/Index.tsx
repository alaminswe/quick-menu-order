import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import Header from "@/components/menu/Header";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CartButton from "@/components/menu/CartButton";
import CartSheet from "@/components/menu/CartSheet";
import { Category, Diet, dietFilters } from "@/data/menu";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Index = () => {
  const [params] = useSearchParams();
  const table = Number(params.get("table") ?? 1);
  const { menu, cart } = useStore();
  const navigate = useNavigate();

  const [active, setActive] = useState<Category>("Food");
  const [cartOpen, setCartOpen] = useState(false);
  const [diets, setDiets] = useState<Diet[]>([]);

  const toggleDiet = (d: Diet) =>
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const filtered = useMemo(
    () =>
      menu.filter(
        (m) =>
          m.category === active &&
          (diets.length === 0 || diets.every((d) => m.diets.includes(d)))
      ),
    [active, diets, menu]
  );

  const handlePreOrder = () => {
    if (cart.length === 0) {
      toast.error("Please add items to your cart first", {
        description: "Choose your favorite dishes below, then schedule your pre-order at checkout.",
      });
      // Smooth scroll to menu so the customer can start picking items
      document
        .getElementById("menu-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate(`/checkout?table=${table}&preorder=1`);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header table={table} />
      <main className="container max-w-6xl px-4">
        <section className="py-5 sm:py-8 animate-fade-in flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              What would you like<br />
              <span className="bg-gradient-warm bg-clip-text text-transparent">to eat today?</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Browse our menu, customize your order & enjoy.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePreOrder}
            className="inline-flex items-center justify-center gap-2 self-start md:self-auto px-5 py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition active:scale-95"
          >
            <CalendarClock className="h-5 w-5" /> Pre-order for later
          </button>
        </section>

        <CategoryTabs active={active} onChange={setActive} />

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {dietFilters.map((d) => {
            const on = diets.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDiet(d)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition",
                  on
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                )}
              >
                {d}
              </button>
            );
          })}
        </div>

        <section id="menu-section" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-4 scroll-mt-24">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-full text-center py-8">
              No items match your filters.
            </p>
          ) : (
            filtered.map((item) => <MenuItemCard key={item.id} item={item} />)
          )}
        </section>
      </main>

      <CartButton onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
