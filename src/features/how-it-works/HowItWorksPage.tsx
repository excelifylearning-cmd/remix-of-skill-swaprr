import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, FileText, Search, ArrowLeftRight, MessageSquare,
  CheckCircle2, Star, Receipt, Shield, Zap, Users, Swords,
  Gavel, Bot, FolderKanban, Video, PenTool, Eye, ArrowRight,
  Layers, Clock, Play, Sparkles, Target, Trophy, Crown, Coins,
  Timer, TrendingUp, Lock, Scale, ChevronRight, ExternalLink,
  Flame, GraduationCap, Lightbulb, Monitor, Smartphone, Globe,
  BarChart3, HelpCircle, ChevronDown
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const journeySteps = [
  {
    icon: UserPlus, number: "01", title: "Sign Up & Verify", color: "text-skill-green", highlight: "+100 SP",
    desc: "Create your account with email verification. Complete the guided tour and earn 100 skill points. Verify your university for a campus badge.",
    details: ["Email + university verification", "Guided onboarding tour with tips", "Earn 100 SP signup bonus instantly", "Set up profile, skills, and portfolio"],
    duration: "~2 min",
  },
  {
    icon: Search, number: "02", title: "Browse & Discover", color: "text-foreground", highlight: "AI Search",
    desc: "Explore the marketplace by category, trending, or AI-recommended gigs. Filter by skill type, format, ELO range, and university.",
    details: ["Natural language semantic search", "Filter by format, skill, ELO, university", "AI-recommended gigs based on your profile", "Save favorites and set up alerts"],
    duration: "~1 min",
  },
  {
    icon: FileText, number: "03", title: "Create or Accept a Gig", color: "text-court-blue", highlight: "7 Formats",
    desc: "Choose your format (direct swap, auction, co-creation, flash, etc). Define skills offered/wanted, set stages with point allocation, and publish.",
    details: ["AI-assisted gig description writing", "Dynamic pricing suggestions based on market", "Stage breakdown with point allocation", "Automatic escrow on acceptance"],
    duration: "~3 min",
  },
  {
    icon: ArrowLeftRight, number: "04", title: "Get Matched", color: "text-foreground", highlight: "Skill ↔ Skill",
    desc: "Someone accepts your gig or you win an auction. Points are locked in escrow. Both parties enter the dedicated workspace.",
    details: ["AI matching scores potential collaborators", "Point balancing for unequal skill values", "Escrow locks points per stage", "Both parties notified instantly"],
    duration: "Instant",
  },
  {
    icon: MessageSquare, number: "05", title: "Collaborate in Workspace", color: "text-badge-gold", highlight: "Full Suite",
    desc: "Work together with real-time messenger, whiteboard, video calls, file sharing, and AI quality monitoring — all in one place.",
    details: ["Real-time chat with 50+ language translation", "Shared whiteboard and video conferencing", "File library with version history", "AI quality panel running in background"],
    duration: "Varies",
  },
  {
    icon: Eye, number: "06", title: "Progressive Reveal", color: "text-foreground", highlight: "AI Monitor",
    desc: "Work is revealed stage-by-stage. AI predicts satisfaction and flags potential issues. Course-correct early, not at final delivery.",
    details: ["Staged work preview for buyers", "AI satisfaction prediction per stage", "Early warning system for quality issues", "Revision requests before final delivery"],
    duration: "Per stage",
  },
  {
    icon: CheckCircle2, number: "07", title: "Deliver & Review", color: "text-skill-green", highlight: "Insured",
    desc: "Submit deliverables through the stage tracker. Buyer reviews, requests revisions or accepts. Both parties rate each other honestly.",
    details: ["AI quality check on final deliverables", "Plagiarism detection scan", "Buyer acceptance with optional revisions", "Mutual rating and written review"],
    duration: "~1 day",
  },
  {
    icon: Receipt, number: "08", title: "Points Distributed", color: "text-badge-gold", highlight: "−5% Tax",
    desc: "Points are distributed minus 5% tax. A unique transaction code is generated for public verification. ELO is updated based on performance.",
    details: ["Automatic point distribution on acceptance", "5% tax funds platform challenges and prizes", "Unique transaction verification code", "ELO adjusted based on quality and speed"],
    duration: "Instant",
  },
  {
    icon: Trophy, number: "09", title: "Level Up & Repeat", color: "text-badge-gold", highlight: "∞ Growth",
    desc: "Earn achievements, maintain daily streaks for point multipliers, climb lifetime tiers, join or create a guild, and keep growing.",
    details: ["Unlock achievements with real benefits", "Streak multipliers up to 3x", "Climb Bronze → Diamond tiers", "Join guilds, compete in Guild Wars"],
    duration: "Ongoing",
  },
];

