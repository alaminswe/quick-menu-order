import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat, AlertTriangle, ArrowLeft, Flame, BellRing } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

const formatElapsed = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const Kitchen = () => {
  const { orders, setOrderStatus } = useStore();
  const [, force] = useState(0);

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const active = orders.filter((o) => o.status === "Taken" || o.status === "Cooking");

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl flex items-center gap-3 py-4">
          <Link to="/" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-10 w-10 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Kitchen Display</h1>
            <p className="text-xs text-muted-foreground">{active.length} active order(s)</p>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl px-4 py-5">
        {active.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No active orders.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((o) => {
              const elapsedMs = Date.now() - o.createdAt;
              const elapsedMin = elapsedMs / 60000;
              const timerColor =
                elapsedMin > 20
                  ? "bg-red-100 text-red-700 border-red-200"
                  : elapsedMin > 10
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-green-100 text-green-700 border-green-200";
              const allergens = Array.from(
                new Set(o.items.flatMap((i) => i.item.allergens))
              );
              return (
                <article
                  key={o.id}
                  className="bg-card rounded-2xl shadow-card p-4 space-y-3 animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono font-bold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">Table {o.table}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full border",
                        timerColor
                      )}
                    >
                      {formatElapsed(elapsedMs)}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "text-xs font-semibold inline-block px-2 py-1 rounded-full",
                      o.status === "Cooking"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {o.status}
                  </div>

                  {allergens.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      {allergens.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="text-sm space-y-1 border-t border-border pt-2">
                    {o.items.map((c) => (
                      <li key={c.item.id}>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {c.quantity}× {c.item.name}
                          </span>
                        </div>
                        {c.instructions && (
                          <p className="text-xs italic text-muted-foreground">
                            ✏︎ {c.instructions}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setOrderStatus(o.id, "Cooking")}
                      disabled={o.status !== "Taken"}
                      className="h-10 rounded-xl bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-40 active:scale-95 transition"
                    >
                      <Flame className="h-4 w-4" /> Start
                    </button>
                    <button
                      onClick={() => setOrderStatus(o.id, "Ready")}
                      disabled={o.status !== "Cooking"}
                      className="h-10 rounded-xl bg-green-600 text-white font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-40 active:scale-95 transition"
                    >
                      <BellRing className="h-4 w-4" /> Ready
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Kitchen;