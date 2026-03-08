import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2, Users, Search, Filter, Star, TrendingUp, Briefcase,
  Calendar, MessageSquare, FileText, Award, Settings, Bell, ChevronRight,
  LayoutDashboard, Plus, CheckCircle2, Clock, Eye, Send, Bookmark,
  Target, Coins, GraduationCap, MapPin, Globe, Crown, Shield,
  BarChart3, PieChart, Activity, Layers, ArrowUpRight, Download,
  UserPlus, Mail, Phone, Video, Handshake, Zap, ExternalLink, X
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import PageTransition from "@/components/shared/PageTransition";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "talent-pool", label: "Talent Pool", icon: Users },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "hiring", label: "Hiring Pipeline", icon: UserPlus },
  { id: "consultations", label: "Consultations", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "billing", label: "Billing", icon: Coins },
  { id: "settings", label: "Settings", icon: Settings },
];

const talentPool = [
  { id: 1, name: "Victor Z.", skill: "Machine Learning", elo: 1780, uni: "MIT", rating: 5.0, avatar: "VZ", verified: true, available: true, hourlyRate: "$120-150", completedProjects: 67 },
  { id: 2, name: "Chen L.", skill: "React Native", elo: 1750, uni: "MIT", rating: 5.0, avatar: "CL", verified: true, available: true, hourlyRate: "$100-130", completedProjects: 103 },
  { id: 3, name: "Niko A.", skill: "Cloud Architecture", elo: 1800, uni: "Stanford", rating: 5.0, avatar: "NA", verified: true, available: false, hourlyRate: "$150-200", completedProjects: 89 },
  { id: 4, name: "Hack M.", skill: "Cybersecurity", elo: 1700, uni: "Caltech", rating: 5.0, avatar: "HM", verified: true, available: true, hourlyRate: "$140-180", completedProjects: 54 },
  { id: 5, name: "Maya K.", skill: "Brand Design", elo: 1450, uni: "MIT", rating: 4.9, avatar: "MK", verified: true, available: true, hourlyRate: "$80-100", completedProjects: 47 },
  { id: 6, name: "James T.", skill: "Backend Dev", elo: 1680, uni: "Stanford", rating: 5.0, avatar: "JT", verified: true, available: true, hourlyRate: "$110-140", completedProjects: 82 },
];

const enterpriseProjects = [
  { id: 1, name: "AI Chatbot Integration", status: "In Progress", progress: 65, team: 4, budget: 5000, deadline: "2026-04-01", priority: "high" },
  { id: 2, name: "Mobile App Redesign", status: "Planning", progress: 15, team: 3, budget: 3500, deadline: "2026-05-15", priority: "medium" },
  { id: 3, name: "Data Pipeline Setup", status: "In Progress", progress: 40, team: 2, budget: 2800, deadline: "2026-04-20", priority: "high" },
  { id: 4, name: "Security Audit", status: "Completed", progress: 100, team: 1, budget: 1500, deadline: "2026-03-01", priority: "low" },
];

const hiringPipeline = [
  { id: 1, role: "Senior ML Engineer", applicants: 12, stage: "Interviewing", posted: "5d ago", urgency: "urgent" },
  { id: 2, role: "UI/UX Designer", applicants: 8, stage: "Screening", posted: "2d ago", urgency: "normal" },
  { id: 3, role: "DevOps Specialist", applicants: 5, stage: "Offer Sent", posted: "1w ago", urgency: "filled" },
];

