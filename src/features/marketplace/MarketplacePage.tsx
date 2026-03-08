import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3,
  Filter, Flame, ArrowUpDown, Users, Clock, Zap, ArrowRight, Eye,
  X, Gavel, Sparkles, Timer, Shield, ChevronDown, Grid3X3, List,
  Heart, Share2, MessageSquare, BookOpen, Layers, Music, Camera,
  Globe, Cpu, Megaphone, GraduationCap, Trophy, Target, Plus,
  AlertCircle, CheckCircle2, Rocket, Crown
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

/* ─── DATA ─── */

const categories = [
  { label: "All", icon: Filter, count: 36 },
  { label: "Design", icon: Palette, count: 10 },
  { label: "Development", icon: Code, count: 9 },
  { label: "Writing", icon: PenTool, count: 5 },
  { label: "Video", icon: Video, count: 5 },
  { label: "Marketing", icon: BarChart3, count: 3 },
  { label: "Music", icon: Music, count: 2 },
  { label: "Photography", icon: Camera, count: 2 },
];

const formats = ["All Formats", "Direct Swap", "Auction", "Co-Creation", "Flash Market", "Skill Fusion", "Projects"];
const sortOptions = ["Trending", "Newest", "Highest ELO", "Most Points", "Most Views"];
const eloRanges = ["Any ELO", "Bronze (0-1299)", "Silver (1300-1499)", "Gold (1500-1699)", "Diamond (1700+)"];
const universities = ["Any University", "MIT", "Stanford", "Harvard", "UC Berkeley", "Georgia Tech", "Caltech"];

