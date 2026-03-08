import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, Circle, Zap, Target, Users, Shield, Trophy,
  Globe, Building2, Smartphone, Bot, ArrowRight, Rocket, Eye, Heart,
  Lightbulb, MessageSquare, Palette, Code, TrendingUp, Send, Sparkles,
  GraduationCap, Briefcase, PenTool, BarChart3
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";

import ChangelogSection from "@/features/roadmap/sections/ChangelogSection";
import FeatureVotingSection from "@/features/roadmap/sections/FeatureVotingSection";

const NEXT_UPDATE = new Date("2026-04-15T00:00:00");

const phases = [
  {
    phase: "Phase 1", status: "completed", label: "Foundation", date: "Q3 2025", progress: 100,
    desc: "We laid the groundwork — core marketplace, skill points economy, and user profiles. The platform went live with Direct Swap as the first gig format.",
    items: [
      { title: "Core Marketplace", desc: "Search, browse, and list skill-based gigs", status: "completed", icon: Zap },
      { title: "Skill Points Economy", desc: "Internal currency with 5% tax, anti-inflation mechanics", status: "completed", icon: Target },
      { title: "Direct Swap Format", desc: "1-on-1 skill exchanges with point balancing", status: "completed", icon: Users },
      { title: "Basic Profiles", desc: "Portfolios, skill tags, ratings, and bio", status: "completed", icon: Shield },
    ],
  },
  {
    phase: "Phase 2", status: "completed", label: "Growth", date: "Q4 2025", progress: 100,
    desc: "We introduced competitive formats, trust systems, and community structures. Auctions, Skill Court, and Guilds made the platform a living ecosystem.",
    items: [
      { title: "Auction Format", desc: "Competitive bidding on tasks with multi-submission review", status: "completed", icon: Trophy },
      { title: "Skill Court System", desc: "Peer-elected dispute resolution with ELO-based jurors", status: "completed", icon: Shield },
      { title: "Guild System", desc: "Team-based communities with treasuries and Guild Wars", status: "completed", icon: Users },
      { title: "ELO Rating System", desc: "Dynamic trust ratings based on performance history", status: "completed", icon: Target },
    ],
  },
  {
    phase: "Phase 3", status: "in-progress", label: "Expansion", date: "Q1 2026", progress: 60,
    desc: "We're scaling into collaboration tools, enterprise features, and AI-powered quality assurance. The mobile app is on the horizon.",
    items: [
      { title: "Co-Creation Studio", desc: "Multi-person workspaces with whiteboard, video, and role-based points", status: "completed", icon: Users },
      { title: "Enterprise Mode", desc: "Company teams, bulk gigs, HR dashboards, and compliance tools", status: "in-progress", icon: Building2 },
      { title: "AI Quality Panel", desc: "Plagiarism detection, quality scoring, and satisfaction prediction", status: "in-progress", icon: Bot },
      { title: "Mobile App", desc: "Native iOS and Android apps with full platform parity", status: "planned", icon: Smartphone },
    ],
  },
  {
    phase: "Phase 4", status: "planned", label: "Global", date: "Q3 2026", progress: 0,
    desc: "Taking SkillSwappr worldwide with localization, advanced project formats, and an open API marketplace for third-party integrations.",
    items: [
      { title: "Multi-language Support", desc: "Full i18n with 12+ languages and RTL support", status: "planned", icon: Globe },
      { title: "Skill Fusion & Projects", desc: "Complex multi-skill gigs with milestone tracking", status: "planned", icon: Target },
      { title: "Quarterly Wraps", desc: "Personalized recap reports with stats, badges, and highlights", status: "planned", icon: Trophy },
      { title: "API Marketplace", desc: "Third-party integrations, webhooks, and developer tools", status: "planned", icon: Zap },
    ],
  },
];

const upcomingFeatures = [
  { title: "Enterprise Onboarding Wizard", eta: "April 2026", icon: Building2 },
  { title: "AI-Powered Gig Matching", eta: "April 2026", icon: Bot },
  { title: "Mobile App Beta (iOS)", eta: "May 2026", icon: Smartphone },
  { title: "Guild Tournaments v3", eta: "June 2026", icon: Trophy },
  { title: "Video Portfolio Support", eta: "June 2026", icon: Palette },
  { title: "Advanced Analytics Dashboard", eta: "July 2026", icon: BarChart3 },
];

const whoItHelps = [
  { role: "Designers", icon: PenTool, color: "text-court-blue", bg: "bg-court-blue/10", desc: "Trade UI/UX designs for development work. Build your portfolio through real projects with real feedback." },
  { role: "Developers", icon: Code, color: "text-skill-green", bg: "bg-skill-green/10", desc: "Swap coding skills for design, marketing, or content. Ship side projects faster with skilled collaborators." },
  { role: "Marketers", icon: TrendingUp, color: "text-badge-gold", bg: "bg-badge-gold/10", desc: "Exchange growth strategies for creative assets. Run campaigns using diverse skill sets without budgets." },
  { role: "Researchers", icon: GraduationCap, color: "text-muted-foreground", bg: "bg-surface-2", desc: "Get data analysis, visualization, or writing help in exchange for domain expertise and mentorship." },
];

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle2 size={16} className="text-skill-green" />;
  if (s === "in-progress") return <Clock size={16} className="text-badge-gold" />;
  return <Circle size={16} className="text-muted-foreground" />;
};

