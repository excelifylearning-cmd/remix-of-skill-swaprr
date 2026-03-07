import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Sparkles, Building2, Zap, ChevronDown, Coins, Shield, Trophy,
  Calculator, Award, Star, ArrowRight, Users, Target
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

const badges = [
  { name: "First Swap", desc: "Complete your first gig", benefit: "Profile badge", rarity: "Common" },
  { name: "Speed Demon", desc: "Complete a gig in under 24h", benefit: "Priority listing", rarity: "Rare" },
  { name: "Court Regular", desc: "Judge 5 Skill Court cases", benefit: "Reduced tax 0.5%", rarity: "Uncommon" },
  { name: "Guild Leader", desc: "Lead a guild with 10+ members", benefit: "Treasury bonus", rarity: "Epic" },
  { name: "Diamond Hands", desc: "Reach Diamond lifetime tier", benefit: "1% tax rate", rarity: "Legendary" },
  { name: "Perfect Score", desc: "Maintain 5.0 rating for 20 gigs", benefit: "Featured profile", rarity: "Epic" },
  { name: "Campus Hero", desc: "Top rated at your university", benefit: "University badge", rarity: "Rare" },
  { name: "Streak Master", desc: "30-day activity streak", benefit: "+50 SP bonus", rarity: "Uncommon" },
];

