import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Code, MessageSquare, Shield, Bug, Flag, AlertTriangle,
  CheckCircle2, Clock, Zap, ArrowRight, HelpCircle, Video, FileText, Mail,
  Phone, Globe, Award, ExternalLink, ChevronDown, ChevronRight, Users,
  Lightbulb, Star, TrendingUp, Lock, Eye, Cpu, Headphones, LifeBuoy,
  Sparkles, Target, Gift, BookMarked, Layers, Play, Terminal, Copy,
  ThumbsUp, ThumbsDown, Send, Bot, Wrench, GraduationCap, Rocket
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";


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
  { name: "Marketplace", status: "operational", uptime: 99.98, latency: "42ms" },
  { name: "Messenger", status: "operational", uptime: 99.95, latency: "18ms" },
  { name: "Video Calls", status: "operational", uptime: 99.90, latency: "65ms" },
  { name: "Skill Court", status: "operational", uptime: 99.99, latency: "31ms" },
  { name: "API Gateway", status: "operational", uptime: 99.97, latency: "12ms" },
  { name: "Payments", status: "operational", uptime: 99.99, latency: "89ms" },
  { name: "File Storage", status: "operational", uptime: 99.96, latency: "55ms" },
  { name: "Auth Service", status: "operational", uptime: 99.99, latency: "8ms" },
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

const troubleshootingSteps = [
  { issue: "Can't log in", steps: ["Clear browser cache & cookies", "Try incognito/private mode", "Reset password via email", "Check if account is suspended", "Contact support with error code"] },
  { issue: "SP not received", steps: ["Wait 5 minutes for processing", "Check transaction history", "Verify gig completion status", "Check for pending disputes", "Contact support with gig ID"] },
  { issue: "Video call failing", steps: ["Check camera/mic permissions", "Test internet speed (min 5Mbps)", "Try a different browser", "Disable VPN/proxy", "Update browser to latest version"] },
  { issue: "Gig not appearing", steps: ["Verify gig is published (not draft)", "Check category selection", "Ensure profile is complete", "Review content guidelines", "Allow 10 min for indexing"] },
];

