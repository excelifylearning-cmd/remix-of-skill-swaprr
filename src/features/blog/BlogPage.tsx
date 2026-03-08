import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ArrowRight, ArrowLeft, Tag, TrendingUp, User, Heart, MessageSquare,
  Bookmark, Share2, Eye, Calendar, ChevronRight, Search, Star, Sparkles,
  ExternalLink, BookOpen, Headphones, Video, FileText, Award, Zap,
  ThumbsUp, Send, MoreHorizontal, Link2, Twitter, Facebook, Copy, CheckCircle2,
  ChevronDown, Play, Quote, List, Image as ImageIcon, Code
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const categories = ["All", "Product", "Engineering", "Community", "Tips & Tricks", "Case Studies", "Design", "Economy"];

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
  { name: "Building Trust at Scale", count: 4, color: "court-blue" },
  { name: "Engineering Deep Dives", count: 6, color: "skill-green" },
  { name: "Platform Economics", count: 3, color: "badge-gold" },
  { name: "Swapper Spotlights", count: 8, color: "alert-red" },
];

const contentFormats = [
  { icon: FileText, label: "Articles", count: 42 },
  { icon: Video, label: "Video Posts", count: 8 },
  { icon: Headphones, label: "Podcasts", count: 12 },
  { icon: Code, label: "Tech Talks", count: 6 },
];

