import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  TrendingUp, Users, Coins, ArrowLeftRight, Trophy, Shield, Globe, BarChart3,
  Activity, ArrowUp, ArrowDown, Star, Zap, Flame, Target, Clock, Calendar,
  Sparkles, Building2, GraduationCap, Bot, Scale, Layers, Timer, PieChart,
  ChevronRight, ArrowRight, Eye, Award, Lightbulb, Rocket, CheckCircle2,
  MapPin, Heart, MessageSquare, BookOpen, Crown, Medal, Mic, Video,
  Smartphone, Server, Wifi, Lock, DollarSign, Briefcase, Palette, Code,
  Headphones, Gift, Share2, ThumbsUp, FileText, Hash, Percent, Database,
  MonitorSmartphone, Radio, Music, Gamepad2, Megaphone, Mail, TrendingDown
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";

/* ═══════ HOOKS ═══════ */
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

/* ═══════════════════════════════════════════
   PLATFORM-WIDE DATA
   ═══════════════════════════════════════════ */

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
  { date: "Jul 2025", title: "Flash Market launch", desc: "Time-limited gigs with dynamic pricing go live. Instant matching.", icon: Timer, status: "past" },
  { date: "Jun 2025", title: "10K users", desc: "Rapid growth from 3 university beta to 20-campus network.", icon: TrendingUp, status: "past" },
  { date: "Apr 2025", title: "Marketplace v2 release", desc: "Complete redesign with auctions, filters, and advanced search.", icon: Layers, status: "past" },
  { date: "Mar 2025", title: "Skill Court v2", desc: "Hybrid judging panel with AI analysis and expert panels.", icon: Scale, status: "past" },
  { date: "Jan 2025", title: "First Guild War", desc: "8 guilds battle in the first-ever competitive season.", icon: Trophy, status: "past" },
  { date: "Dec 2024", title: "Guild System launched", desc: "First guilds form with shared treasuries and wars.", icon: Users, status: "past" },
  { date: "Sep 2024", title: "Skill Points economy v1", desc: "SP minting, transfer, and tax system goes live.", icon: Coins, status: "past" },
  { date: "Jun 2024", title: "Public beta", desc: "500 students across 3 universities join initial beta.", icon: Rocket, status: "past" },
  { date: "Mar 2024", title: "First prototype", desc: "MVP built in 8 weeks. Basic swap matching and chat.", icon: Code, status: "past" },
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

/* ═══ NEW DATA SECTIONS ═══ */

const userDemographics = {
  ageGroups: [
    { range: "18–22", pct: 42, label: "Students" },
    { range: "23–28", pct: 31, label: "Early Career" },
    { range: "29–35", pct: 16, label: "Mid Career" },
    { range: "36–45", pct: 8, label: "Senior" },
    { range: "46+", pct: 3, label: "Veteran" },
  ],
  genderSplit: { male: 54, female: 38, nonBinary: 6, preferNot: 2 },
  topCountries: [
    { country: "United States", pct: 28, flag: "🇺🇸", users: 6869 },
    { country: "United Kingdom", pct: 18, flag: "🇬🇧", users: 4416 },
    { country: "Germany", pct: 9, flag: "🇩🇪", users: 2208 },
    { country: "Canada", pct: 8, flag: "🇨🇦", users: 1962 },
    { country: "India", pct: 7, flag: "🇮🇳", users: 1717 },
    { country: "Australia", pct: 5, flag: "🇦🇺", users: 1227 },
    { country: "France", pct: 4, flag: "🇫🇷", users: 981 },
    { country: "Japan", pct: 3, flag: "🇯🇵", users: 736 },
    { country: "Brazil", pct: 3, flag: "🇧🇷", users: 736 },
    { country: "Other", pct: 15, flag: "🌍", users: 3679 },
  ],
};

