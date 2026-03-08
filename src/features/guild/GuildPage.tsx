import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Users, Trophy, Star, Zap, Crown, Shield, Calendar,
  MessageSquare, ChevronRight, Swords, MapPin, UserPlus,
  Clock, CheckCircle2, Activity
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

type GuildData = {
  id: string;
  name: string;
  description: string;
  slogan: string;
  category: string;
  rank: number;
  is_public: boolean;
  total_sp: number;
  total_gigs: number;
  avg_elo: number;
  win_rate: number;
  requirements: string[];
  perks: string[];
  created_by: string;
  created_at: string;
};

type GuildMember = {
  user_id: string;
  role: string;
  joined_at: string;
  profile?: { full_name: string; elo: number; avatar_url: string | null };
};

const tabs = ["Overview", "Members", "Projects", "Wars"] as const;
type Tab = typeof tabs[number];

const GuildPage = () => {
  const { guildId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [badges, setBadges] = useState<{ name: string; icon: string; awarded_at: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; icon: string; description: string; progress: number; completed: boolean; threshold: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) loadGuild(guildId);
  }, [guildId]);

  const loadGuild = async (id: string) => {
    setLoading(true);
    const [guildRes, membersRes, badgesRes, achievementsRes] = await Promise.all([
      supabase.from("guilds").select("*").eq("id", id).single(),
      supabase.from("guild_members").select("user_id, role, joined_at, profiles(full_name, elo, avatar_url)").eq("guild_id", id),
      supabase.from("guild_badges").select("awarded_at, badges(name, icon)").eq("guild_id", id),
      supabase.from("guild_achievements").select("progress, completed, achievements(name, icon, description, threshold)").eq("guild_id", id),
    ]);

    if (guildRes.data) setGuild(guildRes.data as any);
    if (membersRes.data) setMembers(membersRes.data.map((m: any) => ({ user_id: m.user_id, role: m.role, joined_at: m.joined_at, profile: m.profiles })));
    if (badgesRes.data) setBadges(badgesRes.data.map((b: any) => ({ name: b.badges?.name || "", icon: b.badges?.icon || "⭐", awarded_at: b.awarded_at })));
    if (achievementsRes.data) setAchievements(achievementsRes.data.map((a: any) => ({ name: a.achievements?.name || "", icon: a.achievements?.icon || "🏆", description: a.achievements?.description || "", progress: a.progress, completed: a.completed, threshold: a.achievements?.threshold || 0 })));
    setLoading(false);
  };

  const isMember = members.some(m => m.user_id === user?.id);
  const leaders = members.filter(m => m.role === "Guild Master" || m.role === "Officer");

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center pt-40">
            <p className="text-sm text-muted-foreground">Loading guild...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!guild) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
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
        <Navbar />

        {/* ─── HEADER ─── */}
        <section className="pt-24 px-6">
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
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!isMember && (
                  <button className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background">
                    <UserPlus size={12} /> Join Guild
                  </button>
                )}
                <button className="rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors">
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
        <section className="px-6 py-10 pb-16">
          <div className="max-w-5xl mx-auto">

            {activeTab === "Overview" && (
              <div className="grid lg:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-10">
                  {/* About */}
                  <div>
                    <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-4">About</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guild.description || "No description yet."}</p>
                  </div>

                  {/* Requirements & Perks */}
                  {(guild.requirements.length > 0 || guild.perks.length > 0) && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {guild.requirements.length > 0 && (
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
                      {guild.perks.length > 0 && (
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
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Badges */}
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

                  {/* Achievements */}
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
                          <p className="text-[10px] text-muted-foreground">{member.role}</p>
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
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Guild Projects</h2>
                <p className="text-xs text-muted-foreground">Project tracking coming soon.</p>
              </div>
            )}

            {/* WARS */}
            {activeTab === "Wars" && (
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Guild Wars History</h2>
                <p className="text-xs text-muted-foreground">War tracking coming soon.</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GuildPage;
