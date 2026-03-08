import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Users, Trophy, Star, Zap, TrendingUp, Crown, Shield, Calendar,
  MessageSquare, Settings, ChevronRight, ArrowRight, Award, Target,
  Swords, Flag, Medal, MapPin, Globe, ExternalLink, Plus, UserPlus,
  Coins, BarChart3, Clock, CheckCircle2, Briefcase
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK GUILD DATA
═══════════════════════════════════════════════════════════════════════════ */

const mockGuild = {
  id: 1,
  name: "Design Masters",
  icon: "🎨",
  banner: null,
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
  socialLinks: {
    discord: "https://discord.gg/designmasters",
    twitter: "https://twitter.com/designmasters",
  },
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
  ],
  recentActivity: [
    { type: "gig", text: "Maya K. completed a gig", time: "2h ago" },
    { type: "member", text: "Suki T. joined the guild", time: "1d ago" },
    { type: "war", text: "Won Guild War vs Code Ninjas", time: "3d ago" },
    { type: "badge", text: "Unlocked 'Top 5' badge", time: "5d ago" },
  ],
  wars: [
    { opponent: "Code Ninjas", result: "win", score: "4500-3200", date: "2026-03-05" },
    { opponent: "Creative Collective", result: "win", score: "3800-3100", date: "2026-02-28" },
    { opponent: "Tech Titans", result: "loss", score: "2900-4100", date: "2026-02-20" },
  ],
  projects: [
    { id: 1, title: "E-commerce Rebrand", status: "In Progress", members: 4, deadline: "2026-03-20" },
    { id: 2, title: "Mobile App UI Kit", status: "Planning", members: 3, deadline: "2026-04-01" },
  ],
  badges: [
    { name: "Top 5", icon: "🏆", description: "Ranked in top 5 guilds" },
    { name: "War Champions", icon: "⚔️", description: "Won 10+ Guild Wars" },
    { name: "Design Excellence", icon: "🎨", description: "Category leader" },
  ]
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════
   GUILD PAGE
═══════════════════════════════════════════════════════════════════════════ */