const testimonials = [
  { name: "Aisha K.", tier: "Free", quote: "I earned enough points through gigs alone to never need to buy any. The free tier is genuinely powerful.", rating: 4.9 },
  { name: "Marco R.", tier: "Pro", quote: "The reduced tax rate and featured listings paid for Pro in the first week. My gigs get 3x more views now.", rating: 5.0 },
  { name: "TechCorp Inc.", tier: "Enterprise", quote: "We've hired 12 students through the platform. The quality of talent is exceptional.", rating: 5.0 },
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
  const [gigsPerMonth, setGigsPerMonth] = useState(5);
  const [complexity, setComplexity] = useState(2);
  const [roiSkill, setRoiSkill] = useState("UI/UX Design");

  const recommendedTier = gigsPerMonth <= 5 ? "Free" : "Pro";
  const estimatedEarnings = gigsPerMonth * complexity * 15;
  const taxImpact = estimatedEarnings * (recommendedTier === "Free" ? 0.05 : 0.03);

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
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              Invest in Your <span className="text-muted-foreground">Skills</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Start free. Upgrade when you're ready to unlock everything.
            </motion.p>
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
              <button onClick={() => setAnnual(false)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${!annual ? "bg-foreground text-background" : "text-muted-foreground"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${annual ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                Yearly <span className="ml-1.5 text-xs text-skill-green">−20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-24">
          <div className="mx-auto grid max-w-5xl gap-5 px-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="card-3d group">
                <div className={`card-3d-inner h-full rounded-2xl border p-6 transition-all duration-300 ${tier.highlight ? "border-foreground/30 bg-card shadow-[0_0_40px_hsl(var(--silver)/0.08)]" : "border-border bg-card hover:border-foreground/20"}`}>
                  {tier.highlight && <div className="mb-4 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">Most Popular</div>}
                  <div className="mb-1 flex items-center gap-2">
                    <tier.icon size={18} className="text-muted-foreground" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">{tier.description}</p>
                  <div className="mb-6">
                    <span className="font-heading text-4xl font-black text-foreground">{annual ? tier.priceYearly : tier.price}</span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="mb-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><Check size={14} className="mt-0.5 flex-shrink-0 text-skill-green" /> {f}</li>
                    ))}
                  </ul>
                  <motion.a href={tier.name === "Enterprise" ? "/enterprise" : "/signup"} className={`block w-full rounded-full py-2.5 text-center text-sm font-medium transition-all ${tier.highlight ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Skill Point Packages</h2>
            <p className="mb-12 text-center text-muted-foreground">Buy points to balance exchanges or jumpstart your journey.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pointPackages.map((pkg, i) => (
                <motion.div key={pkg.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`relative rounded-2xl border p-6 text-center transition-all duration-300 hover:border-foreground/20 ${pkg.popular ? "border-skill-green/30 bg-card" : "border-border bg-card"}`}>
                  {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-skill-green px-3 py-0.5 text-[10px] font-bold text-background">BEST VALUE</span>}
                  <Coins size={24} className="mx-auto mb-3 text-badge-gold" />
                  <p className="font-heading text-3xl font-black text-foreground">{pkg.points}</p>
                  <p className="text-xs text-muted-foreground">skill points</p>
                  <p className="mt-3 font-heading text-xl font-bold text-foreground">{pkg.price}</p>
                  <p className="text-[10px] text-muted-foreground">{pkg.perPoint} per point</p>
                  <motion.button className="mt-4 w-full rounded-full border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Buy {pkg.label}</motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Pricing Calculator */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Calculator size={24} className="text-foreground" />
              <h2 className="font-heading text-3xl font-bold text-foreground">Pricing Calculator</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Gigs per month: {gigsPerMonth}</label>
                  <input type="range" min={1} max={30} value={gigsPerMonth} onChange={(e) => setGigsPerMonth(Number(e.target.value))} className="w-full accent-foreground" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Avg complexity (1-5): {complexity}</label>
                  <input type="range" min={1} max={5} value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="w-full accent-foreground" />
                </div>
                <div className="rounded-xl bg-surface-1 p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center">
                      <p className="font-heading text-2xl font-black text-foreground">{recommendedTier}</p>
                      <p className="text-[10px] text-muted-foreground">Recommended Tier</p>
                    </div>
                    <div className="text-center">
                      <p className="font-heading text-2xl font-black text-skill-green">{estimatedEarnings} SP</p>
                      <p className="text-[10px] text-muted-foreground">Est. Monthly Earnings</p>
                    </div>
                    <div className="text-center">
                      <p className="font-heading text-2xl font-black text-destructive">-{taxImpact.toFixed(0)} SP</p>
                      <p className="text-[10px] text-muted-foreground">Tax Impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifetime Tiers */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Lifetime Tiers</h2>
            <div className="space-y-4">
              {lifetimeTiers.map((tier, i) => (
                <motion.div key={tier.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
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

        {/* Badge System */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Badge Collection</h2>
            <p className="mb-12 text-center text-muted-foreground">Earn badges for milestones. Each comes with real benefits.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {badges.map((b, i) => (
                <motion.div key={b.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                  <div className="mb-2 flex items-center justify-between">
                    <Award size={18} className="text-badge-gold" />
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      b.rarity === "Legendary" ? "bg-badge-gold/10 text-badge-gold" :
                      b.rarity === "Epic" ? "bg-court-blue/10 text-court-blue" :
                      b.rarity === "Rare" ? "bg-skill-green/10 text-skill-green" :
                      "bg-surface-2 text-muted-foreground"
                    }`}>{b.rarity}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{b.name}</h3>
                  <p className="mb-2 text-[10px] text-muted-foreground">{b.desc}</p>
                  <p className="text-[10px] font-medium text-skill-green">Benefit: {b.benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Target size={24} className="text-foreground" />
              <h2 className="font-heading text-3xl font-bold text-foreground">What's Your Skill Worth?</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <select value={roiSkill} onChange={(e) => setRoiSkill(e.target.value)} className="mb-6 h-12 w-full rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground focus:border-ring focus:outline-none">
                {["UI/UX Design", "Full-Stack Dev", "Mobile Dev", "Video Editing", "Copywriting", "Data Science", "Marketing", "Illustration"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-surface-1 p-4 text-center">
                  <p className="font-heading text-2xl font-black text-foreground">High</p>
                  <p className="text-[10px] text-muted-foreground">Market Demand</p>
                </div>
                <div className="rounded-xl bg-surface-1 p-4 text-center">
                  <p className="font-heading text-2xl font-black text-skill-green">25-40 SP</p>
                  <p className="text-[10px] text-muted-foreground">Avg Gig Value</p>
                </div>
                <div className="rounded-xl bg-surface-1 p-4 text-center">
                  <p className="font-heading text-2xl font-black text-badge-gold">~500 SP/mo</p>
                  <p className="text-[10px] text-muted-foreground">Potential Earnings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials by Tier */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground">What Users Say</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
                  <span className="mb-3 inline-block rounded-full bg-surface-2 px-3 py-1 text-[10px] font-semibold text-muted-foreground">{t.tier} Tier</span>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t.name}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-badge-gold text-badge-gold" />
                      <span className="font-mono text-xs text-badge-gold">{t.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Quote */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <Building2 size={32} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Enterprise Custom Quote</h2>
            <p className="mb-8 text-sm text-muted-foreground">Custom pricing for teams and organizations. Tell us about your needs.</p>
            <div className="space-y-3 text-left">
              <input type="text" placeholder="Company name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <input type="email" placeholder="Work email" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <select className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                <option>Team size</option>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>200+</option>
              </select>
              <motion.button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Get Custom Quote <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-border bg-card">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-foreground">
                    {faq.q}
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
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
