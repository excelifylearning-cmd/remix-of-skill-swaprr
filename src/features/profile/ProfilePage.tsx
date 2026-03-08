import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, GraduationCap, Star, Clock,
  MessageSquare, Share2, Edit2, CheckCircle2, Globe,
  Github, Linkedin, Twitter, Camera, X, Save,
  Scale
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  user_id: string;
  full_name: string;
  display_name: string | null;
  bio: string | null;
  slogan: string | null;
  avatar_url: string | null;
  location: string | null;
  university: string | null;
  timezone: string | null;
  languages: string[] | null;
  skills: string[] | null;
  skill_levels: Record<string, any> | null;
  elo: number;
  sp: number;
  tier: string;
  total_gigs_completed: number | null;
  streak_days: number | null;
  availability: string | null;
  response_time: string | null;
  work_history: any[] | null;
  education_history: any[] | null;
  certificates: any[] | null;
  portfolio_items: any[] | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  personal_website: string | null;
  id_verified: boolean | null;
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, profile: authProfile, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<{ name: string; icon: string; awarded_at: string }[]>([]);
  const [achievements, setAchievements] = useState<{ name: string; icon: string; description: string; progress: number; completed: boolean; threshold: number }[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [guilds, setGuilds] = useState<{ id: string; name: string; role: string }[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);

  const targetUserId = userId === "me" || !userId ? user?.id : userId;

  useEffect(() => {
    setIsOwner(targetUserId === user?.id);
  }, [targetUserId, user]);

  useEffect(() => {
    if (!targetUserId) { setLoading(false); return; }
    loadProfile(targetUserId);
  }, [targetUserId]);

  const loadProfile = async (uid: string) => {
    setLoading(true);
    const [profileRes, badgesRes, achievementsRes, listingsRes, disputesRes, guildsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).single(),
      supabase.from("user_badges").select("badge_id, awarded_at, badges(name, icon)").eq("user_id", uid),
      supabase.from("user_achievements").select("progress, completed, achievements(name, icon, description, threshold)").eq("user_id", uid),
      supabase.from("listings").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("disputes").select("*").or(`filed_by.eq.${uid},filed_against.eq.${uid}`).order("created_at", { ascending: false }),
      supabase.from("guild_members").select("role, guilds(id, name)").eq("user_id", uid),
    ]);

    if (profileRes.data) setProfileData(profileRes.data as any);
    if (badgesRes.data) setBadges(badgesRes.data.map((b: any) => ({ name: b.badges?.name || "", icon: b.badges?.icon || "⭐", awarded_at: b.awarded_at })));
    if (achievementsRes.data) setAchievements(achievementsRes.data.map((a: any) => ({ name: a.achievements?.name || "", icon: a.achievements?.icon || "🏆", description: a.achievements?.description || "", progress: a.progress, completed: a.completed, threshold: a.achievements?.threshold || 0 })));
    if (listingsRes.data) setListings(listingsRes.data);
    if (disputesRes.data) setDisputes(disputesRes.data);
    if (guildsRes.data) setGuilds(guildsRes.data.map((g: any) => ({ id: (g.guilds as any)?.id || "", name: (g.guilds as any)?.name || "", role: g.role })));
    setLoading(false);
  };

  const startEditing = () => {
    if (!profileData) return;
    setEditForm({
      full_name: profileData.full_name,
      display_name: profileData.display_name,
      bio: profileData.bio,
      slogan: profileData.slogan,
      location: profileData.location,
      university: profileData.university,
      availability: profileData.availability,
      response_time: profileData.response_time,
      github_url: profileData.github_url,
      linkedin_url: profileData.linkedin_url,
      twitter_url: profileData.twitter_url,
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
            <p className="text-sm text-muted-foreground">Loading profile...</p>
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
            <p className="text-sm text-muted-foreground">Profile not found.</p>
            <Link to="/" className="text-xs text-foreground hover:underline">Go Home</Link>
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* ─── HEADER ─── */}
        <section className="pt-24 pb-0 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[280px_1fr] gap-0">
              {/* Left: Avatar */}
              <div className="relative">
                <div className="lg:sticky lg:top-24">
                  <div className="relative inline-block">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt={p.full_name} className="w-44 h-44 lg:w-56 lg:h-56 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-44 h-44 lg:w-56 lg:h-56 rounded-2xl bg-surface-2 border border-border flex items-center justify-center font-heading text-5xl font-black text-muted-foreground">
                        {p.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                    {p.id_verified && (
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-skill-green text-background border-2 border-background">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                  {isOwner && (
                    <button className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Camera size={12} /> Change photo
                    </button>
                  )}
                  <div className="mt-6 flex gap-2">
                    {[
                      { icon: Globe, href: p.personal_website },
                      { icon: Github, href: p.github_url },
                      { icon: Linkedin, href: p.linkedin_url },
                      { icon: Twitter, href: p.twitter_url },
                    ].filter(s => s.href).map((s, i) => (
                      <a key={i} href={s.href!} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                        <s.icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Info */}
              <div className="pt-4 lg:pt-0 lg:pl-10 lg:border-l border-border">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <div className="space-y-3 max-w-lg">
                        <input value={editForm.full_name || ""} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full bg-transparent border-b border-border font-heading text-3xl font-black text-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Full Name" />
                        <input value={editForm.display_name || ""} onChange={e => setEditForm({ ...editForm, display_name: e.target.value })} className="w-full bg-transparent border-b border-border text-sm text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Display name / headline" />
                        <input value={editForm.slogan || ""} onChange={e => setEditForm({ ...editForm, slogan: e.target.value })} className="w-full bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Slogan" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={editForm.location || ""} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Location" />
                          <input value={editForm.university || ""} onChange={e => setEditForm({ ...editForm, university: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="University" />
                        </div>
                        <textarea value={editForm.bio || ""} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="w-full bg-transparent border border-border rounded-lg text-xs text-muted-foreground focus:outline-none focus:border-foreground p-2 resize-none" placeholder="Bio" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={editForm.github_url || ""} onChange={e => setEditForm({ ...editForm, github_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="GitHub URL" />
                          <input value={editForm.linkedin_url || ""} onChange={e => setEditForm({ ...editForm, linkedin_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="LinkedIn URL" />
                          <input value={editForm.twitter_url || ""} onChange={e => setEditForm({ ...editForm, twitter_url: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Twitter URL" />
                          <input value={editForm.personal_website || ""} onChange={e => setEditForm({ ...editForm, personal_website: e.target.value })} className="bg-transparent border-b border-border text-xs text-muted-foreground focus:outline-none focus:border-foreground pb-1" placeholder="Website URL" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">{p.full_name || "Unnamed"}</h1>
                        {p.slogan && <p className="text-lg text-muted-foreground mb-1">{p.slogan}</p>}
                        {p.display_name && <p className="text-sm text-muted-foreground/70">{p.display_name}</p>}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-muted-foreground">
                          {p.location && <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>}
                          {p.university && <span className="flex items-center gap-1"><GraduationCap size={12} /> {p.university}</span>}
                          {p.response_time && <span className="flex items-center gap-1"><Clock size={12} /> {p.response_time}</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground">{p.tier} · {p.elo} ELO</span>
                          {p.availability === "Available" && (
                            <span className="rounded-full border border-skill-green/30 bg-skill-green/5 px-3 py-1 text-[10px] font-medium text-skill-green">Open to Work</span>
                          )}
                          <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground">{p.total_gigs_completed || 0} gigs</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOwner ? (
                      isEditing ? (
                        <div className="flex gap-2">
                          <button onClick={saveEditing} className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background">
                            <Save size={12} /> Save
                          </button>
                          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={startEditing} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-foreground hover:bg-surface-1 transition-colors">
                          <Edit2 size={12} /> Edit Profile
                        </button>
                      )
                    ) : (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-semibold text-background">
                        <MessageSquare size={12} /> Request Swap
                      </motion.button>
                    )}
                    <button className="rounded-lg border border-border p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-3 sm:grid-cols-6 gap-y-4">
                  {[
                    { label: "ELO", value: p.elo },
                    { label: "SP", value: p.sp.toLocaleString() },
                    { label: "Gigs", value: p.total_gigs_completed || 0 },
                    { label: "Badges", value: badges.length },
                    { label: "Streak", value: `${p.streak_days || 0}d` },
                    { label: "Tier", value: p.tier },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="font-mono text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT ─── */}
        <section className="px-6 pt-12 pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-0">
            {/* Left sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-8 pr-10">
                <nav className="space-y-1">
                  {["About", "Skills", "Badges", "Achievements", "Experience", "Education", "Portfolio", "Listings", "Disputes", "Activity"].map(s => (
                    <a key={s} href={`#${s.toLowerCase()}`} className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
                  ))}
                </nav>

                {/* Badges compact */}
                {badges.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Badges</p>
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((b, i) => (
                        <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-1 border border-border text-sm" title={b.name}>{b.icon}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guilds */}
                {guilds.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Guilds</p>
                    {guilds.map(g => (
                      <Link key={g.id} to={`/guild/${g.id}`} className="flex items-center justify-between py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <span>{g.name}</span>
                        <span className="text-[10px]">{g.role}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:pl-10 lg:border-l border-border space-y-16">

              {/* ABOUT */}
              <section id="about">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{p.bio || "No bio yet."}</p>
                {p.languages && p.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.languages.map(l => (
                      <span key={l} className="rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground">{l}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* SKILLS */}
              <section id="skills">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Skills</h2>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No skills added yet.</p>
                )}
              </section>

              {/* BADGES */}
              <section id="badges">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Badges</h2>
                {badges.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {badges.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{b.name}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(b.awarded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No badges earned yet.</p>
                )}
              </section>

              {/* ACHIEVEMENTS */}
              <section id="achievements">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Achievements</h2>
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                        <span className="text-2xl shrink-0">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-semibold text-foreground">{a.name}</p>
                            {a.completed && <CheckCircle2 size={12} className="text-skill-green" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{a.description}</p>
                          {!a.completed && a.threshold > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                <div className="h-full rounded-full bg-foreground" style={{ width: `${Math.min((a.progress / a.threshold) * 100, 100)}%` }} />
                              </div>
                              <span className="font-mono text-[10px] text-muted-foreground">{a.progress}/{a.threshold}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No achievements yet.</p>
                )}
              </section>

              {/* EXPERIENCE */}
              <section id="experience">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Experience</h2>
                {workHistory.length > 0 ? (
                  <div className="space-y-8">
                    {workHistory.map((job: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l border-border">
                        <div className="absolute left-0 top-1 -translate-x-1/2 h-2 w-2 rounded-full bg-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">{job.role || job.title}</h3>
                        <p className="text-xs text-muted-foreground">{job.company} · {job.period}</p>
                        {job.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xl">{job.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No work history added yet.</p>
                )}
              </section>

              {/* EDUCATION */}
              <section id="education">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Education</h2>
                {educationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {educationHistory.map((edu: any, i: number) => (
                      <div key={i} className="pl-6 border-l border-border relative">
                        <div className="absolute left-0 top-1 -translate-x-1/2 h-2 w-2 rounded-full bg-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">{edu.school}</h3>
                        <p className="text-xs text-muted-foreground">{edu.degree} · {edu.period}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No education history added yet.</p>
                )}
              </section>

              {/* CERTIFICATIONS */}
              {certificates.length > 0 && (
                <section>
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Certifications</h2>
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {certificates.map((cert: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-card">
                        <div>
                          <p className="text-sm font-medium text-foreground">{cert.name}</p>
                          <p className="text-[10px] text-muted-foreground">{cert.issuer} · {cert.date}</p>
                        </div>
                        {cert.verified && <CheckCircle2 size={14} className="text-skill-green shrink-0" />}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PORTFOLIO */}
              <section id="portfolio">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Portfolio</h2>
                {portfolioItems.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolioItems.map((item: any, i: number) => (
                      <div key={i} className="group">
                        {item.image && (
                          <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-border">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                        )}
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        {item.description && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No portfolio items yet.</p>
                )}
              </section>

              {/* LISTINGS */}
              <section id="listings">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Offered Listings</h2>
                {listings.length > 0 ? (
                  <div className="space-y-3">
                    {listings.map((listing: any) => (
                      <div key={listing.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-foreground">{listing.title}</h3>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                              listing.status === "Active" ? "border-skill-green/20 text-skill-green" : "border-border text-muted-foreground"
                            }`}>{listing.status}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{listing.category} · {listing.views} views · {listing.inquiries} inquiries</p>
                        </div>
                        <span className="font-mono text-sm text-foreground shrink-0">{listing.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No active listings.</p>
                )}
              </section>

              {/* DISPUTES */}
              <section id="disputes">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Disputes</h2>
                {disputes.length > 0 ? (
                  <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                    {disputes.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between p-4 bg-card">
                        <div className="flex items-center gap-3">
                          <Scale size={14} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{d.title}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-muted-foreground">{d.sp_amount} SP</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            d.status === "Resolved" ? "border-foreground/20 text-foreground" : "border-border text-muted-foreground"
                          }`}>{d.status}{d.outcome ? ` — ${d.outcome}` : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No disputes on record.</p>
                )}
              </section>

              {/* ACTIVITY */}
              <section id="activity">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Recent Activity</h2>
                <p className="text-xs text-muted-foreground">Activity tracking coming soon.</p>
              </section>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
