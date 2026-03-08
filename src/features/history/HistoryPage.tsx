import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, Coins, ArrowLeftRight, Trophy, Shield, Globe, BarChart3,
  Activity, ArrowUp, ArrowDown, Star, Zap, Flame, Target, Clock, Calendar,
  Sparkles, Building2, GraduationCap, Bot, Scale, Layers, Timer, PieChart,
  ChevronRight, ArrowRight, Eye, Award, Lightbulb, Rocket, CheckCircle2
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

/* ═══════════════════════════════════════════
   PLATFORM-WIDE DATA
   ═══════════════════════════════════════════ */

const liveStats = [
  { label: "Total Users", value: "24,531", change: "+1,247 this month", icon: Users, color: "text-foreground", trend: "up", delta: "+5.3%" },
  { label: "Gigs Completed", value: "89,204", change: "+4,890 this month", icon: ArrowLeftRight, color: "text-skill-green", trend: "up", delta: "+5.8%" },
  { label: "Points Circulated", value: "2.4M", change: "+182K this month", icon: Coins, color: "text-badge-gold", trend: "up", delta: "+8.2%" },
  { label: "Active Guilds", value: "1,247", change: "+89 this month", icon: Users, color: "text-court-blue", trend: "up", delta: "+7.7%" },
  { label: "Avg Satisfaction", value: "4.81★", change: "+0.02 vs last month", icon: Star, color: "text-badge-gold", trend: "up", delta: "+0.4%" },
  { label: "Disputes Resolved", value: "4,821", change: "48h avg resolution", icon: Shield, color: "text-skill-green", trend: "up", delta: "+12%" },
  { label: "Universities", value: "52", change: "+4 this quarter", icon: GraduationCap, color: "text-foreground", trend: "up", delta: "+8.3%" },
  { label: "Enterprise Clients", value: "128", change: "+22 this quarter", icon: Building2, color: "text-foreground", trend: "up", delta: "+20.7%" },
];

const growthChart = [
  { month: "Apr '25", users: 4200, gigs: 8100, points: 310000 },
  { month: "Jun '25", users: 7800, gigs: 18400, points: 620000 },
  { month: "Aug '25", users: 11200, gigs: 32000, points: 980000 },
  { month: "Oct '25", users: 15400, gigs: 49000, points: 1400000 },
  { month: "Dec '25", users: 19100, gigs: 68000, points: 1900000 },
  { month: "Feb '26", users: 23200, gigs: 84300, points: 2200000 },
  { month: "Mar '26", users: 24531, gigs: 89204, points: 2400000 },
];

const formatDistribution = [
  { format: "Direct Swap", pct: 38, count: 33897, icon: ArrowLeftRight, color: "bg-foreground" },
  { format: "Auction", pct: 18, count: 16057, icon: Scale, color: "bg-court-blue" },
  { format: "Co-Creation", pct: 15, count: 13381, icon: Users, color: "bg-skill-green" },
  { format: "Flash Market", pct: 12, count: 10704, icon: Timer, color: "bg-badge-gold" },
  { format: "Skill Fusion", pct: 8, count: 7136, icon: Layers, color: "bg-destructive" },
  { format: "Projects", pct: 5, count: 4460, icon: Target, color: "bg-muted-foreground" },
  { format: "Subscription", pct: 4, count: 3569, icon: TrendingUp, color: "bg-surface-3" },
];

const trendingSkills = [
  { skill: "React / Next.js", demand: 94, growth: "+23%", gigs: 4210, avgRate: "85 SP/hr", hot: true },
  { skill: "UI/UX Design", demand: 91, growth: "+18%", gigs: 3890, avgRate: "72 SP/hr", hot: true },
  { skill: "AI/ML Engineering", demand: 88, growth: "+41%", gigs: 2140, avgRate: "120 SP/hr", hot: true },
  { skill: "Video Production", demand: 82, growth: "+15%", gigs: 2870, avgRate: "65 SP/hr", hot: false },
  { skill: "Copywriting", demand: 79, growth: "+8%", gigs: 3210, avgRate: "48 SP/hr", hot: false },
  { skill: "Data Science", demand: 76, growth: "+29%", gigs: 1890, avgRate: "95 SP/hr", hot: true },
  { skill: "3D Modeling", demand: 71, growth: "+12%", gigs: 1340, avgRate: "78 SP/hr", hot: false },
  { skill: "Mobile Dev", demand: 68, growth: "+19%", gigs: 1560, avgRate: "90 SP/hr", hot: false },
];

