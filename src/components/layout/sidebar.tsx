import { Activity, HeartPulse, LayoutDashboard, LogOut, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth-store";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: Activity },
  { to: "/patients", label: "Patient Details", icon: Users },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const loading = useAuthStore((state) => state.loading);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login", { replace: true });
      onClose();
    }
  };

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-slate-900/40 md:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white p-4 transition-transform dark:bg-slate-950 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">HealthHQ</p>
            <p className="text-xs text-muted-foreground">B2B Care Operations</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={loading}>
            <LogOut className="h-4 w-4" />
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>
    </>
  );
}
