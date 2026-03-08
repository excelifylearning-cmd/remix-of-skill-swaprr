import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  User, MapPin, Calendar, Briefcase, GraduationCap, Award, Star, Clock,
  MessageSquare, Share2, MoreHorizontal, Edit2, CheckCircle2, Globe, Link2,
  Github, Linkedin, Twitter, Youtube, Instagram, Mail, Zap, Trophy,
  TrendingUp, Target, Users, Heart, Eye, BookOpen, Code, Palette, Shield,
  ChevronRight, Play, FileText, Download, ExternalLink, ThumbsUp, Flame,
  BarChart3, Activity, PieChart, ArrowUpRight, ArrowDownRight, Layers,
  Sparkles, Crown, Medal, Gift, Building2, Wallet, History, Settings, Camera
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";

// Demo profile data
const demoProfile = {
  id: "demo-user",
  fullName: "Alex Rivera",
  displayName: "@alexrivera",
  headline: "Full-Stack Developer | Building the Future of Tech",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  bio: "Passionate about creating elegant solutions to complex problems. I specialize in React, Node.js, and cloud architecture. 5+ years of experience building scalable applications.",
  location: "San Francisco, CA",
  timezone: "PST (UTC-8)",
  university: "Stanford University",
  currentCompany: "TechCorp Inc.",
  currentRole: "Senior Software Engineer",
  languages: ["English", "Spanish", "Mandarin"],
  elo: 1847,
  tier: "Diamond",
  sp: 4250,
  totalSwaps: 127,
  completedGigs: 94,
  activeGigs: 3,
  responseTime: "~2 hours",
  memberSince: "January 2025",
  lastActive: "2 hours ago",
  verified: true,
  availableForHire: true,
  skills: [
    { name: "React", level: "Expert", endorsements: 89, verified: true },
    { name: "Node.js", level: "Expert", endorsements: 67, verified: true },
    { name: "TypeScript", level: "Advanced", endorsements: 54, verified: true },
    { name: "Python", level: "Advanced", endorsements: 45, verified: false },
    { name: "AWS", level: "Intermediate", endorsements: 32, verified: true },
    { name: "PostgreSQL", level: "Advanced", endorsements: 28, verified: false },
  ],
  workHistory: [
    { company: "TechCorp Inc.", role: "Senior Software Engineer", period: "2023 — Present", description: "Leading frontend architecture for enterprise SaaS platform serving 500K+ users.", skills: ["React", "TypeScript", "AWS"] },
    { company: "StartupXYZ", role: "Full-Stack Developer", period: "2021 — 2023", description: "Built core product features and scaled platform to 100K users.", skills: ["Node.js", "React", "MongoDB"] },
    { company: "Agency Labs", role: "Junior Developer", period: "2019 — 2021", description: "Developed client websites and web applications.", skills: ["JavaScript", "HTML/CSS"] },
  ],
  education: [
    { school: "Stanford University", degree: "M.S. Computer Science", period: "2017 — 2019" },
    { school: "UC Berkeley", degree: "B.S. Computer Science", period: "2013 — 2017" },
  ],
  certifications: [
    { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", date: "2024", verified: true },
    { name: "React Advanced Patterns", issuer: "Frontend Masters", date: "2023", verified: true },
    { name: "Node.js Certified Developer", issuer: "OpenJS Foundation", date: "2022", verified: true },
  ],
  portfolio: [
    { title: "E-Commerce Platform", description: "Full-stack e-commerce solution with real-time inventory and payment processing.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", tags: ["React", "Node.js", "Stripe"], views: 1240, likes: 89 },
    { title: "AI Analytics Dashboard", description: "Real-time analytics dashboard with ML predictions for enterprise clients.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", tags: ["Python", "TensorFlow", "D3.js"], views: 890, likes: 67 },
    { title: "Mobile App Backend", description: "Scalable API backend supporting 1M+ daily requests.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop", tags: ["Node.js", "Redis", "Docker"], views: 567, likes: 45 },
  ],
  recommendations: [
    { name: "Sarah Chen", role: "Product Manager @ Google", text: "Alex is an exceptional developer with a rare combination of technical excellence and communication skills.", date: "2 weeks ago" },
    { name: "Marcus Johnson", role: "CTO @ StartupXYZ", text: "Working with Alex was a pleasure. He took ownership of critical systems and improved them significantly.", date: "1 month ago" },
  ],
  socialLinks: { github: "#", linkedin: "#", twitter: "#", website: "#" },
  analytics: { profileViews: 2340, viewsTrend: 12, swapRequests: 89, avgRating: 4.9, ratingCount: 127, totalEarnings: 12500, monthlyEarnings: 1850, earningsTrend: 24, completionRate: 98, repeatClients: 34, weeklyViews: [180, 220, 195, 340, 280, 310, 290] },
  activeProjects: [
    { title: "Web App Development", client: "TechStartup", status: "In Progress", progress: 65, deadline: "Mar 15, 2026", spValue: 500, team: 3 },
    { title: "API Integration", client: "FinanceApp", status: "In Progress", progress: 40, deadline: "Mar 22, 2026", spValue: 300, team: 2 },
  ],
  projectHistory: [
    { title: "E-commerce Redesign", client: "RetailCo", rating: 5, sp: 450, date: "Feb 2026" },
    { title: "Mobile App Backend", client: "FitTrack", rating: 5, sp: 380, date: "Jan 2026" },
    { title: "Dashboard Analytics", client: "DataViz", rating: 5, sp: 320, date: "Jan 2026" },
  ],
  recentActivity: [
    { type: "swap", title: "Completed swap with Maya K.", time: "2 hours ago", sp: "+150" },
    { type: "endorsement", title: "Received endorsement for React", time: "5 hours ago" },
    { type: "badge", title: "Earned 'Top Contributor' badge", time: "1 day ago" },
    { type: "project", title: "Started project with Carlos M.", time: "2 days ago", sp: "300" },
  ],
  badges: [
    { name: "Diamond", icon: "💎" }, { name: "Century Club", icon: "🏆" },
    { name: "Top 5%", icon: "⭐" }, { name: "Verified", icon: "✅" },
    { name: "Guild Champ", icon: "👑" }, { name: "Early Adopter", icon: "🚀" },
  ],
  guilds: [
    { id: "1", name: "Tech Pioneers", role: "Officer", members: 156 },
    { id: "2", name: "Code Collective", role: "Member", members: 89 },
  ],
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileData] = useState(demoProfile);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(userId === user?.id || userId === "me" || userId === "demo-user" || !userId);
  }, [userId, user]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* ─── HEADER: Asymmetric editorial layout ─── */}
        <section className="pt-24 pb-0 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[280px_1fr] gap-0">
              {/* Left: Avatar column */}
              <div className="relative">
                <div className="lg:sticky lg:top-24">
                  <div className="relative inline-block">
                    <img src={profileData.avatar} alt={profileData.fullName} className="w-44 h-44 lg:w-56 lg:h-56 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    {profileData.verified && (
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-skill-green text-white border-2 border-background">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                  {isOwner && (
                    <button className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Camera size={12} /> Change photo
                    </button>
                  )}
                  {/* Social links */}
                  <div className="mt-6 flex gap-2">
                    {[
                      { icon: Globe, href: profileData.socialLinks.website },
                      { icon: Github, href: profileData.socialLinks.github },
                      { icon: Linkedin, href: profileData.socialLinks.linkedin },
                      { icon: Twitter, href: profileData.socialLinks.twitter },
                    ].map((s, i) => (
                      <a key={i} href={s.href} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                        <s.icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Info column */}
              <div className="pt-4 lg:pt-0 lg:pl-10 lg:border-l border-border">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">{profileData.fullName}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground mb-1">{profileData.headline}</p>
                    <p className="text-sm text-muted-foreground/70">{profileData.displayName} · {profileData.currentRole} at {profileData.currentCompany}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {profileData.location}</span>
                      <span className="flex items-center gap-1"><GraduationCap size={12} /> {profileData.university}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {profileData.responseTime}</span>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground">{profileData.tier} · {profileData.elo} ELO</span>
                      {profileData.availableForHire && (
                        <span className="rounded-full border border-skill-green/30 bg-skill-green/5 px-3 py-1 text-[10px] font-medium text-skill-green">Open to Work</span>
                      )}
                      <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground">{profileData.totalSwaps} swaps</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOwner ? (
                      <Link to="/settings" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-foreground hover:bg-surface-1 transition-colors">
                        <Edit2 size={12} /> Edit Profile
                      </Link>
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

                {/* ─── Stats: Horizontal mono row ─── */}
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-3 sm:grid-cols-6 gap-y-4">
                  {[
                    { label: "ELO", value: profileData.elo },
                    { label: "SP", value: profileData.sp.toLocaleString() },
                    { label: "Swaps", value: profileData.totalSwaps },
                    { label: "Rating", value: profileData.analytics.avgRating },
                    { label: "Completion", value: `${profileData.analytics.completionRate}%` },
                    { label: "Active", value: profileData.activeGigs },
                  ].map((s) => (
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

        {/* ─── MAIN CONTENT: Single scroll, no tabs ─── */}
        <section className="px-6 pt-12 pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-0">
            {/* Left sidebar: sticky nav + badges */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-8 pr-10">
                {/* Section nav */}
                <nav className="space-y-1">
                  {["About", "Skills", "Experience", "Education", "Portfolio", "Projects", "Activity"].map(s => (
                    <a key={s} href={`#${s.toLowerCase()}`} className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {s}
                    </a>
                  ))}
                  {isOwner && <a href="#analytics" className="block py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Analytics</a>}
                </nav>

                {/* Badges compact */}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Achievements</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.badges.map((b, i) => (
                      <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-1 border border-border text-sm" title={b.name}>{b.icon}</span>
                    ))}
                  </div>
                </div>

                {/* Guilds */}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Guilds</p>
                  {profileData.guilds.map(g => (
                    <Link key={g.id} to={`/guild/${g.id}`} className="flex items-center justify-between py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <span>{g.name}</span>
                      <span className="text-[10px]">{g.role}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Content stream */}
            <div className="lg:pl-10 lg:border-l border-border space-y-16">
              
              {/* ABOUT */}
              <section id="about">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{profileData.bio}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profileData.languages.map(l => (
                    <span key={l} className="rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground">{l}</span>
                  ))}
                </div>
              </section>

              {/* SKILLS */}
              <section id="skills">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Skills & Endorsements</h2>
                  {isOwner && <button className="text-[10px] text-muted-foreground hover:text-foreground">+ Add</button>}
                </div>
                <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                  {profileData.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between p-4 bg-card">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        {skill.verified && <CheckCircle2 size={12} className="text-skill-green" />}
                        <span className="text-[10px] text-muted-foreground">{skill.level}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">{skill.endorsements}</span>
                        {!isOwner && <button className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5">Endorse</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EXPERIENCE */}
              <section id="experience">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Experience</h2>
                <div className="space-y-8">
                  {profileData.workHistory.map((job, i) => (
                    <div key={i} className="relative pl-6 border-l border-border">
                      <div className="absolute left-0 top-1 -translate-x-1/2 h-2 w-2 rounded-full bg-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">{job.role}</h3>
                      <p className="text-xs text-muted-foreground">{job.company} · {job.period}</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xl">{job.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.map(s => (
                          <span key={s} className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EDUCATION */}
              <section id="education">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Education</h2>
                <div className="space-y-4">
                  {profileData.education.map((edu, i) => (
                    <div key={i} className="pl-6 border-l border-border relative">
                      <div className="absolute left-0 top-1 -translate-x-1/2 h-2 w-2 rounded-full bg-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">{edu.school}</h3>
                      <p className="text-xs text-muted-foreground">{edu.degree} · {edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CERTIFICATIONS */}
              <section>
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Certifications</h2>
                <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                  {profileData.certifications.map((cert, i) => (
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

              {/* PORTFOLIO */}
              <section id="portfolio">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Portfolio</h2>
                  {isOwner && <button className="text-[10px] text-muted-foreground hover:text-foreground">+ Add Project</button>}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {profileData.portfolio.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group">
                      <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-border">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span>{item.views} views</span>
                        <span>{item.likes} likes</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* RECOMMENDATIONS */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Recommendations</h2>
                  {!isOwner && <button className="text-[10px] text-muted-foreground hover:text-foreground">Write one</button>}
                </div>
                <div className="space-y-6">
                  {profileData.recommendations.map((rec, i) => (
                    <div key={i} className="border-l-2 border-border pl-5">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">"{rec.text}"</p>
                      <p className="text-xs text-foreground mt-3 font-medium">{rec.name}</p>
                      <p className="text-[10px] text-muted-foreground">{rec.role} · {rec.date}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ACTIVE PROJECTS */}
              <section id="projects">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Active Projects</h2>
                  {isOwner && <button className="text-[10px] text-muted-foreground hover:text-foreground">+ New</button>}
                </div>
                <div className="space-y-3">
                  {profileData.activeProjects.map((p, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground">{p.client} · {p.team} members · Due {p.deadline}</p>
                      </div>
                      <div className="shrink-0 w-24">
                        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div className="h-full rounded-full bg-foreground" style={{ width: `${p.progress}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">{p.progress}%</p>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground shrink-0">{p.spValue} SP</span>
                    </div>
                  ))}
                </div>

                {/* Completed */}
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mt-10 mb-4">Completed</h3>
                <div className="grid gap-px bg-border rounded-xl overflow-hidden">
                  {profileData.projectHistory.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-card text-xs">
                      <span className="text-foreground">{p.title}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground"><Star size={10} fill="currentColor" className="text-skill-green" /> {p.rating}</span>
                        <span className="font-mono text-muted-foreground">{p.sp} SP</span>
                        <span className="text-muted-foreground">{p.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ACTIVITY */}
              <section id="activity">
                <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Recent Activity</h2>
                <div className="space-y-0">
                  {profileData.recentActivity.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground flex-1">{a.title}</p>
                      {a.sp && <span className="font-mono text-xs text-skill-green">{a.sp} SP</span>}
                      <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ANALYTICS (Owner only) */}
              {isOwner && (
                <section id="analytics">
                  <h2 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-6">Analytics</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Profile Views", value: profileData.analytics.profileViews.toLocaleString(), trend: `+${profileData.analytics.viewsTrend}%` },
                      { label: "Swap Requests", value: profileData.analytics.swapRequests.toString(), trend: "+8%" },
                      { label: "Total Earnings", value: `${profileData.analytics.totalEarnings.toLocaleString()} SP`, trend: `+${profileData.analytics.earningsTrend}%` },
                      { label: "Repeat Clients", value: profileData.analytics.repeatClients.toString(), trend: "+12%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                        <p className="font-mono text-xl font-bold text-foreground">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        <p className="text-[10px] text-skill-green mt-1">{s.trend}</p>
                      </div>
                    ))}
                  </div>

                  {/* Weekly chart */}
                  <div className="mt-6 rounded-xl border border-border bg-card p-5">
                    <p className="text-xs text-muted-foreground mb-4">Weekly Profile Views</p>
                    <div className="h-32 flex items-end gap-2">
                      {profileData.analytics.weeklyViews.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div initial={{ height: 0 }} whileInView={{ height: `${(v / 400) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="w-full rounded-sm bg-foreground/20" />
                          <span className="text-[9px] text-muted-foreground">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
