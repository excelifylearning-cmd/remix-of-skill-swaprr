import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, ArrowLeftRight, Trophy, Shield, Users, Coins, TrendingUp,
  ChevronDown, Calendar, Filter, Star, Zap, Gift, Gavel, ArrowRight
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const filters = ["All", "Gigs", "Points", "Achievements", "Court", "Guild"];

const activities = [
  { type: "gig", icon: ArrowLeftRight, title: "Logo Design ↔ React Development", time: "2 hours ago", points: "+30 SP", status: "Completed", color: "text-skill-green" },
  { type: "achievement", icon: Trophy, title: "Unlocked: Speed Demon Badge", time: "5 hours ago", points: "+10 SP", status: "Achievement", color: "text-badge-gold" },
  { type: "points", icon: Coins, title: "Points received from gig completion", time: "Yesterday", points: "+45 SP", status: "Earned", color: "text-skill-green" },
  { type: "court", icon: Shield, title: "Served as Skill Court Judge", time: "Yesterday", points: "+15 SP", status: "Judged", color: "text-court-blue" },
  { type: "guild", icon: Users, title: "Contributed to Guild Treasury", time: "2 days ago", points: "-20 SP", status: "Contributed", color: "text-muted-foreground" },
  { type: "gig", icon: ArrowLeftRight, title: "Video Editing ↔ Copywriting", time: "3 days ago", points: "+15 SP", status: "Completed", color: "text-skill-green" },
  { type: "points", icon: Coins, title: "Referral bonus: Sarah joined!", time: "4 days ago", points: "+25 SP", status: "Referral", color: "text-skill-green" },
  { type: "achievement", icon: Trophy, title: "Unlocked: 10 Gigs Completed", time: "5 days ago", points: "+20 SP", status: "Milestone", color: "text-badge-gold" },
  { type: "gig", icon: ArrowLeftRight, title: "3D Modeling ↔ Mobile App Dev", time: "1 week ago", points: "+45 SP", status: "Completed", color: "text-skill-green" },
  { type: "court", icon: Gavel, title: "Dispute case #4521 resolved", time: "1 week ago", points: "+10 SP", status: "Verdict", color: "text-court-blue" },
];

const gigHistory = [
  { title: "Logo Design ↔ React Development", partner: "Maya K.", date: "Mar 5, 2026", points: 30, rating: 4.9, format: "Direct Swap", status: "Completed" },
  { title: "Video Editing ↔ Copywriting", partner: "James T.", date: "Mar 2, 2026", points: 15, rating: 5.0, format: "Auction", status: "Completed" },
  { title: "3D Modeling ↔ Mobile App Dev", partner: "Carlos M.", date: "Feb 28, 2026", points: 45, rating: 4.8, format: "Co-Creation", status: "Completed" },
  { title: "SEO Strategy ↔ Graphic Design", partner: "Emma L.", date: "Feb 20, 2026", points: 10, rating: 4.6, format: "Direct Swap", status: "Completed" },
  { title: "Data Analysis ↔ Brand Identity", partner: "Raj P.", date: "Feb 15, 2026", points: 25, rating: 5.0, format: "Skill Fusion", status: "Completed" },
];

const pointsLedger = [
  { desc: "Gig completion: Logo Design", date: "Mar 5", amount: "+30", balance: 1245 },
  { desc: "Tax deduction (5%)", date: "Mar 5", amount: "-1.5", balance: 1215 },
  { desc: "Achievement: Speed Demon", date: "Mar 5", amount: "+10", balance: 1216.5 },
  { desc: "Gig completion: Video Editing", date: "Mar 2", amount: "+15", balance: 1206.5 },
  { desc: "Guild treasury contribution", date: "Mar 1", amount: "-20", balance: 1191.5 },
  { desc: "Referral bonus", date: "Feb 28", amount: "+25", balance: 1211.5 },
  { desc: "Court duty reward", date: "Feb 27", amount: "+15", balance: 1186.5 },
  { desc: "Skill Points Package", date: "Feb 25", amount: "+200", balance: 1171.5 },
];

const achievements = [
  { title: "Speed Demon", desc: "Complete a gig in under 24 hours", date: "Mar 5, 2026", icon: Zap, rarity: "Rare" },
  { title: "10 Gigs Completed", desc: "Complete your 10th gig", date: "Mar 1, 2026", icon: Trophy, rarity: "Common" },
  { title: "Court Regular", desc: "Judge 5 Skill Court cases", date: "Feb 20, 2026", icon: Shield, rarity: "Uncommon" },
  { title: "Generous Soul", desc: "Gift 50+ points to other users", date: "Feb 10, 2026", icon: Gift, rarity: "Rare" },
  { title: "First Swap", desc: "Complete your very first gig", date: "Jan 15, 2026", icon: Star, rarity: "Common" },
];

const HelpPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? activities
    : activities.filter((a) => a.type.toLowerCase() === activeFilter.toLowerCase() || (activeFilter === "Points" && a.type === "points"));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="mb-2 font-heading text-4xl font-black text-foreground sm:text-5xl">History</h1>
              <p className="text-lg text-muted-foreground">Your complete activity timeline, gig history, and points ledger.</p>
            </motion.div>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-heading text-xl font-bold text-foreground">Activity Timeline</h2>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button key={f} onClick={() => setActiveFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeFilter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                    <a.icon size={16} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-mono text-sm font-semibold ${a.color}`}>{a.points}</span>
                    <p className="text-[10px] text-muted-foreground">{a.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gig History */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Gig History</h2>
            <div className="space-y-3">
              {gigHistory.map((g, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{g.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                      <span>with {g.partner}</span>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5">{g.format}</span>
                      <span>{g.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-badge-gold text-badge-gold" />
                      <span className="font-mono text-xs text-badge-gold">{g.rating}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-skill-green">+{g.points} SP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Points Ledger */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Points Ledger</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-surface-1 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Transaction</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Balance</span>
              </div>
              {pointsLedger.map((p, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 border-b border-border/50 px-5 py-3.5 last:border-0 hover:bg-surface-1/50 transition-colors">
                  <span className="text-xs text-foreground truncate">{p.desc}</span>
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <span className={`text-right font-mono text-xs font-semibold ${p.amount.startsWith("+") ? "text-skill-green" : "text-destructive"}`}>{p.amount}</span>
                  <span className="text-right font-mono text-xs text-muted-foreground">{p.balance} SP</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quarterly Wrap Preview */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-8 text-center">
                <Calendar size={32} className="mx-auto mb-4 text-badge-gold" />
                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">Q1 2026 Wrap</h3>
                <p className="mb-4 text-sm text-muted-foreground">Your quarterly activity summary is ready! See your stats, growth, and highlights.</p>
                <motion.button className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  View Wrap <ArrowRight size={14} />
                </motion.button>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-8 text-center">
                <Trophy size={32} className="mx-auto mb-4 text-badge-gold" />
                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">2025 Year in Review</h3>
                <p className="mb-4 text-sm text-muted-foreground">Your annual deep dive with nostalgia timeline and milestone highlights.</p>
                <motion.button className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  View 2025 Wrap <ArrowRight size={14} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievement History */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Achievement History</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a, i) => (
                <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-badge-gold/10">
                      <a.icon size={18} className="text-badge-gold" />
                    </div>
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{a.rarity}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{a.title}</h3>
                  <p className="mb-2 text-xs text-muted-foreground">{a.desc}</p>
                  <span className="text-[10px] text-muted-foreground/60">Earned {a.date}</span>
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

export default HelpPage;
