import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Users, Trophy, Star, Zap, TrendingUp, Crown, Shield, Calendar,
  MessageSquare, Settings, ChevronRight, ArrowRight, Award, Target,
  Swords, Flag, Medal, MapPin, Globe, ExternalLink, Plus, UserPlus,
  BarChart3, Clock, CheckCircle2, Briefcase, Activity, Wallet, Lock,
  MoreHorizontal, Search, Filter
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";

const mockGuild = {
  id: 1,
  name: "Design Masters",
  description: "A community of passionate designers pushing the boundaries of visual creativity. We share knowledge, collaborate on projects, and compete in Guild Wars together.",
  slogan: "Design. Create. Inspire.",
  category: "Design",
  rank: 3,
  totalMembers: 128,
  onlineMembers: 24,
  totalSP: 145000,
  totalGigs: 892,
  avgElo: 1580,
  winRate: 78,
  createdAt: "2024-06-15",
  isPublic: true,
  requirements: ["ELO 1300+", "Design category", "Active participation"],
  perks: ["Priority matching", "Guild-only bounties", "Exclusive workshops"],
  leaders: [
    { id: 1, name: "Maya K.", role: "Guild Master", elo: 1680, avatar: "MK" },
    { id: 2, name: "Carlos M.", role: "Officer", elo: 1550, avatar: "CM" },
    { id: 3, name: "Lena S.", role: "Officer", elo: 1480, avatar: "LS" },
  ],
  members: [
    { id: 4, name: "Tara J.", role: "Member", elo: 1470, avatar: "TJ", joinedAt: "2025-01-10" },
    { id: 5, name: "Alex F.", role: "Member", elo: 1490, avatar: "AF", joinedAt: "2025-02-05" },
    { id: 6, name: "Vera L.", role: "Member", elo: 1430, avatar: "VL", joinedAt: "2025-02-20" },
    { id: 7, name: "Suki T.", role: "Member", elo: 1540, avatar: "ST", joinedAt: "2025-03-01" },
    { id: 8, name: "Raj P.", role: "Member", elo: 1510, avatar: "RP", joinedAt: "2025-03-03" },
    { id: 9, name: "Kim W.", role: "Member", elo: 1460, avatar: "KW", joinedAt: "2025-02-14" },
  ],
  recentActivity: [
    { text: "Maya K. completed a gig", time: "2h ago" },
    { text: "Suki T. joined the guild", time: "1d ago" },
    { text: "Won Guild War vs Code Ninjas", time: "3d ago" },
    { text: "Unlocked 'Top 5' badge", time: "5d ago" },
    { text: "Carlos M. endorsed Lena S.", time: "6d ago" },
    { text: "New project 'Mobile App UI Kit' created", time: "1w ago" },
  ],
  wars: [
    { opponent: "Code Ninjas", result: "win" as const, score: "4500-3200", date: "2026-03-05" },
    { opponent: "Creative Collective", result: "win" as const, score: "3800-3100", date: "2026-02-28" },
    { opponent: "Tech Titans", result: "loss" as const, score: "2900-4100", date: "2026-02-20" },
    { opponent: "Pixel Perfect", result: "win" as const, score: "3600-2800", date: "2026-02-10" },
  ],
  projects: [
    { id: 1, title: "E-commerce Rebrand", status: "In Progress", members: 4, deadline: "2026-03-20", sp: 2400, lead: "Maya K." },
    { id: 2, title: "Mobile App UI Kit", status: "Planning", members: 3, deadline: "2026-04-01", sp: 1800, lead: "Carlos M." },
    { id: 3, title: "SaaS Dashboard Redesign", status: "Review", members: 5, deadline: "2026-03-12", sp: 3200, lead: "Lena S." },
  ],
  achievements: [
    { name: "Top 5 Guild", date: "Mar 2026", icon: "🏆" },
    { name: "100+ Gigs", date: "Feb 2026", icon: "💼" },
    { name: "War Streak x3", date: "Feb 2026", icon: "🔥" },
    { name: "Founding Guild", date: "Jun 2024", icon: "⭐" },
  ],
  spotlight: {
    member: "Suki T.",
    avatar: "ST",
    reason: "Most gigs completed this month — 14 gigs, 4.9 avg rating",
    elo: 1540,
  },
  openRoles: [
    { title: "UI/UX Designer", level: "Mid", description: "Looking for a Figma expert to join our product team.", applicants: 4 },
    { title: "Motion Designer", level: "Senior", description: "After Effects / Lottie animations for client projects.", applicants: 1 },
  ],
  skillDistribution: [
    { skill: "UI Design", members: 42 },
    { skill: "UX Research", members: 28 },
    { skill: "Illustration", members: 18 },
    { skill: "Motion Design", members: 15 },
    { skill: "Branding", members: 25 },
  ],
};

const tabs = ["Overview", "Members", "Projects", "Wars"] as const;
type Tab = typeof tabs[number];

