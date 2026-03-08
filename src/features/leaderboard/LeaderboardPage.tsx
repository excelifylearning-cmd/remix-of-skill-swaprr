import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Crown, Medal, Star, TrendingUp, Users, Shield, GraduationCap,
  Flame, Zap, ArrowUp, Target, Award, Swords, BarChart3, Timer,
  ChevronRight, Sparkles, Eye
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const tabs = ["Global", "By Skill", "Guilds", "Judges", "Rising Stars", "Universities", "Hall of Fame"];

const globalLeaders = [
  { rank: 1, name: "Chen L.", elo: 1850, university: "MIT", skill: "Full-Stack Dev", gigs: 234, rating: 5.0, avatar: "CL", tier: "Diamond", streak: 45, points: 12400 },
  { rank: 2, name: "Aisha K.", elo: 1790, university: "Stanford", skill: "UI/UX Design", gigs: 189, rating: 4.9, avatar: "AK", tier: "Diamond", streak: 38, points: 10800 },
  { rank: 3, name: "Marco R.", elo: 1750, university: "Oxford", skill: "Data Science", gigs: 156, rating: 5.0, avatar: "MR", tier: "Platinum", streak: 29, points: 9200 },
  { rank: 4, name: "Priya S.", elo: 1720, university: "Cambridge", skill: "Mobile Dev", gigs: 142, rating: 4.9, avatar: "PS", tier: "Platinum", streak: 22, points: 8500 },
  { rank: 5, name: "James L.", elo: 1680, university: "UCLA", skill: "Video Production", gigs: 128, rating: 4.8, avatar: "JL", tier: "Gold", streak: 18, points: 7200 },
  { rank: 6, name: "Lena S.", elo: 1650, university: "NYU", skill: "Illustration", gigs: 115, rating: 4.9, avatar: "LS", tier: "Gold", streak: 15, points: 6800 },
  { rank: 7, name: "Dev K.", elo: 1620, university: "Georgia Tech", skill: "Backend Dev", gigs: 98, rating: 4.8, avatar: "DK", tier: "Gold", streak: 12, points: 5900 },
  { rank: 8, name: "Maya K.", elo: 1600, university: "USC", skill: "Logo Design", gigs: 87, rating: 4.7, avatar: "MK", tier: "Gold", streak: 10, points: 5200 },
  { rank: 9, name: "Omar H.", elo: 1580, university: "Berkeley", skill: "Motion Graphics", gigs: 76, rating: 4.9, avatar: "OH", tier: "Silver", streak: 8, points: 4600 },
  { rank: 10, name: "Nina F.", elo: 1560, university: "Michigan", skill: "Copywriting", gigs: 68, rating: 4.6, avatar: "NF", tier: "Silver", streak: 6, points: 4100 },
  { rank: 11, name: "Raj P.", elo: 1540, university: "IIT Delhi", skill: "ML Engineering", gigs: 62, rating: 4.8, avatar: "RP", tier: "Silver", streak: 5, points: 3800 },
  { rank: 12, name: "Sophie W.", elo: 1520, university: "ETH Zurich", skill: "3D Modeling", gigs: 55, rating: 4.7, avatar: "SW", tier: "Silver", streak: 4, points: 3400 },
];

const skillLeaders = [
  { skill: "UI/UX Design", icon: "🎨", leaders: [
    { name: "Aisha K.", elo: 1790, gigs: 189, rating: 4.9 },
    { name: "Lena S.", elo: 1650, gigs: 115, rating: 4.9 },
    { name: "Maya K.", elo: 1600, gigs: 87, rating: 4.7 },
  ]},
  { skill: "Full-Stack Dev", icon: "💻", leaders: [
    { name: "Chen L.", elo: 1850, gigs: 234, rating: 5.0 },
    { name: "Dev K.", elo: 1620, gigs: 98, rating: 4.8 },
    { name: "James T.", elo: 1580, gigs: 76, rating: 4.8 },
  ]},
  { skill: "Data Science", icon: "📊", leaders: [
    { name: "Marco R.", elo: 1750, gigs: 156, rating: 5.0 },
    { name: "Raj P.", elo: 1540, gigs: 62, rating: 4.8 },
    { name: "Priya S.", elo: 1520, gigs: 55, rating: 4.7 },
  ]},
  { skill: "Video & Motion", icon: "🎬", leaders: [
    { name: "James L.", elo: 1680, gigs: 128, rating: 4.8 },
    { name: "Omar H.", elo: 1580, gigs: 76, rating: 4.9 },
    { name: "Zara N.", elo: 1420, gigs: 42, rating: 4.6 },
  ]},
  { skill: "Copywriting", icon: "✍️", leaders: [
    { name: "Nina F.", elo: 1560, gigs: 68, rating: 4.6 },
    { name: "Tom W.", elo: 1380, gigs: 34, rating: 4.5 },
    { name: "Kate M.", elo: 1350, gigs: 28, rating: 4.7 },
  ]},
  { skill: "3D & Animation", icon: "🧊", leaders: [
    { name: "Sophie W.", elo: 1520, gigs: 55, rating: 4.7 },
    { name: "Alex F.", elo: 1490, gigs: 48, rating: 4.6 },
    { name: "Kim J.", elo: 1400, gigs: 35, rating: 4.5 },
  ]},
];

