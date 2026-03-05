import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Enterprise", href: "/enterprise" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          Skill<span className="text-silver">Swappr</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <motion.a
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.a>
          <motion.a
            href="/signup"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-shadow hover:shadow-[0_0_20px_hsl(var(--silver)/0.3)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Swapping
          </motion.a>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </a>
              ))}
              <a
                href="/signup"
                className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-center text-sm font-medium text-background"
              >
                Start Swapping
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
