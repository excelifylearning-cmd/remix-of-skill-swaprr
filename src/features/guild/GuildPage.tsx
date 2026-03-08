import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Users, Trophy, Star, Zap, Crown, Shield, Calendar,
  MessageSquare, ChevronRight, Swords, UserPlus,
  CheckCircle2, Activity, Briefcase, Coins, Clock,
  ArrowRight, AlertCircle, Loader2
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logInteraction, logFormSubmission } from "@/lib/activity-logger";

type GuildData = {
  id: string; name: string; description: string; slogan: string; category: string;
  rank: number; is_public: boolean; total_sp: number; total_gigs: number;
  avg_elo: number; win_rate: number; requirements: string[]; perks: string[];
  created_by: string; created_at: string;
};

type GuildMember = {
  user_id: string; role: string; joined_at: string;
  profile?: { full_name: string; elo: number; avatar_url: string | null };
};

type GuildProject = {
  id: string; title: string; client: string; status: string;
  progress: number; sp_pool: number; members_count: number; created_at: string;
};

type GuildWar = {
  id: string; opponent_name: string; our_score: number; their_score: number;
  stakes: number; status: string; start_date: string;
};

type TreasuryEntry = {
  id: string; type: string; amount: number; reason: string;
  user_id: string | null; created_at: string;
};

type MemberListing = {
  id: string; title: string; category: string; price: string;
  status: string; user_id: string;
};

const tabs = ["Overview", "Members", "Projects", "Wars", "Contributions"] as const;
type Tab = typeof tabs[number];

