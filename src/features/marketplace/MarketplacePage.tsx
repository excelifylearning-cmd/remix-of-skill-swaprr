import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3,
  Filter, Clock, Flame
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const categories = [
  { label: "All", icon: Filter },
  { label: "Design", icon: Palette },
  { label: "Development", icon: Code },
  { label: "Writing", icon: PenTool },
  { label: "Video", icon: Video },
  { label: "Marketing", icon: BarChart3 },
];

const gigs = [
  { skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true },
  { skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false },
  { skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false },
  { skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true },
  { skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false },
  { skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true },
  { skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false },
  { skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false },
  { skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false },
  { skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true },
  { skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true },
  { skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Video", hot: false },
];

const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = gigs.filter((g) => {
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    const matchSearch = g.skill.toLowerCase().includes(searchQuery.toLowerCase()) || g.wants.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 font-heading text-4xl font-black text-foreground sm:text-5xl"
          >
            Marketplace
          </motion.h1>
          <p className="mb-8 text-lg text-muted-foreground">Find your perfect skill exchange.</p>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills, gigs, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
            />
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
              </motion.button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((gig, i) => (
              <motion.div
                key={`${gig.seller}-${gig.skill}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-3d group"
              >
                <div className="card-3d-inner h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-foreground">
                      {gig.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{gig.seller}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground">ELO {gig.elo}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <Star size={10} className="fill-badge-gold text-badge-gold" />
                        <span className="font-mono text-[10px] text-badge-gold">{gig.rating}</span>
                      </div>
                    </div>
                    {gig.hot && <Flame size={14} className="text-alert-red" />}
                  </div>

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

                  {gig.points > 0 ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1 text-xs font-semibold text-skill-green">
                      <TrendingUp size={12} />+{gig.points} SP
                    </div>
                  ) : (
                    <div className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground">
                      Equal value exchange
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No gigs found matching your search. Try a different query.
            </div>
          )}
        </div>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default MarketplacePage;
