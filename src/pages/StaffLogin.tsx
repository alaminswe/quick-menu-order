import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Loader2, ShieldCheck, ChefHat, ConciergeBell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Role,
  ROLE_CREDENTIALS,
  ROLE_LABEL,
  setCurrentRole,
  getCurrentRole,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

const ROLE_ICON: Record<Role, typeof Lock> = {
  admin: ShieldCheck,
  kitchen: ChefHat,
  waiter: ConciergeBell,
};

const StaffLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requested = (params.get("role") as Role) || "admin";
  const nextParam = params.get("next");

  const [role, setRole] = useState<Role>(
    requested === "kitchen" || requested === "waiter" ? requested : "admin"
  );
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Only auto-redirect on initial mount if already signed in as the requested role.
  useEffect(() => {
    const current = getCurrentRole();
    if (current === requested) {
      navigate(nextParam || `/${requested}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lockUntil <= Date.now()) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [lockUntil]);

  const locked = lockUntil > now;
  const secondsLeft = Math.ceil((lockUntil - now) / 1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    if (password === ROLE_CREDENTIALS[role]) {
      setCurrentRole(role);
      toast.success(`Welcome, ${ROLE_LABEL[role]}`);
      // If the requested role matches the chosen role, honor `next`; otherwise go to that role's page.
      const dest = role === requested && nextParam ? nextParam : `/${role}`;
      navigate(dest, { replace: true });
      return;
    }
    const n = attempts + 1;
    setAttempts(n);
    setPassword("");
    if (n >= 5) {
      setLockUntil(Date.now() + 15000);
      setAttempts(0);
      toast.error("Too many attempts. Locked for 15s.");
    } else {
      toast.error(`Wrong password (${n}/5)`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card rounded-3xl shadow-card p-6 space-y-5 animate-fade-in"
      >
        <div className="text-center">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mt-3">Staff Login</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Choose your role and sign in.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["admin", "kitchen", "waiter"] as Role[]).map((r) => {
            const Icon = ROLE_ICON[r];
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setPassword("");
                  setAttempts(0);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-semibold transition",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {ROLE_LABEL[r]}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={locked}
            className="h-12 rounded-xl"
          />
          <p className="text-[11px] text-muted-foreground">
            Demo: <span className="font-mono">{ROLE_CREDENTIALS[role]}</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={locked}
          className="w-full h-12 rounded-xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-[0.98] transition disabled:opacity-60"
        >
          {locked ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Locked · {secondsLeft}s
            </span>
          ) : (
            `Sign in as ${ROLE_LABEL[role]}`
          )}
        </button>

        <Link
          to="/"
          className="block text-center text-xs text-muted-foreground underline"
        >
          Back to customer menu
        </Link>
      </form>
    </div>
  );
};

export default StaffLogin;
