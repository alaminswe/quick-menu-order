export type Role = "admin" | "kitchen" | "waiter";

const SESSION_KEY = "rqr_role_session";

// Demo credentials (frontend-only simulation).
export const ROLE_CREDENTIALS: Record<Role, string> = {
  admin: "admin123",
  kitchen: "kitchen123",
  waiter: "waiter123",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  kitchen: "Kitchen",
  waiter: "Waiter",
};

export const getCurrentRole = (): Role | null => {
  try {
    const v = sessionStorage.getItem(SESSION_KEY);
    return v === "admin" || v === "kitchen" || v === "waiter" ? v : null;
  } catch {
    return null;
  }
};

export const setCurrentRole = (r: Role) => {
  sessionStorage.setItem(SESSION_KEY, r);
};

export const clearRole = () => {
  sessionStorage.removeItem(SESSION_KEY);
};