const slaMetrics = [
  { metric: "Email Response", free: "48h", pro: "24h", enterprise: "4h" },
  { metric: "Live Chat", free: "—", pro: "Business hours", enterprise: "24/7" },
  { metric: "Phone Support", free: "—", pro: "—", enterprise: "Dedicated" },
  { metric: "Bug Fix Priority", free: "Standard", pro: "Elevated", enterprise: "Critical" },
  { metric: "Uptime SLA", free: "99.5%", pro: "99.9%", enterprise: "99.99%" },
  { metric: "Data Recovery", free: "Best effort", pro: "24h RPO", enterprise: "1h RPO" },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedKb, setExpandedKb] = useState<number | null>(null);
  const [expandedTroubleshoot, setExpandedTroubleshoot] = useState<number | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<number | null>(null);

  const handleCopy = (path: string, idx: number) => {
    navigator.clipboard.writeText(path);
    setCopiedEndpoint(idx);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

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
                className="h-14 w-full rounded-2xl border border-border bg-card pl-13 pr-5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                style={{ paddingLeft: "3.25rem" }}
              />
            </motion.div>
            {/* Hero Stats */}
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

        {/* Knowledge Base - Enhanced with expandable popular articles */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground">Knowledge Base</h2>
              <span className="text-xs text-muted-foreground">160+ articles across 9 categories</span>
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
                    <span className="text-[10px] text-muted-foreground/60">{cat.articles} articles</span>
                  </div>
                  <AnimatePresence>
                    {expandedKb === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/50"
                      >
                        <div className="p-4 space-y-1.5">
                          <p className="text-[10px] font-semibold text-muted-foreground mb-2">Popular Articles</p>
                          {cat.popular.map((article) => (
                            <div key={article} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-surface-2 cursor-pointer transition-colors">
                              <FileText size={12} className="text-muted-foreground shrink-0" />
                              {article}
                              <ArrowRight size={10} className="ml-auto text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Troubleshooting Guide */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Wrench size={24} className="text-badge-gold" />
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Troubleshooting Guide</h2>
                <p className="text-xs text-muted-foreground mt-1">Step-by-step solutions for common issues</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {troubleshootingSteps.map((t, i) => (
                <motion.div
                  key={t.issue}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedTroubleshoot(expandedTroubleshoot === i ? null : i)}
                    className="flex w-full items-center justify-between p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-alert-red/10">
                        <AlertTriangle size={14} className="text-alert-red" />
                      </div>
                      <span className="font-heading text-sm font-bold text-foreground">{t.issue}</span>
                    </div>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expandedTroubleshoot === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedTroubleshoot === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/50"
                      >
                        <div className="p-5 space-y-2">
                          {t.steps.map((step, si) => (
                            <div key={si} className="flex items-start gap-3">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] text-muted-foreground">{si + 1}</span>
                              <span className="text-xs text-muted-foreground">{step}</span>
                            </div>
                          ))}
                          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-border/30">
                            <span className="text-[10px] text-muted-foreground">Still stuck?</span>
                            <button className="text-[10px] font-semibold text-court-blue hover:underline">Contact Support →</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Docs Preview - Enhanced */}
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
                  <span className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold ${
                    ep.method === "GET" ? "bg-skill-green/10 text-skill-green" : "bg-court-blue/10 text-court-blue"
                  }`}>
                    {ep.method}
                  </span>
                  <code className="flex-1 font-mono text-sm text-foreground">{ep.path}</code>
                  <span className="hidden sm:block rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">{ep.auth}</span>
                  <span className="text-xs text-muted-foreground">{ep.desc}</span>
                  <button
                    onClick={() => handleCopy(ep.path, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedEndpoint === i ? (
                      <CheckCircle2 size={14} className="text-skill-green" />
                    ) : (
                      <Copy size={14} className="text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            {/* SDK Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["JavaScript", "Python", "Go", "Ruby", "PHP", "cURL"].map((sdk) => (
                <span key={sdk} className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/20 cursor-pointer transition-colors">
                  {sdk}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Support - Enhanced with SLA table */}
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

            {/* SLA Table */}
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

        {/* Platform Status - Enhanced */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-skill-green/40" />
                  <span className="relative h-2 w-2 rounded-full bg-skill-green" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">All Systems Operational</h2>
              </div>
              <span className="rounded-full bg-skill-green/10 px-3 py-1 text-[10px] font-semibold text-skill-green">99.97% overall</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-skill-green" />
                      <span className="text-xs font-medium text-foreground">{s.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-skill-green">{s.uptime}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 flex-1 rounded-full bg-surface-2 mr-3">
                      <div className="h-full rounded-full bg-skill-green" style={{ width: `${s.uptime}%` }} />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">{s.latency}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Incident History */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 font-heading text-sm font-bold text-foreground">Recent Incidents</h3>
              <div className="space-y-3">
                {[
                  { date: "Mar 5, 2026", title: "Messenger latency spike", duration: "12 min", status: "Resolved" },
                  { date: "Feb 28, 2026", title: "Scheduled maintenance — DB migration", duration: "45 min", status: "Completed" },
                  { date: "Feb 15, 2026", title: "Video call CDN degradation", duration: "28 min", status: "Resolved" },
                ].map((inc) => (
                  <div key={inc.date} className="flex items-center justify-between rounded-lg bg-surface-1 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground">{inc.date}</span>
                      <span className="text-xs text-foreground">{inc.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground">{inc.duration}</span>
                      <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[9px] font-semibold text-skill-green">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground group-hover:text-foreground transition-colors">
                      <r.icon size={18} />
                    </div>
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{r.tag}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bug Bounty - Enhanced */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Bug size={24} className="text-badge-gold" />
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Bug Bounty Program</h2>
                <p className="text-xs text-muted-foreground mt-1">Help us keep SkillSwappr secure and earn rewards</p>
              </div>
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bountyTiers.map((t, i) => (
                <motion.div key={t.severity} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-5">
                  <span className={`mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold ${
                    t.severity === "Critical" ? "bg-destructive/10 text-destructive" :
                    t.severity === "High" ? "bg-alert-red/10 text-alert-red" :
                    t.severity === "Medium" ? "bg-badge-gold/10 text-badge-gold" :
                    "bg-surface-2 text-muted-foreground"
                  }`}>
                    {t.severity}
                  </span>
                  <p className="mb-1 font-heading text-sm font-bold text-foreground">{t.reward}</p>
                  <p className="text-[10px] text-muted-foreground">{t.examples}</p>
                </motion.div>
              ))}
            </div>
            {/* Bounty Rules */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
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

        {/* Report an Issue - Enhanced */}
        <section className="py-16">
          <div className="mx-auto max-w-xl px-6 text-center">
            <Flag size={32} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Report an Issue</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Report a user, gig, or guild violation. Attach evidence for faster resolution.
            </p>
            <div className="space-y-3 text-left">
              <select className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                <option>Select report type</option>
                <option>Report a User</option>
                <option>Report a Gig</option>
                <option>Report a Guild</option>
                <option>Report a Bug</option>
                <option>Safety Concern</option>
                <option>Other</option>
              </select>
              <select className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                <option>Priority Level</option>
                <option>Low — Minor issue</option>
                <option>Medium — Needs attention</option>
                <option>High — Urgent</option>
                <option>Critical — Safety risk</option>
              </select>
              <input
                type="text"
                placeholder="Reference ID (optional — gig ID, user ID, etc.)"
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              <textarea placeholder="Describe the issue in detail..." className="h-28 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
              <div className="rounded-xl border border-dashed border-border bg-surface-1 p-4 text-center cursor-pointer hover:border-foreground/20 transition-colors">
                <FileText size={18} className="mx-auto mb-1 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Drag & drop evidence or click to upload (max 10MB)</span>
              </div>
              <motion.button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Submit Report <Send size={16} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Lightbulb size={32} className="mx-auto mb-4 text-badge-gold" />
            <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">Help Us Improve</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Was this help center useful? Share your feedback so we can make it even better.
            </p>
            <div className="flex items-center justify-center gap-4">
              {[
                { icon: ThumbsUp, label: "Very Helpful", color: "skill-green" },
                { icon: Star, label: "Somewhat Helpful", color: "badge-gold" },
                { icon: ThumbsDown, label: "Needs Work", color: "alert-red" },
              ].map((fb) => (
                <motion.button
                  key={fb.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 hover:border-${fb.color}/30 transition-all`}
                >
                  <fb.icon size={20} className={`text-${fb.color}`} />
                  <span className="text-[10px] text-muted-foreground">{fb.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HelpPage;