const guildLeaders = [
  { rank: 1, name: "Code Collective", elo: 1720, members: 28, wars: 15, warWins: 12, treasury: 4500, gigs: 890, avatar: "CC", specialty: "Full-Stack Development" },
  { rank: 2, name: "Design Union", elo: 1680, members: 32, wars: 12, warWins: 9, treasury: 3800, gigs: 720, avatar: "DU", specialty: "UI/UX & Branding" },
  { rank: 3, name: "Data Wizards", elo: 1650, members: 18, wars: 10, warWins: 7, treasury: 2900, gigs: 540, avatar: "DW", specialty: "Data Science & ML" },
  { rank: 4, name: "Media Masters", elo: 1600, members: 24, wars: 8, warWins: 5, treasury: 2100, gigs: 480, avatar: "MM", specialty: "Video & Motion" },
  { rank: 5, name: "Pixel Perfect", elo: 1560, members: 20, wars: 6, warWins: 4, treasury: 1800, gigs: 380, avatar: "PP", specialty: "Illustration & Art" },
];

const judges = [
  { name: "James T.", accuracy: "96%", cases: 145, elo: 1720, badge: "Expert Judge", fairness: "98%", avgTime: "4.2h", specialties: ["Full-Stack", "Backend"] },
  { name: "Priya S.", accuracy: "94%", cases: 112, elo: 1680, badge: "Senior Judge", fairness: "97%", avgTime: "5.1h", specialties: ["Mobile", "UI/UX"] },
  { name: "Aisha K.", accuracy: "93%", cases: 98, elo: 1650, badge: "Senior Judge", fairness: "96%", avgTime: "3.8h", specialties: ["Design", "Branding"] },
  { name: "Dev K.", accuracy: "91%", cases: 76, elo: 1600, badge: "Judge", fairness: "95%", avgTime: "6.2h", specialties: ["Backend", "DevOps"] },
  { name: "Marco R.", accuracy: "90%", cases: 64, elo: 1580, badge: "Judge", fairness: "94%", avgTime: "5.5h", specialties: ["Data", "ML"] },
];

const risingStars = [
  { name: "Alex F.", elo: 1490, growth: "+180", streak: 14, joined: "2 months ago", avatar: "AF", gigs: 48, skill: "3D Modeling" },
  { name: "Zara N.", elo: 1420, growth: "+150", streak: 21, joined: "3 months ago", avatar: "ZN", gigs: 42, skill: "Motion Graphics" },
  { name: "Tom W.", elo: 1380, growth: "+120", streak: 8, joined: "1 month ago", avatar: "TW", gigs: 34, skill: "Copywriting" },
  { name: "Kate M.", elo: 1350, growth: "+110", streak: 12, joined: "6 weeks ago", avatar: "KM", gigs: 28, skill: "Marketing" },
  { name: "Rio D.", elo: 1320, growth: "+100", streak: 9, joined: "5 weeks ago", avatar: "RD", gigs: 22, skill: "Photography" },
  { name: "Lisa C.", elo: 1290, growth: "+95", streak: 7, joined: "2 months ago", avatar: "LC", gigs: 19, skill: "Illustration" },
];

