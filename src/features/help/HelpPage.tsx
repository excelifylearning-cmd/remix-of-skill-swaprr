import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, BookOpen, Code, MessageSquare, Shield, Bug, Flag, AlertTriangle,
  CheckCircle2, Clock, Zap, ArrowRight, HelpCircle, Video, FileText, Mail,
  Phone, Globe, Award, ExternalLink
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const kbCategories = [
  { icon: BookOpen, title: "Getting Started", desc: "Account setup, profile creation, and first gig", articles: 24 },
  { icon: Zap, title: "Skill Points", desc: "Earning, spending, taxation, and packages", articles: 18 },
  { icon: MessageSquare, title: "Gig Workspace", desc: "Messenger, whiteboard, video, and files", articles: 31 },
  { icon: Shield, title: "Skill Court", desc: "Disputes, judging, verdicts, and appeals", articles: 12 },
  { icon: HelpCircle, title: "Account & Settings", desc: "Privacy, notifications, data export", articles: 15 },
  { icon: Video, title: "Video Tutorials", desc: "Step-by-step visual guides", articles: 9 },
];

const apiEndpoints = [
  { method: "GET", path: "/api/v1/gigs", desc: "List all gigs with filters" },
  { method: "POST", path: "/api/v1/gigs", desc: "Create a new gig" },
  { method: "GET", path: "/api/v1/users/:id", desc: "Get user profile" },
  { method: "GET", path: "/api/v1/transactions/:code", desc: "Lookup transaction" },
  { method: "POST", path: "/api/v1/court/cases", desc: "File a dispute" },
];

const services = [
  { name: "Marketplace", status: "operational", uptime: 99.98 },
  { name: "Messenger", status: "operational", uptime: 99.95 },
  { name: "Video Calls", status: "operational", uptime: 99.90 },
  { name: "Skill Court", status: "operational", uptime: 99.99 },
  { name: "API", status: "operational", uptime: 99.97 },
  { name: "Payments", status: "operational", uptime: 99.99 },
];

const bountyTiers = [
  { severity: "Critical", reward: "500 SP + Diamond Badge", examples: "Auth bypass, data exposure" },
  { severity: "High", reward: "200 SP + Gold Badge", examples: "XSS, CSRF, privilege escalation" },
  { severity: "Medium", reward: "50 SP + Badge", examples: "Info disclosure, rate limiting" },
  { severity: "Low", reward: "10 SP", examples: "UI bugs, minor issues" },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--court-blue)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Help Center
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 text-lg text-muted-foreground">
              Find answers, read docs, check status, and get support.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mx-auto max-w-xl">
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
          </div>
        </section>

        {/* Knowledge Base */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">Knowledge Base</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kbCategories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground transition-colors group-hover:text-foreground">
                    <cat.icon size={20} />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{cat.title}</h3>
                  <p className="mb-3 text-xs text-muted-foreground">{cat.desc}</p>
                  <span className="text-[10px] text-muted-foreground/60">{cat.articles} articles</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Docs Preview */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground">API Documentation</h2>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                Full Docs <ExternalLink size={14} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0 hover:bg-surface-1 transition-colors">
                  <span className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold ${
                    ep.method === "GET" ? "bg-skill-green/10 text-skill-green" : "bg-court-blue/10 text-court-blue"
                  }`}>
                    {ep.method}
                  </span>
                  <code className="flex-1 font-mono text-sm text-foreground">{ep.path}</code>
                  <span className="text-xs text-muted-foreground">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">Contact & Support</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Mail, title: "Email Support", desc: "support@skillswappr.com", sub: "Response within 24 hours" },
                { icon: MessageSquare, title: "Live Chat", desc: "Available Mon–Fri 9am–6pm", sub: "Premium & Enterprise" },
                { icon: Phone, title: "Phone Support", desc: "Enterprise clients only", sub: "Dedicated account manager" },
              ].map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <c.icon size={24} className="mx-auto mb-3 text-muted-foreground" />
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">{c.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Status */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-skill-green/40" />
                <span className="relative h-2 w-2 rounded-full bg-skill-green" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">All Systems Operational</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-skill-green" />
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-skill-green">{s.uptime}%</span>
                    <p className="text-[9px] text-muted-foreground">30-day uptime</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bug Bounty */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Bug size={24} className="text-badge-gold" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Bug Bounty Program</h2>
            </div>
            <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
              Help us keep SkillSwappr secure. Report vulnerabilities and earn skill points + exclusive badges.
            </p>
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
          </div>
        </section>

        {/* Reporting */}
        <section className="bg-surface-1 py-16">
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
                <option>Other</option>
              </select>
              <textarea placeholder="Describe the issue..." className="h-24 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
              <motion.button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Submit Report <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default HelpPage;
