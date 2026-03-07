import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, Shield, FileText, ArrowRight, Flag,
  Star, User, Coins, AlertTriangle, Eye
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const mockTransaction = {
  code: "TXN-2026-0305-AK7B",
  status: "Verified",
  gig: "Logo Design ↔ React Development",
  format: "Direct Swap",
  date: "March 5, 2026",
  duration: "3 days",
  seller: { name: "Maya K.", elo: 1450, rating: 4.9, university: "USC" },
  buyer: { name: "James T.", elo: 1680, rating: 5.0, university: "MIT" },
  points: { sellerEarned: 30, buyerEarned: 0, taxPaid: 1.5, total: 30 },
  stages: [
    { name: "Initial Concept", status: "Completed", points: 10 },
    { name: "Revision Round", status: "Completed", points: 10 },
    { name: "Final Delivery", status: "Completed", points: 10 },
  ],
  quality: { score: 94, plagiarism: "Clean", aiAssessment: "Exceeds standards" },
  reviews: {
    sellerReview: { rating: 5.0, text: "Amazing developer, delivered pixel-perfect work." },
    buyerReview: { rating: 4.9, text: "Great designer with excellent communication." },
  },
};

const TransactionLookupPage = () => {
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);

  const handleSearch = () => {
    if (!code.trim()) return;
    setSearching(true);
    setFound(false);
    setTimeout(() => {
      setSearching(false);
      setFound(true);
    }, 1500);
  };

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
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
                Transaction Lookup
              </h1>
              <p className="mb-10 text-lg text-muted-foreground">
                Verify any gig transaction with its unique code.
              </p>
            </motion.div>

            {/* Search Form */}
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
                <motion.button
                  onClick={handleSearch}
                  className="flex h-14 items-center gap-2 rounded-2xl bg-foreground px-6 text-sm font-semibold text-background"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Searching Animation */}
        <AnimatePresence>
          {searching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
              <motion.div
                className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-border border-t-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-muted-foreground">Verifying transaction...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {found && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
              <div className="mx-auto max-w-4xl px-6">
                {/* Verification Status */}
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-8 flex items-center gap-4 rounded-2xl border border-skill-green/20 bg-skill-green/5 p-6">
                  <CheckCircle2 size={32} className="text-skill-green flex-shrink-0" />
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Transaction Verified</h2>
                    <p className="font-mono text-sm text-muted-foreground">{mockTransaction.code}</p>
                  </div>
                </motion.div>

                {/* Transaction Summary */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Transaction Summary</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Gig</span>
                        <p className="text-sm font-medium text-foreground">{mockTransaction.gig}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Format</span>
                        <p className="text-sm text-foreground">{mockTransaction.format}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</span>
                        <p className="text-sm text-foreground">{mockTransaction.date}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</span>
                        <p className="text-sm text-foreground">{mockTransaction.duration}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Points</span>
                        <p className="text-sm font-semibold text-skill-green">{mockTransaction.points.total} SP</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax Deducted</span>
                        <p className="text-sm text-destructive">{mockTransaction.points.taxPaid} SP (5%)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parties */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Seller", data: mockTransaction.seller, earned: mockTransaction.points.sellerEarned },
                    { label: "Buyer", data: mockTransaction.buyer, earned: mockTransaction.points.buyerEarned },
                  ].map((party) => (
                    <div key={party.label} className="rounded-2xl border border-border bg-card p-5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{party.label}</span>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-foreground">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{party.data.name}</p>
                          <p className="text-[10px] text-muted-foreground">{party.data.university} · ELO {party.data.elo} · ★ {party.data.rating}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stages */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">Stage Completion</h3>
                  <div className="space-y-3">
                    {mockTransaction.stages.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-skill-green flex-shrink-0" />
                        <span className="flex-1 text-sm text-foreground">{s.name}</span>
                        <span className="font-mono text-xs text-skill-green">+{s.points} SP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Score */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-sm font-bold text-foreground">AI Quality Assessment</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-surface-1 p-4 text-center">
                      <p className="font-heading text-2xl font-black text-skill-green">{mockTransaction.quality.score}</p>
                      <p className="text-[10px] text-muted-foreground">Quality Score</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-4 text-center">
                      <p className="font-heading text-sm font-bold text-skill-green">{mockTransaction.quality.plagiarism}</p>
                      <p className="text-[10px] text-muted-foreground">Plagiarism Check</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-4 text-center">
                      <p className="font-heading text-sm font-bold text-foreground">{mockTransaction.quality.aiAssessment}</p>
                      <p className="text-[10px] text-muted-foreground">AI Assessment</p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">Seller's Review</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-badge-gold text-badge-gold" />
                        <span className="font-mono text-xs text-badge-gold">{mockTransaction.reviews.sellerReview.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">"{mockTransaction.reviews.sellerReview.text}"</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">Buyer's Review</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-badge-gold text-badge-gold" />
                        <span className="font-mono text-xs text-badge-gold">{mockTransaction.reviews.buyerReview.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">"{mockTransaction.reviews.buyerReview.text}"</p>
                  </div>
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