const universities = [
  { name: "MIT", students: 450, avgElo: 1580, gigs: 3200, topSkill: "Engineering", growth: "+12%" },
  { name: "Stanford", students: 380, avgElo: 1560, gigs: 2800, topSkill: "AI/ML", growth: "+18%" },
  { name: "Oxford", students: 320, avgElo: 1540, gigs: 2400, topSkill: "Data Science", growth: "+9%" },
  { name: "Cambridge", students: 290, avgElo: 1520, gigs: 2100, topSkill: "Research", growth: "+11%" },
  { name: "UCLA", students: 410, avgElo: 1500, gigs: 2600, topSkill: "Design", growth: "+15%" },
  { name: "NYU", students: 350, avgElo: 1480, gigs: 2200, topSkill: "Media", growth: "+14%" },
  { name: "Georgia Tech", students: 280, avgElo: 1470, gigs: 1900, topSkill: "Development", growth: "+10%" },
  { name: "IIT Delhi", students: 220, avgElo: 1460, gigs: 1600, topSkill: "ML Engineering", growth: "+22%" },
];

const hallOfFame = [
  { name: "Chen L.", title: "The Pioneer", desc: "First user to reach Diamond tier. 234 gigs completed with a perfect 5.0 rating across 45-day streak.", avatar: "CL", tier: "Diamond", achievement: "First Diamond" },
  { name: "Aisha K.", title: "The Designer", desc: "Set the standard for design excellence. Mentored 50+ designers through guild leadership and court judging.", avatar: "AK", tier: "Diamond", achievement: "Design Legend" },
  { name: "Marco R.", title: "The Analyst", desc: "Revolutionized data science exchanges. Created the template for Skill Fusion data projects.", avatar: "MR", tier: "Platinum", achievement: "Data Pioneer" },
  { name: "Code Collective", title: "Guild of the Year", desc: "12 Guild War victories. 890 gigs completed collectively. Set the benchmark for team excellence.", avatar: "CC", tier: "Diamond", achievement: "War Champion" },
];

const tierColor = (t: string) => {
  if (t === "Diamond") return "text-court-blue";
  if (t === "Platinum") return "text-foreground";
  if (t === "Gold") return "text-badge-gold";
  return "text-muted-foreground";
};

const tierBg = (t: string) => {
  if (t === "Diamond") return "bg-court-blue/10 border-court-blue/20";
  if (t === "Platinum") return "bg-foreground/5 border-foreground/20";
  if (t === "Gold") return "bg-badge-gold/10 border-badge-gold/20";
  return "bg-surface-2 border-border";
};