const gigs = [
  { id: 1, skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, format: "Direct Swap", posted: "2h ago", views: 124, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. I specialize in minimal, modern brand identities." },
  { id: 2, skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 89, uni: "Stanford", verified: true, desc: "Full-stack Python/Django backend development. REST APIs, database design, and deployment." },
  { id: 3, skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 67, uni: "Harvard", verified: true, desc: "Professional video editing using Premiere Pro and After Effects. Specializing in short-form content." },
  { id: 4, skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true, format: "Co-Creation", posted: "1h ago", views: 203, uni: "Georgia Tech", verified: true, desc: "Blender & Maya 3D modeling for games, AR/VR experiences, and product visualization." },
  { id: 5, skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, format: "Direct Swap", posted: "8h ago", views: 45, uni: "UC Berkeley", verified: false, desc: "Data-driven SEO strategy including keyword research, on-page optimization, and analytics setup." },
  { id: 6, skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, format: "Skill Fusion", posted: "30m ago", views: 312, uni: "MIT", verified: true, desc: "Advanced data analysis with Python, R, and Tableau. Machine learning model development." },
  { id: 7, skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false, format: "Direct Swap", posted: "12h ago", views: 78, uni: "Caltech", verified: false, desc: "Digital illustration in various styles — editorial, children's book, and character design." },
  { id: 8, skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, format: "Auction", posted: "3h ago", views: 156, uni: "Stanford", verified: true, desc: "Cinema 4D and After Effects motion graphics for explainers, social media, and ads." },
  { id: 9, skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false, format: "Direct Swap", posted: "1d ago", views: 34, uni: "", verified: false, desc: "SEO-optimized blog writing for tech, lifestyle, and business niches." },
  { id: 10, skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true, format: "Flash Market", posted: "45m ago", views: 234, uni: "Harvard", verified: true, desc: "Facebook, Instagram, and TikTok ad campaigns with proven ROI." },
  { id: 11, skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, format: "Projects", posted: "15m ago", views: 445, uni: "MIT", verified: true, desc: "Cross-platform mobile apps with React Native. Published 5 apps on both stores." },
  { id: 12, skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Photography", hot: false, format: "Direct Swap", posted: "5h ago", views: 92, uni: "", verified: false, desc: "Studio and lifestyle product photography with professional lighting and retouching." },
  { id: 13, skill: "UX Research", wants: "Data Viz", points: 15, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: false, format: "Co-Creation", posted: "7h ago", views: 110, uni: "Stanford", verified: true, desc: "User research, usability testing, and persona development for digital products." },
  { id: 14, skill: "Technical Writing", wants: "Frontend Dev", points: 20, seller: "Sam D.", elo: 1350, rating: 4.6, avatar: "SD", category: "Writing", hot: false, format: "Direct Swap", posted: "9h ago", views: 56, uni: "Georgia Tech", verified: true, desc: "API documentation, user guides, and technical blog posts for SaaS products." },
  { id: 15, skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", category: "Design", hot: true, format: "Skill Fusion", posted: "2h ago", views: 178, uni: "UC Berkeley", verified: true, desc: "Game mechanics design, level design, and balancing for indie games." },
  { id: 16, skill: "API Development", wants: "Illustration", points: 35, seller: "Dev K.", elo: 1660, rating: 5.0, avatar: "DK", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 98, uni: "MIT", verified: true, desc: "RESTful and GraphQL API development with Node.js, Go, or Python." },
  { id: 17, skill: "Podcast Editing", wants: "Thumbnail Design", points: 10, seller: "Zara N.", elo: 1280, rating: 4.5, avatar: "ZN", category: "Video", hot: false, format: "Flash Market", posted: "11h ago", views: 41, uni: "", verified: false, desc: "Podcast editing including noise removal, EQ, and show notes creation." },
  { id: 18, skill: "Content Strategy", wants: "App Prototype", points: 40, seller: "Leo R.", elo: 1440, rating: 4.7, avatar: "LR", category: "Writing", hot: false, format: "Projects", posted: "6h ago", views: 87, uni: "Harvard", verified: true, desc: "Content strategy for startups — editorial calendars, voice & tone guides." },
  { id: 19, skill: "Music Production", wants: "Video Editing", points: 30, seller: "DJ Kael", elo: 1530, rating: 4.9, avatar: "DK", category: "Music", hot: true, format: "Direct Swap", posted: "1h ago", views: 189, uni: "", verified: false, desc: "Beat production, mixing, and mastering across hip-hop, electronic, and pop genres." },
  { id: 20, skill: "Brand Photography", wants: "Social Media Mgmt", points: 20, seller: "Iris V.", elo: 1410, rating: 4.7, avatar: "IV", category: "Photography", hot: false, format: "Auction", posted: "3h ago", views: 73, uni: "Caltech", verified: false, desc: "Brand and lifestyle photography for e-commerce, social media, and campaigns." },
  { id: 21, skill: "Machine Learning", wants: "UX Design", points: 55, seller: "Victor Z.", elo: 1780, rating: 5.0, avatar: "VZ", category: "Development", hot: true, format: "Skill Fusion", posted: "20m ago", views: 521, uni: "MIT", verified: true, desc: "ML model development, NLP, computer vision. Published researcher with 3 papers." },
  { id: 22, skill: "Songwriting", wants: "Graphic Design", points: 15, seller: "Melody P.", elo: 1340, rating: 4.6, avatar: "MP", category: "Music", hot: false, format: "Direct Swap", posted: "8h ago", views: 62, uni: "", verified: false, desc: "Original songwriting for commercials, indie films, and personal projects." },
  { id: 23, skill: "Infographic Design", wants: "Python Scripts", points: 20, seller: "Tara J.", elo: 1470, rating: 4.8, avatar: "TJ", category: "Design", hot: false, format: "Direct Swap", posted: "5h ago", views: 88, uni: "UC Berkeley", verified: true, desc: "Data visualization and infographic design for reports, presentations, and social media." },
  { id: 24, skill: "Cloud Architecture", wants: "Brand Strategy", points: 60, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, format: "Projects", posted: "10m ago", views: 634, uni: "Stanford", verified: true, desc: "AWS/GCP cloud architecture, DevOps pipelines, and infrastructure as code." },
  { id: 25, skill: "Copywriting", wants: "Motion Graphics", points: 15, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, format: "Flash Market", posted: "2h ago", views: 94, uni: "Harvard", verified: true, desc: "Conversion-focused copywriting for landing pages, emails, and ad campaigns." },
  { id: 26, skill: "Digital Ads", wants: "App Development", points: 25, seller: "Rita G.", elo: 1480, rating: 4.8, avatar: "RG", category: "Marketing", hot: false, format: "Co-Creation", posted: "4h ago", views: 112, uni: "Georgia Tech", verified: true, desc: "Google Ads and Meta Ads management with A/B testing and conversion optimization." },
  { id: 27, skill: "Figma Prototyping", wants: "Backend Dev", points: 30, seller: "Suki T.", elo: 1540, rating: 4.9, avatar: "ST", category: "Design", hot: true, format: "Direct Swap", posted: "1h ago", views: 201, uni: "MIT", verified: true, desc: "High-fidelity Figma prototypes with interactive components and design systems." },
  { id: 28, skill: "Video Production", wants: "Data Analysis", points: 35, seller: "Finn B.", elo: 1590, rating: 4.9, avatar: "FB", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 143, uni: "Stanford", verified: true, desc: "End-to-end video production — scripting, filming, editing, and color grading." },
  { id: 29, skill: "Cybersecurity Audit", wants: "Design System", points: 45, seller: "Hack M.", elo: 1700, rating: 5.0, avatar: "HM", category: "Development", hot: true, format: "Skill Fusion", posted: "45m ago", views: 387, uni: "Caltech", verified: true, desc: "Penetration testing, vulnerability assessment, and security hardening for web apps." },
  { id: 30, skill: "Typography Design", wants: "SEO Strategy", points: 20, seller: "Vera L.", elo: 1430, rating: 4.7, avatar: "VL", category: "Design", hot: false, format: "Direct Swap", posted: "7h ago", views: 69, uni: "UC Berkeley", verified: false, desc: "Custom typeface design and typographic systems for brand identities." },
];

const aiSuggestions = [
  "Design a logo for my startup",
  "Build a React dashboard",
  "Edit a YouTube video",
  "Write blog posts for my SaaS",
  "Create social media ads",
];

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10" };
};

/* ─── COUNTDOWN HOOK ─── */
const useCountdown = (minutes: number) => {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const iv = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}h ${m}m ${s}s`;
};

/* ─── AUCTION CARD ─── */
const AuctionCard = ({ gig }: { gig: typeof gigs[0] & { bids?: number; timeLeft?: number } }) => {
  const tier = eloTier(gig.elo);
  const countdown = useCountdown(gig.timeLeft || 120);
  return (
    <motion.div whileHover={{ y: -4 }} className="min-w-[300px] rounded-2xl border border-border bg-card p-5 transition-all hover:border-badge-gold/30">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gavel size={14} className="text-badge-gold" />
          <span className="text-xs font-semibold text-badge-gold">AUCTION</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5">
          <Timer size={10} className="text-alert-red" />
          <span className="font-mono text-[10px] text-alert-red">{countdown}</span>
        </div>
      </div>
      <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
      <p className="mb-3 text-xs text-muted-foreground">Wants: {gig.wants}</p>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-foreground">{gig.avatar}</div>
        <span className="text-xs text-foreground">{gig.seller}</span>
        <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Users size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{gig.bids || 5} bids</span>
        </div>
        <span className="text-xs font-semibold text-skill-green">+{gig.points} SP</span>
      </div>
    </motion.div>
  );
};

/* ─── MAIN COMPONENT ─── */
const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFormat, setActiveFormat] = useState("All Formats");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("Trending");
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [eloRange, setEloRange] = useState("Any ELO");
  const [uni, setUni] = useState("Any University");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedGig, setSelectedGig] = useState<typeof gigs[0] | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const trendingRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = gigs.filter((g) => {
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    const matchFormat = activeFormat === "All Formats" || g.format === activeFormat;
    const matchSearch = !searchQuery || g.skill.toLowerCase().includes(searchQuery.toLowerCase()) || g.wants.toLowerCase().includes(searchQuery.toLowerCase()) || g.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchElo = eloRange === "Any ELO" ||
      (eloRange.includes("Bronze") && g.elo < 1300) ||
      (eloRange.includes("Silver") && g.elo >= 1300 && g.elo < 1500) ||
      (eloRange.includes("Gold") && g.elo >= 1500 && g.elo < 1700) ||
      (eloRange.includes("Diamond") && g.elo >= 1700);
    const matchUni = uni === "Any University" || g.uni === uni;
    return matchCat && matchFormat && matchSearch && matchElo && matchUni;
  });

  const trendingGigs = gigs.filter((g) => g.hot).sort((a, b) => b.views - a.views);
  const auctionGigs = gigs.filter((g) => g.format === "Auction");
  const coCreationGigs = gigs.filter((g) => g.format === "Co-Creation");
  const flashGigs = gigs.filter((g) => g.format === "Flash Market");
  const recommendedGigs = gigs.filter((g) => g.elo >= 1500 && g.verified).slice(0, 4);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">

          {/* ═══ SECTION 1: HERO + SEARCH ═══ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="mb-2 font-heading text-4xl font-black text-foreground sm:text-5xl">Marketplace</h1>
            <p className="mb-6 text-lg text-muted-foreground">Discover {gigs.length}+ active skill exchanges. Find, swap, and grow.</p>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder='Try "React dashboard" or "logo design"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* AI Suggestion Chips */}
            <div className="flex flex-wrap gap-2">
              <Sparkles size={14} className="mt-1 text-badge-gold" />
              {aiSuggestions.map((s) => (
                <button key={s} onClick={() => setSearchQuery(s)} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap gap-6 rounded-2xl border border-border bg-card p-4">
            {[
              { icon: Zap, val: `${gigs.length}`, label: "Active Gigs", color: "text-skill-green", bg: "bg-skill-green/10" },
              { icon: Users, val: "1,240", label: "Online Now", color: "text-badge-gold", bg: "bg-badge-gold/10" },
              { icon: TrendingUp, val: "89K+", label: "Swaps Done", color: "text-court-blue", bg: "bg-court-blue/10" },
              { icon: Shield, val: "99.2%", label: "Satisfaction", color: "text-skill-green", bg: "bg-skill-green/10" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon size={14} className={s.color} />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Filters Row */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={() => setShowFilters(!showFilters)} className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground hover:text-foreground">
              <Filter size={14} /> Advanced Filters
              <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <div className="relative ml-auto">
              <button onClick={() => setShowSort(!showSort)} className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground hover:text-foreground">
                <ArrowUpDown size={14} /> {sort}
              </button>
              {showSort && (
                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
                  {sortOptions.map((s) => (
                    <button key={s} onClick={() => { setSort(s); setShowSort(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${sort === s ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
              <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${view === "grid" ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}><List size={14} /></button>
            </div>
          </div>

          {/* Advanced Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">Format</label>
                    <div className="flex flex-wrap gap-1.5">
                      {formats.map((f) => (
                        <button key={f} onClick={() => setActiveFormat(f)} className={`rounded-full px-3 py-1 text-[11px] transition-all ${activeFormat === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">ELO Range</label>
                    <div className="flex flex-wrap gap-1.5">
                      {eloRanges.map((e) => (
                        <button key={e} onClick={() => setEloRange(e)} className={`rounded-full px-3 py-1 text-[11px] transition-all ${eloRange === e ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                          {e.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted-foreground">University</label>
                    <div className="flex flex-wrap gap-1.5">
                      {universities.map((u) => (
                        <button key={u} onClick={() => setUni(u)} className={`rounded-full px-3 py-1 text-[11px] transition-all ${uni === u ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => { setActiveFormat("All Formats"); setEloRange("Any ELO"); setUni("Any University"); setActiveCategory("All"); setSearchQuery(""); }} className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ SECTION 2: CATEGORIES ═══ */}
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.label ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${activeCategory === cat.label ? "bg-background/20 text-background" : "bg-surface-2"}`}>{cat.count}</span>
              </motion.button>
            ))}
          </div>

          {/* ═══ SECTION 3: TRENDING GIGS ═══ */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <div className="mb-4 flex items-center gap-2">
              <Flame size={18} className="text-alert-red" />
              <h2 className="font-heading text-xl font-bold text-foreground">Trending Now</h2>
              <span className="rounded-full bg-alert-red/10 px-2 py-0.5 text-[10px] font-semibold text-alert-red">LIVE</span>
            </div>
            <div ref={trendingRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingGigs.map((gig) => {
                const tier = eloTier(gig.elo);
                return (
                  <motion.div key={gig.id} whileHover={{ y: -4 }} onClick={() => setSelectedGig(gig)} className="min-w-[280px] cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                    <div className="mb-3 flex items-center gap-2">
                      <Flame size={12} className="text-alert-red" />
                      <span className="text-[10px] font-semibold text-alert-red">{gig.views} views</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{gig.posted}</span>
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
                    <p className="mb-3 text-xs text-muted-foreground">↔ {gig.wants}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-foreground">{gig.avatar}</div>
                      <span className="text-xs text-foreground">{gig.seller}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tier.bg} ${tier.color}`}>{tier.label}</span>
                      {gig.verified && <CheckCircle2 size={12} className="text-skill-green" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ═══ SECTION 4: MAIN GIG GRID ═══ */}
          <section className="mb-14">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">All Gigs</h2>
              <p className="text-sm text-muted-foreground">{filtered.length} results</p>
            </div>

            <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
              <AnimatePresence mode="popLayout">
                {filtered.map((gig, i) => {
                  const tier = eloTier(gig.elo);
                  if (view === "list") {
                    return (
                      <motion.div
                        key={gig.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => setSelectedGig(gig)}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-foreground">{gig.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">{gig.skill}</p>
                            <ArrowRight size={12} className="shrink-0 text-muted-foreground" />
                            <p className="truncate text-sm text-muted-foreground">{gig.wants}</p>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-foreground">{gig.seller}</span>
                            <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
                            {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
                            <span className="text-[10px] text-muted-foreground">{gig.posted}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{gig.format}</span>
                          {gig.points > 0 && <span className="text-xs font-semibold text-skill-green">+{gig.points} SP</span>}
                          {gig.hot && <Flame size={14} className="text-alert-red" />}
                          <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground hover:text-alert-red">
                            <Heart size={14} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      key={gig.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setSelectedGig(gig)}
                      className="card-3d group cursor-pointer"
                    >
                      <div className="card-3d-inner h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_30px_hsl(var(--silver)/0.06)]">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-semibold text-foreground">{gig.avatar}</div>
                            <div>
                              <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                                {gig.seller}
                                {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
                                <span className="text-muted-foreground/30">·</span>
                                <Star size={9} className="fill-badge-gold text-badge-gold" />
                                <span className="text-[10px] text-badge-gold">{gig.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {gig.hot && <Flame size={12} className="text-alert-red" />}
                            <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground hover:text-alert-red">
                              <Heart size={14} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3 space-y-1.5">
                          <div className="rounded-lg bg-surface-2 px-3 py-2">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Offering</span>
                            <p className="text-sm font-medium text-foreground">{gig.skill}</p>
                          </div>
                          <div className="rounded-lg border border-dashed border-border px-3 py-2">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Wants</span>
                            <p className="text-sm font-medium text-foreground/80">{gig.wants}</p>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{gig.format}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Clock size={9} />{gig.posted}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Eye size={9} />{gig.views}</span>
                          {gig.uni && <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><GraduationCap size={9} />{gig.uni}</span>}
                        </div>

                        {gig.points > 0 ? (
                          <div className="flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1.5 text-xs font-semibold text-skill-green">
                            <TrendingUp size={12} />+{gig.points} SP
                          </div>
                        ) : (
                          <div className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">Equal value exchange</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <AlertCircle size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="mb-2 text-foreground">No gigs found</p>
                <p className="mb-4 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveFormat("All Formats"); setEloRange("Any ELO"); setUni("Any University"); }} className="text-sm text-foreground underline">Clear all filters</button>
              </div>
            )}
          </section>

          {/* ═══ SECTION 5: AUCTION LISTINGS ═══ */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <div className="mb-4 flex items-center gap-2">
              <Gavel size={18} className="text-badge-gold" />
              <h2 className="font-heading text-xl font-bold text-foreground">Live Auctions</h2>
              <span className="rounded-full bg-badge-gold/10 px-2 py-0.5 text-[10px] font-semibold text-badge-gold">{auctionGigs.length} ACTIVE</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {auctionGigs.map((g) => (
                <AuctionCard key={g.id} gig={{ ...g, bids: Math.floor(Math.random() * 12) + 3, timeLeft: Math.floor(Math.random() * 300) + 60 }} />
              ))}
            </div>
          </motion.section>

          {/* ═══ SECTION 6: CO-CREATION PROJECTS ═══ */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <div className="mb-4 flex items-center gap-2">
              <Layers size={18} className="text-court-blue" />
              <h2 className="font-heading text-xl font-bold text-foreground">Co-Creation Projects</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coCreationGigs.map((gig) => {
                const roles = [
                  { name: gig.skill, filled: true },
                  { name: gig.wants, filled: false },
                  { name: "Project Manager", filled: Math.random() > 0.5 },
                ];
                return (
                  <motion.div key={gig.id} whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-court-blue/30">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-court-blue/10 px-2 py-0.5 text-[10px] font-semibold text-court-blue">CO-CREATION</span>
                      <span className="text-[10px] text-muted-foreground">{gig.posted}</span>
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill} + {gig.wants}</h4>
                    <p className="mb-4 text-xs text-muted-foreground">Multi-skill project by {gig.seller}</p>
                    <div className="mb-3 space-y-2">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Roles</p>
                      {roles.map((r) => (
                        <div key={r.name} className="flex items-center justify-between rounded-lg bg-surface-1 px-3 py-2">
                          <span className="text-xs text-foreground">{r.name}</span>
                          {r.filled ? (
                            <span className="flex items-center gap-1 text-[10px] text-skill-green"><CheckCircle2 size={10} /> Filled</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-badge-gold"><Plus size={10} /> Open</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 flex-1 rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-court-blue" style={{ width: `${(roles.filter(r => r.filled).length / roles.length) * 100}%` }} />
                      </div>
                      <span className="ml-2 text-[10px] text-muted-foreground">{roles.filter(r => r.filled).length}/{roles.length} filled</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ═══ SECTION 7: FLASH MARKET ═══ */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={18} className="text-badge-gold" />
              <h2 className="font-heading text-xl font-bold text-foreground">Flash Market</h2>
              <span className="rounded-full bg-badge-gold/10 px-2 py-0.5 text-[10px] font-semibold text-badge-gold">BONUS SP</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flashGigs.map((gig) => {
                const multiplier = (Math.random() * 1.5 + 1.5).toFixed(1);
                return (
                  <motion.div key={gig.id} whileHover={{ y: -4 }} className="relative rounded-2xl border border-badge-gold/20 bg-card p-5 transition-all hover:border-badge-gold/40">
                    <div className="absolute -right-1 -top-1 rounded-full bg-badge-gold px-2 py-0.5 text-[10px] font-bold text-background">{multiplier}x SP</div>
                    <div className="mb-3 flex items-center gap-2">
                      <Zap size={12} className="text-badge-gold" />
                      <span className="text-[10px] font-semibold text-badge-gold">FLASH DEAL</span>
                      <div className="ml-auto flex items-center gap-1 text-[10px] text-alert-red">
                        <Timer size={10} />
                        Limited time
                      </div>
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
                    <p className="mb-3 text-xs text-muted-foreground">Wants: {gig.wants}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-foreground">{gig.avatar}</div>
                      <span className="text-xs text-foreground">{gig.seller}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1.5 text-xs font-semibold text-skill-green">
                      <Rocket size={12} />+{gig.points} SP (×{multiplier} bonus!)
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ═══ SECTION 8: RECOMMENDED FOR YOU ═══ */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-badge-gold" />
              <h2 className="font-heading text-xl font-bold text-foreground">Recommended For You</h2>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">AI-curated</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedGigs.map((gig) => {
                const tier = eloTier(gig.elo);
                const matchScore = Math.floor(Math.random() * 15) + 85;
                return (
                  <motion.div key={gig.id} whileHover={{ y: -4 }} onClick={() => setSelectedGig(gig)} className="cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[10px] font-semibold text-skill-green">{matchScore}% Match</span>
                      <Crown size={12} className="text-badge-gold" />
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
                    <p className="mb-3 text-xs text-muted-foreground">↔ {gig.wants}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-foreground">{gig.avatar}</div>
                      <span className="text-xs text-foreground">{gig.seller}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tier.bg} ${tier.color}`}>{tier.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Load More */}
          <div className="text-center">
            <motion.button className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Load More Gigs <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>

        {/* ═══ QUICK VIEW MODAL ═══ */}
        <AnimatePresence>
          {selectedGig && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9990] flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center" onClick={() => setSelectedGig(null)}>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl"
              >
                <button onClick={() => setSelectedGig(null)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 font-mono text-lg font-bold text-foreground">{selectedGig.avatar}</div>
                  <div>
                    <p className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                      {selectedGig.seller}
                      {selectedGig.verified && <CheckCircle2 size={14} className="text-skill-green" />}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${eloTier(selectedGig.elo).color}`}>{eloTier(selectedGig.elo).label} · ELO {selectedGig.elo}</span>
                      <Star size={11} className="fill-badge-gold text-badge-gold" />
                      <span className="text-xs text-badge-gold">{selectedGig.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="rounded-xl bg-surface-2 p-4">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Offering</span>
                    <p className="text-base font-bold text-foreground">{selectedGig.skill}</p>
                  </div>
                  <div className="rounded-xl border border-dashed border-border p-4">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Wants</span>
                    <p className="text-base font-bold text-foreground/80">{selectedGig.wants}</p>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{selectedGig.desc}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">{selectedGig.format}</span>
                  <span className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground"><Clock size={10} />{selectedGig.posted}</span>
                  <span className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground"><Eye size={10} />{selectedGig.views} views</span>
                  {selectedGig.uni && <span className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground"><GraduationCap size={10} />{selectedGig.uni}</span>}
                </div>

                {selectedGig.points > 0 && (
                  <div className="mb-4 flex items-center gap-1.5 rounded-xl bg-skill-green/10 px-4 py-2.5 text-sm font-semibold text-skill-green">
                    <TrendingUp size={14} />+{selectedGig.points} SP to balance
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <MessageSquare size={14} /> Propose Swap
                  </motion.button>
                  <motion.button onClick={(e) => { e.stopPropagation(); toggleLike(selectedGig.id); }} className="flex items-center justify-center rounded-xl border border-border px-4 text-muted-foreground hover:text-alert-red" whileHover={{ scale: 1.02 }}>
                    <Heart size={16} className={liked.has(selectedGig.id) ? "fill-alert-red text-alert-red" : ""} />
                  </motion.button>
                  <motion.button className="flex items-center justify-center rounded-xl border border-border px-4 text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.02 }}>
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default MarketplacePage;
