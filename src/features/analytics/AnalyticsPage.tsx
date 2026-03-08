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

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return { count, ref };
};

const quarters = [
  {
    id: "q1-2026", label: "Q1 2026", period: "Jan – Mar 2026", status: "current",
    kpis: { users: 24531, gigs: 89204, points: 2400000, revenue: "$593K", guilds: 1247, universities: 52 },
    growth: { userGrowth: "+28.4%", gigGrowth: "+31.2%", revenueGrowth: "+42.1%", retentionRate: "91%" },
    highlights: ["Co-Creation Studio launched with real-time collaboration", "25,000 total gigs milestone achieved", "Guild Wars Season 2 completed — Team Nexus wins", "AI Quality Panel v2 deployed with 94% accuracy", "3 new university partnerships signed"],
    monthlyBreakdown: [
      { month: "Jan", users: 19800, gigs: 26400, revenue: "$178K", newSignups: 2100 },
      { month: "Feb", users: 22100, gigs: 29800, revenue: "$194K", newSignups: 2300 },
      { month: "Mar", users: 24531, gigs: 33004, revenue: "$221K", newSignups: 2431 },
    ],
    topSkills: [
      { skill: "React / Next.js", gigs: 4210, growth: "+23%" },
      { skill: "UI/UX Design", gigs: 3890, growth: "+18%" },
      { skill: "AI/ML Engineering", gigs: 2140, growth: "+41%" },
      { skill: "Video Production", gigs: 2870, growth: "+15%" },
      { skill: "Data Science", gigs: 1890, growth: "+29%" },
    ],
  },
  {
    id: "q2-2026", label: "Q2 2026", period: "Apr – Jun 2026", status: "projected",
    kpis: { users: 32000, gigs: 120000, points: 3500000, revenue: "$820K", guilds: 1600, universities: 58 },
    growth: { userGrowth: "+30.5%", gigGrowth: "+34.5%", revenueGrowth: "+38.3%", retentionRate: "92%" },
    highlights: ["Mobile app launch (iOS + Android)", "Enterprise adoption accelerating — 50 new companies", "Skill Fusion becomes #2 format", "Multi-currency SP system goes live", "Guild Wars Season 3 kicks off"],
    monthlyBreakdown: [
      { month: "Apr", users: 27000, gigs: 36000, revenue: "$250K", newSignups: 2500 },
      { month: "May", users: 29500, gigs: 40000, revenue: "$275K", newSignups: 2500 },
      { month: "Jun", users: 32000, gigs: 44000, revenue: "$295K", newSignups: 2500 },
    ],
    topSkills: [
      { skill: "Mobile Development", gigs: 5200, growth: "+68%" },
      { skill: "AI/ML Engineering", gigs: 3800, growth: "+78%" },
      { skill: "React / Next.js", gigs: 5100, growth: "+21%" },
      { skill: "Blockchain/Web3", gigs: 1800, growth: "+120%" },
      { skill: "3D/AR Design", gigs: 2200, growth: "+45%" },
    ],
  },
  {
    id: "q3-2026", label: "Q3 2026", period: "Jul – Sep 2026", status: "projected",
    kpis: { users: 45000, gigs: 180000, points: 5200000, revenue: "$1.2M", guilds: 2100, universities: 72 },
    growth: { userGrowth: "+40.6%", gigGrowth: "+50.0%", revenueGrowth: "+46.3%", retentionRate: "93%" },
    highlights: ["Multi-language support opens 12 new markets", "API Marketplace launches with 50+ integrations", "100K total gigs milestone projected", "University network expands to Asia-Pacific", "Skill matching AI achieves 97% accuracy"],
    monthlyBreakdown: [
      { month: "Jul", users: 36000, gigs: 55000, revenue: "$370K", newSignups: 4000 },
      { month: "Aug", users: 40000, gigs: 60000, revenue: "$400K", newSignups: 4000 },
      { month: "Sep", users: 45000, gigs: 65000, revenue: "$430K", newSignups: 5000 },
    ],
    topSkills: [
      { skill: "AI/ML Engineering", gigs: 8200, growth: "+116%" },
      { skill: "React / Next.js", gigs: 6400, growth: "+24%" },
      { skill: "Cloud Architecture", gigs: 3100, growth: "+89%" },
      { skill: "DevOps/SRE", gigs: 2800, growth: "+72%" },
      { skill: "Data Engineering", gigs: 3500, growth: "+55%" },
    ],
  },
  {
    id: "q4-2026", label: "Q4 2026", period: "Oct – Dec 2026", status: "projected",
    kpis: { users: 62000, gigs: 260000, points: 7800000, revenue: "$1.8M", guilds: 2800, universities: 100 },
    growth: { userGrowth: "+37.8%", gigGrowth: "+44.4%", revenueGrowth: "+50.0%", retentionRate: "94%" },
    highlights: ["100 university partnerships milestone", "Projected platform break-even", "Skill Court AI v3 with 98% accuracy", "Corporate training vertical launches", "Annual platform recap & awards"],
    monthlyBreakdown: [
      { month: "Oct", users: 50000, gigs: 80000, revenue: "$550K", newSignups: 5000 },
      { month: "Nov", users: 55000, gigs: 88000, revenue: "$600K", newSignups: 5000 },
      { month: "Dec", users: 62000, gigs: 92000, revenue: "$650K", newSignups: 7000 },
    ],
    topSkills: [
      { skill: "AI/ML Engineering", gigs: 12000, growth: "+146%" },
      { skill: "Full-Stack Dev", gigs: 9800, growth: "+53%" },
      { skill: "Product Design", gigs: 7200, growth: "+38%" },
      { skill: "Cybersecurity", gigs: 4100, growth: "+94%" },
      { skill: "Data Science", gigs: 5500, growth: "+61%" },
    ],
  },
];

