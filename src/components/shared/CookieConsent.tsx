import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check } from "lucide-react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true, analytics: true, preferences: true }));
    setShow(false);
  };

  const savePrefs = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true, analytics, preferences }));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 right-4 z-[9995] max-w-xs rounded-2xl border border-border bg-card p-4 shadow-2xl sm:bottom-6 sm:right-6"
        >
          <button onClick={() => setShow(false)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
              <Cookie size={18} className="text-badge-gold" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">We use cookies</h3>
              <p className="text-xs text-muted-foreground">To make your experience better.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showPrefs ? (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  We use essential cookies for functionality and optional cookies for analytics. Read our{" "}
                  <a href="/legal" className="text-foreground underline">Cookie Policy</a>.
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={accept}
                    className="flex-1 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept All
                  </motion.button>
                  <motion.button
                    onClick={() => setShowPrefs(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings size={12} /> Manage
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="prefs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-surface-1 p-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">Essential</p>
                      <p className="text-[10px] text-muted-foreground">Required for the platform</p>
                    </div>
                    <div className="flex h-5 w-9 items-center rounded-full bg-skill-green/20 px-0.5">
                      <div className="h-4 w-4 translate-x-4 rounded-full bg-skill-green" />
                    </div>
                  </div>
                  {[
                    { label: "Analytics", desc: "Help us improve", val: analytics, set: setAnalytics },
                    { label: "Preferences", desc: "Remember your settings", val: preferences, set: setPreferences },
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => c.set(!c.val)}
                      className="flex w-full items-center justify-between rounded-lg bg-surface-1 p-3"
                    >
                      <div className="text-left">
                        <p className="text-xs font-medium text-foreground">{c.label}</p>
                        <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                      </div>
                      <div className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${c.val ? "bg-skill-green/20" : "bg-surface-2"}`}>
                        <motion.div
                          className={`h-4 w-4 rounded-full transition-colors ${c.val ? "bg-skill-green" : "bg-muted-foreground"}`}
                          animate={{ x: c.val ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={savePrefs}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={12} /> Save Preferences
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