const economyHealth = [
  { metric: "Inflation Rate", value: "1.2%", status: "healthy", target: "< 3%", desc: "Well below target. Tax mechanism working effectively." },
  { metric: "Velocity (Monthly)", value: "3.4x", status: "healthy", target: "> 2x", desc: "Points changing hands 3.4 times/month on average." },
  { metric: "Gini Coefficient", value: "0.31", status: "healthy", target: "< 0.40", desc: "Relatively equal distribution. No hoarding detected." },
  { metric: "Active Circulation", value: "78%", status: "healthy", target: "> 60%", desc: "78% of all minted points are actively circulating." },
  { metric: "Tax Revenue", value: "120K SP", status: "neutral", target: "—", desc: "Monthly tax collected. Funds challenges and prizes." },
  { metric: "New Minting", value: "45K SP", status: "neutral", target: "—", desc: "New points entering via signups, bonuses, and events." },
];

const forecasts = [
  { period: "Q2 2026", users: "32,000", gigs: "120,000", points: "3.5M", confidence: "High", highlights: ["Mobile app launch drives 30% user growth", "Enterprise adoption accelerates", "3 new university partnerships"] },
  { period: "Q3 2026", users: "45,000", gigs: "180,000", points: "5.2M", confidence: "Medium", highlights: ["Multi-language support opens global markets", "Guild Wars Season 3 boosts engagement", "API marketplace attracts integrations"] },
  { period: "Q4 2026", users: "62,000", gigs: "260,000", points: "7.8M", confidence: "Medium", highlights: ["Projected break-even on enterprise revenue", "100 university partnerships milestone", "Skill Fusion becomes #2 format"] },
  { period: "2027", users: "120,000", gigs: "500,000+", points: "15M+", confidence: "Low", highlights: ["International expansion to 5 new regions", "Corporate training vertical launch", "Platform IPO preparation begins"] },
];

const platformMilestones = [
  { date: "Mar 2026", title: "Co-Creation Studio launches", desc: "Multi-person workspaces go live with real-time collaboration tools.", icon: Users, status: "recent" },
  { date: "Feb 2026", title: "25K total gig milestone", desc: "Platform surpasses 25,000 completed gigs with 96% satisfaction rate.", icon: Trophy, status: "recent" },
  { date: "Jan 2026", title: "Guild Wars Season 2", desc: "12 guilds compete in bracket-style tournaments with 25K SP prize pool.", icon: Flame, status: "past" },
  { date: "Dec 2025", title: "Enterprise Mode beta", desc: "First 50 companies onboarded. SOC 2 compliance achieved.", icon: Building2, status: "past" },
  { date: "Oct 2025", title: "20K users milestone", desc: "Community crosses 20,000 active users across 40 universities.", icon: Users, status: "past" },
  { date: "Sep 2025", title: "AI Quality Panel", desc: "AI-powered plagiarism detection and quality scoring deployed.", icon: Bot, status: "past" },
  { date: "Jun 2025", title: "10K users", desc: "Rapid growth from 3 university beta to 20-campus network.", icon: TrendingUp, status: "past" },
  { date: "Mar 2025", title: "Skill Court v2", desc: "Hybrid judging panel with AI analysis and expert panels.", icon: Scale, status: "past" },
  { date: "Dec 2024", title: "Guild System launched", desc: "First guilds form with shared treasuries and wars.", icon: Users, status: "past" },
  { date: "Jun 2024", title: "Public beta", desc: "500 students across 3 universities join initial beta.", icon: Rocket, status: "past" },
  { date: "Jan 2024", title: "Idea born", desc: "Two frustrated students sketch the first concept on a whiteboard.", icon: Lightbulb, status: "past" },
];

const courtStats = [
  { label: "Total Cases", value: "4,821" },
  { label: "Avg Resolution", value: "38h" },
  { label: "Satisfaction", value: "94%" },
  { label: "Appeal Rate", value: "12%" },
  { label: "AI Accuracy", value: "91%" },
  { label: "Expert Judges", value: "284" },
];

const guildLeaderboard = [
  { name: "Team Nexus", members: 24, elo: 2140, wars: 18, treasury: "14.2K SP" },
  { name: "Code Collective", members: 31, elo: 2089, wars: 16, treasury: "11.8K SP" },
  { name: "DesignOps", members: 19, elo: 1987, wars: 14, treasury: "9.4K SP" },
  { name: "DataForge", members: 15, elo: 1923, wars: 12, treasury: "7.1K SP" },
  { name: "MediaLab", members: 22, elo: 1891, wars: 11, treasury: "6.8K SP" },
];

const topUniversities = [
  { name: "MIT", users: 1240, gigs: 5800, avgElo: 1580 },
  { name: "Stanford", users: 1180, gigs: 5200, avgElo: 1545 },
  { name: "Oxford", users: 980, gigs: 4100, avgElo: 1520 },
  { name: "Cambridge", users: 870, gigs: 3600, avgElo: 1510 },
  { name: "UCLA", users: 820, gigs: 3400, avgElo: 1490 },
];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

