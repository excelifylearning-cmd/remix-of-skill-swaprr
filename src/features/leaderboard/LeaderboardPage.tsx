import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Crown, Medal, Star, TrendingUp, Users, Shield, GraduationCap,
  Flame, Zap, ArrowUp, Target
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const tabs = ["Global", "By Skill", "Guilds", "Judges", "Rising Stars", "Universities", "Hall of Fame"];

const globalLeaders = [
  { rank: 1, name: "Chen L.", elo: 1850, university: "MIT", skill: "Full-Stack Dev", gigs: 234, rating: 5.0, avatar: "CL", tier: "Diamond" },
  { rank: 2, name: "Aisha K.", elo: 1790, university: "Stanford", skill: "UI/UX Design", gigs: 189, rating: 4.9, avatar: "AK", tier: "Diamond" },
  { rank: 3, name: "Marco R.", elo: 1750, university: "Oxford", skill: "Data Science", gigs: 156, rating: 5.0, avatar: "MR", tier: "Platinum" },
  { rank: 4, name: "Priya S.", elo: 1720, university: "Cambridge", skill: "Mobile Dev", gigs: 142, rating: 4.9, avatar: "PS", tier: "Platinum" },
  { rank: 5, name: "James L.", elo: 1680, university: "UCLA", skill: "Video Production", gigs: 128, rating: 4.8, avatar: "JL", tier: "Gold" },
  { rank: 6, name: "Lena S.", elo: 1650, university: "NYU", skill: "Illustration", gigs: 115, rating: 4.9, avatar: "LS", tier: "Gold" },
  { rank: 7, name: "Dev K.", elo: 1620, university: "Georgia Tech", skill: "Backend Dev", gigs: 98, rating: 4.8, avatar: "DK", tier: "Gold" },
  { rank: 8, name: "Maya K.", elo: 1600, university: "USC", skill: "Logo Design", gigs: 87, rating: 4.7, avatar: "MK", tier: "Gold" },
  { rank: 9, name: "Omar H.", elo: 1580, university: "Berkeley", skill: "Motion Graphics", gigs: 76, rating: 4.9, avatar: "OH", tier: "Silver" },
  { rank: 10, name: "Nina F.", elo: 1560, university: "Michigan", skill: "Copywriting", gigs: 68, rating: 4.6, avatar: "NF", tier: "Silver" },
];

const skillLeaders = [
  { skill: "UI/UX Design", leaders: ["Aisha K.", "Lena S.", "Maya K."] },
  { skill: "Full-Stack Dev", leaders: ["Chen L.", "Dev K.", "James T."] },
  { skill: "Data Science", leaders: ["Marco R.", "Raj P.", "Priya S."] },
  { skill: "Video Production", leaders: ["James L.", "Omar H.", "Zara N."] },
];

const guildLeaders = [
  { name: "Code Collective", elo: 1720, members: 28, wars: 15, treasury: 4500, avatar: "CC" },
  { name: "Design Union", elo: 1680, members: 32, wars: 12, treasury: 3800, avatar: "DU" },
  { name: "Data Wizards", elo: 1650, members: 18, wars: 10, treasury: 2900, avatar: "DW" },
  { name: "Media Masters", elo: 1600, members: 24, wars: 8, treasury: 2100, avatar: "MM" },
];

const risingStars = [
  { name: "Alex F.", elo: 1490, growth: "+180", streak: 14, joined: "2 months ago", avatar: "AF" },
  { name: "Zara N.", elo: 1420, growth: "+150", streak: 21, joined: "3 months ago", avatar: "ZN" },
  { name: "Tom W.", elo: 1380, growth: "+120", streak: 8, joined: "1 month ago", avatar: "TW" },
  { name: "Kate M.", elo: 1350, growth: "+110", streak: 12, joined: "6 weeks ago", avatar: "KM" },
];

const universities = [
  { name: "MIT", students: 450, avgElo: 1580, gigs: 3200 },
  { name: "Stanford", students: 380, avgElo: 1560, gigs: 2800 },
  { name: "Oxford", students: 320, avgElo: 1540, gigs: 2400 },
  { name: "Cambridge", students: 290, avgElo: 1520, gigs: 2100 },
  { name: "UCLA", students: 410, avgElo: 1500, gigs: 2600 },
];

const tierColor = (t: string) => {
  if (t === "Diamond") return "text-court-blue";
  if (t === "Platinum") return "text-foreground";
  if (t === "Gold") return "text-badge-gold";
  return "text-muted-foreground";
};

