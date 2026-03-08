import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ArrowRight, Bug } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const ServerErrorPage = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
            <span className="font-heading text-[100px] font-black leading-none text-foreground sm:text-[140px]">
              5
              <motion.span className="inline-block text-destructive" animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                0
              </motion.span>
              0
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Something Went Wrong
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mx-auto mb-10 max-w-md text-muted-foreground">
            Our servers hit an unexpected error. We've been notified and are working on a fix. Please try again in a moment.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <RefreshCw size={16} /> Try Again
            </motion.button>
            <Link to="/" className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground">
              <Home size={16} /> Go Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Bug size={12} />
              <span>If this keeps happening, <Link to="/contact" className="font-medium text-foreground hover:underline">contact support</Link> or check our <Link to="/roadmap" className="font-medium text-foreground hover:underline">status page</Link>.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServerErrorPage;
