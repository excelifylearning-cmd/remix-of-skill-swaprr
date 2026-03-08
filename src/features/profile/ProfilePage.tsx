import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Star, Trophy, Users, Zap, TrendingUp, ExternalLink,
  CheckCircle2, Shield, GraduationCap, Globe, Github, Linkedin, Twitter,
  Instagram, Youtube, Mail, MessageSquare, Heart, Share2, Edit3, Camera,
  Briefcase, Award, Clock, Eye, ArrowRight, ChevronRight, Play, Coins,
  Crown, Target
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10", border: "border-court-blue/20", glow: "shadow-[0_0_30px_-5px_hsl(var(--court-blue)/0.4)]" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10", border: "border-badge-gold/20", glow: "shadow-[0_0_30px_-5px_hsl(var(--badge-gold)/0.4)]" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2", border: "border-border", glow: "" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", glow: "" };
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK USER DATA
═══════════════════════════════════════════════════════════════════════════ */

const mockUser = {
  id: "123",
  display_name: "Maya K.",
  full_name: "Maya Krishnan",
  avatar_emoji: "🎨",
  avatar_url: null,
  bio: "Designer & Creative Director with 5+ years of experience in brand identity, UI/UX, and motion graphics. MIT Class of '24. I believe great design tells a story.",
  slogan: "Turning ideas into visual experiences",
  elo: 1680,
  sp: 12500,
  tier: "Gold",
  university: "MIT",
  location: "San Francisco, CA",
  timezone: "PST (UTC-8)",
  languages: ["English", "Hindi", "Spanish"],
  skills: ["Logo Design", "Brand Identity", "UI/UX", "Motion Graphics", "Illustration"],
  skill_levels: { "Logo Design": 95, "Brand Identity": 90, "UI/UX": 85, "Motion Graphics": 75, "Illustration": 70 },
  interests: ["Typography", "3D Design", "Animation"],
  needs: ["React Development", "Backend APIs", "Mobile Apps"],
  total_gigs_completed: 47,
  streak_days: 12,
  created_at: "2024-09-15",
  id_verified: true,
  response_time: "Usually within 2 hours",
  availability: "Part-time",
  hourly_rate: "30-50 SP/hr",
  linkedin_url: "https://linkedin.com/in/mayak",
  github_url: "https://github.com/mayak",
  twitter_url: "https://twitter.com/mayak",
  instagram_url: "https://instagram.com/mayak",
  portfolio_url: "https://mayak.design",
  portfolio_items: [
    { id: 1, title: "TechStart Brand Identity", image: "/placeholder.svg", category: "Branding" },
    { id: 2, title: "FinFlow Dashboard UI", image: "/placeholder.svg", category: "UI/UX" },
    { id: 3, title: "Eco Motion Graphics", image: "/placeholder.svg", category: "Motion" },
    { id: 4, title: "Artisan Logo Collection", image: "/placeholder.svg", category: "Logo Design" },
  ],
  reviews: [
    { id: 1, reviewer: "James T.", rating: 5, text: "Maya delivered exceptional work! Her attention to detail is impressive.", date: "2026-03-01", gig: "Logo Design" },
    { id: 2, reviewer: "Carlos M.", rating: 5, text: "Professional, creative, and great communication throughout.", date: "2026-02-20", gig: "Brand Identity" },
    { id: 3, reviewer: "Emma L.", rating: 4, text: "Great designs, minor revision needed but quick turnaround.", date: "2026-02-10", gig: "UI/UX" },
  ],
  badges: [
    { id: 1, name: "Top Rated", icon: "⭐", description: "Maintained 4.9+ rating for 6 months" },
    { id: 2, name: "Fast Responder", icon: "⚡", description: "Responds within 2 hours" },
    { id: 3, name: "Verified Pro", icon: "✓", description: "Identity verified" },
    { id: 4, name: "Guild Champion", icon: "🏆", description: "Won Guild Wars S3" },
  ],
  guilds: [
    { id: 1, name: "Design Masters", role: "Officer", icon: "🎨" },
    { id: 2, name: "Creative Collective", role: "Member", icon: "✨" },
  ]
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════════════════════ */

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: authUser, profile: authProfile } = useAuth();
  
  // In real app, fetch user by userId
  const profileUser = mockUser;
  const isOwnProfile = authUser?.id === userId;
  const tier = eloTier(profileUser.elo);
  const avgRating = profileUser.reviews.reduce((acc, r) => acc + r.rating, 0) / profileUser.reviews.length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-20 pb-0">
          <div className="h-48 bg-gradient-to-br from-surface-1 via-card to-surface-2 relative">
            {isOwnProfile && (
              <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Camera size={12} /> Edit Cover
              </button>
            )}
          </div>
        </section>

        {/* Profile Header */}
        <section className="px-6 pb-8 -mt-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className={`flex h-32 w-32 items-center justify-center rounded-3xl ${tier.bg} border-4 border-background font-mono text-5xl ${tier.glow}`}>
                  {profileUser.avatar_emoji || profileUser.display_name?.[0]}
                </div>
                {profileUser.id_verified && (
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-skill-green text-white border-2 border-background">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 sm:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">{profileUser.display_name}</h1>
                      <Badge className={`${tier.bg} ${tier.color} border-none`}>{tier.label}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{profileUser.slogan}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {profileUser.location && (
                        <span className="flex items-center gap-1"><MapPin size={14} /> {profileUser.location}</span>
                      )}
                      {profileUser.university && (
                        <span className="flex items-center gap-1"><GraduationCap size={14} /> {profileUser.university}</span>
                      )}
                      <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profileUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <Link to="/dashboard?tab=settings" className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <Edit3 size={14} /> Edit Profile
                      </Link>
                    ) : (
                      <>
                        <button className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
                          <MessageSquare size={14} /> Message
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-alert-red hover:border-alert-red/30 transition-colors">
                          <Heart size={16} />
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
                          <Share2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Skill Points", value: profileUser.sp.toLocaleString(), icon: Coins, color: "text-badge-gold" },
                { label: "ELO Rating", value: profileUser.elo, icon: TrendingUp, color: "text-skill-green" },
                { label: "Gigs Completed", value: profileUser.total_gigs_completed, icon: Trophy, color: "text-court-blue" },
                { label: "Avg Rating", value: `${avgRating.toFixed(1)} ★`, icon: Star, color: "text-badge-gold" },
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
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({profileUser.reviews.length})</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* ABOUT TAB */}
              <TabsContent value="about" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Bio */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">About</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{profileUser.bio}</p>
                    </div>

                    {/* Skills */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Skills</h3>
                      <div className="space-y-4">
                        {profileUser.skills.map((skill) => (
                          <div key={skill}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-foreground">{skill}</span>
                              <span className="text-xs text-muted-foreground">{profileUser.skill_levels?.[skill] || 80}%</span>
                            </div>
                            <Progress value={profileUser.skill_levels?.[skill] || 80} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Looking For */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileUser.needs.map((need) => (
                          <Badge key={need} variant="outline" className="text-court-blue border-court-blue/30">
                            <Target size={10} className="mr-1" /> {need}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Badges</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {profileUser.badges.map((badge) => (
                          <div key={badge.id} className="rounded-xl border border-border bg-surface-1 p-3 text-center">
                            <span className="text-2xl mb-1 block">{badge.icon}</span>
                            <p className="text-xs font-medium text-foreground">{badge.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Response Time</span>
                          <span className="text-foreground">{profileUser.response_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Availability</span>
                          <span className="text-foreground">{profileUser.availability}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rate</span>
                          <span className="text-skill-green font-medium">{profileUser.hourly_rate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Timezone</span>
                          <span className="text-foreground">{profileUser.timezone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Streak</span>
                          <span className="text-badge-gold font-medium">{profileUser.streak_days} days 🔥</span>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileUser.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Guilds */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">Guilds</h3>
                      <div className="space-y-2">
                        {profileUser.guilds.map((guild) => (
                          <Link key={guild.id} to={`/guild/${guild.id}`} className="flex items-center gap-3 rounded-lg bg-surface-1 p-3 hover:bg-surface-2 transition-colors">
                            <span className="text-xl">{guild.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{guild.name}</p>
                              <p className="text-xs text-muted-foreground">{guild.role}</p>
                            </div>
                            <ChevronRight size={14} className="text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3">Links</h3>
                      <div className="space-y-2">
                        {profileUser.portfolio_url && (
                          <a href={profileUser.portfolio_url} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Globe size={14} /> Portfolio <ExternalLink size={10} />
                          </a>
                        )}
                        {profileUser.linkedin_url && (
                          <a href={profileUser.linkedin_url} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin size={14} /> LinkedIn <ExternalLink size={10} />
                          </a>
                        )}
                        {profileUser.github_url && (
                          <a href={profileUser.github_url} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Github size={14} /> GitHub <ExternalLink size={10} />
                          </a>
                        )}
                        {profileUser.twitter_url && (
                          <a href={profileUser.twitter_url} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter size={14} /> Twitter <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PORTFOLIO TAB */}
              <TabsContent value="portfolio">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileUser.portfolio_items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      className="group rounded-2xl border border-border bg-card overflow-hidden cursor-pointer"
                    >
                      <div className="aspect-video bg-surface-2 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">
                            <Eye size={14} /> View
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* REVIEWS TAB */}
              <TabsContent value="reviews">
                <div className="space-y-4">
                  {profileUser.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 font-mono text-sm font-bold text-foreground">
                            {review.reviewer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.reviewer}</p>
                            <p className="text-xs text-muted-foreground">{review.gig} · {review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-badge-gold text-badge-gold" : "text-muted-foreground/30"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ACTIVITY TAB */}
              <TabsContent value="activity">
                <div className="text-center py-12">
                  <Clock size={32} className="mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-foreground font-medium">Activity Timeline</p>
                  <p className="text-sm text-muted-foreground">Coming soon...</p>
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

export default ProfilePage;
