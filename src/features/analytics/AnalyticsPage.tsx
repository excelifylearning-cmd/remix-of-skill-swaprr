import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  TrendingUp, Users, Coins, ArrowLeftRight, Trophy, Shield, Globe,
  Activity, ArrowUp, Star, Flame, Clock, Calendar,
  Sparkles, Building2, GraduationCap, Scale, Layers, Timer,
  ChevronRight, CheckCircle2,
  Heart, MessageSquare, BookOpen, Crown, Video,
  Server, DollarSign, Palette, Code,
  ThumbsUp, FileText, TrendingDown
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";

const CountUpCard = ({ ci, i }: { ci: any; i: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const end = ci.value || 0;
    let start = 0;
    const step = end / (2500 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, ci.value]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 text-center">
      <ci.icon size={22} className="mx-auto mb-3 text-muted-foreground" />
      <p className="font-heading text-3xl font-black text-foreground">{count.toLocaleString()}{ci.suffix}</p>
      <p className="text-xs font-semibold text-foreground mt-1">{ci.metric}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{ci.desc}</p>
    </motion.div>
  );
};

const AnalyticsPage = () => {
  const [activeQuarter, setActiveQuarter] = useState("q1-2026");
  const [chartMetric, setChartMetric] = useState<"users" | "gigs">("users");
  const [quarters, setQuarters] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<{
    totalSessions: number; avgDuration: number; avgScrollDepth: number; avgEngagement: number;
    totalClicks: number; rageClicks: number; deadClicks: number; totalErrors: number;
    topPages: { path: string; count: number; avgDuration: number }[];
    topClickElements: { tag: string; text: string; count: number }[];
    errorTypes: { type: string; count: number }[];
    hourlyActivity: { hour: number; sessions: number }[];
  }>({
    totalSessions: 0, avgDuration: 0, avgScrollDepth: 0, avgEngagement: 0,
    totalClicks: 0, rageClicks: 0, deadClicks: 0, totalErrors: 0,
    topPages: [], topClickElements: [], errorTypes: [], hourlyActivity: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [qRes, mRes, sessRes, clickRes, errRes] = await Promise.all([
        supabase.from("quarterly_reports").select("*").order("quarter_id"),
        supabase.from("platform_metrics").select("*").order("metric_date", { ascending: false }).limit(1),
        supabase.from("page_sessions").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("click_heatmap").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("error_log").select("*").order("created_at", { ascending: false }).limit(200),
      ]);
      
      if (qRes.data?.length) {
        setQuarters(qRes.data.map((q: any) => ({
          id: q.quarter_id, label: q.label, period: q.period, status: q.status,
          kpis: q.kpis as any, growth: q.growth as any,
          highlights: q.highlights as string[], monthlyBreakdown: q.monthly_breakdown as any[],
          topSkills: q.top_skills as any[],
        })));
      }
      if (mRes.data?.length) setMetrics(mRes.data[0]);
      
      // Aggregate telemetry
      const sessions = sessRes.data || [];
      const clicks = clickRes.data || [];
      const errors = errRes.data || [];
      const totalSessions = sessions.length;
      const avgDuration = totalSessions ? Math.round(sessions.reduce((a: number, s: any) => a + (s.duration_seconds || 0), 0) / totalSessions) : 0;
      const avgScrollDepth = totalSessions ? Math.round(sessions.reduce((a: number, s: any) => a + (s.scroll_depth_max || 0), 0) / totalSessions) : 0;
      const avgEngagement = totalSessions ? Math.round(sessions.reduce((a: number, s: any) => a + (s.engagement_score || 0), 0) / totalSessions) : 0;
      const rageClicks = clicks.filter((c: any) => c.is_rage_click).length;
      const deadClicks = clicks.filter((c: any) => c.is_dead_click).length;
      const pageMap = new Map<string, { count: number; totalDur: number }>();
      sessions.forEach((s: any) => { const e = pageMap.get(s.page_path) || { count: 0, totalDur: 0 }; e.count++; e.totalDur += s.duration_seconds || 0; pageMap.set(s.page_path, e); });
      const topPages = Array.from(pageMap.entries()).map(([path, v]) => ({ path, count: v.count, avgDuration: Math.round(v.totalDur / v.count) })).sort((a, b) => b.count - a.count).slice(0, 10);
      const elemMap = new Map<string, number>();
      clicks.forEach((c: any) => { const key = `${c.element_tag || "?"}:${(c.element_text || "").slice(0, 30)}`; elemMap.set(key, (elemMap.get(key) || 0) + 1); });
      const topClickElements = Array.from(elemMap.entries()).map(([k, count]) => { const [tag, text] = k.split(":"); return { tag, text: text || "(no text)", count }; }).sort((a, b) => b.count - a.count).slice(0, 10);
      const errMap = new Map<string, number>();
      errors.forEach((e: any) => { errMap.set(e.error_type, (errMap.get(e.error_type) || 0) + 1); });
      const errorTypes = Array.from(errMap.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
      const hourMap = new Map<number, number>();
      sessions.forEach((s: any) => { const h = new Date(s.entered_at).getHours(); hourMap.set(h, (hourMap.get(h) || 0) + 1); });
      const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({ hour: i, sessions: hourMap.get(i) || 0 }));

      setTelemetry({ totalSessions, avgDuration, avgScrollDepth, avgEngagement, totalClicks: clicks.length, rageClicks, deadClicks, totalErrors: errors.length, topPages, topClickElements, errorTypes, hourlyActivity });
      setLoading(false);
    };
    fetchData();
  }, []);

  // Extract from metrics JSON or show zeros
  const m = metrics;
  const liveStats = [
    { label: "Total Users", value: m ? (m.total_users || 0).toLocaleString() : "—", change: m ? `+${m.monthly_signups || 0} this month` : "", icon: Users, color: "text-foreground", delta: m ? `+${((m.monthly_signups || 0) / Math.max(m.total_users || 1, 1) * 100).toFixed(1)}%` : "" },
    { label: "Gigs Completed", value: m ? (m.total_gigs || 0).toLocaleString() : "—", change: "", icon: ArrowLeftRight, color: "text-skill-green", delta: "" },
    { label: "Points Circulated", value: m ? `${((m.points_circulated || 0) / 1000000).toFixed(1)}M` : "—", change: "", icon: Coins, color: "text-badge-gold", delta: "" },
    { label: "Active Guilds", value: m ? (m.active_guilds || 0).toLocaleString() : "—", change: "", icon: Users, color: "text-court-blue", delta: "" },
    { label: "Avg Satisfaction", value: m ? `${(m.avg_satisfaction || 0).toFixed(2)}★` : "—", change: "", icon: Star, color: "text-badge-gold", delta: "" },
    { label: "Disputes Resolved", value: m ? (m.disputes_resolved || 0).toLocaleString() : "—", change: "", icon: Shield, color: "text-skill-green", delta: "" },
    { label: "Universities", value: m ? String(m.universities || 0) : "—", change: "", icon: GraduationCap, color: "text-foreground", delta: "" },
    { label: "Enterprise Clients", value: m ? String(m.enterprise_clients || 0) : "—", change: "", icon: Building2, color: "text-foreground", delta: "" },
  ];

  const formatDistribution = m?.format_distribution ? (m.format_distribution as any[]).map((f: any) => ({
    format: f.format, pct: f.pct, count: f.count,
    icon: f.format === "Direct Swap" ? ArrowLeftRight : f.format === "Auction" ? Scale : f.format === "Co-Creation" ? Users : f.format === "Flash Market" ? Timer : Layers,
    color: f.format === "Direct Swap" ? "bg-foreground" : f.format === "Auction" ? "bg-court-blue" : f.format === "Co-Creation" ? "bg-skill-green" : f.format === "Flash Market" ? "bg-badge-gold" : "bg-destructive",
  })) : [];

  const economyHealth = m?.economy_health ? (m.economy_health as any[]) : [];
  const revenueBreakdown = m?.revenue_breakdown ? (m.revenue_breakdown as any[]).map((r: any) => ({
    ...r,
    icon: r.source?.includes("Enterprise") ? Building2 : r.source?.includes("Premium") ? Crown : r.source?.includes("Transaction") ? ArrowLeftRight : r.source?.includes("University") ? GraduationCap : Code,
    color: r.source?.includes("Enterprise") ? "bg-foreground" : r.source?.includes("Premium") ? "bg-badge-gold" : r.source?.includes("Transaction") ? "bg-court-blue" : r.source?.includes("University") ? "bg-skill-green" : "bg-muted-foreground",
  })) : [];
  const retentionData = m?.retention_data ? (m.retention_data as any) : null;
  const communityImpact = m?.community_impact ? (m.community_impact as any[]).map((ci: any) => ({
    ...ci,
    icon: ci.metric?.includes("Skills") ? BookOpen : ci.metric?.includes("Hours") ? Clock : ci.metric?.includes("Connection") ? Heart : ci.metric?.includes("Countr") ? Globe : ci.metric?.includes("Forum") ? MessageSquare : FileText,
  })) : [];
  const platformUptime = m?.platform_uptime ? (m.platform_uptime as any[]) : [];
  const hallOfFame = m?.hall_of_fame ? (m.hall_of_fame as any[]) : [];
  const contentMetrics = m?.content_metrics ? (m.content_metrics as any[]).map((cm: any) => ({
    ...cm,
    icon: cm.type?.includes("Message") ? MessageSquare : cm.type?.includes("File") ? FileText : cm.type?.includes("Video") ? Video : cm.type?.includes("Review") ? Star : cm.type?.includes("Portfolio") ? Palette : Code,
  })) : [];

  // Growth timeline from quarterly data
  const growthTimeline = quarters.length > 0 ? quarters.flatMap((q: any) => (q.monthlyBreakdown || []).map((mb: any) => ({ month: mb.month, users: mb.users, gigs: mb.gigs }))) : [];
  const maxVal = Math.max(...growthTimeline.map((d: any) => d[chartMetric] || 0), 1);
  const currentQuarter = quarters.find((q) => q.id === activeQuarter) || quarters[0];

  const noMetrics = !m;
  const noQuarters = quarters.length === 0;

  const EmptyCard = ({ msg }: { msg: string }) => (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <Activity size={28} className="mx-auto mb-3 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">{msg}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Run the seed function to populate analytics data</p>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backLabel="Analytics" />

        {/* 1. HERO */}
        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Activity size={12} className="text-skill-green" /> Platform Analytics — 2026
                <span className="h-1.5 w-1.5 rounded-full bg-skill-green animate-pulse" />
              </motion.span>
              <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl lg:text-6xl mb-3">
                Platform <span className="text-muted-foreground">Analytics</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Real-time metrics, quarterly growth reports, economy health, and telemetry — your complete analytics dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. LIVE STATS */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            {noMetrics ? <EmptyCard msg="No platform metrics data yet" /> : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
                {liveStats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <stat.icon size={14} className={stat.color} />
                      {stat.delta && <span className="flex items-center gap-0.5 text-[10px] font-semibold text-skill-green"><ArrowUp size={8} />{stat.delta}</span>}
                    </div>
                    <p className="font-heading text-xl font-black text-foreground leading-tight">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
                    {stat.change && <p className="text-[8px] text-muted-foreground/60 mt-1">{stat.change}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. QUARTERLY SELECTOR */}
        {!noQuarters && (
          <section className="bg-surface-1 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground"><Calendar size={10} className="inline mr-1" />Quarterly Reports</span>
                  <h2 className="font-heading text-3xl font-bold text-foreground">2026 Quarterly Breakdown</h2>
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
                        { label: "Users", value: currentQuarter.kpis?.users?.toLocaleString() || "0", icon: Users, color: "text-foreground" },
                        { label: "Gigs", value: currentQuarter.kpis?.gigs?.toLocaleString() || "0", icon: ArrowLeftRight, color: "text-skill-green" },
                        { label: "Points", value: currentQuarter.kpis?.points ? `${(currentQuarter.kpis.points / 1000000).toFixed(1)}M SP` : "0", icon: Coins, color: "text-badge-gold" },
                        { label: "Revenue", value: currentQuarter.kpis?.revenue || "$0", icon: DollarSign, color: "text-foreground" },
                        { label: "Guilds", value: currentQuarter.kpis?.guilds?.toLocaleString() || "0", icon: Trophy, color: "text-court-blue" },
                        { label: "Universities", value: String(currentQuarter.kpis?.universities || 0), icon: GraduationCap, color: "text-foreground" },
                      ].map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
                          <kpi.icon size={14} className={`${kpi.color} mb-1.5`} />
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

                    {currentQuarter.monthlyBreakdown?.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <span>Month</span><span>Users</span><span>Gigs</span><span>Revenue</span><span>New Signups</span>
                        </div>
                        {currentQuarter.monthlyBreakdown.map((mb: any, i: number) => (
                          <div key={mb.month} className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                            <span className="font-mono text-xs font-medium text-foreground">{mb.month}</span>
                            <span className="font-mono text-xs text-foreground">{mb.users?.toLocaleString()}</span>
                            <span className="font-mono text-xs text-skill-green">{mb.gigs?.toLocaleString()}</span>
                            <span className="font-mono text-xs text-badge-gold">{mb.revenue}</span>
                            <span className="font-mono text-xs text-court-blue">+{mb.newSignups?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQuarter.topSkills?.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Flame size={14} className="text-destructive" /> Top Skills — {currentQuarter.label}</h3>
                        <div className="grid gap-2 sm:grid-cols-5">
                          {currentQuarter.topSkills.map((s: any, i: number) => (
                            <div key={s.skill} className="rounded-xl border border-border bg-surface-1 p-3 text-center">
                              <span className="font-mono text-[10px] font-black text-foreground">{i + 1}</span>
                              <p className="text-xs font-semibold text-foreground mt-1 truncate">{s.skill}</p>
                              <p className="text-[9px] text-muted-foreground">{s.gigs?.toLocaleString()} gigs</p>
                              <span className="font-mono text-[10px] font-bold text-skill-green">{s.growth}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </section>
        )}

        {/* 4. GROWTH CHART */}
        {growthTimeline.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground">Platform Growth</h2>
                  <p className="text-sm text-muted-foreground mt-1">From quarterly reports</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                  {(["users", "gigs"] as const).map((mt) => (
                    <button key={mt} onClick={() => setChartMetric(mt)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${chartMetric === mt ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                      {mt === "users" ? "Users" : "Gigs"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-end gap-2" style={{ height: 200 }}>
                  {growthTimeline.map((d: any, i: number) => (
                    <motion.div key={i} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${((d[chartMetric] || 0) / maxVal) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                      <div className="absolute inset-0 rounded-t-lg bg-foreground/70 group-hover:bg-foreground transition-colors" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background whitespace-nowrap z-10">
                        {(d[chartMetric] || 0).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  {growthTimeline.map((d: any, i: number) => (<div key={i} className="flex-1 text-center font-mono text-[8px] text-muted-foreground">{d.month}</div>))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. FORMAT DISTRIBUTION */}
        {formatDistribution.length > 0 && (
          <section className="bg-surface-1 py-20">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Gig Format Distribution</h2>
              <div className="space-y-3">
                {formatDistribution.map((f: any, i: number) => (
                  <motion.div key={f.format} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 flex-shrink-0"><f.icon size={14} className="text-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{f.format}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{f.count?.toLocaleString()} · {f.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${f.color}`} initial={{ width: 0 }} whileInView={{ width: `${f.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. ECONOMY HEALTH */}
        {economyHealth.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Economy Health Monitor</h2>
              <p className="text-sm text-muted-foreground mb-8">Real-time health indicators for the Skill Points economy</p>
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
            </div>
          </section>
        )}

        {/* 7. REVENUE */}
        {revenueBreakdown.length > 0 && (
          <section className="bg-surface-1 py-20">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Revenue Breakdown</h2>
              <div className="space-y-3">
                {revenueBreakdown.map((r: any, i: number) => (
                  <motion.div key={r.source} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 flex-shrink-0"><r.icon size={18} className="text-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-foreground">{r.source}</span>
                        <span className="font-mono text-sm font-bold text-foreground">{r.amount}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${r.color}`} initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }} />
                      </div>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-10 text-right">{r.pct}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. RETENTION */}
        {retentionData && (
          <section className="py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Retention & Engagement</h2>
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {retentionData.cohorts && (
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Cohort</span><span>Day 1</span><span>Day 7</span><span>Day 30</span><span>Day 90</span>
                    </div>
                    {retentionData.cohorts.map((c: any, i: number) => (
                      <div key={c.month} className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-4 py-3">
                        <span className="font-mono text-[10px] text-foreground">{c.month}</span>
                        {[c.d1, c.d7, c.d30, c.d90].map((v: any, j: number) => (
                          <span key={j} className={`font-mono text-xs font-bold ${typeof v === "number" && v >= 70 ? "text-skill-green" : typeof v === "number" && v >= 40 ? "text-badge-gold" : typeof v === "number" ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                            {typeof v === "number" ? `${v}%` : v || "—"}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  {[
                    { label: "Avg Session Length", value: retentionData.avgSessionLength || "—", icon: Clock },
                    { label: "Avg Gigs / User", value: String(retentionData.avgGigsPerUser || "—"), icon: ArrowLeftRight },
                    { label: "Monthly Churn", value: retentionData.churnRate || "—", icon: TrendingDown },
                    { label: "Net Promoter Score", value: String(retentionData.nps || "—"), icon: ThumbsUp },
                  ].map((mt) => (
                    <div key={mt.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 flex-shrink-0"><mt.icon size={16} className="text-foreground" /></div>
                      <div>
                        <p className="font-heading text-lg font-black text-foreground">{mt.value}</p>
                        <p className="text-[9px] text-muted-foreground">{mt.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. CONTENT METRICS */}
        {contentMetrics.length > 0 && (
          <section className="bg-surface-1 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Content & Communication</h2>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
                {contentMetrics.map((mt: any, i: number) => (
                  <motion.div key={mt.type} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-4 text-center">
                    <mt.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="font-heading text-lg font-black text-foreground">{mt.count}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{mt.type}</p>
                    <span className="font-mono text-[9px] text-skill-green font-bold">{mt.growth}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. UPTIME */}
        {platformUptime.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Platform Uptime</h2>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Month</span><span>Uptime</span><span>Incidents</span><span>Avg Response</span>
                </div>
                {platformUptime.map((u: any, i: number) => (
                  <div key={u.month} className="grid grid-cols-4 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                    <span className="font-mono text-xs text-foreground">{u.month}</span>
                    <span className={`font-mono text-xs font-bold ${u.uptime >= 99.95 ? "text-skill-green" : "text-badge-gold"}`}>{u.uptime}%</span>
                    <span className={`font-mono text-xs ${u.incidents === 0 ? "text-skill-green" : "text-foreground"}`}>{u.incidents}</span>
                    <span className="font-mono text-xs text-muted-foreground">{u.avgResponse}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 11. COMMUNITY IMPACT */}
        {communityImpact.length > 0 && (
          <section className="bg-surface-1 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">Community Impact</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {communityImpact.map((ci: any, i: number) => (
                  <CountUpCard key={ci.metric} ci={ci} i={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 12. HALL OF FAME */}
        {hallOfFame.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Crown size={28} className="mx-auto mb-3 text-badge-gold" />
                <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Hall of Fame</h2>
              </motion.div>
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
            </div>
          </section>
        )}

        {/* 13. TELEMETRY */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground"><Activity size={10} className="inline mr-1" />Live Telemetry</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">User Behavior Analytics</h2>
              <p className="text-sm text-muted-foreground">Real-time data from the telemetry engine</p>
            </motion.div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-8">
              {[
                { label: "Total Sessions", value: telemetry.totalSessions.toLocaleString(), icon: Users },
                { label: "Avg Duration", value: `${telemetry.avgDuration}s`, icon: Clock },
                { label: "Avg Scroll", value: `${telemetry.avgScrollDepth}%`, icon: TrendingUp },
                { label: "Engagement", value: `${telemetry.avgEngagement}`, icon: Star },
                { label: "Total Clicks", value: telemetry.totalClicks.toLocaleString(), icon: Activity },
                { label: "Rage Clicks", value: String(telemetry.rageClicks), icon: Flame },
                { label: "Dead Clicks", value: String(telemetry.deadClicks), icon: Shield },
                { label: "Errors", value: String(telemetry.totalErrors), icon: Server },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-border bg-card p-4">
                  <s.icon size={14} className="text-muted-foreground mb-1" />
                  <p className="font-heading text-xl font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Hourly Activity Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Clock size={14} /> Hourly Activity Pattern</h3>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {telemetry.hourlyActivity.map((h, i) => {
                  const maxH = Math.max(...telemetry.hourlyActivity.map(x => x.sessions), 1);
                  return (
                    <motion.div key={i} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${(h.sessions / maxH) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.4 }}>
                      <div className="absolute inset-0 rounded-t bg-foreground/60 group-hover:bg-foreground transition-colors" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-bold text-foreground bg-card border border-border rounded px-1 py-0.5 whitespace-nowrap z-10">{h.sessions}</div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-1">
                {telemetry.hourlyActivity.filter((_, i) => i % 3 === 0).map((h) => (
                  <div key={h.hour} className="flex-[3] text-center font-mono text-[7px] text-muted-foreground">{h.hour}:00</div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-surface-2 px-5 py-3 text-xs font-bold text-foreground flex items-center gap-2"><Globe size={12} /> Top Pages by Sessions</div>
                {telemetry.topPages.length ? telemetry.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center justify-between border-b border-border/50 last:border-0 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground w-5">{i + 1}</span>
                      <span className="text-xs font-medium text-foreground truncate max-w-[180px]">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-foreground">{p.count}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{p.avgDuration}s avg</span>
                    </div>
                  </div>
                )) : <p className="px-5 py-8 text-xs text-muted-foreground text-center">No session data yet. Browse the site to generate telemetry.</p>}
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
                )) : <p className="px-5 py-8 text-xs text-muted-foreground text-center">No click data yet.</p>}
              </div>
            </div>

            {telemetry.errorTypes.length > 0 && (
              <div className="mt-6 rounded-2xl border border-destructive/20 bg-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Server size={14} className="text-destructive" /> Error Summary</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {telemetry.errorTypes.map((e) => (
                    <div key={e.type} className="rounded-xl border border-border bg-surface-1 p-4 text-center">
                      <p className="font-heading text-2xl font-black text-destructive">{e.count}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{e.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AnalyticsPage;
