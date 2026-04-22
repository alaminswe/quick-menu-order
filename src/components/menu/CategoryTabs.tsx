import { Category, categories } from "@/data/menu";
import { cn } from "@/lib/utils";

interface Props {
  active: Category;
  onChange: (c: Category) => void;
}

const CategoryTabs = ({ active, onChange }: Props) => {
  return (
    <div className="sticky top-[72px] z-20 bg-background/85 backdrop-blur-md py-3 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                isActive
                  ? "bg-gradient-warm text-primary-foreground shadow-glow scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;