import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock, ArrowRight, ArrowLeft, Tag, TrendingUp, User, Heart, MessageSquare,
  Bookmark, Share2, Eye, Calendar, ChevronRight, Search, Star, Sparkles,
  ExternalLink, BookOpen, Headphones, Video, FileText, Award, Zap,
  ThumbsUp, Send, MoreHorizontal, Link2, Twitter, Facebook, Copy, CheckCircle2,
  ChevronDown, Play, Quote, List, Image as ImageIcon, Code, Crown, Flame,
  ArrowUp, Layers, Globe, PenTool, Lightbulb, Shield, Users, Target,
  BarChart3, Hash, Mic, Coffee, Loader2, Lock
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

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


const categories = [
  { name: "All", icon: Layers, count: 68 },
  { name: "Product", icon: Zap, count: 12 },
  { name: "Engineering", icon: Code, count: 8 },
  { name: "Community", icon: Users, count: 15 },
  { name: "Tips & Tricks", icon: Lightbulb, count: 10 },
  { name: "Case Studies", icon: Target, count: 7 },
  { name: "Design", icon: PenTool, count: 9 },
  { name: "Economy", icon: BarChart3, count: 5 },
  { name: "Podcasts", icon: Mic, count: 2 },
];

const posts = [
  {
    id: "skill-court-intro",
    title: "Introducing Skill Court: Community-Powered Dispute Resolution",
    excerpt: "How we built a fair, transparent system that combines community wisdom with AI analysis to resolve disputes on a peer-to-peer platform.",
    category: "Product",
    author: { name: "Alex Chen", role: "Co-Founder & CEO", avatar: "AC", bio: "Building the future of peer-to-peer skill exchange. Previously at Stripe and Notion." },
    date: "Mar 5, 2026",
    readTime: "8 min",
    featured: true,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
    tags: ["Skill Court", "Disputes", "AI", "Community"],
    likes: 342,
    comments: 47,
    views: 8900,
    bookmarks: 128,
    series: "Building Trust at Scale",
    seriesNum: 3,
    content: [
      { type: "paragraph", text: "When we first launched SkillSwappr, one of the biggest challenges was trust. How do you ensure fairness when two strangers exchange skills online? Our answer: Skill Court — a community-powered dispute resolution system that combines human judgment with AI analysis." },
      { type: "heading", text: "The Problem with Traditional Dispute Systems" },
      { type: "paragraph", text: "Most platforms rely on a small team of moderators to handle disputes. This creates bottlenecks, inconsistency, and a lack of transparency. We wanted something different — a system where the community itself participates in maintaining fairness." },
      { type: "quote", text: "Justice should be transparent, participatory, and efficient. Skill Court makes that possible.", author: "Alex Chen" },
      { type: "heading", text: "How Skill Court Works" },
      { type: "paragraph", text: "When a dispute is filed, our AI first analyzes the evidence — messages, deliverables, timelines, and workspace activity. It then presents its findings to a randomly selected panel of 5 qualified judges from the community." },
      { type: "list", items: ["AI pre-analysis reduces case review time by 60%", "Random judge selection prevents bias", "Three-round voting ensures consensus", "Appeals process available for all verdicts", "Judges earn SP and reputation for accurate verdicts"] },
      { type: "heading", text: "Results So Far" },
      { type: "paragraph", text: "Since launching Skill Court in beta, we've resolved over 400 disputes with a 94% satisfaction rate. The average resolution time is just 3.2 days, compared to the industry average of 14 days." },
      { type: "code", language: "json", text: '{\n  "cases_resolved": 412,\n  "avg_resolution_days": 3.2,\n  "satisfaction_rate": "94%",\n  "appeal_rate": "8%",\n  "ai_accuracy": "89%"\n}' },
    ],
  },
  {
    id: "scaled-10k-users",
    title: "How We Scaled to 10,000 Users Without VC Funding",
    excerpt: "The bootstrapped journey from a dorm room idea to a platform used by students across 50+ universities.",
    category: "Community",
    author: { name: "Sarah Park", role: "Head of Growth", avatar: "SP", bio: "Growth strategist passionate about community-led products." },
    date: "Mar 1, 2026",
    readTime: "6 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    tags: ["Growth", "Bootstrapped", "Community"],
    likes: 289,
    comments: 32,
    views: 6700,
    bookmarks: 94,
    series: null,
    seriesNum: 0,
    content: [],
  },
  {
    id: "maximize-sp",
    title: "5 Ways to Maximize Your Skill Points Without Spending a Dime",
    excerpt: "From referrals to court duty — here are the best ways to earn points and grow on the platform.",
    category: "Tips & Tricks",
    author: { name: "Mia Zhang", role: "Community Manager", avatar: "MZ", bio: "Helping swappers get the most out of the platform." },
    date: "Feb 25, 2026",
    readTime: "4 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
    tags: ["Skill Points", "Tips", "Earning"],
    likes: 567,
    comments: 89,
    views: 12400,
    bookmarks: 234,
    series: null,
    seriesNum: 0,
    content: [],
  },
  {
    id: "websocket-arch",
    title: "Building Real-Time Collaboration: Our WebSocket Architecture",
    excerpt: "A deep dive into how we built the gig workspace with real-time messaging, whiteboard, and video.",
    category: "Engineering",
    author: { name: "James Miller", role: "Lead Engineer", avatar: "JM", bio: "Full-stack engineer obsessed with real-time systems and distributed architectures." },
    date: "Feb 20, 2026",
    readTime: "12 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    tags: ["WebSocket", "Architecture", "Real-time", "Engineering"],
    likes: 198,
    comments: 24,
    views: 4200,
    bookmarks: 167,
    series: "Engineering Deep Dives",
    seriesNum: 1,
    content: [],
  },
  {
    id: "maya-journey",
    title: "From Zero to Guild Leader: Maya's SkillSwappr Journey",
    excerpt: "How a design student built a guild of 30 members and completed over 200 skill swaps in one year.",
    category: "Case Studies",
    author: { name: "Lena Kovac", role: "Content Writer", avatar: "LK", bio: "Telling the stories of our incredible community members." },
    date: "Feb 15, 2026",
    readTime: "7 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    tags: ["Case Study", "Guilds", "Success Story"],
    likes: 445,
    comments: 56,
    views: 9800,
    bookmarks: 112,
    series: "Swapper Spotlights",
    seriesNum: 5,
    content: [],
  },
  {
    id: "sp-economics",
    title: "The Economics of Skill Points: Why We Tax Transactions",
    excerpt: "Understanding the 5% tax system and how it prevents inflation while keeping the economy healthy.",
    category: "Economy",
    author: { name: "Alex Chen", role: "Co-Founder & CEO", avatar: "AC", bio: "Building the future of peer-to-peer skill exchange." },
    date: "Feb 10, 2026",
    readTime: "5 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    tags: ["Economy", "Skill Points", "Taxation"],
    likes: 178,
    comments: 41,
    views: 5300,
    bookmarks: 88,
    series: "Platform Economics",
    seriesNum: 2,
    content: [],
  },
  {
    id: "design-system",
    title: "How We Built Our Design System from Scratch",
    excerpt: "Creating a consistent, accessible, and beautiful UI system that scales across 20+ pages.",
    category: "Design",
    author: { name: "Nina Okafor", role: "Design Lead", avatar: "NO", bio: "Design systems enthusiast crafting pixel-perfect experiences." },
    date: "Feb 5, 2026",
    readTime: "10 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    tags: ["Design", "UI/UX", "Design System", "Tokens"],
    likes: 312,
    comments: 38,
    views: 7100,
    bookmarks: 201,
    series: "Engineering Deep Dives",
    seriesNum: 3,
    content: [],
  },
  {
    id: "guild-wars-recap",
    title: "Guild Wars Season 3: A Complete Recap and What We Learned",
    excerpt: "Breaking down the biggest competitive season yet with stats, highlights, and feedback.",
    category: "Community",
    author: { name: "Sarah Park", role: "Head of Growth", avatar: "SP", bio: "Growth strategist passionate about community-led products." },
    date: "Jan 28, 2026",
    readTime: "9 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop",
    tags: ["Guild Wars", "Competition", "Community"],
    likes: 523,
    comments: 72,
    views: 11200,
    bookmarks: 156,
    series: null,
    seriesNum: 0,
    content: [],
  },
];

