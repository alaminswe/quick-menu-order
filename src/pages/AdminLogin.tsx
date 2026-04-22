import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "rqr_admin_session";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

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
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      toast.success("Welcome, admin");
      navigate("/admin", { replace: true });
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setPassword("");
    if (next >= 5) {
      const until = Date.now() + 15000;
      setLockUntil(until);
      setAttempts(0);
      toast.error("Too many attempts. Locked for 15s.");
    } else {
      toast.error(`Wrong password (${next}/5)`);
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
          <h1 className="text-2xl font-bold mt-3">Admin Login</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Demo password: <span className="font-mono">admin123</span>
          </p>
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
        </div>

        <button
          type="submit"
          disabled={locked}
          className="w-full h-12 rounded-xl bg-gradient-warm text-primary-foreground font-semibold shadow-glow active:scale-[0.98] transition disabled:opacity-60"
        >
          {locked ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Locked · {secondsLeft}s
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;