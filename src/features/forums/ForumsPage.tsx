import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Users, Flame, Pin, ArrowRight, ArrowLeft, ThumbsUp, ThumbsDown,
  Eye, Clock, Hash, Zap, Palette, Code, Trophy, Shield, Search, Star, Bell,
  ChevronDown, ChevronUp, Send, MoreHorizontal, Award, Bookmark, Share2,
  Filter, Image as ImageIcon, FileText, Link2, Paperclip, ArrowUpRight,
  TrendingUp, Lock, Globe, CheckCircle2, AlertCircle, Heart, AtSign,
  BarChart3, Layers, ChevronRight, Bot, Gift, Crown, Sparkles, Copy, Play
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

type SortType = "hot" | "new" | "top" | "rising";
type ThreadView = "list" | "detail";

const forumCategories = [
  { icon: MessageSquare, name: "General Discussion", desc: "Talk about anything related to SkillSwappr", threads: 1240, posts: 8930, color: "foreground", online: 89 },
  { icon: Palette, name: "Design Corner", desc: "Share design work, get feedback, discuss trends", threads: 890, posts: 5670, color: "court-blue", online: 42 },
  { icon: Code, name: "Dev Talk", desc: "Programming, architecture, and tech discussions", threads: 1100, posts: 7240, color: "skill-green", online: 67 },
  { icon: Trophy, name: "Achievements & Milestones", desc: "Celebrate wins and share your journey", threads: 560, posts: 3400, color: "badge-gold", online: 28 },
  { icon: Shield, name: "Skill Court", desc: "Discuss cases, judging tips, and dispute resolution", threads: 340, posts: 2100, color: "alert-red", online: 15 },
  { icon: Users, name: "Guild Recruitment", desc: "Find or build your dream team", threads: 780, posts: 4200, color: "court-blue", online: 34 },
  { icon: Zap, name: "Tips & Tricks", desc: "Pro tips for maximizing your experience", threads: 620, posts: 3800, color: "badge-gold", online: 51 },
  { icon: Hash, name: "Feature Requests", desc: "Suggest and vote on new features", threads: 430, posts: 2900, color: "skill-green", online: 23 },
  { icon: BarChart3, name: "Marketplace Meta", desc: "Pricing strategies, gig optimization, and market trends", threads: 310, posts: 1800, color: "badge-gold", online: 19 },
  { icon: Globe, name: "Off-Topic Lounge", desc: "Anything goes — memes, random chats, and vibes", threads: 950, posts: 6100, color: "muted-foreground", online: 76 },
];

const announcements = [
  { title: "🚀 Co-Creation Studio is now live!", date: "Mar 3, 2026", pinned: true, author: "Admin", comments: 128 },
  { title: "📋 Community Guidelines Update — Please Read", date: "Feb 28, 2026", pinned: true, author: "Mod Team", comments: 47 },
  { title: "🏆 Guild Wars Season 4 starts next week!", date: "Mar 1, 2026", pinned: true, author: "Admin", comments: 234 },
];

interface Thread {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  authorFlair: string;
  authorKarma: number;
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  hot: boolean;
  category: string;
  timeAgo: string;
  tags: string[];
  hasImage: boolean;
  hasPoll: boolean;
  hasCode: boolean;
  hasAttachment: boolean;
  locked: boolean;
  sticky: boolean;
  content: string;
  awards: { icon: string; count: number }[];
}

