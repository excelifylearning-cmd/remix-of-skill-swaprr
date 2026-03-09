import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check, Shield, BarChart3, User } from "lucide-react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const consentData = { essential: true, analytics: true, preferences: true, timestamp: Date.now() };
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    // Actually set cookies based on consent
    if (analytics) {
      localStorage.setItem("analytics-enabled", "true");
    }
    if (preferences) {
      localStorage.setItem("preferences-enabled", "true");
    }
    setShow(false);
  };

  const savePreferences = () => {
    const consentData = { essential: true, analytics, preferences, timestamp: Date.now() };
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    // Set cookies based on user preferences
    localStorage.setItem("analytics-enabled", analytics.toString());
    localStorage.setItem("preferences-enabled", preferences.toString());
    setShow(false);
  };

  const declineAll = () => {
    const consentData = { essential: true, analytics: false, preferences: false, timestamp: Date.now() };
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    localStorage.setItem("analytics-enabled", "false");
    localStorage.setItem("preferences-enabled", "false");
    setAnalytics(false);
    setPreferences(false);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9994] bg-background/80 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          {/* Main Cookie Dialog */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed bottom-4 left-4 right-4 z-[9995] mx-auto max-w-md rounded-3xl border border-border/50 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
          >
            {/* Close Button */}
            <motion.button 
              onClick={() => setShow(false)} 
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-1 hover:text-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} />
            </motion.button>

            <AnimatePresence mode="wait">
              {!showPrefs ? (
                <motion.div 
                  key="main" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-primary/20">
                      <Cookie size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base font-bold text-foreground">Cookie Preferences</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">We value your privacy</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    We use cookies to enhance your browsing experience and analyze site traffic. You can customize your preferences or learn more in our{" "}
                    <motion.a 
                      href="/legal" 
                      className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                      whileHover={{ scale: 1.02 }}
                    >
                      Cookie Policy
                    </motion.a>.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={acceptAll}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsl(var(--primary) / 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check size={16} />
                      Accept All Cookies
                    </motion.button>
                    
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setShowPrefs(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-1/50 py-2.5 text-xs font-medium text-foreground backdrop-blur-sm hover:bg-surface-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Settings size={14} />
                        Customize
                      </motion.button>
                      <motion.button
                        onClick={declineAll}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Decline All
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="prefs" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-3">
                    <motion.button
                      onClick={() => setShowPrefs(false)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-1 hover:text-foreground"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={14} />
                    </motion.button>
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">Cookie Settings</h3>
                      <p className="text-xs text-muted-foreground">Choose what you're comfortable with</p>
                    </div>
                  </div>

                  {/* Cookie Categories */}
                  <div className="mb-5 space-y-3">
                    {/* Essential Cookies */}
                    <div className="rounded-xl border border-border/50 bg-gradient-to-r from-skill-green/5 to-skill-green/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-skill-green/20 p-2">
                            <Shield size={16} className="text-skill-green" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Essential Cookies</p>
                            <p className="text-xs text-muted-foreground">Required for core functionality</p>
                          </div>
                        </div>
                        <div className="flex h-6 w-11 items-center rounded-full bg-skill-green/30 px-1">
                          <div className="h-4 w-4 translate-x-5 rounded-full bg-skill-green shadow-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="rounded-xl border border-border/50 bg-surface-1/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/20 p-2">
                            <BarChart3 size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Analytics Cookies</p>
                            <p className="text-xs text-muted-foreground">Help us improve our platform</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setAnalytics(!analytics)}
                          className={`flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
                            analytics ? "bg-primary/30" : "bg-surface-2"
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className={`h-4 w-4 rounded-full shadow-sm transition-colors ${
                              analytics ? "bg-primary" : "bg-muted-foreground"
                            }`}
                            animate={{ x: analytics ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Preference Cookies */}
                    <div className="rounded-xl border border-border/50 bg-surface-1/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-accent/20 p-2">
                            <User size={16} className="text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Preference Cookies</p>
                            <p className="text-xs text-muted-foreground">Remember your choices</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setPreferences(!preferences)}
                          className={`flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
                            preferences ? "bg-accent/30" : "bg-surface-2"
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className={`h-4 w-4 rounded-full shadow-sm transition-colors ${
                              preferences ? "bg-accent" : "bg-muted-foreground"
                            }`}
                            animate={{ x: preferences ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    onClick={savePreferences}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsl(var(--primary) / 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={16} />
                    Save My Preferences
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
