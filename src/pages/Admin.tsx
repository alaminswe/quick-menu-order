import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  DollarSign,
  ListOrdered,
  Activity,
  Download,
  FileBarChart,
} from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, MenuItem } from "@/data/menu";
import { OrderStatus } from "@/store/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { clearRole } from "@/lib/auth";

const emptyDraft = (): Omit<MenuItem, "id"> => ({
  name: "",
  price: 0,
  image: "/placeholder.svg",
  description: "",
  category: "Food",
  diets: [],
  allergens: [],
  healthScore: 60,
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  available: true,
});

const STATUSES: ("All" | OrderStatus)[] = [
  "All",
  "Taken",
  "Cooking",
  "Ready",
  "Served",
  "Cancelled",
];

type ReportRange = "daily" | "weekly" | "monthly";

const RANGE_MS: Record<ReportRange, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

const Admin = () => {
  const navigate = useNavigate();
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, orders } =
    useStore();

  const logout = () => {
    clearRole();
    navigate("/staff/login?role=admin", { replace: true });
  };

  // Menu editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<MenuItem, "id">>(emptyDraft());

  const startEdit = (m: MenuItem) => {
    setEditingId(m.id);
    const { id: _id, ...rest } = m;
    setDraft(rest);
  };
  const resetForm = () => {
    setEditingId(null);
    setDraft(emptyDraft());
  };
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name || draft.price <= 0) {
      toast.error("Name and price are required");
      return;
    }
    if (editingId) {
      updateMenuItem(editingId, draft);
      toast.success("Item updated");
    } else {
      addMenuItem(draft);
      toast.success("Item added");
    }
    resetForm();
  };

  // Order filters
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [tableFilter, setTableFilter] = useState<string>("");

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          (statusFilter === "All" || o.status === statusFilter) &&
          (tableFilter === "" || String(o.table) === tableFilter.trim())
      ),
    [orders, statusFilter, tableFilter]
  );

  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const active = orders.filter((o) => o.status !== "Served").length;
    return { total, revenue, active };
  }, [orders]);

  // Reports
  const [range, setRange] = useState<ReportRange>("daily");
  const report = useMemo(() => {
    const since = Date.now() - RANGE_MS[range];
    const inRange = orders.filter((o) => o.createdAt >= since);
    const completed = inRange.filter((o) => o.status === "Served");
    const cancelled = inRange.filter((o) => o.status === "Cancelled");
    const revenue = completed.reduce((s, o) => s + o.total, 0);
    const avg = completed.length ? revenue / completed.length : 0;
    return {
      orders: inRange,
      totalCount: inRange.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      revenue,
      avg,
    };
  }, [orders, range]);

  const downloadCsv = () => {
    const header = [
      "Order ID",
      "Date",
      "Table",
      "Customer",
      "Phone",
      "Items",
      "Total",
      "Payment",
      "Status",
    ];
    const rows = report.orders.map((o) => [
      o.id,
      new Date(o.createdAt).toISOString(),
      String(o.table),
      o.customerName,
      o.phone,
      o.items.map((c) => `${c.quantity}x ${c.item.name}`).join(" | "),
      o.total.toFixed(2),
      o.payment,
      o.status,
    ]);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [header, ...rows]
      .map((r) => r.map((c) => escape(String(c))).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${range[0].toUpperCase() + range.slice(1)} report downloaded`);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl flex items-center gap-3 py-4">
          <Link to="/" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold flex-1">Admin Panel</h1>
          <button
            onClick={logout}
            className="text-sm font-semibold inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="container max-w-6xl px-4 py-5 space-y-6">
        {/* Analytics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard icon={ListOrdered} label="Total Orders" value={stats.total.toString()} />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
          />
          <StatCard icon={Activity} label="Active Orders" value={stats.active.toString()} />
        </section>

        {/* Menu management */}
        <section className="bg-card rounded-3xl shadow-card p-5">
          <h2 className="font-bold text-lg mb-4">Menu Management</h2>

          <form onSubmit={submitForm} className="grid sm:grid-cols-2 gap-3 mb-5">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <Input
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as Category })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Drinks">Drinks</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Health Score (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={draft.healthScore}
                onChange={(e) => setDraft({ ...draft, healthScore: Number(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="h-11 px-4 rounded-xl bg-gradient-warm text-primary-foreground font-semibold inline-flex items-center gap-2 shadow-glow"
              >
                <Plus className="h-4 w-4" /> {editingId ? "Save Changes" : "Add Item"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 px-4 rounded-xl bg-secondary font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2">Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {menu.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium">{m.name}</td>
                    <td>{m.category}</td>
                    <td>${m.price.toFixed(2)}</td>
                    <td>
                      <Switch
                        checked={m.available}
                        onCheckedChange={() => toggleAvailability(m.id)}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => startEdit(m)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteMenuItem(m.id);
                          toast.success("Item deleted");
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reports */}
        <section className="bg-card rounded-3xl shadow-card p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <FileBarChart className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">Reports</h2>
            </div>
            <div className="flex bg-secondary rounded-xl p-1">
              {(["daily", "weekly", "monthly"] as ReportRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "px-3 h-9 rounded-lg text-xs font-semibold capitalize transition",
                    range === r
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={downloadCsv}
              disabled={report.orders.length === 0}
              className="h-10 px-4 rounded-xl bg-gradient-warm text-primary-foreground font-semibold inline-flex items-center gap-2 shadow-glow active:scale-95 transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Download CSV
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ReportStat label="Orders" value={report.totalCount.toString()} />
            <ReportStat label="Completed" value={report.completedCount.toString()} />
            <ReportStat label="Cancelled" value={report.cancelledCount.toString()} />
            <ReportStat label="Revenue" value={`$${report.revenue.toFixed(2)}`} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Showing {range} window · Avg ticket ${report.avg.toFixed(2)}
          </p>
        </section>

        {/* Orders dashboard */}
        <section className="bg-card rounded-3xl shadow-card p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="font-bold text-lg flex-1">Order Dashboard</h2>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "All" | OrderStatus)}
            >
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter table"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="w-32"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No orders match.</p>
          ) : (
            <ul className="divide-y divide-border">
              {filteredOrders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-semibold text-sm">{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Table {o.table} · {o.items.length} items · ${o.total.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      o.status === "Served"
                        ? "bg-green-100 text-green-700"
                        : o.status === "Ready"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "Cooking"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) => (
  <div className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-3">
    <div className="h-11 w-11 rounded-xl bg-gradient-warm flex items-center justify-center shadow-glow">
      <Icon className="h-5 w-5 text-primary-foreground" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const ReportStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary rounded-xl p-3">
    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-lg font-bold mt-1">{value}</p>
  </div>
);

export default Admin;