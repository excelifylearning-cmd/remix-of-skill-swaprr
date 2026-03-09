import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2, Users, Search, Star, TrendingUp, Briefcase,
  Calendar, MessageSquare, Settings, Bell, Plus, CheckCircle2,
  Clock, Eye, Coins, GraduationCap, Shield, BarChart3,
  Layers, UserPlus, Video, Handshake, Zap, X,
  LayoutDashboard, Loader2
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
import { toast } from "sonner";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "talent-pool", label: "Talent Pool", icon: Users },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "hiring", label: "Hiring Pipeline", icon: UserPlus },
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

/* ═══ DATA HOOK ═══ */
const useEnterpriseDash = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [talentPool, setTalentPool] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [projRes, candRes, consRes, talentRes] = await Promise.all([
        supabase.from("enterprise_projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("enterprise_candidates").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("enterprise_consultations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, full_name, display_name, elo, sp, skills, university, avatar_url, id_verified, availability, total_gigs_completed, tier").order("elo", { ascending: false }).limit(50),
      ]);
      setProjects(projRes.data || []);
      setCandidates(candRes.data || []);
      setConsultations(consRes.data || []);
      setTalentPool(talentRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  return { projects, candidates, consultations, talentPool, loading };
};

/* ═══ OVERVIEW ═══ */
const OverviewTab = ({ projects, candidates, consultations, talentPool, profile }: any) => {
  const activeProjects = projects.filter((p: any) => p.status !== "Completed");
  const stats = [
    { label: "Active Projects", value: String(activeProjects.length), icon: Briefcase, color: "text-court-blue" },
    { label: "Talent Engaged", value: String(candidates.length), icon: Users, color: "text-skill-green" },
    { label: "SP Balance", value: (profile?.sp || 0).toLocaleString(), icon: Coins, color: "text-badge-gold" },
    { label: "Consultations", value: String(consultations.length), icon: MessageSquare, color: "text-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-court-blue/10 via-card to-surface-1 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-black text-foreground">Enterprise Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">{profile?.full_name || "Company"}</p>
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
            {activeProjects.slice(0, 3).map((p: any) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface-1 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <Badge className={p.priority === "high" ? "bg-alert-red/10 text-alert-red border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{p.priority}</Badge>
                </div>
                <Progress value={p.progress} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{p.progress}% complete</span>
                  <span>{p.team_size} team members</span>
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && <p className="text-sm text-muted-foreground">No active projects</p>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Top Talent</h3>
          <div className="space-y-3">
            {talentPool.slice(0, 3).map((t: any) => {
              const tier = eloTier(t.elo);
              return (
                <Link key={t.user_id} to={`/profile/${t.user_id}`} className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3 hover:border-foreground/20 transition-colors">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>
                    {(t.display_name || t.full_name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t.display_name || t.full_name}</p>
                    <p className="text-xs text-muted-foreground">{t.skills?.[0] || "General"}{t.university ? ` · ${t.university}` : ""}</p>
                  </div>
                  <Badge className={`${tier.bg} ${tier.color} border-none text-[10px]`}>{tier.label}</Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {consultations.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Upcoming Consultations</h3>
          <div className="space-y-3">
            {consultations.filter((c: any) => c.status !== "Completed").slice(0, 3).map((c: any) => (
              <div key={c.id} className="flex items-center gap-4 rounded-lg bg-surface-1 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-court-blue/10">
                  <Video size={20} className="text-court-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.topic}</p>
                  <p className="text-xs text-muted-foreground">with {c.expert_name}{c.scheduled_date ? ` · ${c.scheduled_date}` : ""}</p>
                </div>
                <div className="text-right">
                  <Badge className={c.status === "Scheduled" ? "bg-skill-green/10 text-skill-green border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{c.status}</Badge>
                  <p className="text-xs font-bold text-badge-gold mt-1">{c.sp_cost} SP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══ TALENT POOL ═══ */
const TalentPoolTab = ({ talentPool }: { talentPool: any[] }) => {
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("All");

  const allSkills = ["All", ...new Set(talentPool.flatMap((t: any) => t.skills || []).slice(0, 10))];
  const filtered = talentPool.filter((t: any) =>
    (filterSkill === "All" || (t.skills || []).includes(filterSkill)) &&
    ((t.full_name || "").toLowerCase().includes(search.toLowerCase()) || (t.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Talent Pool</h2>
          <p className="text-sm text-muted-foreground">Browse verified experts</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search talent..." className="h-9 w-48 rounded-lg border border-border bg-surface-1 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {allSkills.slice(0, 8).map((skill) => (
          <button key={skill} onClick={() => setFilterSkill(skill as string)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterSkill === skill ? 'bg-foreground text-background' : 'bg-surface-1 text-muted-foreground hover:text-foreground'}`}>
            {skill as string}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t: any) => {
          const tier = eloTier(t.elo);
          return (
            <Link key={t.user_id} to={`/profile/${t.user_id}`}>
              <motion.div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tier.bg} font-mono text-lg font-bold ${tier.color}`}>
                      {(t.display_name || t.full_name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{t.display_name || t.full_name}</h3>
                        {t.id_verified && <Shield size={12} className="text-court-blue" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{t.skills?.[0] || "General"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${tier.bg} ${tier.color} border-none text-[10px]`}>{tier.label}</Badge>
                        {t.university && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><GraduationCap size={10} /> {t.university}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="rounded-lg bg-surface-1 p-2"><p className="text-xs font-bold text-foreground">{t.elo}</p><p className="text-[9px] text-muted-foreground">ELO</p></div>
                    <div className="rounded-lg bg-surface-1 p-2"><p className="text-xs font-bold text-foreground">{t.total_gigs_completed || 0}</p><p className="text-[9px] text-muted-foreground">Projects</p></div>
                    <div className="rounded-lg bg-surface-1 p-2"><p className="text-xs font-bold text-badge-gold">{t.sp}</p><p className="text-[9px] text-muted-foreground">SP</p></div>
                  </div>
                  <Badge className={t.availability === "Available" ? "bg-skill-green/10 text-skill-green border-none" : "bg-surface-2 text-muted-foreground border-none"}>
                    {t.availability || "Unknown"}
                  </Badge>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No talent found</p>}
    </div>
  );
};

/* ═══ PROJECTS ═══ */
const ProjectsTab = ({ projects }: { projects: any[] }) => {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createProject = async () => {
    if (!user) return;
    setCreating(true);
    const { error } = await supabase.from("enterprise_projects").insert({
      name: "New Project", user_id: user.id, description: "New enterprise project", status: "Planning",
    });
    if (error) toast.error("Failed to create project");
    else { toast.success("Project created"); window.location.reload(); }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Projects</h2>
        <button onClick={createProject} disabled={creating} className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-50">
          <Plus size={14} /> New Project
        </button>
      </div>
      <div className="space-y-4">
        {projects.map((p: any) => (
          <motion.div key={p.id} className="rounded-2xl border border-border bg-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className={p.status === "Completed" ? "bg-skill-green/10 text-skill-green border-none" : p.status === "In Progress" ? "bg-court-blue/10 text-court-blue border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{p.status}</Badge>
                  {p.deadline && <span className="text-xs text-muted-foreground">Due: {p.deadline}</span>}
                </div>
              </div>
              <Badge className={p.priority === "high" ? "bg-alert-red/10 text-alert-red border-none" : "bg-surface-2 text-muted-foreground border-none"}>{p.priority}</Badge>
            </div>
            <Progress value={p.progress} className="h-2 mb-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span><Users size={10} className="inline mr-1" />{p.team_size} members</span>
              <span className="text-badge-gold"><Coins size={10} className="inline mr-1" />{p.budget} SP budget</span>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && <div className="py-16 text-center text-muted-foreground"><Briefcase size={32} className="mx-auto mb-3 opacity-30" /><p>No projects yet. Create your first one!</p></div>}
      </div>
    </div>
  );
};

/* ═══ HIRING ═══ */
const HiringTab = ({ candidates }: { candidates: any[] }) => (
  <div className="space-y-6">
    <h2 className="font-heading text-2xl font-bold text-foreground">Hiring Pipeline</h2>
    <div className="grid gap-4">
      {candidates.map((c: any) => (
        <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{c.role || "Role"}</h3>
              <p className="text-xs text-muted-foreground">Posted {new Date(c.posted_at).toLocaleDateString()}</p>
            </div>
            <Badge className={c.urgency === "urgent" ? "bg-alert-red/10 text-alert-red border-none" : "bg-surface-2 text-muted-foreground border-none"}>{c.urgency}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Layers size={12} /> Stage: {c.stage}</span>
          </div>
        </div>
      ))}
      {candidates.length === 0 && <div className="py-16 text-center text-muted-foreground"><UserPlus size={32} className="mx-auto mb-3 opacity-30" /><p>No hiring activity yet</p></div>}
    </div>
  </div>
);

/* ═══ CONSULTATIONS ═══ */
const ConsultationsTab = ({ consultations }: { consultations: any[] }) => (
  <div className="space-y-6">
    <h2 className="font-heading text-2xl font-bold text-foreground">Consultations</h2>
    <div className="space-y-4">
      {consultations.map((c: any) => (
        <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-court-blue/10"><Video size={20} className="text-court-blue" /></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{c.topic}</p>
            <p className="text-xs text-muted-foreground">with {c.expert_name}{c.scheduled_date ? ` · ${c.scheduled_date}` : ""}{c.scheduled_time ? ` at ${c.scheduled_time}` : ""}</p>
          </div>
          <div className="text-right">
            <Badge className={c.status === "Scheduled" ? "bg-skill-green/10 text-skill-green border-none" : "bg-badge-gold/10 text-badge-gold border-none"}>{c.status}</Badge>
            <p className="text-xs font-bold text-badge-gold mt-1">{c.sp_cost} SP</p>
          </div>
        </div>
      ))}
      {consultations.length === 0 && <div className="py-16 text-center text-muted-foreground"><MessageSquare size={32} className="mx-auto mb-3 opacity-30" /><p>No consultations yet</p></div>}
    </div>
  </div>
);

/* ═══ SIDEBAR ═══ */
const EnterpriseSidebar = ({ activeTab, setActiveTab, profile }: any) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-court-blue/10"><Building2 size={18} className="text-court-blue" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || "Enterprise"}</p>
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
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const { projects, candidates, consultations, talentPool, loading } = useEnterpriseDash();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    // Check enterprise access: must have 'enterprise' or 'admin' role, or be in enterprise_members
    const checkAccess = async () => {
      if (!user) return;
      const [{ data: roleData }, { data: memberData }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).in("role", ["enterprise", "admin"]),
        supabase.from("enterprise_members").select("id").eq("user_id", user.id).limit(1),
      ]);
      setHasAccess((roleData && roleData.length > 0) || (memberData && memberData.length > 0));
    };
    checkAccess();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (hasAccess === false) navigate("/403");
  }, [hasAccess, navigate]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      </PageTransition>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab projects={projects} candidates={candidates} consultations={consultations} talentPool={talentPool} profile={profile} />;
      case "talent-pool": return <TalentPoolTab talentPool={talentPool} />;
      case "projects": return <ProjectsTab projects={projects} />;
      case "hiring": return <HiringTab candidates={candidates} />;
      case "consultations": return <ConsultationsTab consultations={consultations} />;
      case "analytics": return <div className="py-20 text-center text-muted-foreground">Analytics coming soon...</div>;
      case "settings": return <div className="py-20 text-center text-muted-foreground">Enterprise settings coming soon...</div>;
      default: return <OverviewTab projects={projects} candidates={candidates} consultations={consultations} talentPool={talentPool} profile={profile} />;
    }
  };

  return (
    <PageTransition>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <EnterpriseSidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="font-heading text-lg font-bold text-foreground capitalize">{activeTab.replace("-", " ")}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
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
