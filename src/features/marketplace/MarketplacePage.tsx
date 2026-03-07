import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3,
  Filter, Flame, ArrowUpDown, SlidersHorizontal, Users, Clock, Zap,
  ArrowRight, Eye
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const categories = [
  { label: "All", icon: Filter, count: 24 },
  { label: "Design", icon: Palette, count: 8 },
  { label: "Development", icon: Code, count: 7 },
  { label: "Writing", icon: PenTool, count: 3 },
  { label: "Video", icon: Video, count: 4 },
  { label: "Marketing", icon: BarChart3, count: 2 },
];

const sortOptions = ["Trending", "Newest", "Highest ELO", "Most Points"];

const gigs = [
  { skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, format: "Direct Swap", posted: "2h ago", views: 124 },
  { skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 89 },
  { skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 67 },
  { skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true, format: "Co-Creation", posted: "1h ago", views: 203 },
  { skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, format: "Direct Swap", posted: "8h ago", views: 45 },
  { skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, format: "Skill Fusion", posted: "30m ago", views: 312 },
  { skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false, format: "Direct Swap", posted: "12h ago", views: 78 },
  { skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, format: "Auction", posted: "3h ago", views: 156 },
  { skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false, format: "Direct Swap", posted: "1d ago", views: 34 },
  { skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true, format: "Flash Market", posted: "45m ago", views: 234 },
  { skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, format: "Projects", posted: "15m ago", views: 445 },
  { skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Video", hot: false, format: "Direct Swap", posted: "5h ago", views: 92 },
  { skill: "UX Research", wants: "Data Viz", points: 15, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: false, format: "Co-Creation", posted: "7h ago", views: 110 },
  { skill: "Technical Writing", wants: "Frontend Dev", points: 20, seller: "Sam D.", elo: 1350, rating: 4.6, avatar: "SD", category: "Writing", hot: false, format: "Direct Swap", posted: "9h ago", views: 56 },
  { skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", category: "Design", hot: true, format: "Skill Fusion", posted: "2h ago", views: 178 },
  { skill: "API Development", wants: "Illustration", points: 35, seller: "Dev K.", elo: 1660, rating: 5.0, avatar: "DK", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 98 },
  { skill: "Podcast Editing", wants: "Thumbnail Design", points: 10, seller: "Zara N.", elo: 1280, rating: 4.5, avatar: "ZN", category: "Video", hot: false, format: "Flash Market", posted: "11h ago", views: 41 },
  { skill: "Content Strategy", wants: "App Prototype", points: 40, seller: "Leo R.", elo: 1440, rating: 4.7, avatar: "LR", category: "Writing", hot: false, format: "Projects", posted: "6h ago", views: 87 },
];

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground" };
  return { label: "Bronze", color: "text-orange-400" };
};

const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("Trending");
  const [showSort, setShowSort] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = gigs.filter((g) => {
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    const matchSearch = g.skill.toLowerCase().includes(searchQuery.toLowerCase()) || g.wants.toLowerCase().includes(searchQuery.toLowerCase()) || g.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="mb-2 font-heading text-4xl font-black text-foreground sm:text-5xl">Marketplace</h1>
            <p className="text-lg text-muted-foreground">Find your perfect skill exchange from {gigs.length}+ active gigs.</p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap gap-6 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-skill-green/10">
                <Zap size={14} className="text-skill-green" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">{gigs.length}</p>
                <p className="text-[10px] text-muted-foreground">Active Gigs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-badge-gold/10">
                <Users size={14} className="text-badge-gold" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">1,240</p>
                <p className="text-[10px] text-muted-foreground">Online Now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-court-blue/10">
                <TrendingUp size={14} className="text-court-blue" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">89K+</p>
                <p className="text-[10px] text-muted-foreground">Swaps Done</p>
              </div>
            </div>
          </motion.div>

          {/* Search + Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search skills, gigs, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
            </div>
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)} className="flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground hover:text-foreground">
                <ArrowUpDown size={14} /> {sort}
              </button>
              {showSort && (
                <div className="absolute right-0 top-14 z-20 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
                  {sortOptions.map((s) => (
                    <button key={s} onClick={() => { setSort(s); setShowSort(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${sort === s ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.label
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
                <span className="ml-1 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px]">{cat.count}</span>
              </motion.button>
            ))}
          </div>

          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length} gigs found</p>
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((gig, i) => {
                const tier = eloTier(gig.elo);
                return (
                  <motion.div
                    key={`${gig.seller}-${gig.skill}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-3d group cursor-pointer"
                  >
                    <div className="card-3d-inner h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_30px_hsl(var(--silver)/0.06)]">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-foreground">
                          {gig.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{gig.seller}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono text-[10px] ${tier.color}`}>{tier.label}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="font-mono text-[10px] text-muted-foreground">ELO {gig.elo}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <Star size={10} className="fill-badge-gold text-badge-gold" />
                            <span className="font-mono text-[10px] text-badge-gold">{gig.rating}</span>
                          </div>
                        </div>
                        {gig.hot && <Flame size={14} className="text-alert-red flex-shrink-0" />}
                      </div>

                      {/* Skills */}
                      <div className="mb-3 space-y-2">
                        <div className="rounded-lg bg-surface-2 px-3 py-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Offering</span>
                          <p className="text-sm font-medium text-foreground">{gig.skill}</p>
                        </div>
                        <div className="rounded-lg border border-dashed border-border px-3 py-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Wants</span>
                          <p className="text-sm font-medium text-foreground/80">{gig.wants}</p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{gig.format}</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock size={10} /> {gig.posted}</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Eye size={10} /> {gig.views}</span>
                      </div>

                      {/* Points */}
                      {gig.points > 0 ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1.5 text-xs font-semibold text-skill-green">
                          <TrendingUp size={12} />+{gig.points} SP to balance
                        </div>
                      ) : (
                        <div className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          Equal value exchange
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground mb-4">No gigs found matching your search.</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="text-sm text-foreground underline">Clear filters</button>
            </div>
          )}

          {/* Load More */}
          <motion.div className="mt-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Load More Gigs <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        </div>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default MarketplacePage;
