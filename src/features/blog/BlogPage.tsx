import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock, ArrowRight, Tag, User, Heart, MessageSquare,
  Bookmark, Share2, Eye, Search, Sparkles, Bell,
  FileText, Zap, ThumbsUp, Send, Twitter, Facebook, Copy, CheckCircle2,
  Crown, Flame, Layers, Code, Users, Target, PenTool, Lightbulb, BarChart3, 
  Video, Headphones, X, Loader2, TrendingUp, Star, Grid3X3, LayoutList,
  Megaphone, Award, BookOpen
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { safeEmailSchema } from "@/lib/email-validation";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Database state
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [comments, setComments] = useState<DbBlogComment[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

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
    Announcement: Megaphone,
  };

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: postsData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (postsData) {
        setPosts(postsData);
        
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

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      const [savedRes, likesRes] = await Promise.all([
        supabase.from("saved_posts").select("post_id").eq("user_id", user.id).eq("post_type", "blog"),
        supabase.from("blog_likes").select("post_id").eq("user_id", user.id)
      ]);
      
      if (savedRes.data) setSavedPostIds(new Set(savedRes.data.map(s => s.post_id)));
      if (likesRes.data) setLikedPostIds(new Set(likesRes.data.filter(l => l.post_id).map(l => l.post_id!)));
    };
    
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!selectedPost) return;
    
    const fetchComments = async () => {
      const { data } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost.id)
        .order("created_at", { ascending: true });
      
      if (data) setComments(data);
      
      await supabase
        .from("blog_posts")
        .update({ view_count: selectedPost.view_count + 1 })
        .eq("id", selectedPost.id);
    };
    
    fetchComments();
  }, [selectedPost]);

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
      
      const { data } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost.id)
        .order("created_at", { ascending: true });
      if (data) setComments(data);
      
      await supabase
        .from("blog_posts")
        .update({ comment_count: (selectedPost.comment_count || 0) + 1 })
        .eq("id", selectedPost.id);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) {
      toast.error("Please log in to save posts");
      return;
    }
    
    if (savedPostIds.has(postId)) {
      await supabase.from("saved_posts").delete().match({ user_id: user.id, post_id: postId, post_type: "blog" });
      setSavedPostIds(prev => { const n = new Set(prev); n.delete(postId); return n; });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_posts").insert({ user_id: user.id, post_id: postId, post_type: "blog" });
      setSavedPostIds(prev => new Set(prev).add(postId));
      toast.success("Saved!");
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (likedPostIds.has(postId)) {
      await supabase.from("blog_likes").delete().match({ user_id: user.id, post_id: postId });
      await supabase.from("blog_posts").update({ like_count: Math.max(0, post.like_count - 1) }).eq("id", postId);
      setLikedPostIds(prev => { const n = new Set(prev); n.delete(postId); return n; });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p));
    } else {
      await supabase.from("blog_likes").insert({ user_id: user.id, post_id: postId });
      await supabase.from("blog_posts").update({ like_count: post.like_count + 1 }).eq("id", postId);
      setLikedPostIds(prev => new Set(prev).add(postId));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: p.like_count + 1 } : p));
    }
  };

  const handleShare = async (postId: string, platform: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const url = `${window.location.origin}/blog/${post.slug}`;
    const title = post.title;

    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("Link copied!");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    }
    setShowShareMenu(null);
  };

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = safeEmailSchema.safeParse(newsletterEmail);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsSubscribing(true);
    
    const { error } = await supabase.from("newsletter_subscriptions").insert({ email: newsletterEmail });
    
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

  const featuredPosts = posts.filter(p => p.is_featured);
  const editorsPicks = posts.slice(0, 3);
  const announcements = posts.filter(p => p.category === "Announcement" || p.tags.includes("Announcement"));
  const trendingPosts = [...posts].sort((a, b) => (b.view_count + b.like_count * 2) - (a.view_count + a.like_count * 2)).slice(0, 5);

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
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-skill-green/5 pt-20 pb-16 border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-4">
                  <BookOpen size={14} />
                  SkillSwappr Blog
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Insights & Stories from the Community
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                  Tips, tutorials, case studies, and platform updates to help you master the skill economy.
                </p>
                
                {/* Search in hero */}
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles, tags, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-6 mt-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                    <p className="text-xs text-muted-foreground">Articles</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{categories.length - 1}</p>
                    <p className="text-xs text-muted-foreground">Categories</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{popularTags.length}</p>
                    <p className="text-xs text-muted-foreground">Topics</p>
                  </div>
                </div>
              </div>

              {/* Featured post card */}
              {featuredPosts[0] && (
                <div className="flex-1 max-w-lg">
                  <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg group">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-badge-gold/90 text-black text-xs font-medium rounded-full">
                      <Crown size={12} />
                      Featured
                    </div>
                    {featuredPosts[0].cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={featuredPosts[0].cover_image}
                          alt={featuredPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {featuredPosts[0].category}
                      </span>
                      <h3 className="text-xl font-bold mt-3 mb-2 group-hover:text-primary transition">
                        {featuredPosts[0].title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {featuredPosts[0].excerpt}
                      </p>
                      <button
                        onClick={() => setSelectedPost(featuredPosts[0])}
                        className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                      >
                        Read Article <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Announcements Banner */}
        {announcements.length > 0 && (
          <section className="bg-primary/5 border-b border-primary/10 py-3">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 text-primary shrink-0">
                  <Bell size={16} />
                  <span className="text-sm font-medium">Announcements:</span>
                </div>
                {announcements.slice(0, 3).map((post, i) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="shrink-0 px-3 py-1 bg-card border border-border rounded-full text-sm hover:border-primary transition"
                  >
                    {post.title}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Bar */}
        <section className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                      activeCategory === cat.name
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    <cat.icon size={14} />
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card"}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card"}`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Editor's Picks Section */}
        {editorsPicks.length > 0 && activeCategory === "All" && !searchQuery && (
          <section className="py-12 border-b border-border bg-card/30">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-2 mb-6">
                <Crown size={20} className="text-badge-gold" />
                <h2 className="text-xl font-bold">Editor's Picks</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {editorsPicks.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
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
                    <div className="p-4">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {post.category}
                      </span>
                      <h3 className="font-semibold mt-2 mb-1 line-clamp-2 group-hover:text-primary transition">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span>{post.read_time} min</span>
                        <span>•</span>
                        <span>{post.view_count} views</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* Sort & Results */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground">
                      {sortedPosts.length} result{sortedPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  )}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="discussed">Most Discussed</option>
                </select>
              </div>

              {/* Posts Grid/List */}
              {sortedPosts.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No posts found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-primary text-sm hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedPosts.map(post => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition group"
                    >
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post)}>
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                            {post.category}
                          </span>
                          {post.is_featured && <Crown size={12} className="text-badge-gold" />}
                        </div>
                        <h3 
                          className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count}</span>
                            <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comment_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className={`p-1.5 rounded-lg transition ${likedPostIds.has(post.id) ? "text-alert-red" : "text-muted-foreground hover:text-alert-red"}`}
                            >
                              <Heart size={14} fill={likedPostIds.has(post.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => toggleSave(post.id)}
                              className={`p-1.5 rounded-lg transition ${savedPostIds.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                            >
                              <Bookmark size={14} fill={savedPostIds.has(post.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedPosts.map(post => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition group flex"
                    >
                      {post.cover_image && (
                        <div className="w-64 shrink-0 overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post)}>
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                            {post.category}
                          </span>
                          {post.is_featured && <Crown size={12} className="text-badge-gold" />}
                          <span className="text-xs text-muted-foreground ml-auto">{formatTimeAgo(post.created_at)}</span>
                        </div>
                        <h3 
                          className="text-lg font-semibold mb-2 group-hover:text-primary transition cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><User size={14} /> {post.author_name}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time} min</span>
                            <span className="flex items-center gap-1"><Eye size={14} /> {post.view_count}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className={`p-2 rounded-lg transition ${likedPostIds.has(post.id) ? "text-alert-red bg-alert-red/10" : "text-muted-foreground hover:bg-card"}`}
                            >
                              <Heart size={16} fill={likedPostIds.has(post.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => toggleSave(post.id)}
                              className={`p-2 rounded-lg transition ${savedPostIds.has(post.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-card"}`}
                            >
                              <Bookmark size={16} fill={savedPostIds.has(post.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition"
                            >
                              Read
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
            <div className="space-y-6">
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

              {/* Trending */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-alert-red" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {trendingPosts.map((post, i) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="flex gap-3 text-left w-full hover:bg-muted/50 p-2 -mx-2 rounded-lg transition"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.view_count} views · {post.like_count} likes
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag size={18} />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(({ tag, count }) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition"
                      >
                        #{tag} <span className="text-muted-foreground ml-1">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Posts Link */}
              <Link 
                to="/saved" 
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary transition"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bookmark size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Your Saved Posts</h4>
                  <p className="text-sm text-muted-foreground">View all bookmarked articles</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* Post Detail Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/80 z-50 flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-card border border-border rounded-xl my-8"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-bold pr-4">{selectedPost.title}</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-muted rounded-lg transition"
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
                        return <p key={i} className="mb-4 text-foreground">{block.content}</p>;
                      }
                      if (block.type === "heading") {
                        return <h2 key={i} className="text-2xl font-bold mb-3 mt-6 text-foreground">{block.content}</h2>;
                      }
                      if (block.type === "list" && block.items) {
                        return (
                          <ul key={i} className="list-disc list-inside space-y-2 mb-4">
                            {block.items.map((item: string, j: number) => (
                              <li key={j} className="text-foreground">{item}</li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 py-4 border-t border-b border-border mb-6">
                    <button
                      onClick={() => toggleLike(selectedPost.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${likedPostIds.has(selectedPost.id) ? "bg-alert-red/10 text-alert-red" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    >
                      <Heart size={18} fill={likedPostIds.has(selectedPost.id) ? "currentColor" : "none"} />
                      {posts.find(p => p.id === selectedPost.id)?.like_count || selectedPost.like_count}
                    </button>
                    <button
                      onClick={() => toggleSave(selectedPost.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${savedPostIds.has(selectedPost.id) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    >
                      <Bookmark size={18} fill={savedPostIds.has(selectedPost.id) ? "currentColor" : "none"} />
                      Save
                    </button>
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setShowShareMenu(showShareMenu === selectedPost.id ? null : selectedPost.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:text-foreground transition"
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                      {showShareMenu === selectedPost.id && (
                        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
                          <button onClick={() => handleShare(selectedPost.id, "twitter")} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg w-full text-sm">
                            <Twitter size={16} /> Twitter
                          </button>
                          <button onClick={() => handleShare(selectedPost.id, "facebook")} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg w-full text-sm">
                            <Facebook size={16} /> Facebook
                          </button>
                          <button onClick={() => handleShare(selectedPost.id, "copy")} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg w-full text-sm">
                            {copiedLink ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            {copiedLink ? "Copied!" : "Copy Link"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
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
                          className="w-full px-4 py-3 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
                        <Link to="/login" className="text-primary hover:underline">Log in</Link> to comment
                      </p>
                    )}

                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-muted rounded-lg p-4">
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
