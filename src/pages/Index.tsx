import { useMemo, useState } from "react";
import Header from "@/components/menu/Header";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CartButton from "@/components/menu/CartButton";
import CartSheet from "@/components/menu/CartSheet";
import { Category, menuItems } from "@/data/menu";

const Index = () => {
  const [active, setActive] = useState<Category>("Food");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(
    () => menuItems.filter((m) => m.category === active),
    [active]
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      <main className="container max-w-3xl px-4">
        <section className="py-5 animate-fade-in">
          <h2 className="text-3xl font-bold leading-tight">
            What would you like<br />
            <span className="bg-gradient-warm bg-clip-text text-transparent">to eat today?</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Browse our menu, customize your order & enjoy.
          </p>
        </section>

        <CategoryTabs active={active} onChange={setActive} />

        <section className="grid gap-5 sm:grid-cols-2 mt-4">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </section>
      </main>

      <CartButton onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
