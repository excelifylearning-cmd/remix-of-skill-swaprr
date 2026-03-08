import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Users, Shield, Trophy, Zap, Coins, Crown, Star, TrendingUp,
  Briefcase, Calendar, MessageSquare, Settings, Bell, Plus,
  LayoutDashboard, Wallet, Swords, Target, Award, ChevronRight,
  UserPlus, UserMinus, ArrowUpRight, ArrowDownRight, Gift,
  Lock, Unlock, BarChart3, Activity, Send, Clock, CheckCircle2,
  AlertTriangle, Hand, Scale
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import PageTransition from "@/components/shared/PageTransition";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "treasury", label: "Treasury", icon: Wallet },
  { id: "lending", label: "SP Lending", icon: Hand },
  { id: "wars", label: "Guild Wars", icon: Swords },
  { id: "projects", label: "Guild Projects", icon: Briefcase },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "settings", label: "Settings", icon: Settings },
];

const guildData = {
  name: "Design Dragons",
  icon: "🐉",
  rank: 3,
  totalMembers: 156,
  avgElo: 1520,
  treasurySP: 12500,
  warsWon: 8,
  warsLost: 2,
  founded: "2025-06-15",
  description: "Elite design guild specializing in brand identity, UI/UX, and motion graphics. We take on ambitious projects together.",
};

const members = [
  { id: 1, name: "Maya K.", role: "Leader", elo: 1450, sp: 850, avatar: "MK", contributions: 2400, status: "online" },
  { id: 2, name: "Chen L.", role: "Officer", elo: 1750, sp: 1200, avatar: "CL", contributions: 3100, status: "online" },
  { id: 3, name: "Raj P.", role: "Officer", elo: 1720, sp: 980, avatar: "RP", contributions: 2800, status: "away" },
  { id: 4, name: "Lena S.", role: "Member", elo: 1380, sp: 450, avatar: "LS", contributions: 890, status: "offline" },
  { id: 5, name: "Omar H.", role: "Member", elo: 1600, sp: 720, avatar: "OH", contributions: 1500, status: "online" },
  { id: 6, name: "Tara J.", role: "Member", elo: 1470, sp: 560, avatar: "TJ", contributions: 1200, status: "online" },
  { id: 7, name: "Suki T.", role: "Member", elo: 1540, sp: 680, avatar: "ST", contributions: 1100, status: "offline" },
  { id: 8, name: "Alex F.", role: "Member", elo: 1490, sp: 520, avatar: "AF", contributions: 950, status: "away" },
];

const treasuryHistory = [
  { id: 1, type: "deposit", user: "Maya K.", amount: 500, reason: "Guild Wars S4 prize", date: "2026-03-06" },
  { id: 2, type: "withdrawal", user: "Chen L.", amount: -200, reason: "Project funding", date: "2026-03-05" },
  { id: 3, type: "deposit", user: "Raj P.", amount: 350, reason: "Monthly contribution", date: "2026-03-01" },
  { id: 4, type: "lending", user: "Lena S.", amount: -150, reason: "SP loan to member", date: "2026-02-28" },
  { id: 5, type: "deposit", user: "Guild", amount: 1000, reason: "Guild Wars S3 victory", date: "2026-02-20" },
];

const activeLoans = [
  { id: 1, borrower: "Lena S.", amount: 150, borrowed: "2026-02-28", dueDate: "2026-03-28", status: "active", interest: 5 },
  { id: 2, borrower: "Alex F.", amount: 100, borrowed: "2026-03-01", dueDate: "2026-04-01", status: "active", interest: 5 },
];

const guildWars = [
  { id: 1, opponent: "Code Ninjas", status: "Upcoming", startDate: "2026-03-15", stakes: 500, ourScore: 0, theirScore: 0 },
  { id: 2, opponent: "Creative Collective", status: "Victory", startDate: "2026-03-01", stakes: 300, ourScore: 1250, theirScore: 980 },
  { id: 3, opponent: "Tech Titans", status: "Defeat", startDate: "2026-02-15", stakes: 400, ourScore: 890, theirScore: 1100 },
];

