import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Code, MessageSquare, Shield, Bug, Flag, AlertTriangle,
  CheckCircle2, Clock, Zap, ArrowRight, HelpCircle, Video, FileText, Mail,
  Phone, Globe, Award, ExternalLink, ChevronDown, ChevronRight, Users,
  Lightbulb, Star, TrendingUp, Lock, Eye, Cpu, Headphones, LifeBuoy,
  Sparkles, Target, Gift, BookMarked, Layers, Play, Terminal, Copy,
  ThumbsUp, ThumbsDown, Send, Bot, Wrench, GraduationCap, Rocket,
  Activity, Server, Database, Wifi, WifiOff, BarChart3, RefreshCw,
  AlertCircle, MonitorSmartphone, XCircle, CircleDot, Hash, Fingerprint,
  ShieldCheck, Upload, Paperclip, ChevronUp, Monitor, Smartphone, Laptop,
  HardDrive, Cloud, Timer, TrendingDown, Package, Settings, Key
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { logFormSubmission, logInteraction, logPageView } from "@/lib/activity-logger";

const kbCategories = [
  { icon: BookOpen, title: "Getting Started", desc: "Account setup, profile creation, and first gig", articles: 24, popular: ["Create your account", "Set up your profile", "Post your first gig", "Earn your first SP"] },
  { icon: Zap, title: "Skill Points", desc: "Earning, spending, taxation, and packages", articles: 18, popular: ["How SP works", "Tax brackets explained", "Buy SP packages", "Transfer limits"] },
  { icon: MessageSquare, title: "Gig Workspace", desc: "Messenger, whiteboard, video, and files", articles: 31, popular: ["Start a video call", "Use the whiteboard", "Share files securely", "AI assistant tips"] },
  { icon: Shield, title: "Skill Court", desc: "Disputes, judging, verdicts, and appeals", articles: 12, popular: ["File a dispute", "Become a judge", "Appeal a verdict", "Evidence guidelines"] },
  { icon: HelpCircle, title: "Account & Settings", desc: "Privacy, notifications, data export", articles: 15, popular: ["Two-factor auth", "Export your data", "Delete account", "Notification prefs"] },
  { icon: Video, title: "Video Tutorials", desc: "Step-by-step visual guides", articles: 9, popular: ["Platform tour", "Gig walkthrough", "Court demo", "Guild setup"] },
  { icon: Users, title: "Guilds & Teams", desc: "Create, manage, and grow your guild", articles: 21, popular: ["Create a guild", "Invite members", "Guild treasury", "Rank system"] },
  { icon: Globe, title: "Marketplace", desc: "Browsing, filtering, and gig discovery", articles: 16, popular: ["Search filters", "Category tags", "Save favorites", "Gig analytics"] },
  { icon: Lock, title: "Security & Privacy", desc: "Protecting your account and data", articles: 13, popular: ["Password security", "Session management", "Data encryption", "Report abuse"] },
];

const apiEndpoints = [
  { method: "GET", path: "/api/v1/gigs", desc: "List all gigs with filters", auth: "API Key" },
  { method: "POST", path: "/api/v1/gigs", desc: "Create a new gig", auth: "Bearer Token" },
  { method: "GET", path: "/api/v1/users/:id", desc: "Get user profile", auth: "API Key" },
  { method: "GET", path: "/api/v1/transactions/:code", desc: "Lookup transaction", auth: "Bearer Token" },
  { method: "POST", path: "/api/v1/court/cases", desc: "File a dispute", auth: "Bearer Token" },
  { method: "GET", path: "/api/v1/guilds", desc: "List guilds with rankings", auth: "API Key" },
  { method: "POST", path: "/api/v1/messages", desc: "Send a workspace message", auth: "Bearer Token" },
  { method: "GET", path: "/api/v1/sp/balance", desc: "Get SP balance & history", auth: "Bearer Token" },
];

const services = [
  { name: "Marketplace", status: "operational", uptime: 99.98, latency: "42ms", icon: Package, region: "Global" },
  { name: "Messenger", status: "operational", uptime: 99.95, latency: "18ms", icon: MessageSquare, region: "US-East, EU-West" },
  { name: "Video Calls", status: "degraded", uptime: 99.90, latency: "65ms", icon: Video, region: "Global" },
  { name: "Skill Court", status: "operational", uptime: 99.99, latency: "31ms", icon: Shield, region: "US-East" },
  { name: "API Gateway", status: "operational", uptime: 99.97, latency: "12ms", icon: Server, region: "Multi-region" },
  { name: "SP Payments", status: "operational", uptime: 99.99, latency: "89ms", icon: Zap, region: "Global" },
  { name: "File Storage", status: "operational", uptime: 99.96, latency: "55ms", icon: HardDrive, region: "US-East, AP-South" },
  { name: "Auth Service", status: "operational", uptime: 99.99, latency: "8ms", icon: Key, region: "Global" },
  { name: "Search & Index", status: "operational", uptime: 99.94, latency: "35ms", icon: Search, region: "US-East" },
  { name: "Notifications", status: "operational", uptime: 99.92, latency: "22ms", icon: Activity, region: "Global" },
  { name: "CDN / Assets", status: "operational", uptime: 99.99, latency: "6ms", icon: Cloud, region: "200+ PoPs" },
  { name: "Database", status: "operational", uptime: 99.99, latency: "3ms", icon: Database, region: "US-East (primary)" },
];

