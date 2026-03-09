import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock, ArrowRight, ArrowLeft, Tag, User, Heart, MessageSquare,
  Bookmark, Share2, Eye, Search, Sparkles,
  FileText, Zap, ThumbsUp, Send, MoreHorizontal, Twitter, Facebook, Copy, CheckCircle2,
  Crown, Flame, Layers, Code, Users, Target, PenTool, Lightbulb, BarChart3, Mic, Video, Headphones, X, Loader2
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { safeEmailSchema } from "@/lib/email-validation";

// Database types
interface DbBlogPost {
  id: string;
  author_id: string | null;
  author_name: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  cover_image: string | null;
  category: string;
  tags: string[];
  read_time: number;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface DbBlogComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string | null;
  author_name: string;
  content: string;
  like_count: number;
  created_at: string;
}

interface CategoryWithCount {
  name: string;
  count: number;
  icon: any;
}

const BlogPage = () => {
  const { user, profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<DbBlogPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "discussed">("latest");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Database state
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [comments, setComments] = useState<DbBlogComment[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Icon mapping for categories
  const categoryIcons: Record<string, any> = {
    All: Layers,
    Product: Zap,
    Engineering: Code,
    Community: Users,
    Tips: Lightbulb,
    "Case Studies": Target,
    Design: PenTool,
    Economy: BarChart3,
    Guide: FileText,
  };

  // Format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return date.toLocaleDateString();
  };

  // Fetch posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch posts
      const { data: postsData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (postsData) {
        setPosts(postsData);
        
        // Calculate categories from posts
        const categoryCounts: Record<string, number> = {};
        postsData.forEach(post => {
          categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
        });
        
        const cats: CategoryWithCount[] = [
          { name: "All", count: postsData.length, icon: Layers }
        ];
        
        Object.entries(categoryCounts).forEach(([name, count]) => {
          cats.push({
            name,
            count,
            icon: categoryIcons[name] || FileText
          });
        });
        
        setCategories(cats);
        
        // Calculate popular tags
        const tagCounts: Record<string, number> = {};
        postsData.forEach(post => {
          post.tags?.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });
        
        const tags = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 12);
        
        setPopularTags(tags);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Fetch saved posts
  useEffect(() => {
    if (!user) return;
    
    const fetchSavedPosts = async () => {
      const { data } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("post_type", "blog");
      
      if (data) {
        setSavedPostIds(new Set(data.map(s => s.post_id)));
      }
    };
    
    fetchSavedPosts();
  }, [user]);

  // Fetch comments when a post is selected
  useEffect(() => {
    if (!selectedPost) return;
    
    const fetchComments = async () => {
      const { data } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost.id)
        .order("created_at", { ascending: true });
      
      if (data) setComments(data);
      
      // Increment view count
      await supabase.rpc("increment", {
        table_name: "blog_posts",
        row_id: selectedPost.id,
        column_name: "view_count"
      });
    };
    
    fetchComments();
  }, [selectedPost]);

  // Submit comment
  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentText.trim() || !selectedPost) return;

    const { error } = await supabase.from("blog_comments").insert({
      post_id: selectedPost.id,
      author_id: user.id,
      author_name: profile?.display_name || profile?.full_name || "Anonymous",
      content: commentText
    });

    if (error) {
      toast.error("Failed to add comment");
    } else {
      toast.success("Comment added!");
      setCommentText("");
      
      // Refresh comments
      const { data } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost.id)
        .order("created_at", { ascending: true });
      if (data) setComments(data);
      
      // Update comment count
      await supabase
        .from("blog_posts")
        .update({ comment_count: (selectedPost.comment_count || 0) + 1 })
        .eq("id", selectedPost.id);
    }
  };

  // Toggle save post
  const toggleSave = async (postId: string) => {
    if (!user) {
      toast.error("Please log in to save posts");
      return;
    }
    
    if (savedPostIds.has(postId)) {
      await supabase
        .from("saved_posts")
        .delete()
        .match({ user_id: user.id, post_id: postId, post_type: "blog" });
      
      setSavedPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      toast.success("Removed from saved");
    } else {
      await supabase
        .from("saved_posts")
        .insert({ user_id: user.id, post_id: postId, post_type: "blog" });
      
      setSavedPostIds(prev => new Set(prev).add(postId));
      toast.success("Saved!");
    }
  };

  // Newsletter subscription
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = safeEmailSchema.safeParse(newsletterEmail);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsSubscribing(true);
    
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .insert({ email: newsletterEmail });
    
    setIsSubscribing(false);
    
    if (error) {
      if (error.code === "23505") {
        toast.error("This email is already subscribed");
      } else {
        toast.error("Failed to subscribe");
      }
    } else {
      toast.success("Successfully subscribed to newsletter!");
      setNewsletterEmail("");
    }
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") return b.view_count - a.view_count;
    if (sortBy === "discussed") return b.comment_count - a.comment_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const featuredPost = posts.find(p => p.is_featured);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <AppNav />
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav />
        
        {/* Header with dark theme */}
        <section className="border-b border-border bg-black/95 py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
              <p className="text-zinc-400">Insights, updates, and stories from the SkillSwappr community</p>
            </div>
            
            {/* Category filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                    activeCategory === cat.name
                      ? "bg-white text-black"
                      : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                  }`}
                >
                  <cat.icon size={14} />
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-60">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Editor's Picks label */}
            {featuredPost && (
              <div className="flex items-center gap-2 mb-4">
                <Crown size={14} className="text-zinc-500" />
                <h2 className="text-sm font-medium text-zinc-400">Editor's Pick</h2>
              </div>
            )}

            {/* Content type filters */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm hover:border-zinc-600 transition">
                <FileText size={14} className="text-zinc-400" />
                <span className="text-zinc-300">Articles</span>
                <span className="text-xs text-zinc-500">{posts.length}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main column */}
            <div className="lg:col-span-2">
              {/* Search and sort */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-surface-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-surface-2 border border-border rounded-lg text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="discussed">Most Discussed</option>
                </select>
              </div>

              {/* Results count */}
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {sortedPosts.length} result{sortedPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}

              {/* Post grid */}
              {sortedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts found</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedPosts.map(post => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition group"
                    >
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            {post.category}
                          </span>
                          {post.is_featured && (
                            <Crown size={14} className="text-badge-gold" />
                          )}
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.read_time} min read</span>
                          </div>
                          <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-surface-2 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{post.view_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{post.comment_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span>{post.like_count}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSave(post.id)}
                              className={`p-2 rounded-lg transition ${
                                savedPostIds.has(post.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-surface-2 hover:bg-surface-3"
                              }`}
                            >
                              <Bookmark size={16} fill={savedPostIds.has(post.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-primary/10 to-skill-green/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={20} className="text-primary" />
                  <h3 className="font-semibold">Newsletter</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest posts and updates delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSignup} className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>

              {/* Popular tags */}
              {popularTags.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag size={18} />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(({ tag, count }) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 rounded-lg text-sm transition"
                      >
                        #{tag} <span className="text-muted-foreground ml-1">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Most read */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Flame size={18} className="text-alert-red" />
                  Most Read
                </h3>
                <div className="space-y-4">
                  {posts
                    .sort((a, b) => b.view_count - a.view_count)
                    .slice(0, 5)
                    .map((post, i) => (
                      <button
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="flex gap-3 text-left w-full hover:bg-surface-2 p-2 rounded-lg transition"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.view_count} views
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post detail modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-surface border border-border rounded-xl my-8"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-surface-2 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {selectedPost.cover_image && (
                  <img
                    src={selectedPost.cover_image}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="text-sm">{selectedPost.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-sm">{selectedPost.read_time} min read</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(selectedPost.created_at)}
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none mb-8">
                    {Array.isArray(selectedPost.content) && selectedPost.content.map((block: any, i: number) => {
                      if (block.type === "paragraph") {
                        return <p key={i} className="mb-4">{block.content}</p>;
                      }
                      if (block.type === "heading") {
                        return <h2 key={i} className="text-2xl font-bold mb-3 mt-6">{block.content}</h2>;
                      }
                      if (block.type === "list" && block.items) {
                        return (
                          <ul key={i} className="list-disc list-inside space-y-2 mb-4">
                            {block.items.map((item: string, j: number) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Comments section */}
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare size={20} />
                      Comments ({comments.length})
                    </h3>

                    {user ? (
                      <div className="mb-6">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
                          >
                            <Send size={16} />
                            Post Comment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-6">
                        Please log in to comment
                      </p>
                    )}

                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-surface-2 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.author_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default BlogPage;
