import { motion } from "framer-motion";
import {
  Building2, Users, Search, Shield, FolderKanban, Sparkles,
  ArrowRight, Lock, Globe, Zap, CheckCircle2, Mail
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

const useCases = [
  { title: "Consultation", desc: "Book expert time for strategy, code review, or design feedback.", icon: Sparkles },
  { title: "Project-Based", desc: "Full projects with dedicated workspaces and stage tracking.", icon: FolderKanban },
  { title: "Team Augmentation", desc: "Add vetted specialists to your existing team temporarily.", icon: Users },
  { title: "Full-Time Hiring", desc: "From gig to full-time hire with proven track record.", icon: Building2 },
];

const securityFeatures = [
  { icon: Lock, title: "Data Encryption", desc: "End-to-end encryption for all communications and files." },
  { icon: Shield, title: "NDA Support", desc: "Built-in NDA agreements before workspace access." },
  { icon: Globe, title: "GDPR Compliant", desc: "Full compliance with data protection regulations." },
  { icon: Zap, title: "IP Protection", desc: "Clear IP ownership policies and fingerprinted deliverables." },
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
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground"
            >
              Enterprise
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl"
            >
              Access Vetted <span className="text-muted-foreground">Student Talent</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground"
            >
              Tap into a curated pool of top-rated students for projects, consultations, and full-time hiring.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.a
                href="#contact"
                className="flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a Demo <ArrowRight size={16} />
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
              How Enterprise Mode Works
            </h2>
            <div className="grid gap-6 md:grid-cols-4">
              {pipelineSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <span className="mb-3 block font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-foreground">
                    <step.icon size={22} />
                  </div>
                  <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">Use Cases</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {useCases.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground">
                    <uc.icon size={20} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-heading font-bold text-foreground">{uc.title}</h3>
                    <p className="text-sm text-muted-foreground">{uc.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-14 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Security & Compliance
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {securityFeatures.map((sf, i) => (
                <motion.div
                  key={sf.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <sf.icon size={18} className="mb-3 text-foreground" />
                  <h4 className="mb-1 font-heading text-sm font-bold text-foreground">{sf.title}</h4>
                  <p className="text-xs text-muted-foreground">{sf.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <Mail size={32} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">Get in Touch</h2>
            <p className="mb-8 text-muted-foreground">
              Ready to bring top student talent to your team? Book a demo or contact our enterprise team.
            </p>
            <motion.a
              href="mailto:enterprise@skillswappr.com"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Sales <ArrowRight size={16} />
            </motion.a>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default EnterprisePage;