const blogSeries = [
  { name: "Building Trust at Scale", count: 4, color: "text-court-blue", bg: "bg-court-blue/10", borderColor: "border-court-blue/20" },
  { name: "Engineering Deep Dives", count: 6, color: "text-skill-green", bg: "bg-skill-green/10", borderColor: "border-skill-green/20" },
  { name: "Platform Economics", count: 3, color: "text-foreground", bg: "bg-surface-2", borderColor: "border-border" },
  { name: "Swapper Spotlights", count: 8, color: "text-alert-red", bg: "bg-alert-red/10", borderColor: "border-alert-red/20" },
];

const contentFormats = [
  { icon: FileText, label: "Articles", count: 42 },
  { icon: Video, label: "Video Posts", count: 8 },
  { icon: Headphones, label: "Podcasts", count: 12 },
  { icon: Code, label: "Tech Talks", count: 6 },
];

const editorsPickIds = ["maximize-sp", "maya-journey", "design-system"];

const popularTags = [
  { tag: "Skill Points", count: 24 },
  { tag: "Guilds", count: 18 },
  { tag: "Design", count: 16 },
  { tag: "Engineering", count: 14 },
  { tag: "Community", count: 22 },
  { tag: "AI", count: 11 },
  { tag: "Tips", count: 19 },
  { tag: "Court", count: 9 },
  { tag: "Growth", count: 13 },
  { tag: "Economy", count: 8 },
  { tag: "WebSocket", count: 5 },
  { tag: "Tutorial", count: 15 },
];

