import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  Users, Shield, Trophy, Zap, Coins, Crown, Star, TrendingUp,
  Briefcase, Calendar, MessageSquare, Settings, Bell, Plus,
  LayoutDashboard, Wallet, Swords, Target, Award, ChevronRight,
  UserPlus, UserMinus, ArrowUpRight, ArrowDownRight, Gift,
  Lock, Unlock, BarChart3, Activity, Send, Clock, CheckCircle2,
  AlertTriangle, Hand, Scale, Loader2
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
import { toast } from "sonner";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "treasury", label: "Treasury", icon: Wallet },
  { id: "lending", label: "SP Lending", icon: Hand },
  { id: "wars", label: "Guild Wars", icon: Swords },
  { id: "projects", label: "Guild Projects", icon: Briefcase },
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

/* ═══ HOOKS ═══ */
const useGuildDashData = (guildId: string | undefined) => {
  const [guild, setGuild] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [treasury, setTreasury] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [wars, setWars] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!guildId) return;
    setLoading(true);
    const [guildRes, membersRes, treasuryRes, loansRes, warsRes, projectsRes] = await Promise.all([
      supabase.from("guilds").select("*").eq("id", guildId).single(),
      supabase.from("guild_members").select("user_id, role, joined_at, profiles(full_name, elo, sp, avatar_url)").eq("guild_id", guildId),
      supabase.from("guild_treasury_log").select("*").eq("guild_id", guildId).order("created_at", { ascending: false }).limit(50),
      supabase.from("guild_loans").select("*").eq("guild_id", guildId).order("borrowed_at", { ascending: false }),
      supabase.from("guild_wars").select("*").eq("guild_id", guildId).order("start_date", { ascending: false }),
      supabase.from("guild_projects").select("*").eq("guild_id", guildId).order("created_at", { ascending: false }),
    ]);
    if (guildRes.data) setGuild(guildRes.data);
    setMembers((membersRes.data || []).map((m: any) => ({
      user_id: m.user_id, role: m.role, joined_at: m.joined_at,
      name: m.profiles?.full_name || "Unknown", elo: m.profiles?.elo || 1000,
      sp: m.profiles?.sp || 0, avatar: (m.profiles?.full_name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2),
    })));
    setTreasury(treasuryRes.data || []);
    setLoans(loansRes.data || []);
    setWars(warsRes.data || []);
    setProjects(projectsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { reload(); }, [guildId]);
  return { guild, members, treasury, loans, wars, projects, loading, reload };
};

