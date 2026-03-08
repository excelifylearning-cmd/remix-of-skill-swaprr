import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ArrowLeftRight, Trophy, Shield, Users, Coins, TrendingUp,
  Calendar, Star, Zap, Gift, Gavel, ArrowRight, Flame, Target,
  BarChart3, Eye, Award, CheckCircle2, Activity, ChevronRight,
  ArrowUp, ArrowDown, PieChart, Sparkles
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

/* ─── Mock Data ─── */

const overviewStats = [
  { label: "Total Gigs", value: "47", change: "+8 this month", icon: ArrowLeftRight, color: "text-skill-green", trend: "up" },
  { label: "Points Earned", value: "3,245", change: "+430 this month", icon: Coins, color: "text-badge-gold", trend: "up" },
  { label: "Avg Rating", value: "4.92", change: "+0.03", icon: Star, color: "text-badge-gold", trend: "up" },
  { label: "Current Streak", value: "14 days", change: "Personal best!", icon: Flame, color: "text-destructive", trend: "up" },
  { label: "ELO Rating", value: "1,640", change: "+45 this season", icon: Target, color: "text-court-blue", trend: "up" },
  { label: "Lifetime Tier", value: "Silver", change: "53/100 to Gold", icon: Trophy, color: "text-muted-foreground", trend: "up" },
];

const monthlyChart = [
  { month: "Oct", gigs: 3, points: 180 },
  { month: "Nov", gigs: 5, points: 310 },
  { month: "Dec", gigs: 4, points: 240 },
  { month: "Jan", gigs: 7, points: 520 },
  { month: "Feb", gigs: 9, points: 680 },
  { month: "Mar", gigs: 8, points: 430 },
];

const filters = ["All", "Gigs", "Points", "Achievements", "Court", "Guild"];

const activities = [
  { type: "gig", icon: ArrowLeftRight, title: "Logo Design ↔ React Development", time: "2 hours ago", points: "+30 SP", status: "Completed", color: "text-skill-green", partner: "Maya K.", format: "Direct Swap", txCode: "TX-8291" },
  { type: "achievement", icon: Trophy, title: "Unlocked: Speed Demon Badge", time: "5 hours ago", points: "+10 SP", status: "Achievement", color: "text-badge-gold", partner: "", format: "", txCode: "" },
  { type: "points", icon: Coins, title: "Daily streak bonus (Day 14)", time: "8 hours ago", points: "+5 SP", status: "Bonus", color: "text-skill-green", partner: "", format: "", txCode: "" },
  { type: "court", icon: Shield, title: "Served as Skill Court Judge — Case #4891", time: "Yesterday", points: "+15 SP", status: "Judged", color: "text-court-blue", partner: "", format: "", txCode: "SC-4891" },
  { type: "guild", icon: Users, title: "Contributed to Guild Treasury — Team Nexus", time: "2 days ago", points: "-20 SP", status: "Contributed", color: "text-muted-foreground", partner: "", format: "", txCode: "" },
  { type: "gig", icon: ArrowLeftRight, title: "Video Editing ↔ Copywriting", time: "3 days ago", points: "+15 SP", status: "Completed", color: "text-skill-green", partner: "James T.", format: "Auction", txCode: "TX-8156" },
  { type: "points", icon: Coins, title: "Referral bonus: Sarah joined!", time: "4 days ago", points: "+25 SP", status: "Referral", color: "text-skill-green", partner: "", format: "", txCode: "" },
  { type: "achievement", icon: Trophy, title: "Unlocked: Court Regular Badge", time: "5 days ago", points: "+20 SP", status: "Milestone", color: "text-badge-gold", partner: "", format: "", txCode: "" },
  { type: "gig", icon: ArrowLeftRight, title: "3D Modeling ↔ Mobile App Dev", time: "1 week ago", points: "+45 SP", status: "Completed", color: "text-skill-green", partner: "Carlos M.", format: "Co-Creation", txCode: "TX-7903" },
  { type: "court", icon: Gavel, title: "Dispute case #4521 resolved in your favor", time: "1 week ago", points: "+10 SP", status: "Won", color: "text-court-blue", partner: "", format: "", txCode: "SC-4521" },
  { type: "gig", icon: ArrowLeftRight, title: "SEO Strategy ↔ Graphic Design", time: "2 weeks ago", points: "+10 SP", status: "Completed", color: "text-skill-green", partner: "Emma L.", format: "Direct Swap", txCode: "TX-7745" },
  { type: "points", icon: Coins, title: "Skill Points Package purchased", time: "2 weeks ago", points: "+200 SP", status: "Purchased", color: "text-skill-green", partner: "", format: "", txCode: "" },
];