const authors = [
  { name: "Alex Chen", role: "Co-Founder & CEO", avatar: "AC", posts: 12, followers: 2400 },
  { name: "Sarah Park", role: "Head of Growth", avatar: "SP", posts: 9, followers: 1800 },
  { name: "James Miller", role: "Lead Engineer", avatar: "JM", posts: 7, followers: 1500 },
  { name: "Nina Okafor", role: "Design Lead", avatar: "NO", posts: 6, followers: 1200 },
  { name: "Mia Zhang", role: "Community Manager", avatar: "MZ", posts: 8, followers: 980 },
  { name: "Lena Kovac", role: "Content Writer", avatar: "LK", posts: 11, followers: 870 },
];

const readingLists = [
  { name: "Getting Started", desc: "Essential reads for new users", count: 5, icon: Zap },
  { name: "For Guild Leaders", desc: "Build & manage your team", count: 4, icon: Shield },
  { name: "Platform Deep Dives", desc: "How we build SkillSwappr", count: 6, icon: Code },
  { name: "Success Stories", desc: "Real user journeys", count: 8, icon: Star },
];

const BlogPage = () => {
  const { user, profile } = useAuth();
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "discussed">("latest");
  const [copiedLink, setCopiedLink] = useState(false);
  const [email, setEmail] = useState("");

  // Database state
  const [dbPosts, setDbPosts] = useState<DbBlogPost[]>([]);
  const [dbComments, setDbComments] = useState<DbBlogComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Convert DB content format to display format
  const parseContent = (content: any) => {
    if (!content || !Array.isArray(content)) return [];
    return content.map((block: any) => {
      if (block.type === "paragraph") return { type: "paragraph", text: block.content };
      if (block.type === "heading") return { type: "heading", text: block.content, level: block.level };
      if (block.type === "quote") return { type: "quote", text: block.content, author: block.author };
      if (block.type === "list") return { type: "list", items: block.items };
      if (block.type === "code") return { type: "code", text: block.content, language: block.language || "text" };
      return block;
    });
  };

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: blogPosts } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        
        if (blogPosts) setDbPosts(blogPosts);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch comments when a post is selected
  useEffect(() => {
    if (!selectedPost) return;

    const fetchComments = async () => {
      const { data: comments } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost)
        .order("created_at", { ascending: true });
      
      if (comments) setDbComments(comments);
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
      post_id: selectedPost,
      author_id: user.id,
      author_name: profile?.display_name || profile?.full_name || "Anonymous",
      content: commentText
    });

    if (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } else {
      toast.success("Comment added!");
      setCommentText("");
      // Refresh comments
      const { data: comments } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", selectedPost)
        .order("created_at", { ascending: true });
      if (comments) setDbComments(comments);
    }
  };

  // Convert DB posts to display format
  const allPosts = dbPosts.length > 0 
    ? dbPosts.map(p => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt || "",
        category: p.category,
        author: {
          name: p.author_name,
          role: "Author",
          avatar: p.author_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
          bio: ""
        },
        date: formatTimeAgo(p.created_at),
        readTime: `${p.read_time} min`,
        featured: p.is_featured,
        image: p.cover_image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        tags: p.tags || [],
        likes: p.like_count,
        comments: p.comment_count,
        views: p.view_count,
        bookmarks: 0,
        series: null as string | null,
        seriesNum: 0,
        content: parseContent(p.content)
      }))
    : posts;

  const filtered = (active === "All" ? allPosts : allPosts.filter((p) => p.category === active))
    .filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "discussed") return b.comments - a.comments;
      return 0;
    });

  const featured = allPosts.find((p) => p.featured);
  const openPost = allPosts.find((p) => p.id === selectedPost);
  const editorsPicks = allPosts.filter((p) => editorsPickIds.includes(p.id)).slice(0, 3);
  const popularPosts = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 5);
  const mostDiscussed = [...allPosts].sort((a, b) => b.comments - a.comments).slice(0, 4);
  

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleBookmark = (id: string) => {
    setBookmarkedPosts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const handleCopyLink = () => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); };

  // ========== BLOG POST DETAIL VIEW ==========
  if (openPost) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <CustomCursor />
          <CursorGlow />
          <Navbar />

          <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border">
            <motion.div className="h-full bg-foreground" initial={{ width: "0%" }} animate={{ width: "30%" }} />
          </div>

          <article className="pt-28 pb-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
                {/* Main Content */}
                <div>
                  {/* Breadcrumb */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <button onClick={() => setSelectedPost(null)} className="hover:text-foreground transition-colors">Blog</button>
                    <ChevronRight size={10} />
                    <button onClick={() => { setSelectedPost(null); setActive(openPost.category); }} className="hover:text-foreground transition-colors">{openPost.category}</button>
                    <ChevronRight size={10} />
                    <span className="text-foreground truncate max-w-xs">{openPost.title}</span>
                  </motion.div>

                  {openPost.series && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-court-blue/20 bg-court-blue/5 px-3 py-1">
                      <BookOpen size={12} className="text-court-blue" />
                      <span className="text-[10px] font-semibold text-court-blue">{openPost.series} · Part {openPost.seriesNum}</span>
                    </motion.div>
                  )}

                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-heading text-3xl font-black text-foreground sm:text-4xl leading-tight">
                    {openPost.title}
                  </motion.h1>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground">{openPost.author.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{openPost.author.name}</p>
                        <p className="text-[10px] text-muted-foreground">{openPost.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {openPost.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {openPost.readTime}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {openPost.views.toLocaleString()}</span>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 overflow-hidden rounded-2xl border border-border">
                    <img src={openPost.image} alt={openPost.title} className="w-full aspect-video object-cover" />
                  </motion.div>

                  {openPost.content.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-10 rounded-2xl border border-border bg-card p-6">
                      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-foreground"><List size={14} /> Table of Contents</h3>
                      <div className="space-y-1.5">
                        {openPost.content.filter((b) => b.type === "heading").map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><ChevronRight size={10} />{b.text}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-12 space-y-6">
                    {openPost.content.map((block, i) => {
                      if (block.type === "paragraph") return <p key={i} className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>;
                      if (block.type === "heading") return <h2 key={i} className="font-heading text-xl font-bold text-foreground pt-4">{block.text}</h2>;
                      if (block.type === "quote") return (
                        <blockquote key={i} className="rounded-xl border-l-2 border-court-blue bg-court-blue/5 p-5">
                          <Quote size={16} className="mb-2 text-court-blue" />
                          <p className="text-sm italic text-foreground">{block.text}</p>
                          {block.author && <p className="mt-2 text-[10px] text-muted-foreground">— {block.author}</p>}
                        </blockquote>
                      );
                      if (block.type === "list") return (
                        <ul key={i} className="space-y-2 pl-1">
                          {block.items?.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 size={14} className="shrink-0 mt-0.5 text-skill-green" />{item}</li>
                          ))}
                        </ul>
                      );
                      if (block.type === "code") return (
                        <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface-1">
                          <div className="flex items-center justify-between border-b border-border/50 bg-surface-2 px-4 py-2">
                            <span className="font-mono text-[10px] text-muted-foreground">{block.language}</span>
                            <button className="text-[10px] text-muted-foreground hover:text-foreground"><Copy size={12} /></button>
                          </div>
                          <pre className="p-4 font-mono text-xs text-foreground overflow-x-auto">{block.text}</pre>
                        </div>
                      );
                      return null;
                    })}
                  </motion.div>

                  <div className="mb-8 flex flex-wrap gap-2">
                    {openPost.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-surface-1 px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <Tag size={10} className="inline mr-1" />{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-10 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleLike(openPost.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${likedPosts.has(openPost.id) ? "bg-alert-red/10 text-alert-red" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                        <Heart size={14} fill={likedPosts.has(openPost.id) ? "currentColor" : "none"} /> {openPost.likes + (likedPosts.has(openPost.id) ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"><MessageSquare size={14} /> {openPost.comments}</button>
                      <button onClick={() => toggleBookmark(openPost.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${bookmarkedPosts.has(openPost.id) ? "bg-badge-gold/10 text-badge-gold" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                        <Bookmark size={14} fill={bookmarkedPosts.has(openPost.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground mr-2">Share:</span>
                      <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Twitter size={14} /></button>
                      <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Facebook size={14} /></button>
                      <button onClick={handleCopyLink} className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground">
                        {copiedLink ? <CheckCircle2 size={14} className="text-skill-green" /> : <Link2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Author Bio */}
                  <div className="mb-10 rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-lg font-bold text-foreground">{openPost.author.avatar}</div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Written by {openPost.author.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{openPost.author.role}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{openPost.author.bio}</p>
                        <button className="mt-3 rounded-lg bg-surface-2 px-4 py-1.5 text-[10px] font-semibold text-foreground hover:bg-surface-3 transition-colors">Follow Author</button>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="mb-10">
                    <h3 className="mb-6 font-heading text-lg font-bold text-foreground flex items-center gap-2"><MessageSquare size={18} /> Comments ({openPost.comments})</h3>
                    <div className="mb-6 rounded-2xl border border-border bg-card p-5">
                      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your thoughts..." className="mb-3 h-20 w-full resize-none rounded-xl border border-border bg-surface-1 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><ImageIcon size={14} /></button>
                          <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Code size={14} /></button>
                          <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Link2 size={14} /></button>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">Post Comment <Send size={12} /></motion.button>
                      </div>
                    </div>
                    {[
                      { author: "Maya K.", avatar: "MK", time: "2 hours ago", text: "This is exactly what the platform needed. The transparency in the dispute process is game-changing!", likes: 12, replies: 3 },
                      { author: "Carlos M.", avatar: "CM", time: "5 hours ago", text: "I've been a judge on 3 cases so far. The AI pre-analysis really helps speed things up. Great write-up!", likes: 8, replies: 1 },
                      { author: "Lena S.", avatar: "LS", time: "1 day ago", text: "Would love to see a follow-up about how the appeal process works in detail. Any plans for that?", likes: 15, replies: 2 },
                    ].map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mb-4 rounded-xl border border-border bg-card p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">{c.avatar}</div>
                            <span className="text-xs font-semibold text-foreground">{c.author}</span>
                            <span className="text-[10px] text-muted-foreground">· {c.time}</span>
                          </div>
                          <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={14} /></button>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp size={11} /> {c.likes}</button>
                          <button className="flex items-center gap-1 hover:text-foreground"><MessageSquare size={11} /> {c.replies} replies</button>
                          <button className="hover:text-foreground">Reply</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Related Posts */}
                  <div>
                    <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Related Posts</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {posts.filter((p) => p.id !== openPost.id).slice(0, 3).map((post) => (
                        <div key={post.id} onClick={() => { setSelectedPost(post.id); window.scrollTo(0, 0); }} className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all">
                          <div className="aspect-video overflow-hidden">
                            <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <p className="font-heading text-xs font-bold text-foreground line-clamp-2">{post.title}</p>
                            <p className="mt-1 text-[10px] text-muted-foreground">{post.readTime} · {post.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Article Sidebar */}
                <div className="space-y-4 hidden lg:block">
                  {/* Author mini card */}
                  <div className="rounded-2xl border border-border bg-card p-5 text-center sticky top-24">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-surface-2 font-mono text-lg font-bold text-foreground mb-3">{openPost.author.avatar}</div>
                    <p className="text-sm font-bold text-foreground">{openPost.author.name}</p>
                    <p className="text-[10px] text-muted-foreground mb-3">{openPost.author.role}</p>
                    <button className="w-full rounded-xl bg-foreground py-2 text-xs font-semibold text-background mb-3">Follow</button>

                    <div className="border-t border-border pt-3 mt-3">
                      <h4 className="text-[10px] font-bold text-foreground mb-2">More from {openPost.author.name.split(" ")[0]}</h4>
                      {posts.filter(p => p.author.name === openPost.author.name && p.id !== openPost.id).slice(0, 2).map(p => (
                        <button key={p.id} onClick={() => { setSelectedPost(p.id); window.scrollTo(0, 0); }} className="block w-full text-left mb-2 group">
                          <p className="text-[10px] font-medium text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors">{p.title}</p>
                          <p className="text-[8px] text-muted-foreground">{p.readTime} · {p.date}</p>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-border pt-3 mt-3">
                      <h4 className="text-[10px] font-bold text-foreground mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {openPost.tags.map(t => (
                          <span key={t} className="rounded-md bg-surface-1 px-2 py-0.5 text-[8px] text-muted-foreground">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </PageTransition>
    );
  }

  // ========== AUTH PROTECTION ==========
  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2 border border-border">
                <Lock size={32} className="text-muted-foreground" />
              </div>
              <h1 className="mb-3 font-heading text-3xl font-bold text-foreground">Login Required</h1>
              <p className="mb-6 text-muted-foreground">Please log in to access the blog and community content.</p>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity">
                Log In <ArrowRight size={16} />
              </Link>
              <p className="mt-4 text-xs text-muted-foreground">
                Don't have an account? <Link to="/signup" className="text-foreground hover:underline">Sign up</Link>
              </p>
            </motion.div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // ========== BLOG LISTING VIEW ==========
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--court-blue)/0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,hsl(var(--badge-gold)/0.04),transparent_40%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Left */}
              <div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                    <BookOpen size={12} /> The Blog
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-skill-green/10 px-3 py-1 text-[10px] font-medium text-skill-green">
                    <Sparkles size={10} /> 68 articles
                  </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
                  Stories & <span className="text-muted-foreground">Insights</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 max-w-lg text-lg text-muted-foreground">
                  Product updates, engineering deep-dives, community stories, and tips to level up your SkillSwappr game.
                </motion.p>

                {/* Hero search */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative max-w-md">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles, tags, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                  />
                </motion.div>

                {/* Mini stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-6">
                  {[
                    { v: "68", l: "Articles" },
                    { v: "12", l: "Podcasts" },
                    { v: "6", l: "Authors" },
                    { v: "52K", l: "Readers" },
                  ].map(s => (
                    <div key={s.l}>
                      <p className="font-heading text-2xl font-black text-foreground">{s.v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: Featured Post Card */}
              {featured && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  onClick={() => setSelectedPost(featured.id)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={featured.image} alt={featured.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 rounded-full bg-skill-green/90 px-3 py-1 text-[10px] font-bold text-background">Featured</span>
                  </div>
                  <div className="p-6">
                    {featured.series && <span className="mb-2 block text-[10px] font-semibold text-court-blue">{featured.series} · Part {featured.seriesNum}</span>}
                    <h2 className="mb-2 font-heading text-lg font-bold text-foreground">{featured.title}</h2>
                    <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-[7px] font-bold">{featured.author.avatar}</div>
                        {featured.author.name}
                      </div>
                      <span>{featured.readTime}</span>
                      <span className="flex items-center gap-0.5"><Heart size={10} /> {featured.likes}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: CATEGORY BAR ===== */}
        <section className="border-y border-border bg-surface-1 py-4">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button key={cat.name} onClick={() => setActive(cat.name)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${active === cat.name ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                  <cat.icon size={13} />
                  {cat.name}
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: EDITOR'S PICKS ===== */}
        <section className="py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-2">
              <Crown size={16} className="text-muted-foreground" />
              <h2 className="font-heading text-xl font-bold text-foreground">Editor's Picks</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-3">
              {editorsPicks.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedPost(post.id)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-foreground/90 px-2.5 py-0.5 text-[9px] font-bold text-background">
                      <Star size={9} /> Pick
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="mb-2 block text-[10px] text-muted-foreground">{post.category}</span>
                    <h3 className="mb-2 font-heading text-sm font-bold text-foreground line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Eye size={9} /> {post.views.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: CONTENT FORMATS ===== */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap gap-3">
              {contentFormats.map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 hover:border-foreground/20 cursor-pointer transition-colors">
                  <f.icon size={14} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{f.label}</span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: MAIN GRID + SIDEBAR ===== */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            {/* Sort Bar */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {active === "All" ? "Latest Posts" : active}
              </h2>
              <div className="flex items-center gap-2">
                {(["latest", "popular", "discussed"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)} className={`rounded-lg px-3 py-1.5 text-[10px] font-medium capitalize transition-colors ${sortBy === s ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* Post Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.filter((p) => !p.featured || active !== "All").map((post, i) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedPost(post.id)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {post.series && <span className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-semibold text-foreground">{post.series}</span>}
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }} className={`absolute top-3 right-3 rounded-full p-1.5 backdrop-blur-sm transition-colors ${bookmarkedPosts.has(post.id) ? "bg-badge-gold/20 text-badge-gold" : "bg-background/50 text-foreground/70 hover:text-foreground"}`}>
                        <Bookmark size={12} fill={bookmarkedPosts.has(post.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{post.category}</span>
                        <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="mb-2 font-heading text-sm font-bold text-foreground line-clamp-2">{post.title}</h3>
                      <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 font-mono text-[8px] font-bold text-foreground">{post.author.avatar}</div>
                          <span className="text-[10px] text-muted-foreground">{post.author.name} · {post.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Heart size={10} /> {post.likes}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {post.comments}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-md bg-surface-1 px-2 py-0.5 text-[9px] text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Popular Posts */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <Flame size={14} className="text-alert-red" /> Most Read
                  </h3>
                  <div className="space-y-3">
                    {popularPosts.map((p, i) => (
                      <button key={p.id} onClick={() => setSelectedPost(p.id)} className="flex items-start gap-3 w-full text-left group">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                        <div>
                          <p className="text-[11px] font-medium text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors">{p.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                            <span>{p.author.name}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><Eye size={8} /> {p.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Cloud */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <Hash size={14} className="text-court-blue" /> Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {popularTags.map((t) => (
                      <span key={t.tag} className="rounded-md border border-border bg-surface-1 px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/20 cursor-pointer transition-colors">
                        #{t.tag} <span className="text-muted-foreground/50">{t.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Authors */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <Users size={14} className="text-skill-green" /> Authors
                  </h3>
                  <div className="space-y-3">
                    {authors.slice(0, 4).map((a) => (
                      <div key={a.name} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">{a.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-foreground truncate">{a.name}</p>
                          <p className="text-[8px] text-muted-foreground">{a.posts} posts · {a.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Mini */}
                <div className="rounded-2xl border border-court-blue/20 bg-court-blue/5 p-5">
                  <Sparkles size={20} className="mb-2 text-court-blue" />
                  <p className="text-xs font-bold text-foreground mb-1">Stay Updated</p>
                  <p className="text-[10px] text-muted-foreground mb-3">Weekly digest of our best articles.</p>
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mb-2 h-9 w-full rounded-lg border border-border bg-surface-1 px-3 text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring" />
                  <button className="w-full rounded-lg bg-foreground py-2 text-[10px] font-semibold text-background">Subscribe</button>
                </div>

                {/* Reading Lists */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <BookOpen size={14} className="text-badge-gold" /> Reading Lists
                  </h3>
                  <div className="space-y-2.5">
                    {readingLists.map((r) => (
                      <div key={r.name} className="flex items-center gap-3 cursor-pointer group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                          <r.icon size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-foreground group-hover:text-muted-foreground transition-colors">{r.name}</p>
                          <p className="text-[8px] text-muted-foreground">{r.count} articles</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: MOST DISCUSSED ===== */}
        <section className="border-t border-border bg-surface-1 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-2">
              <MessageSquare size={16} className="text-court-blue" />
              <h2 className="font-heading text-xl font-bold text-foreground">Most Discussed</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mostDiscussed.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedPost(post.id)}
                  className="cursor-pointer rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-all group">
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquare size={14} className="text-court-blue" />
                    <span className="font-mono text-lg font-black text-foreground">{post.comments}</span>
                    <span className="text-[9px] text-muted-foreground">comments</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors">{post.title}</h3>
                  <p className="mt-2 text-[10px] text-muted-foreground">{post.author.name} · {post.readTime}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 7: BLOG SERIES ===== */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-2">
              <BookOpen size={16} className="text-skill-green" />
              <h2 className="font-heading text-xl font-bold text-foreground">Blog Series</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blogSeries.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className={`group cursor-pointer rounded-2xl border ${s.borderColor} bg-card p-6 hover:shadow-lg transition-all`}>
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <BookOpen size={18} className={s.color} />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{s.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{s.count} parts · Ongoing</p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                    Read series <ArrowRight size={10} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 8: ALL AUTHORS ===== */}
        <section className="border-t border-border bg-surface-1 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-2">
              <Users size={16} className="text-foreground" />
              <h2 className="font-heading text-xl font-bold text-foreground">Meet the Authors</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((a, i) => (
                <motion.div key={a.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-all cursor-pointer">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-lg font-bold text-foreground">{a.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.role}</p>
                    <div className="mt-1 flex items-center gap-3 text-[9px] text-muted-foreground">
                      <span>{a.posts} posts</span>
                      <span>{a.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">Follow</button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 9: READING LISTS ===== */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center gap-2">
              <Bookmark size={16} className="text-badge-gold" />
              <h2 className="font-heading text-xl font-bold text-foreground">Curated Reading Lists</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {readingLists.map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-all cursor-pointer">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 group-hover:bg-badge-gold/10 transition-colors">
                    <r.icon size={20} className="text-muted-foreground group-hover:text-badge-gold transition-colors" />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{r.name}</h3>
                  <p className="text-[10px] text-muted-foreground mb-2">{r.desc}</p>
                  <span className="text-[10px] font-mono text-muted-foreground">{r.count} articles</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 10: BLOG STATS ===== */}
        <section className="border-t border-border bg-surface-1 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 text-center">
              <h2 className="font-heading text-xl font-bold text-foreground">Blog by the Numbers</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {[
                { l: "Articles", v: "68", icon: FileText },
                { l: "Total Reads", v: "78K", icon: Eye },
                { l: "Comments", v: "4.2K", icon: MessageSquare },
                { l: "Authors", v: "6", icon: Users },
                { l: "Series", v: "4", icon: BookOpen },
                { l: "Avg Read", v: "7 min", icon: Clock },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 text-center">
                  <s.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-xl font-black text-foreground">{s.v}</p>
                  <p className="text-[9px] text-muted-foreground">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 11: NEWSLETTER ===== */}
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-8 sm:p-12">
              <Coffee size={28} className="mx-auto mb-4 text-badge-gold" />
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Stay in the Loop</h2>
              <p className="mb-6 text-sm text-muted-foreground">Get the latest posts, platform updates, and community highlights delivered weekly.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="h-12 flex-1 rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-xl bg-foreground px-6 text-sm font-semibold text-background">Subscribe</motion.button>
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground">No spam. Unsubscribe anytime. 2,400+ subscribers.</p>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPage;
