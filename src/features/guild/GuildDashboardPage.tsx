import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Users, Shield, Trophy, Zap, Coins, Crown, Star, TrendingUp,
  Briefcase, Calendar, Settings, Bell, Plus,
  LayoutDashboard, Wallet, Swords, Award,
  UserPlus, ArrowUpRight, ArrowDownRight,
  Hand, Clock, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import PageTransition from "@/components/shared/PageTransition";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "treasury", label: "Treasury", icon: Wallet },
  { id: "lending", label: "SP Lending", icon: Hand },
  { id: "wars", label: "Guild Wars", icon: Swords },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
];

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10" };
};

const roleColor = (role: string) => {
  switch (role) {
    case "Guild Master": return "bg-badge-gold/10 text-badge-gold";
    case "Officer": return "bg-court-blue/10 text-court-blue";
    default: return "bg-surface-2 text-muted-foreground";
  }
};

/* ═══ OVERVIEW ═══ */
const OverviewTab = ({ guild, members, wars, projects, treasury }: any) => {
  const stats = [
    { label: "Treasury", value: `${(guild?.total_sp || 0).toLocaleString()} SP`, icon: Coins, color: "text-badge-gold" },
    { label: "Members", value: members?.length || 0, icon: Users, color: "text-foreground" },
    { label: "Avg ELO", value: guild?.avg_elo || 0, icon: TrendingUp, color: "text-skill-green" },
    { label: "Global Rank", value: `#${guild?.rank || "–"}`, icon: Trophy, color: "text-court-blue" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2 text-4xl">⚔️</div>
            <div>
              <h2 className="font-heading text-3xl font-black text-foreground">{guild?.name || "Guild"}</h2>
              <p className="text-muted-foreground mt-1 max-w-lg">{guild?.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-badge-gold/10 text-badge-gold border-none">Rank #{guild?.rank}</Badge>
                <span className="text-xs text-muted-foreground">Win Rate: {guild?.win_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} className="rounded-xl border border-border bg-card p-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Members</h3>
          <div className="space-y-3">
            {(members || []).slice(0, 4).map((m: any) => {
              const tier = eloTier(m.profiles?.elo || 1000);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>
                    {m.profiles?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.profiles?.display_name || m.profiles?.full_name || "Member"}</p>
                    <p className="text-xs text-muted-foreground">ELO {m.profiles?.elo || 1000}</p>
                  </div>
                  <Badge className={roleColor(m.role)}>{m.role}</Badge>
                </div>
              );
            })}
            {(!members || members.length === 0) && <p className="text-sm text-muted-foreground">No members yet</p>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Swords size={16} className="text-alert-red" /> Guild Wars
          </h3>
          <div className="space-y-3">
            {(wars || []).slice(0, 3).map((war: any) => (
              <div key={war.id} className={`rounded-lg border p-3 ${
                war.status === "Upcoming" ? "border-badge-gold/20 bg-badge-gold/5" :
                war.status === "Victory" ? "border-skill-green/20 bg-skill-green/5" :
                "border-alert-red/20 bg-alert-red/5"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">vs {war.opponent_name}</span>
                  <Badge className={
                    war.status === "Upcoming" ? "bg-badge-gold/10 text-badge-gold border-none" :
                    war.status === "Victory" ? "bg-skill-green/10 text-skill-green border-none" :
                    "bg-alert-red/10 text-alert-red border-none"
                  }>{war.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(war.start_date).toLocaleDateString()}</span>
                  <span className="text-badge-gold font-medium">{war.stakes} SP</span>
                </div>
              </div>
            ))}
            {(!wars || wars.length === 0) && <p className="text-sm text-muted-foreground">No guild wars</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Guild Projects</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(projects || []).map((project: any) => (
            <div key={project.id} className="rounded-xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={
                  project.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" :
                  project.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" :
                  "bg-badge-gold/10 text-badge-gold border-none"
                }>{project.status}</Badge>
                <Badge variant="secondary">{project.client}</Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">{project.title}</h4>
              <Progress value={project.progress} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{project.members_count} members</span>
                {project.sp_pool > 0 && <span className="text-badge-gold">{project.sp_pool} SP</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══ MEMBERS ═══ */
const MembersTab = ({ members }: any) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? (members || []) : (members || []).filter((m: any) => m.role.toLowerCase().includes(filter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Members ({(members || []).length})</h2>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
          <UserPlus size={14} /> Invite
        </button>
      </div>
      <div className="flex gap-2">
        {["all", "guild master", "officer", "member"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? 'bg-foreground text-background' : 'bg-surface-1 text-muted-foreground hover:text-foreground'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member: any) => {
          const tier = eloTier(member.profiles?.elo || 1000);
          return (
            <motion.div key={member.id} className="rounded-2xl border border-border bg-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                  {member.profiles?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground truncate">{member.profiles?.display_name || member.profiles?.full_name || "Member"}</h3>
                  <Badge className={`mt-1 ${roleColor(member.role)}`}>{member.role}</Badge>
                </div>
                <Badge className={`${tier.bg} ${tier.color} border-none`}>{tier.label}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-foreground">{member.profiles?.elo || 1000}</p>
                  <p className="text-[9px] text-muted-foreground">ELO</p>
                </div>
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-badge-gold">{member.profiles?.sp || 0}</p>
                  <p className="text-[9px] text-muted-foreground">SP</p>
                </div>
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="text-xs font-bold text-foreground">{member.profiles?.total_gigs_completed || 0}</p>
                  <p className="text-[9px] text-muted-foreground">Gigs</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══ TREASURY ═══ */
const TreasuryTab = ({ guild, treasury }: any) => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-badge-gold/20 bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Guild Treasury</p>
          <p className="font-heading text-4xl font-black text-badge-gold">{(guild?.total_sp || 0).toLocaleString()} SP</p>
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
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Transaction History</h3>
      <div className="space-y-2">
        {(treasury || []).map((tx: any) => (
          <div key={tx.id} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              tx.amount > 0 ? "bg-skill-green/10" : "bg-alert-red/10"
            }`}>
              {tx.amount > 0 ? <ArrowUpRight size={16} className="text-skill-green" /> : <ArrowDownRight size={16} className="text-alert-red" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{tx.reason}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`text-sm font-bold ${tx.amount > 0 ? "text-skill-green" : "text-alert-red"}`}>
              {tx.amount > 0 ? "+" : ""}{tx.amount} SP
            </span>
          </div>
        ))}
        {(!treasury || treasury.length === 0) && <p className="text-sm text-muted-foreground">No transactions yet</p>}
      </div>
    </div>
  </div>
);

/* ═══ LENDING ═══ */
const LendingTab = ({ loans }: any) => {
  const totalOutstanding = (loans || []).filter((l: any) => l.status === "active").reduce((s: number, l: any) => s + l.amount, 0);

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
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-court-blue">{totalOutstanding}</p>
          <p className="text-xs text-muted-foreground">SP Outstanding</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-skill-green">5%</p>
          <p className="text-xs text-muted-foreground">Interest Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="font-heading text-2xl font-black text-foreground">{(loans || []).filter((l: any) => l.status === "active").length}</p>
          <p className="text-xs text-muted-foreground">Active Loans</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Active Loans</h3>
        <div className="space-y-4">
          {(loans || []).map((loan: any) => (
            <div key={loan.id} className="rounded-xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Loan #{loan.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">Borrowed {new Date(loan.borrowed_at).toLocaleDateString()}</p>
                </div>
                <Badge className="bg-court-blue/10 text-court-blue border-none">{loan.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-badge-gold">{loan.amount} SP</span>
                  <span className="text-xs text-muted-foreground">+{loan.interest_rate}% interest</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={10} /> Due: {new Date(loan.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {(!loans || loans.length === 0) && <p className="text-sm text-muted-foreground">No active loans</p>}
        </div>
      </div>
      <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-court-blue shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Guild Lending Protection</p>
            <p className="text-xs text-muted-foreground mt-1">Loans are backed by the borrower's ELO reputation. Defaulting affects their ELO score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ WARS ═══ */
const WarsTab = ({ guild, wars }: any) => {
  const wins = (wars || []).filter((w: any) => w.status === "Victory").length;
  const losses = (wars || []).filter((w: any) => w.status === "Defeat").length;

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
          <span className="text-sm text-skill-green font-bold">{wins}W</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-alert-red font-bold">{losses}L</span>
        </div>
      </div>
      <div className="space-y-4">
        {(wars || []).map((war: any) => (
          <motion.div key={war.id} className={`rounded-2xl border overflow-hidden ${
            war.status === "Upcoming" ? "border-badge-gold/30" : war.status === "Victory" ? "border-skill-green/30" : "border-alert-red/30"
          }`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`px-5 py-3 ${
              war.status === "Upcoming" ? "bg-badge-gold/10" : war.status === "Victory" ? "bg-skill-green/10" : "bg-alert-red/10"
            }`}>
              <div className="flex items-center justify-between">
                <Badge className={
                  war.status === "Upcoming" ? "bg-badge-gold/20 text-badge-gold border-none" :
                  war.status === "Victory" ? "bg-skill-green/20 text-skill-green border-none" :
                  "bg-alert-red/20 text-alert-red border-none"
                }>{war.status}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(war.start_date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-5 bg-card">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-2 text-2xl mx-auto mb-2">⚔️</div>
                  <p className="text-sm font-bold text-foreground">{guild?.name}</p>
                  {war.status !== "Upcoming" && <p className={`text-xl font-black ${war.our_score > war.their_score ? "text-skill-green" : "text-alert-red"}`}>{war.our_score}</p>}
                </div>
                <div className="text-3xl font-black text-muted-foreground/30">VS</div>
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-2 text-2xl mx-auto mb-2">🛡️</div>
                  <p className="text-sm font-bold text-foreground">{war.opponent_name}</p>
                  {war.status !== "Upcoming" && <p className={`text-xl font-black ${war.their_score > war.our_score ? "text-skill-green" : "text-alert-red"}`}>{war.their_score}</p>}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-badge-gold">
                <Coins size={14} />
                <span className="text-sm font-bold">{war.stakes} SP stakes</span>
              </div>
            </div>
          </motion.div>
        ))}
        {(!wars || wars.length === 0) && <div className="text-center py-12 text-muted-foreground">No guild wars yet</div>}
      </div>
    </div>
  );
};

/* ═══ PROJECTS ═══ */
const ProjectsTab = ({ projects }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-bold text-foreground">Guild Projects</h2>
      <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
        <Plus size={14} /> New Project
      </button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {(projects || []).map((project: any) => (
        <motion.div key={project.id} className="rounded-2xl border border-border bg-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <Badge className={
              project.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" :
              project.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" :
              "bg-badge-gold/10 text-badge-gold border-none"
            }>{project.status}</Badge>
            <Badge variant="secondary">{project.client}</Badge>
          </div>
          <h4 className="text-lg font-bold text-foreground mb-2">{project.title}</h4>
          <Progress value={project.progress} className="h-2 mb-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span><Users size={12} className="inline mr-1" />{project.members_count} members</span>
            {project.sp_pool > 0 && <span className="text-badge-gold font-bold">{project.sp_pool} SP pool</span>}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ═══ SIDEBAR ═══ */
const GuildSidebar = ({ activeTab, setActiveTab, guild, hasUpcomingWar }: { activeTab: string; setActiveTab: (t: string) => void; guild: any; hasUpcomingWar: boolean }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">⚔️</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{guild?.name || "Guild"}</p>
                <p className="text-xs text-muted-foreground">Rank #{guild?.rank || "–"}</p>
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
                  <SidebarMenuButton onClick={() => setActiveTab(item.id)} className={activeTab === item.id ? "bg-foreground text-background" : ""}>
                    <item.icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.id === "wars" && hasUpcomingWar && (
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

/* ═══ MAIN ═══ */
const GuildDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { guildId } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [guild, setGuild] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [wars, setWars] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [treasury, setTreasury] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guildId || !isAuthenticated) { setLoading(false); return; }
    const fetchAll = async () => {
      const [gRes, mRes, wRes, pRes, tRes, lRes] = await Promise.all([
        supabase.from("guilds").select("*").eq("id", guildId).single(),
        supabase.from("guild_members").select("*, profiles(*)").eq("guild_id", guildId),
        supabase.from("guild_wars").select("*").eq("guild_id", guildId).order("start_date", { ascending: false }),
        supabase.from("guild_projects").select("*").eq("guild_id", guildId).order("created_at", { ascending: false }),
        supabase.from("guild_treasury_log").select("*").eq("guild_id", guildId).order("created_at", { ascending: false }),
        supabase.from("guild_loans").select("*").eq("guild_id", guildId),
      ]);
      setGuild(gRes.data);
      setMembers(mRes.data || []);
      setWars(wRes.data || []);
      setProjects(pRes.data || []);
      setTreasury(tRes.data || []);
      setLoans(lRes.data || []);
      setLoading(false);
    };
    fetchAll();
  }, [guildId, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Guild Dashboard</h2>
            <p className="text-muted-foreground mb-4">Log in to manage your guild</p>
            <Link to="/login" className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background">Log In</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const hasUpcomingWar = wars.some(w => w.status === "Upcoming");

  const renderContent = () => {
    if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
    switch (activeTab) {
      case "overview": return <OverviewTab guild={guild} members={members} wars={wars} projects={projects} treasury={treasury} />;
      case "members": return <MembersTab members={members} />;
      case "treasury": return <TreasuryTab guild={guild} treasury={treasury} />;
      case "lending": return <LendingTab loans={loans} />;
      case "wars": return <WarsTab guild={guild} wars={wars} />;
      case "projects": return <ProjectsTab projects={projects} />;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Guild settings coming soon...</div>;
      default: return <OverviewTab guild={guild} members={members} wars={wars} projects={projects} treasury={treasury} />;
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <GuildSidebar activeTab={activeTab} setActiveTab={setActiveTab} guild={guild} hasUpcomingWar={hasUpcomingWar} />
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
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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
