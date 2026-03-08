import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import { validateEmail } from "@/lib/email-validation";
import { useAuth } from "@/lib/auth-context";
import { lovable } from "@/integrations/lovable/index";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const emailError = useMemo(() => {
    return email.trim() ? (validateEmail(email) === true ? "" : validateEmail(email) as string) : "";
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (emailError) { setError(emailError); return; }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setError(result.error || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError("Google sign-in failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Demo mode login
  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    // Use demo credentials
    const result = await login("demo@skillswappr.com", "Demo123!");
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setError("Demo mode unavailable. Please sign up first or use Google login.");
    }
  };

  if (isAuthenticated && !success) {
    navigate("/dashboard");
    return null;
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <Link to="/" className="inline-block font-heading text-2xl font-bold text-foreground">
                Skill<span className="text-muted-foreground">Swappr</span>
              </Link>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
              <h1 className="mb-2 text-center font-heading text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="mb-8 text-center text-sm text-muted-foreground">Log in to continue swapping skills.</p>

              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <AlertCircle size={14} className="text-destructive shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 flex items-center gap-2 rounded-lg border border-skill-green/20 bg-skill-green/5 p-3">
                  <CheckCircle2 size={14} className="text-skill-green shrink-0" />
                  <p className="text-xs text-skill-green">Login successful! Redirecting to dashboard...</p>
                </motion.div>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-1 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {googleLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Continue with Google
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading || googleLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-court-blue/30 bg-court-blue/5 text-sm font-medium text-court-blue hover:bg-court-blue/10 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  🎮 Try Demo Mode
                </motion.button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or sign in with email</span></div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className={`h-12 w-full rounded-xl border ${emailError ? "border-destructive" : "border-border"} bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none`} />
                </div>
                {emailError && <p className="text-xs text-destructive -mt-2">{emailError}</p>}
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="h-12 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">Forgot password?</Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={success || loading || googleLoading}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${success ? "bg-skill-green text-background" : "bg-foreground text-background"} disabled:opacity-50`}
                  whileHover={!success && !loading ? { scale: 1.01 } : {}}
                  whileTap={!success && !loading ? { scale: 0.99 } : {}}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : success ? "✓ Logged In" : <>Log In <ArrowRight size={16} /></>}
                </motion.button>
              </form>
            </motion.div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
