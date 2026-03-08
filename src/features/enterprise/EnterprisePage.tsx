import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, Search, Shield, FolderKanban, Sparkles,
  ArrowRight, Lock, Globe, Zap, CheckCircle2, Mail, Target,
  CreditCard, Code, MessageSquare, Calendar, Phone, Star,
  Briefcase, BarChart3, Clock, TrendingUp, Award, Eye,
  ChevronRight, Play, ArrowUp, Layers, Bot, Crown
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";


/* ─── Data ─── */

const heroStats = [
  { label: "Companies Using", value: "200+", icon: Building2 },
  { label: "Experts Hired", value: "2,400+", icon: Users },
  { label: "Avg Time to Hire", value: "48h", icon: Clock },
  { label: "Satisfaction Rate", value: "98%", icon: Star },
];

const pipelineSteps = [
  { icon: Search, title: "Post a Project", desc: "Define requirements — skill tags, budget, timeline, complexity. Our AI instantly matches you with the most relevant experts based on ELO, portfolio, and availability.", num: "01" },
  { icon: Eye, title: "Review & Compare", desc: "Browse expert profiles with verified portfolios, skill badges, university affiliations, and detailed performance history. Compare candidates side-by-side.", num: "02" },
  { icon: FolderKanban, title: "Hire & Collaborate", desc: "Enter a full workspace with real-time messenger, whiteboard, video calls, stage tracking, and milestone payments. Everything in one place.", num: "03" },
  { icon: CheckCircle2, title: "Deliver & Verify", desc: "AI quality checks scan for plagiarism and assess quality scores. Digital fingerprinting ensures deliverable authenticity. Transaction codes for full audit trails.", num: "04" },
];

const expertPool = [
  { name: "Chen L.", skill: "Full-Stack Dev", elo: 1850, rating: 5.0, university: "MIT", avatar: "CL", available: true, gigs: 142, specialties: ["React", "Node.js", "AWS"] },
  { name: "Aisha K.", skill: "UI/UX Design", elo: 1790, rating: 4.9, university: "Stanford", avatar: "AK", available: true, gigs: 98, specialties: ["Figma", "Research", "Systems"] },
  { name: "Marco R.", skill: "Data Science", elo: 1750, rating: 5.0, university: "Oxford", avatar: "MR", available: false, gigs: 76, specialties: ["Python", "ML", "Viz"] },
  { name: "Priya S.", skill: "Mobile Dev", elo: 1720, rating: 4.9, university: "Cambridge", avatar: "PS", available: true, gigs: 64, specialties: ["Swift", "React Native", "Flutter"] },
  { name: "James T.", skill: "Video Production", elo: 1680, rating: 4.8, university: "UCLA", avatar: "JT", available: true, gigs: 53, specialties: ["Motion", "3D", "Edit"] },
  { name: "Sarah W.", skill: "Marketing", elo: 1710, rating: 4.9, university: "Wharton", avatar: "SW", available: false, gigs: 87, specialties: ["Growth", "SEO", "Content"] },
];

const useCases = [
  {
    title: "Consultation", desc: "Book expert time for strategy, code review, design audits, or research feedback.", icon: MessageSquare,
    stats: { avgCost: "15 SP/hr", avgDuration: "2 hours", satisfaction: "4.9/5" },
    caseStudy: { company: "TechCorp", result: "Saved 40 hours using student consultants for UX audits across 3 product lines.", metric: "40h saved" },
  },
  {
    title: "Project-Based", desc: "Full projects with dedicated workspaces, stage tracking, milestone payments, and deliverable verification.", icon: FolderKanban,
    stats: { avgCost: "200 SP", avgDuration: "2 weeks", satisfaction: "4.8/5" },
    caseStudy: { company: "StartupX", result: "Shipped their MVP in 3 weeks with a 4-person student team at 70% below agency rates.", metric: "70% cheaper" },
  },
  {
    title: "Team Augmentation", desc: "Add vetted specialists to your existing team temporarily during peak periods or special projects.", icon: Users,
    stats: { avgCost: "Custom", avgDuration: "1-3 months", satisfaction: "4.9/5" },
    caseStudy: { company: "DesignCo", result: "Augmented their team with 3 UI designers for a product launch. On time, on budget.", metric: "3 designers" },
  },
  {
    title: "Full-Time Hiring", desc: "From gig to full-time hire with proven track records, portfolio evidence, and ELO-verified expertise.", icon: Briefcase,
    stats: { avgCost: "Free*", avgDuration: "Trial → Offer", satisfaction: "5.0/5" },
    caseStudy: { company: "DataInc", result: "Hired 8 full-time data scientists discovered through the platform. Zero regret hires.", metric: "8 hires, 0 regrets" },
  },
];

