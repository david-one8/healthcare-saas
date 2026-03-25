import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HeartPulse, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/auth-store";

interface ForgotPasswordLocationState {
  from?: {
    pathname?: string;
  };
}

export default function ForgotPasswordPage() {
  const location = useLocation();
  const {
    user,
    requestPasswordReset,
    loading,
    error,
    initialized,
    configError,
    clearError,
  } = useAuthStore();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const locationState = location.state as ForgotPasswordLocationState | null;

  if (!initialized && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground">
          Checking your session...
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    clearError();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Enter your email address to receive a password reset link.");
      return;
    }

    const success = await requestPasswordReset(email);
    if (success) {
      setSuccessMessage("If an account exists for this email, a reset link has been sent.");
    }
  };

  const message = localError || error || configError;
  const authDisabled = Boolean(configError);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary via-cyan-500 to-teal-400 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HealthHQ</h1>
            <p className="text-sm text-white/80">Healthcare operations SaaS</p>
          </div>
        </div>

        <div>
          <h2 className="max-w-md text-4xl font-bold leading-tight">
            Reset access without losing your workspace session history.
          </h2>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <MailCheck className="h-5 w-5" />
              <span>Reset link delivery through Firebase email actions</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Safe recovery flow for care operations teams</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Enter your account email and we&apos;ll send a password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={authDisabled}
                />
              </div>

              {message && (
                <div className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
                  {message}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-success/20 bg-success/10 p-3 text-sm text-success">
                  {successMessage}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading || authDisabled}>
                {loading ? "Sending reset link..." : "Send reset link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  state={locationState}
                  className="font-medium text-primary hover:underline"
                >
                  Back to login
                </Link>
              </p>

              <p className="text-center text-sm text-muted-foreground">
                Need a new account?{" "}
                <Link
                  to="/signup"
                  state={locationState}
                  className="font-medium text-primary hover:underline"
                >
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