const GuildPage = () => {
  const { guildId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const guild = mockGuild;
  const isLeader = true; // template: leader check

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* ─── HEADER ─── */}
        <section className="pt-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">{guild.name}</h1>
                  <span className="rounded-full border border-border px-3 py-1 text-[10px] font-mono text-muted-foreground">#{guild.rank}</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl">{guild.slogan}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={12} /> {guild.totalMembers} members</span>
                  <span className="flex items-center gap-1 text-skill-green"><span className="h-1.5 w-1.5 rounded-full bg-skill-green" /> {guild.onlineMembers} online</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Est. {new Date(guild.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1">{guild.category}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background">
                  <UserPlus size={12} /> Join Guild
                </button>
                <button className="rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8 pt-6 border-t border-border">
              {[
                { label: "Total SP", value: guild.totalSP.toLocaleString() },
                { label: "Gigs Done", value: guild.totalGigs.toString() },
                { label: "Avg ELO", value: guild.avgElo.toString() },
                { label: "Win Rate", value: `${guild.winRate}%` },
                { label: "Projects", value: guild.projects.length.toString() },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-mono text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TAB NAV ─── */}
        <section className="px-6 mt-8">
          <div className="max-w-5xl mx-auto border-b border-border">
            <div className="flex gap-1 overflow-x-auto -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TAB CONTENT ─── */}
        <section className="px-6 py-10 pb-24">
          <div className="max-w-5xl mx-auto">

            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="grid lg:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-10">
                  {/* About */}
                  <div>
                    <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">About</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guild.description}</p>
                  </div>

                  {/* Requirements & Perks */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Requirements</h3>
                      <div className="space-y-2">
                        {guild.requirements.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 size={12} className="text-skill-green shrink-0" /> {r}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Perks</h3>
                      <div className="space-y-2">
                        {guild.perks.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap size={12} className="shrink-0" /> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leadership */}
                  <div>
                    <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Leadership</h2>
                    <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                      {guild.leaders.map(leader => (
                        <Link key={leader.id} to={`/profile/${leader.id}`} className="flex items-center gap-4 p-4 bg-card hover:bg-surface-1 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-foreground">
                            {leader.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                              {leader.name}
                              {leader.role === "Guild Master" && <Crown size={12} className="text-muted-foreground" />}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{leader.role}</p>
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">{leader.elo}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Recent Wars */}
                  <div>
                    <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Recent Wars</h2>
                    <div className="space-y-2">
                      {guild.wars.slice(0, 3).map((war, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <span className={`h-2 w-2 rounded-full ${war.result === "win" ? "bg-skill-green" : "bg-destructive"}`} />
                            <span className="text-xs text-foreground">vs {war.opponent}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-muted-foreground">{war.score}</span>
                            <span className="text-[10px] text-muted-foreground">{war.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Activity Feed */}
                  <div>
                    <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Activity</h3>
                    <div className="space-y-0">
                      {guild.recentActivity.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                          <div>
                            <p className="text-[11px] text-muted-foreground">{a.text}</p>
                            <p className="text-[10px] text-muted-foreground/60">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Projects preview */}
                  <div>
                    <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Active Projects</h3>
                    {guild.projects.map(p => (
                      <div key={p.id} className="py-2.5 border-b border-border last:border-0">
                        <p className="text-xs font-medium text-foreground">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground">{p.status} · {p.members} members · {p.sp} SP</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS */}
            {activeTab === "Members" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs text-muted-foreground">{guild.totalMembers} members</p>
                </div>
                <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                  {[...guild.leaders, ...guild.members].map(member => (
                    <Link key={member.id} to={`/profile/${member.id}`} className="flex items-center gap-4 p-4 bg-card hover:bg-surface-1 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-foreground">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                          {member.name}
                          {member.role === "Guild Master" && <Crown size={12} className="text-muted-foreground" />}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{member.role}</p>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{member.elo} ELO</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === "Projects" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Projects</h2>
                  {isLeader && <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"><Plus size={12} /> New Project</button>}
                </div>
                <div className="space-y-3">
                  {guild.projects.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            p.status === "In Progress" ? "border-skill-green/20 text-skill-green" :
                            p.status === "Review" ? "border-court-blue/20 text-court-blue" :
                            "border-border text-muted-foreground"
                          }`}>{p.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span>Lead: {p.lead}</span>
                          <span>{p.members} members</span>
                          <span>Due {p.deadline}</span>
                        </div>
                      </div>
                      <span className="font-mono text-sm text-foreground shrink-0">{p.sp} SP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WARS */}
            {activeTab === "Wars" && (
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Guild Wars History</h2>
                <div className="space-y-2">
                  {guild.wars.map((war, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${war.result === "win" ? "bg-skill-green/10" : "bg-destructive/10"}`}>
                          <Swords size={14} className={war.result === "win" ? "text-skill-green" : "text-destructive"} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">vs {war.opponent}</p>
                          <p className="text-[10px] text-muted-foreground">{war.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-foreground">{war.score}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          war.result === "win" ? "bg-skill-green/10 text-skill-green" : "bg-destructive/10 text-destructive"
                        }`}>{war.result.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ─── EXTRA SECTIONS (always visible) ─── */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Achievements */}
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Achievements</h2>
              <div className="flex flex-wrap gap-3">
                {guild.achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                    <span className="text-lg">{a.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Spotlight */}
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Member Spotlight</h2>
              <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 font-mono text-sm font-bold text-foreground">
                  {guild.spotlight.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{guild.spotlight.member}</p>
                  <p className="text-xs text-muted-foreground">{guild.spotlight.reason}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground shrink-0">{guild.spotlight.elo} ELO</span>
              </div>
            </div>

            {/* Skill Distribution */}
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Skill Distribution</h2>
              <div className="space-y-3">
                {guild.skillDistribution.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">{s.skill}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full rounded-full bg-foreground" style={{ width: `${(s.members / guild.totalMembers) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground w-12 text-right">{s.members}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Roles / Recruiting */}
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Open Roles</h2>
              <div className="space-y-3">
                {guild.openRoles.map((role, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground">{role.title}</h3>
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{role.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-muted-foreground">{role.applicants} applicants</p>
                      <button className="mt-1 text-[10px] text-foreground hover:underline">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GuildPage;