const securityFeatures = [
  { icon: Lock, title: "End-to-End Encryption", desc: "AES-256 encryption for all communications, files, and deliverables. Zero-knowledge architecture.", cert: "SOC 2 Type II" },
  { icon: Shield, title: "NDA & IP Protection", desc: "Built-in NDA agreements enforced before workspace access. Digital fingerprinting on all deliverables.", cert: "Legal compliant" },
  { icon: Globe, title: "GDPR & CCPA", desc: "Full compliance with international data protection regulations. Data residency options available.", cert: "EU/US compliant" },
  { icon: Zap, title: "SSO & SAML", desc: "Single sign-on with your existing identity provider. SAML 2.0, OIDC, and Active Directory support.", cert: "Enterprise SSO" },
  { icon: Bot, title: "AI Quality Gates", desc: "Automated plagiarism detection, quality scoring, and deliverable verification before handoff.", cert: "ML-powered" },
  { icon: Layers, title: "Audit Trail", desc: "Complete transaction history with immutable logs, version control, and compliance reporting.", cert: "Full auditability" },
];

const integrations = [
  { name: "Stripe", desc: "Automated invoicing & payments", icon: CreditCard, status: "Live" },
  { name: "Slack", desc: "Real-time project notifications", icon: MessageSquare, status: "Live" },
  { name: "Jira", desc: "Sync tasks & milestones", icon: FolderKanban, status: "Live" },
  { name: "GitHub", desc: "Code repos & PR integration", icon: Code, status: "Live" },
  { name: "Google Calendar", desc: "Auto-schedule consultations", icon: Calendar, status: "Live" },
  { name: "Notion", desc: "Documentation sync", icon: Layers, status: "Beta" },
  { name: "Zapier", desc: "Connect 5,000+ apps", icon: Zap, status: "Live" },
  { name: "Custom API", desc: "Build your own integrations", icon: Code, status: "Live" },
];

const enterpriseTiers = [
  {
    name: "Starter", price: "$499", period: "/mo", desc: "For small teams getting started",
    features: ["Up to 5 active projects", "10 expert matches/month", "AI-powered matching", "Basic analytics dashboard", "Email support (24h SLA)", "Standard NDA templates"],
    highlight: false,
  },
  {
    name: "Growth", price: "$999", period: "/mo", desc: "For scaling organizations",
    features: ["Up to 20 active projects", "Unlimited expert matches", "Priority AI matching", "Advanced analytics & reports", "Dedicated account manager", "Custom NDA & contracts", "Slack & Jira integration", "Team collaboration tools"],
    highlight: true,
  },
  {
    name: "Scale", price: "Custom", period: "", desc: "For large enterprises",
    features: ["Unlimited everything", "White-glove onboarding", "Custom SLA guarantee", "Full API access", "SSO / SAML / OIDC", "On-site training", "Custom integrations", "Invoice billing (NET 30/60)"],
    highlight: false,
  },
];

const clientLogos = ["TechCorp", "StartupX", "DesignCo", "DataInc", "FinanceHub", "MediaMax"];