const retentionData = {
  cohorts: [
    { month: "Sep 2025", d1: 82, d7: 64, d30: 48, d90: 31 },
    { month: "Oct 2025", d1: 85, d7: 68, d30: 52, d90: 35 },
    { month: "Nov 2025", d1: 87, d7: 71, d30: 55, d90: 38 },
    { month: "Dec 2025", d1: 88, d7: 73, d30: 57, d90: 40 },
    { month: "Jan 2026", d1: 89, d7: 74, d30: 58, d90: "—" },
    { month: "Feb 2026", d1: 91, d7: 76, d30: "—", d90: "—" },
  ],
  avgSessionLength: "18 min",
  avgGigsPerUser: 3.6,
  churnRate: "4.2%",
  nps: 72,
};

const monthlyActiveUsers = [
  { month: "Oct '25", mau: 12400, dau: 4200, dauMau: 0.34 },
  { month: "Nov '25", mau: 14200, dau: 5100, dauMau: 0.36 },
  { month: "Dec '25", mau: 15800, dau: 5800, dauMau: 0.37 },
  { month: "Jan '26", mau: 17900, dau: 6900, dauMau: 0.39 },
  { month: "Feb '26", mau: 19600, dau: 7800, dauMau: 0.40 },
  { month: "Mar '26", mau: 21400, dau: 8900, dauMau: 0.42 },
];

const revenueBreakdown = [
  { source: "Enterprise Subscriptions", amount: "$248K", pct: 42, icon: Building2, color: "bg-foreground" },
  { source: "Premium Plans", amount: "$142K", pct: 24, icon: Crown, color: "bg-badge-gold" },
  { source: "Transaction Fees", amount: "$89K", pct: 15, icon: ArrowLeftRight, color: "bg-court-blue" },
  { source: "University Licenses", amount: "$67K", pct: 11, icon: GraduationCap, color: "bg-skill-green" },
  { source: "API Access", amount: "$47K", pct: 8, icon: Code, color: "bg-muted-foreground" },
];

const skillCategories = [
  { name: "Development", gigs: 18400, users: 6200, growth: "+22%", icon: Code, color: "text-skill-green" },
  { name: "Design", gigs: 14800, users: 4900, growth: "+18%", icon: Palette, color: "text-court-blue" },
  { name: "Marketing", gigs: 11200, users: 3800, growth: "+15%", icon: Megaphone, color: "text-badge-gold" },
  { name: "Writing", gigs: 9800, users: 3200, growth: "+12%", icon: FileText, color: "text-foreground" },
  { name: "Video & Audio", gigs: 8400, users: 2600, growth: "+28%", icon: Video, color: "text-destructive" },
  { name: "Data & Analytics", gigs: 7200, users: 2100, growth: "+35%", icon: BarChart3, color: "text-skill-green" },
  { name: "AI & ML", gigs: 5800, users: 1400, growth: "+52%", icon: Bot, color: "text-court-blue" },
  { name: "Music & Audio", gigs: 3200, users: 980, growth: "+19%", icon: Music, color: "text-badge-gold" },
  { name: "Game Dev", gigs: 2800, users: 870, growth: "+24%", icon: Gamepad2, color: "text-destructive" },
  { name: "Consulting", gigs: 2400, users: 640, growth: "+31%", icon: Briefcase, color: "text-foreground" },
];

const seasonalTrends = [
  { season: "Spring '25", gigs: 12400, avgRating: 4.72, topSkill: "UI/UX Design", peakDay: "Wednesday" },
  { season: "Summer '25", gigs: 18900, avgRating: 4.76, topSkill: "React / Next.js", peakDay: "Tuesday" },
  { season: "Fall '25", gigs: 24100, avgRating: 4.79, topSkill: "AI/ML Engineering", peakDay: "Thursday" },
  { season: "Winter '25", gigs: 19800, avgRating: 4.78, topSkill: "Video Production", peakDay: "Monday" },
  { season: "Spring '26", gigs: 14000, avgRating: 4.81, topSkill: "React / Next.js", peakDay: "Wednesday" },
];