const liveStats = [
  { label: "Total Users", value: "24,531", change: "+1,247 this month", icon: Users, color: "text-foreground", delta: "+5.3%" },
  { label: "Gigs Completed", value: "89,204", change: "+4,890 this month", icon: ArrowLeftRight, color: "text-skill-green", delta: "+5.8%" },
  { label: "Points Circulated", value: "2.4M", change: "+182K this month", icon: Coins, color: "text-badge-gold", delta: "+8.2%" },
  { label: "Active Guilds", value: "1,247", change: "+89 this month", icon: Users, color: "text-court-blue", delta: "+7.7%" },
  { label: "Avg Satisfaction", value: "4.81★", change: "+0.02 vs last month", icon: Star, color: "text-badge-gold", delta: "+0.4%" },
  { label: "Disputes Resolved", value: "4,821", change: "48h avg resolution", icon: Shield, color: "text-skill-green", delta: "+12%" },
  { label: "Universities", value: "52", change: "+4 this quarter", icon: GraduationCap, color: "text-foreground", delta: "+8.3%" },
  { label: "Enterprise Clients", value: "128", change: "+22 this quarter", icon: Building2, color: "text-foreground", delta: "+20.7%" },
];

const growthTimeline = [
  { month: "Jan '25", users: 2400, gigs: 4200 },
  { month: "Apr '25", users: 4200, gigs: 8100 },
  { month: "Jul '25", users: 9600, gigs: 24000 },
  { month: "Oct '25", users: 15400, gigs: 49000 },
  { month: "Jan '26", users: 19800, gigs: 68000 },
  { month: "Mar '26", users: 24531, gigs: 89204 },
  { month: "Jun '26*", users: 32000, gigs: 120000 },
  { month: "Sep '26*", users: 45000, gigs: 180000 },
  { month: "Dec '26*", users: 62000, gigs: 260000 },
];

const formatDistribution = [
  { format: "Direct Swap", pct: 38, count: 33897, icon: ArrowLeftRight, color: "bg-foreground" },
  { format: "Auction", pct: 18, count: 16057, icon: Scale, color: "bg-court-blue" },
  { format: "Co-Creation", pct: 15, count: 13381, icon: Users, color: "bg-skill-green" },
  { format: "Flash Market", pct: 12, count: 10704, icon: Timer, color: "bg-badge-gold" },
  { format: "Skill Fusion", pct: 8, count: 7136, icon: Layers, color: "bg-destructive" },
];