const lifecycle = [
  { step: "Gig Posted", desc: "Published to marketplace with format, skills, and point allocation", icon: FileText },
  { step: "Discovery", desc: "Found via search, AI recommendations, or category browsing", icon: Search },
  { step: "Match / Bid", desc: "Parties agree on terms, auction completes, or flash gig claimed", icon: ArrowLeftRight },
  { step: "Escrow Locked", desc: "Points locked in escrow per stage — both parties protected", icon: Lock },
  { step: "Workspace Active", desc: "Dedicated collaboration space with all tools activated", icon: MessageSquare },
  { step: "Stage Progress", desc: "Progressive reveal, AI monitoring, insurance per completed stage", icon: Eye },
  { step: "AI Quality Check", desc: "Plagiarism detection, quality scoring, compliance verification", icon: Bot },
  { step: "Delivery & Review", desc: "Final submission, buyer acceptance, mutual ratings", icon: CheckCircle2 },
  { step: "Points & Verification", desc: "Points distributed, tax deducted, transaction code generated", icon: Receipt },
  { step: "ELO & Achievements", desc: "Ratings updated, badges earned, streak maintained", icon: Trophy },
];

const paths = [
  {
    title: "Buyer Path", icon: Search, accent: "court-blue",
    steps: ["Browse marketplace or post a 'want' listing", "Match with seller or bid on active auctions", "Enter workspace, track real-time progress", "Receive work, accept or request revisions", "Rate, review, and verify transaction"],
    extras: ["Subscription management", "Favorites & saved gigs", "Bid tracking", "Spending analytics"],
  },
  {
    title: "Seller Path", icon: Zap, accent: "skill-green",
    steps: ["Create gig with your skill offering", "Get matched or win auction/flash gig", "Deliver through staged tracker", "Get rated, earn points + achievements", "Build portfolio and climb ELO ladder"],
    extras: ["Earnings dashboard", "Portfolio showcase", "SEO optimization", "Market rate alerts"],
  },
  {
    title: "Guild Path", icon: Users, accent: "badge-gold",
    steps: ["Form or join a guild team", "Pool treasury, lend points to members", "Delegate incoming gigs to specialists", "Compete in weekly Guild Wars", "Build collective reputation and portfolio"],
    extras: ["Treasury management", "Member approval", "Guild portfolio", "War strategy tools"],
  },
  {
    title: "Dispute Path", icon: Shield, accent: "alert-red",
    steps: ["File a case with evidence from workspace", "Judges auto-assigned (community + AI + experts)", "Review period with structured deliberation", "Verdict: points redistributed fairly", "ELO adjusted, one appeal opportunity"],
    extras: ["Auto evidence collection", "Weighted judge voting", "Appeal to senior panel", "Resolution analytics"],
  },
];

const formatComparison = [
  { format: "Direct Swap", icon: ArrowLeftRight, speed: "Medium", teamSize: "1v1", pointRange: "50–500 SP", best: "Balanced skill exchanges", complexity: "Low" },
  { format: "Auction", icon: Gavel, speed: "Slow", teamSize: "1 buyer, N sellers", pointRange: "100–2000 SP", best: "Competitive quality", complexity: "Medium" },
  { format: "Co-Creation", icon: Users, speed: "Variable", teamSize: "2–8 people", pointRange: "200–5000 SP", best: "Complex multi-skill projects", complexity: "High" },
  { format: "Flash Market", icon: Timer, speed: "Fast", teamSize: "1v1", pointRange: "25–200 SP", best: "Quick wins with multipliers", complexity: "Low" },
  { format: "Skill Fusion", icon: Layers, speed: "Medium", teamSize: "1–4 people", pointRange: "150–3000 SP", best: "Multi-skill deliverables", complexity: "Medium" },
  { format: "Projects", icon: FolderKanban, speed: "Slow", teamSize: "2–12 people", pointRange: "500–10000 SP", best: "Full product builds", complexity: "High" },
  { format: "Subscription", icon: TrendingUp, speed: "Recurring", teamSize: "1v1", pointRange: "50–500 SP/cycle", best: "Ongoing partnerships", complexity: "Low" },
];

