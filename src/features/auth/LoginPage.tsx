import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Quote, Star, Users, Zap, Shield } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const testimonials = [
  { name: "Aisha M.", uni: "MIT", avatar: "AM", quote: "I traded my UI designs for backend development help — saved me $500 and made a lifelong collaborator.", rating: 5 },
  { name: "Carlos R.", uni: "Stanford", avatar: "CR", quote: "Guild Wars pushed me to level up my video editing. I went from amateur to semi-pro in 3 months.", rating: 5 },
  { name: "Priya K.", uni: "Oxford", avatar: "PK", quote: "The Skill Court system gave me confidence that every exchange would be fair. Brilliant concept.", rating: 5 },
];

const trustedUnis = ["MIT", "Stanford", "Oxford", "Harvard", "ETH Zürich", "NUS"];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

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
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
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

              <motion.button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                  <Github size={16} /> GitHub
                </button>
              </div>
            </motion.div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>

        {/* Right: Testimonial Carousel */}
        <div className="hidden flex-1 flex-col items-center justify-center bg-surface-1 lg:flex">
          <div className="max-w-md px-12">
            {/* Abstract visual */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative mx-auto mb-12 flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-surface-2" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 rounded-3xl border border-dashed border-border" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -inset-8 rounded-3xl border border-dashed border-border/50" />
              <div className="relative z-10 flex gap-1">
                <Zap size={20} className="text-badge-gold" />
                <Users size={20} className="text-skill-green" />
                <Shield size={20} className="text-court-blue" />
              </div>
            </motion.div>

            {/* Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="text-center">
                <Quote size={24} className="mx-auto mb-4 text-muted-foreground/30" />
                <p className="mb-6 text-sm leading-relaxed text-foreground italic">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="mb-2 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-badge-gold text-badge-gold" />
                  ))}
                </div>
                <p className="text-sm font-medium text-foreground">{testimonials[activeTestimonial].name}</p>
                <p className="text-xs text-muted-foreground">{testimonials[activeTestimonial].uni}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? "w-6 bg-foreground" : "w-1.5 bg-border"}`} />
              ))}
            </div>

            {/* Trusted By */}
            <div className="mt-12 border-t border-border pt-8 text-center">
              <p className="mb-4 text-[10px] uppercase tracking-wider text-muted-foreground">Trusted by students at</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {trustedUnis.map((u) => (
                  <span key={u} className="text-xs font-medium text-muted-foreground">{u}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