const bountyTiers = [
  { severity: "Critical", reward: "500 SP + Diamond Badge", examples: "Auth bypass, data exposure, RCE", color: "destructive" },
  { severity: "High", reward: "200 SP + Gold Badge", examples: "XSS, CSRF, privilege escalation", color: "alert-red" },
  { severity: "Medium", reward: "50 SP + Badge", examples: "Info disclosure, rate limiting bypass", color: "badge-gold" },
  { severity: "Low", reward: "10 SP", examples: "UI bugs, minor issues, typos", color: "muted-foreground" },
];

const quickActions = [
  { icon: Rocket, label: "Post a Gig", desc: "List your skill on the marketplace" },
  { icon: Users, label: "Find a Swapper", desc: "Browse available skill providers" },
  { icon: Shield, label: "Open a Dispute", desc: "File a case in Skill Court" },
  { icon: Zap, label: "Buy Skill Points", desc: "Top up your SP balance" },
  { icon: GraduationCap, label: "Join a Guild", desc: "Find your community" },
  { icon: Wrench, label: "Account Settings", desc: "Manage your profile & privacy" },
];

const communityResources = [
  { icon: BookMarked, title: "Developer Blog", desc: "Technical deep-dives, architecture decisions, and platform updates", tag: "Weekly" },
  { icon: Video, title: "Webinar Archive", desc: "Recorded sessions on advanced features, tips, and community showcases", tag: "Monthly" },
  { icon: Users, title: "Community Forum", desc: "Ask questions, share experiences, and connect with other swappers", tag: "Active" },
  { icon: FileText, title: "Platform Changelog", desc: "Detailed release notes for every update, patch, and new feature", tag: "Bi-weekly" },
  { icon: GraduationCap, title: "Skill Academy", desc: "Free courses on maximizing your SkillSwappr experience", tag: "New" },
  { icon: Star, title: "Ambassador Program", desc: "Become a community leader and earn exclusive rewards", tag: "Apply" },
];

const troubleshootingGuides = [
  {
    category: "Account & Login",
    icon: Key,
    color: "court-blue",
    issues: [
      { issue: "Can't log in to my account", steps: ["Clear browser cache & cookies", "Try incognito/private mode", "Reset password via email link", "Check if account is suspended (check email for notices)", "Try a different browser or device", "Disable browser extensions temporarily", "Contact support with your error code & screenshot"] },
      { issue: "Two-factor authentication not working", steps: ["Ensure your device clock is synced (auto time)", "Try backup codes from initial setup", "Check if authenticator app needs updating", "Clear authenticator app cache", "Contact support with your account email for manual reset"] },
      { issue: "Account locked or suspended", steps: ["Check your email for suspension notice with reason", "Review platform Terms of Service for violations", "Submit appeal via the Account Recovery form", "Provide any requested verification documents", "Allow 48-72 hours for review"] },
      { issue: "Email verification link expired", steps: ["Request new verification email from login page", "Check spam/junk folder", "Add noreply@skillswappr.com to safe senders", "Try with a different email if original is unreachable", "Contact support if issue persists after 3 attempts"] },
    ],
  },
  {
    category: "Skill Points & Transactions",
    icon: Zap,
    color: "badge-gold",
    issues: [
      { issue: "SP not received after completing a gig", steps: ["Wait up to 10 minutes for processing", "Check transaction history in Dashboard → SP tab", "Verify gig completion was confirmed by both parties", "Check for pending disputes blocking release", "Look for SP in 'Pending' balance vs 'Available'", "Contact support with Gig ID and Transaction Code"] },
      { issue: "SP transfer failed", steps: ["Verify recipient username/ID is correct", "Check your available balance (pending SP can't be transferred)", "Ensure you haven't hit daily transfer limits", "Check if recipient account is in good standing", "Try a smaller amount to test", "Report with transaction reference number"] },
      { issue: "SP balance showing incorrectly", steps: ["Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)", "Clear local storage: Settings → Clear Cache", "Check for pending transactions that may be held", "Review recent tax deductions in SP History", "Compare with email transaction receipts", "Report discrepancy with screenshots of expected vs actual"] },
    ],
  },
  {
    category: "Gig Workspace Issues",
    icon: MessageSquare,
    color: "skill-green",
    issues: [
      { issue: "Video call failing or poor quality", steps: ["Check camera/mic permissions in browser settings", "Test internet speed — minimum 5 Mbps recommended", "Close other tabs and applications using bandwidth", "Try a different browser (Chrome/Firefox recommended)", "Disable VPN or proxy connections", "Update browser to latest version", "Switch to audio-only mode if video keeps dropping", "Use the built-in connection test at Settings → Diagnostics"] },
      { issue: "Files not uploading", steps: ["Check file size — max 50MB per file", "Verify file format is supported (see docs for list)", "Clear browser cache and retry", "Try drag-and-drop instead of file picker (or vice versa)", "Check if storage quota is reached (Dashboard → Storage)", "Disable content blockers or ad-block extensions", "Try uploading from a different network"] },
      { issue: "Whiteboard not loading", steps: ["Ensure WebGL is enabled in your browser", "Update your graphics drivers", "Try a Chromium-based browser (Chrome, Edge, Brave)", "Clear browser cache specifically for SkillSwappr", "Disable hardware acceleration in browser settings", "Check if your device meets minimum requirements"] },
      { issue: "Messages not sending or delayed", steps: ["Check your internet connection", "Refresh the workspace page", "Check if the other party has blocked you", "Verify the gig workspace is still active (not archived)", "Try sending from a different device", "Report with workspace ID and timestamp of failed messages"] },
    ],
  },
  {
    category: "Skill Court & Disputes",
    icon: Shield,
    color: "alert-red",
    issues: [
      { issue: "Dispute not being processed", steps: ["Verify all required evidence has been uploaded", "Check if dispute is within the 14-day filing window", "Ensure case description meets minimum 100 character requirement", "Confirm the gig is eligible for disputes (some formats exempt)", "Check for missing required fields in your submission", "Wait 24-48 hours for initial review — cases queue during peak times"] },
      { issue: "Want to appeal a verdict", steps: ["Appeals must be filed within 7 days of verdict", "Navigate to Skill Court → My Cases → Appeal", "Provide new evidence not included in original case", "Appeal fee is 25 SP (refunded if appeal succeeds)", "Appeals are reviewed by a different panel of judges", "Final verdict after appeal is binding"] },
    ],
  },
  {
    category: "Profile & Visibility",
    icon: Eye,
    color: "foreground",
    issues: [
      { issue: "Gig not appearing in search", steps: ["Verify gig status is 'Published' not 'Draft'", "Check that all required fields are filled", "Ensure gig doesn't violate content guidelines", "Allow up to 30 minutes for search indexing", "Add relevant category tags and keywords", "Complete your profile to 80%+ for better visibility", "Check if gig is restricted to certain regions"] },
      { issue: "Profile changes not saving", steps: ["Check internet connection", "Ensure all fields meet validation requirements", "Try a different browser", "Clear cache and re-login", "Check for special characters causing issues", "Contact support if error persists after multiple attempts"] },
    ],
  },
  {
    category: "Browser & Device",
    icon: Monitor,
    color: "court-blue",
    issues: [
      { issue: "Page not loading or blank screen", steps: ["Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)", "Clear browser cache and cookies for skillswappr.com", "Disable all browser extensions and test", "Try incognito/private browsing mode", "Check browser console for errors (F12 → Console tab)", "Ensure JavaScript is enabled", "Try Chrome, Firefox, or Edge (latest versions)", "Check our Status Page for ongoing outages"] },
      { issue: "Mobile app issues", steps: ["Update to the latest app version", "Clear app cache: Settings → Storage → Clear Cache", "Force close and reopen the app", "Check OS compatibility (iOS 15+ / Android 11+)", "Uninstall and reinstall the app", "Try the mobile web version instead", "Report with device model and OS version"] },
    ],
  },
];