const gigHistory = [
  { title: "Logo Design ↔ React Development", partner: "Maya K.", partnerAvatar: "MK", date: "Mar 5, 2026", points: 30, rating: 4.9, format: "Direct Swap", status: "Completed", duration: "18h", messages: 24, revisions: 1 },
  { title: "Video Editing ↔ Copywriting", partner: "James T.", partnerAvatar: "JT", date: "Mar 2, 2026", points: 15, rating: 5.0, format: "Auction", status: "Completed", duration: "2d", messages: 31, revisions: 2 },
  { title: "3D Modeling ↔ Mobile App Dev", partner: "Carlos M.", partnerAvatar: "CM", date: "Feb 28, 2026", points: 45, rating: 4.8, format: "Co-Creation", status: "Completed", duration: "5d", messages: 87, revisions: 3 },
  { title: "SEO Strategy ↔ Graphic Design", partner: "Emma L.", partnerAvatar: "EL", date: "Feb 20, 2026", points: 10, rating: 4.6, format: "Direct Swap", status: "Completed", duration: "12h", messages: 11, revisions: 0 },
  { title: "Data Analysis ↔ Brand Identity", partner: "Raj P.", partnerAvatar: "RP", date: "Feb 15, 2026", points: 25, rating: 5.0, format: "Skill Fusion", status: "Completed", duration: "3d", messages: 52, revisions: 2 },
];

const pointsLedger = [
  { desc: "Gig: Logo Design ↔ React Dev", date: "Mar 5", amount: "+30", balance: 1245, category: "Gig" },
  { desc: "Tax deduction (5%)", date: "Mar 5", amount: "-1.5", balance: 1215, category: "Tax" },
  { desc: "Badge: Speed Demon", date: "Mar 5", amount: "+10", balance: 1216.5, category: "Achievement" },
  { desc: "Streak bonus (Day 14)", date: "Mar 5", amount: "+5", balance: 1221.5, category: "Bonus" },
  { desc: "Gig: Video Editing ↔ Copywriting", date: "Mar 2", amount: "+15", balance: 1206.5, category: "Gig" },
  { desc: "Guild treasury — Team Nexus", date: "Mar 1", amount: "-20", balance: 1191.5, category: "Guild" },
  { desc: "Referral: Sarah joined", date: "Feb 28", amount: "+25", balance: 1211.5, category: "Referral" },
  { desc: "Court duty — Case #4521", date: "Feb 27", amount: "+15", balance: 1186.5, category: "Court" },
  { desc: "Points Package (Builder)", date: "Feb 25", amount: "+200", balance: 1171.5, category: "Purchase" },
  { desc: "Gig: 3D Modeling ↔ Mobile Dev", date: "Feb 24", amount: "+45", balance: 971.5, category: "Gig" },
];

const achievements = [
  { title: "Speed Demon", desc: "Complete a gig in under 24h", date: "Mar 5, 2026", icon: Zap, rarity: "Rare", benefit: "Priority listing" },
  { title: "Court Regular", desc: "Judge 5 Skill Court cases", date: "Mar 1, 2026", icon: Shield, rarity: "Uncommon", benefit: "-0.5% tax" },
  { title: "10 Gigs Completed", desc: "Complete your 10th gig", date: "Feb 20, 2026", icon: Trophy, rarity: "Common", benefit: "+10 SP" },
  { title: "Generous Soul", desc: "Gift 50+ SP to others", date: "Feb 10, 2026", icon: Gift, rarity: "Rare", benefit: "Gift badge" },
  { title: "First Swap", desc: "Complete your very first gig", date: "Jan 15, 2026", icon: Star, rarity: "Common", benefit: "Profile badge" },
  { title: "Guild Member", desc: "Join your first guild", date: "Jan 10, 2026", icon: Users, rarity: "Common", benefit: "Guild access" },
];

const skillBreakdown = [
  { skill: "UI/UX Design", gigs: 18, earned: 1240, avgRating: 4.95, color: "bg-court-blue" },
  { skill: "React Development", gigs: 12, earned: 890, avgRating: 4.88, color: "bg-skill-green" },
  { skill: "Video Editing", gigs: 9, earned: 520, avgRating: 4.7, color: "bg-badge-gold" },
  { skill: "Copywriting", gigs: 5, earned: 340, avgRating: 4.9, color: "bg-foreground" },
  { skill: "Data Analysis", gigs: 3, earned: 255, avgRating: 5.0, color: "bg-destructive" },
];

