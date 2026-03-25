import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground">
          Loading session...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