const HistoryPage = () => {
  const [chartMetric, setChartMetric] = useState<"users" | "gigs" | "points">("users");
  const maxVal = Math.max(...growthChart.map((d) => d[chartMetric]));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* ═══ HERO ═══ */}
        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Activity size={12} className="text-skill-green" /> Platform Analytics — Live
                <span className="h-1.5 w-1.5 rounded-full bg-skill-green animate-pulse" />
              </motion.span>
              <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl lg:text-6xl mb-3">
                Platform History & <span className="text-muted-foreground">Analytics</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Real-time platform metrics, growth trends, economy health, skill demand forecasting, and historical milestones — all in one dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ LIVE STATS ═══ */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
              {liveStats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <stat.icon size={14} className={stat.color} />
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-skill-green">
                      <ArrowUp size={8} />{stat.delta}
                    </span>
                  </div>
                  <p className="font-heading text-xl font-black text-foreground leading-tight">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
                  <p className="text-[8px] text-muted-foreground/60 mt-1">{stat.change}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ GROWTH CHART ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Growth</span>
                <h2 className="font-heading text-3xl font-bold text-foreground">Platform Growth</h2>
                <p className="text-sm text-muted-foreground mt-1">Tracking key metrics from launch to present</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                {(["users", "gigs", "points"] as const).map((m) => (
                  <button key={m} onClick={() => setChartMetric(m)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${chartMetric === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {m === "users" ? "Users" : m === "gigs" ? "Gigs" : "Points"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {growthChart.map((d, i) => (
                  <motion.div
                    key={d.month}
                    className="relative flex-1 group"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d[chartMetric] / maxVal) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                  >
                    <div className="absolute inset-0 rounded-t-lg bg-foreground/70 transition-colors group-hover:bg-foreground" />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background whitespace-nowrap z-10">
                      {chartMetric === "points" ? `${(d[chartMetric] / 1000000).toFixed(1)}M` : d[chartMetric].toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                {growthChart.map((d) => (
                  <div key={d.month} className="flex-1 text-center font-mono text-[9px] text-muted-foreground">{d.month}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FORMAT DISTRIBUTION ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Distribution chart */}
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Formats</span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Gig Format Distribution</h2>
                <p className="text-xs text-muted-foreground mb-6">How platform activity breaks down across 7 formats</p>
                <div className="space-y-3">
                  {formatDistribution.map((f, i) => (
                    <motion.div key={f.format} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 flex-shrink-0">
                        <f.icon size={14} className="text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{f.format}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{f.count.toLocaleString()} · {f.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${f.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${f.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trending skills */}
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Trends</span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Trending Skills</h2>
                <p className="text-xs text-muted-foreground mb-6">Real-time skill demand index and market rates</p>
                <div className="space-y-2">
                  {trendingSkills.map((s, i) => (
                    <motion.div key={s.skill} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-muted-foreground/20 transition-all">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 font-mono text-[10px] font-black text-foreground flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{s.skill}</span>
                          {s.hot && <span className="flex items-center gap-0.5 rounded-full bg-alert-red/10 px-1.5 py-0.5 text-[8px] font-bold text-alert-red"><Flame size={8} />Hot</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[9px] text-muted-foreground">{s.gigs.toLocaleString()} gigs</span>
                          <span className="text-[9px] text-muted-foreground">{s.avgRate}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="h-1.5 w-16 rounded-full bg-surface-2 overflow-hidden mb-1">
                          <motion.div className="h-full rounded-full bg-skill-green" initial={{ width: 0 }} whileInView={{ width: `${s.demand}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.04, duration: 0.6 }} />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-skill-green">{s.growth}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ECONOMY HEALTH ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Economy</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Economy Health Monitor</h2>
              <p className="text-sm text-muted-foreground">Real-time health indicators for the Skill Points economy</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {economyHealth.map((e, i) => (
                <motion.div key={e.metric} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">{e.metric}</span>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      e.status === "healthy" ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"
                    }`}>
                      {e.status === "healthy" && <CheckCircle2 size={9} />}
                      {e.status === "healthy" ? "Healthy" : "Normal"}
                    </span>
                  </div>
                  <p className="font-heading text-3xl font-black text-foreground mb-1">{e.value}</p>
                  {e.target !== "—" && <p className="text-[10px] text-muted-foreground mb-2">Target: {e.target}</p>}
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{e.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FORECASTING ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">
                <Sparkles size={10} className="mr-1 inline text-badge-gold" />Forecasting
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Growth Projections</h2>
              <p className="text-sm text-muted-foreground">AI-powered forecasts based on current growth trajectories and planned features</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {forecasts.map((f, i) => (
                <motion.div key={f.period} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="p-5 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-heading text-lg font-black text-foreground">{f.period}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        f.confidence === "High" ? "bg-skill-green/10 text-skill-green" :
                        f.confidence === "Medium" ? "bg-badge-gold/10 text-badge-gold" :
                        "bg-surface-2 text-muted-foreground"
                      }`}>{f.confidence} confidence</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="font-mono text-sm font-bold text-foreground">{f.users}</p>
                        <p className="text-[9px] text-muted-foreground">Users</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-skill-green">{f.gigs}</p>
                        <p className="text-[9px] text-muted-foreground">Gigs</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-badge-gold">{f.points}</p>
                        <p className="text-[9px] text-muted-foreground">Points</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-1.5">
                      {f.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2 text-[10px] text-muted-foreground">
                          <ChevronRight size={9} className="mt-0.5 text-muted-foreground/50 flex-shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ GUILD LEADERBOARD + UNIVERSITY RANKINGS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Guild Leaderboard */}
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Guilds</span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Top Guilds</h2>
                <p className="text-xs text-muted-foreground mb-6">Ranked by collective ELO rating</p>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="grid grid-cols-6 gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>#</span><span className="col-span-2">Guild</span><span>ELO</span><span>Wars</span><span>Treasury</span>
                  </div>
                  {guildLeaderboard.map((g, i) => (
                    <motion.div key={g.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-6 gap-2 items-center border-b border-border/50 last:border-0 px-4 py-3 hover:bg-surface-1/50 transition-colors">
                      <span className="font-mono text-xs font-black text-foreground">{i + 1}</span>
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-foreground">{g.name}</p>
                        <p className="text-[9px] text-muted-foreground">{g.members} members</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground">{g.elo.toLocaleString()}</span>
                      <span className="font-mono text-xs text-muted-foreground">{g.wars}W</span>
                      <span className="font-mono text-[10px] text-skill-green">{g.treasury}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* University Rankings */}
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Universities</span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Top Universities</h2>
                <p className="text-xs text-muted-foreground mb-6">Ranked by active users and platform engagement</p>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>#</span><span className="col-span-2">University</span><span>Users</span><span>Avg ELO</span>
                  </div>
                  {topUniversities.map((u, i) => (
                    <motion.div key={u.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-4 py-3 hover:bg-surface-1/50 transition-colors">
                      <span className="font-mono text-xs font-black text-foreground">{i + 1}</span>
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-foreground">{u.name}</p>
                        <p className="text-[9px] text-muted-foreground">{u.gigs.toLocaleString()} gigs</p>
                      </div>
                      <span className="font-mono text-xs text-foreground">{u.users.toLocaleString()}</span>
                      <span className="font-mono text-xs text-badge-gold">{u.avgElo.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ COURT ANALYTICS ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Justice</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Skill Court Analytics</h2>
              <p className="text-sm text-muted-foreground">Dispute resolution performance across the platform</p>
            </motion.div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {courtStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PLATFORM MILESTONES TIMELINE ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Timeline</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Platform Milestones</h2>
              <p className="text-sm text-muted-foreground">Every major moment in SkillSwappr's history</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />
              {platformMilestones.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`relative mb-6 flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`hidden flex-1 md:block ${i % 2 === 0 ? "text-right" : ""}`}>
                    <div className={`rounded-xl border bg-card p-4 inline-block max-w-xs ${i % 2 === 0 ? "ml-auto" : "mr-auto"} ${m.status === "recent" ? "border-skill-green/20" : "border-border"}`}>
                      <div className={`flex items-center gap-2 mb-1 ${i % 2 === 0 ? "justify-end" : ""}`}>
                        <span className="font-mono text-[10px] text-muted-foreground">{m.date}</span>
                        {m.status === "recent" && <span className="rounded-full bg-skill-green/10 px-1.5 py-0.5 text-[8px] font-bold text-skill-green">New</span>}
                      </div>
                      <h4 className="text-xs font-bold text-foreground mb-0.5">{m.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                    </div>
                  </div>

                  <div className="absolute left-6 z-10 -translate-x-1/2 md:left-1/2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-card ${m.status === "recent" ? "border-skill-green" : "border-border"}`}>
                      <m.icon size={14} className="text-foreground" />
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" />

                  <div className="md:hidden ml-14">
                    <div className={`rounded-xl border bg-card p-3 ${m.status === "recent" ? "border-skill-green/20" : "border-border"}`}>
                      <span className="font-mono text-[9px] text-muted-foreground">{m.date}</span>
                      <h4 className="text-xs font-bold text-foreground">{m.title}</h4>
                      <p className="text-[9px] text-muted-foreground">{m.desc}</p>
                    </div>
                  </div>
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

export default HistoryPage;