const results = [
  { metric: "70%", desc: "Lower cost vs. traditional agencies", icon: TrendingUp },
  { metric: "48h", desc: "Average time from post to first match", icon: Clock },
  { metric: "98%", desc: "Client satisfaction rate", icon: Star },
  { metric: "0%", desc: "Regret hire rate on full-time conversions", icon: Award },
];

/* ─── Component ─── */

const EnterprisePage = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--silver)/0.06),transparent_60%)]" />
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-court-blue/3 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="text-center">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Building2 size={12} /> Enterprise Solutions
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
                Hire Vetted Talent <br className="hidden sm:block" /><span className="text-muted-foreground">in 48 Hours</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Access a curated pool of ELO-verified students and professionals for consultations, projects, team augmentation, and full-time hiring. 70% cheaper than agencies.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
                <motion.a href="#contact" className="flex items-center gap-2 rounded-xl bg-foreground px-8 py-3.5 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Book a Demo <ArrowRight size={16} />
                </motion.a>
                <motion.a href="#pricing" className="flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  View Pricing
                </motion.a>
              </motion.div>
            </div>

            {/* Hero Stats */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {heroStats.map((s, i) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
                  <s.icon size={18} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="border-y border-border py-8">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Trusted by</span>
              {clientLogos.map((logo) => (
                <span key={logo} className="font-heading text-sm font-bold text-muted-foreground/50">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Proven Results</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Numbers that speak for themselves — from 200+ enterprise clients.
            </motion.p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((r, i) => (
                <motion.div key={r.desc} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-skill-green/10">
                    <r.icon size={22} className="text-skill-green" />
                  </div>
                  <p className="font-heading text-3xl font-black text-foreground">{r.metric}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">How It Works</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-lg text-center text-muted-foreground">
              From posting a project to verified delivery — in 4 simple steps.
            </motion.p>
            <div className="space-y-6">
              {pipelineSteps.map((step, i) => (
                <motion.div key={step.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
                      <step.icon size={24} className="text-foreground" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ChevronRight size={20} className="ml-auto hidden flex-shrink-0 self-center text-muted-foreground/30 lg:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Pool */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Expert Pool</motion.h2>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-2 text-muted-foreground">
                  Vetted, high-ELO talent — hand-picked from top universities worldwide.
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 rounded-full bg-skill-green/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-skill-green/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-skill-green" /></span>
                <span className="text-xs font-semibold text-skill-green">4 available now</span>
              </motion.div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {expertPool.map((e, i) => (
                <motion.div key={e.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-heading text-sm font-bold text-foreground">{e.avatar}</div>
                      {e.available && <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-skill-green" />}
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-foreground">{e.name}</h3>
                      <p className="text-xs text-muted-foreground">{e.university}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm font-medium text-foreground">{e.skill}</p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {e.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 border-t border-border pt-3">
                    <span className="font-mono text-[10px] text-court-blue">ELO {e.elo}</span>
                    <span className="flex items-center gap-0.5 font-mono text-[10px] text-badge-gold"><Star size={9} className="fill-badge-gold" />{e.rating}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{e.gigs} gigs</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-medium ${e.available ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"}`}>
                      {e.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases — Interactive Tabs */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Use Cases</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Four proven ways enterprises use SkillSwappr to access top talent.
            </motion.p>

            {/* Tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {useCases.map((uc, i) => (
                <button key={uc.title} onClick={() => setActiveUseCase(i)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${activeUseCase === i ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  <uc.icon size={14} /> {uc.title}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeUseCase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                      {(() => { const Icon = useCases[activeUseCase].icon; return <Icon size={22} className="text-foreground" />; })()}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground">{useCases[activeUseCase].title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{useCases[activeUseCase].desc}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(useCases[activeUseCase].stats).map(([key, val]) => (
                      <div key={key} className="rounded-xl bg-surface-1 p-4 text-center">
                        <p className="font-heading text-lg font-black text-foreground">{val}</p>
                        <p className="text-[10px] capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Case Study */}
                <div className="border-t border-border bg-surface-1 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={14} className="text-badge-gold" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Case Study — {useCases[activeUseCase].caseStudy.company}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{useCases[activeUseCase].caseStudy.result}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-skill-green/10 px-3 py-1">
                    <TrendingUp size={12} className="text-skill-green" />
                    <span className="font-mono text-xs font-bold text-skill-green">{useCases[activeUseCase].caseStudy.metric}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Enterprise-Grade Security</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-lg text-center text-muted-foreground">
              Built for organizations that take security seriously. Every layer protected.
            </motion.p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {securityFeatures.map((sf, i) => (
                <motion.div key={sf.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2">
                      <sf.icon size={20} className="text-foreground" />
                    </div>
                    <span className="rounded-full bg-skill-green/10 px-2.5 py-0.5 text-[9px] font-bold text-skill-green">{sf.cert}</span>
                  </div>
                  <h4 className="mb-2 font-heading text-sm font-bold text-foreground">{sf.title}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">{sf.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Integrations</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Plug into your existing stack. No workflow disruption.
            </motion.p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {integrations.map((int, i) => (
                <motion.div key={int.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
                    <int.icon size={18} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{int.name}</p>
                    <p className="text-[10px] text-muted-foreground">{int.desc}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${int.status === "Live" ? "bg-skill-green/10 text-skill-green" : "bg-badge-gold/10 text-badge-gold"}`}>{int.status}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Enterprise Pricing</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Flexible plans that scale with your hiring needs.
            </motion.p>
            <div className="grid gap-5 md:grid-cols-3">
              {enterpriseTiers.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className={`relative h-full rounded-2xl border p-7 transition-all ${t.highlight ? "border-foreground/30 bg-card shadow-[0_0_60px_hsl(var(--silver)/0.08)]" : "border-border bg-card hover:border-foreground/20"}`}>
                    {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 text-xs font-bold text-background">Most Popular</div>}
                    <h3 className="font-heading text-lg font-bold text-foreground">{t.name}</h3>
                    <div className="mb-1 mt-2">
                      <span className="font-heading text-3xl font-black text-foreground">{t.price}</span>
                      <span className="text-sm text-muted-foreground">{t.period}</span>
                    </div>
                    <p className="mb-5 text-xs text-muted-foreground">{t.desc}</p>
                    <ul className="mb-6 space-y-2">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-skill-green" /> {f}
                        </li>
                      ))}
                    </ul>
                    <motion.button className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${t.highlight ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {t.name === "Scale" ? "Contact Sales" : "Get Started"} <ArrowRight size={14} className="ml-1 inline" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Demo */}
        <section id="contact" className="bg-surface-1 py-24">
          <div className="mx-auto max-w-xl px-6">
            <div className="mb-8 text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
                <Mail size={24} className="text-foreground" />
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl font-bold text-foreground">Book a Demo</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-2 text-sm text-muted-foreground">
                See how SkillSwappr Enterprise can transform your talent pipeline. 30-minute personalized demo.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                <input type="text" placeholder="Last name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              </div>
              <input type="email" placeholder="Work email" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <input type="text" placeholder="Company name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <select className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                <option>Team size</option>
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>200+</option>
              </select>
              <select className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground focus:border-ring focus:outline-none">
                <option>Primary use case</option>
                <option>Consultation</option>
                <option>Project-Based</option>
                <option>Team Augmentation</option>
                <option>Full-Time Hiring</option>
              </select>
              <textarea placeholder="Tell us about your needs..." className="h-24 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
              <motion.button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Request Demo <ArrowRight size={16} />
              </motion.button>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Phone size={12} /> +1 (800) SKILL</span>
              <span className="flex items-center gap-1.5"><Mail size={12} /> enterprise@skillswappr.com</span>
              <span className="flex items-center gap-1.5"><Clock size={12} /> Response in &lt;4 hours</span>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default EnterprisePage;