const guildProjects = [
  { id: 1, title: "Brand Identity Suite", client: "External", status: "In Progress", progress: 60, spPool: 800, members: 4 },
  { id: 2, title: "UI Kit v2.0", client: "Internal", status: "Planning", progress: 15, spPool: 0, members: 6 },
  { id: 3, title: "Motion Graphics Pack", client: "External", status: "Completed", progress: 100, spPool: 500, members: 3 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
═══════════════════════════════════════════════════════════════════════════ */

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10" };
};

const roleColor = (role: string) => {
  switch (role) {
    case "Leader": return "bg-badge-gold/10 text-badge-gold";
    case "Officer": return "bg-court-blue/10 text-court-blue";
    default: return "bg-surface-2 text-muted-foreground";
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════════════════ */

const OverviewTab = () => {
  const stats = [
    { label: "Treasury", value: guildData.treasurySP.toLocaleString(), icon: Coins, color: "text-badge-gold" },
    { label: "Members", value: guildData.totalMembers, icon: Users, color: "text-foreground" },
    { label: "Avg ELO", value: guildData.avgElo, icon: TrendingUp, color: "text-skill-green" },
    { label: "Global Rank", value: `#${guildData.rank}`, icon: Trophy, color: "text-court-blue" },
  ];

  return (
    <div className="space-y-6">
      {/* Guild Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-badge-gold/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2 text-4xl">
              {guildData.icon}
            </div>
            <div>
              <h2 className="font-heading text-3xl font-black text-foreground">{guildData.name}</h2>
              <p className="text-muted-foreground mt-1 max-w-lg">{guildData.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-badge-gold/10 text-badge-gold border-none">Rank #{guildData.rank}</Badge>
                <span className="text-xs text-muted-foreground">Founded {new Date(guildData.founded).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-skill-green font-bold">{guildData.warsWon}W</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-alert-red font-bold">{guildData.warsLost}L</span>
            </div>
            <span className="text-xs text-muted-foreground">Guild Wars Record</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-xl border border-border bg-card p-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Contributors */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Top Contributors</h3>
            <Link to="?tab=members" className="text-xs text-muted-foreground hover:text-foreground">View All →</Link>
          </div>
          <div className="space-y-3">
            {members.slice(0, 4).map((member, i) => {
              const tier = eloTier(member.elo);
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${i === 0 ? 'text-badge-gold' : i === 1 ? 'text-muted-foreground' : i === 2 ? 'text-orange-400' : 'text-muted-foreground/50'}`}>
                    #{i + 1}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.contributions.toLocaleString()} SP contributed</p>
                  </div>
                  <Badge className={roleColor(member.role)}>{member.role}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Wars */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Swords size={16} className="text-alert-red" /> Guild Wars
            </h3>
            <Link to="?tab=wars" className="text-xs text-muted-foreground hover:text-foreground">View All →</Link>
          </div>
          <div className="space-y-3">
            {guildWars.slice(0, 3).map((war) => (
              <div key={war.id} className={`rounded-lg border p-3 ${
                war.status === "Upcoming" ? "border-badge-gold/20 bg-badge-gold/5" :
                war.status === "Victory" ? "border-skill-green/20 bg-skill-green/5" :
                "border-alert-red/20 bg-alert-red/5"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">vs {war.opponent}</span>
                  <Badge className={
                    war.status === "Upcoming" ? "bg-badge-gold/10 text-badge-gold border-none" :
                    war.status === "Victory" ? "bg-skill-green/10 text-skill-green border-none" :
                    "bg-alert-red/10 text-alert-red border-none"
                  }>
                    {war.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(war.startDate).toLocaleDateString()}</span>
                  <span className="text-badge-gold font-medium">{war.stakes} SP stakes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-foreground">Guild Projects</h3>
          <Link to="?tab=projects" className="text-xs text-muted-foreground hover:text-foreground">View All →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guildProjects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={
                  project.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" :
                  project.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" :
                  "bg-badge-gold/10 text-badge-gold border-none"
                }>
                  {project.status}
                </Badge>
                <Badge variant="secondary">{project.client}</Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">{project.title}</h4>
              <Progress value={project.progress} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{project.members} members</span>
                {project.spPool > 0 && <span className="text-badge-gold">{project.spPool} SP pool</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MEMBERS TAB
═══════════════════════════════════════════════════════════════════════════ */

const MembersTab = () => {
  const [filter, setFilter] = useState("all");

  const filteredMembers = filter === "all" ? members : members.filter(m => m.role.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Members ({members.length})</h2>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
          <UserPlus size={14} /> Invite
        </button>
      </div>

      <div className="flex gap-2">
        {["all", "leader", "officer", "member"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? 'bg-foreground text-background' : 'bg-surface-1 text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => {
          const tier = eloTier(member.elo);
          return (
            <motion.div
              key={member.id}
              className="rounded-2xl border border-border bg-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                    member.status === "online" ? "bg-skill-green" :
                    member.status === "away" ? "bg-badge-gold" : "bg-muted-foreground/30"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">{member.name}</h3>
                  <Badge className={`mt-1 ${roleColor(member.role)}`}>{member.role}</Badge>
                </div>
                <Badge className={`${tier.bg} ${tier.color} border-none`}>{tier.label}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-foreground">{member.elo}</p>
                  <p className="text-[9px] text-muted-foreground">ELO</p>
                </div>
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-badge-gold">{member.sp}</p>
                  <p className="text-[9px] text-muted-foreground">SP</p>
                </div>
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-foreground">{(member.contributions / 1000).toFixed(1)}k</p>
                  <p className="text-[9px] text-muted-foreground">Contrib</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TREASURY TAB
═══════════════════════════════════════════════════════════════════════════ */

const TreasuryTab = () => {
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="rounded-2xl border border-badge-gold/20 bg-gradient-to-br from-badge-gold/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Guild Treasury</p>
            <p className="font-heading text-4xl font-black text-badge-gold">{guildData.treasurySP.toLocaleString()} SP</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-badge-gold/10">
            <Coins size={32} className="text-badge-gold" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background flex items-center justify-center gap-2">
            <ArrowUpRight size={14} /> Deposit
          </button>
          <button className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <ArrowDownRight size={14} /> Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Transaction History</h3>
        <div className="space-y-2">
          {treasuryHistory.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                tx.type === "deposit" ? "bg-skill-green/10" :
                tx.type === "withdrawal" ? "bg-alert-red/10" :
                "bg-court-blue/10"
              }`}>
                {tx.type === "deposit" ? <ArrowUpRight size={16} className="text-skill-green" /> :
                 tx.type === "withdrawal" ? <ArrowDownRight size={16} className="text-alert-red" /> :
                 <Hand size={16} className="text-court-blue" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{tx.reason}</p>
                <p className="text-[10px] text-muted-foreground">by {tx.user} · {tx.date}</p>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? "text-skill-green" : "text-alert-red"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount} SP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   LENDING TAB
═══════════════════════════════════════════════════════════════════════════ */

const LendingTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">SP Lending</h2>
          <p className="text-sm text-muted-foreground">Lend SP to guild members with automatic interest</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
          <Plus size={14} /> New Loan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-court-blue">250</p>
          <p className="text-xs text-muted-foreground">SP Outstanding</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-skill-green">5%</p>
          <p className="text-xs text-muted-foreground">Interest Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-foreground">2</p>
          <p className="text-xs text-muted-foreground">Active Loans</p>
        </div>
      </div>

      {/* Active Loans */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Active Loans</h3>
        <div className="space-y-4">
          {activeLoans.map((loan) => (
            <div key={loan.id} className="rounded-xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 font-mono text-sm font-bold text-foreground">
                    {loan.borrower.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{loan.borrower}</p>
                    <p className="text-xs text-muted-foreground">Borrowed {loan.borrowed}</p>
                  </div>
                </div>
                <Badge className="bg-court-blue/10 text-court-blue border-none">{loan.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-badge-gold">{loan.amount} SP</span>
                  <span className="text-xs text-muted-foreground">+{loan.interest}% interest</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={10} /> Due: {loan.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-court-blue shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Guild Lending Protection</p>
            <p className="text-xs text-muted-foreground mt-1">
              Loans are backed by the borrower's ELO reputation. Defaulting affects their ELO score and may result in guild removal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   GUILD WARS TAB
═══════════════════════════════════════════════════════════════════════════ */

const WarsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Swords size={24} className="text-alert-red" /> Guild Wars
          </h2>
          <p className="text-sm text-muted-foreground">Compete with other guilds for SP and glory</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-1 rounded-xl px-4 py-2">
          <span className="text-sm text-skill-green font-bold">{guildData.warsWon}W</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-alert-red font-bold">{guildData.warsLost}L</span>
        </div>
      </div>

      <div className="space-y-4">
        {guildWars.map((war) => (
          <motion.div
            key={war.id}
            className={`rounded-2xl border overflow-hidden ${
              war.status === "Upcoming" ? "border-badge-gold/30" :
              war.status === "Victory" ? "border-skill-green/30" :
              "border-alert-red/30"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`px-5 py-3 ${
              war.status === "Upcoming" ? "bg-badge-gold/10" :
              war.status === "Victory" ? "bg-skill-green/10" :
              "bg-alert-red/10"
            }`}>
              <div className="flex items-center justify-between">
                <Badge className={
                  war.status === "Upcoming" ? "bg-badge-gold/20 text-badge-gold border-none" :
                  war.status === "Victory" ? "bg-skill-green/20 text-skill-green border-none" :
                  "bg-alert-red/20 text-alert-red border-none"
                }>
                  {war.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{war.startDate}</span>
              </div>
            </div>
            <div className="p-5 bg-card">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-2 text-2xl mx-auto mb-2">
                    {guildData.icon}
                  </div>
                  <p className="text-sm font-bold text-foreground">{guildData.name}</p>
                  {war.status !== "Upcoming" && (
                    <p className={`text-xl font-black ${war.ourScore > war.theirScore ? "text-skill-green" : "text-alert-red"}`}>
                      {war.ourScore}
                    </p>
                  )}
                </div>
                <div className="text-3xl font-black text-muted-foreground/30">VS</div>
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-2 text-2xl mx-auto mb-2">
                    ⚔️
                  </div>
                  <p className="text-sm font-bold text-foreground">{war.opponent}</p>
                  {war.status !== "Upcoming" && (
                    <p className={`text-xl font-black ${war.theirScore > war.ourScore ? "text-skill-green" : "text-alert-red"}`}>
                      {war.theirScore}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-badge-gold">
                <Coins size={14} />
                <span className="text-sm font-bold">{war.stakes} SP stakes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */

const GuildSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">
                {guildData.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{guildData.name}</p>
                <p className="text-xs text-muted-foreground">Rank #{guildData.rank}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Guild Management</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={activeTab === item.id ? "bg-foreground text-background" : ""}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.id === "wars" && guildWars.some(w => w.status === "Upcoming") && (
                      <Badge className="ml-auto bg-badge-gold/10 text-badge-gold border-none text-[9px]">!</Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

const GuildDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "members": return <MembersTab />;
      case "treasury": return <TreasuryTab />;
      case "lending": return <LendingTab />;
      case "wars": return <WarsTab />;
      case "projects": return <div className="py-20 text-center text-muted-foreground">Guild projects management coming soon...</div>;
      case "leaderboard": return <div className="py-20 text-center text-muted-foreground">Guild leaderboard coming soon...</div>;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Guild settings coming soon...</div>;
      default: return <OverviewTab />;
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <GuildSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="font-heading text-lg font-bold text-foreground capitalize">{activeTab.replace("-", " ")}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
                  <Bell size={18} />
                </button>
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  User Dashboard
                </Link>
              </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PageTransition>
  );
};

export default GuildDashboardPage;
