import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Flame, TrendingUp, Filter, Zap, Bot, Smartphone,
  Globe, Users, Shield, Palette, BarChart3, MessageSquare, Briefcase,
  ArrowUpDown
} from "lucide-react";

type Category = "all" | "ai" | "social" | "tools" | "mobile" | "enterprise";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  votes: number;
  comments: number;
  status: "open" | "under-review" | "planned" | "in-progress";
  hot?: boolean;
  icon: typeof Zap;
}

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI & Automation" },
  { value: "social", label: "Social & Community" },
  { value: "tools", label: "Creator Tools" },
  { value: "mobile", label: "Mobile" },
  { value: "enterprise", label: "Enterprise" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "open": { label: "Open", color: "text-muted-foreground", bg: "bg-surface-2" },
  "under-review": { label: "Under Review", color: "text-badge-gold", bg: "bg-badge-gold/10" },
  "planned": { label: "Planned", color: "text-court-blue", bg: "bg-court-blue/10" },
  "in-progress": { label: "In Progress", color: "text-skill-green", bg: "bg-skill-green/10" },
};

const initialFeatures: FeatureRequest[] = [
  { id: "1", title: "AI-Powered Skill Recommendations", description: "Smart suggestions for skills to learn based on your profile, goals, and market demand.", category: "ai", votes: 342, comments: 28, status: "planned", hot: true, icon: Bot },
  { id: "2", title: "Real-Time Collaboration Chat", description: "Built-in messaging with file sharing, code snippets, and video calls during gigs.", category: "social", votes: 289, comments: 45, status: "in-progress", icon: MessageSquare },
  { id: "3", title: "Portfolio Templates", description: "Pre-designed portfolio layouts that showcase your work beautifully without design skills.", category: "tools", votes: 267, comments: 19, status: "under-review", hot: true, icon: Palette },
  { id: "4", title: "Offline Mode for Mobile", description: "View saved gigs, draft proposals, and manage tasks without an internet connection.", category: "mobile", votes: 231, comments: 12, status: "open", icon: Smartphone },
  { id: "5", title: "Team Skill Matrix", description: "Visualize your team's collective strengths and gaps with an interactive skill matrix.", category: "enterprise", votes: 198, comments: 22, status: "planned", icon: Users },
  { id: "6", title: "Auto-Translation for Gig Listings", description: "AI-powered translation so gigs reach a global audience in 12+ languages.", category: "ai", votes: 187, comments: 31, status: "under-review", icon: Globe },
  { id: "7", title: "Skill Verification Badges", description: "Third-party verified badges for skills through tests, certifications, or peer review.", category: "social", votes: 176, comments: 14, status: "open", icon: Shield },
  { id: "8", title: "Advanced Analytics Export", description: "Export your performance data as CSV/PDF for reports, tax filing, or portfolio reviews.", category: "tools", votes: 154, comments: 8, status: "open", icon: BarChart3 },
  { id: "9", title: "Push Notifications", description: "Customizable push notifications for gig updates, messages, and milestone alerts.", category: "mobile", votes: 143, comments: 17, status: "planned", icon: Smartphone },
  { id: "10", title: "SSO & SAML Integration", description: "Enterprise single sign-on support for seamless team onboarding.", category: "enterprise", votes: 132, comments: 6, status: "under-review", icon: Briefcase },
  { id: "11", title: "AI Gig Pricing Advisor", description: "Get smart pricing suggestions based on skill rarity, complexity, and market rates.", category: "ai", votes: 128, comments: 21, status: "open", hot: true, icon: TrendingUp },
  { id: "12", title: "Guild Mentorship Program", description: "Senior guild members can mentor juniors with structured learning paths and milestones.", category: "social", votes: 119, comments: 33, status: "open", icon: Users },
];

type SortMode = "votes" | "newest" | "trending";

const FeatureVotingSection = () => {
  const [features, setFeatures] = useState(initialFeatures);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [sortMode, setSortMode] = useState<SortMode>("votes");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleVote = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, votes: votedIds.has(id) ? f.votes - 1 : f.votes + 1 }
          : f
      )
    );
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = features
    .filter((f) => activeCategory === "all" || f.category === activeCategory)
    .sort((a, b) => {
      if (sortMode === "votes") return b.votes - a.votes;
      if (sortMode === "trending") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.votes - a.votes;
      return 0;
    });

  const totalVotes = features.reduce((sum, f) => sum + f.votes, 0);

  return (
    <section className="bg-surface-1 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">
          Feature Voting
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-4 max-w-xl text-center text-muted-foreground">
          Vote on the features you want most. Top-voted items get prioritized in our roadmap.
        </motion.p>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp size={14} className="text-skill-green" />
            <span className="font-mono font-bold text-foreground">{totalVotes.toLocaleString()}</span> total votes
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap size={14} className="text-badge-gold" />
            <span className="font-mono font-bold text-foreground">{features.length}</span> feature requests
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-foreground text-background"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-muted-foreground" />
            {(["votes", "trending"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  sortMode === mode ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "votes" ? "Most Voted" : "Trending"}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((feature, i) => {
              const voted = votedIds.has(feature.id);
              const stCfg = statusConfig[feature.status];
              return (
                <motion.div
                  key={feature.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/20"
                >
                  {/* Vote button */}
                  <button
                    onClick={() => handleVote(feature.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition-all ${
                      voted
                        ? "border-skill-green/30 bg-skill-green/10 text-skill-green"
                        : "border-border bg-surface-2 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp size={16} className={voted ? "fill-current" : ""} />
                    <span className="font-mono text-xs font-bold">{feature.votes}</span>
                  </button>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <feature.icon size={14} className="flex-shrink-0 text-muted-foreground" />
                      <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                      {feature.hot && (
                        <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5 text-[10px] font-semibold text-alert-red">
                          <Flame size={10} /> Hot
                        </span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${stCfg.bg} ${stCfg.color}`}>
                        {stCfg.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-1">{feature.description}</p>
                  </div>

                  {/* Comments */}
                  <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                    <MessageSquare size={12} />
                    <span className="font-mono">{feature.comments}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeatureVotingSection;
