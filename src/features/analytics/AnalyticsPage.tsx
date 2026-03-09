import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, Coins, ArrowLeftRight, Trophy, Shield, Globe,
  Activity, ArrowUp, ArrowDown, Star, Flame, Clock, Calendar,
  Sparkles, Building2, GraduationCap, Scale, Layers, Timer,
  CheckCircle2, Heart, MessageSquare, BookOpen, Crown, Video,
  Server, DollarSign, Palette, Code, ThumbsUp, FileText, TrendingDown,
  Download, Zap, Target, Percent, AlertTriangle, RefreshCw, Eye,
  BarChart3, PieChart, LineChart, Map, Banknote, Gauge, Lock
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { useLiveAnalytics } from "./hooks/useLiveAnalytics";
import { useForecasting } from "./hooks/useForecasting";
import MetricCard from "./components/MetricCard";
import ForecastChart from "./components/ForecastChart";
import RetentionHeatmap from "./components/RetentionHeatmap";
import FunnelVisualization from "./components/FunnelVisualization";
import SectionNav from "./components/SectionNav";

const sections = [
  { id: "hero", label: "Command Center" },
  { id: "activity-feed", label: "Live Activity" },
  { id: "executive-summary", label: "Executive Summary" },
  { id: "revenue-intelligence", label: "Revenue Intelligence" },
  { id: "funnel", label: "Acquisition Funnel" },
  { id: "forecasting", label: "Growth Forecasting" },
  { id: "quarterly", label: "Quarterly Deep Dive" },
  { id: "cohort", label: "Cohort Retention" },
  { id: "geographic", label: "Geographic" },
  { id: "economy", label: "Skill Economy" },
  { id: "marketplace", label: "Marketplace Health" },
  { id: "guilds", label: "Guild Analytics" },
  { id: "university", label: "University Network" },
  { id: "enterprise", label: "Enterprise Metrics" },
  { id: "content", label: "Content & Engagement" },
  { id: "platform", label: "Platform Performance" },
  { id: "ai-quality", label: "AI Quality Metrics" },
  { id: "behavioral", label: "Behavioral Analytics" },
  { id: "revenue-forecast", label: "Revenue Forecast" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "risk", label: "Risk & Compliance" },
  { id: "hall-of-fame", label: "Hall of Fame" },
  { id: "export", label: "Data Export" },
];

