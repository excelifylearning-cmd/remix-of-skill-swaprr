import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const OfflinePage = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-2">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <WifiOff size={36} className="text-muted-foreground" />
            </motion.div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-3 font-heading text-3xl font-black text-foreground sm:text-4xl">
            You're Offline
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-md text-muted-foreground">
            It looks like you've lost your internet connection. Check your network and try again.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <RefreshCw size={16} /> Retry Connection
            </motion.button>
            <Link to="/" className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground">
              <Home size={16} /> Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OfflinePage;
