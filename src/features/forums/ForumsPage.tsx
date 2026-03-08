import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Users, Flame, Pin, ArrowRight, ArrowLeft, ThumbsUp,
  Eye, Clock, Hash, Zap, Palette, Code, Trophy, Shield, Search, Star, Bell,
  ChevronDown, ChevronUp, Send, MoreHorizontal, Award, Bookmark, Share2,
  Filter, Image as ImageIcon, FileText, Link2, Paperclip, ArrowUpRight,
  TrendingUp, Lock, Globe, CheckCircle2, AlertCircle, Heart, AtSign,
  BarChart3, Layers, ChevronRight, Bot, Gift, Crown, Sparkles, Copy, Play,
  Calendar, Target, Swords, GraduationCap, BookOpen, Lightbulb, Megaphone,
  ThumbsDown, Mic, Video, PenTool, ArrowUp, ExternalLink, Medal, Wifi
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";


type SortType = "hot" | "new" | "top" | "rising";

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
  { icon: Lightbulb, name: "Freelancer Hub", desc: "Client management, invoicing, and freelance strategies", threads: 470, posts: 3100, color: "badge-gold", online: 31 },
  { icon: Video, name: "Streams & Content", desc: "Live streams, video tutorials, and content creation", threads: 280, posts: 1540, color: "court-blue", online: 18 },
  { icon: GraduationCap, name: "University Corner", desc: "Student collabs, campus events, and academic projects", threads: 390, posts: 2200, color: "skill-green", online: 22 },
  { icon: Bot, name: "AI & Automation", desc: "AI tools, prompt engineering, and workflow automation", threads: 520, posts: 3600, color: "foreground", online: 48 },
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
  authorJoined: string;
  authorGigs: number;
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
    authorKarma: 4520, authorJoined: "Jan 2025", authorGigs: 87, replies: 47, views: 1200, upvotes: 89, downvotes: 3, hot: true, category: "Tips & Tricks", timeAgo: "2h ago",
    tags: ["tier", "progression", "guide"], hasImage: false, hasPoll: false, hasCode: false, hasAttachment: false,
    locked: false, sticky: false,
    content: "I've been on the platform for about 3 months and I'm currently Silver tier. For those who've already hit Gold — what strategies worked best?\n\nI'm averaging about 4 gigs/week and have a 4.8 rating but progress feels slow. Any tips on accelerating through the ranking system?\n\nHere's what I've tried so far:\n- Completing daily challenges consistently\n- Maintaining my streak (28 days and counting)\n- Taking on diverse skill categories\n- Participating in Guild Wars\n\nWould love to hear what worked for you!",
    awards: [{ icon: "⭐", count: 2 }, { icon: "🔥", count: 1 }],
  },
  {
    id: "2", title: "My guild just hit 50 members — here's what I learned", author: "Carlos M.", authorAvatar: "CM", authorFlair: "Veteran Swapper",
    authorKarma: 3210, authorJoined: "Mar 2025", authorGigs: 64, replies: 32, views: 890, upvotes: 124, downvotes: 5, hot: true, category: "Guild Recruitment", timeAgo: "4h ago",
    tags: ["guild", "leadership", "growth"], hasImage: true, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "After 6 months of building PixelForge guild, we just crossed 50 active members! It wasn't easy.\n\nHere's a breakdown of what worked, what didn't, and the key metrics I tracked along the way.\n\n**What Worked:**\n- Weekly guild challenges with SP prizes\n- Dedicated mentorship pairing for new members\n- A strict but fair code of conduct\n- Regular Guild War participation (12 wins!)\n\n**What Didn't:**\n- Mass recruiting without vetting\n- Having too many channels/categories\n- Not having clear leadership roles early\n\nI've attached our growth spreadsheet for anyone interested.",
    awards: [{ icon: "🏆", count: 3 }, { icon: "⭐", count: 5 }, { icon: "💎", count: 1 }],
  },
  {
    id: "3", title: "Unpopular opinion: Auction format is underrated", author: "Aisha R.", authorAvatar: "AR", authorFlair: "Top Contributor",
    authorKarma: 2890, authorJoined: "Jun 2025", authorGigs: 42, replies: 63, views: 2100, upvotes: 56, downvotes: 28, hot: false, category: "General Discussion", timeAgo: "8h ago",
    tags: ["auction", "debate", "marketplace"], hasImage: false, hasPoll: true, hasCode: false, hasAttachment: false,
    locked: false, sticky: false,
    content: "Everyone seems to default to fixed-price gigs, but I've had way better results using the auction format. It creates healthy competition and I often get MORE than my asking price.\n\nThe key advantages:\n1. Market-driven pricing — you discover the true value of your skill\n2. Urgency — deadlines create faster matches\n3. Discovery — your gig gets more visibility during the auction window\n\nAm I the only one? Vote in the poll!",
    awards: [{ icon: "🔥", count: 2 }],
  },
  {
    id: "4", title: "Best practices for Skill Court judging", author: "James T.", authorAvatar: "JT", authorFlair: "Court Judge",
    authorKarma: 5120, authorJoined: "Nov 2024", authorGigs: 145, replies: 28, views: 670, upvotes: 45, downvotes: 1, hot: false, category: "Skill Court", timeAgo: "12h ago",
    tags: ["court", "judging", "guide"], hasImage: false, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "After judging 50+ cases, I've compiled my top tips for new judges. Understanding evidence evaluation, avoiding bias, and writing clear verdicts are crucial.\n\n**The 5 Golden Rules:**\n1. Always read BOTH sides completely before forming an opinion\n2. Look at the original agreement/scope document\n3. Check delivery timestamps against deadlines\n4. Rate quality objectively using the rubric\n5. Write your verdict as if explaining to a neutral third party\n\nI've attached my personal judging checklist template.",
    awards: [{ icon: "⭐", count: 4 }, { icon: "📚", count: 2 }],
  },
  {
    id: "5", title: "Show & Tell: My best logo designs from swaps", author: "Lena S.", authorAvatar: "LS", authorFlair: "Diamond Creator",
    authorKarma: 6780, authorJoined: "Sep 2024", authorGigs: 203, replies: 19, views: 1500, upvotes: 203, downvotes: 2, hot: true, category: "Design Corner", timeAgo: "1d ago",
    tags: ["showcase", "design", "logos"], hasImage: true, hasPoll: false, hasCode: false, hasAttachment: true,
    locked: false, sticky: false,
    content: "I've done 80+ logo design swaps on the platform and wanted to share my favorites! Each one taught me something new about working with clients.\n\nGallery attached — let me know which one's your fav!\n\nMy process:\n- Initial concept sketches (usually 3-5 options)\n- Feedback round in workspace chat\n- 2 revision cycles max\n- Final delivery in multiple formats",
    awards: [{ icon: "💎", count: 3 }, { icon: "🎨", count: 7 }, { icon: "⭐", count: 4 }],
  },
  {
    id: "6", title: "[Tutorial] Setting up API webhooks for gig notifications", author: "Dev_Riku", authorAvatar: "DR", authorFlair: "Beta Tester",
    authorKarma: 1890, authorJoined: "Dec 2025", authorGigs: 34, replies: 14, views: 420, upvotes: 67, downvotes: 0, hot: false, category: "Dev Talk", timeAgo: "1d ago",
    tags: ["api", "webhook", "tutorial", "code"], hasImage: false, hasPoll: false, hasCode: true, hasAttachment: false,
    locked: false, sticky: false,
    content: "Quick tutorial on setting up webhook listeners for real-time gig notifications using the SkillSwappr API.\n\nIncludes code examples for Node.js, Python, and Go.\n\nThe webhook payload includes:\n- Gig ID and status\n- Participant info\n- Skill points transferred\n- Timestamp and metadata",
    awards: [{ icon: "📚", count: 3 }],
  },
  {
    id: "7", title: "POLL: What new gig format should we add next?", author: "Admin", authorAvatar: "AD", authorFlair: "Staff",
    authorKarma: 99999, authorJoined: "Aug 2024", authorGigs: 0, replies: 187, views: 4300, upvotes: 312, downvotes: 8, hot: true, category: "Feature Requests", timeAgo: "2d ago",
    tags: ["poll", "feature", "vote"], hasImage: false, hasPoll: true, hasCode: false, hasAttachment: false,
    locked: false, sticky: true,
    content: "We're planning the next gig format and want YOUR input! Vote on your favorite option and tell us why in the comments.\n\nEach option has been discussed internally but we want the community to have the final say.",
    awards: [{ icon: "📌", count: 1 }],
  },
];