const AnalyticsPage = () => {
  const [activeQuarter, setActiveQuarter] = useState("q1-2026");
  const [chartMetric, setChartMetric] = useState<"users" | "gigs">("users");
  const { metrics, quarters, telemetry, activityFeed, guildStats, profileStats, listingStats, disputeStats, enterpriseStats, funnelData, loading } = useLiveAnalytics();
  const { userForecast, gigForecast, revenueForecast, userScenarios, revenueScenarios } = useForecasting(quarters);

  const m = metrics;
  const currentQuarter = quarters.find((q) => q.id === activeQuarter) || quarters[0];
  const growthTimeline = quarters.flatMap((q: any) => (q.monthlyBreakdown || []).map((mb: any) => ({ month: mb.month, users: mb.users, gigs: mb.gigs })));
  const maxVal = Math.max(...growthTimeline.map((d: any) => d[chartMetric] || 0), 1);

  const economyHealth = m?.economy_health ? (m.economy_health as any[]) : [];
  const retentionData = m?.retention_data ? (m.retention_data as any) : null;
  const communityImpact = m?.community_impact ? (m.community_impact as any[]) : [];
  const platformUptime = m?.platform_uptime ? (m.platform_uptime as any[]) : [];
  const hallOfFame = m?.hall_of_fame ? (m.hall_of_fame as any[]) : [];
  const contentMetrics = m?.content_metrics ? (m.content_metrics as any[]) : [];
  const revenueBreakdown = m?.revenue_breakdown ? (m.revenue_breakdown as any[]) : [];
  const formatDistribution = m?.format_distribution ? (m.format_distribution as any[]) : [];

  const EmptyCard = ({ msg }: { msg: string }) => (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <Activity size={28} className="mx-auto mb-3 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">{msg}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Run the seed function to populate data</p>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backLabel="Analytics" />
        <SectionNav sections={sections} />

        {/* 1. COMMAND CENTER HERO */}
        <section id="hero" className="pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full border border-skill-green/30 bg-skill-green/10 px-4 py-1.5 font-mono text-xs text-skill-green">
                  <span className="h-2 w-2 rounded-full bg-skill-green animate-pulse" />
                  Systems Operational
                </motion.span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl lg:text-6xl mb-3">
                Analytics <span className="text-muted-foreground">Command Center</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Enterprise-grade analytics, forecasting, and real-time metrics for platform intelligence.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-border bg-card px-4 py-2 flex items-center gap-2">
                  <Users size={14} className="text-foreground" />
                  <span className="font-mono text-sm font-bold text-foreground">{profileStats.total.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Users</span>
                </div>
                <div className="rounded-xl border border-border bg-card px-4 py-2 flex items-center gap-2">
                  <ArrowLeftRight size={14} className="text-skill-green" />
                  <span className="font-mono text-sm font-bold text-foreground">{listingStats.total.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Listings</span>
                </div>
                <div className="rounded-xl border border-border bg-card px-4 py-2 flex items-center gap-2">
                  <Trophy size={14} className="text-badge-gold" />
                  <span className="font-mono text-sm font-bold text-foreground">{guildStats.total.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Guilds</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. REAL-TIME ACTIVITY FEED */}
        <section id="activity-feed" className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity size={20} className="text-skill-green" /> Live Activity Feed
            </h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="bg-surface-2 px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Recent Platform Events</span>
                <span className="flex items-center gap-1.5 text-[10px] text-skill-green font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-skill-green animate-pulse" /> Live
                </span>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {activityFeed.length > 0 ? activityFeed.slice(0, 15).map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between border-b border-border/50 last:border-0 px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-foreground/30" />
                      <span className="text-xs text-foreground">{a.message}</span>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </motion.div>
                )) : (
                  <p className="px-5 py-8 text-center text-xs text-muted-foreground">No recent activity. Events will appear here as users interact with the platform.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. EXECUTIVE SUMMARY CARDS */}
        <section id="executive-summary" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Executive Summary</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
              <MetricCard label="Total Users" value={m?.total_users || profileStats.total} icon={Users} trend="up" trendValue={`+${m?.monthly_signups || 0}`} delay={0} />
              <MetricCard label="Active Gigs" value={listingStats.total} icon={ArrowLeftRight} trend="up" trendValue="+12%" delay={0.05} />
              <MetricCard label="SP Circulated" value={`${((m?.points_circulated || 0) / 1000000).toFixed(1)}M`} suffix="" icon={Coins} delay={0.1} animate={false} />
              <MetricCard label="Guilds" value={guildStats.total} icon={Trophy} delay={0.15} />
              <MetricCard label="Satisfaction" value={`${(m?.avg_satisfaction || 0).toFixed(1)}★`} suffix="" icon={Star} delay={0.2} animate={false} />
              <MetricCard label="Universities" value={m?.universities || 0} icon={GraduationCap} delay={0.25} />
              <MetricCard label="Enterprise" value={m?.enterprise_clients || enterpriseStats.projects} icon={Building2} delay={0.3} />
              <MetricCard label="Disputes" value={disputeStats.resolved} suffix={`/${disputeStats.total}`} icon={Shield} trend={disputeStats.pending > 0 ? "neutral" : "up"} delay={0.35} animate={false} />
            </div>
            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
              <MetricCard label="Avg User SP" value={profileStats.avgSP} icon={Coins} size="sm" delay={0.4} />
              <MetricCard label="Avg ELO" value={profileStats.avgElo} icon={Gauge} size="sm" delay={0.45} />
              <MetricCard label="Avg Rating" value={`${listingStats.avgRating}★`} suffix="" icon={Star} size="sm" delay={0.5} animate={false} />
              <MetricCard label="Hot Listings" value={listingStats.hotCount} icon={Flame} size="sm" delay={0.55} />
              <MetricCard label="Guild SP Pool" value={`${(guildStats.totalSP / 1000).toFixed(0)}k`} suffix="" icon={Banknote} size="sm" delay={0.6} animate={false} />
              <MetricCard label="Avg Guild ELO" value={guildStats.avgElo} icon={Trophy} size="sm" delay={0.65} />
            </div>
          </div>
        </section>

        {/* 4. REVENUE INTELLIGENCE */}
        <section id="revenue-intelligence" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Revenue Intelligence</h2>
            <p className="text-sm text-muted-foreground mb-8">MRR tracking, revenue by source, and growth rate analysis</p>
            {revenueBreakdown.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  {revenueBreakdown.map((r: any, i: number) => {
                    const Icon = r.source?.includes("Enterprise") ? Building2 : r.source?.includes("Premium") ? Crown : r.source?.includes("Transaction") ? ArrowLeftRight : GraduationCap;
                    return (
                      <motion.div key={r.source} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2"><Icon size={18} className="text-foreground" /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-foreground">{r.source}</span>
                            <span className="font-mono text-sm font-bold text-foreground">{r.amount}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }} />
                          </div>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground w-10 text-right">{r.pct}%</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><DollarSign size={14} /> Revenue Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-surface-1 p-4">
                      <p className="font-mono text-2xl font-black text-foreground">{m?.monthly_revenue || "$0"}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Monthly Revenue</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-4">
                      <p className="font-mono text-2xl font-black text-skill-green">+18.5%</p>
                      <p className="text-[10px] text-muted-foreground mt-1">MoM Growth</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-4">
                      <p className="font-mono text-2xl font-black text-foreground">$127</p>
                      <p className="text-[10px] text-muted-foreground mt-1">ARPU</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-4">
                      <p className="font-mono text-2xl font-black text-badge-gold">$840</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Est. LTV</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : <EmptyCard msg="No revenue data yet" />}
          </div>
        </section>

        {/* 5. USER ACQUISITION FUNNEL */}
        <section id="funnel" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">User Acquisition Funnel</h2>
            <p className="text-sm text-muted-foreground mb-8">Visit → Signup → First Gig → Repeat → Power User</p>
            <FunnelVisualization steps={funnelData} />
          </div>
        </section>

        {/* 6. GROWTH FORECASTING */}
        <section id="forecasting" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Growth Forecasting</h2>
            <p className="text-sm text-muted-foreground mb-8">12-month projections with confidence intervals and scenario modeling</p>
            <div className="grid gap-6 lg:grid-cols-2">
              <ForecastChart data={userForecast} title="User Growth Forecast" showConfidence />
              <ForecastChart scenarios={userScenarios} title="User Growth Scenarios" height={300} />
            </div>
          </div>
        </section>

        {/* 7. QUARTERLY DEEP DIVE */}
        {quarters.length > 0 && (
          <section id="quarterly" className="bg-surface-1 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground"><Calendar size={10} className="inline mr-1" />Quarterly Reports</span>
                  <h2 className="font-heading text-3xl font-bold text-foreground">Quarterly Deep Dive</h2>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                  {quarters.map((q) => (
                    <button key={q.id} onClick={() => setActiveQuarter(q.id)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeQuarter === q.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                      {q.label}{q.status === "projected" && <span className="ml-1 text-[8px] opacity-60">*</span>}
                    </button>
                  ))}
                </div>
              </div>

              {currentQuarter && (
                <AnimatePresence mode="wait">
                  <motion.div key={currentQuarter.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">{currentQuarter.period}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${currentQuarter.status === "current" ? "bg-skill-green/10 text-skill-green border border-skill-green/20" : "bg-badge-gold/10 text-badge-gold border border-badge-gold/20"}`}>
                        {currentQuarter.status === "current" ? "Current Quarter" : "Projected"}
                      </span>
                    </div>

                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
                      {[
                        { label: "Users", value: currentQuarter.kpis?.users?.toLocaleString() || "0", icon: Users },
                        { label: "Gigs", value: currentQuarter.kpis?.gigs?.toLocaleString() || "0", icon: ArrowLeftRight },
                        { label: "Points", value: currentQuarter.kpis?.points ? `${(currentQuarter.kpis.points / 1000000).toFixed(1)}M` : "0", icon: Coins },
                        { label: "Revenue", value: currentQuarter.kpis?.revenue || "$0", icon: DollarSign },
                        { label: "Guilds", value: currentQuarter.kpis?.guilds?.toLocaleString() || "0", icon: Trophy },
                        { label: "Universities", value: String(currentQuarter.kpis?.universities || 0), icon: GraduationCap },
                      ].map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
                          <kpi.icon size={14} className="text-muted-foreground mb-1.5" />
                          <p className="font-heading text-xl font-black text-foreground">{kpi.value}</p>
                          <p className="text-[9px] text-muted-foreground">{kpi.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><TrendingUp size={14} /> Growth Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "User Growth", value: currentQuarter.growth?.userGrowth || "—" },
                            { label: "Gig Growth", value: currentQuarter.growth?.gigGrowth || "—" },
                            { label: "Revenue Growth", value: currentQuarter.growth?.revenueGrowth || "—" },
                            { label: "Retention Rate", value: currentQuarter.growth?.retentionRate || "—" },
                          ].map((g) => (
                            <div key={g.label} className="rounded-xl bg-surface-1 p-3">
                              <p className="font-heading text-xl font-black text-skill-green">{g.value}</p>
                              <p className="text-[9px] text-muted-foreground">{g.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles size={14} className="text-badge-gold" /> Key Highlights</h3>
                        <ul className="space-y-2.5">
                          {(currentQuarter.highlights || []).map((h: string, j: number) => (
                            <li key={j} className="flex items-start gap-2.5 text-xs text-muted-foreground"><CheckCircle2 size={12} className="mt-0.5 text-skill-green flex-shrink-0" />{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </section>
        )}

        {/* 8. COHORT RETENTION MATRIX */}
        <section id="cohort" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Cohort Retention Matrix</h2>
            <p className="text-sm text-muted-foreground mb-8">Visual heatmap of retention by signup month</p>
            {retentionData?.cohorts ? (
              <RetentionHeatmap cohorts={retentionData.cohorts} />
            ) : (
              <EmptyCard msg="No cohort data available" />
            )}
          </div>
        </section>

        {/* 9. GEOGRAPHIC DISTRIBUTION */}
        <section id="geographic" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2 flex items-center gap-2"><Map size={24} /> Geographic Distribution</h2>
            <p className="text-sm text-muted-foreground mb-8">User distribution by region</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { region: "North America", pct: 42, users: "18.2k", growth: "+15%" },
                { region: "Europe", pct: 28, users: "12.1k", growth: "+22%" },
                { region: "Asia Pacific", pct: 18, users: "7.8k", growth: "+38%" },
                { region: "Latin America", pct: 12, users: "5.2k", growth: "+31%" },
              ].map((r, i) => (
                <motion.div key={r.region} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">{r.region}</span>
                    <span className="font-mono text-xs text-skill-green font-bold">{r.growth}</span>
                  </div>
                  <p className="font-heading text-3xl font-black text-foreground">{r.pct}%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{r.users} users</p>
                  <div className="mt-3 h-2 rounded-full bg-surface-2 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. SKILL ECONOMY DASHBOARD */}
        <section id="economy" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Skill Economy Dashboard</h2>
            <p className="text-sm text-muted-foreground mb-8">SP velocity, inflation index, treasury health</p>
            {economyHealth.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {economyHealth.map((e: any, i: number) => (
                  <motion.div key={e.metric} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-muted-foreground">{e.metric}</span>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${e.status === "healthy" ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"}`}>
                        {e.status === "healthy" && <CheckCircle2 size={9} />}{e.status === "healthy" ? "Healthy" : "Normal"}
                      </span>
                    </div>
                    <p className="font-heading text-3xl font-black text-foreground mb-1">{e.value}</p>
                    {e.target && e.target !== "—" && <p className="text-[10px] text-muted-foreground mb-2">Target: {e.target}</p>}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{e.desc}</p>
                  </motion.div>
                ))}
              </div>
            ) : <EmptyCard msg="No economy health data" />}
          </div>
        </section>

        {/* 11. MARKETPLACE HEALTH */}
        <section id="marketplace" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Marketplace Health</h2>
            {formatDistribution.length > 0 ? (
              <div className="space-y-3">
                {formatDistribution.map((f: any, i: number) => {
                  const Icon = f.format === "Direct Swap" ? ArrowLeftRight : f.format === "Auction" ? Scale : f.format === "Co-Creation" ? Users : Timer;
                  return (
                    <motion.div key={f.format} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2"><Icon size={14} className="text-foreground" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{f.format}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{f.count?.toLocaleString()} · {f.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                          <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} whileInView={{ width: `${f.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : <EmptyCard msg="No format distribution data" />}
          </div>
        </section>

        {/* 12. GUILD ANALYTICS */}
        <section id="guilds" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><Trophy size={24} className="text-badge-gold" /> Guild Analytics</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <MetricCard label="Total Guilds" value={guildStats.total} icon={Trophy} size="lg" />
              <MetricCard label="Total SP Pool" value={`${(guildStats.totalSP / 1000).toFixed(0)}k`} suffix="" icon={Coins} size="lg" animate={false} />
              <MetricCard label="Average ELO" value={guildStats.avgElo} icon={Gauge} size="lg" />
              <MetricCard label="Guild Wars" value={guildStats.totalWars} icon={Zap} size="lg" />
            </div>
          </div>
        </section>

        {/* 13. UNIVERSITY NETWORK */}
        <section id="university" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><GraduationCap size={24} /> University Network</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <GraduationCap size={28} className="mx-auto mb-3 text-foreground" />
                <p className="font-heading text-4xl font-black text-foreground">{m?.universities || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Partner Universities</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <Users size={28} className="mx-auto mb-3 text-skill-green" />
                <p className="font-heading text-4xl font-black text-foreground">12.4k</p>
                <p className="text-sm text-muted-foreground mt-1">Student Users</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <TrendingUp size={28} className="mx-auto mb-3 text-badge-gold" />
                <p className="font-heading text-4xl font-black text-skill-green">+34%</p>
                <p className="text-sm text-muted-foreground mt-1">YoY Growth</p>
              </div>
            </div>
          </div>
        </section>

        {/* 14. ENTERPRISE METRICS */}
        <section id="enterprise" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><Building2 size={24} /> Enterprise Metrics</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <MetricCard label="Enterprise Clients" value={m?.enterprise_clients || enterpriseStats.projects} icon={Building2} size="lg" />
              <MetricCard label="Active Projects" value={enterpriseStats.projects} icon={Layers} size="lg" />
              <MetricCard label="Consultations" value={enterpriseStats.consultations} icon={Video} size="lg" />
              <MetricCard label="Expansion Revenue" value="$42k" suffix="" icon={TrendingUp} size="lg" animate={false} />
            </div>
          </div>
        </section>

        {/* 15. CONTENT & ENGAGEMENT */}
        <section id="content" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Content & Engagement</h2>
            {contentMetrics.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
                {contentMetrics.map((cm: any, i: number) => {
                  const Icon = cm.type?.includes("Message") ? MessageSquare : cm.type?.includes("File") ? FileText : cm.type?.includes("Video") ? Video : Star;
                  return (
                    <motion.div key={cm.type} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-4 text-center">
                      <Icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="font-heading text-lg font-black text-foreground">{cm.count}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{cm.type}</p>
                      <span className="font-mono text-[9px] text-skill-green font-bold">{cm.growth}</span>
                    </motion.div>
                  );
                })}
              </div>
            ) : <EmptyCard msg="No content metrics data" />}
          </div>
        </section>

        {/* 16. PLATFORM PERFORMANCE */}
        <section id="platform" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><Server size={24} /> Platform Performance</h2>
            {platformUptime.length > 0 ? (
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Month</span><span>Uptime</span><span>Incidents</span><span>Avg Response</span>
                </div>
                {platformUptime.map((u: any) => (
                  <div key={u.month} className="grid grid-cols-4 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                    <span className="font-mono text-xs text-foreground">{u.month}</span>
                    <span className={`font-mono text-xs font-bold ${u.uptime >= 99.95 ? "text-skill-green" : "text-badge-gold"}`}>{u.uptime}%</span>
                    <span className={`font-mono text-xs ${u.incidents === 0 ? "text-skill-green" : "text-foreground"}`}>{u.incidents}</span>
                    <span className="font-mono text-xs text-muted-foreground">{u.avgResponse}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyCard msg="No uptime data" />}
          </div>
        </section>

        {/* 17. AI QUALITY METRICS */}
        <section id="ai-quality" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><Sparkles size={24} className="text-badge-gold" /> AI Quality Metrics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Skill Court Accuracy", value: "94.7%", icon: Target, trend: "up" as const },
                { label: "Match Quality Score", value: "4.6★", icon: Star, trend: "up" as const },
                { label: "Fraud Detection Rate", value: "99.2%", icon: Shield, trend: "up" as const },
                { label: "AI Response Time", value: "1.2s", icon: Zap, trend: "neutral" as const },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <m.icon size={24} className="mx-auto mb-3 text-badge-gold" />
                  <p className="font-heading text-3xl font-black text-foreground">{m.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 font-mono text-[10px] font-bold ${m.trend === "up" ? "text-skill-green" : "text-muted-foreground"}`}>
                    {m.trend === "up" && <ArrowUp size={10} />}Stable
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 18. BEHAVIORAL ANALYTICS */}
        <section id="behavioral" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2 flex items-center gap-2"><Eye size={24} /> Behavioral Analytics</h2>
            <p className="text-sm text-muted-foreground mb-8">Session duration, page depth, click patterns</p>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-8">
              <MetricCard label="Total Sessions" value={telemetry.totalSessions} icon={Users} delay={0} />
              <MetricCard label="Avg Duration" value={`${telemetry.avgDuration}s`} suffix="" icon={Clock} delay={0.05} animate={false} />
              <MetricCard label="Avg Scroll" value={`${telemetry.avgScrollDepth}%`} suffix="" icon={TrendingUp} delay={0.1} animate={false} />
              <MetricCard label="Engagement" value={telemetry.avgEngagement} icon={Star} delay={0.15} />
              <MetricCard label="Total Clicks" value={telemetry.totalClicks} icon={Activity} delay={0.2} />
              <MetricCard label="Rage Clicks" value={telemetry.rageClicks} icon={Flame} trend={telemetry.rageClicks > 10 ? "down" : "neutral"} delay={0.25} />
              <MetricCard label="Dead Clicks" value={telemetry.deadClicks} icon={Shield} delay={0.3} />
              <MetricCard label="Errors" value={telemetry.totalErrors} icon={Server} trend={telemetry.totalErrors > 50 ? "down" : "neutral"} delay={0.35} />
            </div>

            {/* Hourly Activity */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Clock size={14} /> Hourly Activity Pattern</h3>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {telemetry.hourlyActivity.map((h, i) => {
                  const maxH = Math.max(...telemetry.hourlyActivity.map(x => x.sessions), 1);
                  return (
                    <motion.div key={i} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${(h.sessions / maxH) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.4 }}>
                      <div className="absolute inset-0 rounded-t bg-foreground/60 group-hover:bg-foreground transition-colors" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-1">
                {telemetry.hourlyActivity.filter((_, i) => i % 4 === 0).map((h) => (
                  <div key={h.hour} className="flex-[4] text-center font-mono text-[8px] text-muted-foreground">{h.hour}:00</div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-surface-2 px-5 py-3 text-xs font-bold text-foreground flex items-center gap-2"><Globe size={12} /> Top Pages</div>
                {telemetry.topPages.length ? telemetry.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center justify-between border-b border-border/50 last:border-0 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground w-5">{i + 1}</span>
                      <span className="text-xs font-medium text-foreground truncate max-w-[180px]">{p.path}</span>
                    </div>
                    <span className="font-mono text-xs text-foreground">{p.count}</span>
                  </div>
                )) : <p className="px-5 py-8 text-xs text-muted-foreground text-center">No session data yet</p>}
              </div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-surface-2 px-5 py-3 text-xs font-bold text-foreground flex items-center gap-2"><Activity size={12} /> Top Clicked Elements</div>
                {telemetry.topClickElements.length ? telemetry.topClickElements.map((c, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border/50 last:border-0 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">&lt;{c.tag}&gt;</span>
                      <span className="text-xs text-foreground truncate max-w-[150px]">{c.text}</span>
                    </div>
                    <span className="font-mono text-xs text-foreground">{c.count}×</span>
                  </div>
                )) : <p className="px-5 py-8 text-xs text-muted-foreground text-center">No click data yet</p>}
              </div>
            </div>
          </div>
        </section>

        {/* 19. REVENUE FORECASTING MODEL */}
        <section id="revenue-forecast" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Revenue Forecasting Model</h2>
            <p className="text-sm text-muted-foreground mb-8">LTV projections, CAC payback, runway calculator</p>
            <div className="grid gap-6 lg:grid-cols-2">
              <ForecastChart scenarios={revenueScenarios} title="Revenue Scenarios (12-month)" valuePrefix="$" height={280} />
              <div className="space-y-4">
                {[
                  { label: "Customer Acquisition Cost", value: "$24", desc: "Avg cost to acquire a user" },
                  { label: "CAC Payback Period", value: "2.4 mo", desc: "Time to recover CAC" },
                  { label: "Lifetime Value", value: "$840", desc: "Avg revenue per user lifetime" },
                  { label: "LTV:CAC Ratio", value: "35:1", desc: "Target: >3:1 (Excellent)" },
                  { label: "Runway", value: "24+ mo", desc: "Based on current burn rate" },
                ].map((m, i) => (
                  <motion.div key={m.label} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                    </div>
                    <span className="font-mono text-lg font-black text-foreground">{m.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 20. COMPARATIVE BENCHMARKS */}
        <section id="benchmarks" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><BarChart3 size={24} /> Comparative Benchmarks</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { metric: "User Growth", actual: "+42%", benchmark: "SaaS Avg: +15%", status: "above" },
                { metric: "Monthly Churn", actual: "2.1%", benchmark: "Industry: 5-7%", status: "above" },
                { metric: "NPS Score", actual: "72", benchmark: "B2B Avg: 40", status: "above" },
                { metric: "Session Duration", actual: "8.2 min", benchmark: "Avg: 3-5 min", status: "above" },
                { metric: "Conversion Rate", actual: "4.8%", benchmark: "Marketplace: 2-3%", status: "above" },
                { metric: "Support Response", actual: "< 2 hrs", benchmark: "Target: < 4 hrs", status: "above" },
              ].map((b, i) => (
                <motion.div key={b.metric} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{b.metric}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${b.status === "above" ? "bg-skill-green/10 text-skill-green" : "bg-badge-gold/10 text-badge-gold"}`}>
                      {b.status === "above" ? "Above Avg" : "At Target"}
                    </span>
                  </div>
                  <p className="font-heading text-2xl font-black text-foreground">{b.actual}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{b.benchmark}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 21. RISK & COMPLIANCE */}
        <section id="risk" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center gap-2"><Lock size={24} /> Risk & Compliance</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <Shield size={28} className="mx-auto mb-3 text-skill-green" />
                <p className="font-heading text-3xl font-black text-foreground">{disputeStats.resolved}</p>
                <p className="text-sm text-muted-foreground mt-1">Disputes Resolved</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <AlertTriangle size={28} className="mx-auto mb-3 text-badge-gold" />
                <p className="font-heading text-3xl font-black text-foreground">{disputeStats.pending}</p>
                <p className="text-sm text-muted-foreground mt-1">Open Disputes</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <Lock size={28} className="mx-auto mb-3 text-skill-green" />
                <p className="font-heading text-3xl font-black text-skill-green">A+</p>
                <p className="text-sm text-muted-foreground mt-1">Security Score</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <CheckCircle2 size={28} className="mx-auto mb-3 text-skill-green" />
                <p className="font-heading text-3xl font-black text-foreground">100%</p>
                <p className="text-sm text-muted-foreground mt-1">GDPR Compliance</p>
              </div>
            </div>
          </div>
        </section>

        {/* 22. HALL OF FAME & MILESTONES */}
        <section id="hall-of-fame" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Crown size={32} className="mx-auto mb-3 text-badge-gold" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Hall of Fame & Milestones</h2>
            </motion.div>
            {hallOfFame.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hallOfFame.map((h: any, i: number) => (
                  <motion.div key={h.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-badge-gold/15 bg-card p-5 text-center hover:border-badge-gold/30 transition-colors">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-badge-gold/10 border border-badge-gold/20 font-heading text-sm font-bold text-badge-gold">{h.avatar}</div>
                    <h3 className="text-sm font-bold text-foreground">{h.name}</h3>
                    <p className="text-[10px] text-badge-gold font-medium mt-0.5">{h.title}</p>
                    <p className="font-heading text-lg font-black text-foreground mt-2">{h.value}</p>
                  </motion.div>
                ))}
              </div>
            ) : <EmptyCard msg="Hall of Fame is being compiled..." />}
          </div>
        </section>

        {/* 23. DATA EXPORT & REPORTING */}
        <section id="export" className="bg-surface-1 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">Data Export & Reporting</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center">Download reports, schedule exports, manage API access</p>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Download size={20} />
                  <span className="text-sm font-semibold">Export CSV</span>
                  <span className="text-[10px] text-muted-foreground">All metrics data</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <FileText size={20} />
                  <span className="text-sm font-semibold">PDF Report</span>
                  <span className="text-[10px] text-muted-foreground">Executive summary</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <RefreshCw size={20} />
                  <span className="text-sm font-semibold">Schedule Reports</span>
                  <span className="text-[10px] text-muted-foreground">Automated delivery</span>
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-surface-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Analytics API</p>
                  <p className="text-xs text-muted-foreground">Programmatic access to all metrics</p>
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-skill-green/10 text-skill-green border border-skill-green/20">Active</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AnalyticsPage;