const rankIcon = (r: number) => {
  if (r === 1) return <Crown size={18} className="text-badge-gold" />;
  if (r === 2) return <Medal size={18} className="text-muted-foreground" />;
  if (r === 3) return <Medal size={18} className="text-orange-400" />;
  return <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-muted-foreground">#{r}</span>;
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Global");
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Spline 3D Hero */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--badge-gold)/0.06),transparent_50%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              {/* Left: Text */}
              <div>
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full border border-badge-gold/20 bg-badge-gold/5 px-4 py-1.5 font-mono text-xs text-badge-gold">
                  <Trophy size={12} className="mr-1.5 inline" /> Live Rankings
                </motion.span>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
                  Leader<span className="text-muted-foreground">board</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 max-w-md text-lg text-muted-foreground">
                  The best of the best. Climb the ELO ranks, compete with guilds, and earn your place in the Hall of Fame.
                </motion.p>

                {/* Live Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-6">
                  {[
                    { value: "12,450", label: "Active Users" },
                    { value: "1,850", label: "Top ELO" },
                    { value: "50+", label: "Guilds" },
                    { value: "8", label: "Universities" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: Spline 3D Embed */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative aspect-square max-h-[500px] w-full">
                <iframe
                  src="https://my.spline.design/trophyanimation-fbcf7bc893da12b81cee58e3bbee9de6/"
                  className="h-full w-full rounded-2xl border border-border"
                  style={{ background: "transparent" }}
                  title="3D Trophy"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown size={20} className="text-badge-gold" />
                      <div>
                        <p className="text-sm font-bold text-foreground">#1 Chen L.</p>
                        <p className="text-[10px] text-muted-foreground">ELO 1850 · Diamond</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-skill-green">
                      <ArrowUp size={14} />
                      <span className="font-mono text-sm font-bold">+23</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tabs + Timeframe */}
        <div className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === tab ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex gap-1 rounded-full border border-border p-1">
                {(["all", "month", "week"] as const).map((t) => (
                  <button key={t} onClick={() => setTimeframe(t)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${timeframe === t ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                    {t === "all" ? "All Time" : t === "month" ? "This Month" : "This Week"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatePresence mode="wait">
              {activeTab === "Global" && (
                <motion.div key="global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Top 3 Podium */}
                  <div className="mb-12 grid gap-4 md:grid-cols-3">
                    {globalLeaders.slice(0, 3).map((user, i) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12, type: "spring" }}
                        className={`rounded-2xl border p-8 text-center transition-all hover:shadow-lg ${
                          i === 0 ? `${tierBg(user.tier)} md:order-2 md:-mt-6` : i === 1 ? "border-muted-foreground/20 bg-card md:order-1" : "border-border bg-card md:order-3"
                        }`}
                      >
                        <div className="mb-2">{rankIcon(user.rank)}</div>
                        <div className={`mx-auto my-3 flex h-20 w-20 items-center justify-center rounded-full font-heading text-xl font-bold text-foreground ${i === 0 ? "bg-badge-gold/10 ring-2 ring-badge-gold/30" : "bg-surface-2"}`}>
                          {user.avatar}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-foreground">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.university} · {user.skill}</p>
                        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-semibold ${tierBg(user.tier)} ${tierColor(user.tier)}`}>{user.tier}</span>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div><p className={`font-mono text-lg font-black ${tierColor(user.tier)}`}>{user.elo}</p><p className="text-[9px] text-muted-foreground">ELO</p></div>
                          <div><p className="font-mono text-lg font-black text-foreground">{user.gigs}</p><p className="text-[9px] text-muted-foreground">Gigs</p></div>
                          <div><p className="font-mono text-lg font-black text-badge-gold">★ {user.rating}</p><p className="text-[9px] text-muted-foreground">Rating</p></div>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Flame size={10} className="text-badge-gold" />{user.streak}d streak</span>
                          <span>{user.points.toLocaleString()} SP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Rank List */}
                  <div className="space-y-2">
                    {globalLeaders.slice(3).map((user, i) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.04 }}
                        className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:bg-card/80"
                      >
                        {rankIcon(user.rank)}
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground">{user.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground">{user.university} · {user.skill}</p>
                        </div>
                        <span className={`hidden sm:inline rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${tierBg(user.tier)} ${tierColor(user.tier)}`}>{user.tier}</span>
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground"><Flame size={10} className="text-badge-gold" />{user.streak}d</div>
                        <span className="font-mono text-sm font-bold text-foreground">{user.elo}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-badge-gold text-badge-gold" />
                          <span className="font-mono text-xs text-badge-gold">{user.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "By Skill" && (
                <motion.div key="skill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {skillLeaders.map((s, i) => (
                    <motion.div key={s.skill} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <h3 className="font-heading text-base font-bold text-foreground">{s.skill}</h3>
                      </div>
                      {s.leaders.map((l, j) => (
                        <div key={l.name} className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0 last:pb-0">
                          {rankIcon(j + 1)}
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">{l.name}</span>
                            <p className="text-[10px] text-muted-foreground">{l.gigs} gigs · ★ {l.rating}</p>
                          </div>
                          <span className="font-mono text-xs font-semibold text-foreground">{l.elo}</span>
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Guilds" && (
                <motion.div key="guilds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {guildLeaders.map((g, i) => (
                    <motion.div key={g.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          {rankIcon(g.rank)}
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 font-mono text-base font-bold text-foreground">{g.avatar}</div>
                          <div>
                            <p className="font-heading text-base font-bold text-foreground">{g.name}</p>
                            <p className="text-xs text-muted-foreground">{g.specialty}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-wrap gap-6 sm:justify-end">
                          <div className="text-center"><p className="font-mono text-lg font-bold text-foreground">{g.elo}</p><p className="text-[9px] text-muted-foreground">ELO</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-foreground">{g.members}</p><p className="text-[9px] text-muted-foreground">Members</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-skill-green">{g.warWins}/{g.wars}</p><p className="text-[9px] text-muted-foreground">Wars Won</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-badge-gold">{g.treasury.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Treasury SP</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-foreground">{g.gigs}</p><p className="text-[9px] text-muted-foreground">Total Gigs</p></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Judges" && (
                <motion.div key="judges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {judges.map((j, i) => (
                    <motion.div key={j.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          {rankIcon(i + 1)}
                          <div>
                            <p className="font-heading text-base font-bold text-foreground">{j.name}</p>
                            <span className="rounded-full bg-court-blue/10 px-2.5 py-0.5 text-[10px] font-medium text-court-blue">{j.badge}</span>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-wrap gap-6 sm:justify-end">
                          <div className="text-center"><p className="font-mono text-lg font-bold text-skill-green">{j.accuracy}</p><p className="text-[9px] text-muted-foreground">Accuracy</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-foreground">{j.cases}</p><p className="text-[9px] text-muted-foreground">Cases</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-court-blue">{j.fairness}</p><p className="text-[9px] text-muted-foreground">Fairness</p></div>
                          <div className="text-center"><p className="font-mono text-lg font-bold text-muted-foreground">{j.avgTime}</p><p className="text-[9px] text-muted-foreground">Avg Time</p></div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {j.specialties.map((s) => (
                          <span key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Rising Stars" && (
                <motion.div key="rising" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {risingStars.map((s, i) => (
                    <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-skill-green/10 font-mono text-sm font-bold text-skill-green">{s.avatar}</div>
                        <div>
                          <p className="font-heading text-sm font-bold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.skill} · Joined {s.joined}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><p className="font-mono text-lg font-bold text-foreground">{s.elo}</p><p className="text-[9px] text-muted-foreground">ELO</p></div>
                        <div><p className="flex items-center gap-0.5 font-mono text-lg font-bold text-skill-green"><ArrowUp size={14} />{s.growth}</p><p className="text-[9px] text-muted-foreground">Growth</p></div>
                        <div><p className="flex items-center gap-0.5 font-mono text-lg font-bold text-badge-gold"><Flame size={14} />{s.streak}</p><p className="text-[9px] text-muted-foreground">Streak</p></div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground">{s.gigs} gigs completed</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Universities" && (
                <motion.div key="uni" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {universities.map((u, i) => (
                    <motion.div key={u.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-muted-foreground">#{i + 1}</span>
                      <GraduationCap size={20} className="text-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-bold text-foreground">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground">{u.students} students · Top: {u.topSkill}</p>
                      </div>
                      <div className="flex gap-6 text-right">
                        <div><p className="font-mono text-sm font-bold text-foreground">{u.avgElo}</p><p className="text-[9px] text-muted-foreground">Avg ELO</p></div>
                        <div><p className="font-mono text-sm font-bold text-foreground">{u.gigs.toLocaleString()}</p><p className="text-[9px] text-muted-foreground">Gigs</p></div>
                        <div className="hidden sm:block"><p className="font-mono text-sm font-bold text-skill-green">{u.growth}</p><p className="text-[9px] text-muted-foreground">Growth</p></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Hall of Fame" && (
                <motion.div key="hof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-10 text-center">
                    <Crown size={36} className="mx-auto mb-3 text-badge-gold" />
                    <h2 className="font-heading text-2xl font-bold text-foreground">Hall of Fame</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Legendary users who shaped the SkillSwappr community</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {hallOfFame.map((u, i) => (
                      <motion.div key={u.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-badge-gold/20 bg-card p-8">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-badge-gold/10 ring-2 ring-badge-gold/20 font-heading text-xl font-bold text-foreground">{u.avatar}</div>
                          <div>
                            <span className="rounded-full bg-badge-gold/10 px-2.5 py-0.5 text-[10px] font-semibold text-badge-gold">{u.achievement}</span>
                            <h3 className="mt-2 font-heading text-lg font-bold text-foreground">{u.name}</h3>
                            <p className="text-sm font-medium text-muted-foreground italic">"{u.title}"</p>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Your Rank CTA */}
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <Trophy size={32} className="mx-auto mb-4 text-badge-gold" />
            <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Where do you rank?</h2>
            <p className="mb-6 text-sm text-muted-foreground">Join SkillSwappr and start climbing the leaderboard today.</p>
            <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-3 text-sm font-semibold text-background">
              Get Started <ArrowUp size={16} />
            </a>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default LeaderboardPage;