const economyHealth = [
  { metric: "Inflation Rate", value: "1.2%", status: "healthy", target: "< 3%", desc: "Well below target. Tax mechanism working effectively." },
  { metric: "Velocity (Monthly)", value: "3.4x", status: "healthy", target: "> 2x", desc: "Points changing hands 3.4 times/month on average." },
  { metric: "Gini Coefficient", value: "0.31", status: "healthy", target: "< 0.40", desc: "Relatively equal distribution. No hoarding detected." },
  { metric: "Active Circulation", value: "78%", status: "healthy", target: "> 60%", desc: "78% of all minted points are actively circulating." },
  { metric: "Tax Revenue", value: "120K SP", status: "neutral", target: "—", desc: "Monthly tax collected. Funds challenges and prizes." },
  { metric: "New Minting", value: "45K SP", status: "neutral", target: "—", desc: "New points entering via signups, bonuses, and events." },
];

const revenueBreakdown = [
  { source: "Enterprise Subscriptions", amount: "$248K", pct: 42, icon: Building2, color: "bg-foreground" },
  { source: "Premium Plans", amount: "$142K", pct: 24, icon: Crown, color: "bg-badge-gold" },
  { source: "Transaction Fees", amount: "$89K", pct: 15, icon: ArrowLeftRight, color: "bg-court-blue" },
  { source: "University Licenses", amount: "$67K", pct: 11, icon: GraduationCap, color: "bg-skill-green" },
  { source: "API Access", amount: "$47K", pct: 8, icon: Code, color: "bg-muted-foreground" },
];

const retentionData = {
  cohorts: [
    { month: "Oct 2025", d1: 85, d7: 68, d30: 52, d90: 35 },
    { month: "Nov 2025", d1: 87, d7: 71, d30: 55, d90: 38 },
    { month: "Dec 2025", d1: 88, d7: 73, d30: 57, d90: 40 },
    { month: "Jan 2026", d1: 89, d7: 74, d30: 58, d90: "—" },
    { month: "Feb 2026", d1: 91, d7: 76, d30: "—", d90: "—" },
    { month: "Mar 2026", d1: 92, d7: 78, d30: "—", d90: "—" },
  ],
  avgSessionLength: "18 min", avgGigsPerUser: 3.6, churnRate: "4.2%", nps: 72,
};

const communityImpact = [
  { metric: "Skills Learned", value: 142000, suffix: "+", icon: BookOpen, desc: "Individual skills exchanged" },
  { metric: "Hours Saved", value: 890000, suffix: "+", icon: Clock, desc: "Estimated hours saved vs hiring" },
  { metric: "Connections Made", value: 67000, suffix: "+", icon: Heart, desc: "Unique user connections formed" },
  { metric: "Countries Active", value: 72, suffix: "", icon: Globe, desc: "Countries with active users" },
  { metric: "Forum Posts", value: 52400, suffix: "+", icon: MessageSquare, desc: "Community discussions" },
  { metric: "Guides Published", value: 240, suffix: "+", icon: FileText, desc: "Educational guides authored" },
];

const platformUptime = [
  { month: "Oct '25", uptime: 99.94, incidents: 2, avgResponse: "4m" },
  { month: "Nov '25", uptime: 99.97, incidents: 1, avgResponse: "3m" },
  { month: "Dec '25", uptime: 99.91, incidents: 3, avgResponse: "6m" },
  { month: "Jan '26", uptime: 99.98, incidents: 1, avgResponse: "2m" },
  { month: "Feb '26", uptime: 99.99, incidents: 0, avgResponse: "—" },
  { month: "Mar '26", uptime: 99.96, incidents: 1, avgResponse: "5m" },
];

