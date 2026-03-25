import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ThemeToggle } from "../common/theme-toggle";
import { useAuthStore } from "../../store/auth-store";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/patients": "Patient Details",
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const title = titles[location.pathname] ?? "HealthHQ";

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <div className="container-app flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <div className="hidden rounded-2xl border px-3 py-2 text-right sm:block">
            <p className="text-sm font-medium">{user?.displayName || user?.email || "Admin User"}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
        </div>
      </div>
    </header>
  );
}
