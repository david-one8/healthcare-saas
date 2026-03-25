import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { GoogleAuthButton } from "../components/auth/google-auth-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/auth-store";
import { showAppNotification } from "../services/notifications";

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    login,
    signInWithGoogle,
    loading,
    error,
    initialized,
    configError,
    clearError,
  } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const locationState = location.state as LoginLocationState | null;
  const redirectTo = useMemo(() => {
    const from = locationState?.from?.pathname;
    return from && from !== "/login" ? from : "/";
  }, [locationState]);

  if (!initialized && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground">
          Checking your session...
        </div>
      </div>
    );
  }

  if (user) return <Navigate to={redirectTo} replace />;

  const handleGoogleAuth = async () => {
    setLocalError("");
    clearError();

    const success = await signInWithGoogle();
    if (success) {
      await showAppNotification("Welcome", "You have successfully signed in with Google.");
      navigate(redirectTo, { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const success = await login(email, password);
    if (success) {
      await showAppNotification("Welcome back", "You have successfully logged in to HealthHQ.");
      navigate(redirectTo, { replace: true });
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
            Modern care intelligence for multi-clinic teams.
          </h2>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Firebase-authenticated access</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span>Analytics, patient operations, and responsive UX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in with your Firebase Email/Password account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* <GoogleAuthButton
                type="button"
                className="w-full"
                onClick={handleGoogleAuth}
                disabled={loading || authDisabled}
                label="Continue with Google"
              /> */}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                {/* <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div> */}
              </div>

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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authDisabled}
                  />
                </div>

                {message && (
                  <div className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
                    {message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading || authDisabled}>
                  {loading ? "Signing in..." : "Login"}
                </Button>

                {/* <p className="text-center text-xs text-muted-foreground">
                  Enable Email/Password and Google providers in Firebase Authentication.
                </p> */}

                <p className="text-center text-sm">
                  <Link
                    to="/forgot-password"
                    state={locationState}
                    className="font-medium text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </p>

                <p className="text-center text-sm text-muted-foreground">
                  Need an account?{" "}
                  <Link
                    to="/signup"
                    state={locationState}
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </p>

                {redirectTo !== "/" && (
                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ll return to <span className="font-medium text-foreground">{redirectTo}</span> after login.
                  </p>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
