import { motion } from "framer-motion";
import { Wrench, Clock, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const MaintenancePage = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-2">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Wrench size={36} className="text-badge-gold" />
            </motion.div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-3 font-heading text-4xl font-black text-foreground sm:text-5xl">
            Under Maintenance
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mx-auto mb-6 max-w-md text-muted-foreground">
            We're performing scheduled maintenance to improve SkillSwappr. We'll be back shortly — usually within 30 minutes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4">
            <Clock size={18} className="text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Estimated downtime</p>
              <p className="text-xs text-muted-foreground">~30 minutes · Started at 03:00 UTC</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Get notified when we're back:</p>
            <div className="mx-auto flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="your@email.com" className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              </div>
              <motion.button className="rounded-xl bg-foreground px-5 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Notify Me
              </motion.button>
            </div>
            <div className="flex justify-center gap-6 pt-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground">Twitter/X</a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground">Discord</a>
              <Link to="/roadmap" className="text-xs text-muted-foreground hover:text-foreground">Status</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MaintenancePage;
