import { motion } from "framer-motion";
import { ArrowLeft, Search, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import PageTransition from "@/components/shared/PageTransition";

const NotFound = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8"
            >
              <span className="font-heading text-[100px] font-black leading-none text-foreground sm:text-[160px]">
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
              className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl"
            >
              Looks like you're lost
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mb-10 max-w-md text-muted-foreground"
            >
              This page doesn't exist in our marketplace. Let's get you back to swapping skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                to="/"
                className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
              >
                <Home size={16} /> Go Home
              </Link>
              <Link
                to="/marketplace"
                className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Browse Marketplace <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {["Features", "Pricing", "About", "Contact"].map((page) => (
                <Link key={page} to={`/${page.toLowerCase()}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {page}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
