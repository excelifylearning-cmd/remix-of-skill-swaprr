import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, GraduationCap, Clock, MessageSquare, Share2, Edit2,
  CheckCircle2, Globe, Github, Linkedin, Twitter, Camera, X, Save,
  Scale, Award, Zap, Users, Flame, Trophy, Shield, Target,
  Star, ExternalLink, ArrowUpRight, ChevronRight, Briefcase,
  FileText, Activity
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  user_id: string; full_name: string; display_name: string | null;
  bio: string | null; slogan: string | null; avatar_url: string | null;
  location: string | null; university: string | null; timezone: string | null;
  languages: string[] | null; skills: string[] | null;
  skill_levels: Record<string, any> | null; elo: number; sp: number;
  tier: string; total_gigs_completed: number | null; streak_days: number | null;
  availability: string | null; response_time: string | null;
  work_history: any[] | null; education_history: any[] | null;
  certificates: any[] | null; portfolio_items: any[] | null;
  github_url: string | null; linkedin_url: string | null;
  twitter_url: string | null; personal_website: string | null;
  id_verified: boolean | null;
};

const getBadgeIcon = (category: string) => {
  const map: Record<string, any> = {
    general: Award, skill: Zap, social: Users, streak: Flame,
    competition: Trophy, quality: Shield, milestone: Target,
  };
  return map[category?.toLowerCase()] || Award;
};

const getAchievementIcon = (category: string) => {
  const map: Record<string, any> = {
    general: Trophy, skill: Zap, social: Users, streak: Flame,
    competition: Trophy, quality: Shield, milestone: Target,
  };
  return map[category?.toLowerCase()] || Trophy;
};

const SKILL_LEVEL_MAP: Record<string, { label: string; width: string }> = {
  beginner: { label: "Beginner", width: "25%" },
  intermediate: { label: "Intermediate", width: "50%" },
  advanced: { label: "Advanced", width: "75%" },
  master: { label: "Master", width: "100%" },
};

