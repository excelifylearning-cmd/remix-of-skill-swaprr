import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, Shield, FileText, ArrowRight, Flag,
  Star, User, Coins, AlertTriangle, Eye, MessageSquare, Video, PenTool,
  FolderOpen, RefreshCw, Users, Timer, ChevronDown, BarChart3, Zap,
  ArrowLeftRight, Gavel, Layers, FolderKanban, Flame, Lock, Globe,
  Fingerprint, TrendingUp, Award, Heart, ThumbsUp, BookOpen, Calendar,
  Download, Upload, Link2, Cpu, Activity, Hash, Percent, Target,
  Lightbulb, MapPin, Briefcase, GraduationCap, CircleDollarSign,
  ShieldCheck, Scale, FileCheck, Headphones, Mic, Image, Code,
  Database, Wifi, Monitor, Smartphone, Chrome, ExternalLink, Copy,
  Share2, Bookmark, Bell, Settings, HelpCircle, Info, AlertCircle,
  XCircle, MinusCircle, PlusCircle, ArrowUpRight, ArrowDownRight,
  TrendingDown, RotateCcw, Package, Truck, CreditCard, Receipt,
  ClipboardCheck, ClipboardList, Sparkles, Wand2, Bot, Brain
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";

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
    badges: ["Top Designer", "Fast Delivery", "5-Star Streak"],
    skills: ["Logo Design", "Brand Identity", "Illustration", "UI Design"],
    completionRate: 96, repeatClients: 34, avgDeliveryTime: "2.1 days",
    responseRate: 99, profileViews: 1240, endorsements: 56,
  },
  buyer: {
    name: "James T.", elo: 1680, eloChange: "+8", rating: 5.0, university: "MIT",
    tier: "Platinum", gigs: 142, memberSince: "Dec 2025", avatar: "JT",
    ratingGiven: 4.9, reviewGiven: "Great designer with excellent communication. Logo exceeded my expectations.",
    badges: ["Code Master", "Mentor", "Community Leader"],
    skills: ["React", "TypeScript", "Node.js", "System Design"],
    completionRate: 99, repeatClients: 67, avgDeliveryTime: "1.8 days",
    responseRate: 100, profileViews: 2830, endorsements: 112,
  },
  points: {
    sellerEarned: 30, buyerEarned: 25, sellerTax: 1.5, buyerTax: 1.25,
    total: 55, balancingPoints: 5, bonusPoints: 8, streakMultiplier: 1.2,
    seasonalBonus: 3,
  },
  stages: [
    { name: "Initial Concept", status: "Completed", points: 10, duration: "8h", deliverables: 3, feedback: "Excellent start" },
    { name: "Revision Round", status: "Completed", points: 10, duration: "12h", deliverables: 5, feedback: "Great attention to detail" },
    { name: "Final Delivery", status: "Completed", points: 10, duration: "6h", deliverables: 2, feedback: "Perfect execution" },
  ],
  quality: {
    score: 94, plagiarism: "Clean", aiAssessment: "Exceeds standards",
    originalityScore: 98, technicalScore: 91, creativityScore: 96,
    communicationScore: 97, professionalismScore: 95, innovationScore: 89,
    codeQuality: 93, designConsistency: 96, accessibilityScore: 88,
  },
  workspace: {
    messagesCount: 47, videoCallMinutes: 35, whiteboardSessions: 3,
    filesShared: 14, revisionsRequested: 2, consultationMinutes: 15,
    avgResponseTime: "1.2h", screenshares: 4, codeReviews: 3,
    liveCollabMinutes: 22, annotations: 18, reactions: 34,
    pinnedMessages: 6, threadCount: 12, pollsCreated: 2,
  },
  deliverables: [
    { name: "Logo_Final_v3.svg", type: "SVG", size: "2.4 MB", uploadedBy: "Maya K.", date: "Mar 7", status: "Approved" },
    { name: "Logo_Variations.zip", type: "ZIP", size: "18.6 MB", uploadedBy: "Maya K.", date: "Mar 7", status: "Approved" },
    { name: "Brand_Guidelines.pdf", type: "PDF", size: "4.1 MB", uploadedBy: "Maya K.", date: "Mar 7", status: "Approved" },
    { name: "react-app-src.zip", type: "ZIP", size: "12.3 MB", uploadedBy: "James T.", date: "Mar 8", status: "Approved" },
    { name: "API_Documentation.md", type: "MD", size: "156 KB", uploadedBy: "James T.", date: "Mar 8", status: "Approved" },
    { name: "Component_Library.tsx", type: "TSX", size: "89 KB", uploadedBy: "James T.", date: "Mar 8", status: "Approved" },
    { name: "Color_Palette.png", type: "PNG", size: "1.2 MB", uploadedBy: "Maya K.", date: "Mar 6", status: "Approved" },
    { name: "Mockup_Presentation.fig", type: "FIG", size: "34 MB", uploadedBy: "Maya K.", date: "Mar 6", status: "Approved" },
  ],
  escrow: {
    sellerDeposit: 30, buyerDeposit: 25, escrowFee: 2.75,
    releaseDate: "Mar 8, 10:05 AM", escrowId: "ESC-2026-0305-7K",
    holdDuration: "72h", autoRelease: true, insuranceCoverage: true,
    escrowStatus: "Released",
  },
  security: {
    ipVerification: "Passed", deviceFingerprint: "Matched",
    twoFactorAuth: "Both Enabled", encryptionLevel: "AES-256",
    antiCheatScan: "Clean", vpnDetection: "No VPN",
    geoVerification: "Consistent", sessionIntegrity: "Valid",
    riskScore: 2, maxRisk: 100, threatLevel: "Low",
  },
  compliance: {
    termsAccepted: true, ndaSigned: true, ipTransferClear: true,
    contentModeration: "Passed", exportCompliance: "N/A",
    dataRetention: "90 days", gdprCompliant: true,
    copyrightCheck: "Clear",
  },
  skillImpact: {
    seller: { before: { "Logo Design": 85, "Brand Identity": 78 }, after: { "Logo Design": 88, "Brand Identity": 82 } },
    buyer: { before: { "React": 92, "TypeScript": 88 }, after: { "React": 93, "TypeScript": 89 } },
  },
  performance: {
    avgSimilarDuration: "4.2 days", durationPercentile: 82,
    avgSimilarQuality: 87, qualityPercentile: 91,
    avgSimilarPoints: 42, pointsPercentile: 78,
    categoryRank: 12, totalInCategory: 1456,
  },
  recommendations: [
    { title: "Advanced UI/UX Design", match: 94, reason: "Based on Maya's logo skills" },
    { title: "Full-Stack Development", match: 89, reason: "Extends James's React expertise" },
    { title: "Motion Graphics", match: 82, reason: "Natural progression from design" },
  ],
  communicationHeatmap: [
    { day: "Mon", hours: [0,0,1,0,0,0,0,2,5,8,6,4,3,5,7,6,4,3,2,1,0,0,0,0] },
    { day: "Tue", hours: [0,0,0,0,0,0,1,3,6,9,7,5,2,4,8,7,5,4,2,1,1,0,0,0] },
    { day: "Wed", hours: [0,0,0,0,0,0,0,2,4,6,5,3,1,3,5,4,3,2,1,0,0,0,0,0] },
  ],
  deviceInfo: {
    seller: { device: "MacBook Pro 16\"", os: "macOS Sonoma", browser: "Chrome 122", resolution: "3456×2234" },
    buyer: { device: "Dell XPS 15", os: "Windows 11", browser: "Firefox 124", resolution: "3840×2400" },
  },
  aiInsights: [
    { insight: "Communication frequency was 40% above average for similar gigs, indicating strong collaboration.", type: "positive" },
    { insight: "Both parties maintained a 97% alignment on project scope throughout, significantly reducing revision cycles.", type: "positive" },
    { insight: "Delivery speed was in the top 18% for Design ↔ Development swaps, without sacrificing quality.", type: "positive" },
    { insight: "File sharing patterns suggest efficient workflow—no redundant uploads detected.", type: "neutral" },
    { insight: "Consider enabling auto-milestone for future gigs to streamline stage transitions.", type: "suggestion" },
  ],
  comments: [
    { from: "Maya K.", text: "Started with 3 initial concepts for the logo direction.", timestamp: "Mar 5, 10:30 AM", type: "milestone" },
    { from: "James T.", text: "Love concept #2! Let's refine that direction.", timestamp: "Mar 5, 2:15 PM", type: "feedback" },
    { from: "AI Quality", text: "Originality check passed. No similar designs found in database.", timestamp: "Mar 6, 9:00 AM", type: "system" },
    { from: "Maya K.", text: "Refined version with color variations attached.", timestamp: "Mar 6, 3:45 PM", type: "delivery" },
    { from: "James T.", text: "Perfect! React components are ready for review.", timestamp: "Mar 7, 11:20 AM", type: "delivery" },
    { from: "AI Quality", text: "Code quality analysis complete. Score: 93/100. No vulnerabilities found.", timestamp: "Mar 7, 2:00 PM", type: "system" },
    { from: "Maya K.", text: "Brand guidelines document finalized and uploaded.", timestamp: "Mar 7, 4:30 PM", type: "delivery" },
    { from: "James T.", text: "API documentation added. All endpoints covered.", timestamp: "Mar 8, 9:00 AM", type: "delivery" },
    { from: "System", text: "Both parties confirmed satisfaction. Transaction completed.", timestamp: "Mar 8, 10:00 AM", type: "system" },
    { from: "System", text: "Escrow funds released to both parties.", timestamp: "Mar 8, 10:05 AM", type: "system" },
  ],
  timeline: [
    { event: "Gig Created", time: "Mar 5, 9:00 AM", detail: "Auto-matched based on skill compatibility" },
    { event: "Both Parties Matched", time: "Mar 5, 9:15 AM", detail: "95% compatibility score" },
    { event: "Escrow Deposits Locked", time: "Mar 5, 9:20 AM", detail: "55 SP total secured" },
    { event: "NDA Auto-Signed", time: "Mar 5, 9:25 AM", detail: "Standard mutual NDA" },
    { event: "Workspace Created", time: "Mar 5, 9:30 AM", detail: "Chat, video, whiteboard enabled" },
    { event: "Stage 1 Started", time: "Mar 5, 10:00 AM", detail: "Initial Concept phase" },
    { event: "First Video Call", time: "Mar 5, 11:00 AM", detail: "22 min kickoff call" },
    { event: "Stage 1 Completed", time: "Mar 5, 6:00 PM", detail: "3 deliverables submitted" },
    { event: "AI Quality Check #1", time: "Mar 5, 6:05 PM", detail: "Score: 91/100" },
    { event: "Stage 2 Started", time: "Mar 6, 9:00 AM", detail: "Revision Round" },
    { event: "Whiteboard Session", time: "Mar 6, 10:30 AM", detail: "Color palette exploration" },
    { event: "Revision Requested", time: "Mar 6, 1:00 PM", detail: "Minor color adjustment" },
    { event: "Revision Delivered", time: "Mar 6, 3:45 PM", detail: "Updated with variations" },
    { event: "Stage 2 Completed", time: "Mar 6, 9:00 PM", detail: "5 deliverables submitted" },
    { event: "AI Quality Check #2", time: "Mar 6, 9:05 PM", detail: "Score: 94/100" },
    { event: "Stage 3 Started", time: "Mar 7, 10:00 AM", detail: "Final Delivery" },
    { event: "Code Review Session", time: "Mar 7, 11:00 AM", detail: "Live pair review" },
    { event: "Final Delivery Submitted", time: "Mar 7, 4:00 PM", detail: "All assets packaged" },
    { event: "Final AI Quality Check", time: "Mar 7, 4:05 PM", detail: "Score: 94/100 — Exceeds standards" },
    { event: "Buyer Approved", time: "Mar 8, 9:45 AM", detail: "Rated 5.0 stars" },
    { event: "Seller Approved", time: "Mar 8, 9:50 AM", detail: "Rated 4.9 stars" },
    { event: "Both Parties Approved", time: "Mar 8, 10:00 AM", detail: "Mutual satisfaction confirmed" },
    { event: "Transaction Verified", time: "Mar 8, 10:01 AM", detail: "Blockchain hash generated" },
    { event: "Escrow Released", time: "Mar 8, 10:05 AM", detail: "Points distributed to both parties" },
    { event: "Badges Awarded", time: "Mar 8, 10:10 AM", detail: "Fast Delivery, Quality Work" },
    { event: "Skills Updated", time: "Mar 8, 10:15 AM", detail: "ELO ratings recalculated" },
  ],
  fingerprint: "df8a2c...e91b4f",
  blockchainHash: "0x7f3a...d91e",
  disputeHistory: "None",
  satisfactionSurvey: {
    seller: { overall: 5, communication: 5, quality: 5, timeliness: 4, wouldWorkAgain: true },
    buyer: { overall: 5, communication: 5, quality: 5, timeliness: 5, wouldWorkAgain: true },
  },
};