const consultations = [
  { id: 1, expert: "Victor Z.", topic: "ML Architecture Review", date: "2026-03-12", time: "2:00 PM", status: "Scheduled", spCost: 150 },
  { id: 2, expert: "Niko A.", topic: "Cloud Migration Strategy", date: "2026-03-15", time: "10:00 AM", status: "Pending", spCost: 200 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
═══════════════════════════════════════════════════════════════════════════ */

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10" };
};

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════════════════ */

const OverviewTab = () => {
  const stats = [
    { label: "Active Projects", value: "3", change: "+1", icon: Briefcase, color: "text-court-blue" },
    { label: "Talent Engaged", value: "12", change: "+3", icon: Users, color: "text-skill-green" },
    { label: "SP Balance", value: "5,420", change: "-230", icon: Coins, color: "text-badge-gold" },
    { label: "Avg. Satisfaction", value: "4.9", change: "+0.1", icon: Star, color: "text-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-court-blue/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-black text-foreground">Acme Corp</h2>
            <p className="text-sm text-muted-foreground mt-1">Enterprise Account · 12 team members</p>
            <Badge className="mt-2 bg-court-blue/10 text-court-blue border-none">Premium Plan</Badge>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-court-blue/10 border border-court-blue/20">
            <Building2 size={32} className="text-court-blue" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-xl border border-border bg-card p-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className={stat.color} />
              <span className={`text-xs ${stat.change.startsWith('+') ? 'text-skill-green' : 'text-alert-red'}`}>
                {stat.change}
              </span>
            </div>
            <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Projects + Recent Hires */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Active Projects</h3>
            <Link to="?tab=projects" className="text-xs text-muted-foreground hover:text-foreground">View All →</Link>
          </div>
          <div className="space-y-3">
            {enterpriseProjects.filter(p => p.status !== "Completed").slice(0, 3).map((project) => (
              <div key={project.id} className="rounded-lg border border-border bg-surface-1 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{project.name}</span>
                  <Badge className={`text-[10px] ${project.priority === 'high' ? 'bg-alert-red/10 text-alert-red' : 'bg-badge-gold/10 text-badge-gold'} border-none`}>
                    {project.priority}
                  </Badge>
                </div>
                <Progress value={project.progress} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{project.progress}% complete</span>
                  <span>{project.team} team members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Top Talent</h3>
            <Link to="?tab=talent-pool" className="text-xs text-muted-foreground hover:text-foreground">Browse All →</Link>
          </div>
          <div className="space-y-3">
            {talentPool.slice(0, 3).map((talent) => {
              const tier = eloTier(talent.elo);
              return (
                <div key={talent.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>
                    {talent.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{talent.name}</p>
                    <p className="text-xs text-muted-foreground">{talent.skill} · {talent.uni}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${tier.bg} ${tier.color} border-none text-[10px]`}>{tier.label}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{talent.hourlyRate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Upcoming Consultations</h3>
        <div className="space-y-3">
          {consultations.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-lg bg-surface-1 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-court-blue/10">
                <Video size={20} className="text-court-blue" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{c.topic}</p>
                <p className="text-xs text-muted-foreground">with {c.expert} · {c.date} at {c.time}</p>
              </div>
              <div className="text-right">
                <Badge className={c.status === "Scheduled" ? "bg-skill-green/10 text-skill-green border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>
                  {c.status}
                </Badge>
                <p className="text-xs font-bold text-badge-gold mt-1">{c.spCost} SP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TALENT POOL TAB
═══════════════════════════════════════════════════════════════════════════ */

const TalentPoolTab = () => {
  const [search, setSearch] = useState("");
  const [selectedTalent, setSelectedTalent] = useState<typeof talentPool[0] | null>(null);
  const [filterSkill, setFilterSkill] = useState("All");

  const skills = ["All", "Machine Learning", "React Native", "Cloud Architecture", "Cybersecurity", "Brand Design", "Backend Dev"];

  const filteredTalent = talentPool.filter(t =>
    (filterSkill === "All" || t.skill === filterSkill) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Talent Pool</h2>
          <p className="text-sm text-muted-foreground">Vetted experts from top universities</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search talent..."
              className="h-9 w-48 rounded-lg border border-border bg-surface-1 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill}
            onClick={() => setFilterSkill(skill)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterSkill === skill ? 'bg-foreground text-background' : 'bg-surface-1 text-muted-foreground hover:text-foreground'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Talent Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTalent.map((talent) => {
          const tier = eloTier(talent.elo);
          return (
            <motion.div
              key={talent.id}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedTalent(talent)}
            >
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                    {talent.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{talent.name}</h3>
                      {talent.verified && <Shield size={12} className="text-court-blue" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{talent.skill}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${tier.bg} ${tier.color} border-none text-[10px]`}>{tier.label}</Badge>
                      {talent.uni && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <GraduationCap size={10} /> {talent.uni}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{talent.rating}</p>
                    <p className="text-[9px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{talent.completedProjects}</p>
                    <p className="text-[9px] text-muted-foreground">Projects</p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{talent.elo}</p>
                    <p className="text-[9px] text-muted-foreground">ELO</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-badge-gold">{talent.hourlyRate}</span>
                  <Badge className={talent.available ? "bg-skill-green/10 text-skill-green border-none" : "bg-surface-2 text-muted-foreground border-none"}>
                    {talent.available ? "Available" : "Busy"}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-border/50 px-5 py-3 bg-surface-1 flex gap-2">
                <button className="flex-1 rounded-lg bg-foreground py-2 text-xs font-medium text-background">
                  Hire
                </button>
                <button className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Message
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Talent Modal */}
      <AnimatePresence>
        {selectedTalent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTalent(null)}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl border border-border bg-card overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${eloTier(selectedTalent.elo).bg} font-mono text-xl font-bold ${eloTier(selectedTalent.elo).color}`}>
                      {selectedTalent.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedTalent.name}</h3>
                      <p className="text-muted-foreground">{selectedTalent.skill}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${eloTier(selectedTalent.elo).bg} ${eloTier(selectedTalent.elo).color} border-none`}>
                          {eloTier(selectedTalent.elo).label}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star size={10} className="text-badge-gold fill-badge-gold" /> {selectedTalent.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTalent(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl bg-surface-1 p-4">
                    <p className="text-2xl font-bold text-foreground">{selectedTalent.completedProjects}</p>
                    <p className="text-xs text-muted-foreground">Projects Completed</p>
                  </div>
                  <div className="rounded-xl bg-surface-1 p-4">
                    <p className="text-2xl font-bold text-badge-gold">{selectedTalent.hourlyRate}</p>
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl bg-court-blue py-3 text-sm font-semibold text-white flex items-center justify-center gap-2">
                    <Handshake size={16} /> Hire for Project
                  </button>
                  <button className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background flex items-center justify-center gap-2">
                    <Video size={16} /> Book Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS TAB
═══════════════════════════════════════════════════════════════════════════ */

const ProjectsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Projects</h2>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="space-y-4">
        {enterpriseProjects.map((project) => (
          <motion.div
            key={project.id}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={
                      project.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" :
                      project.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" :
                      "bg-badge-gold/10 text-badge-gold border-none"
                    }>
                      {project.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Due: {project.deadline}</span>
                  </div>
                </div>
                <Badge className={
                  project.priority === "high" ? "bg-alert-red/10 text-alert-red border-none" :
                  project.priority === "medium" ? "bg-badge-gold/10 text-badge-gold border-none" :
                  "bg-surface-2 text-muted-foreground border-none"
                }>
                  {project.priority} priority
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users size={12} /> {project.team} members
                  </span>
                  <span className="flex items-center gap-1 text-xs text-badge-gold">
                    <Coins size={12} /> {project.budget} SP budget
                  </span>
                </div>
                <button className="text-xs font-medium text-foreground hover:text-court-blue transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   HIRING TAB
═══════════════════════════════════════════════════════════════════════════ */

const HiringTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Hiring Pipeline</h2>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
          <Plus size={14} /> Post Job
        </button>
      </div>

      <div className="grid gap-4">
        {hiringPipeline.map((job) => (
          <div key={job.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
              </div>
              <Badge className={
                job.urgency === "urgent" ? "bg-alert-red/10 text-alert-red border-none" :
                job.urgency === "filled" ? "bg-skill-green/10 text-skill-green border-none" :
                "bg-surface-2 text-muted-foreground border-none"
              }>
                {job.urgency}
              </Badge>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{job.applicants} applicants</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-court-blue" />
                <span className="text-sm text-foreground">{job.stage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS TAB
═══════════════════════════════════════════════════════════════════════════ */

const AnalyticsTab = () => {
  const metrics = [
    { label: "Total SP Spent", value: "12,450", trend: "+15%", period: "vs last month" },
    { label: "Projects Completed", value: "8", trend: "+2", period: "this quarter" },
    { label: "Avg. Project Duration", value: "18 days", trend: "-3 days", period: "improving" },
    { label: "Talent Retention", value: "94%", trend: "+5%", period: "excellent" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-foreground">Analytics</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <p className="font-heading text-2xl font-black text-foreground">{metric.value}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-skill-green">{metric.trend}</span>
              <span className="text-[10px] text-muted-foreground">{metric.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Spending by Category</h3>
        <div className="space-y-4">
          {[
            { category: "Development", spent: 5200, total: 8000 },
            { category: "Design", spent: 3100, total: 4000 },
            { category: "Marketing", spent: 1800, total: 3000 },
            { category: "Consulting", spent: 2350, total: 3000 },
          ].map((cat, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{cat.category}</span>
                <span className="text-xs text-muted-foreground">{cat.spent} / {cat.total} SP</span>
              </div>
              <Progress value={(cat.spent / cat.total) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */

const EnterpriseSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-court-blue/10">
                <Building2 size={18} className="text-court-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Acme Corp</p>
                <p className="text-xs text-muted-foreground">Enterprise</p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Enterprise</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={activeTab === item.id ? "bg-foreground text-background" : ""}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

const EnterpriseDashboardPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "talent-pool": return <TalentPoolTab />;
      case "projects": return <ProjectsTab />;
      case "hiring": return <HiringTab />;
      case "consultations": return <div className="py-20 text-center text-muted-foreground">Consultations management coming soon...</div>;
      case "analytics": return <AnalyticsTab />;
      case "billing": return <div className="py-20 text-center text-muted-foreground">Billing & invoices coming soon...</div>;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Enterprise settings coming soon...</div>;
      default: return <OverviewTab />;
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <EnterpriseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="font-heading text-lg font-bold text-foreground capitalize">{activeTab.replace("-", " ")}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
                  <Bell size={18} />
                </button>
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  User Dashboard
                </Link>
              </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
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

export default EnterpriseDashboardPage;