/* ═══ OVERVIEW ═══ */
const OverviewTab = ({ guild, members, treasury, wars, projects }: any) => {
  if (!guild) return null;
  const stats = [
    { label: "Treasury", value: (guild.total_sp || 0).toLocaleString(), icon: Coins, color: "text-badge-gold" },
    { label: "Members", value: members.length, icon: Users, color: "text-foreground" },
    { label: "Avg ELO", value: guild.avg_elo || 1000, icon: TrendingUp, color: "text-skill-green" },
    { label: "Global Rank", value: guild.rank > 0 ? `#${guild.rank}` : "—", icon: Trophy, color: "text-court-blue" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-badge-gold/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2 text-4xl">⚔️</div>
            <div>
              <h2 className="font-heading text-3xl font-black text-foreground">{guild.name}</h2>
              <p className="text-muted-foreground mt-1 max-w-lg">{guild.description || "No description."}</p>
              <Badge className="mt-2 bg-badge-gold/10 text-badge-gold border-none">Rank #{guild.rank || "—"}</Badge>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-2">
            <span className="text-sm text-muted-foreground">Win Rate: {guild.win_rate || 0}%</span>
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
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Top Members</h3>
          <div className="space-y-3">
            {members.sort((a: any, b: any) => b.elo - a.elo).slice(0, 4).map((m: any, i: number) => (
              <div key={m.user_id} className="flex items-center gap-3">
                <span className={`text-lg font-bold ${i === 0 ? 'text-badge-gold' : 'text-muted-foreground/50'}`}>#{i + 1}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${eloTier(m.elo).bg} font-mono text-sm font-bold ${eloTier(m.elo).color}`}>{m.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">ELO {m.elo}</p>
                </div>
                <Badge className={roleColor(m.role)}>{m.role}</Badge>
              </div>
            ))}
            {members.length === 0 && <p className="text-sm text-muted-foreground">No members yet</p>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2"><Swords size={16} className="text-alert-red" /> Guild Wars</h3>
          <div className="space-y-3 mt-4">
            {wars.slice(0, 3).map((war: any) => (
              <div key={war.id} className={`rounded-lg border p-3 ${
                war.status === "Upcoming" ? "border-badge-gold/20 bg-badge-gold/5" :
                war.status === "Victory" ? "border-skill-green/20 bg-skill-green/5" :
                "border-alert-red/20 bg-alert-red/5"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">vs {war.opponent_name}</span>
                  <Badge className={war.status === "Victory" ? "bg-skill-green/10 text-skill-green border-none" : war.status === "Upcoming" ? "bg-badge-gold/10 text-badge-gold border-none" : "bg-alert-red/10 text-alert-red border-none"}>{war.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(war.start_date).toLocaleDateString()}</span>
                  <span className="text-badge-gold font-medium">{war.stakes} SP stakes</span>
                </div>
              </div>
            ))}
            {wars.length === 0 && <p className="text-sm text-muted-foreground">No wars yet</p>}
          </div>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Guild Projects</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p: any) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-1 p-4">
                <Badge className={p.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" : p.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{p.status}</Badge>
                <h4 className="text-sm font-bold text-foreground mt-2 mb-2">{p.title}</h4>
                <Progress value={p.progress} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{p.members_count} members</span>
                  {p.sp_pool > 0 && <span className="text-badge-gold">{p.sp_pool} SP</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══ MEMBERS ═══ */
const MembersTab = ({ members }: { members: any[] }) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? members : members.filter((m: any) => m.role.toLowerCase().includes(filter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Members ({members.length})</h2>
      </div>
      <div className="flex gap-2">
        {["all", "guild master", "officer", "member"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? 'bg-foreground text-background' : 'bg-surface-1 text-muted-foreground hover:text-foreground'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m: any) => {
          const tier = eloTier(m.elo);
          return (
            <Link key={m.user_id} to={`/profile/${m.user_id}`}>
              <motion.div className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>{m.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground">{m.name}</h3>
                    <Badge className={`mt-1 ${roleColor(m.role)}`}>{m.role}</Badge>
                  </div>
                  <Badge className={`${tier.bg} ${tier.color} border-none`}>{tier.label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{m.elo}</p>
                    <p className="text-[9px] text-muted-foreground">ELO</p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-badge-gold">{m.sp}</p>
                    <p className="text-[9px] text-muted-foreground">SP</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No members found</p>}
    </div>
  );
};

/* ═══ TREASURY ═══ */
const TreasuryTab = ({ guild, treasury, members }: any) => {
  const getMemberName = (uid: string | null) => {
    if (!uid) return "System";
    return members.find((m: any) => m.user_id === uid)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-badge-gold/20 bg-gradient-to-br from-badge-gold/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Guild Treasury</p>
            <p className="font-heading text-4xl font-black text-badge-gold">{(guild?.total_sp || 0).toLocaleString()} SP</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-badge-gold/10">
            <Coins size={32} className="text-badge-gold" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Transaction History</h3>
        <div className="space-y-2">
          {treasury.map((tx: any) => (
            <div key={tx.id} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tx.type === "deposit" ? "bg-skill-green/10" : "bg-alert-red/10"}`}>
                {tx.type === "deposit" ? <ArrowUpRight size={16} className="text-skill-green" /> : <ArrowDownRight size={16} className="text-alert-red" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{tx.reason || tx.type}</p>
                <p className="text-[10px] text-muted-foreground">by {getMemberName(tx.user_id)} · {new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-sm font-bold ${tx.type === "deposit" ? "text-skill-green" : "text-alert-red"}`}>
                {tx.type === "deposit" ? "+" : "-"}{tx.amount} SP
              </span>
            </div>
          ))}
          {treasury.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>}
        </div>
      </div>
    </div>
  );
};

/* ═══ LENDING ═══ */
const LendingTab = ({ loans, members }: any) => {
  const activeLoans = loans.filter((l: any) => l.status === "active");
  const totalOutstanding = activeLoans.reduce((s: number, l: any) => s + l.amount, 0);

  const getMemberName = (uid: string) => members.find((m: any) => m.user_id === uid)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-foreground">SP Lending</h2>
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
          <p className="font-heading text-2xl font-black text-foreground">{activeLoans.length}</p>
          <p className="text-xs text-muted-foreground">Active Loans</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Active Loans</h3>
        <div className="space-y-4">
          {activeLoans.map((loan: any) => (
            <div key={loan.id} className="rounded-xl border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{getMemberName(loan.borrower_id)}</p>
                  <p className="text-xs text-muted-foreground">Borrowed {new Date(loan.borrowed_at).toLocaleDateString()}</p>
                </div>
                <Badge className="bg-court-blue/10 text-court-blue border-none">{loan.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-badge-gold">{loan.amount} SP</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={10} /> Due: {new Date(loan.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {activeLoans.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No active loans</p>}
        </div>
      </div>
    </div>
  );
};

/* ═══ WARS ═══ */
const WarsTab = ({ guild, wars }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2"><Swords size={24} className="text-alert-red" /> Guild Wars</h2>
      <div className="space-y-4">
        {wars.map((war: any) => (
          <motion.div key={war.id} className={`rounded-2xl border overflow-hidden ${war.status === "Upcoming" ? "border-badge-gold/30" : war.status === "Victory" ? "border-skill-green/30" : "border-alert-red/30"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`px-5 py-3 ${war.status === "Upcoming" ? "bg-badge-gold/10" : war.status === "Victory" ? "bg-skill-green/10" : "bg-alert-red/10"}`}>
              <div className="flex items-center justify-between">
                <Badge className={war.status === "Victory" ? "bg-skill-green/20 text-skill-green border-none" : war.status === "Upcoming" ? "bg-badge-gold/20 text-badge-gold border-none" : "bg-alert-red/20 text-alert-red border-none"}>{war.status}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(war.start_date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-5 bg-card">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{guild?.name}</p>
                  {war.status !== "Upcoming" && <p className={`text-xl font-black ${war.our_score > war.their_score ? "text-skill-green" : "text-alert-red"}`}>{war.our_score}</p>}
                </div>
                <div className="text-3xl font-black text-muted-foreground/30">VS</div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{war.opponent_name}</p>
                  {war.status !== "Upcoming" && <p className={`text-xl font-black ${war.their_score > war.our_score ? "text-skill-green" : "text-alert-red"}`}>{war.their_score}</p>}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-badge-gold"><Coins size={14} /><span className="text-sm font-bold">{war.stakes} SP stakes</span></div>
            </div>
          </motion.div>
        ))}
        {wars.length === 0 && <div className="py-16 text-center text-muted-foreground"><Swords size={32} className="mx-auto mb-3 opacity-30" /><p>No guild wars yet</p></div>}
      </div>
    </div>
  );
};

/* ═══ PROJECTS ═══ */
const ProjectsTab = ({ projects }: { projects: any[] }) => (
  <div className="space-y-6">
    <h2 className="font-heading text-2xl font-bold text-foreground">Guild Projects</h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((p: any) => (
        <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
          <Badge className={p.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" : p.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{p.status}</Badge>
          <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{p.title}</h3>
          <Progress value={p.progress} className="h-2 mb-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span><Users size={10} className="inline mr-1" />{p.members_count} members</span>
            <span>Client: {p.client}</span>
            {p.sp_pool > 0 && <span className="text-badge-gold">{p.sp_pool} SP</span>}
          </div>
        </div>
      ))}
    </div>
    {projects.length === 0 && <div className="py-16 text-center text-muted-foreground"><Briefcase size={32} className="mx-auto mb-3 opacity-30" /><p>No projects yet</p></div>}
  </div>
);

/* ═══ SIDEBAR ═══ */
const GuildSidebar = ({ activeTab, setActiveTab, guild, wars }: any) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        {!collapsed && guild && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">⚔️</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{guild.name}</p>
                <p className="text-xs text-muted-foreground">Rank #{guild.rank || "—"}</p>
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
                    {!collapsed && item.id === "wars" && wars.some((w: any) => w.status === "Upcoming") && (
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
  const { guildId } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const { guild, members, treasury, loans, wars, projects, loading } = useGuildDashData(guildId);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      </PageTransition>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab guild={guild} members={members} treasury={treasury} wars={wars} projects={projects} />;
      case "members": return <MembersTab members={members} />;
      case "treasury": return <TreasuryTab guild={guild} treasury={treasury} members={members} />;
      case "lending": return <LendingTab loans={loans} members={members} />;
      case "wars": return <WarsTab guild={guild} wars={wars} />;
      case "projects": return <ProjectsTab projects={projects} />;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Guild settings coming soon...</div>;
      default: return <OverviewTab guild={guild} members={members} treasury={treasury} wars={wars} projects={projects} />;
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <GuildSidebar activeTab={activeTab} setActiveTab={setActiveTab} guild={guild} wars={wars} />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="font-heading text-lg font-bold text-foreground capitalize">{activeTab.replace("-", " ")}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/guild/${guildId}`} className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guild Page
                </Link>
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
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
