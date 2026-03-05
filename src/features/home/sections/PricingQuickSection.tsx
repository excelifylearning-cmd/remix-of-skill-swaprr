import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Building2, Zap } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    description: "Get started with skill swapping",
    features: [
      "5 gigs per month",
      "Direct swap format only",
      "Standard profile",
      "Basic search & filters",
      "Must do court duty",
      "5% gig tax",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    icon: Sparkles,
    description: "Unlock all formats and boost visibility",
    features: [
      "Unlimited gigs",
      "All formats unlocked",
      "Featured listings",
      "Profile highlighting",
      "Advanced analytics",
      "3% reduced tax rate",
      "Priority support",
      "Custom portfolio themes",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Building2,
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Vetted expert access",
      "Hiring pipeline",
      "Custom integrations",
      "Dedicated support",
      "API access",
      "NDA & IP protection",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const PricingQuickSection = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--silver)/0.04),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Simple Pricing
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-lg text-silver">
            Start free. Upgrade when you're ready to unlock everything.
          </p>

          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                !annual ? "bg-foreground text-background" : "text-silver"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                annual ? "bg-foreground text-background" : "text-silver"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-skill-green text-xs">−20%</span>
            </button>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="card-3d group"
            >
              <div
                className={`card-3d-inner h-full rounded-2xl border p-6 transition-all duration-300 ${
                  tier.highlight
                    ? "border-silver/40 bg-card shadow-[0_0_40px_hsl(var(--silver)/0.08)]"
                    : "border-border bg-card hover:border-silver/20"
                }`}
              >
                {tier.highlight && (
                  <div className="mb-4 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                    Most Popular
                  </div>
                )}

                <div className="mb-1 flex items-center gap-2">
                  <tier.icon size={18} className="text-silver-accent" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
                </div>
                <p className="mb-4 text-xs text-silver">{tier.description}</p>

                <div className="mb-6">
                  <span className="font-heading text-4xl font-black text-foreground">
                    {tier.price === "$12" && annual ? "$10" : tier.price}
                  </span>
                  <span className="text-sm text-silver">{tier.period}</span>
                </div>

                <ul className="mb-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-silver">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-skill-green" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={tier.name === "Enterprise" ? "/enterprise" : "/signup"}
                  className={`block w-full rounded-full py-2.5 text-center text-sm font-medium transition-all ${
                    tier.highlight
                      ? "bg-foreground text-background hover:shadow-[0_0_20px_hsl(var(--silver)/0.2)]"
                      : "border border-border text-silver-accent hover:border-silver hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tier.cta}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a href="/pricing" className="text-sm text-silver transition-colors hover:text-foreground">
            See full pricing details, skill point packages, and ROI calculator →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingQuickSection;