const hallOfFame = [
  { name: "Lena S.", title: "Most Gigs Completed", value: "203 gigs", avatar: "LS", tier: "Diamond" },
  { name: "Wei L.", title: "Highest Karma", value: "7,800 karma", avatar: "WL", tier: "Diamond" },
  { name: "Team Nexus", title: "Top Guild (ELO)", value: "2,140 ELO", avatar: "TN", tier: "Guild" },
  { name: "Maya K.", title: "Longest Streak", value: "142 days", avatar: "MK", tier: "Gold" },
  { name: "James T.", title: "Most Court Cases", value: "145 judged", avatar: "JT", tier: "Platinum" },
  { name: "Dev_Riku", title: "Top API Contributor", value: "34 integrations", avatar: "DR", tier: "Gold" },
];

const contentMetrics = [
  { type: "Workspace Messages", count: "1.2M+", growth: "+24%", icon: MessageSquare },
  { type: "Files Shared", count: "340K+", growth: "+31%", icon: FileText },
  { type: "Video Calls", count: "89K+", growth: "+45%", icon: Video },
  { type: "Reviews Written", count: "67K+", growth: "+18%", icon: Star },
  { type: "Portfolios Created", count: "12K+", growth: "+28%", icon: Palette },
  { type: "API Calls (Daily)", count: "2.1M", growth: "+62%", icon: Code },
];