const threadReplies: Record<string, { author: string; avatar: string; flair: string; time: string; text: string; upvotes: number; downvotes: number; replies: number; awards: { icon: string; count: number }[]; nested?: { author: string; avatar: string; flair: string; time: string; text: string; upvotes: number }[] }[]> = {
  "1": [
    { author: "Nina O.", avatar: "NO", flair: "Design Lead", time: "1h ago", text: "Great post! I found that consistency is key — doing at least 1 gig per day helps build momentum. Also, the referral bonus is a huge accelerator.\n\nI went from Silver to Gold in about 6 weeks using this strategy.", upvotes: 23, downvotes: 1, replies: 4, awards: [{ icon: "⭐", count: 1 }],
      nested: [
        { author: "Maya K.", avatar: "MK", flair: "Guild Leader", time: "45m ago", text: "Thanks! 1 gig per day is a great target. Did you focus on a single skill or diversify?", upvotes: 8 },
        { author: "Nina O.", avatar: "NO", flair: "Design Lead", time: "30m ago", text: "I stuck to UI/UX mostly but took some illustration gigs to break the monotony. The key is keeping your rating high.", upvotes: 12 },
      ]
    },
    { author: "Dev_Riku", avatar: "DR", flair: "Beta Tester", time: "3h ago", text: "This is solid advice. One thing I'd add: Court judging duty gives you consistent SP and reputation. It's overlooked but super valuable.\n\nYou also get a special badge after 10 cases which boosts your profile visibility.", upvotes: 15, downvotes: 0, replies: 2, awards: [],
      nested: [
        { author: "James T.", avatar: "JT", flair: "Court Judge", time: "2h ago", text: "Can confirm — judging is one of the best ways to earn SP passively while helping the community.", upvotes: 19 },
      ]
    },
    { author: "Sarah P.", avatar: "SP", flair: "Staff", time: "5h ago", text: "Love seeing this kind of community knowledge sharing! We're actually working on making tier progression more transparent in the next update. Stay tuned! 👀", upvotes: 45, downvotes: 0, replies: 8, awards: [{ icon: "📌", count: 1 }, { icon: "⭐", count: 2 }] },
    { author: "Carlos M.", avatar: "CM", flair: "Veteran Swapper", time: "6h ago", text: "One underrated tip: participate in Guild Wars even if your guild is small. The SP rewards per gig are higher during war weeks, and you get the War Participant badge.", upvotes: 31, downvotes: 2, replies: 5, awards: [{ icon: "🔥", count: 1 }] },
  ],
  "2": [
    { author: "Lena S.", avatar: "LS", flair: "Diamond Creator", time: "2h ago", text: "Congrats! PixelForge has been an inspiration. I've been thinking about starting a design-focused guild — any tips on the vetting process?", upvotes: 18, downvotes: 0, replies: 3, awards: [] },
    { author: "Admin", avatar: "AD", flair: "Staff", time: "3h ago", text: "This is exactly the kind of guild leadership content we love to see. We're featuring this post in next week's community digest! 🎉", upvotes: 67, downvotes: 0, replies: 1, awards: [{ icon: "📌", count: 1 }] },
  ],
};

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

