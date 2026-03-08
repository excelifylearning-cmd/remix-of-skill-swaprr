import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2, Users, Search, Star, TrendingUp, Briefcase,
  Calendar, MessageSquare, Settings, Bell, Plus,
  LayoutDashboard, Coins, GraduationCap, Crown, Shield,
  BarChart3, UserPlus, Video, Handshake, X, Clock,
  CheckCircle2, AlertTriangle, Eye, Layers
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import PageTransition from "@/components/shared/PageTransition";
import LoginPrompt from "@/components/shared/LoginPrompt";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "talent-pool", label: "Talent Pool", icon: Users },
  { id: "consultations", label: "Consultations", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10" };
};

/* ═══ OVERVIEW ═══ */
const OverviewTab = ({ projects, consultations, profile }: any) => {
  const activeProjects = projects?.filter((p: any) => p.status !== "Completed") || [];
  const stats = [
    { label: "Active Projects", value: activeProjects.length, icon: Briefcase, color: "text-court-blue" },
    { label: "SP Balance", value: profile?.sp?.toLocaleString() || "0", icon: Coins, color: "text-badge-gold" },
    { label: "Completed", value: projects?.filter((p: any) => p.status === "Completed").length || 0, icon: CheckCircle2, color: "text-skill-green" },
    { label: "Consultations", value: consultations?.length || 0, icon: MessageSquare, color: "text-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-black text-foreground">Enterprise Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage projects, talent, and consultations</p>
            <Badge className="mt-2 bg-court-blue/10 text-court-blue border-none">Enterprise</Badge>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-court-blue/10 border border-court-blue/20">
            <Building2 size={32} className="text-court-blue" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} className="rounded-xl border border-border bg-card p-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Active Projects</h3>
          <div className="space-y-3">
            {activeProjects.slice(0, 3).map((project: any) => (
              <div key={project.id} className="rounded-lg border border-border bg-surface-1 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{project.name}</span>
                  <Badge className={`text-[10px] ${project.priority === 'high' ? 'bg-alert-red/10 text-alert-red' : 'bg-badge-gold/10 text-badge-gold'} border-none`}>{project.priority}</Badge>
                </div>
                <Progress value={project.progress} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{project.progress}% complete</span>
                  <span>{project.team_size} team members</span>
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && <p className="text-sm text-muted-foreground">No active projects</p>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Upcoming Consultations</h3>
          <div className="space-y-3">
            {(consultations || []).slice(0, 3).map((c: any) => (
              <div key={c.id} className="flex items-center gap-4 rounded-lg bg-surface-1 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-court-blue/10">
                  <Video size={18} className="text-court-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.topic}</p>
                  <p className="text-xs text-muted-foreground">with {c.expert_name} · {c.scheduled_date}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={c.status === "Scheduled" ? "bg-skill-green/10 text-skill-green border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{c.status}</Badge>
                  <p className="text-xs font-bold text-badge-gold mt-1">{c.sp_cost} SP</p>
                </div>
              </div>
            ))}
            {(!consultations || consultations.length === 0) && <p className="text-sm text-muted-foreground">No consultations scheduled</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ PROJECTS ═══ */
const ProjectsTab = ({ projects }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-bold text-foreground">Projects ({projects?.length || 0})</h2>
      <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
        <Plus size={14} /> New Project
      </button>
    </div>
    <div className="space-y-4">
      {(projects || []).map((project: any) => (
        <motion.div key={project.id} className="rounded-2xl border border-border bg-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={
                  project.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" :
                  project.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" :
                  "bg-badge-gold/10 text-badge-gold border-none"
                }>{project.status}</Badge>
                {project.deadline && <span className="text-xs text-muted-foreground">Due: {project.deadline}</span>}
              </div>
            </div>
            <Badge className={
              project.priority === "high" ? "bg-alert-red/10 text-alert-red border-none" :
              project.priority === "medium" ? "bg-badge-gold/10 text-badge-gold border-none" :
              "bg-surface-2 text-muted-foreground border-none"
            }>{project.priority}</Badge>
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users size={12} /> {project.team_size} members</span>
            <span className="flex items-center gap-1 text-badge-gold"><Coins size={12} /> {project.budget} SP</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ═══ TALENT POOL ═══ */
const TalentPoolTab = () => {
  const [search, setSearch] = useState("");
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalents = async () => {
      const { data } = await supabase.from("profiles").select("*").order("elo", { ascending: false }).limit(20);
      setTalents(data || []);
      setLoading(false);
    };
    fetchTalents();
  }, []);

  const filtered = talents.filter(t =>
    t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    (t.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Talent Pool</h2>
          <p className="text-sm text-muted-foreground">Browse vetted experts from the platform</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or skill..."
            className="h-9 w-56 rounded-lg border border-border bg-surface-1 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading talent...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((talent) => {
            const tier = eloTier(talent.elo);
            return (
              <motion.div key={talent.id} className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                    {talent.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground truncate">{talent.display_name || talent.full_name}</h3>
                      {talent.id_verified && <Shield size={12} className="text-court-blue shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{(talent.skills || []).slice(0, 2).join(", ") || "No skills listed"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${tier.bg} ${tier.color} border-none text-[10px]`}>{tier.label}</Badge>
                      {talent.university && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><GraduationCap size={10} /> {talent.university}</span>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{talent.elo}</p>
                    <p className="text-[9px] text-muted-foreground">ELO</p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-foreground">{talent.total_gigs_completed || 0}</p>
                    <p className="text-[9px] text-muted-foreground">Gigs</p>
                  </div>
                  <div className="rounded-lg bg-surface-1 p-2">
                    <p className="text-xs font-bold text-badge-gold">{talent.sp}</p>
                    <p className="text-[9px] text-muted-foreground">SP</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={talent.availability === "Available" ? "bg-skill-green/10 text-skill-green border-none" : "bg-surface-2 text-muted-foreground border-none"}>
                    {talent.availability || "Unknown"}
                  </Badge>
                  <Link to={`/profile/${talent.user_id}`} className="text-xs text-muted-foreground hover:text-foreground">View Profile →</Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══ CONSULTATIONS ═══ */
const ConsultationsTab = ({ consultations }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-bold text-foreground">Consultations</h2>
      <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background">
        <Plus size={14} /> Book Consultation
      </button>
    </div>
    <div className="space-y-4">
      {(consultations || []).map((c: any) => (
        <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-court-blue/10">
                <Video size={20} className="text-court-blue" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{c.topic}</h3>
                <p className="text-xs text-muted-foreground">with {c.expert_name}</p>
              </div>
            </div>
            <Badge className={
              c.status === "Scheduled" ? "bg-skill-green/10 text-skill-green border-none" :
              c.status === "Completed" ? "bg-surface-2 text-muted-foreground border-none" :
              "bg-badge-gold/10 text-badge-gold border-none"
            }>{c.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={12} /> {c.scheduled_date}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {c.scheduled_time}</span>
            <span className="text-badge-gold font-bold">{c.sp_cost} SP</span>
          </div>
        </div>
      ))}
      {(!consultations || consultations.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">No consultations yet. Book one to get started.</div>
      )}
    </div>
  </div>
);

/* ═══ ANALYTICS ═══ */
const AnalyticsTab = ({ projects }: any) => {
  const totalBudget = (projects || []).reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
  const completed = (projects || []).filter((p: any) => p.status === "Completed").length;
  const metrics = [
    { label: "Total SP Budget", value: totalBudget.toLocaleString(), period: "across all projects" },
    { label: "Projects Completed", value: completed, period: "all time" },
    { label: "Active Projects", value: (projects || []).filter((p: any) => p.status === "In Progress").length, period: "current" },
    { label: "Avg. Progress", value: `${Math.round((projects || []).reduce((s: number, p: any) => s + p.progress, 0) / Math.max((projects || []).length, 1))}%`, period: "across projects" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-foreground">Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className="font-heading text-2xl font-black text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{m.period}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Budget by Project</h3>
        <div className="space-y-4">
          {(projects || []).map((p: any) => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.budget} SP</span>
              </div>
              <Progress value={totalBudget > 0 ? (p.budget / totalBudget) * 100 : 0} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══ SIDEBAR ═══ */
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
                <p className="text-sm font-semibold text-foreground truncate">Enterprise</p>
                <p className="text-xs text-muted-foreground">Management</p>
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
                  <SidebarMenuButton onClick={() => setActiveTab(item.id)} className={activeTab === item.id ? "bg-foreground text-background" : ""}>
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

/* ═══ MAIN ═══ */
const EnterpriseDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [projects, setProjects] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const fetch = async () => {
      const [pRes, cRes, prRes] = await Promise.all([
        supabase.from("enterprise_projects").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("enterprise_consultations").select("*").eq("user_id", user!.id).order("scheduled_date", { ascending: true }),
        supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
      ]);
      setProjects(pRes.data || []);
      setConsultations(cRes.data || []);
      setProfile(prRes.data);
      setLoading(false);
    };
    fetch();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Building2 size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Enterprise Dashboard</h2>
            <p className="text-muted-foreground mb-4">Log in to access your enterprise management tools</p>
            <Link to="/login" className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background">Log In</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const renderContent = () => {
    if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
    switch (activeTab) {
      case "overview": return <OverviewTab projects={projects} consultations={consultations} profile={profile} />;
      case "projects": return <ProjectsTab projects={projects} />;
      case "talent-pool": return <TalentPoolTab />;
      case "consultations": return <ConsultationsTab consultations={consultations} />;
      case "analytics": return <AnalyticsTab projects={projects} />;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Enterprise settings coming soon...</div>;
      default: return <OverviewTab projects={projects} consultations={consultations} profile={profile} />;
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
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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
