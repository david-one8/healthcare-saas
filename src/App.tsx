import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useUIStore } from "./store/ui-store";
import { useAuthStore } from "./store/auth-store";
import ProtectedRoute from "./routes/protected-route";
import AppShell from "./components/layout/app-shell";
import { RouteLoading } from "./components/common/route-loading";
import { ToastViewport } from "./components/common/toast-viewport";

const LoginPage = lazy(() => import("./pages/login-page"));
const SignupPage = lazy(() => import("./pages/signup-page"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password-page"));
const DashboardPage = lazy(() => import("./pages/dashboard-page"));
const AnalyticsPage = lazy(() => import("./pages/analytics-page"));
const PatientDetailsPage = lazy(() => import("./pages/patient-details-page"));
const NotFoundPage = lazy(() => import("./pages/not-found-page"));

export default function App() {
  const theme = useUIStore((state) => state.theme);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <ToastViewport />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/patients" element={<PatientDetailsPage />} />
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