const allThreads: Thread[] = [
  {
    id: "1", title: "What's the fastest way to reach Gold tier?", author: "Maya K.", authorAvatar: "MK", authorFlair: "Guild Leader",
    authorKarma: 4520, replies: 47, views: 1200, upvotes: 89, downvotes: 3, hot: true, category: "Tips & Tricks", timeAgo: "2h ago",
    tags: ["tier", "progression", "guide"], hasImage: false, hasPoll: false, hasCode: false, hasAttachment: false,
    locked: false, sticky: false,
    content: "I've been on the platform for about 3 months and I'm currently Silver tier. For those who've already hit Gold — what strategies worked best? I'm averaging about 4 gigs/week and have a 4.8 rating but progress feels slow. Any tips on accelerating through the ranking system?",
    awards: [{ icon: "⭐", count: 2 }, { icon: "🔥", count: 1 }],
  },
  {
    id: "2", title: "My guild just hit 50 members — here's what I learned", author: "Carlos M.", authorAvatar: "CM", authorFlair: "Veteran Swapper",
    authorKarma: 3210, replies: 32, views: 890, upvotes: 124, downvotes: 5, hot: true, category: "Guild Recruitment", timeAgo: "4h ago",
    tags: ["guild", "leadership", "growth"], hasImage: true, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "After 6 months of building PixelForge guild, we just crossed 50 active members! It wasn't easy. Here's a breakdown of what worked, what didn't, and the key metrics I tracked along the way. I've attached our growth spreadsheet for anyone interested.",
    awards: [{ icon: "🏆", count: 3 }, { icon: "⭐", count: 5 }, { icon: "💎", count: 1 }],
  },
  {
    id: "3", title: "Unpopular opinion: Auction format is underrated", author: "Aisha R.", authorAvatar: "AR", authorFlair: "Top Contributor",
    authorKarma: 2890, replies: 63, views: 2100, upvotes: 56, downvotes: 28, hot: false, category: "General Discussion", timeAgo: "8h ago",
    tags: ["auction", "debate", "marketplace"], hasImage: false, hasPoll: true, hasCode: false, hasAttachment: false,
    locked: false, sticky: false,
    content: "Everyone seems to default to fixed-price gigs, but I've had way better results using the auction format. It creates healthy competition and I often get MORE than my asking price. Am I the only one? Vote in the poll!",
    awards: [{ icon: "🔥", count: 2 }],
  },
  {
    id: "4", title: "Best practices for Skill Court judging", author: "James T.", authorAvatar: "JT", authorFlair: "Court Judge",
    authorKarma: 5120, replies: 28, views: 670, upvotes: 45, downvotes: 1, hot: false, category: "Skill Court", timeAgo: "12h ago",
    tags: ["court", "judging", "guide"], hasImage: false, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "After judging 50+ cases, I've compiled my top tips for new judges. Understanding evidence evaluation, avoiding bias, and writing clear verdicts are crucial. I've attached my personal judging checklist template.",
    awards: [{ icon: "⭐", count: 4 }, { icon: "📚", count: 2 }],
  },
  {
    id: "5", title: "Show & Tell: My best logo designs from swaps", author: "Lena S.", authorAvatar: "LS", authorFlair: "Diamond Creator",
    authorKarma: 6780, replies: 19, views: 1500, upvotes: 203, downvotes: 2, hot: true, category: "Design Corner", timeAgo: "1d ago",
    tags: ["showcase", "design", "logos"], hasImage: true, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "I've done 80+ logo design swaps on the platform and wanted to share my favorites! Each one taught me something new about working with clients. Gallery attached — let me know which one's your fav!",
    awards: [{ icon: "💎", count: 3 }, { icon: "🎨", count: 7 }, { icon: "⭐", count: 4 }],
  },
  {
    id: "6", title: "[Tutorial] Setting up API webhooks for gig notifications", author: "Dev_Riku", authorAvatar: "DR", authorFlair: "Beta Tester",
    authorKarma: 1890, replies: 14, views: 420, upvotes: 67, downvotes: 0, hot: false, category: "Dev Talk", timeAgo: "1d ago",
    tags: ["api", "webhook", "tutorial", "code"], hasImage: false, hasPoll: false, hasCode: true, hasAttachment: false,
    locked: false, sticky: false,
    content: "Quick tutorial on setting up webhook listeners for real-time gig notifications using the SkillSwappr API. Includes code examples for Node.js, Python, and Go.",
    awards: [{ icon: "📚", count: 3 }],
  },
  {
    id: "7", title: "POLL: What new gig format should we add next?", author: "Admin", authorAvatar: "AD", authorFlair: "Staff",
    authorKarma: 99999, replies: 187, views: 4300, upvotes: 312, downvotes: 8, hot: true, category: "Feature Requests", timeAgo: "2d ago",
    tags: ["poll", "feature", "vote"], hasImage: false, hasPoll: true, hasCode: false, hasAttachment: false,
    locked: false, sticky: true,
    content: "We're planning the next gig format and want YOUR input! Vote on your favorite option and tell us why in the comments.",
    awards: [{ icon: "📌", count: 1 }],
  },
];

