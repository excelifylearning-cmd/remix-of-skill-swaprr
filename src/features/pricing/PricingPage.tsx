import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check, X, Sparkles, Building2, Zap, Coins, Shield, Trophy,
  Award, Star, ArrowRight, Users, Target, TrendingUp, Flame,
  BarChart3, Clock, Eye, Crown, Gem, Medal, CircleDot, Activity,
  Calculator, Layers, GraduationCap, CheckCircle2
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";
import { logFormSubmission, logPageView } from "@/lib/activity-logger";
import { useLivePricingStats } from "./hooks/useLivePricingStats";


/* ─── Data ─── */

const tiers = [
  {
    name: "Free", price: "$0", priceYearly: "$0", period: "forever", icon: Zap, color: "text-muted-foreground",
    tagline: "Everything you need to start swapping",
    features: [
      { text: "5 gigs per month", included: true },
      { text: "Direct Swap format", included: true },
      { text: "Standard profile", included: true },
      { text: "Basic search", included: true },
      { text: "Community support", included: true },
      { text: "5% gig tax", included: true },
      { text: "All formats", included: false },
      { text: "Featured listings", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free", highlight: false,
  },
  {
    name: "Pro", price: "$12", priceYearly: "$10", period: "/mo", icon: Sparkles, color: "text-badge-gold",
    tagline: "For serious swappers who want maximum visibility",
    features: [
      { text: "Unlimited gigs", included: true },
      { text: "All 6 gig formats", included: true },
      { text: "Featured listings", included: true },
      { text: "Profile highlighting", included: true },
      { text: "Advanced analytics", included: true },
      { text: "3% reduced tax", included: true },
      { text: "Priority support", included: true },
      { text: "Custom portfolio themes", included: true },
      { text: "Early access to features", included: true },
      { text: "Monthly bonus 50 SP", included: true },
    ],
    cta: "Go Pro", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", priceYearly: "Custom", period: "", icon: Building2, color: "text-court-blue",
    tagline: "For teams, universities, and organizations",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Vetted expert access", included: true },
      { text: "Hiring pipeline", included: true },
      { text: "Custom integrations", included: true },
      { text: "API access", included: true },
      { text: "NDA & IP protection", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom SLA", included: true },
      { text: "SSO / SAML", included: true },
      { text: "1% tax rate", included: true },
    ],
    cta: "Contact Sales", highlight: false,
  },
];

const pointPackages = [
  { points: 50, price: "$5", perPoint: "$0.10", label: "Starter", icon: Coins },
  { points: 200, price: "$16", perPoint: "$0.08", label: "Builder", icon: Zap, popular: true },
  { points: 500, price: "$35", perPoint: "$0.07", label: "Power User", icon: Flame },
  { points: 1000, price: "$60", perPoint: "$0.06", label: "Guild Leader", icon: Crown },
];

const lifetimeTiers = [
  { name: "Bronze", req: "0 gigs", icon: CircleDot, color: "text-orange-400", bg: "bg-orange-400/10", perks: ["Basic marketplace access", "Standard search", "5% tax rate"] },
  { name: "Silver", req: "25 gigs", icon: Shield, color: "text-muted-foreground", bg: "bg-surface-2", perks: ["Co-Creation Studio", "Guild membership", "4.5% tax rate"] },
  { name: "Gold", req: "100 gigs", icon: Trophy, color: "text-badge-gold", bg: "bg-badge-gold/10", perks: ["Projects mode", "Priority matching", "4% tax rate"] },
  { name: "Platinum", req: "250 gigs", icon: Gem, color: "text-foreground", bg: "bg-surface-2", perks: ["All formats unlocked", "Featured profile", "3% tax rate"] },
  { name: "Diamond", req: "500 gigs", icon: Crown, color: "text-court-blue", bg: "bg-court-blue/10", perks: ["Exclusive badges", "Beta access", "1% tax rate"] },
];

const badges = [
  { name: "First Swap", desc: "Complete your first gig", benefit: "Profile badge", rarity: "Common", icon: Star },
  { name: "Speed Demon", desc: "Complete a gig in under 24h", benefit: "Priority listing boost", rarity: "Rare", icon: Zap },
  { name: "Court Regular", desc: "Judge 5 Skill Court cases", benefit: "0.5% tax reduction", rarity: "Uncommon", icon: Shield },
  { name: "Guild Leader", desc: "Lead a guild with 10+ members", benefit: "Treasury bonus 2x", rarity: "Epic", icon: Users },
  { name: "Diamond Hands", desc: "Reach Diamond lifetime tier", benefit: "1% tax rate forever", rarity: "Legendary", icon: Crown },
  { name: "Perfect Score", desc: "Maintain 5.0 for 20 gigs", benefit: "Featured profile", rarity: "Epic", icon: Award },
  { name: "Campus Hero", desc: "Top rated at your university", benefit: "University badge", rarity: "Rare", icon: Medal },
  { name: "Streak Master", desc: "30-day activity streak", benefit: "+50 SP monthly bonus", rarity: "Uncommon", icon: Flame },
];

const rarityColor = (r: string) => {
  if (r === "Legendary") return "bg-badge-gold/10 text-badge-gold";
  if (r === "Epic") return "bg-court-blue/10 text-court-blue";
  if (r === "Rare") return "bg-skill-green/10 text-skill-green";
  if (r === "Uncommon") return "bg-surface-2 text-foreground";
  return "bg-surface-2 text-muted-foreground";
};

/* liveStats and skillDemand are now fetched from the database — see useLivePricingStats hook below */


const socialProof = [
  { name: "Aisha K.", tier: "Free → Pro", quote: "The reduced tax rate paid for Pro in the first week. My gigs get 3x more views.", stat: "+340% visibility" },
  { name: "Marco R.", tier: "Pro", quote: "I earned 2,400 SP last month — more than enough to fund every project I need.", stat: "2,400 SP/mo" },
  { name: "Team Nexus", tier: "Enterprise", quote: "We've onboarded 50 interns through SkillSwappr. Quality of talent is unmatched.", stat: "50 hires" },
];

const groupPlans = [
  {
    name: "Guild Plan", price: "$29", period: "/mo", icon: Shield, color: "text-court-blue",
    tagline: "For guilds up to 15 members",
    features: [
      "Shared guild treasury management",
      "Guild analytics dashboard",
      "2% tax rate for all members",
      "Guild Wars priority matchmaking",
      "Shared portfolio showcase",
      "Internal gig board",
    ],
  },
  {
    name: "Team Plan", price: "$49", period: "/mo", icon: Users, color: "text-skill-green",
    tagline: "For project teams up to 25 members",
    features: [
      "Everything in Guild Plan",
      "Co-Creation Studio unlimited",
      "Team milestone tracking",
      "Shared workspace & files",
      "Role-based permissions",
      "Team performance reports",
      "1.5% tax rate for all members",
    ],
  },
  {
    name: "University", price: "$199", period: "/mo", icon: GraduationCap, color: "text-badge-gold",
    tagline: "Campus-wide license, unlimited students",
    features: [
      "Everything in Team Plan",
      "Unlimited student seats",
      "University-branded portal",
      "Faculty admin dashboard",
      "Career services integration",
      "Campus leaderboard",
      "1% tax rate campus-wide",
      "Dedicated support",
    ],
  },
];

const calcSkills = [
  { name: "UI/UX Design", avgRate: 35 },
  { name: "Full-Stack Dev", avgRate: 45 },
  { name: "Mobile Dev", avgRate: 42 },
  { name: "Video Editing", avgRate: 30 },
  { name: "Copywriting", avgRate: 20 },
  { name: "Data Science", avgRate: 40 },
  { name: "Marketing", avgRate: 25 },
  { name: "Illustration", avgRate: 28 },
  { name: "3D Modeling", avgRate: 38 },
  { name: "Photography", avgRate: 22 },
];

/* ─── Component ─── */

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(liveStats.map(() => 0));
  const [calcSkill, setCalcSkill] = useState(calcSkills[0].name);
  const [calcGigs, setCalcGigs] = useState(8);
  const [calcComplexity, setCalcComplexity] = useState(3);
  const [calcTier, setCalcTier] = useState<"free" | "pro">("free");
  const [calcGuild, setCalcGuild] = useState(false);
  const [calcMembers, setCalcMembers] = useState(5);
  const [entCompany, setEntCompany] = useState("");
  const [entEmail, setEntEmail] = useState("");
  const [entTeamSize, setEntTeamSize] = useState("");
  const [entSubmitted, setEntSubmitted] = useState(false);

  const handleEnterpriseQuote = async () => {
    if (!entCompany.trim() || !entEmail.trim()) { toast.error("Please fill company name and email"); return; }
    const { data, error } = await supabase.from("enterprise_quotes").insert({
      company_name: entCompany.trim(),
      email: entEmail.trim(),
      team_size: entTeamSize || "Not specified",
      source: "pricing",
    }).select("id").single();
    if (error) { toast.error("Failed to submit. Please try again."); return; }
    logFormSubmission("enterprise_quote", { company_name: entCompany.trim(), email: entEmail.trim(), team_size: entTeamSize, source: "pricing" }, "enterprise_quote", data?.id);
    setEntSubmitted(true);
    toast.success("Quote request submitted! We'll be in touch.");
  };

  const calcResult = useMemo(() => {
    const skill = calcSkills.find((s) => s.name === calcSkill) || calcSkills[0];
    const baseEarnings = calcGigs * skill.avgRate * (calcComplexity / 3);
    const taxRate = calcGuild ? 0.02 : calcTier === "pro" ? 0.03 : 0.05;
    const tax = baseEarnings * taxRate;
    const net = baseEarnings - tax;
    const tierCost = calcTier === "pro" ? (annual ? 10 : 12) : 0;
    const guildCost = calcGuild ? (annual ? 23 : 29) : 0;
    const monthlyCost = tierCost + guildCost;
    const proSavings = calcTier === "free" ? baseEarnings * 0.02 : 0; // what they'd save upgrading
    const recommended = calcGigs > 5 ? "Pro" : "Free";
    const guildValue = calcGuild ? calcMembers * net * 0.1 : 0;
    return { baseEarnings: Math.round(baseEarnings), tax: Math.round(tax), net: Math.round(net), taxRate: Math.round(taxRate * 100), monthlyCost, proSavings: Math.round(proSavings), recommended, guildValue: Math.round(guildValue) };
  }, [calcSkill, calcGigs, calcComplexity, calcTier, calcGuild, calcMembers, annual]);

  // Animate stat counters on mount
  useEffect(() => {
    const targets = liveStats.map((s) => (typeof s.value === "number" ? s.value : 0));
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats(targets.map((t) => Math.round(t * eased)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

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
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <Sparkles size={12} className="mr-1.5 inline text-badge-gold" /> Simple, transparent pricing
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              Invest in Your <span className="text-muted-foreground">Growth</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Start free forever. Upgrade when you're ready to unlock unlimited potential. No hidden fees, no lock-in.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
              <button onClick={() => setAnnual(false)} className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!annual ? "bg-foreground text-background" : "text-muted-foreground"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${annual ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                Yearly <span className="ml-1.5 rounded-full bg-skill-green/10 px-2 py-0.5 text-[10px] font-bold text-skill-green">Save 20%</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-24">
          <div className="mx-auto grid max-w-5xl gap-5 px-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className={`relative h-full rounded-2xl border p-7 transition-all duration-300 ${tier.highlight ? "border-foreground/30 bg-card shadow-[0_0_60px_hsl(var(--silver)/0.08)]" : "border-border bg-card hover:border-foreground/20"}`}>
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 text-xs font-bold text-background">Most Popular</div>
                  )}
                  <div className="mb-1 flex items-center gap-2">
                    <tier.icon size={18} className={tier.color} />
                    <h3 className="font-heading text-lg font-bold text-foreground">{tier.name}</h3>
                  </div>
                  <p className="mb-5 text-xs text-muted-foreground">{tier.tagline}</p>
                  <div className="mb-6">
                    <span className="font-heading text-4xl font-black text-foreground">{annual ? tier.priceYearly : tier.price}</span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5 text-sm">
                        {f.included ? (
                          <Check size={14} className="mt-0.5 flex-shrink-0 text-skill-green" />
                        ) : (
                          <X size={14} className="mt-0.5 flex-shrink-0 text-muted-foreground/30" />
                        )}
                        <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/40"}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.a
                    href={tier.name === "Enterprise" ? "/enterprise" : "/signup"}
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                      tier.highlight ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.cta} <ArrowRight size={14} className="ml-1 inline" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Guild, Team & University Plans */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Guild, Team & University Plans</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Group pricing for guilds, project teams, and entire universities. Lower tax rates and shared tools for everyone.
            </motion.p>
            <div className="grid gap-5 md:grid-cols-3">
              {groupPlans.map((plan, i) => (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7 transition-all hover:border-foreground/20">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                        <plan.icon size={20} className={plan.color} />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-foreground">{plan.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{plan.tagline}</p>
                      </div>
                    </div>
                    <div className="mb-5">
                      <span className="font-heading text-3xl font-black text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check size={13} className="mt-0.5 flex-shrink-0 text-skill-green" /> {f}
                        </li>
                      ))}
                    </ul>
                    <motion.button className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground hover:text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Get {plan.name} <ArrowRight size={14} className="ml-1 inline" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Calculator size={24} className="text-badge-gold" />
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Earnings Calculator</motion.h2>
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Estimate your monthly earnings, see tax impact, and find the best plan for your activity level.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Inputs */}
              <div className="grid gap-6 p-8 md:grid-cols-2">
                {/* Left: Sliders */}
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Primary Skill</span>
                    </label>
                    <select value={calcSkill} onChange={(e) => setCalcSkill(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground focus:border-ring focus:outline-none">
                      {calcSkills.map((s) => (
                        <option key={s.name}>{s.name}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-muted-foreground">Avg rate: {calcSkills.find((s) => s.name === calcSkill)?.avgRate} SP/gig</p>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Gigs per month</span>
                      <span className="font-mono text-xs text-muted-foreground">{calcGigs}</span>
                    </label>
                    <input type="range" min={1} max={30} value={calcGigs} onChange={(e) => setCalcGigs(Number(e.target.value))} className="w-full accent-foreground" />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>1</span><span>30</span></div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Avg Complexity</span>
                      <span className="font-mono text-xs text-muted-foreground">{calcComplexity}/5</span>
                    </label>
                    <input type="range" min={1} max={5} value={calcComplexity} onChange={(e) => setCalcComplexity(Number(e.target.value))} className="w-full accent-foreground" />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>Simple</span><span>Complex</span></div>
                  </div>
                </div>

                {/* Right: Options */}
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Your Plan</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["free", "pro"] as const).map((t) => (
                        <button key={t} onClick={() => setCalcTier(t)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${calcTier === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
                          {t === "free" ? "Free" : "Pro ($12/mo)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-3 text-sm font-medium text-foreground">
                      <button onClick={() => setCalcGuild(!calcGuild)} className={`flex h-5 w-9 items-center rounded-full transition-colors ${calcGuild ? "bg-foreground" : "bg-border"}`}>
                        <div className={`h-4 w-4 rounded-full bg-background transition-transform ${calcGuild ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                      Guild Plan ($29/mo)
                    </label>
                  </div>

                  {calcGuild && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">Guild Members</span>
                        <span className="font-mono text-xs text-muted-foreground">{calcMembers}</span>
                      </label>
                      <input type="range" min={2} max={15} value={calcMembers} onChange={(e) => setCalcMembers(Number(e.target.value))} className="w-full accent-foreground" />
                    </motion.div>
                  )}

                  <div className="rounded-xl bg-surface-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Recommended plan:</span>
                      <span className="rounded-full bg-foreground px-3 py-0.5 text-[10px] font-bold text-background">{calcResult.recommended}</span>
                    </div>
                    {calcTier === "free" && calcResult.proSavings > 0 && (
                      <p className="text-[10px] text-skill-green">⚡ Upgrading to Pro would save you ~{calcResult.proSavings} SP/mo in taxes</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="border-t border-border bg-surface-1 p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-xl bg-card p-4 text-center border border-border">
                    <p className="font-heading text-2xl font-black text-foreground">{calcResult.baseEarnings}</p>
                    <p className="text-[10px] text-muted-foreground">Gross Earnings (SP)</p>
                  </div>
                  <div className="rounded-xl bg-card p-4 text-center border border-border">
                    <p className="font-heading text-2xl font-black text-destructive">-{calcResult.tax}</p>
                    <p className="text-[10px] text-muted-foreground">Tax ({calcResult.taxRate}%)</p>
                  </div>
                  <div className="rounded-xl bg-card p-4 text-center border border-border">
                    <p className="font-heading text-2xl font-black text-skill-green">{calcResult.net}</p>
                    <p className="text-[10px] text-muted-foreground">Net Earnings (SP)</p>
                  </div>
                  <div className="rounded-xl bg-card p-4 text-center border border-border">
                    <p className="font-heading text-2xl font-black text-foreground">${calcResult.monthlyCost}</p>
                    <p className="text-[10px] text-muted-foreground">Monthly Cost</p>
                  </div>
                  {calcGuild && (
                    <div className="rounded-xl bg-card p-4 text-center border border-border">
                      <p className="font-heading text-2xl font-black text-court-blue">{calcResult.guildValue}</p>
                      <p className="text-[10px] text-muted-foreground">Guild Treasury Value</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-4 text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full bg-skill-green/10 px-3 py-1">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-skill-green/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-skill-green" /></span>
                <span className="text-xs font-semibold text-skill-green">Live</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">The Platform Never Sleeps</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-lg text-muted-foreground">
                Right now, thousands of students are swapping skills, earning points, and building portfolios. Here's what's happening:
              </motion.p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liveStats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-black text-foreground">
                      {typeof stat.value === "number" ? animatedStats[i].toLocaleString() : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skill Demand & Value Table */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Your Skills Have Real Value</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              See what your skills are worth on the platform. Demand updates in real-time based on marketplace activity.
            </motion.p>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 border-b border-border bg-surface-1 px-6 py-3">
                {["Skill", "Demand", "Avg Value", "Swaps Today", "Trend"].map((h) => (
                  <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</span>
                ))}
              </div>
              {/* Rows */}
              {skillDemand.map((s, i) => (
                <motion.div key={s.skill} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="grid grid-cols-5 items-center gap-4 border-b border-border px-6 py-4 last:border-0">
                  <span className="text-sm font-medium text-foreground">{s.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-skill-green" style={{ width: `${s.demand}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{s.demand}%</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">{s.avgValue}</span>
                  <span className="font-mono text-sm text-muted-foreground">{s.swapsToday}</span>
                  <span className="font-mono text-xs font-semibold text-skill-green">{s.trend}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Buy Skill Points */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Buy Skill Points</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Jumpstart your journey or balance a high-value trade. Points never expire.
            </motion.p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pointPackages.map((pkg, i) => (
                <motion.div key={pkg.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300 hover:border-foreground/20 ${pkg.popular ? "border-skill-green/30 bg-card" : "border-border bg-card"}`}>
                  {pkg.popular && <span className="absolute -top-px left-0 right-0 h-0.5 bg-skill-green" />}
                  {pkg.popular && <span className="absolute top-3 right-3 rounded-full bg-skill-green px-2 py-0.5 text-[9px] font-bold text-background">BEST VALUE</span>}
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2">
                    <pkg.icon size={22} className="text-badge-gold" />
                  </div>
                  <p className="font-heading text-3xl font-black text-foreground">{pkg.points}</p>
                  <p className="mb-3 text-xs text-muted-foreground">skill points</p>
                  <p className="font-heading text-xl font-bold text-foreground">{pkg.price}</p>
                  <p className="mb-5 text-[10px] text-muted-foreground">{pkg.perPoint} per point</p>
                  <motion.button className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground hover:text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Buy {pkg.label}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifetime Tiers */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Lifetime Tiers</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              The more you swap, the more you unlock. Tiers are permanent — once earned, they're yours forever.
            </motion.p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {lifetimeTiers.map((tier, i) => (
                <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-foreground/20">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${tier.bg}`}>
                    <tier.icon size={22} className={tier.color} />
                  </div>
                  <h4 className={`mb-1 font-heading text-base font-bold ${tier.color}`}>{tier.name}</h4>
                  <p className="mb-3 font-mono text-[10px] text-muted-foreground">{tier.req}</p>
                  <ul className="space-y-1.5 text-left">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <Check size={10} className="mt-0.5 flex-shrink-0 text-skill-green" /> {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Badge Collection */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Badge Collection</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Earn badges for milestones. Each badge comes with tangible benefits that boost your standing.
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {badges.map((b, i) => (
                <motion.div key={b.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                      <b.icon size={16} className="text-badge-gold" />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${rarityColor(b.rarity)}`}>{b.rarity}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{b.name}</h3>
                  <p className="mb-3 text-[11px] text-muted-foreground">{b.desc}</p>
                  <div className="rounded-lg bg-skill-green/5 px-2.5 py-1.5">
                    <p className="text-[10px] font-medium text-skill-green">⚡ {b.benefit}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center font-heading text-3xl font-bold text-foreground">Real Results from Real Users</motion.h2>
            <div className="grid gap-6 md:grid-cols-3">
              {socialProof.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-surface-2 px-3 py-1 text-[10px] font-semibold text-muted-foreground">{t.tier}</span>
                    <span className="rounded-full bg-skill-green/10 px-3 py-1 font-mono text-[10px] font-bold text-skill-green">{t.stat}</span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-heading text-xs font-bold text-foreground">{t.name.charAt(0)}</div>
                    <span className="text-sm font-medium text-foreground">{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <Building2 size={32} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Need Enterprise?</h2>
            <p className="mb-8 text-sm text-muted-foreground">Custom pricing for teams and organizations. Dedicated support, API access, and compliance tools included.</p>
            {entSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex flex-col items-center gap-3 rounded-2xl border border-skill-green/20 bg-skill-green/5 px-10 py-8">
                <CheckCircle2 size={32} className="text-skill-green" />
                <p className="font-heading text-lg font-bold text-foreground">Request Received!</p>
                <p className="text-sm text-muted-foreground">Our enterprise team will reach out within 24 hours.</p>
              </motion.div>
            ) : (
              <div className="space-y-3 text-left">
                <input type="text" placeholder="Company name" value={entCompany} onChange={(e) => setEntCompany(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                <input type="email" placeholder="Work email" value={entEmail} onChange={(e) => setEntEmail(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                <select value={entTeamSize} onChange={(e) => setEntTeamSize(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                  <option value="">Team size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
                <motion.button onClick={handleEnterpriseQuote} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  Get Custom Quote <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
