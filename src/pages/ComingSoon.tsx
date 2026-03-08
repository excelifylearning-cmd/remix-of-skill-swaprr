import { motion } from "framer-motion";
import { Rocket, Bell, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const comingSoonFeatures = [
  "AI-Powered Gig Matching",
  "Mobile App (iOS & Android)",
  "Video Portfolio Support",
  "Advanced Guild Analytics",
];

const ComingSoonPage = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-8 relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-2">
              <Rocket size={36} className="text-court-blue" />
            </div>
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2">
              <Sparkles size={20} className="text-badge-gold" />
            </motion.div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-3 font-heading text-4xl font-black text-foreground sm:text-5xl">
            Coming Soon
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-md text-muted-foreground">
            We're cooking up something amazing. This feature is currently in development and will be available soon.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mb-10 max-w-sm rounded-2xl border border-border bg-card p-6 text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's brewing</p>
            <div className="space-y-3">
              {comingSoonFeatures.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 size={14} className="flex-shrink-0 text-skill-green" />
                  {f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Be the first to know when it launches:</p>
            <div className="mx-auto flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="your@email.com" className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              </div>
              <motion.button className="flex items-center gap-1.5 rounded-xl bg-foreground px-5 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Bell size={14} /> Notify
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
              <Link to="/" className="flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground">
                Go Home
              </Link>
              <Link to="/roadmap" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                View Roadmap <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ComingSoonPage;