const slaMetrics = [
  { metric: "Email Response", free: "48h", pro: "24h", enterprise: "4h" },
  { metric: "Live Chat", free: "—", pro: "Business hours", enterprise: "24/7" },
  { metric: "Phone Support", free: "—", pro: "—", enterprise: "Dedicated" },
  { metric: "Bug Fix Priority", free: "Standard", pro: "Elevated", enterprise: "Critical" },
  { metric: "Uptime SLA", free: "99.5%", pro: "99.9%", enterprise: "99.99%" },
  { metric: "Data Recovery", free: "Best effort", pro: "24h RPO", enterprise: "1h RPO" },
];

const recentIncidents = [
  { date: "Mar 7, 2026", title: "Video call CDN optimization rollout", duration: "Ongoing", status: "Monitoring", severity: "minor" },
  { date: "Mar 5, 2026", title: "Messenger latency spike — EU region", duration: "12 min", status: "Resolved", severity: "minor" },
  { date: "Feb 28, 2026", title: "Scheduled maintenance — Database migration v4.2", duration: "45 min", status: "Completed", severity: "maintenance" },
  { date: "Feb 15, 2026", title: "Video call CDN degradation — AP-South", duration: "28 min", status: "Resolved", severity: "minor" },
  { date: "Feb 2, 2026", title: "Search indexing delay — new gigs", duration: "2h 15m", status: "Resolved", severity: "major" },
  { date: "Jan 20, 2026", title: "Scheduled maintenance — Auth service upgrade", duration: "15 min", status: "Completed", severity: "maintenance" },
];

const uptimeHistory = [
  { month: "Mar", pct: 99.96 },
  { month: "Feb", pct: 99.97 },
  { month: "Jan", pct: 99.98 },
  { month: "Dec", pct: 99.99 },
  { month: "Nov", pct: 99.95 },
  { month: "Oct", pct: 99.98 },
  { month: "Sep", pct: 99.97 },
  { month: "Aug", pct: 99.99 },
  { month: "Jul", pct: 99.94 },
  { month: "Jun", pct: 99.98 },
  { month: "May", pct: 99.99 },
  { month: "Apr", pct: 99.97 },
];

const reportTypes = [
  { value: "user", label: "Report a User", icon: Users, desc: "Harassment, scam, impersonation" },
  { value: "gig", label: "Report a Gig", icon: Package, desc: "Fake listing, misleading content" },
  { value: "guild", label: "Report a Guild", icon: Shield, desc: "Rule violations, toxic behavior" },
  { value: "bug", label: "Report a Bug", icon: Bug, desc: "Something isn't working correctly" },
  { value: "safety", label: "Safety Concern", icon: AlertTriangle, desc: "Threats, illegal activity" },
  { value: "other", label: "Other Issue", icon: HelpCircle, desc: "Anything else we should know" },
];