const weeklyHighlights = [
  { title: "Best Guide", thread: "What's the fastest way to reach Gold tier?", author: "Maya K.", award: "📚" },
  { title: "Most Upvoted", thread: "Show & Tell: My best logo designs", author: "Lena S.", award: "🔥" },
  { title: "Best Discussion", thread: "Unpopular opinion: Auction format", author: "Aisha R.", award: "💬" },
];

const upcomingEvents = [
  { title: "AMA: Platform Roadmap Q2", date: "Mar 12", icon: Mic, color: "text-court-blue" },
  { title: "Design Challenge: Logo Sprint", date: "Mar 15", icon: PenTool, color: "text-badge-gold" },
  { title: "Guild Wars Season 4 Kickoff", date: "Mar 18", icon: Swords, color: "text-alert-red" },
  { title: "Dev Workshop: API v2", date: "Mar 22", icon: Code, color: "text-skill-green" },
];

const popularGuides = [
  { title: "Complete Beginner's Guide to SkillSwappr", views: 12400, author: "Admin", icon: BookOpen },
  { title: "How to Price Your Skills Effectively", views: 8900, author: "Maya K.", icon: Target },
  { title: "Guild Leadership Handbook", views: 6200, author: "Carlos M.", icon: Users },
  { title: "Skill Court: Judge Training Guide", views: 5100, author: "James T.", icon: Shield },
  { title: "Maximizing Your ELO Rating", views: 4800, author: "Nina O.", icon: TrendingUp },
];

