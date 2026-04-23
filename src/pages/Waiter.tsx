import { useNavigate } from "react-router-dom";
import { BellRing, Check, LogOut } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { toast } from "sonner";
import { clearRole } from "@/lib/auth";

const Waiter = () => {
  const navigate = useNavigate();
  const { orders, setOrderStatus } = useStore();
  const ready = orders.filter((o) => o.status === "Ready");

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl flex items-center gap-3 py-4">
          <div className="h-10 w-10 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
            <BellRing className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Waiter Pickup</h1>
            <p className="text-xs text-muted-foreground">{ready.length} ready to serve</p>
          </div>
          <button
            onClick={() => {
              clearRole();
              navigate("/staff/login?role=waiter", { replace: true });
            }}
            className="text-sm font-semibold inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="container max-w-4xl px-4 py-5">
        {ready.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No orders ready right now.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ready.map((o) => (
              <article
                key={o.id}
                className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-between gap-3 animate-fade-in"
              >
                <div>
                  <p className="text-2xl font-bold">Table {o.table}</p>
                  <p className="text-xs font-mono text-muted-foreground">{o.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {o.items.length} item(s) · ${o.total.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOrderStatus(o.id, "Served");
                    toast.success(`Table ${o.table} served`);
                  }}
                  className="h-12 px-4 rounded-xl bg-gradient-warm text-primary-foreground font-semibold flex items-center gap-2 shadow-glow active:scale-95 transition"
                >
                  <Check className="h-4 w-4" /> Served
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Waiter;