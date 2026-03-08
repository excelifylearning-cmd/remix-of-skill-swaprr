import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, Shield, FileText, ArrowRight, Flag,
  Star, User, Coins, AlertTriangle, Eye, MessageSquare, Video, PenTool,
  FolderOpen, RefreshCw, Users, Timer, ChevronDown, BarChart3, Zap,
  ArrowLeftRight, Gavel, Layers, FolderKanban, Flame
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const formatTemplates: Record<string, { icon: any; label: string; color: string }> = {
  "Direct Swap": { icon: ArrowLeftRight, label: "Direct Swap", color: "text-court-blue" },
  "Auction": { icon: Gavel, label: "Auction", color: "text-badge-gold" },
  "Co-Creation": { icon: Users, label: "Co-Creation Studio", color: "text-skill-green" },
  "Skill Fusion": { icon: Layers, label: "Skill Fusion", color: "text-foreground" },
  "Project": { icon: FolderKanban, label: "Project", color: "text-court-blue" },
  "Flash Market": { icon: Flame, label: "Flash Market", color: "text-alert-red" },
};

const mockTransaction = {
  code: "TXN-2026-0305-AK7B",
  status: "Verified",
  gig: "Logo Design ↔ React Development",
  format: "Direct Swap",
  date: "March 5, 2026",
  completedDate: "March 8, 2026",
  duration: "3 days",
  category: "Design ↔ Development",
  seller: {
    name: "Maya K.", elo: 1450, eloChange: "+12", rating: 4.9, university: "USC",
    tier: "Gold", gigs: 87, memberSince: "Jan 2026", avatar: "MK",
    ratingGiven: 5.0, reviewGiven: "Amazing developer, delivered pixel-perfect work ahead of schedule. Great communication throughout.",
  },
  buyer: {
    name: "James T.", elo: 1680, eloChange: "+8", rating: 5.0, university: "MIT",
    tier: "Platinum", gigs: 142, memberSince: "Dec 2025", avatar: "JT",
    ratingGiven: 4.9, reviewGiven: "Great designer with excellent communication. Logo exceeded my expectations.",
  },
  points: {
    sellerEarned: 30, buyerEarned: 25, sellerTax: 1.5, buyerTax: 1.25,
    total: 55, balancingPoints: 5,
  },
  stages: [
    { name: "Initial Concept", status: "Completed", points: 10, duration: "8h", deliverables: 3 },
    { name: "Revision Round", status: "Completed", points: 10, duration: "12h", deliverables: 5 },
    { name: "Final Delivery", status: "Completed", points: 10, duration: "6h", deliverables: 2 },
  ],
  quality: {
    score: 94, plagiarism: "Clean", aiAssessment: "Exceeds standards",
    originalityScore: 98, technicalScore: 91, creativityScore: 96,
  },
  workspace: {
    messagesCount: 47, videoCallMinutes: 35, whiteboardSessions: 3,
    filesShared: 14, revisionsRequested: 2, consultationMinutes: 15,
    avgResponseTime: "1.2h",
  },
  comments: [
    { from: "Maya K.", text: "Started with 3 initial concepts for the logo direction.", timestamp: "Mar 5, 10:30 AM", type: "milestone" },
    { from: "James T.", text: "Love concept #2! Let's refine that direction.", timestamp: "Mar 5, 2:15 PM", type: "feedback" },
    { from: "AI Quality", text: "Originality check passed. No similar designs found in database.", timestamp: "Mar 6, 9:00 AM", type: "system" },
    { from: "Maya K.", text: "Refined version with color variations attached.", timestamp: "Mar 6, 3:45 PM", type: "delivery" },
    { from: "James T.", text: "Perfect! React components are ready for review.", timestamp: "Mar 7, 11:20 AM", type: "delivery" },
    { from: "System", text: "Both parties confirmed satisfaction. Transaction completed.", timestamp: "Mar 8, 10:00 AM", type: "system" },
  ],
  timeline: [
    { event: "Gig Created", time: "Mar 5, 9:00 AM" },
    { event: "Both Parties Matched", time: "Mar 5, 9:15 AM" },
    { event: "Stage 1 Started", time: "Mar 5, 10:00 AM" },
    { event: "Stage 1 Completed", time: "Mar 5, 6:00 PM" },
    { event: "Stage 2 Started", time: "Mar 6, 9:00 AM" },
    { event: "Revision Requested", time: "Mar 6, 1:00 PM" },
    { event: "Stage 2 Completed", time: "Mar 6, 9:00 PM" },
    { event: "Stage 3 Started", time: "Mar 7, 10:00 AM" },
    { event: "Final Delivery Submitted", time: "Mar 7, 4:00 PM" },
    { event: "Both Parties Approved", time: "Mar 8, 10:00 AM" },
    { event: "Transaction Verified", time: "Mar 8, 10:01 AM" },
  ],
  fingerprint: "df8a2c...e91b4f",
  disputeHistory: "None",
};