const recentActivity = [
  { user: "Alex F.", action: "replied to", target: "Best practices for Skill Court judging", time: "2m ago" },
  { user: "Zara N.", action: "created", target: "My first 100 gigs — reflection", time: "8m ago" },
  { user: "Tom W.", action: "upvoted", target: "Show & Tell: My best logo designs", time: "12m ago" },
  { user: "Kate M.", action: "joined guild", target: "Code Collective", time: "18m ago" },
  { user: "Rio D.", action: "earned badge", target: "🔥 7-Day Streak", time: "25m ago" },
  { user: "Dev_Riku", action: "replied to", target: "API webhooks tutorial", time: "30m ago" },
];

const ForumsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("hot");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [votedThreads, setVotedThreads] = useState<Record<string, "up" | "down">>({});
  const [votedReplies, setVotedReplies] = useState<Record<string, "up" | "down">>({});
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Set<number>>(new Set());

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
  const replies = selectedThread ? (threadReplies[selectedThread] || []) : [];

  // ============ THREAD DETAIL VIEW ============
  if (openThread) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <CustomCursor />
          <CursorGlow />
          <Navbar />

          <section className="pt-28 pb-20">
            <div className="mx-auto max-w-7xl px-6">
              {/* Breadcrumb */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
                <button onClick={() => setSelectedThread(null)} className="hover:text-foreground transition-colors">Forums</button>
                <ChevronRight size={10} />
                <button onClick={() => { setSelectedThread(null); setSelectedCategory(openThread.category); }} className="hover:text-foreground transition-colors">{openThread.category}</button>
                <ChevronRight size={10} />
                <span className="text-foreground truncate max-w-xs">{openThread.title}</span>
              </motion.div>

              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main Thread */}
                <div>
                  {/* Thread Post */}
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex gap-3">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-1 pt-5">
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

                    {/* Content Card */}
                    <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden">
                      {/* Category Bar */}
                      <div className="flex items-center gap-2 border-b border-border bg-surface-1 px-5 py-2.5">
                        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">{openThread.category}</span>
                        {openThread.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">#{tag}</span>
                        ))}
                        {openThread.locked && <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5 text-[9px] text-alert-red"><Lock size={8} /> Locked</span>}
                        {openThread.sticky && <span className="flex items-center gap-1 rounded-full bg-badge-gold/10 px-2 py-0.5 text-[9px] text-badge-gold"><Pin size={8} /> Pinned</span>}
                        <span className="ml-auto flex items-center gap-1 text-[9px] text-muted-foreground"><Eye size={10} /> {openThread.views.toLocaleString()} views</span>
                      </div>

                      <div className="p-6">
                        {/* Author */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground ring-2 ring-border">{openThread.authorAvatar}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{openThread.author}</span>
                                <span className="rounded-full bg-court-blue/10 px-2 py-0.5 text-[8px] font-semibold text-court-blue">{openThread.authorFlair}</span>
                                {openThread.author === "Admin" && <CheckCircle2 size={12} className="text-skill-green" />}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{openThread.timeAgo}</span>
                                <span>·</span>
                                <span>{openThread.authorKarma.toLocaleString()} karma</span>
                                <span>·</span>
                                <span>{openThread.authorGigs} gigs</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleBookmark(openThread.id)} className={`rounded-lg p-2 transition-colors ${bookmarkedThreads.has(openThread.id) ? "text-badge-gold" : "text-muted-foreground hover:text-foreground"}`}>
                              <Bookmark size={16} fill={bookmarkedThreads.has(openThread.id) ? "currentColor" : "none"} />
                            </button>
                            <button className="rounded-lg p-2 text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
                          </div>
                        </div>

                        {/* Title */}
                        <h1 className="mb-4 font-heading text-xl font-black text-foreground sm:text-2xl">{openThread.title}</h1>

                        {/* Body */}
                        <div className="mb-5 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{openThread.content}</div>

                        {/* Attachments */}
                        {openThread.hasAttachment && (
                          <div className="mb-4 rounded-xl border border-dashed border-border bg-surface-1 p-3 flex items-center gap-3">
                            <Paperclip size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">growth-metrics.xlsx</span>
                            <span className="text-[9px] text-muted-foreground/60">24 KB</span>
                            <button className="ml-auto text-[10px] text-court-blue hover:underline">Download</button>
                          </div>
                        )}

                        {openThread.hasImage && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-border">
                            <div className="aspect-video bg-surface-2 flex items-center justify-center text-muted-foreground">
                              <ImageIcon size={32} />
                            </div>
                          </div>
                        )}

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
                            <Gift size={12} /> Award
                          </button>
                          <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                            <Share2 size={12} /> Share
                          </button>
                          <button className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                            <AlertCircle size={12} /> Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Reply Composer */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 rounded-2xl border border-border bg-card p-5">
                    <p className="mb-3 text-xs font-semibold text-foreground">Add a Reply</p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="What are your thoughts?"
                      className="mb-3 h-24 w-full resize-none rounded-xl border border-border bg-surface-1 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><ImageIcon size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Code size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Link2 size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Paperclip size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><AtSign size={14} /></button>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">
                        Reply <Send size={12} />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Sort Comments */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">Comments ({openThread.replies})</h3>
                    <div className="flex items-center gap-1">
                      {["Best", "New", "Top"].map((s) => (
                        <button key={s} className="rounded-lg px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-surface-2 hover:text-foreground">{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* Threaded Replies */}
                  <div className="space-y-3">
                    {replies.map((reply, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                        <div className="flex gap-3">
                          {/* Vote */}
                          <div className="flex flex-col items-center gap-0.5 pt-3">
                            <button className="text-muted-foreground hover:text-skill-green"><ChevronUp size={14} /></button>
                            <span className="font-mono text-[10px] font-bold text-foreground">{reply.upvotes - reply.downvotes}</span>
                            <button className="text-muted-foreground hover:text-alert-red"><ChevronDown size={14} /></button>
                          </div>

                          <div className="flex-1">
                            <div className="rounded-xl border border-border bg-card p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-mono text-[9px] font-bold text-foreground">{reply.avatar}</div>
                                <span className="text-xs font-semibold text-foreground">{reply.author}</span>
                                <span className="rounded-full bg-court-blue/10 px-1.5 py-0.5 text-[7px] font-semibold text-court-blue">{reply.flair}</span>
                                <span className="text-[10px] text-muted-foreground">· {reply.time}</span>
                                {reply.awards.map((a, j) => (
                                  <span key={j} className="flex items-center gap-0.5 text-[10px]">{a.icon} <span className="text-muted-foreground">×{a.count}</span></span>
                                ))}
                              </div>
                              <p className="mb-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">{reply.text}</p>
                              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <button onClick={() => setReplyingTo(replyingTo === `${i}` ? null : `${i}`)} className="hover:text-foreground font-medium">Reply</button>
                                <button className="hover:text-foreground flex items-center gap-1"><Gift size={9} /> Award</button>
                                <button className="hover:text-foreground">Share</button>
                                <button className="hover:text-foreground">Report</button>
                                {reply.replies > 0 && <span className="ml-auto flex items-center gap-1"><MessageSquare size={9} /> {reply.replies}</span>}
                              </div>
                            </div>

                            {/* Inline reply composer */}
                            <AnimatePresence>
                              {replyingTo === `${i}` && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="ml-4 mt-2 flex gap-2 items-start border-l-2 border-border pl-4">
                                    <textarea placeholder={`Reply to ${reply.author}...`} className="h-16 flex-1 resize-none rounded-lg border border-border bg-surface-1 p-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring" />
                                    <button className="rounded-lg bg-foreground p-2 text-background"><Send size={12} /></button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Nested Replies (Reddit-style) */}
                            {reply.nested && reply.nested.length > 0 && !collapsedReplies.has(i) && (
                              <div className="ml-4 mt-2 space-y-2 border-l-2 border-border/50 pl-4">
                                {reply.nested.map((nested, ni) => (
                                  <div key={ni} className="flex gap-2">
                                    <div className="flex flex-col items-center gap-0.5 pt-2">
                                      <button className="text-muted-foreground hover:text-skill-green"><ChevronUp size={12} /></button>
                                      <span className="font-mono text-[9px] font-bold text-foreground">{nested.upvotes}</span>
                                      <button className="text-muted-foreground hover:text-alert-red"><ChevronDown size={12} /></button>
                                    </div>
                                    <div className="flex-1 rounded-lg border border-border/50 bg-surface-1 p-3">
                                      <div className="mb-1.5 flex items-center gap-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-[7px] font-bold text-muted-foreground">{nested.avatar}</div>
                                        <span className="text-[10px] font-semibold text-foreground">{nested.author}</span>
                                        <span className="rounded-full bg-court-blue/10 px-1 py-0.5 text-[6px] font-semibold text-court-blue">{nested.flair}</span>
                                        <span className="text-[9px] text-muted-foreground">· {nested.time}</span>
                                      </div>
                                      <p className="text-[11px] leading-relaxed text-muted-foreground">{nested.text}</p>
                                      <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground">
                                        <button className="hover:text-foreground">Reply</button>
                                        <button className="hover:text-foreground">Award</button>
                                        <button className="hover:text-foreground">Share</button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {reply.nested && reply.nested.length > 0 && (
                              <button onClick={() => setCollapsedReplies(prev => {
                                const next = new Set(prev);
                                next.has(i) ? next.delete(i) : next.add(i);
                                return next;
                              })} className="ml-4 mt-1 text-[9px] text-court-blue hover:underline">
                                {collapsedReplies.has(i) ? `Show ${reply.nested.length} replies` : `Hide replies`}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Thread Sidebar */}
                <div className="space-y-4">
                  {/* Author Card */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground ring-2 ring-border">{openThread.authorAvatar}</div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{openThread.author}</p>
                        <span className="rounded-full bg-court-blue/10 px-2 py-0.5 text-[8px] font-semibold text-court-blue">{openThread.authorFlair}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center rounded-lg bg-surface-1 p-2">
                        <p className="font-mono text-sm font-bold text-foreground">{openThread.authorKarma.toLocaleString()}</p>
                        <p className="text-[8px] text-muted-foreground">Karma</p>
                      </div>
                      <div className="text-center rounded-lg bg-surface-1 p-2">
                        <p className="font-mono text-sm font-bold text-foreground">{openThread.authorGigs}</p>
                        <p className="text-[8px] text-muted-foreground">Gigs</p>
                      </div>
                      <div className="text-center rounded-lg bg-surface-1 p-2">
                        <p className="font-mono text-sm font-bold text-muted-foreground">{openThread.authorJoined}</p>
                        <p className="text-[8px] text-muted-foreground">Joined</p>
                      </div>
                    </div>
                    <button className="w-full rounded-xl bg-surface-2 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">View Profile</button>
                  </div>

                  {/* Related Threads */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="mb-3 text-xs font-bold text-foreground">Related Threads</h3>
                    <div className="space-y-2.5">
                      {allThreads.filter(t => t.id !== openThread.id && t.category === openThread.category).slice(0, 3).map((t) => (
                        <button key={t.id} onClick={() => setSelectedThread(t.id)} className="block w-full text-left group">
                          <p className="text-[11px] font-medium text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors">{t.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                            <span>{t.author}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><ChevronUp size={8} /> {t.upvotes}</span>
                            <span>·</span>
                            <span>{t.replies} replies</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thread Stats */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="mb-3 text-xs font-bold text-foreground">Thread Stats</h3>
                    <div className="space-y-2">
                      {[
                        { label: "Views", value: openThread.views.toLocaleString(), icon: Eye },
                        { label: "Upvotes", value: openThread.upvotes.toString(), icon: ChevronUp },
                        { label: "Comments", value: openThread.replies.toString(), icon: MessageSquare },
                        { label: "Awards", value: openThread.awards.reduce((s, a) => s + a.count, 0).toString(), icon: Award },
                        { label: "Posted", value: openThread.timeAgo, icon: Clock },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1.5 text-muted-foreground"><s.icon size={10} /> {s.label}</span>
                          <span className="font-mono font-semibold text-foreground">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Community Rules Mini */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="mb-3 text-xs font-bold text-foreground flex items-center gap-2"><Shield size={12} className="text-court-blue" /> Rules</h3>
                    <div className="space-y-1.5">
                      {forumRules.slice(0, 4).map((rule, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[7px] text-muted-foreground">{i + 1}</span>
                          <span className="text-[9px] text-muted-foreground">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
    );
  }

  // ============ FORUM LISTING VIEW ============
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* HERO SECTION */}
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--court-blue)/0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--skill-green)/0.04),transparent_40%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-court-blue/20 bg-court-blue/5 px-4 py-1.5 font-mono text-xs text-court-blue">
                    <MessageSquare size={12} /> Community Forums
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-skill-green/20 bg-skill-green/5 px-3 py-1 text-[10px] text-skill-green">
                    <Wifi size={10} /> {forumCategories.reduce((sum, c) => sum + c.online, 0)} online
                  </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
                  The <span className="text-court-blue">Forum</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 max-w-lg text-lg text-muted-foreground">
                  Where skills meet conversation. Ask questions, share wins, debate strategies, and connect with thousands of swappers.
                </motion.p>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
                  <motion.button onClick={() => setShowComposer(true)} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    New Thread <MessageSquare size={16} />
                  </motion.button>
                  <button className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <BookOpen size={16} /> Browse Guides
                  </button>
                </motion.div>
              </div>

              {/* Hero Stats Cards */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-3">
                {[
                  { label: "Threads", value: "6.9K", icon: FileText, color: "text-foreground" },
                  { label: "Posts", value: "52K", icon: MessageSquare, color: "text-court-blue" },
                  { label: "Members", value: "10.2K", icon: Users, color: "text-skill-green" },
                  { label: "Guides", value: "240+", icon: BookOpen, color: "text-badge-gold" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }}
                    className="rounded-2xl border border-border bg-card p-5 text-center hover:border-foreground/20 transition-colors">
                    <s.icon size={20} className={`mx-auto mb-2 ${s.color}`} />
                    <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* SCROLLING ACTIVITY TICKER */}
        <section className="border-y border-border bg-surface-1 py-2.5 overflow-hidden">
          <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1200] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
            {[...recentActivity, ...recentActivity].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">{a.user}</span>
                <span className="text-muted-foreground">{a.action}</span>
                <span className="text-foreground font-medium truncate max-w-[180px]">{a.target}</span>
                <span className="text-muted-foreground/60">{a.time}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* CATEGORY BROWSER SECTION */}
        <section className="py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Layers size={18} className="text-court-blue" /> Browse Categories
              </h2>
              <span className="text-[10px] text-muted-foreground">{forumCategories.length} categories</span>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {forumCategories.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                  className={`group rounded-xl border p-4 text-left transition-all ${selectedCategory === cat.name ? "border-foreground/30 bg-foreground/5" : "border-border bg-card hover:border-foreground/20"}`}
                >
                  <cat.icon size={18} className="mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <p className="text-xs font-semibold text-foreground mb-0.5">{cat.name}</p>
                  <p className="text-[9px] text-muted-foreground line-clamp-1">{cat.desc}</p>
                  <div className="mt-2 flex items-center gap-2 text-[8px] text-muted-foreground">
                    <span>{cat.threads} threads</span>
                    <span>·</span>
                    <span className="text-skill-green">{cat.online} online</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-3 flex items-center gap-2">
              <Bell size={14} className="text-badge-gold" />
              <h2 className="font-heading text-sm font-bold text-foreground">Announcements</h2>
            </div>
            <div className="space-y-2">
              {announcements.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-lg border border-badge-gold/10 bg-badge-gold/5 p-3 cursor-pointer hover:border-badge-gold/20 transition-colors">
                  <Pin size={12} className="text-badge-gold flex-shrink-0" />
                  <span className="flex-1 text-xs text-foreground">{a.title}</span>
                  <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground"><MessageSquare size={10} /> {a.comments}</span>
                  <span className="text-[10px] text-muted-foreground">{a.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WEEKLY HIGHLIGHTS */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-badge-gold" />
              <h2 className="font-heading text-sm font-bold text-foreground">This Week's Highlights</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {weeklyHighlights.map((h, i) => (
                <motion.div key={h.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-4 hover:border-badge-gold/20 transition-colors cursor-pointer">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{h.award}</span>
                    <span className="text-[10px] font-semibold text-badge-gold">{h.title}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{h.thread}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">by {h.author}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-2">
              <Calendar size={14} className="text-court-blue" />
              <h2 className="font-heading text-sm font-bold text-foreground">Upcoming Events</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingEvents.map((ev, i) => (
                <motion.div key={ev.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-foreground/20 transition-colors cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                    <ev.icon size={18} className={ev.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{ev.title}</p>
                    <p className="text-[10px] text-muted-foreground">{ev.date}, 2026</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH + SORT + THREAD LIST + SIDEBAR */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-6">
            {/* Search + Sort */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
            {selectedCategory && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Filtered:</span>
                <span className="flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1 text-[10px] font-medium text-foreground">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </span>
              </div>
            )}

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
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><ImageIcon size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Code size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Link2 size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><Paperclip size={14} /></button>
                        <button className="rounded-lg bg-surface-2 p-2 text-muted-foreground hover:text-foreground"><BarChart3 size={14} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Tags (comma separated)" className="h-8 w-40 rounded-lg border border-border bg-surface-1 px-3 text-[10px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background">
                          Post <Send size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Thread List */}
              <div>
                <div className="space-y-2">
                  {sortedThreads.map((thread, i) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
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

                <div className="mt-6 text-center">
                  <button className="rounded-xl border border-border bg-card px-8 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                    Load More Threads
                  </button>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="space-y-4">
                {/* Top Contributors */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <Crown size={14} className="text-badge-gold" /> Top Contributors
                  </h3>
                  <div className="space-y-3">
                    {topContributors.map((c) => (
                      <div key={c.name} className="flex items-center gap-3 group cursor-pointer">
                        <span className="flex h-5 w-5 items-center justify-center font-mono text-[10px] font-bold text-muted-foreground">#{c.rank}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground">{c.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-[10px] font-semibold text-foreground truncate group-hover:text-muted-foreground">{c.name}</p>
                            <span className="text-[10px]">{c.badge}</span>
                          </div>
                          <p className="text-[8px] text-muted-foreground">{c.karma.toLocaleString()} karma · {c.streak}d streak</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Guides */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                    <BookOpen size={14} className="text-skill-green" /> Popular Guides
                  </h3>
                  <div className="space-y-2.5">
                    {popularGuides.map((g) => (
                      <div key={g.title} className="flex items-start gap-2.5 cursor-pointer group">
                        <g.icon size={14} className="mt-0.5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                        <div>
                          <p className="text-[10px] font-medium text-foreground group-hover:text-muted-foreground transition-colors line-clamp-1">{g.title}</p>
                          <p className="text-[8px] text-muted-foreground">{g.views.toLocaleString()} views · {g.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Sidebar */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 font-heading text-xs font-bold text-foreground">Categories</h3>
                  <div className="space-y-1.5">
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
                  <h3 className="mb-3 font-heading text-xs font-bold text-foreground flex items-center gap-2">
                    <TrendingUp size={12} className="text-skill-green" /> Trending Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["guild-wars", "tier-up", "auction", "co-creation", "court-tips", "sp-earning", "design", "api", "webhooks", "mentorship", "portfolio", "review"].map((tag) => (
                      <span key={tag} className="rounded-md border border-border bg-surface-1 px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/20 cursor-pointer transition-colors">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Join CTA */}
                <div className="rounded-2xl border border-court-blue/20 bg-court-blue/5 p-5 text-center">
                  <MessageSquare size={24} className="mx-auto mb-2 text-court-blue" />
                  <p className="text-xs font-bold text-foreground mb-1">Join the Conversation</p>
                  <p className="text-[10px] text-muted-foreground mb-3">Create an account to post, vote, and earn karma.</p>
                  <button className="w-full rounded-xl bg-foreground py-2 text-xs font-semibold text-background">Sign Up Free</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR GUIDES SECTION */}
        <section className="border-t border-border bg-surface-1 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen size={18} className="text-skill-green" /> Community Guides
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">View all <ArrowRight size={12} /></button>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {popularGuides.map((g, i) => (
                <motion.div key={g.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors cursor-pointer group">
                  <g.icon size={22} className="mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <p className="text-xs font-semibold text-foreground mb-1 line-clamp-2">{g.title}</p>
                  <p className="text-[10px] text-muted-foreground">by {g.author}</p>
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Eye size={9} /> {g.views.toLocaleString()} views
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY STATS */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 text-center">
              <h2 className="font-heading text-xl font-bold text-foreground">Community by the Numbers</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {[
                { label: "Total Threads", value: "6,920", icon: FileText },
                { label: "Total Posts", value: "52,400", icon: MessageSquare },
                { label: "Active Users", value: "10,200", icon: Users },
                { label: "Guides Written", value: "240", icon: BookOpen },
                { label: "Awards Given", value: "8,900", icon: Award },
                { label: "This Week", value: "+340", icon: TrendingUp },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 text-center">
                  <s.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-xl font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MODERATION & KARMA SECTION */}
        <section className="border-t border-border bg-surface-1 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 text-center">
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">How Karma Works</h2>
              <p className="text-sm text-muted-foreground mx-auto max-w-lg">Your karma score reflects your community contributions. Earn it through quality posts, helpful answers, and active participation.</p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { action: "Post upvoted", points: "+1", icon: ChevronUp, color: "text-skill-green" },
                { action: "Answer accepted", points: "+5", icon: CheckCircle2, color: "text-skill-green" },
                { action: "Guide published", points: "+10", icon: BookOpen, color: "text-court-blue" },
                { action: "Award received", points: "+3", icon: Award, color: "text-badge-gold" },
              ].map((k, i) => (
                <motion.div key={k.action} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                    <k.icon size={18} className={k.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{k.action}</p>
                    <p className={`font-mono text-sm font-bold ${k.color}`}>{k.points} karma</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FORUM RULES EXPANDED */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Shield size={24} className="mx-auto mb-3 text-court-blue" />
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">Community Guidelines</h2>
              <p className="text-sm text-muted-foreground mb-8">Help us keep the forums a welcoming, productive space for everyone.</p>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {forumRules.map((rule, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-court-blue/10 font-mono text-[10px] font-bold text-court-blue">{i + 1}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rule}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ForumsPage;
