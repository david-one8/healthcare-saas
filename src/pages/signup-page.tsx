import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/auth-store";
import { showAppNotification } from "../services/notifications";

interface SignupLocationState {
  from?: {
    pathname?: string;
  };
}

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signup, loading, error, initialized, configError, clearError } =
    useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const locationState = location.state as SignupLocationState | null;
  const redirectTo = useMemo(() => {
    const from = locationState?.from?.pathname;
    return from && from !== "/signup" ? from : "/";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    clearError();

    if (name.trim().length < 2) {
      setLocalError("Enter your full name.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const success = await signup(name, email, password);
    if (success) {
      setSuccessMessage("Account created. We sent a verification email to your inbox.");
      await showAppNotification("Account created", "Your HealthHQ account is ready.");
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
            Create secure access for your care operations workspace.
          </h2>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Email/password sign-up with Firebase session persistence</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span>Dashboard, analytics, and patient operations in one workspace</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Set up a Firebase Email/Password account for HealthHQ.
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
                  <span className="bg-card px-2 text-muted-foreground">Or create an account with email</span>
                </div> */}
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full name</label>
                  <Input
                    type="text"
                    placeholder="Jordan Lee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={authDisabled}
                  />
                </div>

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
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authDisabled}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm password</label>
                  <Input
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? "Creating account..." : "Create account"}
                </Button>

                {/* <p className="text-center text-xs text-muted-foreground">
                  Enable Email/Password and Google providers in Firebase Authentication.
                </p> */}

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    state={locationState}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