const TransactionLookupPage = () => {
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSearch = () => {
    if (!code.trim()) return;
    setSearching(true);
    setFound(false);
    setTimeout(() => {
      setSearching(false);
      setFound(true);
    }, 1500);
  };

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);
  const fmt = formatTemplates[mockTransaction.format];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--skill-green)/0.03),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Shield size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">Transaction Lookup</h1>
              <p className="mb-10 text-lg text-muted-foreground">Verify any gig transaction with its unique code. Full transparency.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto max-w-lg">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter transaction code (e.g., TXN-2026-...)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                  />
                </div>
                <motion.button onClick={handleSearch} className="flex h-14 items-center gap-2 rounded-2xl bg-foreground px-6 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Verify
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Searching */}
        <AnimatePresence>
          {searching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
              <motion.div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-border border-t-foreground" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <p className="text-sm text-muted-foreground">Verifying transaction...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {found && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
              <div className="mx-auto max-w-5xl px-6">

                {/* Verification Banner */}
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-8 flex items-center gap-4 rounded-2xl border border-skill-green/20 bg-skill-green/5 p-6">
                  <CheckCircle2 size={32} className="text-skill-green flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-bold text-foreground">Transaction Verified ✓</h2>
                    <p className="font-mono text-sm text-muted-foreground">{mockTransaction.code}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-muted-foreground">Digital Fingerprint</p>
                    <p className="font-mono text-xs text-foreground">{mockTransaction.fingerprint}</p>
                  </div>
                </motion.div>

                {/* Format Badge + Summary */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className={`flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium ${fmt.color}`}>
                      <fmt.icon size={14} /> {fmt.label}
                    </div>
                    <span className="rounded-full bg-skill-green/10 px-2.5 py-0.5 text-[10px] font-medium text-skill-green">{mockTransaction.status}</span>
                    <span className="text-xs text-muted-foreground">{mockTransaction.category}</span>
                  </div>
                  <h3 className="mb-4 font-heading text-xl font-bold text-foreground">{mockTransaction.gig}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Created", value: mockTransaction.date },
                      { label: "Completed", value: mockTransaction.completedDate },
                      { label: "Duration", value: mockTransaction.duration },
                      { label: "Disputes", value: mockTransaction.disputeHistory },
                    ].map((d) => (
                      <div key={d.label}>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</span>
                        <p className="text-sm font-medium text-foreground">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parties */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Party A (Seller)", data: mockTransaction.seller, earned: mockTransaction.points.sellerEarned, tax: mockTransaction.points.sellerTax },
                    { label: "Party B (Buyer)", data: mockTransaction.buyer, earned: mockTransaction.points.buyerEarned, tax: mockTransaction.points.buyerTax },
                  ].map((party) => (
                    <div key={party.label} className="rounded-2xl border border-border bg-card p-6">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{party.label}</span>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground">{party.data.avatar}</div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{party.data.name}</p>
                          <p className="text-[10px] text-muted-foreground">{party.data.university} · {party.data.tier}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div><p className="font-mono text-sm font-bold text-foreground">{party.data.elo}</p><p className="text-[9px] text-muted-foreground">ELO</p></div>
                        <div><p className="font-mono text-sm font-bold text-skill-green">{party.data.eloChange}</p><p className="text-[9px] text-muted-foreground">Change</p></div>
                        <div><p className="font-mono text-sm font-bold text-foreground">{party.data.gigs}</p><p className="text-[9px] text-muted-foreground">Total Gigs</p></div>
                      </div>
                      <div className="mt-4 rounded-xl bg-surface-1 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Star size={12} className="fill-badge-gold text-badge-gold" />
                          <span className="font-mono text-xs text-badge-gold">{party.data.ratingGiven}</span>
                          <span className="text-[10px] text-muted-foreground">rating given</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground italic">"{party.data.reviewGiven}"</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-skill-green">+{party.earned} SP earned</span>
                        <span className="text-alert-red">-{party.tax} SP tax</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Points Breakdown */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">Points Breakdown</h3>
                  <div className="grid gap-3 sm:grid-cols-5">
                    {[
                      { label: "Seller Earned", value: `${mockTransaction.points.sellerEarned} SP`, color: "text-skill-green" },
                      { label: "Buyer Earned", value: `${mockTransaction.points.buyerEarned} SP`, color: "text-skill-green" },
                      { label: "Balancing Points", value: `${mockTransaction.points.balancingPoints} SP`, color: "text-court-blue" },
                      { label: "Total Tax", value: `${mockTransaction.points.sellerTax + mockTransaction.points.buyerTax} SP`, color: "text-alert-red" },
                      { label: "Total Value", value: `${mockTransaction.points.total} SP`, color: "text-foreground" },
                    ].map((p) => (
                      <div key={p.label} className="rounded-xl bg-surface-1 p-3 text-center">
                        <p className={`font-mono text-lg font-bold ${p.color}`}>{p.value}</p>
                        <p className="text-[9px] text-muted-foreground">{p.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Tracker */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">Stage Completion</h3>
                  <div className="space-y-3">
                    {mockTransaction.stages.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-xl bg-surface-1 p-4">
                        <CheckCircle2 size={18} className="text-skill-green flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">{s.name}</span>
                          <div className="flex gap-3 mt-1">
                            <span className="text-[10px] text-muted-foreground">Duration: {s.duration}</span>
                            <span className="text-[10px] text-muted-foreground">{s.deliverables} deliverables</span>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-semibold text-skill-green">+{s.points} SP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workspace Activity */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">Workspace Activity</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { icon: MessageSquare, label: "Messages", value: mockTransaction.workspace.messagesCount.toString(), color: "text-court-blue" },
                      { icon: Video, label: "Video Calls", value: `${mockTransaction.workspace.videoCallMinutes} min`, color: "text-skill-green" },
                      { icon: PenTool, label: "Whiteboard Sessions", value: mockTransaction.workspace.whiteboardSessions.toString(), color: "text-badge-gold" },
                      { icon: FolderOpen, label: "Files Shared", value: mockTransaction.workspace.filesShared.toString(), color: "text-foreground" },
                      { icon: RefreshCw, label: "Revisions", value: mockTransaction.workspace.revisionsRequested.toString(), color: "text-muted-foreground" },
                      { icon: Users, label: "Consultations", value: `${mockTransaction.workspace.consultationMinutes} min`, color: "text-court-blue" },
                      { icon: Timer, label: "Avg Response", value: mockTransaction.workspace.avgResponseTime, color: "text-skill-green" },
                      { icon: BarChart3, label: "Engagement", value: "High", color: "text-badge-gold" },
                    ].map((a) => (
                      <div key={a.label} className="flex items-center gap-3 rounded-xl bg-surface-1 p-3">
                        <a.icon size={16} className={a.color} />
                        <div>
                          <p className="font-mono text-sm font-bold text-foreground">{a.value}</p>
                          <p className="text-[9px] text-muted-foreground">{a.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Quality Assessment */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">AI Quality Assessment</h3>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                      { label: "Overall", value: mockTransaction.quality.score, color: "text-skill-green" },
                      { label: "Originality", value: mockTransaction.quality.originalityScore, color: "text-court-blue" },
                      { label: "Technical", value: mockTransaction.quality.technicalScore, color: "text-foreground" },
                      { label: "Creativity", value: mockTransaction.quality.creativityScore, color: "text-badge-gold" },
                      { label: "Plagiarism", value: mockTransaction.quality.plagiarism, color: "text-skill-green", isText: true },
                      { label: "Verdict", value: mockTransaction.quality.aiAssessment, color: "text-foreground", isText: true },
                    ].map((q: any) => (
                      <div key={q.label} className="rounded-xl bg-surface-1 p-3 text-center">
                        <p className={`font-mono ${q.isText ? "text-sm" : "text-2xl"} font-bold ${q.color}`}>{q.value}</p>
                        <p className="text-[9px] text-muted-foreground">{q.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Comments */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <button onClick={() => toggleSection("comments")} className="flex w-full items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-foreground">Activity Log ({mockTransaction.comments.length})</h3>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expandedSection === "comments" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "comments" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-4 space-y-3">
                          {mockTransaction.comments.map((c, i) => (
                            <div key={i} className={`flex gap-3 rounded-xl p-3 ${c.type === "system" ? "bg-surface-2" : "bg-surface-1"}`}>
                              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                c.type === "system" ? "bg-foreground/10 text-muted-foreground" : c.type === "delivery" ? "bg-skill-green/10 text-skill-green" : c.type === "milestone" ? "bg-badge-gold/10 text-badge-gold" : "bg-court-blue/10 text-court-blue"
                              }`}>
                                {c.from.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-foreground">{c.from}</span>
                                  <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Timeline */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <button onClick={() => toggleSection("timeline")} className="flex w-full items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-foreground">Full Timeline ({mockTransaction.timeline.length} events)</h3>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expandedSection === "timeline" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "timeline" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-4 relative ml-3 border-l border-border pl-6 space-y-4">
                          {mockTransaction.timeline.map((t, i) => (
                            <div key={i} className="relative">
                              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
                              <p className="text-sm font-medium text-foreground">{t.event}</p>
                              <p className="text-[10px] text-muted-foreground">{t.time}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Report */}
                <div className="rounded-2xl border border-border bg-surface-1 p-6 text-center">
                  <Flag size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="mb-3 text-sm text-muted-foreground">Something doesn't look right?</p>
                  <motion.button className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <AlertTriangle size={14} /> Flag This Transaction
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default TransactionLookupPage;
