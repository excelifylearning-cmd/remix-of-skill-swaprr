import { motion } from "framer-motion";
import {
  UserPlus, FileText, Search, ArrowLeftRight, MessageSquare,
  CheckCircle2, Star, Receipt, Shield, Zap, Users, Swords
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const journeySteps = [
  {
    icon: UserPlus, number: "01", title: "Sign Up & Verify",
    desc: "Create your account with email verification. Complete the guided tour and earn 100 skill points. Verify your university for a campus badge.",
    highlight: "+100 SP", color: "text-skill-green",
  },
  {
    icon: Search, number: "02", title: "Browse & Discover",
    desc: "Explore the marketplace by category, trending, or AI-recommended gigs. Filter by skill type, format, ELO range, and university.",
    highlight: "Smart Search", color: "text-foreground",
  },
  {
    icon: FileText, number: "03", title: "Create a Gig",
    desc: "Choose your format (direct swap, auction, co-creation). Define skills offered/wanted, set stages with point allocation, and publish.",
    highlight: "5 Formats", color: "text-court-blue",
  },
  {
    icon: ArrowLeftRight, number: "04", title: "Get Matched",
    desc: "Someone accepts your gig. Points balance the value difference. Both parties enter the dedicated gig workspace.",
    highlight: "Skill ↔ Skill", color: "text-foreground",
  },
  {
    icon: MessageSquare, number: "05", title: "Collaborate",
    desc: "Work together in the workspace with real-time messenger, whiteboard, video calls, file sharing, and AI quality monitoring.",
    highlight: "Full Workspace", color: "text-badge-gold",
  },
  {
    icon: CheckCircle2, number: "06", title: "Deliver & Review",
    desc: "Submit deliverables through the stage tracker. Buyer reviews, requests revisions or accepts. Both parties rate each other.",
    highlight: "Stage Insurance", color: "text-skill-green",
  },
  {
    icon: Receipt, number: "07", title: "Points Distributed",
    desc: "Points distributed minus 5% tax. Transaction code generated for verification. ELO updated based on performance.",
    highlight: "−5% Tax", color: "text-alert-red",
  },
  {
    icon: Star, number: "08", title: "Level Up",
    desc: "Earn achievements, maintain streaks, unlock new formats, and climb the ELO ladder. Join a guild to pool resources.",
    highlight: "∞ Growth", color: "text-badge-gold",
  },
];

const paths = [
  {
    title: "Buyer Path", icon: Search,
    steps: ["Browse marketplace or post a want", "Match with seller or bid on auction", "Enter workspace, track progress", "Receive work, accept or request revisions", "Rate and review"],
  },
  {
    title: "Seller Path", icon: Zap,
    steps: ["Create gig with skill offering", "Get matched or win auction", "Deliver through stage tracker", "Get rated, earn points", "Build portfolio and climb ELO"],
  },
  {
    title: "Guild Path", icon: Users,
    steps: ["Form or join a guild", "Pool treasury, lend points", "Delegate incoming gigs", "Compete in weekly guild wars", "Build collective reputation"],
  },
  {
    title: "Dispute Path", icon: Shield,
    steps: ["File a case with evidence", "Judges auto-assigned (users + AI + experts)", "Review period and voting", "Verdict: points redistributed", "ELO adjusted, one appeal allowed"],
  },
];

const HowItWorksPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--skill-green)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl"
            >
              From Signup to First Swap in{" "}
              <span className="text-muted-foreground">5 Minutes</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-xl text-lg text-muted-foreground"
            >
              Follow the journey from creating your account to earning skill points and building your portfolio.
            </motion.p>
          </div>
        </section>

        {/* Journey Steps */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2" />

              {journeySteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className={`relative mb-12 flex items-start gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`hidden flex-1 md:block ${i % 2 === 0 ? "text-right" : ""}`}>
                    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                        <span className={`rounded-full bg-surface-2 px-3 py-1 font-mono text-xs font-semibold ${step.color}`}>
                          {step.highlight}
                        </span>
                      </div>
                      <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>

                  {/* Node */}
                  <div className="absolute left-8 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-card">
                      <step.icon className="h-4 w-4 text-foreground" />
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" />

                  {/* Mobile card */}
                  <div className="ml-16 rounded-2xl border border-border bg-card p-6 md:hidden">
                    <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                    <h3 className="mb-1 mt-1 font-heading text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Paths */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center font-heading text-4xl font-bold text-foreground sm:text-5xl"
            >
              Choose Your Path
            </motion.h2>

            <div className="grid gap-6 md:grid-cols-2">
              {paths.map((path, i) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-foreground">
                      <path.icon size={20} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{path.title}</h3>
                  </div>
                  <ol className="space-y-3">
                    {path.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default HowItWorksPage;
