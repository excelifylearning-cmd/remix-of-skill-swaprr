import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Events", href: "/events" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Enterprise", href: "/enterprise" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          Skill<span className="text-muted-foreground">Swappr</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link, i) => (
            <motion.div key={link.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }}>
              <Link
                to={link.href}
                className={`relative text-sm transition-colors hover:text-foreground ${
                  location.pathname === link.href ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <motion.button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isLight ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={16} />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-shadow hover:shadow-[0_0_20px_hsl(var(--silver)/0.3)]"
          >
            Start Swapping
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <motion.button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </motion.button>
          <button className="text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm transition-colors hover:text-foreground ${
                    location.pathname === link.href ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2">
                <Link to="/login" className="flex-1 rounded-full border border-border px-5 py-2.5 text-center text-sm text-muted-foreground">
                  Log In
                </Link>
                <Link to="/signup" className="flex-1 rounded-full bg-foreground px-5 py-2.5 text-center text-sm font-medium text-background">
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
