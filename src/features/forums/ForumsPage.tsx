import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Flame, Pin, ArrowRight, ThumbsUp, Eye, Clock, Hash, Zap, Palette, Code, Trophy, Shield, Search, Star, Bell } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const forumCategories = [
  { icon: MessageSquare, name: "General Discussion", desc: "Talk about anything related to SkillSwappr", threads: 1240, posts: 8930 },
  { icon: Palette, name: "Design Corner", desc: "Share design work, get feedback, discuss trends", threads: 890, posts: 5670 },
  { icon: Code, name: "Dev Talk", desc: "Programming, architecture, and tech discussions", threads: 1100, posts: 7240 },
  { icon: Trophy, name: "Achievements & Milestones", desc: "Celebrate wins and share your journey", threads: 560, posts: 3400 },
  { icon: Shield, name: "Skill Court", desc: "Discuss cases, judging tips, and dispute resolution", threads: 340, posts: 2100 },
  { icon: Users, name: "Guild Recruitment", desc: "Find or build your dream team", threads: 780, posts: 4200 },
  { icon: Zap, name: "Tips & Tricks", desc: "Pro tips for maximizing your experience", threads: 620, posts: 3800 },
  { icon: Hash, name: "Feature Requests", desc: "Suggest and vote on new features", threads: 430, posts: 2900 },
];

const announcements = [
  { title: "🚀 Co-Creation Studio is now live!", date: "Mar 3, 2026", pinned: true },
  { title: "📋 Community Guidelines Update — Please Read", date: "Feb 28, 2026", pinned: true },
  { title: "🏆 Guild Wars Season 4 starts next week!", date: "Mar 1, 2026", pinned: true },
];

const trendingThreads = [
  { title: "What's the fastest way to reach Gold tier?", author: "Maya K.", replies: 47, views: 1200, likes: 89, hot: true, category: "Tips & Tricks" },
  { title: "My guild just hit 50 members — here's what I learned", author: "Carlos M.", replies: 32, views: 890, likes: 124, hot: true, category: "Guild Recruitment" },
  { title: "Unpopular opinion: Auction format is underrated", author: "Aisha R.", replies: 63, views: 2100, likes: 56, hot: false, category: "General Discussion" },
  { title: "Best practices for Skill Court judging", author: "James T.", replies: 28, views: 670, likes: 45, hot: false, category: "Skill Court" },
  { title: "Show & Tell: My best logo designs from swaps", author: "Lena S.", replies: 19, views: 1500, likes: 203, hot: true, category: "Design Corner" },
];

const topContributors = [
  { name: "Maya K.", posts: 342, likes: 1890, streak: 28 },
  { name: "James T.", posts: 289, likes: 1560, streak: 14 },
  { name: "Aisha R.", posts: 234, likes: 1340, streak: 21 },
];

const ForumsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="mb-2 font-heading text-5xl font-black text-foreground sm:text-6xl">Forums</h1>
                <p className="text-lg text-muted-foreground">Connect, discuss, and learn with the community.</p>
              </div>
              <motion.button className="flex items-center gap-2 self-start rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                New Thread <MessageSquare size={16} />
              </motion.button>
            </motion.div>

            {/* Search */}
            <div className="relative mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search threads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
            </div>

            {/* Pinned Announcements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <Bell size={16} className="text-badge-gold" />
                <h2 className="font-heading text-sm font-bold text-foreground">Announcements</h2>
              </div>
              <div className="space-y-2">
                {announcements.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-badge-gold/10 bg-badge-gold/5 p-3 cursor-pointer hover:border-badge-gold/20 transition-colors">
                    <Pin size={12} className="text-badge-gold flex-shrink-0" />
                    <span className="flex-1 text-sm text-foreground">{a.title}</span>
                    <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Flame size={18} className="text-alert-red" />
                <h2 className="font-heading text-lg font-bold text-foreground">Trending Now</h2>
              </div>
              <div className="space-y-2">
                {trendingThreads.map((thread, i) => (
                  <motion.div key={thread.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 cursor-pointer">
                    {thread.hot ? <Flame size={14} className="flex-shrink-0 text-alert-red" /> : <MessageSquare size={14} className="flex-shrink-0 text-muted-foreground" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{thread.author}</span>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5">{thread.category}</span>
                      </div>
                    </div>
                    <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                      <span className="flex items-center gap-1"><MessageSquare size={12} /> {thread.replies}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {thread.views}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {thread.likes}</span>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Star size={18} className="text-badge-gold" />
                <h2 className="font-heading text-lg font-bold text-foreground">Top Contributors This Week</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {topContributors.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-sm font-bold text-foreground">{c.name.split(" ").map(n => n[0]).join("")}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <div className="flex gap-3 text-[10px] text-muted-foreground">
                        <span>{c.posts} posts</span>
                        <span>{c.likes} likes</span>
                        <span className="flex items-center gap-0.5"><Flame size={10} className="text-badge-gold" />{c.streak}d</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Browse Categories</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {forumCategories.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 cursor-pointer">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground transition-colors group-hover:bg-foreground/10">
                    <cat.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{cat.name}</h3>
                    <p className="mb-2 text-xs text-muted-foreground">{cat.desc}</p>
                    <div className="flex gap-4 text-[10px] text-muted-foreground">
                      <span>{cat.threads.toLocaleString()} threads</span>
                      <span>{cat.posts.toLocaleString()} posts</span>
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
};

export default ForumsPage;
