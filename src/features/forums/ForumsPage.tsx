import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, ThumbsUp, Eye, Send, Bookmark, X, Loader2 } from "lucide-react";
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
}

interface DbThread {
  id: string;
  category_id: string | null;
  author_id: string | null;
  author_name: string;
  title: string;
  content: string;
  is_pinned: boolean;
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
  created_at: string;
}

const ForumsPage = () => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedThread, setSelectedThread] = useState<DbThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [threads, setThreads] = useState<DbThread[]>([]);
  const [comments, setComments] = useState<DbComment[]>([]);
  const [savedThreadIds, setSavedThreadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [categoriesRes, threadsRes] = await Promise.all([
        supabase.from("forum_categories").select("id,name,slug,description,thread_count").order("thread_count", { ascending: false }),
        supabase.from("forum_threads").select("*").order("created_at", { ascending: false }),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (threadsRes.data) setThreads(threadsRes.data);

      if (user) {
        const { data } = await supabase
          .from("saved_posts")
          .select("post_id")
          .eq("user_id", user.id)
          .eq("post_type", "forum");
        if (data) setSavedThreadIds(new Set(data.map((x) => x.post_id)));
      }

      setLoading(false);
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!selectedThread) return;
    supabase
      .from("forum_comments")
      .select("id,thread_id,author_id,author_name,content,created_at")
      .eq("thread_id", selectedThread.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments(data || []));

    supabase
      .from("forum_threads")
      .update({ view_count: selectedThread.view_count + 1 })
      .eq("id", selectedThread.id)
      .then();
  }, [selectedThread]);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const byCategory = selectedCategory === "all" || thread.category_id === selectedCategory;
      const q = searchQuery.toLowerCase();
      const bySearch =
        !q ||
        thread.title.toLowerCase().includes(q) ||
        thread.content.toLowerCase().includes(q) ||
        thread.author_name.toLowerCase().includes(q) ||
        thread.tags?.some((t) => t.toLowerCase().includes(q));
      return byCategory && bySearch;
    });
  }, [threads, searchQuery, selectedCategory]);

  const toggleSave = async (threadId: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (savedThreadIds.has(threadId)) {
      await supabase.from("saved_posts").delete().match({ user_id: user.id, post_id: threadId, post_type: "forum" });
      setSavedThreadIds((prev) => {
        const next = new Set(prev);
        next.delete(threadId);
        return next;
      });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_posts").insert({ user_id: user.id, post_id: threadId, post_type: "forum" });
      setSavedThreadIds((prev) => new Set(prev).add(threadId));
      toast.success("Thread saved");
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
      .select("id,thread_id,author_id,author_name,content,created_at")
      .eq("thread_id", selectedThread.id)
      .order("created_at", { ascending: true });
    setComments(data || []);
  };

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
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h1 className="text-4xl font-bold text-foreground mb-2">Forums</h1>
          <p className="text-muted-foreground mb-8">Real discussions from the community.</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads, tags, authors..."
                className="w-full pl-10 pr-10 py-2 border border-border bg-background rounded-lg text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              className="px-3 py-2 border border-border bg-background rounded-lg text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.thread_count})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {filteredThreads.map((thread) => (
                <article key={thread.id} className="border border-border bg-card rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-card-foreground">{thread.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">by {thread.author_name} · {formatTimeAgo(thread.created_at)}</p>
                    </div>
                    <button
                      onClick={() => toggleSave(thread.id)}
                      className={`p-2 rounded-md ${savedThreadIds.has(thread.id) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                    >
                      <Bookmark size={16} fill={savedThreadIds.has(thread.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{thread.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags?.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">#{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><ThumbsUp size={14} /> {thread.upvotes - thread.downvotes}</span>
                      <span className="inline-flex items-center gap-1"><MessageSquare size={14} /> {thread.comment_count}</span>
                      <span className="inline-flex items-center gap-1"><Eye size={14} /> {thread.view_count}</span>
                    </div>
                    <button onClick={() => setSelectedThread(thread)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Open</button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-card-foreground mb-3">Most Active</h3>
                <div className="space-y-3">
                  {[...threads]
                    .sort((a, b) => b.comment_count - a.comment_count)
                    .slice(0, 5)
                    .map((thread) => (
                      <button key={thread.id} onClick={() => setSelectedThread(thread)} className="text-left w-full text-sm">
                        <p className="text-card-foreground line-clamp-2">{thread.title}</p>
                        <p className="text-muted-foreground text-xs">{thread.comment_count} comments</p>
                      </button>
                    ))}
                </div>
              </div>

              <Link to="/saved" className="block border border-border bg-card rounded-xl p-5 hover:border-primary transition">
                <h3 className="font-semibold text-card-foreground mb-1">Saved Posts</h3>
                <p className="text-sm text-muted-foreground">View your saved blog posts and forum threads.</p>
              </Link>
            </aside>
          </div>
        </div>

        <AnimatePresence>
          {selectedThread && (
            <motion.div className="fixed inset-0 bg-foreground/80 z-50 flex items-start justify-center p-4 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedThread(null)}>
              <motion.div
                className="w-full max-w-3xl my-8 border border-border bg-card rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-card-foreground">{selectedThread.title}</h2>
                  <button onClick={() => setSelectedThread(null)} className="p-2 rounded-md hover:bg-secondary">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{selectedThread.content}</p>

                  <h3 className="font-semibold text-card-foreground mb-3">Replies ({comments.length})</h3>

                  {user ? (
                    <div className="mb-6">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                        rows={3}
                        placeholder="Write your reply..."
                      />
                      <div className="flex justify-end mt-2">
                        <button onClick={submitReply} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center gap-2">
                          <Send size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">Log in to participate in discussions.</p>
                  )}

                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 rounded-lg border border-border bg-background">
                        <div className="text-xs text-muted-foreground mb-1">{comment.author_name} · {formatTimeAgo(comment.created_at)}</div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      </div>
    </PageTransition>
  );
};

export default ForumsPage;