const trustLayers = [
  { title: "Identity Verification", desc: "Email + university verification with optional government ID for enterprise gigs.", icon: UserPlus, color: "text-skill-green" },
  { title: "ELO Reputation", desc: "Chess-inspired dynamic rating reflecting skill quality, reliability, and consistency.", icon: Target, color: "text-badge-gold" },
  { title: "Escrow Insurance", desc: "Points locked per stage. Abandon protection ensures completed work is always compensated.", icon: Lock, color: "text-court-blue" },
  { title: "AI Monitoring", desc: "24/7 quality checks, plagiarism detection, scam pattern recognition, and satisfaction prediction.", icon: Bot, color: "text-foreground" },
  { title: "Digital Fingerprinting", desc: "Invisible watermarks on all deliverables for ownership proof and redistribution prevention.", icon: Shield, color: "text-skill-green" },
  { title: "Skill Court", desc: "Hybrid judging panel (community + AI + experts) resolves disputes within 48 hours on average.", icon: Scale, color: "text-alert-red" },
];

const workspaceTools = [
  { title: "Smart Messenger", desc: "Real-time chat with auto-translation in 50+ languages, voice notes, file sharing, and threaded conversations.", icon: MessageSquare, image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop" },
  { title: "Live Whiteboard", desc: "Infinite canvas for brainstorming, wireframing, and visual collaboration. Multi-user real-time editing.", icon: PenTool, image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop" },
  { title: "Video Conferencing", desc: "HD peer-to-peer video with screen sharing, virtual backgrounds, and automatic recording.", icon: Video, image: "https://images.unsplash.com/photo-1587825140708-dfaf18c30f01?w=600&h=400&fit=crop" },
  { title: "AI Quality Panel", desc: "Quality scoring (0–100), plagiarism detection, satisfaction prediction, and compliance checking.", icon: Sparkles, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop" },
  { title: "Stage Tracker", desc: "Visual progress with point allocation per stage. Built-in insurance for work protection.", icon: CheckCircle2, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" },
];

const platformStats = [
  { value: "5 min", label: "Signup to first swap" },
  { value: "96%", label: "Completion rate" },
  { value: "48h", label: "Avg dispute resolution" },
  { value: "4.8★", label: "Avg satisfaction" },
  { value: "89K+", label: "Gigs completed" },
  { value: "<1%", label: "Fraud rate" },
];

const faqs = [
  { q: "How long does it take to complete my first gig?", a: "Most first gigs are completed within 2-5 days. Flash market gigs can be done in hours. The average Direct Swap takes 4.2 days from match to completion." },
  { q: "What happens if someone abandons a gig mid-way?", a: "Stage Insurance protects you. Points are escrowed per stage, so you keep all points for completed stages. The abandoning party loses their escrowed points and takes an ELO hit." },
  { q: "How is the 5% tax used?", a: "The tax prevents inflation and funds the platform ecosystem: monthly challenges, Guild War prize pools, seasonal events, and platform development. Higher-tier users pay reduced rates (down to 1%)." },
  { q: "Can I use SkillSwappr if I'm not a student?", a: "Yes! While we're optimized for students, professionals and lifelong learners can join too. University verification gives you a campus badge and access to campus-specific marketplaces." },
  { q: "How does the Skill Court actually work?", a: "A 3-panel hybrid system: 25% community judges (randomly selected), 25% AI evidence analysis, and 50% high-ELO domain experts. Cases resolve in 48 hours on average. Each party gets one appeal." },
  { q: "What formats are best for beginners?", a: "Start with Direct Swap for simple 1-on-1 exchanges, or try Flash Market gigs for quick wins with point multipliers. As you build ELO, unlock Co-Creation, Auctions, and Projects." },
];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

const HowItWorksPage = () => {
  const [activeWorkspaceTool, setActiveWorkspaceTool] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* ═══ HERO ═══ */}
        <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--skill-green)/0.04),transparent_60%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/80 backdrop-blur-sm px-5 py-2">
              <Lightbulb size={14} className="text-badge-gold" />
              <span className="font-mono text-xs text-muted-foreground">How It Works</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              From Signup to First Swap in{" "}
              <span className="text-muted-foreground">5 Minutes</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto max-w-xl text-lg text-muted-foreground">
              Follow the complete journey from creating your account to earning skill points, building your portfolio, and leveling up.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto"
            >
              {platformStats.map((s, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-3 text-center">
                  <p className="font-heading text-lg font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ VIDEO WALKTHROUGH ═══ */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer"
            >
              <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop"
                  alt="Platform walkthrough"
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/90 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={28} className="text-background ml-1" fill="currentColor" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 right-4 rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1.5 font-mono text-xs text-foreground">
                  8:42
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Complete Platform Walkthrough</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Watch how a real gig goes from posting to completion</p>
                </div>
                <ExternalLink size={14} className="text-muted-foreground" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ JOURNEY STEPS (Enhanced Timeline) ═══ */}
        <section className="py-24 bg-surface-1">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Step by Step</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">The Complete Journey</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">9 steps from zero to your first completed swap. Every step is designed to be intuitive.</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2" />
              {journeySteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.05, duration: 0.5 }}
                  className={`relative mb-10 flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Desktop card */}
                  <div className={`hidden flex-1 md:block ${i % 2 === 0 ? "text-right" : ""}`}>
                    <motion.div
                      className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-muted-foreground/20"
                      whileHover={{ y: -3 }}
                    >
                      <div className={`mb-3 flex items-center justify-between ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                        <span className={`rounded-full bg-surface-2 px-3 py-1 font-mono text-xs font-semibold ${step.color}`}>{step.highlight}</span>
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-muted-foreground" />
                          <span className="font-mono text-[10px] text-muted-foreground">{step.duration}</span>
                        </div>
                      </div>
                      <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground mb-3">{step.desc}</p>
                      <ul className={`space-y-1.5 ${i % 2 === 0 ? "text-right" : ""}`}>
                        {step.details.map((d, j) => (
                          <li key={j} className={`flex items-center gap-2 text-xs text-muted-foreground/70 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                            <CheckCircle2 size={10} className="text-skill-green flex-shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Node */}
                  <div className="absolute left-8 z-10 -translate-x-1/2 md:left-1/2">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground bg-card"
                      whileHover={{ scale: 1.15 }}
                    >
                      <step.icon className="h-5 w-5 text-foreground" />
                    </motion.div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground">{step.number}</span>
                  </div>

                  <div className="hidden flex-1 md:block" />

                  {/* Mobile card */}
                  <div className="ml-16 rounded-2xl border border-border bg-card p-5 md:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-semibold ${step.color}`}>{step.highlight}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{step.duration}</span>
                    </div>
                    <h3 className="mb-1 font-heading text-base font-bold text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{step.desc}</p>
                    <ul className="space-y-1">
                      {step.details.map((d, j) => (
                        <li key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                          <CheckCircle2 size={9} className="text-skill-green flex-shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ WORKSPACE DEMO ═══ */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Workspace</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Your Collaboration Hub</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Every gig gets a dedicated workspace packed with professional-grade tools.</p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-5">
              {/* Tool tabs */}
              <div className="lg:col-span-2 space-y-2">
                {workspaceTools.map((tool, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveWorkspaceTool(i)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className={`w-full text-left rounded-xl p-4 transition-all ${
                      activeWorkspaceTool === i
                        ? "border border-foreground/20 bg-foreground/[0.04]"
                        : "border border-transparent hover:bg-surface-1"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        activeWorkspaceTool === i ? "bg-foreground/10 text-foreground" : "bg-surface-2 text-muted-foreground"
                      }`}>
                        <tool.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{tool.title}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{tool.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Preview area */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWorkspaceTool}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <div className="relative h-64 sm:h-80 overflow-hidden">
                      <img
                        src={workspaceTools[activeWorkspaceTool].image}
                        alt={workspaceTools[activeWorkspaceTool].title}
                        className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                        {workspaceTools[activeWorkspaceTool].title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {workspaceTools[activeWorkspaceTool].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ GIG LIFECYCLE ═══ */}
        <section className="bg-surface-1 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Lifecycle</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">The Gig Lifecycle</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Every gig follows this journey — with insurance and protection at every stage.</p>
            </motion.div>

            {/* Horizontal flow */}
            <div className="relative">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {lifecycle.map((l, i) => (
                  <motion.div
                    key={l.step}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border bg-card p-4 relative group hover:border-muted-foreground/20 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[9px] font-bold text-background">{i + 1}</span>
                      <l.icon size={13} className="text-muted-foreground" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground mb-1">{l.step}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{l.desc}</p>
                    {i < lifecycle.length - 1 && (
                      <ChevronRight size={12} className="absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hidden lg:block" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insurance callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 rounded-xl border border-skill-green/20 bg-skill-green/5 p-5"
            >
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-skill-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-skill-green">Stage Insurance Guarantee</p>
                  <p className="text-xs text-muted-foreground mt-1">If party A abandons at stage 3 of 5, party B gets their own allocated points back + party A's stage points. No work ever goes unprotected. This is enforced automatically by the escrow system.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FORMAT COMPARISON ═══ */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Formats</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Choose Your Format</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">7 distinct gig formats for every kind of collaboration. Compare and pick the right one.</p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Format</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Speed</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Size</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Point Range</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Complexity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {formatComparison.map((f, i) => (
                    <motion.tr
                      key={f.format}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-surface-1/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
                            <f.icon size={14} className="text-foreground" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{f.format}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          f.speed === "Fast" ? "bg-skill-green/10 text-skill-green" :
                          f.speed === "Slow" ? "bg-badge-gold/10 text-badge-gold" :
                          "bg-surface-2 text-muted-foreground"
                        }`}>{f.speed}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">{f.teamSize}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">{f.pointRange}</td>
                      <td className="py-3.5 px-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          f.complexity === "Low" ? "bg-skill-green/10 text-skill-green" :
                          f.complexity === "High" ? "bg-alert-red/10 text-alert-red" :
                          "bg-badge-gold/10 text-badge-gold"
                        }`}>{f.complexity}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">{f.best}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══ TRUST LAYERS ═══ */}
        <section className="py-24 bg-surface-1">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Trust</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">6 Layers of Protection</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Every exchange is protected by a multi-layered trust system that keeps everyone safe.</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trustLayers.map((layer, i) => (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-muted-foreground/20"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-black text-foreground">
                      {i + 1}
                    </div>
                    <layer.icon size={18} className={layer.color} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">{layer.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PATHS ═══ */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Your Role</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Whether you're buying, selling, leading a guild, or resolving disputes — there's a path for you.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {paths.map((path, i) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-muted-foreground/20"
                >
                  {/* Header */}
                  <div className={`px-6 py-4 border-b border-border bg-${path.accent}/[0.03]`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${path.accent}/10`}>
                        <path.icon size={18} className={`text-${path.accent}`} />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{path.title}</h3>
                    </div>
                  </div>
                  
                  {/* Steps */}
                  <div className="p-6">
                    <ol className="space-y-3 mb-5">
                      {path.steps.map((step, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-${path.accent}/10 font-mono text-[10px] font-bold text-${path.accent}`}>{j + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="border-t border-border pt-4">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Also includes</p>
                      <div className="flex flex-wrap gap-2">
                        {path.extras.map((e) => (
                          <span key={e} className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] text-muted-foreground">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-24 bg-surface-1">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">FAQ</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Common Questions</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Quick answers to the most-asked questions about how SkillSwappr works.</p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = expandedFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between p-5 text-left hover:bg-surface-1/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={16} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-12 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="py-28 px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-foreground mb-6">
              Ready to Start <span className="text-muted-foreground">Swapping?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 24,000+ students already trading skills, building portfolios, and leveling up.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-10 py-4 text-base font-semibold text-background"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--foreground)/0.15)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="/features"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Features
              </motion.a>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default HowItWorksPage;
