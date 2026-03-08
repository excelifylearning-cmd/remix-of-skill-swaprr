import { useState } from "react";
import { validateEmail } from "@/lib/email-validation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/shared/Footer";
import { logFormSubmission } from "@/lib/activity-logger";

const CTAFooterSection = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  return (
    <section className="relative overflow-hidden">
      <div className="relative border-b border-border bg-surface-1 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--silver)/0.05),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6 font-heading text-4xl font-black text-foreground sm:text-5xl lg:text-6xl"
          >
            Start Swapping Skills Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground"
          >
            Join thousands of students exchanging skills, building portfolios, and leveling up — without spending a dime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
            </div>
            <motion.button
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!email.trim()) { setEmailErr("Email is required."); return; }
                const result = validateEmail(email);
                if (result !== true) { setEmailErr(result); return; }
                setEmailErr("");
                logFormSubmission("cta_email_signup", { email }, "marketing");
              }}
            >
              Get Started <ArrowRight size={16} />
            </motion.button>
          </motion.div>
          {emailErr && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-destructive">
              {emailErr}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-xs text-muted-foreground/60"
          >
            Free forever. No credit card required. 100 skill points on signup.
          </motion.p>

          {/* App Store Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="#"
              className="flex h-14 items-center gap-3 rounded-xl border border-border bg-card px-5 transition-all hover:border-foreground/30"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-foreground" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none text-muted-foreground">Download on the</p>
                <p className="text-sm font-semibold text-foreground">App Store</p>
              </div>
            </motion.a>

            <motion.a
              href="#"
              className="flex h-14 items-center gap-3 rounded-xl border border-border bg-card px-5 transition-all hover:border-foreground/30"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-foreground" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none text-muted-foreground">Get it on</p>
                <p className="text-sm font-semibold text-foreground">Google Play</p>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default CTAFooterSection;