const GuildPage = () => {
  const { guildId } = useParams();
  const guild = mockGuild;
  const avgTier = eloTier(guild.avgElo);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-20 pb-0">
          <div className="h-56 bg-gradient-to-br from-badge-gold/20 via-surface-1 to-court-blue/10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[120px] opacity-30">{guild.icon}</span>
            </div>
          </div>
        </section>

        {/* Guild Header */}
        <section className="px-6 pb-8 -mt-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Icon */}
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-card border-4 border-background text-6xl shadow-2xl">
                {guild.icon}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 sm:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">{guild.name}</h1>
                      <Badge className="bg-badge-gold/10 text-badge-gold border-none">Rank #{guild.rank}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{guild.slogan}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users size={14} /> {guild.totalMembers} members</span>
                      <span className="flex items-center gap-1 text-skill-green">
                        <div className="h-2 w-2 rounded-full bg-skill-green animate-pulse" />
                        {guild.onlineMembers} online
                      </span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> Est. {new Date(guild.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
                      <UserPlus size={14} /> Join Guild
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
              {[
                { label: "Total SP", value: guild.totalSP.toLocaleString(), icon: Coins, color: "text-badge-gold" },
                { label: "Gigs Done", value: guild.totalGigs, icon: Briefcase, color: "text-skill-green" },
                { label: "Avg ELO", value: guild.avgElo, icon: TrendingUp, color: avgTier.color },
                { label: "Win Rate", value: `${guild.winRate}%`, icon: Swords, color: "text-court-blue" },
                { label: "Rank", value: `#${guild.rank}`, icon: Trophy, color: "text-badge-gold" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                  <stat.icon size={18} className={`mx-auto mb-2 ${stat.color}`} />
                  <p className={`font-heading text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="members">Members ({guild.totalMembers})</TabsTrigger>
                <TabsTrigger value="wars">Guild Wars</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* ABOUT TAB */}
              <TabsContent value="about" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">About</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{guild.description}</p>
                    </div>

                    {/* Requirements */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Requirements</h3>
                      <div className="space-y-2">
                        {guild.requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 size={14} className="text-skill-green" />
                            <span className="text-muted-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Member Perks</h3>
                      <div className="space-y-2">
                        {guild.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Star size={14} className="text-badge-gold" />
                            <span className="text-muted-foreground">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Achievements</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {guild.badges.map((badge, i) => (
                          <div key={i} className="rounded-xl border border-border bg-surface-1 p-4 text-center">
                            <span className="text-3xl mb-2 block">{badge.icon}</span>
                            <p className="text-xs font-medium text-foreground">{badge.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{badge.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Leadership */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Leadership</h3>
                      <div className="space-y-3">
                        {guild.leaders.map((leader) => {
                          const tier = eloTier(leader.elo);
                          return (
                            <Link key={leader.id} to={`/profile/${leader.id}`} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3 hover:bg-surface-2 transition-colors">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>
                                {leader.avatar}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                                  {leader.name}
                                  {leader.role === "Guild Master" && <Crown size={12} className="text-badge-gold" />}
                                </p>
                                <Badge className={`text-[9px] ${roleColor(leader.role)}`}>{leader.role}</Badge>
                              </div>
                              <ChevronRight size={14} className="text-muted-foreground" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {guild.recentActivity.map((activity, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surface-2 mt-0.5">
                              {activity.type === "gig" && <Briefcase size={10} className="text-skill-green" />}
                              {activity.type === "member" && <UserPlus size={10} className="text-court-blue" />}
                              {activity.type === "war" && <Swords size={10} className="text-badge-gold" />}
                              {activity.type === "badge" && <Award size={10} className="text-badge-gold" />}
                            </div>
                            <div>
                              <p className="text-xs text-foreground">{activity.text}</p>
                              <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">Links</h3>
                      <div className="space-y-2">
                        {guild.socialLinks.discord && (
                          <a href={guild.socialLinks.discord} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <MessageSquare size={14} /> Discord <ExternalLink size={10} />
                          </a>
                        )}
                        {guild.socialLinks.twitter && (
                          <a href={guild.socialLinks.twitter} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Globe size={14} /> Twitter <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* MEMBERS TAB */}
              <TabsContent value="members">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...guild.leaders, ...guild.members].map((member) => {
                    const tier = eloTier(member.elo);
                    return (
                      <Link key={member.id} to={`/profile/${member.id}`} className="group">
                        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/15">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                              {member.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground group-hover:text-skill-green transition-colors flex items-center gap-1">
                                {member.name}
                                {member.role === "Guild Master" && <Crown size={12} className="text-badge-gold" />}
                              </p>
                              <Badge className={`text-[9px] ${roleColor(member.role)}`}>{member.role}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className={tier.color}>{tier.label} · {member.elo}</span>
                            {'joinedAt' in member && typeof member.joinedAt === 'string' && <span>Joined {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short" })}</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </TabsContent>

              {/* GUILD WARS TAB */}
              <TabsContent value="wars">
                <div className="space-y-4">
                  {guild.wars.map((war, i) => (
                    <div key={i} className={`rounded-xl border p-5 ${war.result === 'win' ? 'border-skill-green/20 bg-skill-green/5' : 'border-alert-red/20 bg-alert-red/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Swords size={20} className={war.result === 'win' ? 'text-skill-green' : 'text-alert-red'} />
                          <div>
                            <p className="text-sm font-medium text-foreground">vs {war.opponent}</p>
                            <p className="text-xs text-muted-foreground">{war.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={war.result === 'win' ? 'bg-skill-green/10 text-skill-green border-none' : 'bg-alert-red/10 text-alert-red border-none'}>
                            {war.result.toUpperCase()}
                          </Badge>
                          <p className="text-sm font-mono font-bold text-foreground mt-1">{war.score}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* PROJECTS TAB */}
              <TabsContent value="projects">
                <div className="grid sm:grid-cols-2 gap-4">
                  {guild.projects.map((project) => (
                    <div key={project.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-bold text-foreground">{project.title}</h4>
                        <Badge variant="secondary">{project.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users size={10} /> {project.members} members</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> Due {project.deadline}</span>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl border border-dashed border-border bg-surface-1/50 p-8 flex items-center justify-center">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Plus size={16} /> Create Project
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GuildPage;
