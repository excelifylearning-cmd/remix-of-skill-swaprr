import { motion } from "framer-motion";
import {
  Building2, Users, Search, Shield, FolderKanban, Sparkles,
  ArrowRight, Lock, Globe, Zap, CheckCircle2, Mail, Target,
  CreditCard, Code, MessageSquare, Calendar, Phone, Star,
  Briefcase, BarChart3, Clock
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const pipelineSteps = [
  { icon: Search, title: "Post a Project", desc: "Define your requirements and the AI matches you with vetted experts." },
  { icon: Users, title: "Review Profiles", desc: "Browse expert portfolios, ELO ratings, and verified skill badges." },
  { icon: FolderKanban, title: "Hire & Collaborate", desc: "Enter the workspace with messenger, whiteboard, video, and stage tracking." },
  { icon: CheckCircle2, title: "Deliver & Verify", desc: "AI quality checks, transaction codes, and verified deliverables." },
];

const expertPool = [
  { name: "Chen L.", skill: "Full-Stack Dev", elo: 1850, rating: 5.0, university: "MIT", avatar: "CL", available: true },
  { name: "Aisha K.", skill: "UI/UX Design", elo: 1790, rating: 4.9, university: "Stanford", avatar: "AK", available: true },
  { name: "Marco R.", skill: "Data Science", elo: 1750, rating: 5.0, university: "Oxford", avatar: "MR", available: false },
  { name: "Priya S.", skill: "Mobile Dev", elo: 1720, rating: 4.9, university: "Cambridge", avatar: "PS", available: true },
];

const useCases = [
  { title: "Consultation", desc: "Book expert time for strategy, code review, or design feedback. Specific time slots with video calls.", icon: MessageSquare, caseStudy: "TechCorp saved 40 hours using student consultants for UX audits." },
  { title: "Project-Based", desc: "Full projects with dedicated workspaces, stage tracking, and milestone payments.", icon: FolderKanban, caseStudy: "StartupX shipped their MVP in 3 weeks with a 4-person student team." },
  { title: "Team Augmentation", desc: "Add vetted specialists to your existing team temporarily for peak periods.", icon: Users, caseStudy: "DesignCo augmented their team with 3 UI designers for a product launch." },
  { title: "Full-Time Hiring", desc: "From gig to full-time hire with proven track record and portfolio evidence.", icon: Briefcase, caseStudy: "DataInc hired 8 full-time data scientists discovered through the platform." },
];

const securityFeatures = [
  { icon: Lock, title: "Data Encryption", desc: "End-to-end encryption for all communications and files." },
  { icon: Shield, title: "NDA Support", desc: "Built-in NDA agreements before workspace access." },
  { icon: Globe, title: "GDPR Compliant", desc: "Full compliance with data protection regulations." },
  { icon: Zap, title: "IP Protection", desc: "Clear IP ownership policies and fingerprinted deliverables." },
];

const integrations = [
  { name: "Stripe", desc: "Payment processing", icon: CreditCard },
  { name: "Slack", desc: "Team notifications", icon: MessageSquare },
  { name: "Jira", desc: "Project management", icon: FolderKanban },
  { name: "GitHub", desc: "Code integration", icon: Code },
  { name: "Google Calendar", desc: "Scheduling", icon: Calendar },
  { name: "Custom API", desc: "Build your own", icon: Zap },
];

const enterpriseTiers = [
  { name: "Starter", price: "$499/mo", desc: "Up to 5 projects, 10 experts", features: ["AI matching", "Basic analytics", "Email support"] },
  { name: "Growth", price: "$999/mo", desc: "Up to 20 projects, unlimited experts", features: ["Priority matching", "Advanced analytics", "Dedicated manager", "Custom integrations"] },
  { name: "Scale", price: "Custom", desc: "Unlimited everything", features: ["Everything in Growth", "SLA guarantee", "API access", "Custom NDA templates", "On-site training"] },
];

const EnterprisePage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--silver)/0.05),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Enterprise</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              Access Vetted <span className="text-muted-foreground">Student Talent</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              Tap into a curated pool of top-rated students for projects, consultations, and full-time hiring.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-4">
              <motion.a href="#contact" className="flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Book a Demo <ArrowRight size={16} />
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">How Enterprise Mode Works</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {pipelineSteps.map((step, i) => (
                <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-2xl border border-border bg-card p-6 text-center">
                  <span className="mb-3 block font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-foreground"><step.icon size={22} /></div>
                  <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Pool Preview */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">Browse Expert Pool</h2>
            <p className="mb-10 text-muted-foreground">Vetted, high-ELO student talent ready for your projects.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {expertPool.map((e, i) => (
                <motion.div key={e.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 font-heading text-lg font-bold text-foreground">{e.avatar}</div>
                  <h3 className="font-heading text-sm font-bold text-foreground">{e.name}</h3>
                  <p className="text-xs text-muted-foreground">{e.university}</p>
                  <p className="mt-1 text-xs text-foreground">{e.skill}</p>
                  <div className="mt-2 flex justify-center gap-3">
                    <span className="font-mono text-[10px] text-court-blue">ELO {e.elo}</span>
                    <span className="flex items-center gap-0.5 font-mono text-[10px] text-badge-gold"><Star size={10} className="fill-badge-gold" />{e.rating}</span>
                  </div>
                  <div className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${e.available ? "bg-skill-green/10 text-skill-green" : "bg-surface-2 text-muted-foreground"}`}>
                    {e.available ? "Available" : "Busy"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases with Case Studies */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Use Cases</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {useCases.map((uc, i) => (
                <motion.div key={uc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground"><uc.icon size={20} /></div>
                    <div>
                      <h3 className="mb-1 font-heading font-bold text-foreground">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground">{uc.desc}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-surface-1 border border-border/50 p-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Case Study</p>
                    <p className="text-xs text-foreground">{uc.caseStudy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Security & Compliance</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {securityFeatures.map((sf, i) => (
                <motion.div key={sf.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-5">
                  <sf.icon size={18} className="mb-3 text-foreground" />
                  <h4 className="mb-1 font-heading text-sm font-bold text-foreground">{sf.title}</h4>
                  <p className="text-xs text-muted-foreground">{sf.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Integrations</h2>
            <p className="mb-12 text-center text-muted-foreground">Connect with your existing tools and workflows.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((int, i) => (
                <motion.div key={int.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground"><int.icon size={18} /></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Pricing */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Enterprise Pricing</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {enterpriseTiers.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`rounded-2xl border p-6 ${i === 1 ? "border-foreground/30 bg-card" : "border-border bg-card"}`}>
                  {i === 1 && <div className="mb-3 inline-block rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background">Popular</div>}
                  <h3 className="font-heading text-lg font-bold text-foreground">{t.name}</h3>
                  <p className="mb-2 font-heading text-3xl font-black text-foreground">{t.price}</p>
                  <p className="mb-4 text-xs text-muted-foreground">{t.desc}</p>
                  <ul className="space-y-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 size={12} className="text-skill-green flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Demo */}
        <section id="contact" className="bg-surface-1 py-24">
          <div className="mx-auto max-w-xl px-6">
            <Mail size={32} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-4 text-center font-heading text-3xl font-bold text-foreground">Book a Demo</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Ready to bring top student talent to your team? Book a demo or contact our enterprise team.
            </p>
            <div className="space-y-3">
              <input type="text" placeholder="Full name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <input type="email" placeholder="Work email" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <input type="text" placeholder="Company name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              <textarea placeholder="Tell us about your needs..." className="h-24 w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
              <motion.button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Request Demo <ArrowRight size={16} />
              </motion.button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Phone size={12} /> +1 (800) SKILL</span>
              <span className="flex items-center gap-1.5"><Mail size={12} /> enterprise@skillswappr.com</span>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default EnterprisePage;
