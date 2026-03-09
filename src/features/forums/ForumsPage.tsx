import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Search, ThumbsUp, ThumbsDown, Eye, Send, Bookmark, X, Loader2,
  Pin, Users, Crown, Flame, Bell, Plus, Filter, TrendingUp, Award, Clock,
  Hash, ArrowRight, Star, MessageCircle, ChevronDown
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thread_count: number;
  icon: string | null;
  color: string | null;
}

interface DbThread {
  id: string;
  category_id: string | null;
  author_id: string | null;
  author_name: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  tags: string[];
  created_at: string;
}

interface DbComment {
  id: string;
  thread_id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

const ForumsPage = () => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedThread, setSelectedThread] = useState<DbThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "active">("latest");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [threads, setThreads] = useState<DbThread[]>([]);
  const [comments, setComments] = useState<DbComment[]>([]);
  const [savedThreadIds, setSavedThreadIds] = useState<Set<string>>(new Set());
  const [votedThreads, setVotedThreads] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [categoriesRes, threadsRes] = await Promise.all([
        supabase.from("forum_categories").select("*").order("thread_count", { ascending: false }),
        supabase.from("forum_threads").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false }),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (threadsRes.data) setThreads(threadsRes.data);

      if (user) {
        const [savedRes, votesRes] = await Promise.all([
          supabase.from("saved_posts").select("post_id").eq("user_id", user.id).eq("post_type", "forum"),
          supabase.from("forum_votes").select("thread_id, vote_type").eq("user_id", user.id).not("thread_id", "is", null)
        ]);
        
        if (savedRes.data) setSavedThreadIds(new Set(savedRes.data.map((x) => x.post_id)));
        if (votesRes.data) {
          const votes: Record<string, number> = {};
          votesRes.data.forEach(v => { if (v.thread_id) votes[v.thread_id] = v.vote_type; });
          setVotedThreads(votes);
        }
      }

      setLoading(false);
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!selectedThread) return;
    
    const fetchData = async () => {
      const { data } = await supabase
        .from("forum_comments")
        .select("*")
        .eq("thread_id", selectedThread.id)
        .order("created_at", { ascending: true });
      setComments(data || []);

      await supabase
        .from("forum_threads")
        .update({ view_count: selectedThread.view_count + 1 })
        .eq("id", selectedThread.id);
    };
    
    fetchData();
  }, [selectedThread]);

  const filteredThreads = useMemo(() => {
    let result = threads.filter((thread) => {
      const byCategory = selectedCategory === "all" || thread.category_id === selectedCategory;
      const q = searchQuery.toLowerCase();
      const bySearch = !q ||
        thread.title.toLowerCase().includes(q) ||
        thread.content.toLowerCase().includes(q) ||
        thread.author_name.toLowerCase().includes(q) ||
        thread.tags?.some((t) => t.toLowerCase().includes(q));
      return byCategory && bySearch;
    });

    // Sort
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else if (sortBy === "active") {
      result = [...result].sort((a, b) => b.comment_count - a.comment_count);
    }

    // Keep pinned at top
    const pinned = result.filter(t => t.is_pinned);
    const notPinned = result.filter(t => !t.is_pinned);
    return [...pinned, ...notPinned];
  }, [threads, searchQuery, selectedCategory, sortBy]);

  const toggleSave = async (threadId: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (savedThreadIds.has(threadId)) {
      await supabase.from("saved_posts").delete().match({ user_id: user.id, post_id: threadId, post_type: "forum" });
      setSavedThreadIds((prev) => { const n = new Set(prev); n.delete(threadId); return n; });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_posts").insert({ user_id: user.id, post_id: threadId, post_type: "forum" });
      setSavedThreadIds((prev) => new Set(prev).add(threadId));
      toast.success("Thread saved");
    }
  };

  const handleVote = async (threadId: string, voteType: 1 | -1) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    const currentVote = votedThreads[threadId];
    
    if (currentVote === voteType) {
      // Remove vote
      await supabase.from("forum_votes").delete().match({ user_id: user.id, thread_id: threadId });
      const newUpvotes = voteType === 1 ? thread.upvotes - 1 : thread.upvotes;
      const newDownvotes = voteType === -1 ? thread.downvotes - 1 : thread.downvotes;
      await supabase.from("forum_threads").update({ upvotes: newUpvotes, downvotes: newDownvotes }).eq("id", threadId);
      
      setVotedThreads(prev => { const n = { ...prev }; delete n[threadId]; return n; });
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, upvotes: newUpvotes, downvotes: newDownvotes } : t));
    } else {
      // Upsert vote
      await supabase.from("forum_votes").upsert({ user_id: user.id, thread_id: threadId, vote_type: voteType }, { onConflict: "user_id,thread_id" });
      
      let newUpvotes = thread.upvotes;
      let newDownvotes = thread.downvotes;
      
      if (currentVote === 1) newUpvotes--;
      if (currentVote === -1) newDownvotes--;
      if (voteType === 1) newUpvotes++;
      if (voteType === -1) newDownvotes++;
      
      await supabase.from("forum_threads").update({ upvotes: newUpvotes, downvotes: newDownvotes }).eq("id", threadId);
      
      setVotedThreads(prev => ({ ...prev, [threadId]: voteType }));
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, upvotes: newUpvotes, downvotes: newDownvotes } : t));
    }
  };

  const submitReply = async () => {
    if (!user || !selectedThread || !replyText.trim()) return;

    const { error } = await supabase.from("forum_comments").insert({
      thread_id: selectedThread.id,
      author_id: user.id,
      author_name: profile?.display_name || profile?.full_name || "Anonymous",
      content: replyText,
    });

    if (error) {
      toast.error("Reply failed");
      return;
    }

    toast.success("Reply posted");
    setReplyText("");
    
    const { data } = await supabase
      .from("forum_comments")
      .select("*")
      .eq("thread_id", selectedThread.id)
      .order("created_at", { ascending: true });
    setComments(data || []);

    // Update comment count
    await supabase
      .from("forum_threads")
      .update({ comment_count: selectedThread.comment_count + 1 })
      .eq("id", selectedThread.id);
    
    setThreads(prev => prev.map(t => t.id === selectedThread.id ? { ...t, comment_count: t.comment_count + 1 } : t));
  };

  const pinnedThreads = threads.filter(t => t.is_pinned);
  const hotThreads = [...threads].sort((a, b) => (b.view_count + b.comment_count * 3) - (a.view_count + a.comment_count * 3)).slice(0, 5);
  const topContributors = useMemo(() => {
    const counts: Record<string, number> = {};
    threads.forEach(t => { counts[t.author_name] = (counts[t.author_name] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [threads]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav />
          <div className="h-[80vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-skill-purple/5 pt-20 pb-12 border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-4">
                  <MessageSquare size={14} />
                  Community Forums
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Join the Conversation
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                  Ask questions, share insights, and connect with fellow skill swappers.
                </p>
                
                {/* Quick stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{threads.length}</p>
                    <p className="text-xs text-muted-foreground">Threads</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                    <p className="text-xs text-muted-foreground">Categories</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{topContributors.length}</p>
                    <p className="text-xs text-muted-foreground">Contributors</p>
                  </div>
                </div>
              </div>

              {/* New Thread CTA */}
              <div className="bg-card border border-border rounded-xl p-6 w-full lg:w-80">
                <h3 className="font-semibold mb-2">Start a Discussion</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have a question or idea? Share it with the community.
                </p>
                <button
                  onClick={() => user ? toast.info("Thread creation coming soon!") : setShowLoginPrompt(true)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  New Thread
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements Banner */}
        {pinnedThreads.length > 0 && (
          <section className="bg-badge-gold/10 border-b border-badge-gold/20 py-3">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 text-badge-gold shrink-0">
                  <Pin size={16} />
                  <span className="text-sm font-medium">Pinned:</span>
                </div>
                {pinnedThreads.slice(0, 3).map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className="shrink-0 px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-badge-gold transition"
                  >
                    {thread.title}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Bar */}
        <section className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  <Hash size={14} />
                  All
                  <span className="text-xs opacity-70">{threads.length}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.thread_count}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:border-primary transition shrink-0"
              >
                <Filter size={14} />
                Filters
                <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Expanded filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-4 pt-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search threads, tags, authors..."
                        className="w-full pl-10 pr-10 py-2 border border-border bg-card rounded-lg text-sm"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-border bg-card rounded-lg text-sm"
                    >
                      <option value="latest">Latest</option>
                      <option value="popular">Most Upvoted</option>
                      <option value="active">Most Active</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Thread List */}
            <div className="lg:col-span-2 space-y-4">
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredThreads.length} result{filteredThreads.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}

              {filteredThreads.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No threads found</p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="mt-4 text-primary text-sm hover:underline">
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <motion.article
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border bg-card rounded-xl p-5 transition ${thread.is_pinned ? "border-badge-gold/50 bg-badge-gold/5" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="flex gap-4">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleVote(thread.id, 1)}
                          className={`p-1.5 rounded-lg transition ${votedThreads[thread.id] === 1 ? "bg-skill-green/20 text-skill-green" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        >
                          <ThumbsUp size={18} />
                        </button>
                        <span className={`text-sm font-medium ${thread.upvotes - thread.downvotes > 0 ? "text-skill-green" : thread.upvotes - thread.downvotes < 0 ? "text-alert-red" : "text-muted-foreground"}`}>
                          {thread.upvotes - thread.downvotes}
                        </span>
                        <button
                          onClick={() => handleVote(thread.id, -1)}
                          className={`p-1.5 rounded-lg transition ${votedThreads[thread.id] === -1 ? "bg-alert-red/20 text-alert-red" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        >
                          <ThumbsDown size={18} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {thread.is_pinned && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-badge-gold/20 text-badge-gold text-xs font-medium rounded">
                                <Pin size={10} /> Pinned
                              </span>
                            )}
                            <h2 
                              className="text-lg font-semibold text-card-foreground hover:text-primary cursor-pointer transition"
                              onClick={() => setSelectedThread(thread)}
                            >
                              {thread.title}
                            </h2>
                          </div>
                          <button
                            onClick={() => toggleSave(thread.id)}
                            className={`p-2 rounded-lg shrink-0 transition ${savedThreadIds.has(thread.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                          >
                            <Bookmark size={16} fill={savedThreadIds.has(thread.id) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          by {thread.author_name} · {formatTimeAgo(thread.created_at)}
                        </p>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{thread.content}</p>

                        {thread.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {thread.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle size={14} /> {thread.comment_count} replies
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Eye size={14} /> {thread.view_count} views
                            </span>
                          </div>
                          <button 
                            onClick={() => setSelectedThread(thread)} 
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition"
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Hot Threads */}
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Flame size={18} className="text-alert-red" />
                  Hot Threads
                </h3>
                <div className="space-y-3">
                  {hotThreads.map((thread, i) => (
                    <button 
                      key={thread.id} 
                      onClick={() => setSelectedThread(thread)} 
                      className="text-left w-full hover:bg-muted p-2 -mx-2 rounded-lg transition"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm text-card-foreground line-clamp-2">{thread.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{thread.comment_count} replies</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Award size={18} className="text-badge-gold" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {topContributors.map(([name, count], i) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-badge-gold/20 text-badge-gold" : i === 1 ? "bg-gray-300/20 text-gray-400" : i === 2 ? "bg-orange-400/20 text-orange-400" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{count} threads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Overview */}
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Hash size={18} />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${selectedCategory === cat.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{cat.thread_count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Posts Link */}
              <Link to="/saved" className="flex items-center gap-3 p-4 border border-border bg-card rounded-xl hover:border-primary transition">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bookmark size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Saved Threads</h4>
                  <p className="text-sm text-muted-foreground">View bookmarked discussions</p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            </aside>
          </div>
        </div>

        {/* Thread Detail Modal */}
        <AnimatePresence>
          {selectedThread && (
            <motion.div 
              className="fixed inset-0 bg-foreground/80 z-50 flex items-start justify-center p-4 overflow-y-auto" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedThread(null)}
            >
              <motion.div
                className="w-full max-w-3xl my-8 border border-border bg-card rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {selectedThread.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-badge-gold/20 text-badge-gold text-xs font-medium rounded">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-card-foreground">{selectedThread.title}</h2>
                  </div>
                  <button onClick={() => setSelectedThread(null)} className="p-2 rounded-lg hover:bg-muted transition">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span>by {selectedThread.author_name}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(selectedThread.created_at)}</span>
                    <span>•</span>
                    <span>{selectedThread.view_count} views</span>
                  </div>

                  <p className="text-foreground mb-6 whitespace-pre-wrap">{selectedThread.content}</p>

                  {selectedThread.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-border">
                      {selectedThread.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <MessageCircle size={18} />
                    Replies ({comments.length})
                  </h3>

                  {user ? (
                    <div className="mb-6">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-3 border border-border rounded-lg bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="Write your reply..."
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={submitReply} 
                          disabled={!replyText.trim()}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition disabled:opacity-50"
                        >
                          <Send size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-6">
                      <Link to="/login" className="text-primary hover:underline">Log in</Link> to participate in discussions.
                    </p>
                  )}

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 rounded-lg border border-border bg-muted">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{comment.author_name}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
      </div>
    </PageTransition>
  );
};

export default ForumsPage;
