import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const AboutCTASection = () => (
  <section className="py-32 px-6">
    <motion.div
      className="max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Sparkles size={12} className="text-badge-gold" />
        <span className="font-mono text-xs text-muted-foreground">Free forever for students</span>
      </motion.div>

      <h2 className="font-heading text-4xl sm:text-6xl font-black text-foreground mb-6">
        Ready to Start <span className="text-muted-foreground">Swapping?</span>
      </h2>
      <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
        Join thousands of students who are trading skills, building portfolios, and leveling up together. No credit card, no catch.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.a
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-10 py-4 text-base font-semibold text-background"
          whileHover={{ scale: 1.02, boxShadow: "0 0 50px hsl(var(--foreground)/0.15)" }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started Free <ArrowRight size={16} />
        </motion.a>
        <motion.a
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Pricing
        </motion.a>
      </div>
    </motion.div>
  </section>
);

export default AboutCTASection;
