import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Home, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const ForbiddenPage = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
            <span className="font-heading text-[100px] font-black leading-none text-foreground sm:text-[140px]">
              4
              <motion.span className="inline-block text-badge-gold" animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                0
              </motion.span>
              3
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-badge-gold/10">
            <Lock size={28} className="text-badge-gold" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Access Denied
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mb-10 max-w-md text-muted-foreground">
            You don't have permission to view this page. This might require a higher tier, admin access, or an active session.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/login" className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background">
              <Lock size={16} /> Log In
            </Link>
            <Link to="/" className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground">
              <Home size={16} /> Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForbiddenPage;