const rarityColor = (r: string) => {
  if (r === "Legendary") return "bg-badge-gold/10 text-badge-gold";
  if (r === "Epic") return "bg-court-blue/10 text-court-blue";
  if (r === "Rare") return "bg-skill-green/10 text-skill-green";
  return "bg-surface-2 text-muted-foreground";
};

const categoryColor = (c: string) => {
  if (c === "Gig") return "text-skill-green";
  if (c === "Tax") return "text-destructive";
  if (c === "Achievement" || c === "Bonus") return "text-badge-gold";
  if (c === "Court") return "text-court-blue";
  if (c === "Guild") return "text-muted-foreground";
  if (c === "Referral") return "text-skill-green";
  return "text-foreground";
};

/* ─── Component ─── */

const HistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"timeline" | "gigs" | "ledger">("timeline");

  const filtered = activeFilter === "All"
    ? activities
    : activities.filter((a) => a.type.toLowerCase() === activeFilter.toLowerCase() || (activeFilter === "Points" && a.type === "points"));

  const maxGigs = Math.max(...monthlyChart.map((m) => m.gigs));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-12">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Activity size={10} className="mr-1 inline text-skill-green" /> Your Dashboard
                  </motion.span>
                  <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl">Activity History</h1>
                  <p className="mt-2 text-muted-foreground">Track every gig, point, badge, and milestone in one place.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                  <Coins size={16} className="text-badge-gold" />
                  <div>
                    <p className="font-heading text-xl font-black text-foreground">1,245 SP</p>
                    <p className="text-[10px] text-muted-foreground">Current Balance</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {overviewStats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <ArrowUp size={12} className="text-skill-green" />
                  </div>
                  <p className="font-heading text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-[10px] font-medium text-skill-green">{stat.change}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Performance Chart */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Monthly Performance</h2>
                <p className="text-xs text-muted-foreground">Gigs completed per month — last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground" /> Gigs</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-skill-green" /> Points</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-3" style={{ height: 160 }}>
                {monthlyChart.map((m, i) => (
                  <motion.div key={m.month} initial={{ height: 0 }} whileInView={{ height: `${(m.gigs / maxGigs) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="relative flex-1 group">
                    <div className="absolute inset-0 rounded-t-lg bg-foreground/80 transition-colors group-hover:bg-foreground" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-foreground px-2 py-1 text-[10px] font-bold text-background whitespace-nowrap">
                      {m.gigs} gigs · {m.points} SP
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                {monthlyChart.map((m) => (
                  <div key={m.month} className="flex-1 text-center font-mono text-[10px] text-muted-foreground">{m.month}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skill Breakdown */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Skill Breakdown</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {skillBreakdown.map((s, i) => (
                <motion.div key={s.skill} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
                  <div className={`mb-3 h-1 w-8 rounded-full ${s.color}`} />
                  <h4 className="mb-3 text-sm font-medium text-foreground">{s.skill}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Gigs</span>
                      <span className="font-mono text-xs font-bold text-foreground">{s.gigs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Earned</span>
                      <span className="font-mono text-xs font-bold text-skill-green">{s.earned} SP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Rating</span>
                      <span className="flex items-center gap-0.5 font-mono text-xs font-bold text-badge-gold">
                        <Star size={9} className="fill-badge-gold" />{s.avgRating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            {/* Tabs */}
            <div className="mb-6 flex items-center gap-1 rounded-xl border border-border bg-card p-1 w-fit">
              {[
                { id: "timeline" as const, label: "Activity Timeline", icon: Activity },
                { id: "gigs" as const, label: "Gig History", icon: ArrowLeftRight },
                { id: "ledger" as const, label: "Points Ledger", icon: Coins },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Timeline */}
              {activeTab === "timeline" && (
                <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {filters.map((f) => (
                      <button key={f} onClick={() => setActiveFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeFilter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="relative space-y-0">
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border" />
                    {filtered.map((a, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative flex items-start gap-4 py-3">
                        <div className="relative z-10 flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                          <a.icon size={16} className="text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{a.title}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">{a.time}</span>
                                {a.partner && <span className="text-[10px] text-muted-foreground">with {a.partner}</span>}
                                {a.format && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">{a.format}</span>}
                                {a.txCode && <span className="font-mono text-[9px] text-muted-foreground/60">{a.txCode}</span>}
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className={`font-mono text-sm font-bold ${a.color}`}>{a.points}</span>
                              <p className="text-[10px] text-muted-foreground">{a.status}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Gig History */}
              {activeTab === "gigs" && (
                <motion.div key="gigs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                  {gigHistory.map((g, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 font-heading text-xs font-bold text-foreground">{g.partnerAvatar}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{g.title}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">with {g.partner}</span>
                              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">{g.format}</span>
                              <span className="text-[10px] text-muted-foreground">{g.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="font-mono text-xs font-bold text-foreground">{g.duration}</p>
                              <p className="text-[9px] text-muted-foreground">Duration</p>
                            </div>
                            <div>
                              <p className="font-mono text-xs font-bold text-foreground">{g.messages}</p>
                              <p className="text-[9px] text-muted-foreground">Messages</p>
                            </div>
                            <div>
                              <p className="font-mono text-xs font-bold text-foreground">{g.revisions}</p>
                              <p className="text-[9px] text-muted-foreground">Revisions</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-badge-gold text-badge-gold" />
                            <span className="font-mono text-xs font-bold text-badge-gold">{g.rating}</span>
                          </div>
                          <span className="font-mono text-sm font-bold text-skill-green">+{g.points} SP</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Points Ledger */}
              {activeTab === "ledger" && (
                <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="grid grid-cols-5 gap-4 border-b border-border bg-surface-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="col-span-2">Transaction</span>
                      <span>Category</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Balance</span>
                    </div>
                    {pointsLedger.map((p, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="grid grid-cols-5 items-center gap-4 border-b border-border/50 px-5 py-3.5 last:border-0 hover:bg-surface-1/50 transition-colors">
                        <div className="col-span-2">
                          <span className="text-xs text-foreground">{p.desc}</span>
                          <p className="text-[10px] text-muted-foreground">{p.date}</p>
                        </div>
                        <span className={`text-[10px] font-medium ${categoryColor(p.category)}`}>{p.category}</span>
                        <span className={`text-right font-mono text-xs font-bold ${p.amount.startsWith("+") ? "text-skill-green" : "text-destructive"}`}>
                          {p.amount} SP
                        </span>
                        <span className="text-right font-mono text-xs text-muted-foreground">{p.balance} SP</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Achievements</h2>
                <p className="text-xs text-muted-foreground">{achievements.length} badges earned</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award size={14} className="text-badge-gold" />
                <span>Next: <span className="font-medium text-foreground">Streak Master</span> — 16 days left</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a, i) => (
                <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-badge-gold/10">
                      <a.icon size={18} className="text-badge-gold" />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${rarityColor(a.rarity)}`}>{a.rarity}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{a.title}</h3>
                  <p className="mb-2 text-[11px] text-muted-foreground">{a.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/60">Earned {a.date}</span>
                    <span className="rounded-md bg-skill-green/5 px-2 py-0.5 text-[9px] font-medium text-skill-green">⚡ {a.benefit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quarterly Wraps */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-6 text-center font-heading text-xl font-bold text-foreground">Your Wraps</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-badge-gold/10 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar size={20} className="text-badge-gold" />
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">Q1 2026 Wrap</h3>
                      <p className="text-[10px] text-muted-foreground">Jan — Mar 2026</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-foreground">24</p>
                      <p className="text-[9px] text-muted-foreground">Gigs</p>
                    </div>
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-skill-green">1,430</p>
                      <p className="text-[9px] text-muted-foreground">SP Earned</p>
                    </div>
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-badge-gold">4.92</p>
                      <p className="text-[9px] text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-5 pt-2">
                  <motion.button className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    View Full Wrap <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-court-blue/10 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles size={20} className="text-court-blue" />
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">2025 Year in Review</h3>
                      <p className="text-[10px] text-muted-foreground">Your annual highlights</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-foreground">47</p>
                      <p className="text-[9px] text-muted-foreground">Total Gigs</p>
                    </div>
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-skill-green">3,245</p>
                      <p className="text-[9px] text-muted-foreground">SP Earned</p>
                    </div>
                    <div className="rounded-lg bg-card p-2.5 text-center">
                      <p className="font-heading text-lg font-black text-badge-gold">6</p>
                      <p className="text-[9px] text-muted-foreground">Badges</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-5 pt-2">
                  <motion.button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    View 2025 Wrap <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default HistoryPage;
