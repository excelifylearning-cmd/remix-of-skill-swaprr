import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Users, Trophy, Zap, Crown, Shield, Calendar, MessageSquare,
  ChevronRight, Swords, UserPlus, CheckCircle2, Briefcase,
  Coins, ArrowRight, Loader2, Award, Flame, Target, Star,
  Hash, Plus, Edit2, Save, X, Eye, EyeOff, GripVertical,
  ChevronDown, ChevronUp, Trash2, BarChart3, Vote, Code,
  ListChecks, Type, Send, MessageCircle, Newspaper, Bookmark
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logInteraction } from "@/lib/activity-logger";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type GuildData = {
  id: string; name: string; description: string; slogan: string; category: string;
  rank: number; is_public: boolean; total_sp: number; total_gigs: number;
  avg_elo: number; win_rate: number; requirements: string[]; perks: string[];
  created_by: string; created_at: string; guild_sections: GuildSection[] | null;
};

type GuildSection = {
  id: string; type: string; title: string; content_markdown: string;
  order: number; visible: boolean; widget_config?: any;
};

type GuildMember = {
  user_id: string; role: string; joined_at: string;
  profile?: { full_name: string; elo: number; avatar_url: string | null };
};
type GuildProject = { id: string; title: string; client: string; status: string; progress: number; sp_pool: number; members_count: number; created_at: string; };
type GuildWar = { id: string; opponent_name: string; our_score: number; their_score: number; stakes: number; status: string; start_date: string; };
type TreasuryEntry = { id: string; type: string; amount: number; reason: string; user_id: string | null; created_at: string; };
type MemberListing = { id: string; title: string; category: string; price: string; status: string; user_id: string; };

const getBadgeIcon = (category: string) => {
  const map: Record<string, any> = { general: Award, skill: Zap, social: Users, streak: Flame, competition: Trophy, quality: Shield, milestone: Target };
  return map[category?.toLowerCase()] || Award;
};

const tabs = ["Overview", "Members", "Projects", "Wars", "Contributions", "Chat"] as const;
type Tab = typeof tabs[number];

/* ─── Markdown Preview ─── */
const MarkdownPreview = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <div className="prose-sm max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h4 key={i} className="text-xs font-bold text-foreground mt-3 mb-1 font-heading">{line.slice(4)}</h4>;
        if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-bold text-foreground mt-4 mb-1 font-heading">{line.slice(3)}</h3>;
        if (line.startsWith("# ")) return <h2 key={i} className="text-base font-bold text-foreground mt-4 mb-2 font-heading">{line.slice(2)}</h2>;
        if (line.startsWith("- ")) return <li key={i} className="text-xs text-muted-foreground ml-4 font-body list-disc">{line.slice(2)}</li>;
        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-border pl-3 text-xs text-muted-foreground italic font-body my-1">{line.slice(2)}</blockquote>;
        if (line.trim() === "") return <br key={i} />;
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-surface-2 px-1 rounded font-mono text-[10px]">$1</code>');
        return <p key={i} className="text-xs text-muted-foreground font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
};

/* ─── Widget Card ─── */
const WidgetCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
    <div className="flex items-center gap-2 mb-4">
      <Icon size={13} className="text-muted-foreground" />
      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-body">{title}</h3>
    </div>
    {children}
  </div>
);