// Collapsible Section component
const Section = ({ id, title, icon: Icon, count, expanded, onToggle, children }: {
  id: string; title: string; icon: any; count?: number; expanded: string | null; onToggle: (s: string) => void; children: React.ReactNode;
}) => (
  <div className="mb-4 rounded-2xl border border-border bg-card overflow-hidden">
    <button onClick={() => onToggle(id)} className="flex w-full items-center gap-3 p-5 text-left hover:bg-surface-1/50 transition-colors">
      <Icon size={16} className="text-muted-foreground" />
      <h3 className="flex-1 font-heading text-sm font-bold text-foreground">
        {title} {count !== undefined && <span className="ml-1 text-muted-foreground font-normal">({count})</span>}
      </h3>
      <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${expanded === id ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {expanded === id && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
          <div className="px-5 pb-5 pt-0">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color = "text-foreground", sub }: { icon: any; label: string; value: string; color?: string; sub?: string }) => (
  <div className="flex items-center gap-3 rounded-xl bg-surface-1 p-3.5">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
      <Icon size={15} className={color} />
    </div>
    <div className="min-w-0">
      <p className={`font-mono text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
      {sub && <p className="text-[8px] text-muted-foreground/60">{sub}</p>}
    </div>
  </div>
);

const QualityBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs font-bold ${color}`}>{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`h-full rounded-full ${
          color === "text-skill-green" ? "bg-skill-green" :
          color === "text-court-blue" ? "bg-court-blue" :
          color === "text-badge-gold" ? "bg-badge-gold" : "bg-foreground"
        }`}
      />
    </div>
  </div>
);

const TransactionLookupPage = () => {
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "security">("overview");

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
  const txn = mockTransaction;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backLabel="Transaction" />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--skill-green)/0.03),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Shield size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">Transaction Lookup</h1>
              <p className="mb-10 text-lg text-muted-foreground">Verify any gig transaction with its unique code. Full transparency, every detail.</p>
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
              <p className="text-sm text-muted-foreground">Verifying transaction on-chain...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {found && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
              <div className="mx-auto max-w-6xl px-6">

                {/* Verification Banner */}
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-6 flex items-center gap-4 rounded-2xl border border-skill-green/20 bg-skill-green/5 p-5">
                  <CheckCircle2 size={32} className="text-skill-green flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading text-lg font-bold text-foreground">Transaction Verified ✓</h2>
                    <p className="font-mono text-sm text-muted-foreground">{txn.code}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Digital Fingerprint</p>
                      <p className="font-mono text-xs text-foreground">{txn.fingerprint}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Blockchain Hash</p>
                      <p className="font-mono text-xs text-foreground">{txn.blockchainHash}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="mb-6 flex gap-1 rounded-xl bg-surface-1 p-1">
                  {(["overview", "details", "security"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        activeTab === tab
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* === OVERVIEW TAB === */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="overview">
                    {/* Format Badge + Summary */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <div className={`flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium ${fmt.color}`}>
                          <fmt.icon size={14} /> {fmt.label}
                        </div>
                        <span className="rounded-full bg-skill-green/10 px-2.5 py-0.5 text-[10px] font-medium text-skill-green">{txn.status}</span>
                        <span className="text-xs text-muted-foreground">{txn.category}</span>
                        <span className="ml-auto rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground">Risk: {txn.security.riskScore}/{txn.security.maxRisk}</span>
                      </div>
                      <h3 className="mb-4 font-heading text-xl font-bold text-foreground">{txn.gig}</h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                          { label: "Created", value: txn.date },
                          { label: "Completed", value: txn.completedDate },
                          { label: "Duration", value: txn.duration },
                          { label: "Disputes", value: txn.disputeHistory },
                          { label: "Threat Level", value: txn.security.threatLevel },
                        ].map((d) => (
                          <div key={d.label}>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</span>
                            <p className="text-sm font-medium text-foreground">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="mb-4 grid gap-4 lg:grid-cols-2">
                      {[
                        { label: "Party A (Seller)", data: txn.seller, earned: txn.points.sellerEarned, tax: txn.points.sellerTax },
                        { label: "Party B (Buyer)", data: txn.buyer, earned: txn.points.buyerEarned, tax: txn.points.buyerTax },
                      ].map((party) => (
                        <div key={party.label} className="rounded-2xl border border-border bg-card p-5">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{party.label}</span>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground">{party.data.avatar}</div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{party.data.name}</p>
                              <p className="text-[10px] text-muted-foreground">{party.data.university} · {party.data.tier} · Since {party.data.memberSince}</p>
                            </div>
                          </div>
                          {/* Badges */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {party.data.badges.map((b) => (
                              <span key={b} className="rounded-full bg-badge-gold/10 px-2 py-0.5 text-[9px] font-medium text-badge-gold">{b}</span>
                            ))}
                          </div>
                          {/* Stats Grid */}
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.elo}</p>
                              <p className="text-[8px] text-muted-foreground">ELO</p>
                            </div>
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-skill-green">{party.data.eloChange}</p>
                              <p className="text-[8px] text-muted-foreground">Change</p>
                            </div>
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.gigs}</p>
                              <p className="text-[8px] text-muted-foreground">Gigs</p>
                            </div>
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.completionRate}%</p>
                              <p className="text-[8px] text-muted-foreground">Completion</p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.repeatClients}</p>
                              <p className="text-[8px] text-muted-foreground">Repeat</p>
                            </div>
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.responseRate}%</p>
                              <p className="text-[8px] text-muted-foreground">Response</p>
                            </div>
                            <div className="rounded-lg bg-surface-1 p-2 text-center">
                              <p className="font-mono text-xs font-bold text-foreground">{party.data.endorsements}</p>
                              <p className="text-[8px] text-muted-foreground">Endorsed</p>
                            </div>
                          </div>
                          {/* Skills */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {party.data.skills.map((s) => (
                              <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">{s}</span>
                            ))}
                          </div>
                          {/* Review */}
                          <div className="mt-3 rounded-xl bg-surface-1 p-3">
                            <div className="mb-1.5 flex items-center gap-2">
                              <Star size={11} className="fill-badge-gold text-badge-gold" />
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
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Coins size={15} className="text-badge-gold" /> Points Economy
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
                        {[
                          { label: "Seller Earned", value: `${txn.points.sellerEarned} SP`, color: "text-skill-green" },
                          { label: "Buyer Earned", value: `${txn.points.buyerEarned} SP`, color: "text-skill-green" },
                          { label: "Balancing", value: `${txn.points.balancingPoints} SP`, color: "text-court-blue" },
                          { label: "Bonus", value: `${txn.points.bonusPoints} SP`, color: "text-badge-gold" },
                          { label: "Streak ×", value: `${txn.points.streakMultiplier}x`, color: "text-badge-gold" },
                          { label: "Seasonal", value: `+${txn.points.seasonalBonus} SP`, color: "text-court-blue" },
                          { label: "Total Tax", value: `${txn.points.sellerTax + txn.points.buyerTax} SP`, color: "text-alert-red" },
                          { label: "Net Value", value: `${txn.points.total} SP`, color: "text-foreground" },
                        ].map((p) => (
                          <div key={p.label} className="rounded-xl bg-surface-1 p-2.5 text-center">
                            <p className={`font-mono text-base font-bold ${p.color}`}>{p.value}</p>
                            <p className="text-[8px] text-muted-foreground">{p.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stage Tracker */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <ClipboardCheck size={15} className="text-skill-green" /> Stage Completion
                      </h3>
                      <div className="space-y-2">
                        {txn.stages.map((s, i) => (
                          <div key={i} className="flex items-center gap-4 rounded-xl bg-surface-1 p-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-skill-green/10">
                              <CheckCircle2 size={16} className="text-skill-green" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{s.name}</span>
                                <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[9px] text-skill-green">{s.status}</span>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={9} /> {s.duration}</span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><FileText size={9} /> {s.deliverables} deliverables</span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><ThumbsUp size={9} /> {s.feedback}</span>
                              </div>
                            </div>
                            <span className="font-mono text-sm font-semibold text-skill-green">+{s.points} SP</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Quality Assessment — Full Bars */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Brain size={15} className="text-court-blue" /> AI Quality Assessment
                      </h3>
                      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                        <QualityBar label="Overall Score" value={txn.quality.score} color="text-skill-green" />
                        <QualityBar label="Originality" value={txn.quality.originalityScore} color="text-court-blue" />
                        <QualityBar label="Technical" value={txn.quality.technicalScore} color="text-foreground" />
                        <QualityBar label="Creativity" value={txn.quality.creativityScore} color="text-badge-gold" />
                        <QualityBar label="Communication" value={txn.quality.communicationScore} color="text-skill-green" />
                        <QualityBar label="Professionalism" value={txn.quality.professionalismScore} color="text-court-blue" />
                        <QualityBar label="Innovation" value={txn.quality.innovationScore} color="text-badge-gold" />
                        <QualityBar label="Code Quality" value={txn.quality.codeQuality} color="text-foreground" />
                        <QualityBar label="Design Consistency" value={txn.quality.designConsistency} color="text-skill-green" />
                        <QualityBar label="Accessibility" value={txn.quality.accessibilityScore} color="text-court-blue" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-lg bg-skill-green/10 px-3 py-1.5 text-xs text-skill-green flex items-center gap-1.5">
                          <ShieldCheck size={12} /> Plagiarism: {txn.quality.plagiarism}
                        </div>
                        <div className="rounded-lg bg-court-blue/10 px-3 py-1.5 text-xs text-court-blue flex items-center gap-1.5">
                          <Sparkles size={12} /> AI Verdict: {txn.quality.aiAssessment}
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Bot size={15} className="text-badge-gold" /> AI Insights
                      </h3>
                      <div className="space-y-2">
                        {txn.aiInsights.map((ins, i) => (
                          <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${
                            ins.type === "positive" ? "bg-skill-green/5" : ins.type === "suggestion" ? "bg-badge-gold/5" : "bg-surface-1"
                          }`}>
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              ins.type === "positive" ? "bg-skill-green/15 text-skill-green" : ins.type === "suggestion" ? "bg-badge-gold/15 text-badge-gold" : "bg-surface-2 text-muted-foreground"
                            }`}>
                              {ins.type === "positive" ? <TrendingUp size={10} /> : ins.type === "suggestion" ? <Lightbulb size={10} /> : <Info size={10} />}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{ins.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Satisfaction Survey */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Heart size={15} className="text-alert-red" /> Satisfaction Survey
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { name: "Maya K. (Seller)", survey: txn.satisfactionSurvey.seller },
                          { name: "James T. (Buyer)", survey: txn.satisfactionSurvey.buyer },
                        ].map((p) => (
                          <div key={p.name} className="rounded-xl bg-surface-1 p-4">
                            <p className="text-xs font-medium text-foreground mb-3">{p.name}</p>
                            <div className="space-y-2">
                              {[
                                { label: "Overall", value: p.survey.overall },
                                { label: "Communication", value: p.survey.communication },
                                { label: "Quality", value: p.survey.quality },
                                { label: "Timeliness", value: p.survey.timeliness },
                              ].map((r) => (
                                <div key={r.label} className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground">{r.label}</span>
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map((s) => (
                                      <Star key={s} size={10} className={s <= r.value ? "fill-badge-gold text-badge-gold" : "text-surface-2"} />
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <div className="flex items-center justify-between pt-1 border-t border-border">
                                <span className="text-[10px] text-muted-foreground">Would work again</span>
                                <span className={`text-[10px] font-medium ${p.survey.wouldWorkAgain ? "text-skill-green" : "text-alert-red"}`}>
                                  {p.survey.wouldWorkAgain ? "Yes ✓" : "No ✗"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* === DETAILS TAB === */}
                {activeTab === "details" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="details">
                    {/* Workspace Activity */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Activity size={15} className="text-court-blue" /> Workspace Activity
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        <StatCard icon={MessageSquare} label="Messages" value={txn.workspace.messagesCount.toString()} color="text-court-blue" />
                        <StatCard icon={Video} label="Video Calls" value={`${txn.workspace.videoCallMinutes} min`} color="text-skill-green" />
                        <StatCard icon={PenTool} label="Whiteboard" value={txn.workspace.whiteboardSessions.toString()} color="text-badge-gold" />
                        <StatCard icon={FolderOpen} label="Files Shared" value={txn.workspace.filesShared.toString()} color="text-foreground" />
                        <StatCard icon={RefreshCw} label="Revisions" value={txn.workspace.revisionsRequested.toString()} color="text-muted-foreground" />
                        <StatCard icon={Monitor} label="Screenshares" value={txn.workspace.screenshares.toString()} color="text-court-blue" />
                        <StatCard icon={Code} label="Code Reviews" value={txn.workspace.codeReviews.toString()} color="text-skill-green" />
                        <StatCard icon={Users} label="Live Collab" value={`${txn.workspace.liveCollabMinutes} min`} color="text-badge-gold" />
                        <StatCard icon={Timer} label="Avg Response" value={txn.workspace.avgResponseTime} color="text-foreground" />
                        <StatCard icon={BarChart3} label="Engagement" value="High" color="text-skill-green" />
                        <StatCard icon={Hash} label="Threads" value={txn.workspace.threadCount.toString()} color="text-court-blue" />
                        <StatCard icon={Bookmark} label="Pinned" value={txn.workspace.pinnedMessages.toString()} color="text-badge-gold" />
                        <StatCard icon={Heart} label="Reactions" value={txn.workspace.reactions.toString()} color="text-alert-red" sub="❤️ 12  👍 15  🎉 7" />
                        <StatCard icon={PenTool} label="Annotations" value={txn.workspace.annotations.toString()} color="text-foreground" />
                        <StatCard icon={ClipboardList} label="Polls" value={txn.workspace.pollsCreated.toString()} color="text-court-blue" />
                      </div>
                    </div>

                    {/* Communication Heatmap */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Flame size={15} className="text-alert-red" /> Communication Heatmap
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 pl-10">
                          {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="flex-1 text-center text-[7px] text-muted-foreground">{i}</div>
                          ))}
                        </div>
                        {txn.communicationHeatmap.map((row) => (
                          <div key={row.day} className="flex items-center gap-1">
                            <span className="w-8 text-right text-[9px] text-muted-foreground">{row.day}</span>
                            {row.hours.map((v, i) => (
                              <div
                                key={i}
                                className="flex-1 aspect-square rounded-sm"
                                style={{
                                  backgroundColor: v === 0
                                    ? "hsl(var(--surface-2))"
                                    : `hsl(var(--skill-green) / ${Math.min(v / 10, 1)})`,
                                }}
                                title={`${row.day} ${i}:00 — ${v} messages`}
                              />
                            ))}
                          </div>
                        ))}
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="text-[8px] text-muted-foreground">Less</span>
                          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((o) => (
                            <div key={o} className="h-3 w-3 rounded-sm" style={{ backgroundColor: o === 0 ? "hsl(var(--surface-2))" : `hsl(var(--skill-green) / ${o})` }} />
                          ))}
                          <span className="text-[8px] text-muted-foreground">More</span>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <Section id="deliverables" title="Deliverables" icon={Package} count={txn.deliverables.length} expanded={expandedSection} onToggle={toggleSection}>
                      <div className="space-y-2">
                        {txn.deliverables.map((d, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-1 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                              {d.type === "SVG" || d.type === "PNG" || d.type === "FIG" ? <Image size={14} className="text-badge-gold" /> :
                               d.type === "PDF" ? <FileText size={14} className="text-alert-red" /> :
                               d.type === "ZIP" ? <Package size={14} className="text-court-blue" /> :
                               d.type === "MD" ? <BookOpen size={14} className="text-skill-green" /> :
                               <Code size={14} className="text-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{d.name}</p>
                              <p className="text-[9px] text-muted-foreground">{d.uploadedBy} · {d.date} · {d.size}</p>
                            </div>
                            <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[9px] font-medium text-skill-green">{d.status}</span>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Escrow Ledger */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <CircleDollarSign size={15} className="text-badge-gold" /> Escrow Ledger
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard icon={Lock} label="Seller Deposit" value={`${txn.escrow.sellerDeposit} SP`} color="text-foreground" />
                        <StatCard icon={Lock} label="Buyer Deposit" value={`${txn.escrow.buyerDeposit} SP`} color="text-foreground" />
                        <StatCard icon={Percent} label="Escrow Fee" value={`${txn.escrow.escrowFee} SP`} color="text-alert-red" />
                        <StatCard icon={Timer} label="Hold Duration" value={txn.escrow.holdDuration} color="text-court-blue" />
                        <StatCard icon={Calendar} label="Release Date" value={txn.escrow.releaseDate} color="text-skill-green" />
                        <StatCard icon={Hash} label="Escrow ID" value={txn.escrow.escrowId} color="text-muted-foreground" sub="Unique identifier" />
                        <StatCard icon={ShieldCheck} label="Insurance" value={txn.escrow.insuranceCoverage ? "Covered" : "None"} color="text-skill-green" />
                        <StatCard icon={CheckCircle2} label="Status" value={txn.escrow.escrowStatus} color="text-skill-green" />
                      </div>
                    </div>

                    {/* Skill Impact */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <TrendingUp size={15} className="text-skill-green" /> Skill Impact
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { name: "Maya K.", impact: txn.skillImpact.seller },
                          { name: "James T.", impact: txn.skillImpact.buyer },
                        ].map((p) => (
                          <div key={p.name} className="rounded-xl bg-surface-1 p-4">
                            <p className="text-xs font-medium text-foreground mb-3">{p.name}</p>
                            <div className="space-y-2">
                              {Object.keys(p.impact.before).map((skill) => {
                                const before = (p.impact.before as any)[skill];
                                const after = (p.impact.after as any)[skill];
                                const diff = after - before;
                                return (
                                  <div key={skill} className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground">{skill}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] text-muted-foreground">{before}</span>
                                      <ArrowRight size={10} className="text-muted-foreground" />
                                      <span className="font-mono text-[10px] font-bold text-foreground">{after}</span>
                                      <span className="font-mono text-[9px] font-bold text-skill-green">+{diff}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Benchmarks */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Target size={15} className="text-court-blue" /> Performance Benchmarks
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Duration", value: txn.duration, avg: txn.performance.avgSimilarDuration, percentile: txn.performance.durationPercentile, better: true },
                          { label: "Quality Score", value: `${txn.quality.score}/100`, avg: `${txn.performance.avgSimilarQuality}/100`, percentile: txn.performance.qualityPercentile, better: true },
                          { label: "Points Exchanged", value: `${txn.points.total} SP`, avg: `${txn.performance.avgSimilarPoints} SP`, percentile: txn.performance.pointsPercentile, better: true },
                          { label: "Category Rank", value: `#${txn.performance.categoryRank}`, avg: `of ${txn.performance.totalInCategory}`, percentile: Math.round((1 - txn.performance.categoryRank / txn.performance.totalInCategory) * 100), better: true },
                        ].map((b) => (
                          <div key={b.label} className="rounded-xl bg-surface-1 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-muted-foreground">{b.label}</span>
                              <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[9px] font-medium text-skill-green">Top {100 - b.percentile}%</span>
                            </div>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="font-mono text-lg font-bold text-foreground">{b.value}</p>
                                <p className="text-[9px] text-muted-foreground">Avg: {b.avg}</p>
                              </div>
                              <div className="h-8 w-16 flex items-end gap-0.5">
                                <div className="flex-1 rounded-t bg-surface-2" style={{ height: "60%" }} />
                                <div className="flex-1 rounded-t bg-skill-green" style={{ height: `${b.percentile}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Wand2 size={15} className="text-badge-gold" /> Recommended Next Gigs
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {txn.recommendations.map((r, i) => (
                          <div key={i} className="rounded-xl bg-surface-1 p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-foreground">{r.title}</span>
                              <span className="font-mono text-xs font-bold text-skill-green">{r.match}%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground flex-1">{r.reason}</p>
                            <div className="mt-2 h-1 rounded-full bg-surface-2 overflow-hidden">
                              <div className="h-full rounded-full bg-skill-green" style={{ width: `${r.match}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Device & Environment */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Smartphone size={15} className="text-muted-foreground" /> Device & Environment
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { name: "Maya K. (Seller)", info: txn.deviceInfo.seller },
                          { name: "James T. (Buyer)", info: txn.deviceInfo.buyer },
                        ].map((d) => (
                          <div key={d.name} className="rounded-xl bg-surface-1 p-4">
                            <p className="text-xs font-medium text-foreground mb-2">{d.name}</p>
                            <div className="space-y-1.5">
                              {[
                                { icon: Monitor, label: "Device", value: d.info.device },
                                { icon: Settings, label: "OS", value: d.info.os },
                                { icon: Chrome, label: "Browser", value: d.info.browser },
                                { icon: Monitor, label: "Resolution", value: d.info.resolution },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5"><row.icon size={10} /> {row.label}</span>
                                  <span className="text-[10px] font-mono text-foreground">{row.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Log */}
                    <Section id="comments" title="Activity Log" icon={MessageSquare} count={txn.comments.length} expanded={expandedSection} onToggle={toggleSection}>
                      <div className="space-y-2">
                        {txn.comments.map((c, i) => (
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
                                <span className={`rounded-full px-1.5 py-0.5 text-[8px] ${
                                  c.type === "delivery" ? "bg-skill-green/10 text-skill-green" : c.type === "milestone" ? "bg-badge-gold/10 text-badge-gold" : c.type === "feedback" ? "bg-court-blue/10 text-court-blue" : "bg-surface-2 text-muted-foreground"
                                }`}>{c.type}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Full Timeline */}
                    <Section id="timeline" title="Full Timeline" icon={Clock} count={txn.timeline.length} expanded={expandedSection} onToggle={toggleSection}>
                      <div className="relative ml-3 border-l border-border pl-6 space-y-3">
                        {txn.timeline.map((t, i) => (
                          <div key={i} className="relative">
                            <div className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 ${
                              i === txn.timeline.length - 1 ? "border-skill-green bg-skill-green" : "border-foreground bg-background"
                            }`} />
                            <p className="text-sm font-medium text-foreground">{t.event}</p>
                            <p className="text-[10px] text-muted-foreground">{t.time}</p>
                            <p className="text-[9px] text-muted-foreground/70">{t.detail}</p>
                          </div>
                        ))}
                      </div>
                    </Section>
                  </motion.div>
                )}

                {/* === SECURITY TAB === */}
                {activeTab === "security" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="security">
                    {/* Security Audit */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Shield size={15} className="text-skill-green" /> Security Audit Trail
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          { icon: Fingerprint, label: "IP Verification", value: txn.security.ipVerification, color: "text-skill-green" },
                          { icon: Smartphone, label: "Device Fingerprint", value: txn.security.deviceFingerprint, color: "text-skill-green" },
                          { icon: Lock, label: "2FA Status", value: txn.security.twoFactorAuth, color: "text-skill-green" },
                          { icon: Shield, label: "Encryption", value: txn.security.encryptionLevel, color: "text-court-blue" },
                          { icon: Eye, label: "Anti-Cheat Scan", value: txn.security.antiCheatScan, color: "text-skill-green" },
                          { icon: Globe, label: "VPN Detection", value: txn.security.vpnDetection, color: "text-skill-green" },
                          { icon: MapPin, label: "Geo Verification", value: txn.security.geoVerification, color: "text-skill-green" },
                          { icon: Wifi, label: "Session Integrity", value: txn.security.sessionIntegrity, color: "text-skill-green" },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-3 rounded-xl bg-surface-1 p-3.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-skill-green/10">
                              <s.icon size={15} className={s.color} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${s.color}`}>{s.value}</p>
                              <p className="text-[9px] text-muted-foreground">{s.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Risk Meter */}
                      <div className="mt-4 rounded-xl bg-surface-1 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Risk Score</span>
                          <span className="font-mono text-xs font-bold text-skill-green">{txn.security.riskScore} / {txn.security.maxRisk} — {txn.security.threatLevel}</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(txn.security.riskScore / txn.security.maxRisk) * 100}%` }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full bg-skill-green"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Compliance */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Scale size={15} className="text-court-blue" /> Compliance & Legal
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          { label: "Terms Accepted", value: txn.compliance.termsAccepted, icon: FileCheck },
                          { label: "NDA Signed", value: txn.compliance.ndaSigned, icon: FileText },
                          { label: "IP Transfer Clear", value: txn.compliance.ipTransferClear, icon: ShieldCheck },
                          { label: "Content Moderation", value: txn.compliance.contentModeration, icon: Eye },
                          { label: "Export Compliance", value: txn.compliance.exportCompliance, icon: Globe },
                          { label: "GDPR Compliant", value: txn.compliance.gdprCompliant, icon: Shield },
                          { label: "Copyright Check", value: txn.compliance.copyrightCheck, icon: BookOpen },
                          { label: "Data Retention", value: txn.compliance.dataRetention, icon: Database },
                        ].map((c) => {
                          const isBoolean = typeof c.value === "boolean";
                          const passed = isBoolean ? c.value : c.value === "Passed" || c.value === "Clear";
                          return (
                            <div key={c.label} className="flex items-center gap-3 rounded-xl bg-surface-1 p-3.5">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${passed ? "bg-skill-green/10" : "bg-surface-2"}`}>
                                <c.icon size={15} className={passed ? "text-skill-green" : "text-muted-foreground"} />
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${passed ? "text-skill-green" : "text-foreground"}`}>
                                  {isBoolean ? (c.value ? "Yes ✓" : "No ✗") : c.value}
                                </p>
                                <p className="text-[9px] text-muted-foreground">{c.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Digital Provenance */}
                    <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                      <h3 className="mb-4 font-heading text-sm font-bold text-foreground flex items-center gap-2">
                        <Fingerprint size={15} className="text-foreground" /> Digital Provenance
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: "Transaction Code", value: txn.code },
                          { label: "Digital Fingerprint", value: txn.fingerprint },
                          { label: "Blockchain Hash", value: txn.blockchainHash },
                          { label: "Escrow ID", value: txn.escrow.escrowId },
                          { label: "Encryption", value: txn.security.encryptionLevel },
                          { label: "Verification Time", value: "< 1 second" },
                          { label: "Immutable Record", value: "Yes — Cannot be altered" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between rounded-lg bg-surface-1 px-4 py-3">
                            <span className="text-[10px] text-muted-foreground">{row.label}</span>
                            <span className="font-mono text-xs text-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Report — always visible */}
                <div className="mt-4 rounded-2xl border border-border bg-surface-1 p-6 text-center">
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

        <Footer />
      </div>
    </PageTransition>
  );
};

export default TransactionLookupPage;