const GuildPage = () => {
  const { guildId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [badges, setBadges] = useState<{ name: string; icon: string; awarded_at: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; icon: string; description: string; progress: number; completed: boolean; threshold: number }[]>([]);
  const [projects, setProjects] = useState<GuildProject[]>([]);
  const [wars, setWars] = useState<GuildWar[]>([]);
  const [treasury, setTreasury] = useState<TreasuryEntry[]>([]);
  const [memberListings, setMemberListings] = useState<MemberListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (guildId) loadGuild(guildId);
  }, [guildId]);

  const loadGuild = async (id: string) => {
    setLoading(true);
    const [guildRes, membersRes, badgesRes, achievementsRes, projectsRes, warsRes, treasuryRes] = await Promise.all([
      supabase.from("guilds").select("*").eq("id", id).single(),
      supabase.from("guild_members").select("user_id, role, joined_at, profiles(full_name, elo, avatar_url)").eq("guild_id", id),
      supabase.from("guild_badges").select("awarded_at, badges(name, icon)").eq("guild_id", id),
      supabase.from("guild_achievements").select("progress, completed, achievements(name, icon, description, threshold)").eq("guild_id", id),
      supabase.from("guild_projects").select("*").eq("guild_id", id).order("created_at", { ascending: false }),
      supabase.from("guild_wars").select("*").eq("guild_id", id).order("start_date", { ascending: false }),
      supabase.from("guild_treasury_log").select("*").eq("guild_id", id).order("created_at", { ascending: false }).limit(50),
    ]);

    if (guildRes.data) setGuild(guildRes.data as any);
    const memberList = membersRes.data?.map((m: any) => ({ user_id: m.user_id, role: m.role, joined_at: m.joined_at, profile: m.profiles })) || [];
    setMembers(memberList);
    if (badgesRes.data) setBadges(badgesRes.data.map((b: any) => ({ name: b.badges?.name || "", icon: b.badges?.icon || "⭐", awarded_at: b.awarded_at })));
    if (achievementsRes.data) setAchievements(achievementsRes.data.map((a: any) => ({ name: a.achievements?.name || "", icon: a.achievements?.icon || "🏆", description: a.achievements?.description || "", progress: a.progress, completed: a.completed, threshold: a.achievements?.threshold || 0 })));
    if (projectsRes.data) setProjects(projectsRes.data as any);
    if (warsRes.data) setWars(warsRes.data as any);
    if (treasuryRes.data) setTreasury(treasuryRes.data as any);

    // Fetch listings from all guild members
    if (memberList.length > 0) {
      const userIds = memberList.map((m: GuildMember) => m.user_id);
      const { data: listingsData } = await supabase
        .from("listings").select("id, title, category, price, status, user_id")
        .in("user_id", userIds).eq("status", "Active").limit(20);
      if (listingsData) setMemberListings(listingsData);
    }

    setLoading(false);
  };

  const isMember = members.some(m => m.user_id === user?.id);
  const leaders = members.filter(m => m.role === "Guild Master" || m.role === "Officer");

  const handleJoinGuild = async () => {
    if (!user) { setShowLoginPrompt(true); return; }
    if (!guild || isMember) return;
    setJoining(true);
    const { error } = await supabase.from("guild_members").insert({ guild_id: guild.id, user_id: user.id, role: "Member" });
    if (error) {
      toast.error("Failed to join guild");
    } else {
      toast.success(guild.is_public ? "Joined guild!" : "Application submitted!");
      logInteraction("guild_join", { guild_id: guild.id, guild_name: guild.name, is_public: guild.is_public });
      if (guildId) loadGuild(guildId);
    }
    setJoining(false);
  };

  const handleMessage = () => {
    if (!user) { setShowLoginPrompt(true); return; }
    toast.info("Guild messaging coming soon!");
  };

  const getMemberName = (uid: string | null) => {
    if (!uid) return "System";
    const m = members.find(m => m.user_id === uid);
    return m?.profile?.full_name || "Unknown";
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav backLabel="Guilds" />
          <div className="flex items-center justify-center pt-40">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!guild) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav backLabel="Guilds" />
          <div className="flex flex-col items-center justify-center pt-40 gap-4">
            <p className="text-sm text-muted-foreground">Guild not found.</p>
            <Link to="/" className="text-xs text-foreground hover:underline">Go Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backLabel="Guilds" />

        {/* ─── HEADER ─── */}
        <section className="pt-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">{guild.name}</h1>
                  {guild.rank > 0 && <span className="rounded-full border border-border px-3 py-1 text-[10px] font-mono text-muted-foreground">#{guild.rank}</span>}
                </div>
                {guild.slogan && <p className="text-sm text-muted-foreground max-w-xl">{guild.slogan}</p>}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={12} /> {members.length} members</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Est. {new Date(guild.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  <span>{guild.category}</span>
                  {!guild.is_public && <span className="flex items-center gap-1"><Shield size={12} /> Private</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!isMember && (
                  <button
                    onClick={handleJoinGuild}
                    disabled={joining}
                    className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background disabled:opacity-50"
                  >
                    {joining ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                    {guild.is_public ? "Join Guild" : "Apply"}
                  </button>
                )}
                {isMember && (
                  <Link to={`/guild-dashboard/${guild.id}`} className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background">
                    Dashboard <ArrowRight size={12} />
                  </Link>
                )}
                <button onClick={handleMessage} className="rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8 pt-6 border-t border-border">
              {[
                { label: "Total SP", value: guild.total_sp.toLocaleString() },
                { label: "Gigs Done", value: guild.total_gigs.toString() },
                { label: "Avg ELO", value: guild.avg_elo.toString() },
                { label: "Win Rate", value: `${guild.win_rate}%` },
                { label: "Members", value: members.length.toString() },
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
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>{tab}</button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TAB CONTENT ─── */}
        <section className="px-6 py-10 pb-20">
          <div className="max-w-5xl mx-auto">

            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="grid lg:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-10">
                  <div>
                    <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">About</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guild.description || "No description yet."}</p>
                  </div>

                  {(guild.requirements?.length > 0 || guild.perks?.length > 0) && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {guild.requirements?.length > 0 && (
                        <div>
                          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Requirements</h3>
                          <div className="space-y-2">
                            {guild.requirements.map((r, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 size={12} className="shrink-0" /> {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {guild.perks?.length > 0 && (
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
                      )}
                    </div>
                  )}

                  {/* Leadership */}
                  {leaders.length > 0 && (
                    <div>
                      <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Leadership</h2>
                      <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                        {leaders.map(leader => (
                          <Link key={leader.user_id} to={`/profile/${leader.user_id}`} className="flex items-center gap-4 p-4 bg-card hover:bg-surface-1 transition-colors">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-foreground">
                              {leader.profile?.full_name?.charAt(0) || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                {leader.profile?.full_name || "Unknown"}
                                {leader.role === "Guild Master" && <Crown size={12} className="text-muted-foreground" />}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{leader.role}</p>
                            </div>
                            <span className="font-mono text-xs text-muted-foreground">{leader.profile?.elo || 1000}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Member Listings */}
                  {memberListings.length > 0 && (
                    <div>
                      <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Member Listings</h2>
                      <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                        {memberListings.slice(0, 6).map(listing => (
                          <div key={listing.id} className="flex items-center justify-between p-4 bg-card">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{listing.title}</p>
                              <p className="text-[10px] text-muted-foreground">{listing.category} · by {getMemberName(listing.user_id)}</p>
                            </div>
                            <span className="font-mono text-xs text-muted-foreground shrink-0 ml-4">{listing.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {treasury.length > 0 && (
                    <div>
                      <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">Recent Activity</h2>
                      <div className="space-y-2">
                        {treasury.slice(0, 5).map(entry => (
                          <div key={entry.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${entry.type === "deposit" ? "bg-skill-green/10" : "bg-surface-2"}`}>
                              <Coins size={12} className={entry.type === "deposit" ? "text-skill-green" : "text-muted-foreground"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground">{entry.reason || entry.type}</p>
                              <p className="text-[10px] text-muted-foreground">{getMemberName(entry.user_id)} · {new Date(entry.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-mono text-xs ${entry.type === "deposit" ? "text-skill-green" : "text-muted-foreground"}`}>
                              {entry.type === "deposit" ? "+" : "-"}{entry.amount} SP
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {badges.length > 0 && (
                    <div>
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Badges</h3>
                      <div className="flex flex-wrap gap-2">
                        {badges.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                            <span className="text-lg">{b.icon}</span>
                            <span className="text-[10px] text-foreground font-medium">{b.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {achievements.length > 0 && (
                    <div>
                      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Achievements</h3>
                      <div className="space-y-2">
                        {achievements.map((a, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                            <span className="text-lg">{a.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-foreground font-medium">{a.name}</p>
                              {!a.completed && a.threshold > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1 rounded-full bg-surface-2 overflow-hidden">
                                    <div className="h-full rounded-full bg-foreground" style={{ width: `${Math.min((a.progress / a.threshold) * 100, 100)}%` }} />
                                  </div>
                                  <span className="font-mono text-[9px] text-muted-foreground">{a.progress}/{a.threshold}</span>
                                </div>
                              )}
                            </div>
                            {a.completed && <CheckCircle2 size={12} className="text-skill-green shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div>
                    <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Stats</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Active Projects</span><span className="font-mono text-foreground">{projects.filter(p => p.status !== "Completed").length}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Wars Won</span><span className="font-mono text-foreground">{wars.filter(w => w.our_score > w.their_score && w.status === "Completed").length}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Active Listings</span><span className="font-mono text-foreground">{memberListings.length}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Treasury Txns</span><span className="font-mono text-foreground">{treasury.length}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS */}
            {activeTab === "Members" && (
              <div>
                <p className="text-xs text-muted-foreground mb-6">{members.length} members</p>
                {members.length > 0 ? (
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {members.map(member => (
                      <Link key={member.user_id} to={`/profile/${member.user_id}`} className="flex items-center gap-4 p-4 bg-card hover:bg-surface-1 transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-foreground">
                          {member.profile?.full_name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            {member.profile?.full_name || "Unknown"}
                            {member.role === "Guild Master" && <Crown size={12} className="text-muted-foreground" />}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{member.role} · Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{member.profile?.elo || 1000} ELO</span>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No members yet.</p>
                )}
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === "Projects" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Projects</h2>
                  <span className="text-xs text-muted-foreground">{projects.length} total</span>
                </div>
                {projects.length > 0 ? (
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {projects.map(project => (
                      <div key={project.id} className="p-5 bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Client: {project.client} · {project.members_count} members</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            project.status === "Completed" ? "bg-skill-green/10 text-skill-green" :
                            project.status === "In Progress" ? "bg-badge-gold/10 text-badge-gold" :
                            "bg-surface-2 text-muted-foreground"
                          }`}>{project.status}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                              <div className="h-full rounded-full bg-foreground" style={{ width: `${project.progress}%` }} />
                            </div>
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">{project.progress}%</span>
                          <span className="font-mono text-xs text-muted-foreground">{project.sp_pool} SP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase size={24} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No projects yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* WARS */}
            {activeTab === "Wars" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Guild Wars</h2>
                  <span className="text-xs text-muted-foreground">{wars.length} total</span>
                </div>
                {wars.length > 0 ? (
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {wars.map(war => {
                      const won = war.our_score > war.their_score;
                      const lost = war.their_score > war.our_score;
                      const isActive = war.status === "Active" || war.status === "In Progress";
                      return (
                        <div key={war.id} className="p-5 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Swords size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">vs {war.opponent_name}</p>
                                <p className="text-[10px] text-muted-foreground">{new Date(war.start_date).toLocaleDateString()} · {war.stakes} SP stakes</p>
                              </div>
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              isActive ? "bg-badge-gold/10 text-badge-gold" :
                              won ? "bg-skill-green/10 text-skill-green" :
                              lost ? "bg-alert-red/10 text-alert-red" :
                              "bg-surface-2 text-muted-foreground"
                            }`}>
                              {isActive ? "Active" : won ? "Won" : lost ? "Lost" : war.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1 text-center">
                              <p className="font-mono text-2xl font-bold text-foreground">{war.our_score}</p>
                              <p className="text-[10px] text-muted-foreground">Our Score</p>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">vs</span>
                            <div className="flex-1 text-center">
                              <p className="font-mono text-2xl font-bold text-muted-foreground">{war.their_score}</p>
                              <p className="text-[10px] text-muted-foreground">Their Score</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Swords size={24} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No wars yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* CONTRIBUTIONS */}
            {activeTab === "Contributions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Treasury History</h2>
                  <span className="text-xs text-muted-foreground">{treasury.length} entries</span>
                </div>
                {treasury.length > 0 ? (
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {treasury.map(entry => (
                      <div key={entry.id} className="flex items-center gap-4 p-4 bg-card">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${entry.type === "deposit" ? "bg-skill-green/10" : "bg-surface-2"}`}>
                          <Coins size={14} className={entry.type === "deposit" ? "text-skill-green" : "text-muted-foreground"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{entry.reason || entry.type}</p>
                          <p className="text-[10px] text-muted-foreground">{getMemberName(entry.user_id)} · {new Date(entry.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`font-mono text-sm font-bold ${entry.type === "deposit" ? "text-skill-green" : "text-muted-foreground"}`}>
                          {entry.type === "deposit" ? "+" : "-"}{entry.amount} SP
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Coins size={24} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No treasury activity yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} message="Sign in to join guilds and participate in guild activities." />
      </div>
    </PageTransition>
  );
};

export default GuildPage;
