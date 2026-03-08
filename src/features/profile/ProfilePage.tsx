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

// Demo profile data - comprehensive LinkedIn-style
const demoProfile = {
  id: "demo-user",
  fullName: "Alex Rivera",
  displayName: "@alexrivera",
  headline: "Full-Stack Developer | Building the Future of Tech",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=400&fit=crop",
  bio: "Passionate about creating elegant solutions to complex problems. I specialize in React, Node.js, and cloud architecture. 5+ years of experience building scalable applications. Always learning, always building. Love exchanging skills and helping others grow in their tech journey.",
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
  responseTime: "Usually within 2 hours",
  memberSince: "January 2025",
  lastActive: "2 hours ago",
  verified: true,
  availableForHire: true,
  openToCollaborate: true,
  
  // Skills with endorsements
  skills: [
    { name: "React", level: "Expert", endorsements: 89, verified: true, category: "Frontend" },
    { name: "Node.js", level: "Expert", endorsements: 67, verified: true, category: "Backend" },
    { name: "TypeScript", level: "Advanced", endorsements: 54, verified: true, category: "Languages" },
    { name: "Python", level: "Advanced", endorsements: 45, verified: false, category: "Languages" },
    { name: "AWS", level: "Intermediate", endorsements: 32, verified: true, category: "Cloud" },
    { name: "PostgreSQL", level: "Advanced", endorsements: 28, verified: false, category: "Database" },
    { name: "Docker", level: "Intermediate", endorsements: 24, verified: true, category: "DevOps" },
    { name: "GraphQL", level: "Advanced", endorsements: 19, verified: false, category: "API" },
  ],
  
  // Work history
  workHistory: [
    { 
      company: "TechCorp Inc.", 
      role: "Senior Software Engineer", 
      period: "2023 - Present", 
      location: "San Francisco, CA",
      description: "Leading frontend architecture for enterprise SaaS platform serving 500K+ users. Mentoring junior developers and driving best practices.", 
      logo: "TC",
      skills: ["React", "TypeScript", "AWS"]
    },
    { 
      company: "StartupXYZ", 
      role: "Full-Stack Developer", 
      period: "2021 - 2023",
      location: "Remote",
      description: "Built core product features and scaled platform to 100K users. Implemented CI/CD pipelines and improved deployment frequency by 300%.", 
      logo: "SX",
      skills: ["Node.js", "React", "MongoDB"]
    },
    { 
      company: "Agency Labs", 
      role: "Junior Developer", 
      period: "2019 - 2021",
      location: "New York, NY",
      description: "Developed client websites and web applications. Collaborated with design team to implement pixel-perfect UIs.", 
      logo: "AL",
      skills: ["JavaScript", "HTML/CSS", "WordPress"]
    },
  ],
  
  // Education
  education: [
    { school: "Stanford University", degree: "M.S. Computer Science", period: "2017 - 2019", logo: "S", gpa: "3.9" },
    { school: "UC Berkeley", degree: "B.S. Computer Science", period: "2013 - 2017", logo: "B", gpa: "3.7" },
  ],
  
  // Certifications
  certifications: [
    { name: "AWS Solutions Architect - Professional", issuer: "Amazon Web Services", date: "2024", credentialId: "AWS-SAP-2024", verified: true },
    { name: "React Advanced Patterns", issuer: "Frontend Masters", date: "2023", credentialId: "FM-RAP-2023", verified: true },
    { name: "Node.js Certified Developer", issuer: "OpenJS Foundation", date: "2022", credentialId: "NCD-2022", verified: true },
    { name: "Google Cloud Professional", issuer: "Google", date: "2023", credentialId: "GCP-2023", verified: true },
  ],
  
  // Portfolio projects
  portfolio: [
    { 
      title: "E-Commerce Platform", 
      description: "Full-stack e-commerce solution with React and Node.js. Features include real-time inventory, payment processing, and admin dashboard.", 
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", 
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
      github: "#",
      stats: { views: 1240, likes: 89 }
    },
    { 
      title: "AI Analytics Dashboard", 
      description: "Real-time analytics dashboard with ML predictions. Built for enterprise clients with 99.9% uptime requirement.", 
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", 
      tags: ["Python", "TensorFlow", "D3.js", "AWS"],
      link: "#",
      github: "#",
      stats: { views: 890, likes: 67 }
    },
    { 
      title: "Mobile App Backend", 
      description: "Scalable API backend supporting 1M+ daily requests. Implemented caching strategy reducing latency by 60%.", 
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop", 
      tags: ["Node.js", "Redis", "PostgreSQL", "Docker"],
      link: "#",
      github: "#",
      stats: { views: 567, likes: 45 }
    },
  ],
  
  // Recommendations
  recommendations: [
    { 
      name: "Sarah Chen", 
      role: "Product Manager @ Google", 
      avatar: "SC",
      relationship: "Worked together at StartupXYZ",
      text: "Alex is an exceptional developer with a rare combination of technical excellence and communication skills. His code quality and attention to detail are outstanding. He consistently delivered complex features ahead of schedule while mentoring the team.", 
      date: "2 weeks ago" 
    },
    { 
      name: "Marcus Johnson", 
      role: "CTO @ StartupXYZ", 
      avatar: "MJ",
      relationship: "Was Alex's manager",
      text: "Working with Alex was a pleasure. He took ownership of critical systems and improved them significantly. His problem-solving skills are top-notch.", 
      date: "1 month ago" 
    },
    { 
      name: "Emily Wang", 
      role: "Senior Designer @ Airbnb", 
      avatar: "EW",
      relationship: "Collaborated on SkillSwap projects",
      text: "Alex is not just a great developer but also understands design thinking. Our collaboration on multiple projects was seamless. Highly recommend!", 
      date: "2 months ago" 
    },
  ],
  
  // Social links
  socialLinks: {
    github: "https://github.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera",
    twitter: "https://twitter.com/alexrivera",
    website: "https://alexrivera.dev",
    youtube: "https://youtube.com/@alexrivera",
  },
  
  // Analytics (for profile owner)
  analytics: {
    profileViews: 2340,
    viewsTrend: 12,
    weeklyViews: [180, 220, 195, 340, 280, 310, 290],
    swapRequests: 89,
    requestsTrend: 8,
    avgRating: 4.9,
    ratingCount: 127,
    totalEarnings: 12500,
    monthlyEarnings: 1850,
    earningsTrend: 24,
    completionRate: 98,
    repeatClients: 34,
    searchAppearances: 1560,
  },
  
  // Active projects
  activeProjects: [
    { 
      title: "Web App Development", 
      client: "TechStartup", 
      clientAvatar: "TS",
      status: "In Progress", 
      progress: 65, 
      deadline: "Mar 15, 2026", 
      spValue: 500,
      role: "Lead Developer",
      team: 3
    },
    { 
      title: "API Integration", 
      client: "FinanceApp", 
      clientAvatar: "FA",
      status: "In Progress", 
      progress: 40, 
      deadline: "Mar 22, 2026", 
      spValue: 300,
      role: "Backend Developer",
      team: 2
    },
    { 
      title: "Code Review & Mentoring", 
      client: "Junior Dev Program", 
      clientAvatar: "JD",
      status: "Ongoing", 
      progress: 80, 
      deadline: "Rolling", 
      spValue: 150,
      role: "Mentor",
      team: 5
    },
  ],
  
  // Project history
  projectHistory: [
    { title: "E-commerce Redesign", client: "RetailCo", rating: 5, sp: 450, date: "Feb 2026" },
    { title: "Mobile App Backend", client: "FitTrack", rating: 5, sp: 380, date: "Jan 2026" },
    { title: "Dashboard Analytics", client: "DataViz", rating: 5, sp: 320, date: "Jan 2026" },
    { title: "API Development", client: "CloudSync", rating: 4, sp: 280, date: "Dec 2025" },
    { title: "Website Optimization", client: "FastLoad", rating: 5, sp: 200, date: "Dec 2025" },
  ],
  
  // Activity feed
  recentActivity: [
    { type: "swap_completed", title: "Completed swap with Maya K.", time: "2 hours ago", sp: "+150", icon: CheckCircle2 },
    { type: "endorsement", title: "Received endorsement for React from James T.", time: "5 hours ago", icon: ThumbsUp },
    { type: "badge", title: "Earned 'Top Contributor' badge", time: "1 day ago", icon: Award },
    { type: "swap_started", title: "Started new project with Carlos M.", time: "2 days ago", sp: "300", icon: Zap },
    { type: "recommendation", title: "Sarah C. wrote you a recommendation", time: "3 days ago", icon: Star },
    { type: "skill_verified", title: "AWS skill verified", time: "4 days ago", icon: Shield },
  ],
  
  // Badges & achievements
  badges: [
    { name: "Diamond Tier", icon: "💎", rarity: "Legendary", description: "Reached Diamond tier" },
    { name: "Century Club", icon: "🏆", rarity: "Epic", description: "Completed 100+ swaps" },
    { name: "Top Contributor", icon: "⭐", rarity: "Rare", description: "Top 5% contributor" },
    { name: "Verified Pro", icon: "✅", rarity: "Rare", description: "Identity verified" },
    { name: "Guild Champion", icon: "👑", rarity: "Epic", description: "Guild War winner" },
    { name: "Early Adopter", icon: "🚀", rarity: "Common", description: "Joined in beta" },
    { name: "Mentor", icon: "🎓", rarity: "Rare", description: "Mentored 10+ users" },
    { name: "Streak Master", icon: "🔥", rarity: "Rare", description: "30-day streak" },
  ],
  
  // Guild memberships
  guilds: [
    { id: "1", name: "Tech Pioneers", role: "Officer", icon: "🚀", members: 156 },
    { id: "2", name: "Code Collective", role: "Member", icon: "💻", members: 89 },
  ],
};