const NAV_ITEMS = ["About", "Skills", "Badges", "Achievements", "Experience", "Education", "Portfolio", "Listings", "Disputes", "Activity"];

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, profile: authProfile, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<{ name: string; icon: string; category: string; awarded_at: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; icon: string; category: string; description: string; progress: number; completed: boolean; threshold: number }[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [guilds, setGuilds] = useState<{ id: string; name: string; role: string }[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("About");

  const targetUserId = userId === "me" || !userId ? user?.id : userId;

  useEffect(() => { setIsOwner(targetUserId === user?.id); }, [targetUserId, user]);

  useEffect(() => {
    if (!targetUserId) { setLoading(false); return; }
    loadProfile(targetUserId);
  }, [targetUserId]);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [profileData]);

  const loadProfile = async (uid: string) => {
    setLoading(true);
    const [profileRes, badgesRes, achievementsRes, listingsRes, disputesRes, guildsRes, activityRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).single(),
      supabase.from("user_badges").select("badge_id, awarded_at, badges(name, icon, category)").eq("user_id", uid),
      supabase.from("user_achievements").select("progress, completed, achievements(name, icon, category, description, threshold)").eq("user_id", uid),
      supabase.from("listings").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("disputes").select("*").or(`filed_by.eq.${uid},filed_against.eq.${uid}`).order("created_at", { ascending: false }),
      supabase.from("guild_members").select("role, guilds(id, name)").eq("user_id", uid),
      supabase.from("activity_log").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(10),
    ]);

    if (profileRes.data) setProfileData(profileRes.data as any);
    if (badgesRes.data) setBadges(badgesRes.data.map((b: any) => ({
      name: b.badges?.name || "", icon: b.badges?.icon || "⭐",
      category: b.badges?.category || "general", awarded_at: b.awarded_at,
    })));
    if (achievementsRes.data) setAchievements(achievementsRes.data.map((a: any) => ({
      name: a.achievements?.name || "", icon: a.achievements?.icon || "🏆",
      category: a.achievements?.category || "general",
      description: a.achievements?.description || "", progress: a.progress,
      completed: a.completed, threshold: a.achievements?.threshold || 0,
    })));
    if (listingsRes.data) setListings(listingsRes.data);
    if (disputesRes.data) setDisputes(disputesRes.data);
    if (guildsRes.data) setGuilds(guildsRes.data.map((g: any) => ({
      id: (g.guilds as any)?.id || "", name: (g.guilds as any)?.name || "", role: g.role,
    })));
    if (activityRes.data) setActivityLog(activityRes.data);
    setLoading(false);
  };

  const startEditing = () => {
    if (!profileData) return;
    setEditForm({
      full_name: profileData.full_name, display_name: profileData.display_name,
      bio: profileData.bio, slogan: profileData.slogan, location: profileData.location,
      university: profileData.university, availability: profileData.availability,
      response_time: profileData.response_time, github_url: profileData.github_url,
      linkedin_url: profileData.linkedin_url, twitter_url: profileData.twitter_url,
      personal_website: profileData.personal_website,
    });
    setIsEditing(true);
  };

  const saveEditing = async () => {
    const result = await updateProfile(editForm as any);
    if (result.success && targetUserId) {
      await loadProfile(targetUserId);
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav />
          <div className="flex items-center justify-center pt-40">
            <div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!profileData) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav />
          <div className="flex flex-col items-center justify-center pt-40 gap-4">
            <p className="text-sm text-muted-foreground font-body">Profile not found.</p>
            <Link to="/" className="text-xs text-foreground hover:underline font-body">Go Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const p = profileData;
  const workHistory = Array.isArray(p.work_history) ? p.work_history : [];
  const educationHistory = Array.isArray(p.education_history) ? p.education_history : [];
  const certificates = Array.isArray(p.certificates) ? p.certificates : [];
  const portfolioItems = Array.isArray(p.portfolio_items) ? p.portfolio_items : [];
  const skills = p.skills || [];
  const skillLevels = (p.skill_levels || {}) as Record<string, string>;

  const scrollToSection = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(id);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav />

        {/* ═══ HEADER ═══ */}
        <section className="pt-24 pb-0 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="relative group">
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url} alt={p.full_name}
                      className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border border-border"
                    />
                  ) : (
                    <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border border-border bg-card flex items-center justify-center">
                      <span className="font-heading text-5xl font-black text-muted-foreground/40">{p.full_name?.charAt(0) || "?"}</span>
                    </div>
                  )}
                  {p.id_verified && (
                    <div className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center border-2 border-background">
                      <CheckCircle2 size={13} />
                    </div>
                  )}
                </div>
                {isOwner && !isEditing && (
                  <button className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors font-body">
                    <Camera size={10} /> Change photo
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    {isEditing ? (
                      <div className="space-y-3 max-w-lg">
                        <input value={editForm.full_name || ""} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full bg-transparent border-b border-border font-heading text-3xl font-black text-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Full Name" />
                        <input value={editForm.display_name || ""} onChange={e => setEditForm({ ...editForm, display_name: e.target.value })} className="w-full bg-transparent border-b border-border text-sm text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="Headline" />
                        <input value={editForm.slogan || ""} onChange={e => setEditForm({ ...editForm, slogan: e.target.value })} className="w-full bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="Slogan" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={editForm.location || ""} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="Location" />
                          <input value={editForm.university || ""} onChange={e => setEditForm({ ...editForm, university: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="University" />
                        </div>
                        <textarea value={editForm.bio || ""} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="w-full bg-transparent border border-border rounded-lg text-xs text-muted-foreground focus:outline-none focus:border-foreground p-2 resize-none font-body" placeholder="Bio" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={editForm.github_url || ""} onChange={e => setEditForm({ ...editForm, github_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="GitHub URL" />
                          <input value={editForm.linkedin_url || ""} onChange={e => setEditForm({ ...editForm, linkedin_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="LinkedIn URL" />
                          <input value={editForm.twitter_url || ""} onChange={e => setEditForm({ ...editForm, twitter_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="Twitter URL" />
                          <input value={editForm.personal_website || ""} onChange={e => setEditForm({ ...editForm, personal_website: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1 font-body" placeholder="Website URL" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none">
                          {p.full_name || "Unnamed"}
                        </h1>
                        {p.slogan && <p className="text-base text-muted-foreground mt-2 font-body">{p.slogan}</p>}
                        {p.display_name && <p className="text-sm text-muted-foreground/60 font-body mt-0.5">{p.display_name}</p>}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground font-body">
                          {p.location && <span className="flex items-center gap-1.5"><MapPin size={11} /> {p.location}</span>}
                          {p.university && <span className="flex items-center gap-1.5"><GraduationCap size={11} /> {p.university}</span>}
                          {p.response_time && <span className="flex items-center gap-1.5"><Clock size={11} /> {p.response_time}</span>}
                          {p.availability === "Available" && (
                            <span className="flex items-center gap-1.5 text-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" /> Open to work
                            </span>
                          )}
                        </div>

                        {/* Social links inline */}
                        <div className="flex gap-1.5 mt-4">
                          {[
                            { icon: Globe, href: p.personal_website },
                            { icon: Github, href: p.github_url },
                            { icon: Linkedin, href: p.linkedin_url },
                            { icon: Twitter, href: p.twitter_url },
                          ].filter(s => s.href).map((s, i) => (
                            <a key={i} href={s.href!} target="_blank" rel="noreferrer"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                              <s.icon size={13} />
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isOwner ? (
                      isEditing ? (
                        <div className="flex gap-2">
                          <button onClick={saveEditing} className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background font-body">
                            <Save size={12} /> Save
                          </button>
                          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={startEditing} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-foreground hover:bg-card transition-colors font-body">
                          <Edit2 size={12} /> Edit Profile
                        </button>
                      )
                    ) : (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background font-body">
                        <MessageSquare size={12} /> Request Swap
                      </motion.button>
                    )}
                    <button className="rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* ─── Stats strip ─── */}
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-0">
                  {[
                    { label: "ELO", value: p.elo },
                    { label: "SP", value: p.sp.toLocaleString() },
                    { label: "Gigs", value: p.total_gigs_completed || 0 },
                    { label: "Badges", value: badges.length },
                    { label: "Streak", value: `${p.streak_days || 0}d` },
                    { label: "Tier", value: p.tier },
                  ].map((s, i) => (
                    <div key={s.label} className={`flex-1 min-w-[80px] ${i > 0 ? "border-l border-border pl-4 ml-4" : ""}`}>
                      <p className="font-mono text-xl md:text-2xl font-bold text-foreground leading-none">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-body">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STICKY NAV ═══ */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border mt-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-none -mb-px py-0">
              {NAV_ITEMS.map(item => (
                <button key={item} onClick={() => scrollToSection(item)}
                  className={`px-3.5 py-3 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all font-body ${
                    activeNav === item
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        <section className="px-6 pt-10 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_240px] gap-12">

              {/* ─── Main column ─── */}
              <div className="space-y-16 min-w-0">

                {/* ABOUT */}
                <section id="about">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl font-body">{p.bio || "No bio yet."}</p>
                  {p.languages && p.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.languages.map(l => (
                        <span key={l} className="rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground font-body">{l}</span>
                      ))}
                    </div>
                  )}
                </section>

                {/* SKILLS */}
                <section id="skills">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Skills</h2>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => {
                        const level = skillLevels[skill]?.toLowerCase() || "";
                        const levelInfo = SKILL_LEVEL_MAP[level];
                        return (
                          <div key={skill} className="group relative">
                            <div className="rounded-full border border-border px-4 py-2 text-xs text-foreground font-body hover:border-foreground/30 transition-colors">
                              {skill}
                            </div>
                            {levelInfo && (
                              <div className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-border overflow-hidden">
                                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: levelInfo.width }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No skills added yet.</p>
                  )}
                </section>

                {/* BADGES — Minimalist tokens */}
                <section id="badges">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Badges</h2>
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {badges.map((b, i) => {
                        const Icon = getBadgeIcon(b.category);
                        return (
                          <div key={i} className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:border-foreground/30 transition-all cursor-default" title={b.name}>
                            <Icon size={16} className="text-foreground" />
                            {/* Tooltip */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="bg-foreground text-background text-[9px] font-mono px-2 py-1 rounded whitespace-nowrap">
                                {b.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No badges earned yet.</p>
                  )}
                </section>

                {/* ACHIEVEMENTS — Ruled list */}
                <section id="achievements">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Achievements</h2>
                  {achievements.length > 0 ? (
                    <div className="divide-y divide-border">
                      {achievements.map((a, i) => {
                        const Icon = getAchievementIcon(a.category);
                        return (
                          <div key={i} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${a.completed ? "border border-foreground/20" : "border border-border"}`}>
                                <Icon size={14} className={a.completed ? "text-foreground" : "text-muted-foreground/40"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground font-body">{a.name}</p>
                                  {a.completed && <CheckCircle2 size={12} className="text-foreground shrink-0" />}
                                </div>
                                <p className="text-[11px] text-muted-foreground font-body mt-0.5">{a.description}</p>
                                {!a.completed && a.threshold > 0 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-[2px] rounded-full bg-border overflow-hidden">
                                      <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${Math.min((a.progress / a.threshold) * 100, 100)}%` }} />
                                    </div>
                                    <span className="font-mono text-[10px] text-muted-foreground">{a.progress}/{a.threshold}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No achievements yet.</p>
                  )}
                </section>

                {/* EXPERIENCE */}
                <section id="experience">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Experience</h2>
                  {workHistory.length > 0 ? (
                    <div className="space-y-0">
                      {workHistory.map((job: any, i: number) => (
                        <div key={i} className="relative pl-6 pb-8 last:pb-0 border-l border-border">
                          <div className="absolute left-0 top-1.5 -translate-x-1/2 h-2 w-2 rounded-full bg-foreground" />
                          <h3 className="text-sm font-semibold text-foreground font-body leading-tight">{job.role || job.title}</h3>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">{job.company} · {job.period}</p>
                          {job.description && <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed max-w-xl">{job.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No work history added yet.</p>
                  )}
                </section>

                {/* EDUCATION */}
                <section id="education">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Education</h2>
                  {educationHistory.length > 0 ? (
                    <div className="space-y-0">
                      {educationHistory.map((edu: any, i: number) => (
                        <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-border/60">
                          <div className="absolute left-0 top-1.5 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          <h3 className="text-sm font-semibold text-foreground font-body">{edu.school}</h3>
                          <p className="text-xs text-muted-foreground font-body">{edu.degree} · {edu.period}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No education history added yet.</p>
                  )}

                  {/* Certifications inline */}
                  {certificates.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4 font-body">Certifications</h3>
                      <div className="divide-y divide-border">
                        {certificates.map((cert: any, i: number) => (
                          <div key={i} className="flex items-center justify-between py-3 first:pt-0">
                            <div>
                              <p className="text-sm font-medium text-foreground font-body">{cert.name}</p>
                              <p className="text-[10px] text-muted-foreground font-body">{cert.issuer} · {cert.date}</p>
                            </div>
                            {cert.verified && <CheckCircle2 size={13} className="text-foreground shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* PORTFOLIO — Asymmetric grid */}
                <section id="portfolio">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Portfolio</h2>
                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {portfolioItems.map((item: any, i: number) => (
                        <div key={i} className={`group relative overflow-hidden rounded-xl border border-border ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}>
                          {item.image ? (
                            <img src={item.image} alt={item.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full bg-card flex items-center justify-center">
                              <FileText size={24} className="text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-sm font-semibold text-background font-body">{item.title}</p>
                            {item.description && <p className="text-[10px] text-background/70 font-body line-clamp-1 mt-0.5">{item.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No portfolio items yet.</p>
                  )}
                </section>

                {/* LISTINGS — Compact ruled */}
                <section id="listings">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Offered Listings</h2>
                  {listings.length > 0 ? (
                    <div className="divide-y divide-border">
                      {listings.map((listing: any) => (
                        <div key={listing.id} className="flex items-center gap-4 py-3.5 first:pt-0">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${listing.status === "Active" ? "bg-foreground" : "bg-border"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground font-body truncate">{listing.title}</p>
                            <p className="text-[10px] text-muted-foreground font-body">{listing.category} · {listing.views || 0} views</p>
                          </div>
                          <span className="font-mono text-xs text-foreground shrink-0">{listing.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No active listings.</p>
                  )}
                </section>

                {/* DISPUTES — Compact ruled */}
                <section id="disputes">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Disputes</h2>
                  {disputes.length > 0 ? (
                    <div className="divide-y divide-border">
                      {disputes.map((d: any) => (
                        <div key={d.id} className="flex items-center gap-3 py-3.5 first:pt-0">
                          <Scale size={13} className="text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground font-body">{d.title}</p>
                            <p className="text-[10px] text-muted-foreground font-body">{new Date(d.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-xs text-muted-foreground">{d.sp_amount} SP</span>
                            <span className="text-[10px] text-muted-foreground font-body">{d.status}{d.outcome ? ` · ${d.outcome}` : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No disputes on record.</p>
                  )}
                </section>

                {/* ACTIVITY — Live timeline */}
                <section id="activity">
                  <h2 className="font-heading text-xs font-bold text-foreground uppercase tracking-widest mb-6">Recent Activity</h2>
                  {activityLog.length > 0 ? (
                    <div className="space-y-0">
                      {activityLog.map((entry: any, i: number) => (
                        <div key={entry.id} className="relative pl-6 pb-5 last:pb-0 border-l border-border/50">
                          <div className="absolute left-0 top-1 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                          <p className="text-xs text-foreground font-body">{entry.action.replace(/_/g, " ").replace(/:/g, " · ")}</p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {new Date(entry.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body">No recent activity.</p>
                  )}
                </section>
              </div>

              {/* ─── Sidebar ─── */}
              <div className="hidden lg:block">
                <div className="sticky top-32 space-y-8">
                  {/* Guilds */}
                  {guilds.length > 0 && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-body">Guilds</p>
                      <div className="space-y-0 divide-y divide-border">
                        {guilds.map(g => (
                          <Link key={g.id} to={`/guild/${g.id}`} className="flex items-center justify-between py-2.5 first:pt-0 text-xs text-muted-foreground hover:text-foreground transition-colors font-body group">
                            <span className="truncate">{g.name}</span>
                            <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100">{g.role}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Badge summary */}
                  {badges.length > 0 && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-body">Badge Collection</p>
                      <div className="flex flex-wrap gap-1.5">
                        {badges.slice(0, 12).map((b, i) => {
                          const Icon = getBadgeIcon(b.category);
                          return (
                            <div key={i} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border" title={b.name}>
                              <Icon size={12} className="text-foreground" />
                            </div>
                          );
                        })}
                        {badges.length > 12 && (
                          <div className="flex h-7 items-center px-2 rounded-lg border border-border">
                            <span className="text-[9px] font-mono text-muted-foreground">+{badges.length - 12}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick info */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-body">Details</p>
                    <div className="space-y-2 text-xs font-body">
                      {p.timezone && <div className="flex justify-between"><span className="text-muted-foreground">Timezone</span><span className="text-foreground font-mono text-[10px]">{p.timezone}</span></div>}
                      <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span className="text-foreground font-mono text-[10px]">2024</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Listings</span><span className="text-foreground font-mono text-[10px]">{listings.length}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Disputes</span><span className="text-foreground font-mono text-[10px]">{disputes.length}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