const priorityLevels = [
  { value: "low", label: "Low", desc: "Minor issue, not urgent", color: "text-muted-foreground", bg: "bg-surface-2" },
  { value: "medium", label: "Medium", desc: "Needs attention soon", color: "text-badge-gold", bg: "bg-badge-gold/10" },
  { value: "high", label: "High", desc: "Urgent issue", color: "text-alert-red", bg: "bg-alert-red/10" },
  { value: "critical", label: "Critical", desc: "Safety risk / blocking", color: "text-destructive", bg: "bg-destructive/10" },
];

interface HelpArticle {
  id: string;
  category: string;
  title: string;
  slug: string;
  excerpt: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: string;
  uptime: number;
  latency: string;
  icon: string;
  region: string;
}

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  duration: string;
  started_at: string;
}

const iconLookup: Record<string, any> = {
  Package, MessageSquare, Video, Shield, Server, Zap, HardDrive, Key, Search, Activity, Cloud, Database,
};

const HelpPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedKb, setExpandedKb] = useState<number | null>(null);
  const [expandedTroubleshootCat, setExpandedTroubleshootCat] = useState<number | null>(0);
  const [expandedTroubleshootIssue, setExpandedTroubleshootIssue] = useState<string | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<number | null>(null);
  const [bountyCode, setBountyCode] = useState("");
  const [bountyResult, setBountyResult] = useState<null | { code: string; title: string; severity: string; status: string; reward: string } | "not_found">(null);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportRef, setReportRef] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportFiles, setReportFiles] = useState<string[]>([]);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [statusTab, setStatusTab] = useState<"services" | "incidents" | "uptime">("services");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Backend-driven state
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [liveServices, setLiveServices] = useState<ServiceStatus[]>([]);
  const [liveIncidents, setLiveIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [articlesRes, servicesRes, incidentsRes] = await Promise.all([
        supabase.from("help_articles").select("id, category, title, slug, excerpt").order("category"),
        supabase.from("service_status").select("*").order("name"),
        supabase.from("service_incidents").select("*").order("started_at", { ascending: false }).limit(10),
      ]);
      if (articlesRes.data) setHelpArticles(articlesRes.data as any);
      if (servicesRes.data) setLiveServices(servicesRes.data as any);
      if (incidentsRes.data) setLiveIncidents(incidentsRes.data as any);
    };
    loadData();
  }, []);

  // Group articles by category
  const articlesByCategory = helpArticles.reduce<Record<string, HelpArticle[]>>((acc, a) => {
    (acc[a.category] = acc[a.category] || []).push(a);
    return acc;
  }, {});

  // Use live services if available, fall back to hardcoded
  const activeServices = liveServices.length > 0 ? liveServices : services.map(s => ({ ...s, id: s.name })) as any;
  const activeIncidents = liveIncidents.length > 0 ? liveIncidents : recentIncidents.map((inc, i) => ({ ...inc, id: String(i), started_at: inc.date })) as any;

  const handleCopy = (path: string, idx: number) => {
    navigator.clipboard.writeText(path);
    setCopiedEndpoint(idx);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleBountyLookup = async () => {
    if (!bountyCode.trim()) return;
    logInteraction("bounty_lookup", { code: bountyCode.toUpperCase().trim() });
    const { data, error } = await supabase
      .from("bug_bounty_submissions")
      .select("code, title, severity, status, reward")
      .eq("code", bountyCode.toUpperCase().trim())
      .maybeSingle();
    if (data) {
      setBountyResult(data as any);
      logInteraction("bounty_lookup_found", { code: data.code, severity: data.severity, status: data.status });
    } else {
      setBountyResult("not_found");
      logInteraction("bounty_lookup_not_found", { code: bountyCode.toUpperCase().trim() });
    }
  };

  const handleFeedback = async (rating: string) => {
    await supabase.from("help_feedback").insert({
      rating,
      user_id: user?.id || null,
    });
    logFormSubmission("help_feedback", { rating }, "help_feedback");
    setFeedbackSent(true);
  };

  const handleReportSubmit = async () => {
    if (!selectedReportType || !reportDescription.trim()) return;

    const { data } = await supabase.from("help_reports").insert({
      user_id: user?.id || null,
      report_type: selectedReportType,
      priority: selectedPriority || "low",
      description: reportDescription,
      reference_id: reportRef || null,
      email: reportEmail || null,
    }).select("id").single();

    logFormSubmission("help_report", { report_type: selectedReportType, priority: selectedPriority || "low", has_reference: !!reportRef, description_length: reportDescription.length }, "help_report", data?.id);

    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 5000);
  };

  const operationalCount = activeServices.filter((s: any) => s.status === "operational").length;
  const degradedCount = activeServices.filter((s: any) => s.status === "degraded").length;
  const overallStatus = degradedCount === 0 ? "All Systems Operational" : `${degradedCount} Service${degradedCount > 1 ? "s" : ""} Degraded`;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--court-blue)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
              <LifeBuoy size={12} /> Help & Support Center
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
              How can we help?
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 text-lg text-muted-foreground">
              Search our knowledge base, troubleshoot issues, explore API docs, and reach our support team.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative mx-auto max-w-xl">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search help articles, docs, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-card pr-5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                style={{ paddingLeft: "3.25rem" }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Help Articles", value: "160+" },
                { label: "Avg Response", value: "<4h" },
                { label: "Satisfaction", value: "98.2%" },
                { label: "Uptime", value: "99.97%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                  <p className="font-mono text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Quick Actions</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {quickActions.map((a, i) => (
                <motion.button
                  key={a.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-foreground/20 hover:bg-surface-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                    <a.icon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{a.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{a.desc}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Base */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground">Knowledge Base</h2>
              <span className="text-xs text-muted-foreground">{helpArticles.length || "160+"}  articles across {kbCategories.length} categories</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kbCategories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group cursor-pointer rounded-2xl border border-border bg-card transition-all hover:border-foreground/20"
                >
                  <div className="p-6" onClick={() => setExpandedKb(expandedKb === i ? null : i)}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground transition-colors group-hover:text-foreground">
                        <cat.icon size={20} />
                      </div>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expandedKb === i ? "rotate-180" : ""}`} />
                    </div>
                    <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{cat.title}</h3>
                    <p className="mb-3 text-xs text-muted-foreground">{cat.desc}</p>
                    <span className="text-[10px] text-muted-foreground/60">{(articlesByCategory[cat.title] || []).length || cat.articles} articles</span>
                  </div>
                  <AnimatePresence>
                    {expandedKb === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border/50">
                        <div className="p-4 space-y-1.5">
                          <p className="text-[10px] font-semibold text-muted-foreground mb-2">Popular Articles</p>
                          {(articlesByCategory[cat.title] || []).length > 0 ? (
                            (articlesByCategory[cat.title] || []).slice(0, 4).map((article) => (
                              <div key={article.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-surface-2 cursor-pointer transition-colors" title={article.excerpt}>
                                <FileText size={12} className="text-muted-foreground shrink-0" />
                                {article.title}
                                <ArrowRight size={10} className="ml-auto text-muted-foreground" />
                              </div>
                            ))
                          ) : (
                            cat.popular.map((article) => (
                              <div key={article} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-surface-2 cursor-pointer transition-colors">
                                <FileText size={12} className="text-muted-foreground shrink-0" />
                                {article}
                                <ArrowRight size={10} className="ml-auto text-muted-foreground" />
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ENHANCED Troubleshooting Guide ═══ */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-badge-gold/10">
                <Wrench size={24} className="text-badge-gold" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Troubleshooting Guide</h2>
                <p className="text-sm text-muted-foreground mt-1">In-depth step-by-step solutions organized by category</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
              {/* Category sidebar */}
              <div className="space-y-1.5 lg:sticky lg:top-24 lg:self-start">
                {troubleshootingGuides.map((cat, ci) => (
                  <button
                    key={cat.category}
                    onClick={() => { setExpandedTroubleshootCat(ci); setExpandedTroubleshootIssue(null); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                      expandedTroubleshootCat === ci
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                    }`}
                  >
                    <cat.icon size={16} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold block truncate">{cat.category}</span>
                      <span className={`text-[10px] ${expandedTroubleshootCat === ci ? "text-background/60" : "text-muted-foreground/60"}`}>{cat.issues.length} guides</span>
                    </div>
                    <ChevronRight size={12} className={expandedTroubleshootCat === ci ? "text-background/60" : ""} />
                  </button>
                ))}
              </div>

              {/* Issue details */}
              <div className="space-y-3">
                {expandedTroubleshootCat !== null && troubleshootingGuides[expandedTroubleshootCat].issues.map((t, ti) => (
                  <motion.div
                    key={t.issue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ti * 0.05 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedTroubleshootIssue(expandedTroubleshootIssue === t.issue ? null : t.issue)}
                      className="flex w-full items-center justify-between p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-${troubleshootingGuides[expandedTroubleshootCat!].color}/10`}>
                          <AlertTriangle size={15} className={`text-${troubleshootingGuides[expandedTroubleshootCat!].color}`} />
                        </div>
                        <span className="font-heading text-sm font-bold text-foreground text-left">{t.issue}</span>
                      </div>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform shrink-0 ml-3 ${expandedTroubleshootIssue === t.issue ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {expandedTroubleshootIssue === t.issue && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border/50"
                        >
                          <div className="p-5 space-y-3">
                            {t.steps.map((step, si) => (
                              <div key={si} className="flex items-start gap-3">
                                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                                  si === t.steps.length - 1 ? "bg-court-blue/10 text-court-blue" : "bg-surface-2 text-muted-foreground"
                                }`}>{si + 1}</span>
                                <span className="text-xs text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                              </div>
                            ))}
                            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border/30">
                              <span className="text-[10px] text-muted-foreground">Still stuck?</span>
                              <button className="text-[10px] font-semibold text-court-blue hover:underline">Contact Support →</button>
                              <span className="text-[10px] text-muted-foreground">•</span>
                              <button className="text-[10px] font-semibold text-badge-gold hover:underline">View related articles →</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Docs */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={24} className="text-court-blue" />
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">API Documentation</h2>
                  <p className="text-xs text-muted-foreground mt-1">RESTful API v1 — Rate limit: 1000 req/min</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Full Docs <ExternalLink size={14} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border/50 bg-surface-1 px-6 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">BASE URL: https://api.skillswappr.com</span>
                <span className="rounded-full bg-skill-green/10 px-2.5 py-0.5 text-[10px] font-semibold text-skill-green">v1.4.2</span>
              </div>
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0 hover:bg-surface-1 transition-colors group">
                  <span className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold ${ep.method === "GET" ? "bg-skill-green/10 text-skill-green" : "bg-court-blue/10 text-court-blue"}`}>{ep.method}</span>
                  <code className="flex-1 font-mono text-sm text-foreground">{ep.path}</code>
                  <span className="hidden sm:block rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">{ep.auth}</span>
                  <span className="text-xs text-muted-foreground">{ep.desc}</span>
                  <button onClick={() => handleCopy(ep.path, i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedEndpoint === i ? <CheckCircle2 size={14} className="text-skill-green" /> : <Copy size={14} className="text-muted-foreground hover:text-foreground" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["JavaScript", "Python", "Go", "Ruby", "PHP", "cURL"].map((sdk) => (
                <span key={sdk} className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/20 cursor-pointer transition-colors">{sdk}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & SLA */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">Contact & Support</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Mail, title: "Email Support", desc: "support@skillswappr.com", sub: "Response within 24 hours", accent: "court-blue" },
                { icon: MessageSquare, title: "Live Chat", desc: "Available Mon–Fri 9am–6pm", sub: "Premium & Enterprise", accent: "skill-green" },
                { icon: Phone, title: "Phone Support", desc: "Enterprise clients only", sub: "Dedicated account manager", accent: "badge-gold" },
              ].map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6 text-center hover:border-foreground/20 transition-all">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-${c.accent}/10`}>
                    <c.icon size={22} className={`text-${c.accent}`} />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">{c.sub}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border/50 bg-surface-1 px-6 py-3">
                <span className="font-heading text-xs font-bold text-foreground">Service Level Agreement (SLA) by Plan</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground">Metric</th>
                      <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground">Free</th>
                      <th className="px-6 py-3 text-[10px] font-semibold text-muted-foreground">Pro</th>
                      <th className="px-6 py-3 text-[10px] font-semibold text-badge-gold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slaMetrics.map((row) => (
                      <tr key={row.metric} className="border-b border-border/30 last:border-0 hover:bg-surface-1 transition-colors">
                        <td className="px-6 py-3 text-xs font-medium text-foreground">{row.metric}</td>
                        <td className="px-6 py-3 text-xs text-muted-foreground">{row.free}</td>
                        <td className="px-6 py-3 text-xs text-muted-foreground">{row.pro}</td>
                        <td className="px-6 py-3 text-xs font-semibold text-badge-gold">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ ENHANCED Platform Status & Operations ═══ */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            {/* Header with live indicator */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <span className={`absolute h-4 w-4 animate-ping rounded-full ${degradedCount > 0 ? "bg-badge-gold/40" : "bg-skill-green/40"}`} />
                  <span className={`relative h-2.5 w-2.5 rounded-full ${degradedCount > 0 ? "bg-badge-gold" : "bg-skill-green"}`} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{overallStatus}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Last checked: Just now · {operationalCount}/{activeServices.length} services operational</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-skill-green/10 px-3 py-1 text-[10px] font-semibold text-skill-green">99.97% overall uptime</span>
                <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw size={10} /> Refresh
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-xl bg-card border border-border p-1 w-fit">
              {([
                { key: "services", label: "Services", icon: Server },
                { key: "incidents", label: "Incidents", icon: AlertTriangle },
                { key: "uptime", label: "Uptime History", icon: BarChart3 },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(tab.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    statusTab === tab.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={12} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            {statusTab === "services" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeServices.map((s: any, i: number) => {
                  const IconComp = iconLookup[s.icon] || Server;
                  return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-border bg-card p-4 hover:border-foreground/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
                          <IconComp size={14} className="text-muted-foreground" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-foreground block">{s.name}</span>
                          <span className="text-[9px] text-muted-foreground/60">{s.region}</span>
                        </div>
                      </div>
                      {s.status === "operational" ? (
                        <CheckCircle2 size={14} className="text-skill-green" />
                      ) : (
                        <AlertCircle size={14} className="text-badge-gold" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold ${s.status === "operational" ? "text-skill-green" : "text-badge-gold"}`}>
                        {s.status === "operational" ? "Operational" : "Degraded Performance"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{s.latency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-surface-2">
                        <div className={`h-full rounded-full ${s.status === "operational" ? "bg-skill-green" : "bg-badge-gold"}`} style={{ width: `${Math.min(s.uptime, 100)}%` }} />
                      </div>
                      <span className="font-mono text-[9px] text-muted-foreground">{s.uptime}%</span>
                    </div>
                  </motion.div>
                ); })}
              </motion.div>
            )}

            {/* Incidents */}
            {statusTab === "incidents" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border/50 bg-surface-1 px-6 py-3 flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-foreground">Incident History — Last 90 Days</span>
                  <span className="text-[10px] text-muted-foreground">{activeIncidents.length} events</span>
                </div>
                <div className="divide-y divide-border/30">
                  {activeIncidents.map((inc: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between px-6 py-4 hover:bg-surface-1 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          inc.severity === "major" ? "bg-destructive/10" : inc.severity === "maintenance" ? "bg-court-blue/10" : "bg-badge-gold/10"
                        }`}>
                          {inc.severity === "maintenance" ? (
                            <Settings size={14} className="text-court-blue" />
                          ) : inc.severity === "major" ? (
                            <XCircle size={14} className="text-destructive" />
                          ) : (
                            <AlertTriangle size={14} className="text-badge-gold" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground block">{inc.title}</span>
                          <span className="text-[10px] text-muted-foreground">{inc.date || new Date(inc.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Duration: {inc.duration}</span>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
                        inc.status === "Monitoring" ? "bg-badge-gold/10 text-badge-gold" :
                        inc.status === "Resolved" ? "bg-skill-green/10 text-skill-green" :
                        "bg-court-blue/10 text-court-blue"
                      }`}>{inc.status}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Uptime History */}
            {statusTab === "uptime" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-sm font-bold text-foreground">12-Month Uptime History</h3>
                    <span className="text-[10px] text-muted-foreground">Avg: 99.97%</span>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {uptimeHistory.map((m, i) => {
                      const height = Math.max(((m.pct - 99.9) / 0.1) * 100, 10);
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="font-mono text-[8px] text-muted-foreground">{m.pct}%</span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className={`w-full rounded-t-md ${m.pct >= 99.97 ? "bg-skill-green" : m.pct >= 99.95 ? "bg-badge-gold" : "bg-alert-red"}`}
                          />
                          <span className="text-[9px] text-muted-foreground">{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-skill-green" /><span className="text-[9px] text-muted-foreground">≥99.97%</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-badge-gold" /><span className="text-[9px] text-muted-foreground">99.95–99.96%</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-alert-red" /><span className="text-[9px] text-muted-foreground">&lt;99.95%</span></div>
                  </div>
                </div>

                {/* Response time metrics */}
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Avg Response Time", value: "28ms", icon: Timer, trend: "-12%" },
                    { label: "P99 Latency", value: "142ms", icon: Activity, trend: "-8%" },
                    { label: "Error Rate", value: "0.02%", icon: XCircle, trend: "-15%" },
                    { label: "Throughput", value: "12.4K/s", icon: TrendingUp, trend: "+22%" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <m.icon size={14} className="text-muted-foreground" />
                        <span className="text-[9px] font-semibold text-skill-green">{m.trend}</span>
                      </div>
                      <p className="font-mono text-lg font-bold text-foreground">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Community & Resources */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Sparkles size={24} className="text-badge-gold" />
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Community & Resources</h2>
                <p className="text-xs text-muted-foreground mt-1">Learn, connect, and grow with the SkillSwappr community</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communityResources.map((r, i) => (
                <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground group-hover:text-foreground transition-colors"><r.icon size={18} /></div>
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{r.tag}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ENHANCED Bug Bounty + Code Lookup ═══ */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-badge-gold/10">
                <Bug size={24} className="text-badge-gold" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Bug Bounty Program</h2>
                <p className="text-sm text-muted-foreground mt-1">Help us keep SkillSwappr secure and earn rewards</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {[
                { label: "Total Paid", value: "12,400 SP" },
                { label: "Reports Resolved", value: "87" },
                { label: "Avg Resolution", value: "3.2 days" },
                { label: "Active Hunters", value: "142" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="font-mono text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tiers */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {bountyTiers.map((t, i) => (
                <motion.div key={t.severity} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-5">
                  <span className={`mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold ${
                    t.severity === "Critical" ? "bg-destructive/10 text-destructive" :
                    t.severity === "High" ? "bg-alert-red/10 text-alert-red" :
                    t.severity === "Medium" ? "bg-badge-gold/10 text-badge-gold" :
                    "bg-surface-2 text-muted-foreground"
                  }`}>{t.severity}</span>
                  <p className="mb-1 font-heading text-sm font-bold text-foreground">{t.reward}</p>
                  <p className="text-[10px] text-muted-foreground">{t.examples}</p>
                </motion.div>
              ))}
            </div>

            {/* Bug Bounty Code Lookup */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-badge-gold/20 bg-badge-gold/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint size={18} className="text-badge-gold" />
                <h3 className="font-heading text-sm font-bold text-foreground">Bug Bounty Code Lookup</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Enter your bounty report code to check the status of your submission.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. BB-2026-001"
                    value={bountyCode}
                    onChange={(e) => { setBountyCode(e.target.value); setBountyResult(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleBountyLookup()}
                    className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                  />
                </div>
                <motion.button
                  onClick={handleBountyLookup}
                  disabled={!bountyCode.trim()}
                  className="flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background disabled:opacity-40"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Search size={14} /> Lookup
                </motion.button>
              </div>
              <AnimatePresence>
                {bountyResult && bountyResult !== "not_found" && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-skill-green/20 bg-skill-green/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-skill-green" />
                      <span className="text-xs font-semibold text-skill-green">Report Found</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Code:</span> <span className="font-mono text-foreground">{bountyResult.code}</span></div>
                      <div><span className="text-muted-foreground">Status:</span> <span className="font-semibold text-badge-gold capitalize">{bountyResult.status}</span></div>
                      <div><span className="text-muted-foreground">Severity:</span> <span className="text-foreground capitalize">{bountyResult.severity}</span></div>
                      <div><span className="text-muted-foreground">Title:</span> <span className="text-foreground">{bountyResult.title}</span></div>
                      <div><span className="text-muted-foreground">Reward:</span> <span className="font-semibold text-badge-gold">{bountyResult.reward}</span></div>
                    </div>
                  </motion.div>
                )}
                {bountyResult === "not_found" && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-2">
                    <XCircle size={14} className="text-destructive shrink-0" />
                    <span className="text-xs text-destructive">No report found for code <span className="font-mono font-bold">{bountyCode}</span>. Double-check and try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bounty Rules */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 font-heading text-sm font-bold text-foreground">Program Rules</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Do not access other users' data",
                  "Report via our secure form only",
                  "Allow 72h before public disclosure",
                  "One report per vulnerability",
                  "No automated scanning without approval",
                  "Out of scope: social engineering, DoS",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-skill-green" />
                    <span className="text-xs text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ENHANCED Report an Issue ═══ */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <Flag size={20} className="text-destructive" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Report an Issue</h2>
                  <p className="text-xs text-muted-foreground">Help us keep the platform safe and fair</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {reportSubmitted ? (
                  <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-skill-green" />
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">Report Submitted</h3>
                    <p className="text-sm text-muted-foreground mb-1">Reference: <span className="font-mono font-bold text-foreground">RPT-2026-{Math.floor(Math.random() * 9000 + 1000)}</span></p>
                    <p className="text-xs text-muted-foreground">We'll review within 24-48 hours and follow up via email.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-5">
                    {/* Report Type */}
                    <div>
                      <p className="mb-2.5 text-xs font-semibold text-foreground">What are you reporting?</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {reportTypes.map((rt) => (
                          <button
                            key={rt.value}
                            onClick={() => setSelectedReportType(rt.value)}
                            className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                              selectedReportType === rt.value
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/20"
                            }`}
                          >
                            <rt.icon size={14} className={selectedReportType === rt.value ? "text-foreground" : "text-muted-foreground"} />
                            <div>
                              <span className={`text-[10px] font-semibold block ${selectedReportType === rt.value ? "text-foreground" : "text-muted-foreground"}`}>{rt.label}</span>
                              <span className="text-[9px] text-muted-foreground/60">{rt.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <p className="mb-2.5 text-xs font-semibold text-foreground">Priority level</p>
                      <div className="grid grid-cols-4 gap-2">
                        {priorityLevels.map((p) => (
                          <button
                            key={p.value}
                            onClick={() => setSelectedPriority(p.value)}
                            className={`rounded-xl border py-2.5 text-center transition-all ${
                              selectedPriority === p.value
                                ? `border-foreground ${p.bg}`
                                : "border-border hover:border-foreground/20"
                            }`}
                          >
                            <span className={`text-[10px] font-bold block ${selectedPriority === p.value ? p.color : "text-muted-foreground"}`}>{p.label}</span>
                            <span className="text-[8px] text-muted-foreground/60">{p.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reference & Email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Reference ID (gig, user, etc.)" value={reportRef} onChange={(e) => setReportRef(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" placeholder="Your email for follow-up" value={reportEmail} onChange={(e) => setReportEmail(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <textarea
                        placeholder="Describe the issue in detail — include what happened, when it occurred, and any steps to reproduce..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        maxLength={1000}
                        className="h-32 w-full rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none"
                      />
                      <p className="mt-1 text-right text-[9px] text-muted-foreground">{reportDescription.length}/1000</p>
                    </div>

                    {/* File upload */}
                    <div>
                      <p className="mb-2 text-xs font-semibold text-foreground flex items-center gap-1.5"><Paperclip size={12} /> Evidence & Attachments</p>
                      {reportFiles.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {reportFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-lg border border-skill-green/20 bg-skill-green/5 px-3 py-2">
                              <CheckCircle2 size={11} className="text-skill-green shrink-0" />
                              <span className="text-[10px] text-foreground flex-1 truncate">{f}</span>
                              <button onClick={() => setReportFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive"><XCircle size={11} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 transition-all hover:border-foreground/20 hover:bg-surface-1">
                        <Upload size={16} className="text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">Drag & drop or click to upload</p>
                          <p className="text-[9px] text-muted-foreground">Screenshots, logs, videos · Max 10MB each · Up to 5 files</p>
                        </div>
                        <input type="file" multiple className="hidden" onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setReportFiles(prev => [...prev, ...files.map(f => f.name)]);
                        }} />
                      </label>
                    </div>

                    {/* Submit */}
                    <motion.button
                      onClick={handleReportSubmit}
                      disabled={!selectedReportType || !reportDescription.trim()}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background disabled:opacity-40 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Send size={16} /> Submit Report
                    </motion.button>
                    <p className="text-center text-[9px] text-muted-foreground">Reports are reviewed within 24-48 hours. Urgent safety concerns are escalated immediately.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Feedback */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Lightbulb size={32} className="mx-auto mb-4 text-badge-gold" />
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Help Us Improve</h2>
            <p className="mb-8 text-sm text-muted-foreground">Was this help center useful? Share your feedback so we can make it even better.</p>
            {feedbackSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 rounded-2xl border border-skill-green/20 bg-skill-green/5 px-8 py-4">
                <CheckCircle2 size={20} className="text-skill-green" />
                <span className="text-sm font-medium text-skill-green">Thanks for your feedback!</span>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {[
                  { icon: ThumbsUp, label: "Very Helpful", color: "skill-green", value: "very_helpful" },
                  { icon: Star, label: "Somewhat Helpful", color: "badge-gold", value: "somewhat_helpful" },
                  { icon: ThumbsDown, label: "Needs Work", color: "alert-red", value: "needs_work" },
                ].map((fb) => (
                  <motion.button key={fb.label} onClick={() => handleFeedback(fb.value)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 hover:border-${fb.color}/30 transition-all`}>
                    <fb.icon size={20} className={`text-${fb.color}`} />
                    <span className="text-[10px] text-muted-foreground">{fb.label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HelpPage;
