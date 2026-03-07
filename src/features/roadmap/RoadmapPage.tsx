import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, Circle, Zap, Target, Users, Shield, Trophy,
  Globe, Building2, Smartphone, Bot, ThumbsUp, ChevronDown, ArrowRight,
  AlertTriangle, Lock, FileText, Bug, Award
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const phases = [
  {
    phase: "Phase 1", status: "completed", label: "Foundation",
    items: [
      { title: "Core Marketplace", status: "completed", icon: Zap },
      { title: "Skill Points Economy", status: "completed", icon: Target },
      { title: "Direct Swap Format", status: "completed", icon: Users },
      { title: "Basic Profiles", status: "completed", icon: Shield },
    ],
  },
  {
    phase: "Phase 2", status: "completed", label: "Growth",
    items: [
      { title: "Auction Format", status: "completed", icon: Trophy },
      { title: "Skill Court System", status: "completed", icon: Shield },
      { title: "Guild System", status: "completed", icon: Users },
      { title: "ELO Rating System", status: "completed", icon: Target },
    ],
  },
  {
    phase: "Phase 3", status: "in-progress", label: "Expansion",
    items: [
      { title: "Co-Creation Studio", status: "completed", icon: Users },
      { title: "Enterprise Mode", status: "in-progress", icon: Building2 },
      { title: "AI Quality Panel", status: "in-progress", icon: Bot },
      { title: "Mobile App", status: "planned", icon: Smartphone },
    ],
  },
  {
    phase: "Phase 4", status: "planned", label: "Global",
    items: [
      { title: "Multi-language Support", status: "planned", icon: Globe },
      { title: "Skill Fusion & Projects", status: "planned", icon: Target },
      { title: "Quarterly Wraps", status: "planned", icon: Trophy },
      { title: "API Marketplace", status: "planned", icon: Zap },
    ],
  },
];

const featureRequests = [
  { title: "Dark mode improvements", votes: 342, category: "UI/UX", status: "Planned" },
  { title: "Mobile app (iOS/Android)", votes: 289, category: "Platform", status: "In Progress" },
  { title: "Advanced search filters", votes: 234, category: "Marketplace", status: "Planned" },
  { title: "Guild chat rooms", votes: 198, category: "Guilds", status: "Under Review" },
  { title: "Video portfolio support", votes: 167, category: "Profile", status: "Under Review" },
  { title: "Subscription gig format", votes: 145, category: "Formats", status: "Planned" },
];

const changelog = [
  { date: "Mar 3, 2026", title: "Co-Creation Studio Launch", desc: "Multi-person workspace with whiteboard and video. Points per role.", tag: "Feature" },
  { date: "Feb 28, 2026", title: "AI Quality Panel Beta", desc: "Plagiarism check, quality scoring, and predicted buyer satisfaction.", tag: "Beta" },
  { date: "Feb 20, 2026", title: "Guild Wars v2", desc: "Improved matchmaking, new metrics, and treasury rewards.", tag: "Update" },
  { date: "Feb 15, 2026", title: "Performance Boost", desc: "50% faster page loads, optimized marketplace queries.", tag: "Performance" },
  { date: "Feb 10, 2026", title: "Court Appeal System", desc: "One appeal allowed per case, reviewed by higher-ELO panel.", tag: "Feature" },
  { date: "Feb 5, 2026", title: "Bug Fix Batch", desc: "Fixed 23 community-reported bugs. Thank you for the reports!", tag: "Fix" },
];

const services = [
  { name: "Marketplace", status: "operational", uptime: 99.98 },
  { name: "Messenger", status: "operational", uptime: 99.95 },
  { name: "Video Calls", status: "operational", uptime: 99.90 },
  { name: "Skill Court", status: "operational", uptime: 99.99 },
  { name: "API", status: "operational", uptime: 99.97 },
];

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle2 size={16} className="text-skill-green" />;
  if (s === "in-progress") return <Clock size={16} className="text-badge-gold" />;
  return <Circle size={16} className="text-muted-foreground" />;
};

const statusColor = (s: string) => {
  if (s === "completed") return "border-skill-green/30";
  if (s === "in-progress") return "border-badge-gold/30";
  return "border-border";
};