const RoadmapPage = () => {
  const [featureName, setFeatureName] = useState("");
  const [featureIdea, setFeatureIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = NEXT_UPDATE.getTime() - now;
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFeatureName("");
    setFeatureIdea("");
    setTimeout(() => setSubmitted(false), 3000);
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
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <Rocket size={12} className="mr-1.5 inline" /> Product Roadmap
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Built in Public, <span className="text-muted-foreground">Shaped by You</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto max-w-xl text-lg text-muted-foreground">
              See what we've shipped, what we're building, and what's coming next. Every feature is driven by our community.
            </motion.p>

            {/* Next Update Countdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 inline-flex flex-col items-center">
              <span className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Next Major Update</span>
              <div className="flex gap-3">
                {[
                  { val: countdown.days, label: "Days" },
                  { val: countdown.hours, label: "Hours" },
                  { val: countdown.minutes, label: "Min" },
                  { val: countdown.seconds, label: "Sec" },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-3 min-w-[64px]">
                    <span className="font-heading text-2xl font-black text-foreground">{String(t.val).padStart(2, "0")}</span>
                    <span className="text-[10px] text-muted-foreground">{t.label}</span>
                  </div>
                ))}
              </div>
              <span className="mt-2 text-xs text-muted-foreground">April 15, 2026 — Enterprise Mode + AI Panel</span>
            </motion.div>
          </div>
        </section>

        {/* Detailed Phase Cards */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Development Phases</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              A detailed look at every milestone — past, present, and future.
            </motion.p>

            <div className="space-y-8">
              {phases.map((phase, pi) => (
                <motion.div key={phase.phase} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pi * 0.1 }} className="overflow-hidden rounded-2xl border border-border bg-card">
                  {/* Phase Header */}
                  <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {statusIcon(phase.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{phase.phase}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            phase.status === "completed" ? "bg-skill-green/10 text-skill-green" :
                            phase.status === "in-progress" ? "bg-badge-gold/10 text-badge-gold" :
                            "bg-surface-2 text-muted-foreground"
                          }`}>
                            {phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? "In Progress" : "Planned"}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground">{phase.label}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-muted-foreground">{phase.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${phase.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full rounded-full ${phase.progress === 100 ? "bg-skill-green" : phase.progress > 0 ? "bg-badge-gold" : "bg-muted-foreground/30"}`}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{phase.progress}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Phase Description */}
                  <div className="border-b border-border px-6 py-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{phase.desc}</p>
                  </div>
                  {/* Phase Items */}
                  <div className="grid gap-px bg-border sm:grid-cols-2">
                    {phase.items.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 bg-card p-5">
                        <div className="mt-0.5 flex-shrink-0">{statusIcon(item.status)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <item.icon size={14} className="text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{item.title}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">What's Next</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              Specific features we're actively working on and their estimated timelines.
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingFeatures.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
                    <f.icon size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{f.eta}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ChangelogSection />
        <FeatureVotingSection />

        {/* Our Vision */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 font-heading text-3xl font-bold text-foreground">Our Vision</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mx-auto max-w-2xl text-muted-foreground">
                Where SkillSwappr is headed — and why it matters.
              </motion.p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Eye, title: "Democratize Skill Value", desc: "We believe every skill has value. SkillSwappr removes financial barriers so students can access expertise through what they know, not what they can pay." },
                { icon: Heart, title: "Community-First Growth", desc: "Every feature we build starts with community feedback. Our roadmap isn't decided in a boardroom — it's shaped by the people who use the platform daily." },
                { icon: Lightbulb, title: "AI-Augmented, Human-Centered", desc: "AI enhances matching, quality assurance, and pricing — but humans make every decision. Technology serves the community, never the other way around." },
              ].map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2">
                    <v.icon size={22} className="text-foreground" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Build */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">How We Build</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              Our development process is transparent, iterative, and community-driven.
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Listen", desc: "Community suggestions, support tickets, and usage data", icon: MessageSquare },
                { step: "02", title: "Prototype", desc: "Rapid prototyping with internal testing and feedback loops", icon: Palette },
                { step: "03", title: "Ship", desc: "Incremental releases with feature flags and beta access", icon: Rocket },
                { step: "04", title: "Iterate", desc: "Post-launch monitoring, user feedback, and continuous improvement", icon: Sparkles },
              ].map((s, i) => (
                <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground">{s.step}</div>
                  <s.icon size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <h4 className="mb-1 font-heading text-sm font-bold text-foreground">{s.title}</h4>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It Helps */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Who It Helps</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              SkillSwappr serves students and professionals across every creative and technical discipline.
            </motion.p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whoItHelps.map((w, i) => (
                <motion.div key={w.role} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${w.bg}`}>
                    <w.icon size={22} className={w.color} />
                  </div>
                  <h4 className="mb-2 font-heading text-base font-bold text-foreground">{w.role}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggest a Feature */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-lg px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Suggest a Feature</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-8 text-center text-muted-foreground">
              Have an idea? We'd love to hear it. Top suggestions get prioritized.
            </motion.p>
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              <textarea
                placeholder="Describe your feature idea..."
                value={featureIdea}
                onChange={(e) => setFeatureIdea(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none"
              />
              <motion.button
                type="submit"
                disabled={!featureIdea.trim()}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                  featureIdea.trim() ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                whileHover={featureIdea.trim() ? { scale: 1.01 } : {}}
                whileTap={featureIdea.trim() ? { scale: 0.99 } : {}}
              >
                <Send size={16} /> Submit Suggestion
              </motion.button>
              {submitted && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-sm text-skill-green">
                  <CheckCircle2 size={16} /> Thanks! We'll review your suggestion.
                </motion.p>
              )}
            </motion.form>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default RoadmapPage;