const platformUptime = [
  { month: "Oct '25", uptime: 99.94, incidents: 2, avgResponse: "4m" },
  { month: "Nov '25", uptime: 99.97, incidents: 1, avgResponse: "3m" },
  { month: "Dec '25", uptime: 99.91, incidents: 3, avgResponse: "6m" },
  { month: "Jan '26", uptime: 99.98, incidents: 1, avgResponse: "2m" },
  { month: "Feb '26", uptime: 99.99, incidents: 0, avgResponse: "—" },
  { month: "Mar '26", uptime: 99.96, incidents: 1, avgResponse: "5m" },
];

const communityImpact = [
  { metric: "Skills Learned", value: 142000, suffix: "+", icon: BookOpen, desc: "Individual skills exchanged on the platform" },
  { metric: "Hours Saved", value: 890000, suffix: "+", icon: Clock, desc: "Estimated hours saved vs traditional hiring" },
  { metric: "Connections Made", value: 67000, suffix: "+", icon: Heart, desc: "Unique user-to-user connections formed" },
  { metric: "Countries Active", value: 72, suffix: "", icon: Globe, desc: "Countries with at least one active user" },
  { metric: "Forum Posts", value: 52400, suffix: "+", icon: MessageSquare, desc: "Community discussions and knowledge shared" },
  { metric: "Guides Published", value: 240, suffix: "+", icon: FileText, desc: "Community-authored educational guides" },
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

const weeklyPatterns = [
  { day: "Mon", gigs: 3400, pct: 16 },
  { day: "Tue", gigs: 3800, pct: 18 },
  { day: "Wed", gigs: 4200, pct: 20 },
  { day: "Thu", gigs: 3900, pct: 19 },
  { day: "Fri", gigs: 3100, pct: 15 },
  { day: "Sat", gigs: 1400, pct: 7 },
  { day: "Sun", gigs: 1200, pct: 5 },
];

const tierDistribution = [
  { tier: "Bronze", users: 8200, pct: 33, color: "bg-[hsl(30,60%,50%)]" },
  { tier: "Silver", users: 6400, pct: 26, color: "bg-muted-foreground" },
  { tier: "Gold", users: 5100, pct: 21, color: "bg-badge-gold" },
  { tier: "Platinum", users: 3200, pct: 13, color: "bg-court-blue" },
  { tier: "Diamond", users: 1631, pct: 7, color: "bg-foreground" },
];

const userJourneyFunnel = [
  { stage: "Visit Homepage", count: 248000, pct: 100 },
  { stage: "Sign Up", count: 42000, pct: 17 },
  { stage: "Complete Profile", count: 31000, pct: 12.5 },
  { stage: "First Gig Listed", count: 24531, pct: 9.9 },
  { stage: "First Gig Completed", count: 18200, pct: 7.3 },
  { stage: "5+ Gigs Completed", count: 11400, pct: 4.6 },
  { stage: "Reach Gold Tier", count: 5100, pct: 2.1 },
  { stage: "Join a Guild", count: 3800, pct: 1.5 },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

const HistoryPage = () => {
  const [chartMetric, setChartMetric] = useState<"users" | "gigs" | "points">("users");
  const [mauMetric, setMauMetric] = useState<"mau" | "dau" | "dauMau">("mau");
  const maxVal = Math.max(...growthChart.map((d) => d[chartMetric]));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* ═══ 1. HERO ═══ */}
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
                Real-time platform metrics, growth trends, economy health, demographics, skill demand forecasting, and historical milestones — all in one comprehensive dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ 2. LIVE STATS ═══ */}
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

        {/* ═══ 3. GROWTH CHART ═══ */}
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
                  <motion.div key={d.month} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${(d[chartMetric] / maxVal) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
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

        {/* ═══ 4. MAU / DAU ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Engagement</span>
                <h2 className="font-heading text-3xl font-bold text-foreground">Active Users</h2>
                <p className="text-sm text-muted-foreground mt-1">Monthly and daily active user trends</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                {(["mau", "dau", "dauMau"] as const).map((m) => (
                  <button key={m} onClick={() => setMauMetric(m)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${mauMetric === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {m === "mau" ? "MAU" : m === "dau" ? "DAU" : "DAU/MAU"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-3" style={{ height: 180 }}>
                {monthlyActiveUsers.map((d, i) => {
                  const val = d[mauMetric];
                  const maxM = Math.max(...monthlyActiveUsers.map(x => x[mauMetric]));
                  return (
                    <motion.div key={d.month} className="relative flex-1 group" initial={{ height: 0 }} whileInView={{ height: `${(val / maxM) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                      <div className="absolute inset-0 rounded-t-lg bg-court-blue/70 transition-colors group-hover:bg-court-blue" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background whitespace-nowrap z-10">
                        {mauMetric === "dauMau" ? `${(val * 100).toFixed(0)}%` : val.toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-3">
                {monthlyActiveUsers.map((d) => (
                  <div key={d.month} className="flex-1 text-center font-mono text-[9px] text-muted-foreground">{d.month}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 5. FORMAT DISTRIBUTION + TRENDING SKILLS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
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
                          <motion.div className={`h-full rounded-full ${f.color}`} initial={{ width: 0 }} whileInView={{ width: `${f.pct}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Trends</span>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Trending Skills</h2>
                <p className="text-xs text-muted-foreground mb-6">Real-time skill demand index and market rates</p>
                <div className="space-y-2">
                  {trendingSkills.map((s, i) => (
                    <motion.div key={s.skill} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-muted-foreground/20 transition-all">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 font-mono text-[10px] font-black text-foreground flex-shrink-0">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{s.skill}</span>
                          {s.hot && <span className="flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[8px] font-bold text-destructive"><Flame size={8} />Hot</span>}
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

        {/* ═══ 6. SKILL CATEGORIES BREAKDOWN ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Categories</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Skill Categories</h2>
              <p className="text-sm text-muted-foreground">Detailed breakdown of gigs and users across all skill verticals</p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {skillCategories.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-colors">
                  <cat.icon size={18} className={`mb-2 ${cat.color}`} />
                  <h3 className="text-xs font-bold text-foreground">{cat.name}</h3>
                  <div className="mt-2 space-y-1 text-[9px] text-muted-foreground">
                    <p>{cat.gigs.toLocaleString()} gigs</p>
                    <p>{cat.users.toLocaleString()} users</p>
                    <p className="font-mono font-bold text-skill-green">{cat.growth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 7. ECONOMY HEALTH ═══ */}
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
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${e.status === "healthy" ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"}`}>
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

        {/* ═══ 8. REVENUE BREAKDOWN ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-badge-gold/30 bg-badge-gold/10 px-3 py-1 font-mono text-[10px] text-badge-gold">
                <DollarSign size={10} className="mr-1 inline" />Revenue
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Revenue Breakdown</h2>
              <p className="text-sm text-muted-foreground">Monthly recurring revenue by source (MRR: $593K)</p>
            </motion.div>

            <div className="space-y-3">
              {revenueBreakdown.map((r, i) => (
                <motion.div key={r.source} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 flex-shrink-0">
                    <r.icon size={18} className="text-foreground" />
                  </div>
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

        {/* ═══ 9. USER DEMOGRAPHICS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Demographics</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">User Demographics</h2>
              <p className="text-sm text-muted-foreground">Age, gender, and geographic distribution of platform users</p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Age */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Users size={14} /> Age Distribution</h3>
                <div className="space-y-3">
                  {userDemographics.ageGroups.map((ag, i) => (
                    <div key={ag.range}>
                      <div className="flex items-center justify-between mb-1 text-[10px]">
                        <span className="text-foreground font-medium">{ag.range} <span className="text-muted-foreground">({ag.label})</span></span>
                        <span className="font-mono text-muted-foreground">{ag.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} whileInView={{ width: `${ag.pct}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Heart size={14} /> Gender Split</h3>
                <div className="space-y-4">
                  {[
                    { label: "Male", pct: userDemographics.genderSplit.male, color: "bg-court-blue" },
                    { label: "Female", pct: userDemographics.genderSplit.female, color: "bg-badge-gold" },
                    { label: "Non-Binary", pct: userDemographics.genderSplit.nonBinary, color: "bg-skill-green" },
                    { label: "Prefer not to say", pct: userDemographics.genderSplit.preferNot, color: "bg-muted-foreground" },
                  ].map((g) => (
                    <div key={g.label}>
                      <div className="flex items-center justify-between mb-1 text-[10px]">
                        <span className="text-foreground font-medium">{g.label}</span>
                        <span className="font-mono text-muted-foreground">{g.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${g.color}`} initial={{ width: 0 }} whileInView={{ width: `${g.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Globe size={14} /> Top Countries</h3>
                <div className="space-y-2">
                  {userDemographics.topCountries.slice(0, 8).map((c) => (
                    <div key={c.country} className="flex items-center gap-2.5 text-[10px]">
                      <span className="text-sm">{c.flag}</span>
                      <span className="flex-1 text-foreground font-medium">{c.country}</span>
                      <span className="font-mono text-muted-foreground">{c.users.toLocaleString()}</span>
                      <span className="font-mono text-muted-foreground w-8 text-right">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 10. RETENTION & ENGAGEMENT ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Retention</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Retention & Engagement</h2>
              <p className="text-sm text-muted-foreground">Cohort retention rates and key engagement metrics</p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Cohort Table */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-5 gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Cohort</span><span>Day 1</span><span>Day 7</span><span>Day 30</span><span>Day 90</span>
                </div>
                {retentionData.cohorts.map((c, i) => (
                  <motion.div key={c.month} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-5 gap-2 items-center border-b border-border/50 last:border-0 px-4 py-3">
                    <span className="font-mono text-[10px] text-foreground">{c.month}</span>
                    {[c.d1, c.d7, c.d30, c.d90].map((v, j) => (
                      <span key={j} className={`font-mono text-xs font-bold ${typeof v === "number" && v >= 70 ? "text-skill-green" : typeof v === "number" && v >= 40 ? "text-badge-gold" : typeof v === "number" ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                        {typeof v === "number" ? `${v}%` : v}
                      </span>
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="space-y-3">
                {[
                  { label: "Avg Session Length", value: retentionData.avgSessionLength, icon: Clock },
                  { label: "Avg Gigs / User", value: String(retentionData.avgGigsPerUser), icon: ArrowLeftRight },
                  { label: "Monthly Churn", value: retentionData.churnRate, icon: TrendingDown },
                  { label: "Net Promoter Score", value: String(retentionData.nps), icon: ThumbsUp },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 flex-shrink-0">
                      <m.icon size={16} className="text-foreground" />
                    </div>
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

        {/* ═══ 11. USER JOURNEY FUNNEL ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Funnel</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">User Journey Funnel</h2>
              <p className="text-sm text-muted-foreground">Conversion rates from first visit to power user</p>
            </motion.div>

            <div className="space-y-2">
              {userJourneyFunnel.map((stage, i) => (
                <motion.div key={stage.stage} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-4">
                    <div className="w-36 text-right">
                      <p className="text-xs font-medium text-foreground">{stage.stage}</p>
                      <p className="text-[9px] text-muted-foreground">{stage.count.toLocaleString()}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 rounded-lg bg-surface-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-lg bg-gradient-to-r from-foreground/80 to-foreground/40 flex items-center justify-end pr-2"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stage.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }}
                        >
                          <span className="text-[9px] font-mono font-bold text-background">{stage.pct}%</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 12. TIER DISTRIBUTION ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-badge-gold/30 bg-badge-gold/10 px-3 py-1 font-mono text-[10px] text-badge-gold">
                <Crown size={10} className="mr-1 inline" />Ranks
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Tier Distribution</h2>
              <p className="text-sm text-muted-foreground">How users are distributed across competitive tiers</p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-5">
              {tierDistribution.map((t, i) => (
                <motion.div key={t.tier} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-5 text-center">
                  <div className={`mx-auto mb-3 h-3 w-3 rounded-full ${t.color}`} />
                  <h3 className="font-heading text-sm font-bold text-foreground">{t.tier}</h3>
                  <p className="font-heading text-2xl font-black text-foreground mt-1">{t.users.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{t.pct}% of users</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 13. WEEKLY ACTIVITY PATTERNS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Weekly Activity Patterns</h2>
              <p className="text-sm text-muted-foreground">Gig completion distribution by day of week</p>
            </motion.div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-end gap-3" style={{ height: 160 }}>
                {weeklyPatterns.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center">
                    <motion.div
                      className="w-full rounded-t-lg bg-skill-green/70 hover:bg-skill-green transition-colors relative group"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(d.pct / 20) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.6 }}
                      style={{ maxHeight: "100%" }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-foreground px-2 py-1 text-[9px] font-mono font-bold text-background whitespace-nowrap z-10">
                        {d.gigs.toLocaleString()}
                      </div>
                    </motion.div>
                    <span className="mt-2 font-mono text-[10px] text-muted-foreground">{d.day}</span>
                    <span className="font-mono text-[8px] text-muted-foreground/60">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 14. SEASONAL TRENDS ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">Seasons</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Seasonal Trends</h2>
              <p className="text-sm text-muted-foreground">How platform activity varies across seasons</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {seasonalTrends.map((s, i) => (
                <motion.div key={s.season} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold text-foreground mb-3">{s.season}</h3>
                  <div className="space-y-2 text-[10px] text-muted-foreground">
                    <div className="flex justify-between"><span>Gigs</span><span className="font-mono text-foreground font-bold">{s.gigs.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Avg Rating</span><span className="font-mono text-badge-gold font-bold">{s.avgRating}★</span></div>
                    <div className="flex justify-between"><span>Top Skill</span><span className="text-foreground font-medium truncate ml-2">{s.topSkill}</span></div>
                    <div className="flex justify-between"><span>Peak Day</span><span className="text-foreground">{s.peakDay}</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 15. CONTENT METRICS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Content & Communication</h2>
              <p className="text-sm text-muted-foreground">Platform-wide content creation and communication metrics</p>
            </motion.div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
              {contentMetrics.map((m, i) => (
                <motion.div key={m.type} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 text-center">
                  <m.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-lg font-black text-foreground">{m.count}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{m.type}</p>
                  <span className="font-mono text-[9px] text-skill-green font-bold">{m.growth}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 16. FORECASTING ═══ */}
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
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${f.confidence === "High" ? "bg-skill-green/10 text-skill-green" : f.confidence === "Medium" ? "bg-badge-gold/10 text-badge-gold" : "bg-surface-2 text-muted-foreground"}`}>{f.confidence}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><p className="font-mono text-sm font-bold text-foreground">{f.users}</p><p className="text-[9px] text-muted-foreground">Users</p></div>
                      <div><p className="font-mono text-sm font-bold text-skill-green">{f.gigs}</p><p className="text-[9px] text-muted-foreground">Gigs</p></div>
                      <div><p className="font-mono text-sm font-bold text-badge-gold">{f.points}</p><p className="text-[9px] text-muted-foreground">Points</p></div>
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

        {/* ═══ 17. GUILD LEADERBOARD + UNIVERSITY RANKINGS ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
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
                      <div className="col-span-2"><p className="text-xs font-semibold text-foreground">{g.name}</p><p className="text-[9px] text-muted-foreground">{g.members} members</p></div>
                      <span className="font-mono text-xs font-bold text-foreground">{g.elo.toLocaleString()}</span>
                      <span className="font-mono text-xs text-muted-foreground">{g.wars}W</span>
                      <span className="font-mono text-[10px] text-skill-green">{g.treasury}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

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
                      <div className="col-span-2"><p className="text-xs font-semibold text-foreground">{u.name}</p><p className="text-[9px] text-muted-foreground">{u.gigs.toLocaleString()} gigs</p></div>
                      <span className="font-mono text-xs text-foreground">{u.users.toLocaleString()}</span>
                      <span className="font-mono text-xs text-badge-gold">{u.avgElo.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 18. COURT ANALYTICS ═══ */}
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

        {/* ═══ 19. PLATFORM UPTIME ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-skill-green/30 bg-skill-green/10 px-3 py-1 font-mono text-[10px] text-skill-green">
                <Server size={10} className="mr-1 inline" />Infrastructure
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Platform Uptime</h2>
              <p className="text-sm text-muted-foreground">Service reliability and incident tracking</p>
            </motion.div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface-2 px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Month</span><span>Uptime</span><span>Incidents</span><span>Avg Response</span>
              </div>
              {platformUptime.map((u, i) => (
                <motion.div key={u.month} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-4 gap-2 items-center border-b border-border/50 last:border-0 px-5 py-3.5">
                  <span className="font-mono text-xs text-foreground">{u.month}</span>
                  <span className={`font-mono text-xs font-bold ${u.uptime >= 99.95 ? "text-skill-green" : "text-badge-gold"}`}>{u.uptime}%</span>
                  <span className={`font-mono text-xs ${u.incidents === 0 ? "text-skill-green" : "text-foreground"}`}>{u.incidents}</span>
                  <span className="font-mono text-xs text-muted-foreground">{u.avgResponse}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-skill-green" />
                <span className="text-[10px] text-muted-foreground">Overall: 99.96% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-badge-gold" />
                <span className="text-[10px] text-muted-foreground">8 incidents total</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 20. COMMUNITY IMPACT ═══ */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-2 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">
                <Heart size={10} className="mr-1 inline text-destructive" />Impact
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Community Impact</h2>
              <p className="text-sm text-muted-foreground">The real-world difference SkillSwappr has made</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communityImpact.map((m, i) => {
                const { count, ref } = useCountUp(m.value, 2500);
                return (
                  <motion.div key={m.metric} ref={ref} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-border bg-card p-6 text-center">
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

        {/* ═══ 21. HALL OF FAME ═══ */}
        <section className="bg-surface-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Crown size={28} className="mx-auto mb-3 text-badge-gold" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-1">Hall of Fame</h2>
              <p className="text-sm text-muted-foreground">Platform record holders and all-time legends</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hallOfFame.map((h, i) => (
                <motion.div key={h.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-badge-gold/15 bg-card p-5 text-center hover:border-badge-gold/30 transition-colors">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-badge-gold/10 border border-badge-gold/20 font-heading text-sm font-bold text-badge-gold">
                    {h.avatar}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{h.name}</h3>
                  <p className="text-[10px] text-badge-gold font-medium mt-0.5">{h.title}</p>
                  <p className="font-heading text-lg font-black text-foreground mt-2">{h.value}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    h.tier === "Diamond" ? "bg-court-blue/10 text-court-blue border border-court-blue/20" :
                    h.tier === "Guild" ? "bg-skill-green/10 text-skill-green border border-skill-green/20" :
                    h.tier === "Platinum" ? "bg-foreground/10 text-foreground border border-border" :
                    "bg-badge-gold/10 text-badge-gold border border-badge-gold/20"
                  }`}>{h.tier}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 22. PLATFORM MILESTONES TIMELINE ═══ */}
        <section className="py-20">
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

      </div>
    </PageTransition>
  );
};

export default HistoryPage;
