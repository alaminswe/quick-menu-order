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

  if (!ok) return null;
  return <>{children}</>;
};

export default RoleGuard;
