import { motion } from "framer-motion";
import { ArrowLeft, Search, Home } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import PageTransition from "@/components/shared/PageTransition";

const NotFound = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8"
            >
              <span className="font-heading text-[120px] font-black leading-none text-foreground sm:text-[180px]">
                4
                <motion.span
                  className="inline-block text-muted-foreground"
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  0
                </motion.span>
                4
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl"
            >
              Page not found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mb-10 max-w-md text-muted-foreground"
            >
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.a
                href="/"
                className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home size={16} /> Go Home
              </motion.a>
              <motion.a
                href="/features"
                className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search size={16} /> Explore Features
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
