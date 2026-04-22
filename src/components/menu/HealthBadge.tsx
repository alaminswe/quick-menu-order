import { cn } from "@/lib/utils";

const HealthBadge = ({ score }: { score: number }) => {
  const color =
    score >= 70
      ? "bg-green-100 text-green-800 border-green-200"
      : score >= 45
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-red-100 text-red-800 border-red-200";
  const label = score >= 70 ? "Healthy" : score >= 45 ? "Balanced" : "Indulgent";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
        color
      )}
      title={`Health score: ${score}/100`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label} · {score}
    </span>
  );
};

export default HealthBadge;