import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Sparkles, Building2, Zap, ChevronDown, Coins, Shield, Trophy
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const tiers = [
  {
    name: "Free", price: "$0", priceYearly: "$0", period: "forever", icon: Zap,
    description: "Get started with skill swapping",
    features: ["5 gigs per month", "Direct swap format only", "Standard profile", "Basic search & filters", "Must do court duty", "5% gig tax"],
    cta: "Start Free", highlight: false,
  },
  {
    name: "Pro", price: "$12", priceYearly: "$10", period: "/month", icon: Sparkles,
    description: "Unlock all formats and boost visibility",
    features: ["Unlimited gigs", "All formats unlocked", "Featured listings", "Profile highlighting", "Advanced analytics", "3% reduced tax rate", "Priority support", "Custom portfolio themes"],
    cta: "Go Pro", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", priceYearly: "Custom", period: "", icon: Building2,
    description: "For teams and organizations",
    features: ["Everything in Pro", "Vetted expert access", "Hiring pipeline", "Custom integrations", "Dedicated support", "API access", "NDA & IP protection"],
    cta: "Contact Sales", highlight: false,
  },
];

const pointPackages = [
  { points: 50, price: "$5", perPoint: "$0.10", label: "Starter" },
  { points: 200, price: "$16", perPoint: "$0.08", label: "Builder", popular: true },
  { points: 500, price: "$35", perPoint: "$0.07", label: "Power User" },
  { points: 1000, price: "$60", perPoint: "$0.06", label: "Guild Leader" },
];

const lifetimeTiers = [
  { name: "Bronze", requirement: "0 lifetime gigs", unlocks: "Basic marketplace access", color: "text-orange-400" },
  { name: "Silver", requirement: "25 lifetime gigs", unlocks: "Co-Creation Studio unlocked", color: "text-muted-foreground" },
  { name: "Gold", requirement: "100 lifetime gigs", unlocks: "Projects mode unlocked", color: "text-badge-gold" },
  { name: "Platinum", requirement: "250 lifetime gigs", unlocks: "All formats + reduced tax", color: "text-foreground" },
  { name: "Diamond", requirement: "500 lifetime gigs", unlocks: "1% tax rate + exclusive badges", color: "text-court-blue" },
];

const faqs = [
  { q: "Can I earn without paying?", a: "Absolutely. Earn points through gigs, referrals, court duty, achievements, and streaks. Most users never need to buy points." },
  { q: "What happens to my points if I cancel Pro?", a: "Your points stay forever. Pro just unlocks premium features — your earned points are always yours." },
  { q: "How does the tax system work?", a: "Both parties pay 5% (or 3% for Pro) of gig value on completion. This prevents inflation and keeps the economy healthy." },
  { q: "Is there a student discount?", a: "SkillSwappr is built for students. The Free tier is genuinely powerful, and Pro is priced for student budgets." },
  { q: "Can I transfer points to other users?", a: "Yes, through guild lending, gifting, or direct transfers. All tracked with transaction codes." },
];

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--silver)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl"
            >
              Invest in Your <span className="text-muted-foreground">Skills</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground"
            >
              Start free. Upgrade when you're ready to unlock everything.
            </motion.p>

            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${!annual ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >Monthly</button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${annual ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Yearly <span className="ml-1.5 text-xs text-skill-green">−20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-24">
          <div className="mx-auto grid max-w-5xl gap-5 px-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card-3d group"
              >
                <div className={`card-3d-inner h-full rounded-2xl border p-6 transition-all duration-300 ${
                  tier.highlight
                    ? "border-foreground/30 bg-card shadow-[0_0_40px_hsl(var(--silver)/0.08)]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}>
                  {tier.highlight && (
                    <div className="mb-4 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">Most Popular</div>
                  )}
                  <div className="mb-1 flex items-center gap-2">
                    <tier.icon size={18} className="text-muted-foreground" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">{tier.description}</p>
                  <div className="mb-6">
                    <span className="font-heading text-4xl font-black text-foreground">
                      {annual ? tier.priceYearly : tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="mb-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-skill-green" /> {f}
                      </li>
                    ))}
                  </ul>
                  <motion.a
                    href={tier.name === "Enterprise" ? "/enterprise" : "/signup"}
                    className={`block w-full rounded-full py-2.5 text-center text-sm font-medium transition-all ${
                      tier.highlight
                        ? "bg-foreground text-background hover:shadow-[0_0_20px_hsl(var(--silver)/0.2)]"
                        : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
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
        </section>

        {/* Skill Points Packages */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl"
            >
              Skill Point Packages
            </motion.h2>
            <p className="mb-12 text-center text-muted-foreground">Buy points to balance exchanges or jumpstart your journey.</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pointPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-2xl border p-6 text-center transition-all duration-300 hover:border-foreground/20 ${
                    pkg.popular ? "border-skill-green/30 bg-card" : "border-border bg-card"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-skill-green px-3 py-0.5 text-[10px] font-bold text-background">
                      BEST VALUE
                    </span>
                  )}
                  <Coins size={24} className="mx-auto mb-3 text-badge-gold" />
                  <p className="font-heading text-3xl font-black text-foreground">{pkg.points}</p>
                  <p className="text-xs text-muted-foreground">skill points</p>
                  <p className="mt-3 font-heading text-xl font-bold text-foreground">{pkg.price}</p>
                  <p className="text-[10px] text-muted-foreground">{pkg.perPoint} per point</p>
                  <motion.button
                    className="mt-4 w-full rounded-full border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Buy {pkg.label}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifetime Tiers */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Lifetime Tiers
            </h2>
            <div className="space-y-4">
              {lifetimeTiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <Trophy size={20} className={tier.color} />
                  <div className="flex-1">
                    <span className={`font-heading font-bold ${tier.color}`}>{tier.name}</span>
                    <p className="text-xs text-muted-foreground">{tier.requirement}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{tier.unlocks}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border bg-card"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-foreground"
                  >
                    {faq.q}
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
