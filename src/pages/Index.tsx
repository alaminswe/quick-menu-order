import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/menu/Header";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CartButton from "@/components/menu/CartButton";
import CartSheet from "@/components/menu/CartSheet";
import { Category, Diet, dietFilters } from "@/data/menu";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

const Index = () => {
  const [params] = useSearchParams();
  const table = Number(params.get("table") ?? 1);
  const { menu } = useStore();

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

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header table={table} />
      <main className="container max-w-3xl px-4">
        <section className="py-5 animate-fade-in">
          <h2 className="text-3xl font-bold leading-tight">
            What would you like<br />
            <span className="bg-gradient-warm bg-clip-text text-transparent">to eat today?</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Browse our menu, customize your order & enjoy.
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <Link to="/kitchen" className="px-3 py-1 rounded-full bg-secondary hover:bg-muted">
              Kitchen
            </Link>
            <Link to="/waiter" className="px-3 py-1 rounded-full bg-secondary hover:bg-muted">
              Waiter
            </Link>
            <Link to="/admin" className="px-3 py-1 rounded-full bg-secondary hover:bg-muted">
              Admin
            </Link>
          </div>
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

        <section className="grid gap-5 sm:grid-cols-2 mt-4">
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