const BlogPage = () => {
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "discussed">("latest");
  const [copiedLink, setCopiedLink] = useState(false);

  const filtered = (active === "All" ? posts : posts.filter((p) => p.category === active))
    .filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "discussed") return b.comments - a.comments;
      return 0;
    });

  const featured = posts.find((p) => p.featured);
  const openPost = posts.find((p) => p.id === selectedPost);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Blog Post Detail View
  if (openPost) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <CustomCursor />
          <CursorGlow />
          <Navbar />

          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border">
            <motion.div className="h-full bg-foreground" initial={{ width: "0%" }} animate={{ width: "30%" }} />
          </div>

          <article className="pt-28 pb-20">
            <div className="mx-auto max-w-4xl px-6">
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedPost(null)}
                className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back to Blog
              </motion.button>

              {/* Series Badge */}
              {openPost.series && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-court-blue/20 bg-court-blue/5 px-3 py-1">
                  <BookOpen size={12} className="text-court-blue" />
                  <span className="text-[10px] font-semibold text-court-blue">{openPost.series} · Part {openPost.seriesNum}</span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-heading text-3xl font-black text-foreground sm:text-5xl leading-tight">
                {openPost.title}
              </motion.h1>

              {/* Author & Meta */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground">{openPost.author.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{openPost.author.name}</p>
                    <p className="text-[10px] text-muted-foreground">{openPost.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {openPost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {openPost.readTime} read</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {openPost.views.toLocaleString()}</span>
                </div>
              </motion.div>

              {/* Hero Image */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 overflow-hidden rounded-2xl border border-border">
                <img src={openPost.image} alt={openPost.title} className="w-full aspect-video object-cover" />
              </motion.div>

              {/* Table of Contents */}
              {openPost.content.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10 rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-foreground">
                    <List size={14} /> Table of Contents
                  </h3>
                  <div className="space-y-1.5">
                    {openPost.content.filter((b) => b.type === "heading").map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <ChevronRight size={10} />
                        {b.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose-custom mb-12 space-y-6">
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
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-skill-green" />
                          {item}
                        </li>
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

              {/* Tags */}
              <div className="mb-8 flex flex-wrap gap-2">
                {openPost.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-surface-1 px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <Tag size={10} className="inline mr-1" />{tag}
                  </span>
                ))}
              </div>

              {/* Engagement Bar */}
              <div className="mb-10 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleLike(openPost.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${likedPosts.has(openPost.id) ? "bg-alert-red/10 text-alert-red" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                    <Heart size={14} fill={likedPosts.has(openPost.id) ? "currentColor" : "none"} /> {openPost.likes + (likedPosts.has(openPost.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
                    <MessageSquare size={14} /> {openPost.comments}
                  </button>
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

              {/* Author Bio Card */}
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

              {/* Comments Section */}
              <div className="mb-10">
                <h3 className="mb-6 font-heading text-lg font-bold text-foreground flex items-center gap-2">
                  <MessageSquare size={18} /> Comments ({openPost.comments})
                </h3>

                {/* Comment Composer */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-5">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="mb-3 h-20 w-full resize-none rounded-xl border border-border bg-surface-1 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><ImageIcon size={14} /></button>
                      <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Code size={14} /></button>
                      <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Link2 size={14} /></button>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">
                      Post Comment <Send size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Sample Comments */}
                {[
                  { author: "Maya K.", avatar: "MK", time: "2 hours ago", text: "This is exactly what the platform needed. The transparency in the dispute process is game-changing!", likes: 12, replies: 3 },
                  { author: "Carlos M.", avatar: "CM", time: "5 hours ago", text: "I've been a judge on 3 cases so far. The AI pre-analysis really helps speed things up. Great write-up!", likes: 8, replies: 1 },
                  { author: "Lena S.", avatar: "LS", time: "1 day ago", text: "Would love to see a follow-up about how the appeal process works in detail. Any plans for that?", likes: 15, replies: 2 },
                ].map((comment, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mb-4 rounded-xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">{comment.avatar}</div>
                        <span className="text-xs font-semibold text-foreground">{comment.author}</span>
                        <span className="text-[10px] text-muted-foreground">· {comment.time}</span>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={14} /></button>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp size={11} /> {comment.likes}</button>
                      <button className="flex items-center gap-1 hover:text-foreground"><MessageSquare size={11} /> {comment.replies} replies</button>
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
          </article>

          <CTAFooterSection />
        </div>
      </PageTransition>
    );
  }

  // Blog Listing View
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
                <Sparkles size={12} /> Stories, insights & updates
              </div>
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">Blog</h1>
              <p className="text-lg text-muted-foreground max-w-xl">Product updates, engineering deep-dives, community stories, and tips to maximize your SkillSwappr experience.</p>
            </motion.div>

            {/* Content Format Pills */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8 flex flex-wrap gap-3">
              {contentFormats.map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 hover:border-foreground/20 cursor-pointer transition-colors">
                  <f.icon size={14} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{f.label}</span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">{f.count}</span>
                </div>
              ))}
            </motion.div>

            {/* Search + Filter Bar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts, tags, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                {(["latest", "popular", "discussed"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)} className={`rounded-lg px-3 py-1.5 text-[10px] font-medium capitalize transition-colors ${sortBy === s ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <div className="mb-10 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)} className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${active === cat ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured Post */}
            {featured && active === "All" && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedPost(featured.id)}
                className="mb-12 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img src={featured.image} alt={featured.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-skill-green/10 px-3 py-1 text-[10px] font-semibold text-skill-green">Featured</span>
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-[10px] text-muted-foreground">{featured.category}</span>
                    </div>
                    {featured.series && (
                      <span className="mb-2 text-[10px] font-semibold text-court-blue">{featured.series} · Part {featured.seriesNum}</span>
                    )}
                    <h2 className="mb-3 font-heading text-2xl font-bold text-foreground lg:text-3xl">{featured.title}</h2>
                    <p className="mb-6 text-sm text-muted-foreground">{featured.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={12} /> {featured.author.name}</span>
                      <span>{featured.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                      <span className="flex items-center gap-1"><Heart size={12} /> {featured.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {featured.comments}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Post Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.filter((p) => !p.featured || active !== "All").map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedPost(post.id)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {post.series && (
                      <span className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-semibold text-foreground">{post.series}</span>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }} className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${bookmarkedPosts.has(post.id) ? "bg-badge-gold/20 text-badge-gold" : "bg-background/50 text-foreground/70 hover:text-foreground"}`}>
                        <Bookmark size={12} fill={bookmarkedPosts.has(post.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{post.category}</span>
                      <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="mb-2 font-heading text-base font-bold text-foreground line-clamp-2">{post.title}</h3>
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
                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-md bg-surface-1 px-2 py-0.5 text-[9px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Series Section */}
        <section className="bg-surface-1 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen size={20} /> Blog Series
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blogSeries.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group cursor-pointer rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-all">
                  <div className={`mb-3 h-1 w-12 rounded-full bg-${s.color}`} />
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{s.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{s.count} parts · Ongoing</p>
                  <ArrowRight size={12} className="mt-2 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-8 sm:p-12">
              <Sparkles size={28} className="mx-auto mb-4 text-badge-gold" />
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Stay in the Loop</h2>
              <p className="mb-6 text-sm text-muted-foreground">Get the latest posts, platform updates, and community highlights delivered weekly.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="h-12 flex-1 rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-xl bg-foreground px-6 text-sm font-semibold text-background">
                  Subscribe
                </motion.button>
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </motion.div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default BlogPage;