const tierConfig: Record<string, { color: string; bg: string; border: string }> = {
  Bronze: { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  Silver: { color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/30" },
  Gold: { color: "text-badge-gold", bg: "bg-badge-gold/10", border: "border-badge-gold/30" },
  Platinum: { color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
  Diamond: { color: "text-court-blue", bg: "bg-court-blue/10", border: "border-court-blue/30" },
  Master: { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, profile: authProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "analytics" | "activity" | "projects">("overview");
  const [profileData] = useState(demoProfile);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(userId === user?.id || userId === "me" || userId === "demo-user" || !userId);
  }, [userId, user]);

  const tier = tierConfig[profileData.tier] || tierConfig.Bronze;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "portfolio", label: "Portfolio", icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart3, ownerOnly: true },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "projects", label: "Projects", icon: Briefcase },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 lg:h-72 mt-16">
          <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          {isOwner && (
            <button className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm px-3 py-2 text-xs font-medium text-foreground hover:bg-background transition-colors">
              <Camera size={12} /> Edit Cover
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative -mt-20 sm:-mt-24 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <img 
                  src={profileData.avatar} 
                  alt={profileData.fullName} 
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-4 border-background object-cover shadow-2xl" 
                />
                {profileData.verified && (
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-skill-green text-white shadow-lg border-2 border-background">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <div className={`absolute -top-2 -left-2 flex h-10 w-10 items-center justify-center rounded-full ${tier.bg} ${tier.border} border-2 shadow-lg`}>
                  <span className="text-lg">💎</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4 lg:pt-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">{profileData.fullName}</h1>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tier.color} ${tier.bg} ${tier.border} border`}>
                        {profileData.tier}
                      </span>
                      {profileData.availableForHire && (
                        <span className="rounded-full bg-skill-green/10 border border-skill-green/30 px-3 py-1 text-xs font-semibold text-skill-green">
                          Open to Work
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-foreground/80 mb-2">{profileData.headline}</p>
                    <p className="text-sm text-muted-foreground mb-1">{profileData.currentRole} at {profileData.currentCompany}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {profileData.location}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {profileData.university}</span>
                      <span className="flex items-center gap-1.5"><Globe size={14} /> {profileData.timezone}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> {profileData.totalSwaps} connections</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOwner ? (
                      <Link to="/settings" className="flex items-center gap-2 rounded-xl bg-surface-2 px-5 py-3 text-sm font-medium text-foreground hover:bg-surface-1 transition-colors">
                        <Edit2 size={14} /> Edit Profile
                      </Link>
                    ) : (
                      <>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background">
                          <MessageSquare size={14} /> Request Swap
                        </motion.button>
                        <button className="rounded-xl bg-surface-2 p-3 text-muted-foreground hover:text-foreground transition-colors">
                          <Heart size={18} />
                        </button>
                      </>
                    )}
                    <button className="rounded-xl bg-surface-2 p-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={18} />
                    </button>
                    <button className="rounded-xl bg-surface-2 p-3 text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-border">
                  <div>
                    <p className="font-heading text-3xl font-black text-foreground">{profileData.elo}</p>
                    <p className="text-xs text-muted-foreground">ELO Rating</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-black text-skill-green">{profileData.sp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Skill Points</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-black text-foreground">{profileData.totalSwaps}</p>
                    <p className="text-xs text-muted-foreground">Total Swaps</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-black text-badge-gold flex items-center gap-1">
                      <Star size={20} fill="currentColor" /> {profileData.analytics.avgRating}
                    </p>
                    <p className="text-xs text-muted-foreground">{profileData.analytics.ratingCount} reviews</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-black text-foreground">{profileData.analytics.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-black text-court-blue">{profileData.activeGigs}</p>
                    <p className="text-xs text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8 sticky top-16 bg-background z-30">
            <div className="flex gap-1 overflow-x-auto pb-px -mb-px">
              {tabs.filter(tab => !tab.ownerOnly || isOwner).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-20">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                <div className="space-y-8">
                  {/* About */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <User size={18} /> About
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profileData.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map(lang => (
                        <span key={lang} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">{lang}</span>
                      ))}
                    </div>
                  </section>

                  {/* Skills */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                        <Zap size={18} /> Skills & Endorsements
                      </h2>
                      {isOwner && <button className="text-xs text-court-blue hover:underline">+ Add Skill</button>}
                    </div>
                    <div className="space-y-3">
                      {profileData.skills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between p-4 rounded-xl bg-surface-1 hover:bg-surface-2 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border">
                              <Code size={18} className="text-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                                {skill.verified && <CheckCircle2 size={14} className="text-skill-green" />}
                                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{skill.category}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{skill.level}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                                <ThumbsUp size={12} /> {skill.endorsements}
                              </span>
                              <span className="text-[10px] text-muted-foreground">endorsements</span>
                            </div>
                            {!isOwner && (
                              <button className="rounded-lg bg-surface-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                                Endorse
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Experience */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <Briefcase size={18} /> Experience
                    </h2>
                    <div className="space-y-6">
                      {profileData.workHistory.map((job, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 font-heading text-lg font-bold text-foreground shrink-0">
                            {job.logo}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-foreground">{job.role}</h3>
                            <p className="text-sm text-muted-foreground">{job.company} · {job.period}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.skills.map(s => (
                                <span key={s} className="rounded-full bg-court-blue/10 px-2.5 py-0.5 text-[10px] font-medium text-court-blue">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <GraduationCap size={18} /> Education
                    </h2>
                    <div className="space-y-4">
                      {profileData.education.map((edu, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-surface-1">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-skill-green/10 font-heading text-xl font-bold text-skill-green shrink-0">
                            {edu.logo}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{edu.school}</h3>
                            <p className="text-sm text-muted-foreground">{edu.degree}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{edu.period} · GPA: {edu.gpa}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Certifications */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <Award size={18} /> Licenses & Certifications
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {profileData.certifications.map((cert, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-badge-gold/10 shrink-0">
                            <Award size={20} className="text-badge-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-foreground truncate">{cert.name}</h3>
                              {cert.verified && <CheckCircle2 size={12} className="text-skill-green shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Issued {cert.date} · ID: {cert.credentialId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Recommendations */}
                  <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                        <Star size={18} /> Recommendations ({profileData.recommendations.length})
                      </h2>
                      {!isOwner && <button className="text-xs text-court-blue hover:underline">Write Recommendation</button>}
                    </div>
                    <div className="space-y-4">
                      {profileData.recommendations.map((rec, i) => (
                        <div key={i} className="p-5 rounded-xl bg-surface-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground shrink-0">
                              {rec.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground">{rec.name}</p>
                              <p className="text-xs text-muted-foreground">{rec.role}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{rec.relationship}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">{rec.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground italic leading-relaxed">"{rec.text}"</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Social Links */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4">Connect</h3>
                    <div className="space-y-2">
                      {profileData.socialLinks.website && (
                        <a href={profileData.socialLinks.website} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <Globe size={18} className="text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">Personal Website</span>
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </a>
                      )}
                      {profileData.socialLinks.github && (
                        <a href={profileData.socialLinks.github} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <Github size={18} className="text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">GitHub</span>
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </a>
                      )}
                      {profileData.socialLinks.linkedin && (
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <Linkedin size={18} className="text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">LinkedIn</span>
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </a>
                      )}
                      {profileData.socialLinks.twitter && (
                        <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <Twitter size={18} className="text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">Twitter</span>
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4">Achievements ({profileData.badges.length})</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {profileData.badges.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-surface-1 text-center group cursor-pointer hover:bg-surface-2 transition-colors" title={badge.description}>
                          <span className="text-2xl mb-1">{badge.icon}</span>
                          <span className="text-[8px] font-medium text-foreground leading-tight">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guilds */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4">Guild Memberships</h3>
                    <div className="space-y-2">
                      {profileData.guilds.map((guild) => (
                        <Link key={guild.id} to={`/guild/${guild.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <span className="text-2xl">{guild.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{guild.name}</p>
                            <p className="text-[10px] text-muted-foreground">{guild.role} · {guild.members} members</p>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Profile Stats */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4">Profile Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Eye size={14} /> Profile views</span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          {profileData.analytics.profileViews.toLocaleString()}
                          <span className="text-skill-green text-[10px]">+{profileData.analytics.viewsTrend}%</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><MessageSquare size={14} /> Swap requests</span>
                        <span className="text-sm font-semibold text-foreground">{profileData.analytics.swapRequests}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Users size={14} /> Repeat clients</span>
                        <span className="text-sm font-semibold text-foreground">{profileData.analytics.repeatClients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock size={14} /> Response time</span>
                        <span className="text-xs font-semibold text-skill-green">{profileData.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar size={14} /> Member since</span>
                        <span className="text-sm font-semibold text-foreground">{profileData.memberSince}</span>
                      </div>
                    </div>
                  </div>

                  {/* Similar Profiles */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4">People Also Viewed</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Maya K.", role: "Senior Designer", avatar: "MK", elo: 1756 },
                        { name: "James T.", role: "Backend Engineer", avatar: "JT", elo: 1892 },
                        { name: "Sarah L.", role: "React Specialist", avatar: "SL", elo: 1634 },
                      ].map((user, i) => (
                        <Link key={i} to={`/profile/${user.name.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground">
                            {user.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground">{user.role}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{user.elo} ELO</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === "portfolio" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">Portfolio Projects</h2>
                  {isOwner && <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">+ Add Project</button>}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {profileData.portfolio.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all">
                      <div className="relative aspect-video">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="flex gap-2">
                            <a href={item.link} className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white transition-colors">
                              <ExternalLink size={12} /> View
                            </a>
                            <a href={item.github} className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white transition-colors">
                              <Github size={12} /> Code
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-base font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map(tag => (
                            <span key={tag} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye size={12} /> {item.stats.views}</span>
                          <span className="flex items-center gap-1"><Heart size={12} /> {item.stats.likes}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB (Owner only) */}
            {activeTab === "analytics" && isOwner && (
              <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Profile Views", value: profileData.analytics.profileViews.toLocaleString(), trend: profileData.analytics.viewsTrend, icon: Eye, positive: true },
                    { label: "Swap Requests", value: profileData.analytics.swapRequests.toString(), trend: profileData.analytics.requestsTrend, icon: MessageSquare, positive: true },
                    { label: "Total Earnings", value: `${profileData.analytics.totalEarnings.toLocaleString()} SP`, trend: profileData.analytics.earningsTrend, icon: Wallet, positive: true },
                    { label: "Search Appearances", value: profileData.analytics.searchAppearances.toLocaleString(), trend: 5, icon: TrendingUp, positive: true },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon size={20} className="text-muted-foreground" />
                        <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.positive ? 'text-skill-green' : 'text-alert-red'}`}>
                          {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {stat.trend}%
                        </span>
                      </div>
                      <p className="font-heading text-3xl font-black text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">Weekly Profile Views</h3>
                    <div className="h-48 flex items-end gap-2">
                      {profileData.analytics.weeklyViews.map((views, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${(views / 400) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} className="w-full rounded-t-lg bg-court-blue" />
                          <span className="text-[10px] text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">Monthly Earnings</h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <p className="font-heading text-5xl font-black text-skill-green">{profileData.analytics.monthlyEarnings.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground mt-2">Skill Points this month</p>
                        <p className="text-xs text-skill-green mt-1">+{profileData.analytics.earningsTrend}% vs last month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITY TAB */}
            {activeTab === "activity" && (
              <div className="max-w-3xl">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {profileData.recentActivity.map((activity, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                        activity.type === 'swap_completed' ? 'bg-skill-green/10 text-skill-green' :
                        activity.type === 'endorsement' ? 'bg-court-blue/10 text-court-blue' :
                        activity.type === 'badge' ? 'bg-badge-gold/10 text-badge-gold' :
                        activity.type === 'recommendation' ? 'bg-purple-400/10 text-purple-400' :
                        'bg-surface-2 text-foreground'
                      }`}>
                        <activity.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                      {activity.sp && (
                        <span className={`text-sm font-bold ${activity.sp.startsWith('+') ? 'text-skill-green' : 'text-foreground'}`}>
                          {activity.sp} SP
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                {/* Active Projects */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-bold text-foreground">Active Projects ({profileData.activeProjects.length})</h2>
                    {isOwner && <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">+ New Project</button>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {profileData.activeProjects.map((project, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 font-mono text-xs font-bold text-foreground">
                              {project.clientAvatar}
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-foreground">{project.title}</h3>
                              <p className="text-xs text-muted-foreground">{project.client}</p>
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            project.status === 'In Progress' ? 'bg-skill-green/10 text-skill-green' : 'bg-court-blue/10 text-court-blue'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{project.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-skill-green" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1"><Users size={12} /> {project.team} members</span>
                          <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {project.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">{project.role}</span>
                          <span className="font-heading text-sm font-bold text-badge-gold">{project.spValue} SP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Project History */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6">Completed Projects</h2>
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-surface-1">
                        <tr className="text-left text-xs text-muted-foreground">
                          <th className="px-6 py-4 font-medium">Project</th>
                          <th className="px-6 py-4 font-medium">Client</th>
                          <th className="px-6 py-4 font-medium">Rating</th>
                          <th className="px-6 py-4 font-medium">Earned</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileData.projectHistory.map((project, i) => (
                          <tr key={i} className="border-t border-border hover:bg-surface-1 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{project.title}</td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{project.client}</td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1 text-sm text-badge-gold">
                                <Star size={12} fill="currentColor" /> {project.rating}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-skill-green">{project.sp} SP</td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{project.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
