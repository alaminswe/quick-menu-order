import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Menu as MenuIcon,
  QrCode,
  Search,
  X,
  Eye,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Customer-facing header only.
// Staff entry points (Kitchen, Waiter, Admin) are hidden — accessible only via direct URLs.
const navLinks = [
  { to: "/track", label: "Track Order", icon: Eye },
];

const Header = ({ table }: { table: number }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [tableInput, setTableInput] = useState("");

  const joinTable = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(tableInput, 10);
    if (!n || n < 1) return;
    setJoinOpen(false);
    setTableInput("");
    navigate(`/menu?table=${n}`);
  };

  const tableUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu?table=${table}`
      : `/menu?table=${table}`;

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl flex items-center gap-3 py-3 px-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow shrink-0">
            <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl font-bold leading-tight truncate">Bella Cucina</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
              Table {table} · Scan & Order
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          <button
            onClick={() => setJoinOpen(true)}
            className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-warm text-primary-foreground shadow-glow active:scale-95 transition"
          >
            <QrCode className="h-4 w-4" /> Join Table
          </button>
        </nav>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            onClick={() => setJoinOpen(true)}
            className="h-10 px-3 rounded-xl bg-gradient-warm text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-glow active:scale-95 transition"
            aria-label="Join a table"
          >
            <QrCode className="h-4 w-4" /> Join
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-border",
          mobileOpen ? "max-h-72" : "max-h-0"
        )}
      >
        <nav className="container max-w-6xl px-4 py-3 grid grid-cols-2 gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center gap-1 py-3 rounded-xl bg-secondary hover:bg-muted text-xs font-semibold"
            >
              <Icon className="h-5 w-5" /> {label}
            </Link>
          ))}
        </nav>
      </div>

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Join a Table</DialogTitle>
            <DialogDescription>
              Search by table number or scan the QR code at your table.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={joinTable} className="space-y-3">
            <label className="text-sm font-semibold">Table number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={tableInput}
                  onChange={(e) => setTableInput(e.target.value)}
                  placeholder="e.g. 5"
                  className="h-12 pl-9 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="px-4 h-12 rounded-xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-95 transition"
              >
                Join
              </button>
            </div>
          </form>

          <div className="mt-2 rounded-2xl bg-muted/60 p-4 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground text-center">
              QR code for current Table {table}
            </p>
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG value={tableUrl} size={150} />
            </div>
            <p className="text-[11px] text-muted-foreground text-center break-all px-2">
              {tableUrl}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;