const RoadmapPage = () => {
  const [voted, setVoted] = useState<Set<number>>(new Set());

  const toggleVote = (i: number) => {
    setVoted((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-20 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Built in Public, <span className="text-muted-foreground">Shaped by You</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto max-w-xl text-lg text-muted-foreground">
              See what we've shipped, what we're building, and what's coming next.
            </motion.p>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="pb-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
              {phases.map((phase, pi) => (
                <motion.div key={phase.phase} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pi * 0.1 }} className="relative mb-12 ml-16">
                  <div className="absolute -left-[2.5rem] top-1 z-10">{statusIcon(phase.status)}</div>
                  <div className="mb-4">
                    <span className="font-mono text-xs text-muted-foreground">{phase.phase}</span>
                    <h3 className="font-heading text-xl font-bold text-foreground">{phase.label}</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {phase.items.map((item) => (
                      <div key={item.title} className={`flex items-center gap-3 rounded-xl border bg-card p-4 ${statusColor(item.status)}`}>
                        {statusIcon(item.status)}
                        <span className="text-sm text-foreground">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Voting */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Feature Voting</h2>
            <p className="mb-8 text-muted-foreground">Vote on features you want to see next. Most voted get prioritized.</p>
            <div className="space-y-3">
              {featureRequests.map((fr, i) => (
                <motion.div key={fr.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <motion.button
                    onClick={() => toggleVote(i)}
                    className={`flex flex-col items-center rounded-lg px-3 py-2 transition-all ${voted.has(i) ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ThumbsUp size={14} />
                    <span className="mt-0.5 font-mono text-[10px] font-bold">{fr.votes + (voted.has(i) ? 1 : 0)}</span>
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{fr.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{fr.category}</span>
                      <span className={`text-[10px] font-medium ${fr.status === "In Progress" ? "text-badge-gold" : fr.status === "Planned" ? "text-skill-green" : "text-muted-foreground"}`}>{fr.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Changelog */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 font-heading text-3xl font-bold text-foreground">Changelog</h2>
            <div className="space-y-4">
              {changelog.map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      entry.tag === "Feature" ? "bg-skill-green/10 text-skill-green" :
                      entry.tag === "Beta" ? "bg-court-blue/10 text-court-blue" :
                      entry.tag === "Fix" ? "bg-destructive/10 text-destructive" :
                      entry.tag === "Performance" ? "bg-badge-gold/10 text-badge-gold" :
                      "bg-surface-2 text-muted-foreground"
                    }`}>{entry.tag}</span>
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground">{entry.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Status & Uptime */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-skill-green/40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-skill-green" /></span>
              <h2 className="font-heading text-2xl font-bold text-foreground">All Systems Operational</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-skill-green" />
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs text-skill-green">{s.uptime}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bug Bounty */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Bug size={24} className="text-badge-gold" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Bug Bounty Program</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="mb-6 text-sm text-muted-foreground">Help us keep SkillSwappr secure. Report vulnerabilities and earn skill points + exclusive badges.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { sev: "Critical", reward: "500 SP + Diamond Badge" },
                  { sev: "High", reward: "200 SP + Gold Badge" },
                  { sev: "Medium", reward: "50 SP + Badge" },
                  { sev: "Low", reward: "10 SP" },
                ].map((b) => (
                  <div key={b.sev} className="flex items-center gap-3 rounded-xl bg-surface-1 p-4">
                    <AlertTriangle size={16} className={b.sev === "Critical" ? "text-destructive" : b.sev === "High" ? "text-alert-red" : "text-muted-foreground"} />
                    <div>
                      <span className="text-sm font-medium text-foreground">{b.sev}</span>
                      <p className="text-[10px] text-muted-foreground">{b.reward}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Audits */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <Lock size={24} className="text-foreground" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Security & Audits</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Last Pentest", value: "Feb 2026", desc: "Zero critical findings" },
                { title: "Next Audit", value: "Q2 2026", desc: "Scheduled with CertiK" },
                { title: "Incident Response", value: "< 1 hour", desc: "24/7 on-call team" },
              ].map((a) => (
                <div key={a.title} className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="font-heading text-lg font-bold text-foreground">{a.value}</p>
                  <p className="text-xs font-medium text-foreground">{a.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default RoadmapPage;
