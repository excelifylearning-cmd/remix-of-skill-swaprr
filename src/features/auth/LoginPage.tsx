import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        {/* Left: Form */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <Link to="/" className="mb-10 inline-block font-heading text-2xl font-bold text-foreground">
              Skill<span className="text-muted-foreground">Swappr</span>
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="mb-8 text-sm text-muted-foreground">Log in to continue swapping skills.</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-border" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
              </div>

              <motion.button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Log In <ArrowRight size={16} />
              </motion.button>
            </motion.form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">
                  <Github size={16} />
                  GitHub
                </button>
              </div>
            </motion.div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hidden flex-1 items-center justify-center bg-surface-1 lg:flex">
          <div className="max-w-md px-12 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-2">
                <span className="font-heading text-4xl font-black text-foreground">SS</span>
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">Trade Skills, Build Together</h2>
              <p className="text-sm text-muted-foreground">
                Join 10,000+ students exchanging skills, earning points, and building real portfolios — all without spending cash.
              </p>
              <div className="mt-8 flex justify-center gap-6">
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-foreground">50+</p>
                  <p className="text-xs text-muted-foreground">Universities</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-skill-green">2M+</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
