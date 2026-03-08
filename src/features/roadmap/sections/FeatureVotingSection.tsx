import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Flame, TrendingUp, Zap, Bot, Smartphone,
  Globe, Users, Shield, Palette, BarChart3, MessageSquare, Briefcase,
  ArrowUpDown, Send, ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { logInteraction } from "@/lib/activity-logger";
import LoginPrompt from "@/components/shared/LoginPrompt";

type Category = "all" | "ai" | "social" | "tools" | "mobile" | "enterprise";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  comments: number;
  status: string;
  hot: boolean;
  icon: string;
}

interface FeatureComment {
  id: string;
  feature_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

const iconMap: Record<string, any> = {
  Bot, MessageSquare, Palette, Smartphone, Users, Globe, Shield, BarChart3, Briefcase, TrendingUp, Zap,
};

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

type SortMode = "votes" | "trending";

const FeatureVotingSection = () => {
  const { user, profile } = useAuth();
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [sortMode, setSortMode] = useState<SortMode>("votes");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, FeatureComment[]>>({});
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, [user]);

  const loadFeatures = async () => {
    const { data } = await supabase.from("feature_requests").select("*").order("votes", { ascending: false });
    if (data) setFeatures(data as any);

    if (user) {
      const { data: votes } = await supabase.from("feature_votes").select("feature_id").eq("user_id", user.id);
      if (votes) setVotedIds(new Set(votes.map((v: any) => v.feature_id)));
    }
    setLoading(false);
  };

  const loadComments = async (featureId: string) => {
    const { data } = await supabase
      .from("feature_comments")
      .select("*")
      .eq("feature_id", featureId)
      .order("created_at", { ascending: true });
    if (data) {
      setComments(prev => ({ ...prev, [featureId]: data as any }));
    }
  };

  const handleToggleComments = (featureId: string) => {
    if (expandedComments === featureId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(featureId);
      if (!comments[featureId]) loadComments(featureId);
    }
    setCommentText("");
  };

  const handlePostComment = async (featureId: string) => {
    if (!user) { setShowLogin(true); return; }
    if (!commentText.trim()) return;
    setPostingComment(true);

    const userName = profile?.display_name || profile?.full_name || "Anonymous";

    const { data } = await supabase.from("feature_comments").insert({
      feature_id: featureId,
      user_id: user.id,
      user_name: userName,
      content: commentText.trim(),
    }).select("*").single();

    if (data) {
      setComments(prev => ({
        ...prev,
        [featureId]: [...(prev[featureId] || []), data as any],
      }));
      // Update comment count
      const feature = features.find(f => f.id === featureId);
      if (feature) {
        await supabase.from("feature_requests").update({ comments: feature.comments + 1 }).eq("id", featureId);
        setFeatures(prev => prev.map(f => f.id === featureId ? { ...f, comments: f.comments + 1 } : f));
      }
      logInteraction("feature_comment", { feature_id: featureId });
    }

    setCommentText("");
    setPostingComment(false);
  };

  const handleVote = async (id: string) => {
    if (!user) { setShowLogin(true); return; }

    const isVoted = votedIds.has(id);
    const feature = features.find(f => f.id === id);

    if (isVoted) {
      await supabase.from("feature_votes").delete().eq("feature_id", id).eq("user_id", user.id);
      await supabase.from("feature_requests").update({ votes: feature!.votes - 1 }).eq("id", id);
      logInteraction("feature_unvote", { feature_id: id, feature_title: feature?.title });
    } else {
      await supabase.from("feature_votes").insert({ feature_id: id, user_id: user.id });
      await supabase.from("feature_requests").update({ votes: feature!.votes + 1 }).eq("id", id);
      logInteraction("feature_vote", { feature_id: id, feature_title: feature?.title });
    }

    setFeatures(prev => prev.map(f => f.id === id ? { ...f, votes: isVoted ? f.votes - 1 : f.votes + 1 } : f));
    setVotedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = features
    .filter(f => activeCategory === "all" || f.category === activeCategory)
    .sort((a, b) => {
      if (sortMode === "votes") return b.votes - a.votes;
      if (sortMode === "trending") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.votes - a.votes;
      return 0;
    });

  const totalVotes = features.reduce((sum, f) => sum + f.votes, 0);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

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
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${activeCategory === cat.value ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-muted-foreground" />
            {(["votes", "trending"] as SortMode[]).map(mode => (
              <button key={mode} onClick={() => setSortMode(mode)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${sortMode === mode ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {mode === "votes" ? "Most Voted" : "Trending"}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading features...</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((feature, i) => {
                const voted = votedIds.has(feature.id);
                const stCfg = statusConfig[feature.status] || statusConfig["open"];
                const IconComp = iconMap[feature.icon] || Zap;
                const isExpanded = expandedComments === feature.id;
                const featureComments = comments[feature.id] || [];
                return (
                  <motion.div key={feature.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                    className="overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-muted-foreground/20">
                    <div className="flex items-center gap-4 p-5">
                      <button onClick={() => handleVote(feature.id)}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition-all ${voted ? "border-skill-green/30 bg-skill-green/10 text-skill-green" : "border-border bg-surface-2 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"}`}>
                        <ThumbsUp size={16} className={voted ? "fill-current" : ""} />
                        <span className="font-mono text-xs font-bold">{feature.votes}</span>
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <IconComp size={14} className="flex-shrink-0 text-muted-foreground" />
                          <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                          {feature.hot && (
                            <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5 text-[10px] font-semibold text-alert-red">
                              <Flame size={10} /> Hot
                            </span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-1">{feature.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleComments(feature.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${isExpanded ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <MessageSquare size={12} />
                        <span className="font-mono">{feature.comments}</span>
                        <ChevronDown size={10} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {/* Comments section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border/50"
                        >
                          <div className="bg-surface-1/50 p-4 space-y-3">
                            {featureComments.length === 0 && (
                              <p className="text-center text-xs text-muted-foreground py-3">No comments yet. Be the first!</p>
                            )}
                            {featureComments.map((c) => (
                              <div key={c.id} className="flex gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold text-muted-foreground">
                                  {c.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-semibold text-foreground">{c.user_name}</span>
                                    <span className="text-[10px] text-muted-foreground/60">{formatTime(c.created_at)}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{c.content}</p>
                                </div>
                              </div>
                            ))}

                            {/* Comment input */}
                            <div className="flex gap-2 pt-2 border-t border-border/30">
                              <input
                                type="text"
                                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handlePostComment(feature.id)}
                                disabled={!user}
                                className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none disabled:opacity-50"
                              />
                              <button
                                onClick={() => handlePostComment(feature.id)}
                                disabled={!user || !commentText.trim() || postingComment}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-40"
                              >
                                <Send size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
      <LoginPrompt open={showLogin} onOpenChange={setShowLogin} message="Sign in to vote on feature requests and help shape the platform roadmap." />
    </section>
  );
};

export default FeatureVotingSection;
