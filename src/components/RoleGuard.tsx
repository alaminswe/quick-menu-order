import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Role, getCurrentRole } from "@/lib/auth";

interface Props {
  role: Role;
  children: ReactNode;
}

const RoleGuard = ({ role, children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const current = getCurrentRole();
    if (current === role) {
      setOk(true);
    } else {
      navigate(
        `/staff/login?role=${role}&next=${encodeURIComponent(location.pathname)}`,
        { replace: true }
      );
    }
  }, [role, navigate, location.pathname]);

  // Block the browser Back button while signed in.
  // Pushes a forward state so any back-navigation is immediately re-pushed.
  useEffect(() => {
    if (!ok) return;
    // Seed an extra history entry we can "consume" on back.
    window.history.pushState({ staffLock: true }, "");
    const onPop = () => {
      // If still authenticated, re-push to keep the user on this page.
      if (getCurrentRole() === role) {
        window.history.pushState({ staffLock: true }, "");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [ok, role]);

  if (!ok) return null;
  return <>{children}</>;
};

export default RoleGuard;