const AnalyticsPage = () => {
  const [activeQuarter, setActiveQuarter] = useState("q1-2026");
  const [chartMetric, setChartMetric] = useState<"users" | "gigs">("users");
  const [dbQuarters, setDbQuarters] = useState<any[]>([]);
  const [dbMetrics, setDbMetrics] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<{
    totalSessions: number;
    avgDuration: number;
    avgScrollDepth: number;
    avgEngagement: number;
    totalClicks: number;
    rageClicks: number;
    deadClicks: number;
    totalErrors: number;
    topPages: { path: string; count: number; avgDuration: number }[];
    topClickElements: { tag: string; text: string; count: number }[];
    errorTypes: { type: string; count: number }[];
    hourlyActivity: { hour: number; sessions: number }[];
    deviceBreakdown: { device: string; count: number }[];
  }>({
    totalSessions: 0, avgDuration: 0, avgScrollDepth: 0, avgEngagement: 0,
    totalClicks: 0, rageClicks: 0, deadClicks: 0, totalErrors: 0,
    topPages: [], topClickElements: [], errorTypes: [], hourlyActivity: [], deviceBreakdown: [],
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
      if (qRes.data?.length) setDbQuarters(qRes.data);
      if (mRes.data?.length) setDbMetrics(mRes.data[0]);

      const sessions = sessRes.data || [];
      const clicks = clickRes.data || [];
      const errors = errRes.data || [];

      // Aggregate telemetry
      const totalSessions = sessions.length;
      const avgDuration = totalSessions ? Math.round(sessions.reduce((a, s) => a + (s.duration_seconds || 0), 0) / totalSessions) : 0;
      const avgScrollDepth = totalSessions ? Math.round(sessions.reduce((a, s) => a + (s.scroll_depth_max || 0), 0) / totalSessions) : 0;
      const avgEngagement = totalSessions ? Math.round(sessions.reduce((a, s) => a + (s.engagement_score || 0), 0) / totalSessions) : 0;
      
      const rageClicks = clicks.filter(c => c.is_rage_click).length;
      const deadClicks = clicks.filter(c => c.is_dead_click).length;

      // Top pages
      const pageMap = new Map<string, { count: number; totalDur: number }>();
      sessions.forEach(s => {
        const entry = pageMap.get(s.page_path) || { count: 0, totalDur: 0 };
        entry.count++;
        entry.totalDur += s.duration_seconds || 0;
        pageMap.set(s.page_path, entry);
      });
      const topPages = Array.from(pageMap.entries())
        .map(([path, v]) => ({ path, count: v.count, avgDuration: Math.round(v.totalDur / v.count) }))
        .sort((a, b) => b.count - a.count).slice(0, 10);

      // Top click elements
      const elemMap = new Map<string, number>();
      clicks.forEach(c => {
        const key = `${c.element_tag || "?"}:${(c.element_text || "").slice(0, 30)}`;
        elemMap.set(key, (elemMap.get(key) || 0) + 1);
      });
      const topClickElements = Array.from(elemMap.entries())
        .map(([k, count]) => {
          const [tag, text] = k.split(":");
          return { tag, text: text || "(no text)", count };
        })
        .sort((a, b) => b.count - a.count).slice(0, 10);

      // Error types
      const errMap = new Map<string, number>();
      errors.forEach(e => {
        errMap.set(e.error_type, (errMap.get(e.error_type) || 0) + 1);
      });
      const errorTypes = Array.from(errMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Hourly activity
      const hourMap = new Map<number, number>();
      sessions.forEach(s => {
        const h = new Date(s.entered_at).getHours();
        hourMap.set(h, (hourMap.get(h) || 0) + 1);
      });
      const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
        hour: i, sessions: hourMap.get(i) || 0,
      }));

      setTelemetry({
        totalSessions, avgDuration, avgScrollDepth, avgEngagement,
        totalClicks: clicks.length, rageClicks, deadClicks,
        totalErrors: errors.length, topPages, topClickElements,
        errorTypes, hourlyActivity, deviceBreakdown: [],
      });
    };
    fetchData();
  }, []);

  const displayQuarters = dbQuarters.length > 0 ? dbQuarters.map((q) => ({
    id: q.quarter_id,
    label: q.label,
    period: q.period,
    status: q.status,
    kpis: q.kpis as any,
    growth: q.growth as any,
    highlights: q.highlights as string[],
    monthlyBreakdown: q.monthly_breakdown as any[],
    topSkills: q.top_skills as any[],
  })) : quarters;

  const maxVal = Math.max(...growthTimeline.map((d) => d[chartMetric]));
  const currentQuarter = displayQuarters.find((q) => q.id === activeQuarter) || displayQuarters[0];

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
                Real-time metrics, quarterly growth reports, economy health, demographics, and projections — your complete 2026 analytics dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. LIVE STATS */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
              {liveStats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <stat.icon size={14} className={stat.color} />
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-skill-green"><ArrowUp size={8} />{stat.delta}</span>
                  </div>
                  <p className="font-heading text-xl font-black text-foreground leading-tight">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
                  <p className="text-[8px] text-muted-foreground/60 mt-1">{stat.change}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. QUARTERLY SELECTOR */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground"><Calendar size={10} className="inline mr-1" />Quarterly Reports</span>
                <h2 className="font-heading text-3xl font-bold text-foreground">2026 Quarterly Breakdown</h2>
                <p className="text-sm text-muted-foreground mt-1">Select a quarter to view detailed analytics</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                {displayQuarters.map((q) => (
                  <button key={q.id} onClick={() => setActiveQuarter(q.id)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeQuarter === q.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {q.label}{q.status === "projected" && <span className="ml-1 text-[8px] opacity-60">*</span>}
                  </button>
                ))}
              </div>
            </div>

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
                    { label: "Users", value: currentQuarter.kpis.users.toLocaleString(), icon: Users, color: "text-foreground" },
                    { label: "Gigs", value: currentQuarter.kpis.gigs.toLocaleString(), icon: ArrowLeftRight, color: "text-skill-green" },
                    { label: "Points", value: `${(currentQuarter.kpis.points / 1000000).toFixed(1)}M SP`, icon: Coins, color: "text-badge-gold" },
                    { label: "Revenue", value: currentQuarter.kpis.revenue, icon: DollarSign, color: "text-foreground" },
                    { label: "Guilds", value: currentQuarter.kpis.guilds.toLocaleString(), icon: Trophy, color: "text-court-blue" },
                    { label: "Universities", value: String(currentQuarter.kpis.universities), icon: GraduationCap, color: "text-foreground" },
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
                        { label: "User Growth", value: currentQuarter.growth.userGrowth },
                        { label: "Gig Growth", value: currentQuarter.growth.gigGrowth },
                        { label: "Revenue Growth", value: currentQuarter.growth.revenueGrowth },
                        { label: "Retention Rate", value: currentQuarter.growth.retentionRate },
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
                      {currentQuarter.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-xs text-muted-foreground"><CheckCircle2 size={12} className="mt-0.5 text-skill-green flex-shrink-0" />{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Month</span><span>Users</span><span>Gigs</span><span>Revenue</span><span>New Signups</span>
                  </div>
                  {currentQuarter.monthlyBreakdown.map((m, i) => (
                    <motion.div key={m.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                      <span className="font-mono text-xs font-medium text-foreground">{m.month}</span>
                      <span className="font-mono text-xs text-foreground">{m.users.toLocaleString()}</span>
                      <span className="font-mono text-xs text-skill-green">{m.gigs.toLocaleString()}</span>
                      <span className="font-mono text-xs text-badge-gold">{m.revenue}</span>
                      <span className="font-mono text-xs text-court-blue">+{m.newSignups.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Flame size={14} className="text-destructive" /> Top Skills — {currentQuarter.label}</h3>
                  <div className="grid gap-2 sm:grid-cols-5">
                    {currentQuarter.topSkills.map((s, i) => (
                      <div key={s.skill} className="rounded-xl border border-border bg-surface-1 p-3 text-center">
                        <span className="font-mono text-[10px] font-black text-foreground">{i + 1}</span>
                        <p className="text-xs font-semibold text-foreground mt-1 truncate">{s.skill}</p>
                        <p className="text-[9px] text-muted-foreground">{s.gigs.toLocaleString()} gigs</p>
                        <span className="font-mono text-[10px] font-bold text-skill-green">{s.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* 4. GROWTH CHART */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">Platform Growth</h2>
                <p className="text-sm text-muted-foreground mt-1">Historical + projected (starred = projected)</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                {(["users", "gigs"] as const).map((m) => (
                  <button key={m} onClick={() => setChartMetric(m)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${chartMetric === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {m === "users" ? "Users" : "Gigs"}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {growthTimeline.map((d, i) => {
                  const isProjected = d.month.includes("*");
                  return (
                    <motion.div key={d.month} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${(d[chartMetric] / maxVal) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                      <div className={`absolute inset-0 rounded-t-lg transition-colors ${isProjected ? "bg-foreground/30 group-hover:bg-foreground/50 border-t-2 border-dashed border-foreground/40" : "bg-foreground/70 group-hover:bg-foreground"}`} />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background whitespace-nowrap z-10">
                        {d[chartMetric].toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                {growthTimeline.map((d) => (<div key={d.month} className="flex-1 text-center font-mono text-[8px] text-muted-foreground">{d.month.replace("*", "")}</div>))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2"><div className="h-3 w-6 rounded bg-foreground/70" /><span className="text-[10px] text-muted-foreground">Actual</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-6 rounded bg-foreground/30 border-t border-dashed border-foreground/40" /><span className="text-[10px] text-muted-foreground">Projected</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FORMAT DISTRIBUTION */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Gig Format Distribution</h2>
            <div className="space-y-3">
              {formatDistribution.map((f, i) => (
                <motion.div key={f.format} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 flex-shrink-0"><f.icon size={14} className="text-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{f.format}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{f.count.toLocaleString()} · {f.pct}%</span>
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

        {/* 6. ECONOMY HEALTH */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Economy Health Monitor</h2>
              <p className="text-sm text-muted-foreground">Real-time health indicators for the Skill Points economy</p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {economyHealth.map((e, i) => (
                <motion.div key={e.metric} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">{e.metric}</span>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${e.status === "healthy" ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"}`}>
                      {e.status === "healthy" && <CheckCircle2 size={9} />}{e.status === "healthy" ? "Healthy" : "Normal"}
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

        {/* 7. REVENUE */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Revenue Breakdown</h2>
            <div className="space-y-3">
              {revenueBreakdown.map((r, i) => (
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

        {/* 8. RETENTION */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Retention & Engagement</h2>
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Cohort</span><span>Day 1</span><span>Day 7</span><span>Day 30</span><span>Day 90</span>
                </div>
                {retentionData.cohorts.map((c, i) => (
                  <motion.div key={c.month} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-4 py-3">
                    <span className="font-mono text-[10px] text-foreground">{c.month}</span>
                    {[c.d1, c.d7, c.d30, c.d90].map((v, j) => (
                      <span key={j} className={`font-mono text-xs font-bold ${typeof v === "number" && v >= 70 ? "text-skill-green" : typeof v === "number" && v >= 40 ? "text-badge-gold" : typeof v === "number" ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                        {typeof v === "number" ? `${v}%` : v}
                      </span>
                    ))}
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "Avg Session Length", value: retentionData.avgSessionLength, icon: Clock },
                  { label: "Avg Gigs / User", value: String(retentionData.avgGigsPerUser), icon: ArrowLeftRight },
                  { label: "Monthly Churn", value: retentionData.churnRate, icon: TrendingDown },
                  { label: "Net Promoter Score", value: String(retentionData.nps), icon: ThumbsUp },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 flex-shrink-0"><m.icon size={16} className="text-foreground" /></div>
                    <div>
                      <p className="font-heading text-lg font-black text-foreground">{m.value}</p>
                      <p className="text-[9px] text-muted-foreground">{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. CONTENT METRICS */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Content & Communication</h2>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
              {contentMetrics.map((m, i) => (
                <motion.div key={m.type} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-4 text-center">
                  <m.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-lg font-black text-foreground">{m.count}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{m.type}</p>
                  <span className="font-mono text-[9px] text-skill-green font-bold">{m.growth}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. UPTIME */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Platform Uptime</h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Month</span><span>Uptime</span><span>Incidents</span><span>Avg Response</span>
              </div>
              {platformUptime.map((u, i) => (
                <motion.div key={u.month} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="grid grid-cols-4 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                  <span className="font-mono text-xs text-foreground">{u.month}</span>
                  <span className={`font-mono text-xs font-bold ${u.uptime >= 99.95 ? "text-skill-green" : "text-badge-gold"}`}>{u.uptime}%</span>
                  <span className={`font-mono text-xs ${u.incidents === 0 ? "text-skill-green" : "text-foreground"}`}>{u.incidents}</span>
                  <span className="font-mono text-xs text-muted-foreground">{u.avgResponse}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. COMMUNITY IMPACT */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">Community Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communityImpact.map((m, i) => {
                const { count, ref } = useCountUp(m.value, 2500);
                return (
                  <motion.div key={m.metric} ref={ref} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                    <m.icon size={22} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="font-heading text-3xl font-black text-foreground">{count.toLocaleString()}{m.suffix}</p>
                    <p className="text-xs font-semibold text-foreground mt-1">{m.metric}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{m.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 12. HALL OF FAME */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Crown size={28} className="mx-auto mb-3 text-badge-gold" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Hall of Fame</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hallOfFame.map((h, i) => (
                <motion.div key={h.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-badge-gold/15 bg-card p-5 text-center hover:border-badge-gold/30 transition-colors">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-badge-gold/10 border border-badge-gold/20 font-heading text-sm font-bold text-badge-gold">{h.avatar}</div>
                  <h3 className="text-sm font-bold text-foreground">{h.name}</h3>
                  <p className="text-[10px] text-badge-gold font-medium mt-0.5">{h.title}</p>
                  <p className="font-heading text-lg font-black text-foreground mt-2">{h.value}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold ${h.tier === "Diamond" ? "bg-court-blue/10 text-court-blue border border-court-blue/20" : h.tier === "Guild" ? "bg-skill-green/10 text-skill-green border border-skill-green/20" : h.tier === "Platinum" ? "bg-foreground/10 text-foreground border border-border" : "bg-badge-gold/10 text-badge-gold border border-badge-gold/20"}`}>{h.tier}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* 13. TELEMETRY — Real-Time User Behavior */}
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
              {/* Top Pages */}
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

              {/* Top Clicked Elements */}
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

            {/* Error Log Summary */}
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
  );
};

export default AnalyticsPage;