/* ─── Guild Page ─── */
const GuildPage = () => {
  const { guildId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [badges, setBadges] = useState<{ name: string; icon: string; category: string; awarded_at: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; icon: string; category: string; description: string; progress: number; completed: boolean; threshold: number }[]>([]);
  const [projects, setProjects] = useState<GuildProject[]>([]);
  const [wars, setWars] = useState<GuildWar[]>([]);
  const [treasury, setTreasury] = useState<TreasuryEntry[]>([]);
  const [memberListings, setMemberListings] = useState<MemberListing[]>([]);
  const [memberBlogPosts, setMemberBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customSections, setCustomSections] = useState<GuildSection[]>([]);

  useEffect(() => { if (guildId) loadGuild(guildId); }, [guildId]);

  const loadGuild = async (id: string) => {
    setLoading(true);
    const [guildRes, membersRes, badgesRes, achievementsRes, projectsRes, warsRes, treasuryRes] = await Promise.all([
      supabase.from("guilds").select("*").eq("id", id).single(),
      supabase.from("guild_members").select("user_id, role, joined_at, profiles(full_name, elo, avatar_url)").eq("guild_id", id),
      supabase.from("guild_badges").select("awarded_at, badges(name, icon, category)").eq("guild_id", id),
      supabase.from("guild_achievements").select("progress, completed, achievements(name, icon, category, description, threshold)").eq("guild_id", id),
      supabase.from("guild_projects").select("*").eq("guild_id", id).order("created_at", { ascending: false }),
      supabase.from("guild_wars").select("*").eq("guild_id", id).order("start_date", { ascending: false }),
      supabase.from("guild_treasury_log").select("*").eq("guild_id", id).order("created_at", { ascending: false }).limit(50),
    ]);

    if (guildRes.data) {
      setGuild(guildRes.data as any);
      const sections = (guildRes.data as any).guild_sections;
      setCustomSections(Array.isArray(sections) ? sections : []);
    }
    const memberList = membersRes.data?.map((m: any) => ({
      user_id: m.user_id, role: m.role, joined_at: m.joined_at, profile: m.profiles,
    })) || [];
    setMembers(memberList);
    if (badgesRes.data) setBadges(badgesRes.data.map((b: any) => ({ name: b.badges?.name || "", icon: b.badges?.icon || "⭐", category: b.badges?.category || "general", awarded_at: b.awarded_at })));
    if (achievementsRes.data) setAchievements(achievementsRes.data.map((a: any) => ({ name: a.achievements?.name || "", icon: a.achievements?.icon || "🏆", category: a.achievements?.category || "general", description: a.achievements?.description || "", progress: a.progress, completed: a.completed, threshold: a.achievements?.threshold || 0 })));
    if (projectsRes.data) setProjects(projectsRes.data as any);
    if (warsRes.data) setWars(warsRes.data as any);
    if (treasuryRes.data) setTreasury(treasuryRes.data as any);

    if (memberList.length > 0) {
      const userIds = memberList.map((m: GuildMember) => m.user_id);
      const [listingsData, blogData] = await Promise.all([
        supabase.from("listings").select("id, title, category, price, status, user_id").in("user_id", userIds).eq("status", "Active").limit(20),
        supabase.from("blog_posts").select("id, title, slug, author_name, created_at").in("author_id", userIds).limit(5),
      ]);
      if (listingsData.data) setMemberListings(listingsData.data);
      if (blogData.data) setMemberBlogPosts(blogData.data);
    }
    setLoading(false);
  };

  const isMember = members.some(m => m.user_id === user?.id);
  const isLeader = members.some(m => m.user_id === user?.id && (m.role === "Guild Master" || m.role === "Officer"));
  const leaders = members.filter(m => m.role === "Guild Master" || m.role === "Officer");

  const handleJoinGuild = async () => {
    if (!user) { setShowLoginPrompt(true); return; }
    if (!guild || isMember) return;
    setJoining(true);
    const { error } = await supabase.from("guild_members").insert({ guild_id: guild.id, user_id: user.id, role: "Member" });
    if (error) toast.error("Failed to join guild");
    else {
      toast.success(guild.is_public ? "Joined guild!" : "Application submitted!");
      logInteraction("guild_join", { guild_id: guild.id });
      if (guildId) loadGuild(guildId);
    }
    setJoining(false);
  };

  const getMemberName = (uid: string | null) => {
    if (!uid) return "System";
    return members.find(m => m.user_id === uid)?.profile?.full_name || "Unknown";
  };

  if (loading) {
    return <PageTransition><div className="min-h-screen bg-background"><AppNav backLabel="Discover" />
      <div className="flex items-center justify-center pt-40"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
    </div></PageTransition>;
  }

  if (!guild) {
    return <PageTransition><div className="min-h-screen bg-background"><AppNav backLabel="Discover" />
      <div className="flex flex-col items-center justify-center pt-40 gap-4">
        <p className="text-sm text-muted-foreground font-body">Guild not found.</p>
        <Link to="/" className="text-xs text-foreground hover:underline font-body">Go Home</Link>
      </div>
    </div></PageTransition>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backLabel="Discover" />

        {/* ═══ GUILD HERO ═══ */}
        <section className="pt-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none">{guild.name}</h1>
                  {guild.rank > 0 && (
                    <span className="font-mono text-sm text-muted-foreground border border-border rounded-md px-2 py-0.5">#{guild.rank}</span>
                  )}
                </div>
                {guild.slogan && <p className="text-sm text-muted-foreground max-w-xl mt-2 font-body italic">"{guild.slogan}"</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1.5"><Users size={11} /> {members.length} members</span>
                  <span className="flex items-center gap-1.5"><Calendar size={11} /> Est. {new Date(guild.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  <span>{guild.category}</span>
                  {!guild.is_public && <span className="flex items-center gap-1.5"><Shield size={11} /> Private</span>}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {!isMember && (
                  <button onClick={handleJoinGuild} disabled={joining}
                    className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background disabled:opacity-50 font-body">
                    {joining ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                    {guild.is_public ? "Join Guild" : "Apply"}
                  </button>
                )}
                {isMember && (
                  <Link to={`/guild-dashboard/${guild.id}`} className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background font-body">
                    Dashboard <ArrowRight size={12} />
                  </Link>
                )}
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                  <Send size={12} /> Message
                </button>
                {isLeader && !isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                    <Edit2 size={12} /> Edit
                  </button>
                )}
                {isEditing && (
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      await supabase.from("guilds").update({ guild_sections: customSections as any }).eq("id", guild.id);
                      setIsEditing(false); toast.success("Saved!"); if (guildId) loadGuild(guildId);
                    }} className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background font-body">
                      <Save size={12} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground font-body"><X size={12} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Scoreboard */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-0">
              {[
                { label: "Total SP", value: guild.total_sp.toLocaleString() },
                { label: "Gigs Done", value: guild.total_gigs.toString() },
                { label: "Avg ELO", value: guild.avg_elo.toString() },
                { label: "Win Rate", value: `${guild.win_rate}%` },
                { label: "Members", value: members.length.toString() },
              ].map((s, i) => (
                <div key={s.label} className={cn("flex-1 min-w-[80px]", i > 0 && "border-l border-border pl-4 ml-4")}>
                  <p className="font-mono text-xl md:text-2xl font-bold text-foreground leading-none">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TAB NAV ═══ */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border mt-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-none -mb-px">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn("px-4 py-3 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all font-body",
                    activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}>{tab}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ TAB CONTENT ═══ */}
        <section className="px-6 py-10 pb-20">
          <div className="max-w-6xl mx-auto">

            {/* ─── OVERVIEW — Widget Grid ─── */}
            {activeTab === "Overview" && (
              <div className="space-y-8">
                {/* Widget Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* About */}
                  <WidgetCard title="About" icon={Briefcase} className="lg:col-span-2">
                    <p className="text-sm text-muted-foreground leading-relaxed font-body">{guild.description || "No description yet."}</p>
                  </WidgetCard>

                  {/* Leadership */}
                  <WidgetCard title="Leadership" icon={Crown}>
                    {leaders.length > 0 ? (
                      <div className="space-y-3">
                        {leaders.map(leader => (
                          <Link key={leader.user_id} to={`/profile/${leader.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border font-mono text-[10px] font-bold text-foreground">
                              {leader.profile?.avatar_url ? (
                                <img src={leader.profile.avatar_url} alt="" className="h-full w-full rounded-lg object-cover" />
                              ) : leader.profile?.full_name?.charAt(0) || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground font-body truncate">{leader.profile?.full_name || "Unknown"}</p>
                              <p className="text-[9px] text-muted-foreground font-body">{leader.role} · {leader.profile?.elo || 1000} ELO</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : <p className="text-xs text-muted-foreground font-body">No leaders assigned.</p>}
                  </WidgetCard>

                  {/* Requirements */}
                  {guild.requirements?.length > 0 && (
                    <WidgetCard title="Requirements" icon={CheckCircle2}>
                      <div className="space-y-2">
                        {guild.requirements.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-body">
                            <CheckCircle2 size={11} className="shrink-0 mt-0.5 text-foreground/40" /> {r}
                          </div>
                        ))}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Perks */}
                  {guild.perks?.length > 0 && (
                    <WidgetCard title="Perks" icon={Zap}>
                      <div className="space-y-2">
                        {guild.perks.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-body">
                            <Zap size={11} className="shrink-0 mt-0.5 text-foreground/40" /> {p}
                          </div>
                        ))}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Badges */}
                  {badges.length > 0 && (
                    <WidgetCard title="Badges" icon={Award}>
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((b, i) => {
                          const Icon = getBadgeIcon(b.category);
                          return (
                            <div key={i} className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-1 hover:border-foreground/30 transition-all" title={b.name}>
                              <Icon size={14} className="text-foreground" />
                            </div>
                          );
                        })}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Achievements */}
                  {achievements.length > 0 && (
                    <WidgetCard title="Achievements" icon={Trophy}>
                      <div className="space-y-2.5">
                        {achievements.slice(0, 5).map((a, i) => {
                          const Icon = getBadgeIcon(a.category);
                          return (
                            <div key={i} className="flex items-center gap-2.5">
                              <Icon size={12} className={a.completed ? "text-foreground shrink-0" : "text-muted-foreground/40 shrink-0"} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] text-foreground font-medium font-body truncate">{a.name}</p>
                                {!a.completed && a.threshold > 0 && (
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="flex-1 h-[2px] rounded-full bg-border overflow-hidden">
                                      <div className="h-full rounded-full bg-foreground" style={{ width: `${Math.min((a.progress / a.threshold) * 100, 100)}%` }} />
                                    </div>
                                    <span className="font-mono text-[8px] text-muted-foreground">{a.progress}/{a.threshold}</span>
                                  </div>
                                )}
                              </div>
                              {a.completed && <CheckCircle2 size={10} className="text-foreground shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Member Listings */}
                  {memberListings.length > 0 && (
                    <WidgetCard title="Active Listings" icon={Briefcase} className="lg:col-span-2">
                      <div className="divide-y divide-border">
                        {memberListings.slice(0, 6).map(listing => (
                          <div key={listing.id} className="flex items-center justify-between py-2.5 first:pt-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground font-body truncate">{listing.title}</p>
                              <p className="text-[9px] text-muted-foreground font-body">{listing.category} · {getMemberName(listing.user_id)}</p>
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground shrink-0 ml-4">{listing.price}</span>
                          </div>
                        ))}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Blog Activity */}
                  {memberBlogPosts.length > 0 && (
                    <WidgetCard title="Member Blog Posts" icon={Newspaper}>
                      <div className="space-y-2.5">
                        {memberBlogPosts.map((post: any) => (
                          <div key={post.id}>
                            <p className="text-xs font-medium text-foreground font-body truncate">{post.title}</p>
                            <p className="text-[9px] text-muted-foreground font-body">{post.author_name} · {new Date(post.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </WidgetCard>
                  )}

                  {/* Recent Treasury */}
                  {treasury.length > 0 && (
                    <WidgetCard title="Recent Treasury" icon={Coins}>
                      <div className="space-y-2.5">
                        {treasury.slice(0, 5).map(entry => (
                          <div key={entry.id} className="flex items-center gap-2.5">
                            <Coins size={11} className={entry.type === "deposit" ? "text-foreground" : "text-muted-foreground/40"} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-foreground font-body truncate">{entry.reason || entry.type}</p>
                            </div>
                            <span className={cn("font-mono text-[10px]", entry.type === "deposit" ? "text-foreground" : "text-muted-foreground")}>
                              {entry.type === "deposit" ? "+" : "−"}{entry.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </WidgetCard>
                  )}
                </div>

                {/* Custom Sections */}
                {customSections.filter(s => s.visible || isEditing).map(section => (
                  <div key={section.id} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-3 font-body">{section.title}</h3>
                    <MarkdownPreview content={section.content_markdown} />
                  </div>
                ))}

                {/* Add section (editing) */}
                {isEditing && (
                  <button onClick={() => {
                    const ns: GuildSection = { id: crypto.randomUUID(), type: "custom", title: "New Section", content_markdown: "", order: customSections.length, visible: true };
                    setCustomSections([...customSections, ns]);
                  }} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all w-full justify-center font-body">
                    <Plus size={14} /> Add Section
                  </button>
                )}

                {isEditing && customSections.map((section, i) => (
                  <div key={section.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input value={section.title} onChange={e => {
                        const updated = [...customSections]; updated[i] = { ...section, title: e.target.value }; setCustomSections(updated);
                      }} className="flex-1 bg-transparent text-sm font-bold text-foreground focus:outline-none font-heading" />
                      <button onClick={() => setCustomSections(customSections.filter(s => s.id !== section.id))} className="p-1 text-alert-red/60 hover:text-alert-red"><Trash2 size={12} /></button>
                    </div>
                    <textarea value={section.content_markdown} onChange={e => {
                      const updated = [...customSections]; updated[i] = { ...section, content_markdown: e.target.value }; setCustomSections(updated);
                    }} rows={4} className="w-full bg-surface-1 border border-border rounded-lg text-xs text-foreground font-mono p-3 resize-y focus:outline-none focus:border-foreground/30" placeholder="Write markdown..." />
                  </div>
                ))}
              </div>
            )}

            {/* ─── MEMBERS ─── */}
            {activeTab === "Members" && (
              <div>
                <p className="text-xs text-muted-foreground mb-6 font-body">{members.length} members</p>
                {members.length > 0 ? (
                  <div className="divide-y divide-border">
                    {members.map(member => (
                      <Link key={member.user_id} to={`/profile/${member.user_id}`}
                        className="flex items-center gap-4 py-4 first:pt-0 hover:opacity-80 transition-opacity">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border font-mono text-xs font-bold text-foreground">
                          {member.profile?.avatar_url ? (
                            <img src={member.profile.avatar_url} alt="" className="h-full w-full rounded-lg object-cover" />
                          ) : member.profile?.full_name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5 font-body">
                            {member.profile?.full_name || "Unknown"}
                            {member.role === "Guild Master" && <Crown size={11} className="text-muted-foreground" />}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-body">{member.role} · Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{member.profile?.elo || 1000} ELO</span>
                        <ChevronRight size={13} className="text-muted-foreground/40" />
                      </Link>
                    ))}
                  </div>
                ) : <p className="text-xs text-muted-foreground font-body">No members yet.</p>}
              </div>
            )}

            {/* ─── PROJECTS ─── */}
            {activeTab === "Projects" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">Guild Projects</h2>
                  <span className="text-xs text-muted-foreground font-body">{projects.length} total</span>
                </div>
                {projects.length > 0 ? (
                  <div className="divide-y divide-border">
                    {projects.map(project => (
                      <div key={project.id} className="py-5 first:pt-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground font-body">{project.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-body">Client: {project.client} · {project.members_count} members</p>
                          </div>
                          <span className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0",
                            project.status === "Completed" ? "bg-foreground" : project.status === "In Progress" ? "bg-muted-foreground" : "bg-border"
                          )} title={project.status} />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1"><div className="h-[2px] rounded-full bg-border overflow-hidden"><div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${project.progress}%` }} /></div></div>
                          <span className="font-mono text-[10px] text-muted-foreground">{project.progress}%</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{project.sp_pool} SP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-16"><Briefcase size={20} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-xs text-muted-foreground font-body">No projects yet.</p></div>}
              </div>
            )}

            {/* ─── WARS ─── */}
            {activeTab === "Wars" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">Guild Wars</h2>
                  <span className="text-xs text-muted-foreground font-body">{wars.length} total</span>
                </div>
                {wars.length > 0 ? (
                  <div className="divide-y divide-border">
                    {wars.map(war => {
                      const won = war.our_score > war.their_score;
                      const isActive = war.status === "Active" || war.status === "In Progress";
                      return (
                        <div key={war.id} className="py-5 first:pt-0">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Swords size={14} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground font-body">vs {war.opponent_name}</p>
                                <p className="text-[10px] text-muted-foreground font-body">{new Date(war.start_date).toLocaleDateString()} · {war.stakes} SP stakes</p>
                              </div>
                            </div>
                            <span className={cn("text-[10px] font-mono", isActive ? "text-muted-foreground" : won ? "text-foreground" : "text-muted-foreground/50")}>
                              {isActive ? "LIVE" : won ? "W" : "L"}
                            </span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex-1 text-center">
                              <p className="font-mono text-3xl font-black text-foreground leading-none">{war.our_score}</p>
                              <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1 font-body">Us</p>
                            </div>
                            <span className="text-xs text-border font-mono">—</span>
                            <div className="flex-1 text-center">
                              <p className="font-mono text-3xl font-black text-muted-foreground/40 leading-none">{war.their_score}</p>
                              <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1 font-body">Them</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="text-center py-16"><Swords size={20} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-xs text-muted-foreground font-body">No wars yet.</p></div>}
              </div>
            )}

            {/* ─── CONTRIBUTIONS ─── */}
            {activeTab === "Contributions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest">Treasury History</h2>
                  <span className="text-xs text-muted-foreground font-body">{treasury.length} entries</span>
                </div>
                {treasury.length > 0 ? (
                  <div className="divide-y divide-border">
                    {treasury.map(entry => (
                      <div key={entry.id} className="flex items-center gap-3 py-3.5 first:pt-0">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", entry.type === "deposit" ? "border-foreground/20" : "border-border")}>
                          <Coins size={13} className={entry.type === "deposit" ? "text-foreground" : "text-muted-foreground/40"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-body">{entry.reason || entry.type}</p>
                          <p className="text-[10px] text-muted-foreground font-body">{getMemberName(entry.user_id)} · {new Date(entry.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={cn("font-mono text-sm font-bold", entry.type === "deposit" ? "text-foreground" : "text-muted-foreground")}>
                          {entry.type === "deposit" ? "+" : "−"}{entry.amount} SP
                        </span>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-16"><Coins size={20} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-xs text-muted-foreground font-body">No treasury activity yet.</p></div>}
              </div>
            )}

            {/* ─── CHAT (placeholder) ─── */}
            {activeTab === "Chat" && (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center mx-auto mb-4">
                  <Hash size={24} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-sm font-bold text-foreground font-heading mb-2">Guild Chat</h3>
                <p className="text-xs text-muted-foreground font-body max-w-sm mx-auto">
                  Discord-style channels for guild communication are coming soon. Members will be able to chat in dedicated channels like #general, #announcements, and #off-topic.
                </p>
                {isMember && (
                  <div className="mt-6 flex gap-2 justify-center">
                    {["# general", "# announcements", "# off-topic"].map(ch => (
                      <span key={ch} className="rounded-lg bg-surface-1 border border-border px-3 py-1.5 text-[10px] text-muted-foreground font-mono">{ch}</span>
                    ))}
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