const rankIcon = (r: number) => {
  if (r === 1) return <Crown size={16} className="text-badge-gold" />;
  if (r === 2) return <Medal size={16} className="text-muted-foreground" />;
  if (r === 3) return <Medal size={16} className="text-orange-400" />;
  return <span className="font-mono text-xs text-muted-foreground">#{r}</span>;
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Global");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--badge-gold)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Leaderboard
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground">
              The best of the best. Climb the ranks.
            </motion.p>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 scrollbar-hide">
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
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            {activeTab === "Global" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Top 3 */}
                <div className="mb-10 grid gap-4 md:grid-cols-3">
                  {globalLeaders.slice(0, 3).map((user, i) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl border p-6 text-center transition-all ${
                        i === 0 ? "border-badge-gold/30 bg-card md:order-2 md:-mt-4" : "border-border bg-card"
                      }`}
                    >
                      {rankIcon(user.rank)}
                      <div className="mx-auto my-3 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 font-heading text-lg font-bold text-foreground">
                        {user.avatar}
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">{user.university} · {user.skill}</p>
                      <div className="mt-3 flex justify-center gap-4">
                        <div className="text-center">
                          <p className={`font-mono text-sm font-bold ${tierColor(user.tier)}`}>{user.elo}</p>
                          <p className="text-[9px] text-muted-foreground">ELO</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-sm font-bold text-foreground">{user.gigs}</p>
                          <p className="text-[9px] text-muted-foreground">Gigs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-mono text-sm font-bold text-badge-gold">★ {user.rating}</p>
                          <p className="text-[9px] text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Rest */}
                <div className="space-y-2">
                  {globalLeaders.slice(3).map((user, i) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20"
                    >
                      <span className="w-8 text-center font-mono text-sm font-bold text-muted-foreground">#{user.rank}</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-foreground">{user.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{user.university} · {user.skill}</p>
                      </div>
                      <span className={`font-mono text-xs font-semibold ${tierColor(user.tier)}`}>{user.tier}</span>
                      <span className="font-mono text-sm text-foreground">{user.elo}</span>
                      <Star size={12} className="fill-badge-gold text-badge-gold" />
                      <span className="font-mono text-xs text-badge-gold">{user.rating}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "By Skill" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 md:grid-cols-2">
                {skillLeaders.map((s, i) => (
                  <motion.div key={s.skill} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-heading text-lg font-bold text-foreground">{s.skill}</h3>
                    {s.leaders.map((l, j) => (
                      <div key={l} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        {rankIcon(j + 1)}
                        <span className="text-sm text-foreground">{l}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Guilds" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {guildLeaders.map((g, i) => (
                  <motion.div key={g.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                    {rankIcon(i + 1)}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 font-mono text-sm font-bold text-foreground">{g.avatar}</div>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-foreground">{g.name}</p>
                      <p className="text-[10px] text-muted-foreground">{g.members} members · {g.wars} wars won</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-foreground">{g.elo} ELO</p>
                      <p className="font-mono text-[10px] text-skill-green">{g.treasury.toLocaleString()} SP treasury</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Rising Stars" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2">
                {risingStars.map((s, i) => (
                  <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground">{s.avatar}</div>
                      <div>
                        <p className="font-heading text-sm font-bold text-foreground">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">Joined {s.joined}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="font-mono text-lg font-bold text-foreground">{s.elo}</p>
                        <p className="text-[9px] text-muted-foreground">ELO</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 font-mono text-lg font-bold text-skill-green"><ArrowUp size={14} />{s.growth}</p>
                        <p className="text-[9px] text-muted-foreground">Growth</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 font-mono text-lg font-bold text-badge-gold"><Flame size={14} />{s.streak}</p>
                        <p className="text-[9px] text-muted-foreground">Day Streak</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Universities" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {universities.map((u, i) => (
                  <motion.div key={u.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                    <span className="w-8 text-center font-mono text-sm font-bold text-muted-foreground">#{i + 1}</span>
                    <GraduationCap size={20} className="text-foreground" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-foreground">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.students} active students</p>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <p className="font-mono text-sm text-foreground">{u.avgElo}</p>
                        <p className="text-[9px] text-muted-foreground">Avg ELO</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm text-foreground">{u.gigs.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground">Total Gigs</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Judges" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {[
                  { name: "James T.", accuracy: "96%", cases: 145, elo: 1720, badge: "Expert Judge" },
                  { name: "Priya S.", accuracy: "94%", cases: 112, elo: 1680, badge: "Senior Judge" },
                  { name: "Aisha K.", accuracy: "93%", cases: 98, elo: 1650, badge: "Senior Judge" },
                  { name: "Dev K.", accuracy: "91%", cases: 76, elo: 1600, badge: "Judge" },
                ].map((j, i) => (
                  <motion.div key={j.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                    {rankIcon(i + 1)}
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-foreground">{j.name}</p>
                      <span className="rounded-full bg-court-blue/10 px-2.5 py-0.5 text-[10px] font-medium text-court-blue">{j.badge}</span>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div><p className="font-mono text-sm text-skill-green">{j.accuracy}</p><p className="text-[9px] text-muted-foreground">Accuracy</p></div>
                      <div><p className="font-mono text-sm text-foreground">{j.cases}</p><p className="text-[9px] text-muted-foreground">Cases</p></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Hall of Fame" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 md:grid-cols-2">
                {globalLeaders.slice(0, 4).map((u, i) => (
                  <motion.div key={u.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-badge-gold/20 bg-card p-8 text-center">
                    <Crown size={24} className="mx-auto mb-3 text-badge-gold" />
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 font-heading text-xl font-bold text-foreground">{u.avatar}</div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{u.name}</h3>
                    <p className="text-xs text-muted-foreground">{u.university}</p>
                    <p className={`mt-2 font-mono text-sm font-bold ${tierColor(u.tier)}`}>{u.tier} · ELO {u.elo}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{u.gigs} gigs · ★ {u.rating}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default LeaderboardPage;