const topContributors = [
  { name: "Maya K.", avatar: "MK", flair: "Guild Leader", posts: 342, karma: 4520, streak: 28, rank: 1, badge: "🏆" },
  { name: "James T.", avatar: "JT", flair: "Court Judge", posts: 289, karma: 5120, streak: 14, rank: 2, badge: "⚖️" },
  { name: "Aisha R.", avatar: "AR", flair: "Top Contributor", posts: 234, karma: 2890, streak: 21, rank: 3, badge: "⭐" },
  { name: "Lena S.", avatar: "LS", flair: "Diamond Creator", posts: 198, karma: 6780, streak: 35, rank: 4, badge: "💎" },
  { name: "Dev_Riku", avatar: "DR", flair: "Beta Tester", posts: 176, karma: 1890, streak: 7, rank: 5, badge: "🔧" },
];

const forumRules = [
  "Be respectful and constructive in all discussions",
  "No spam, self-promotion, or affiliate links without disclosure",
  "Use appropriate tags and categories for your posts",
  "Don't share private workspace conversations publicly",
  "Report violations — don't engage with trolls",
  "Credit original creators when sharing work",
];

const ForumsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("hot");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down">>({});
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [showRules, setShowRules] = useState(false);

  const handleVote = (threadId: string, direction: "up" | "down") => {
    setVotedThreads((prev) => {
      if (prev[threadId] === direction) {
        const next = { ...prev };
        delete next[threadId];
        return next;
      }
      return { ...prev, [threadId]: direction };
    });
  };

  const getVoteCount = (thread: Thread) => {
    const base = thread.upvotes - thread.downvotes;
    const vote = votedThreads[thread.id];
    if (!vote) return base;
    return vote === "up" ? base + 1 : base - 1;
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedThreads((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sortedThreads = [...allThreads]
    .filter((t) => !selectedCategory || t.category === selectedCategory)
    .filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some((tag) => tag.includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (a.sticky && !b.sticky) return -1;
      if (!a.sticky && b.sticky) return 1;
      if (sortBy === "hot") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.upvotes - a.upvotes;
      if (sortBy === "top") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      if (sortBy === "new") return 0;
      return b.views - a.views;
    });

  const openThread = allThreads.find((t) => t.id === selectedThread);

  // Thread Detail View
  if (openThread) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <CustomCursor />
          <CursorGlow />
          <Navbar />

          <section className="pt-28 pb-20">
            <div className="mx-auto max-w-4xl px-6">
              {/* Back */}
              <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => setSelectedThread(null)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={14} /> Back to Forums
              </motion.button>

              {/* Thread Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{openThread.category}</span>
                  {openThread.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-surface-1 px-2 py-0.5 text-[9px] text-muted-foreground">#{tag}</span>
                  ))}
                  {openThread.locked && <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5 text-[9px] text-alert-red"><Lock size={8} /> Locked</span>}
                  {openThread.sticky && <span className="flex items-center gap-1 rounded-full bg-badge-gold/10 px-2 py-0.5 text-[9px] text-badge-gold"><Pin size={8} /> Pinned</span>}
                </div>
                <h1 className="mb-4 font-heading text-2xl font-black text-foreground sm:text-3xl">{openThread.title}</h1>
              </motion.div>

              {/* Thread Content */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1 pt-4">
                  <button onClick={() => handleVote(openThread.id, "up")} className={`rounded-lg p-1.5 transition-colors ${votedThreads[openThread.id] === "up" ? "bg-skill-green/10 text-skill-green" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}>
                    <ChevronUp size={20} />
                  </button>
                  <span className={`font-mono text-sm font-bold ${votedThreads[openThread.id] === "up" ? "text-skill-green" : votedThreads[openThread.id] === "down" ? "text-alert-red" : "text-foreground"}`}>
                    {getVoteCount(openThread)}
                  </span>
                  <button onClick={() => handleVote(openThread.id, "down")} className={`rounded-lg p-1.5 transition-colors ${votedThreads[openThread.id] === "down" ? "bg-alert-red/10 text-alert-red" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-border bg-card p-6">
                  {/* Author Info */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground">{openThread.authorAvatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{openThread.author}</span>
                          <span className="rounded-full bg-court-blue/10 px-2 py-0.5 text-[8px] font-semibold text-court-blue">{openThread.authorFlair}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{openThread.timeAgo}</span>
                          <span>·</span>
                          <span>{openThread.authorKarma.toLocaleString()} karma</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{openThread.content}</p>

                  {/* Attachments */}
                  {openThread.hasAttachment && (
                    <div className="mb-4 rounded-xl border border-dashed border-border bg-surface-1 p-3 flex items-center gap-3">
                      <Paperclip size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">growth-metrics.xlsx</span>
                      <span className="text-[9px] text-muted-foreground/60">24 KB</span>
                      <button className="ml-auto text-[10px] text-court-blue hover:underline">Download</button>
                    </div>
                  )}

                  {/* Image Preview */}
                  {openThread.hasImage && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-border">
                      <div className="aspect-video bg-surface-2 flex items-center justify-center text-muted-foreground">
                        <ImageIcon size={32} />
                      </div>
                    </div>
                  )}

                  {/* Poll */}
                  {openThread.hasPoll && (
                    <div className="mb-4 rounded-xl border border-border bg-surface-1 p-4">
                      <h4 className="mb-3 text-xs font-bold text-foreground flex items-center gap-2"><BarChart3 size={14} /> Community Poll</h4>
                      {["Auction Format", "Co-Creation", "Mentorship Sessions", "Group Gigs"].map((opt, i) => {
                        const pct = [42, 28, 18, 12][i];
                        return (
                          <div key={opt} className="mb-2">
                            <div className="mb-1 flex items-center justify-between text-[10px]">
                              <span className="text-foreground">{opt}</span>
                              <span className="text-muted-foreground">{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface-2">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} className="h-full rounded-full bg-court-blue" />
                            </div>
                          </div>
                        );
                      })}
                      <p className="mt-2 text-[9px] text-muted-foreground">487 votes · 2 days left</p>
                    </div>
                  )}

                  {/* Code Block */}
                  {openThread.hasCode && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-border bg-surface-1">
                      <div className="flex items-center justify-between border-b border-border/50 bg-surface-2 px-4 py-2">
                        <span className="font-mono text-[10px] text-muted-foreground">javascript</span>
                        <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"><Copy size={10} /> Copy</button>
                      </div>
                      <pre className="p-4 font-mono text-xs text-foreground overflow-x-auto">{`const webhook = new WebhookListener({
  url: '/api/webhooks/gig-updates',
  events: ['gig.created', 'gig.completed'],
  secret: process.env.WEBHOOK_SECRET
});`}</pre>
                    </div>
                  )}

                  {/* Awards */}
                  {openThread.awards.length > 0 && (
                    <div className="mb-4 flex items-center gap-2">
                      {openThread.awards.map((a, i) => (
                        <span key={i} className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[10px]">
                          {a.icon} <span className="text-muted-foreground">×{a.count}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
                    <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                      <MessageSquare size={12} /> {openThread.replies} Comments
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                      <Gift size={12} /> Give Award
                    </button>
                    <button onClick={() => toggleBookmark(openThread.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors ${bookmarkedThreads.has(openThread.id) ? "bg-badge-gold/10 text-badge-gold" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                      <Bookmark size={12} fill={bookmarkedThreads.has(openThread.id) ? "currentColor" : "none"} /> Save
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                      <Share2 size={12} /> Share
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                      <AlertCircle size={12} /> Report
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Reply Composer */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-2xl border border-border bg-card p-5">
                <p className="mb-3 text-xs font-semibold text-foreground">Add a Reply</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="mb-3 h-24 w-full resize-none rounded-xl border border-border bg-surface-1 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Image"><ImageIcon size={14} /></button>
                    <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Code"><Code size={14} /></button>
                    <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Link"><Link2 size={14} /></button>
                    <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Attach File"><Paperclip size={14} /></button>
                    <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Mention"><AtSign size={14} /></button>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">
                    Reply <Send size={12} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Sample Replies */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-foreground">Comments ({openThread.replies})</h3>
                {[
                  { author: "Nina O.", avatar: "NO", flair: "Design Lead", time: "1h ago", text: "Great post! I found that consistency is key — doing at least 1 gig per day helps build momentum. Also, the referral bonus is a huge accelerator.", upvotes: 23, downvotes: 1, replies: 4, awards: [{ icon: "⭐", count: 1 }] },
                  { author: "Dev_Riku", avatar: "DR", flair: "Beta Tester", time: "3h ago", text: "This is solid advice. One thing I'd add: Court judging duty gives you consistent SP and reputation. It's overlooked but super valuable.", upvotes: 15, downvotes: 0, replies: 2, awards: [] },
                  { author: "Sarah P.", avatar: "SP", flair: "Staff", time: "5h ago", text: "Love seeing this kind of community knowledge sharing! We're actually working on making tier progression more transparent in the next update.", upvotes: 45, downvotes: 0, replies: 8, awards: [{ icon: "📌", count: 1 }, { icon: "⭐", count: 2 }] },
                ].map((reply, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="flex gap-3">
                    {/* Vote */}
                    <div className="flex flex-col items-center gap-0.5 pt-3">
                      <button className="text-muted-foreground hover:text-skill-green"><ChevronUp size={14} /></button>
                      <span className="font-mono text-[10px] font-bold text-foreground">{reply.upvotes - reply.downvotes}</span>
                      <button className="text-muted-foreground hover:text-alert-red"><ChevronDown size={14} /></button>
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 font-mono text-[8px] font-bold text-foreground">{reply.avatar}</div>
                        <span className="text-xs font-semibold text-foreground">{reply.author}</span>
                        <span className="rounded-full bg-court-blue/10 px-1.5 py-0.5 text-[7px] font-semibold text-court-blue">{reply.flair}</span>
                        <span className="text-[10px] text-muted-foreground">· {reply.time}</span>
                        {reply.awards.map((a, j) => (
                          <span key={j} className="text-[10px]">{a.icon}</span>
                        ))}
                      </div>
                      <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{reply.text}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <button className="hover:text-foreground">Reply</button>
                        <button className="hover:text-foreground flex items-center gap-1"><Gift size={9} /> Award</button>
                        <button className="hover:text-foreground">Share</button>
                        <button className="hover:text-foreground">Report</button>
                        <span className="ml-auto flex items-center gap-1"><MessageSquare size={9} /> {reply.replies}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <CTAFooterSection />
        </div>
      </PageTransition>
    );
  }

  // Forum Listing View
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
                  <Users size={12} /> {forumCategories.reduce((sum, c) => sum + c.online, 0)} online now
                </div>
                <h1 className="mb-2 font-heading text-5xl font-black text-foreground sm:text-6xl">Forums</h1>
                <p className="text-lg text-muted-foreground">Connect, discuss, and learn with the community.</p>
              </div>
              <motion.button onClick={() => setShowComposer(true)} className="flex items-center gap-2 self-start rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                New Thread <MessageSquare size={16} />
              </motion.button>
            </motion.div>

            {/* Forum Stats Bar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Threads", value: "6.9K" },
                { label: "Total Posts", value: "52K" },
                { label: "Members", value: "10.2K" },
                { label: "Online Now", value: forumCategories.reduce((sum, c) => sum + c.online, 0).toString() },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="font-mono text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Search + Sort */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search threads, tags, users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
              </div>
              <div className="flex items-center gap-2">
                {(["hot", "new", "top", "rising"] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-medium capitalize transition-colors ${sortBy === s ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                    {s === "hot" && <Flame size={11} />}
                    {s === "new" && <Sparkles size={11} />}
                    {s === "top" && <TrendingUp size={11} />}
                    {s === "rising" && <ArrowUpRight size={11} />}
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Category Filter Pills */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="mb-6 flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory(null)} className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${!selectedCategory ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                All
              </button>
              {forumCategories.map((cat) => (
                <button key={cat.name} onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)} className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${selectedCategory === cat.name ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {cat.name}
                </button>
              ))}
            </motion.div>

            {/* New Thread Composer */}
            <AnimatePresence>
              {showComposer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-heading text-sm font-bold text-foreground">Create New Thread</h3>
                      <button onClick={() => setShowComposer(false)} className="text-muted-foreground hover:text-foreground text-xs">Cancel</button>
                    </div>
                    <select value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)} className="mb-3 h-10 w-full rounded-xl border border-border bg-surface-1 px-4 text-xs text-muted-foreground focus:border-ring focus:outline-none">
                      <option value="">Select Category</option>
                      {forumCategories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} placeholder="Thread title..." className="mb-3 h-10 w-full rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="What's on your mind?" className="mb-3 h-32 w-full resize-none rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Image"><ImageIcon size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Code"><Code size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Link"><Link2 size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Attach"><Paperclip size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground" title="Poll"><BarChart3 size={14} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Add tags (comma separated)" className="h-8 w-40 rounded-lg border border-border bg-surface-1 px-3 text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">
                          Post <Send size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pinned Announcements */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <Bell size={14} className="text-badge-gold" />
                <h2 className="font-heading text-xs font-bold text-foreground">Announcements</h2>
              </div>
              <div className="space-y-2">
                {announcements.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-badge-gold/10 bg-badge-gold/5 p-3 cursor-pointer hover:border-badge-gold/20 transition-colors">
                    <Pin size={12} className="text-badge-gold flex-shrink-0" />
                    <span className="flex-1 text-xs text-foreground">{a.title}</span>
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground"><MessageSquare size={10} /> {a.comments}</span>
                    <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              {/* Thread List */}
              <div>
                <div className="space-y-2">
                  {sortedThreads.map((thread, i) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.03 }}
                      onClick={() => setSelectedThread(thread.id)}
                      className="group flex gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 cursor-pointer"
                    >
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleVote(thread.id, "up")} className={`rounded p-0.5 transition-colors ${votedThreads[thread.id] === "up" ? "text-skill-green" : "text-muted-foreground hover:text-foreground"}`}>
                          <ChevronUp size={16} />
                        </button>
                        <span className={`font-mono text-[10px] font-bold ${votedThreads[thread.id] === "up" ? "text-skill-green" : votedThreads[thread.id] === "down" ? "text-alert-red" : "text-foreground"}`}>
                          {getVoteCount(thread)}
                        </span>
                        <button onClick={() => handleVote(thread.id, "down")} className={`rounded p-0.5 transition-colors ${votedThreads[thread.id] === "down" ? "text-alert-red" : "text-muted-foreground hover:text-foreground"}`}>
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          {thread.sticky && <Pin size={10} className="text-badge-gold" />}
                          {thread.hot && <Flame size={10} className="text-alert-red" />}
                          <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[8px] text-muted-foreground">{thread.category}</span>
                          {thread.locked && <Lock size={8} className="text-muted-foreground" />}
                        </div>
                        <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-foreground/90">{thread.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="h-4 w-4 rounded-full bg-surface-2 flex items-center justify-center font-mono text-[6px] font-bold">{thread.authorAvatar}</div>
                            {thread.author}
                          </span>
                          <span className="rounded-full bg-court-blue/10 px-1.5 py-0.5 text-[7px] text-court-blue">{thread.authorFlair}</span>
                          <span>{thread.timeAgo}</span>
                          {thread.awards.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              {thread.awards.slice(0, 3).map((a, j) => <span key={j}>{a.icon}</span>)}
                            </span>
                          )}
                        </div>
                        {/* Content indicators */}
                        <div className="mt-1.5 flex items-center gap-2">
                          {thread.tags.map((tag) => (
                            <span key={tag} className="rounded bg-surface-1 px-1.5 py-0.5 text-[8px] text-muted-foreground/70">#{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex flex-col items-end gap-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><MessageSquare size={10} /> {thread.replies}</span>
                        <span className="flex items-center gap-1"><Eye size={10} /> {thread.views.toLocaleString()}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {thread.hasImage && <ImageIcon size={10} className="text-court-blue" />}
                          {thread.hasPoll && <BarChart3 size={10} className="text-badge-gold" />}
                          {thread.hasCode && <Code size={10} className="text-skill-green" />}
                          {thread.hasAttachment && <Paperclip size={10} className="text-muted-foreground" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <button className="rounded-xl border border-border bg-card px-8 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                    Load More Threads
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Top Contributors */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <Crown size={14} className="text-badge-gold" /> Top Contributors
                  </h3>
                  <div className="space-y-3">
                    {topContributors.map((c) => (
                      <div key={c.name} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center font-mono text-[10px] font-bold text-muted-foreground">#{c.rank}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">{c.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-[10px] font-semibold text-foreground truncate">{c.name}</p>
                            <span className="text-[10px]">{c.badge}</span>
                          </div>
                          <p className="text-[8px] text-muted-foreground">{c.karma.toLocaleString()} karma · {c.streak}d streak</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Sidebar */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 font-heading text-xs font-bold text-foreground">Categories</h3>
                  <div className="space-y-2">
                    {forumCategories.map((cat) => (
                      <button key={cat.name} onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${selectedCategory === cat.name ? "bg-surface-2" : "hover:bg-surface-1"}`}>
                        <cat.icon size={12} className="text-muted-foreground shrink-0" />
                        <span className="flex-1 text-[10px] text-foreground truncate">{cat.name}</span>
                        <span className="font-mono text-[8px] text-muted-foreground">{cat.threads}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Forum Rules */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <button onClick={() => setShowRules(!showRules)} className="flex w-full items-center justify-between">
                    <h3 className="font-heading text-xs font-bold text-foreground flex items-center gap-2">
                      <Shield size={12} className="text-court-blue" /> Community Rules
                    </h3>
                    <ChevronDown size={12} className={`text-muted-foreground transition-transform ${showRules ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showRules && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-3 space-y-2">
                          {forumRules.map((rule, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[8px] text-muted-foreground">{i + 1}</span>
                              <span className="text-[10px] text-muted-foreground">{rule}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trending Tags */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-3 font-heading text-xs font-bold text-foreground">Trending Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["guild-wars", "tier-up", "auction", "co-creation", "court-tips", "sp-earning", "design", "api", "webhooks", "mentorship", "portfolio", "review"].map((tag) => (
                      <span key={tag} className="rounded-md border border-border bg-surface-1 px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/20 cursor-pointer transition-colors">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default ForumsPage;
