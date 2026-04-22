import { UtensilsCrossed } from "lucide-react";

const Header = ({ table }: { table: number }) => {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container max-w-3xl flex items-center gap-3 py-4">
        <div className="h-11 w-11 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
          <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-tight">Bella Cucina</h1>
          <p className="text-xs text-muted-foreground">Table {table} · Scan & Order</p>
        </div>
      </div>
    </header>
  );
};

export default Header;