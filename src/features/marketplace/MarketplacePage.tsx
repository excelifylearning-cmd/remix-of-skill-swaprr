import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3,
  Filter, Flame, ArrowUpDown, Users, Clock, Zap, ArrowRight, Eye,
  X, Gavel, Sparkles, Timer, Shield, ChevronDown, Grid3X3, List,
  Heart, Share2, MessageSquare, BookOpen, Layers, Music, Camera,
  Globe, Cpu, Megaphone, GraduationCap, Trophy, Target, Plus,
  AlertCircle, CheckCircle2, Rocket, Crown, Home, Compass, Award,
  Briefcase, LayoutGrid, ChevronLeft, ChevronRight, SlidersHorizontal,
  MapPin, ExternalLink, Play
} from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";

/* ─── DATA ─── */

const categories = [
  { label: "All", icon: LayoutGrid, count: 30 },
  { label: "Design", icon: Palette, count: 10 },
  { label: "Development", icon: Code, count: 9 },
  { label: "Writing", icon: PenTool, count: 5 },
  { label: "Video", icon: Video, count: 5 },
  { label: "Marketing", icon: BarChart3, count: 3 },
  { label: "Music", icon: Music, count: 2 },
  { label: "Photography", icon: Camera, count: 2 },
];

const sidebarNav = [
  { label: "Explore", icon: Compass, section: "explore" },
  { label: "Trending", icon: Flame, section: "trending" },
  { label: "Auctions", icon: Gavel, section: "auctions" },
  { label: "Co-Creation", icon: Layers, section: "cocreation" },
  { label: "Flash Market", icon: Zap, section: "flash" },
  { label: "For You", icon: Sparkles, section: "recommended" },
];

const formats = ["All Formats", "Direct Swap", "Auction", "Co-Creation", "Flash Market", "Skill Fusion", "Projects"];
const sortOptions = ["Trending", "Newest", "Highest ELO", "Most Points", "Most Views"];
const eloRanges = ["Any ELO", "Bronze (0-1299)", "Silver (1300-1499)", "Gold (1500-1699)", "Diamond (1700+)"];

const gigs = [
  { id: 1, skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, format: "Direct Swap", posted: "2h ago", views: 124, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. I specialize in minimal, modern brand identities." },
  { id: 2, skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 89, uni: "Stanford", verified: true, desc: "Full-stack Python/Django backend development. REST APIs, database design, and deployment." },
  { id: 3, skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 67, uni: "Harvard", verified: true, desc: "Professional video editing using Premiere Pro and After Effects." },
  { id: 4, skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true, format: "Co-Creation", posted: "1h ago", views: 203, uni: "Georgia Tech", verified: true, desc: "Blender & Maya 3D modeling for games, AR/VR, and product visualization." },
  { id: 5, skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, format: "Direct Swap", posted: "8h ago", views: 45, uni: "UC Berkeley", verified: false, desc: "Data-driven SEO strategy including keyword research and analytics." },
  { id: 6, skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, format: "Skill Fusion", posted: "30m ago", views: 312, uni: "MIT", verified: true, desc: "Advanced data analysis with Python, R, and Tableau." },
  { id: 7, skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false, format: "Direct Swap", posted: "12h ago", views: 78, uni: "", verified: false, desc: "Digital illustration — editorial, children's book, and character design." },
  { id: 8, skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, format: "Auction", posted: "3h ago", views: 156, uni: "Stanford", verified: true, desc: "Cinema 4D and After Effects motion graphics for explainers and ads." },
  { id: 9, skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false, format: "Direct Swap", posted: "1d ago", views: 34, uni: "", verified: false, desc: "SEO-optimized blog writing for tech, lifestyle, and business." },
  { id: 10, skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true, format: "Flash Market", posted: "45m ago", views: 234, uni: "Harvard", verified: true, desc: "Facebook, Instagram, and TikTok ad campaigns with proven ROI." },
  { id: 11, skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, format: "Projects", posted: "15m ago", views: 445, uni: "MIT", verified: true, desc: "Cross-platform mobile apps with React Native. Published 5 apps." },
  { id: 12, skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Photography", hot: false, format: "Direct Swap", posted: "5h ago", views: 92, uni: "", verified: false, desc: "Studio and lifestyle product photography with professional retouching." },
  { id: 13, skill: "UX Research", wants: "Data Viz", points: 15, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: false, format: "Co-Creation", posted: "7h ago", views: 110, uni: "Stanford", verified: true, desc: "User research, usability testing, and persona development." },
  { id: 14, skill: "Technical Writing", wants: "Frontend Dev", points: 20, seller: "Sam D.", elo: 1350, rating: 4.6, avatar: "SD", category: "Writing", hot: false, format: "Direct Swap", posted: "9h ago", views: 56, uni: "Georgia Tech", verified: true, desc: "API documentation and user guides for SaaS products." },
  { id: 15, skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", category: "Design", hot: true, format: "Skill Fusion", posted: "2h ago", views: 178, uni: "UC Berkeley", verified: true, desc: "Game mechanics design, level design, and balancing for indie games." },
  { id: 16, skill: "API Development", wants: "Illustration", points: 35, seller: "Dev K.", elo: 1660, rating: 5.0, avatar: "DK", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 98, uni: "MIT", verified: true, desc: "RESTful and GraphQL API development with Node.js, Go, or Python." },
  { id: 17, skill: "Podcast Editing", wants: "Thumbnail Design", points: 10, seller: "Zara N.", elo: 1280, rating: 4.5, avatar: "ZN", category: "Video", hot: false, format: "Flash Market", posted: "11h ago", views: 41, uni: "", verified: false, desc: "Podcast editing including noise removal, EQ, and show notes." },
  { id: 18, skill: "Content Strategy", wants: "App Prototype", points: 40, seller: "Leo R.", elo: 1440, rating: 4.7, avatar: "LR", category: "Writing", hot: false, format: "Projects", posted: "6h ago", views: 87, uni: "Harvard", verified: true, desc: "Content strategy for startups — editorial calendars and voice guides." },
  { id: 19, skill: "Music Production", wants: "Video Editing", points: 30, seller: "DJ Kael", elo: 1530, rating: 4.9, avatar: "DK", category: "Music", hot: true, format: "Direct Swap", posted: "1h ago", views: 189, uni: "", verified: false, desc: "Beat production, mixing, and mastering across genres." },
  { id: 20, skill: "Brand Photography", wants: "Social Media Mgmt", points: 20, seller: "Iris V.", elo: 1410, rating: 4.7, avatar: "IV", category: "Photography", hot: false, format: "Auction", posted: "3h ago", views: 73, uni: "", verified: false, desc: "Brand and lifestyle photography for e-commerce and campaigns." },
  { id: 21, skill: "Machine Learning", wants: "UX Design", points: 55, seller: "Victor Z.", elo: 1780, rating: 5.0, avatar: "VZ", category: "Development", hot: true, format: "Skill Fusion", posted: "20m ago", views: 521, uni: "MIT", verified: true, desc: "ML model development, NLP, computer vision. Published researcher." },
  { id: 22, skill: "Songwriting", wants: "Graphic Design", points: 15, seller: "Melody P.", elo: 1340, rating: 4.6, avatar: "MP", category: "Music", hot: false, format: "Direct Swap", posted: "8h ago", views: 62, uni: "", verified: false, desc: "Original songwriting for commercials, indie films, and projects." },
  { id: 23, skill: "Infographic Design", wants: "Python Scripts", points: 20, seller: "Tara J.", elo: 1470, rating: 4.8, avatar: "TJ", category: "Design", hot: false, format: "Direct Swap", posted: "5h ago", views: 88, uni: "UC Berkeley", verified: true, desc: "Data visualization and infographic design for reports." },
  { id: 24, skill: "Cloud Architecture", wants: "Brand Strategy", points: 60, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, format: "Projects", posted: "10m ago", views: 634, uni: "Stanford", verified: true, desc: "AWS/GCP cloud architecture, DevOps pipelines, and IaC." },
  { id: 25, skill: "Copywriting", wants: "Motion Graphics", points: 15, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, format: "Flash Market", posted: "2h ago", views: 94, uni: "Harvard", verified: true, desc: "Conversion-focused copywriting for landing pages and emails." },
  { id: 26, skill: "Digital Ads", wants: "App Development", points: 25, seller: "Rita G.", elo: 1480, rating: 4.8, avatar: "RG", category: "Marketing", hot: false, format: "Co-Creation", posted: "4h ago", views: 112, uni: "Georgia Tech", verified: true, desc: "Google Ads and Meta Ads with A/B testing and optimization." },
  { id: 27, skill: "Figma Prototyping", wants: "Backend Dev", points: 30, seller: "Suki T.", elo: 1540, rating: 4.9, avatar: "ST", category: "Design", hot: true, format: "Direct Swap", posted: "1h ago", views: 201, uni: "MIT", verified: true, desc: "High-fidelity Figma prototypes with interactive design systems." },
  { id: 28, skill: "Video Production", wants: "Data Analysis", points: 35, seller: "Finn B.", elo: 1590, rating: 4.9, avatar: "FB", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 143, uni: "Stanford", verified: true, desc: "End-to-end video production — scripting, filming, and grading." },
  { id: 29, skill: "Cybersecurity Audit", wants: "Design System", points: 45, seller: "Hack M.", elo: 1700, rating: 5.0, avatar: "HM", category: "Development", hot: true, format: "Skill Fusion", posted: "45m ago", views: 387, uni: "Caltech", verified: true, desc: "Penetration testing and security hardening for web apps." },
  { id: 30, skill: "Typography Design", wants: "SEO Strategy", points: 20, seller: "Vera L.", elo: 1430, rating: 4.7, avatar: "VL", category: "Design", hot: false, format: "Direct Swap", posted: "7h ago", views: 69, uni: "UC Berkeley", verified: false, desc: "Custom typeface design for brand identities." },
];

const aiSuggestions = [
  "Design a logo for my startup",
  "Build a React dashboard",
  "Edit a YouTube video",
  "Write blog posts for SaaS",
  "Create social media ads",
  "Build a mobile app",
];

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10", border: "border-court-blue/20" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10", border: "border-badge-gold/20" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2", border: "border-border" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" };
};

const formatIcon = (format: string) => {
  switch (format) {
    case "Auction": return Gavel;
    case "Co-Creation": return Layers;
    case "Flash Market": return Zap;
    case "Skill Fusion": return Sparkles;
    case "Projects": return Briefcase;
    default: return ArrowRight;
  }
};

const formatColor = (format: string) => {
  switch (format) {
    case "Auction": return "text-badge-gold bg-badge-gold/10 border-badge-gold/20";
    case "Co-Creation": return "text-court-blue bg-court-blue/10 border-court-blue/20";
    case "Flash Market": return "text-badge-gold bg-badge-gold/10 border-badge-gold/20";
    case "Skill Fusion": return "text-skill-green bg-skill-green/10 border-skill-green/20";
    case "Projects": return "text-foreground bg-surface-2 border-border";
    default: return "text-muted-foreground bg-surface-2 border-border";
  }
};

/* ─── COUNTDOWN ─── */
const useCountdown = (minutes: number) => {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const iv = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

/* ─── GIG CARD ─── */
const GigCard = ({ gig, liked, toggleLike, onClick }: {
  gig: typeof gigs[0];
  liked: Set<number>;
  toggleLike: (id: number) => void;
  onClick: () => void;
}) => {
  const tier = eloTier(gig.elo);
  const FmtIcon = formatIcon(gig.format);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground/15 hover:shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.08)]"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${formatColor(gig.format)}`}>
          <FmtIcon size={10} />
          {gig.format}
        </div>
        <div className="flex items-center gap-2">
          {gig.hot && (
            <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-1.5 py-0.5 text-[10px] text-alert-red">
              <Flame size={9} /> Hot
            </span>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground/60 hover:text-alert-red transition-colors">
            <Heart size={13} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Offering / Wants */}
        <div className="mb-3 space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-skill-green/10">
              <ArrowRight size={10} className="text-skill-green" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Offering</p>
              <p className="text-sm font-semibold text-foreground leading-tight">{gig.skill}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-court-blue/10">
              <Target size={10} className="text-court-blue" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Looking for</p>
              <p className="text-sm font-medium text-foreground/70 leading-tight">{gig.wants}</p>
            </div>
          </div>
        </div>

        {/* Seller row */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${tier.border} ${tier.bg} font-mono text-[10px] font-bold ${tier.color}`}>
            {gig.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-xs font-medium text-foreground truncate">
              {gig.seller}
              {gig.verified && <CheckCircle2 size={10} className="text-skill-green shrink-0" />}
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-medium ${tier.color}`}>{tier.label}</span>
              <span className="text-muted-foreground/30">·</span>
              <Star size={9} className="fill-badge-gold text-badge-gold" />
              <span className="text-[10px] text-badge-gold">{gig.rating}</span>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
          <span className="flex items-center gap-0.5"><Clock size={9} />{gig.posted}</span>
          <span className="flex items-center gap-0.5"><Eye size={9} />{gig.views}</span>
          {gig.uni && <span className="flex items-center gap-0.5"><GraduationCap size={9} />{gig.uni}</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-2.5">
        {gig.points > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-skill-green">+{gig.points} SP</span>
            <span className="text-[10px] text-muted-foreground/50">to balance exchange</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60">Equal value exchange</span>
        )}
      </div>
    </motion.div>
  );
};

/* ─── AUCTION CARD ─── */
const AuctionCard = ({ gig }: { gig: typeof gigs[0] & { bids?: number; timeLeft?: number } }) => {
  const tier = eloTier(gig.elo);
  const countdown = useCountdown(gig.timeLeft || 120);
  return (
    <motion.div whileHover={{ y: -3 }} className="min-w-[300px] rounded-2xl border border-badge-gold/20 bg-card transition-all hover:border-badge-gold/40 hover:shadow-[0_0_30px_-10px_hsl(var(--badge-gold)/0.15)]">
      <div className="flex items-center justify-between border-b border-badge-gold/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <Gavel size={12} className="text-badge-gold" />
          <span className="text-[10px] font-bold text-badge-gold tracking-wider">LIVE AUCTION</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5">
          <Timer size={9} className="text-alert-red animate-pulse" />
          <span className="font-mono text-[10px] font-semibold text-alert-red">{countdown}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
        <p className="mb-3 text-xs text-muted-foreground">↔ {gig.wants}</p>
        <div className="mb-3 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tier.bg} text-[10px] font-bold ${tier.color}`}>{gig.avatar}</div>
          <span className="text-xs font-medium text-foreground">{gig.seller}</span>
          {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-1 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{gig.bids || 5} bids</span>
          </div>
          <span className="text-xs font-bold text-skill-green">+{gig.points} SP</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MAIN ─── */
const MarketplacePage = () => {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFormat, setActiveFormat] = useState("All Formats");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("Trending");
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [eloRange, setEloRange] = useState("Any ELO");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedGig, setSelectedGig] = useState<typeof gigs[0] | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("explore");
  const [searchFocused, setSearchFocused] = useState(false);

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
    return matchCat && matchFormat && matchSearch && matchElo;
  });

  const trendingGigs = gigs.filter((g) => g.hot).sort((a, b) => b.views - a.views);
  const auctionGigs = gigs.filter((g) => g.format === "Auction");
  const coCreationGigs = gigs.filter((g) => g.format === "Co-Creation");
  const flashGigs = gigs.filter((g) => g.format === "Flash Market");
  const recommendedGigs = gigs.filter((g) => g.elo >= 1500 && g.verified).slice(0, 6);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(`mp-${section}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">

        {/* ═══ SIDEBAR ═══ */}
        <motion.aside
          animate={{ width: sidebarOpen ? 240 : 64 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card"
        >
          {/* Logo area */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            {sidebarOpen && (
              <Link to="/" className="font-heading text-lg font-bold text-foreground">
                Skill<span className="text-muted-foreground">Swappr</span>
              </Link>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="mb-2">
              {sidebarOpen && <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Browse</p>}
              {sidebarNav.map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    activeSection === item.section
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <item.icon size={16} className="shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            {sidebarOpen && (
              <div className="mt-4">
                <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Categories</p>
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => { setActiveCategory(cat.label); scrollToSection("explore"); }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                      activeCategory === cat.label
                        ? "bg-surface-2 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon size={14} />
                      {cat.label}
                    </span>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </nav>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="border-t border-border p-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90"
              >
                <Plus size={14} />
                Post a Gig
              </Link>
            </div>
          )}
        </motion.aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? 240 : 64 }}
        >
          {/* ═══ HERO / SEARCH HEADER ═══ */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6">
              {/* Top bar */}
              <div className="flex h-16 items-center gap-4">
                {/* Search */}
                <div className={`relative flex-1 transition-all duration-200 ${searchFocused ? "max-w-2xl" : "max-w-xl"}`}>
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder='Search skills, sellers, or gig types...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="h-10 w-full rounded-xl border border-border bg-surface-1 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowFilters(!showFilters)} className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs transition-all ${showFilters ? "border-foreground/20 bg-surface-2 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    <SlidersHorizontal size={13} /> Filters
                  </button>

                  <div className="relative">
                    <button onClick={() => setShowSort(!showSort)} className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-muted-foreground hover:text-foreground">
                      <ArrowUpDown size={13} /> {sort}
                    </button>
                    {showSort && (
                      <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                        {sortOptions.map((s) => (
                          <button key={s} onClick={() => { setSort(s); setShowSort(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${sort === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-0.5 rounded-lg border border-border bg-card p-0.5">
                    <button onClick={() => setView("grid")} className={`rounded-md p-1.5 ${view === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}><Grid3X3 size={13} /></button>
                    <button onClick={() => setView("list")} className={`rounded-md p-1.5 ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}><List size={13} /></button>
                  </div>
                </div>
              </div>

              {/* AI chips */}
              <AnimatePresence>
                {(searchFocused || searchQuery) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Sparkles size={12} className="text-badge-gold shrink-0" />
                      {aiSuggestions.map((s) => (
                        <button key={s} onClick={() => setSearchQuery(s)} className="rounded-full border border-border bg-surface-1 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border/50">
                    <div className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Format</label>
                        <div className="flex flex-wrap gap-1">
                          {formats.map((f) => (
                            <button key={f} onClick={() => setActiveFormat(f)} className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${activeFormat === f ? "bg-foreground text-background font-medium" : "bg-surface-1 text-muted-foreground hover:text-foreground"}`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">ELO Range</label>
                        <div className="flex flex-wrap gap-1">
                          {eloRanges.map((e) => (
                            <button key={e} onClick={() => setEloRange(e)} className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${eloRange === e ? "bg-foreground text-background font-medium" : "bg-surface-1 text-muted-foreground hover:text-foreground"}`}>
                              {e.split(" (")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button onClick={() => { setActiveFormat("All Formats"); setEloRange("Any ELO"); setActiveCategory("All"); setSearchQuery(""); }} className="rounded-lg bg-surface-1 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                          Clear All
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-8">

            {/* ═══ HERO BANNER ═══ */}
            <motion.div
              id="mp-explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-1 via-card to-surface-2"
            >
              <div className="grid lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-skill-green/10">
                      <div className="h-2 w-2 rounded-full bg-skill-green animate-pulse" />
                    </div>
                    <span className="text-xs font-medium text-skill-green">{gigs.length} active gigs · 1,240 users online</span>
                  </div>
                  <h1 className="mb-3 font-heading text-3xl font-black text-foreground lg:text-4xl leading-tight">
                    Find your perfect<br />skill exchange
                  </h1>
                  <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-md">
                    Browse {gigs.length}+ active gigs across design, development, writing, video and more. 
                    Trade skills, earn points, and build your portfolio.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={isAuthenticated ? "#" : "/signup"} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90">
                      <Plus size={14} /> Post a Gig
                    </Link>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Play size={14} /> How it works
                    </button>
                  </div>
                </div>
                <div className="hidden lg:flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {[
                      { val: "89K+", label: "Swaps Done", icon: Trophy, color: "text-badge-gold" },
                      { val: "99.2%", label: "Satisfaction", icon: Shield, color: "text-skill-green" },
                      { val: "4.9★", label: "Avg Rating", icon: Star, color: "text-badge-gold" },
                      { val: "12K+", label: "Users", icon: Users, color: "text-court-blue" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border border-border bg-card/80 p-4 text-center backdrop-blur">
                        <s.icon size={18} className={`mx-auto mb-2 ${s.color}`} />
                        <p className="font-heading text-xl font-black text-foreground">{s.val}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ═══ TRENDING SECTION ═══ */}
            <section id="mp-trending" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-alert-red/10">
                    <Flame size={16} className="text-alert-red" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Trending Now</h2>
                    <p className="text-[11px] text-muted-foreground">Most viewed gigs right now</p>
                  </div>
                  <span className="ml-2 flex items-center gap-1 rounded-full bg-alert-red/10 px-2 py-0.5 text-[10px] font-bold text-alert-red">
                    <div className="h-1.5 w-1.5 rounded-full bg-alert-red animate-pulse" /> LIVE
                  </span>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {trendingGigs.map((gig) => (
                  <div key={gig.id} className="min-w-[280px] max-w-[280px]">
                    <GigCard gig={gig} liked={liked} toggleLike={toggleLike} onClick={() => setSelectedGig(gig)} />
                  </div>
                ))}
              </div>
            </section>

            {/* ═══ LIVE AUCTIONS ═══ */}
            <section id="mp-auctions" className="mb-12">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-badge-gold/10">
                  <Gavel size={16} className="text-badge-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Live Auctions</h2>
                  <p className="text-[11px] text-muted-foreground">{auctionGigs.length} active auctions · Submit your best work</p>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {auctionGigs.map((g) => (
                  <AuctionCard key={g.id} gig={{ ...g, bids: Math.floor(Math.random() * 10) + 3, timeLeft: Math.floor(Math.random() * 180) + 30 }} />
                ))}
              </div>
            </section>

            {/* ═══ CO-CREATION ═══ */}
            <section id="mp-cocreation" className="mb-12">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-court-blue/10">
                  <Layers size={16} className="text-court-blue" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Co-Creation Projects</h2>
                  <p className="text-[11px] text-muted-foreground">Join multi-person projects · Collaborate in shared workspaces</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coCreationGigs.map((gig) => {
                  const roles = [
                    { name: gig.skill, filled: true },
                    { name: gig.wants, filled: false },
                    { name: "Project Manager", filled: Math.random() > 0.5 },
                  ];
                  const filledCount = roles.filter(r => r.filled).length;
                  return (
                    <motion.div key={gig.id} whileHover={{ y: -3 }} className="rounded-2xl border border-court-blue/15 bg-card transition-all hover:border-court-blue/30 hover:shadow-[0_0_30px_-10px_hsl(var(--court-blue)/0.1)]">
                      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-court-blue tracking-wider">
                          <Layers size={10} /> CO-CREATION
                        </span>
                        <span className="text-[10px] text-muted-foreground">{gig.posted}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill} + {gig.wants}</h4>
                        <p className="mb-4 text-xs text-muted-foreground">by {gig.seller}</p>
                        <div className="mb-3 space-y-1.5">
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
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden">
                            <div className="h-full rounded-full bg-court-blue transition-all" style={{ width: `${(filledCount / roles.length) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{filledCount}/{roles.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ═══ FLASH MARKET ═══ */}
            <section id="mp-flash" className="mb-12">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-badge-gold/10">
                  <Zap size={16} className="text-badge-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Flash Market</h2>
                  <p className="text-[11px] text-muted-foreground">Limited-time gigs with bonus SP multipliers</p>
                </div>
                <span className="ml-2 rounded-full bg-badge-gold/10 px-2 py-0.5 text-[10px] font-bold text-badge-gold">BONUS SP</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {flashGigs.map((gig) => {
                  const multiplier = (Math.random() * 1.5 + 1.5).toFixed(1);
                  return (
                    <motion.div key={gig.id} whileHover={{ y: -3 }} className="relative rounded-2xl border border-badge-gold/15 bg-card transition-all hover:border-badge-gold/30 hover:shadow-[0_0_30px_-10px_hsl(var(--badge-gold)/0.1)]">
                      <div className="absolute -right-1.5 -top-1.5 z-10 rounded-lg bg-badge-gold px-2 py-0.5 text-[10px] font-bold text-background shadow-lg">{multiplier}x SP</div>
                      <div className="flex items-center justify-between border-b border-badge-gold/10 px-4 py-2.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-badge-gold tracking-wider">
                          <Zap size={10} /> FLASH DEAL
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-alert-red">
                          <Timer size={9} className="animate-pulse" />
                          Limited
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="mb-1 text-sm font-bold text-foreground">{gig.skill}</h4>
                        <p className="mb-3 text-xs text-muted-foreground">↔ {gig.wants}</p>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 text-[10px] font-bold text-foreground">{gig.avatar}</div>
                          <span className="text-xs font-medium text-foreground">{gig.seller}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl bg-skill-green/10 px-3 py-2 text-xs font-bold text-skill-green">
                          <Rocket size={12} /> +{gig.points} SP (×{multiplier} bonus!)
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ═══ RECOMMENDED FOR YOU ═══ */}
            <section id="mp-recommended" className="mb-12">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-skill-green/10">
                  <Sparkles size={16} className="text-skill-green" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Recommended For You</h2>
                  <p className="text-[11px] text-muted-foreground">AI-curated matches based on your profile</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedGigs.map((gig) => {
                  const matchScore = Math.floor(Math.random() * 15) + 85;
                  return (
                    <div key={gig.id} className="relative">
                      <div className="absolute -top-1.5 left-4 z-10 rounded-lg bg-skill-green px-2 py-0.5 text-[10px] font-bold text-background shadow-lg">{matchScore}% Match</div>
                      <GigCard gig={gig} liked={liked} toggleLike={toggleLike} onClick={() => setSelectedGig(gig)} />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ═══ ALL GIGS GRID ═══ */}
            <section className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-2">
                    <Globe size={16} className="text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">All Gigs</h2>
                    <p className="text-[11px] text-muted-foreground">{filtered.length} results{activeCategory !== "All" ? ` in ${activeCategory}` : ""}</p>
                  </div>
                </div>
              </div>

              {view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((gig) => (
                      <GigCard key={gig.id} gig={gig} liked={liked} toggleLike={toggleLike} onClick={() => setSelectedGig(gig)} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((gig) => {
                      const tier = eloTier(gig.elo);
                      return (
                        <motion.div
                          key={gig.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setSelectedGig(gig)}
                          className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-foreground/15"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tier.border} ${tier.bg} font-mono text-xs font-bold ${tier.color}`}>{gig.avatar}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-foreground">{gig.skill}</p>
                              <ArrowRight size={10} className="shrink-0 text-muted-foreground/40" />
                              <p className="truncate text-sm text-muted-foreground">{gig.wants}</p>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-xs text-foreground">{gig.seller}</span>
                              {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
                              <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
                              <span className="text-[10px] text-muted-foreground">{gig.posted}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-medium ${formatColor(gig.format)}`}>{gig.format}</span>
                            {gig.points > 0 && <span className="text-xs font-bold text-skill-green">+{gig.points} SP</span>}
                            {gig.hot && <Flame size={12} className="text-alert-red" />}
                            <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground hover:text-alert-red">
                              <Heart size={13} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <AlertCircle size={32} className="mx-auto mb-3 text-muted-foreground/30" />
                  <p className="mb-1 text-foreground font-medium">No gigs found</p>
                  <p className="mb-4 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                  <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveFormat("All Formats"); setEloRange("Any ELO"); }} className="text-sm text-foreground underline underline-offset-4">Clear all filters</button>
                </div>
              )}
            </section>

            {/* Load More */}
            <div className="mb-16 text-center">
              <motion.button className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                Load More Gigs <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </main>

        {/* ═══ QUICK VIEW MODAL ═══ */}
        <AnimatePresence>
          {selectedGig && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center" onClick={() => setSelectedGig(null)}>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl"
              >
                <button onClick={() => setSelectedGig(null)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-muted-foreground hover:text-foreground"><X size={16} /></button>

                {/* Seller */}
                <div className="mb-6 flex items-center gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${eloTier(selectedGig.elo).border} ${eloTier(selectedGig.elo).bg} font-mono text-lg font-bold ${eloTier(selectedGig.elo).color}`}>{selectedGig.avatar}</div>
                  <div>
                    <p className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                      {selectedGig.seller}
                      {selectedGig.verified && <CheckCircle2 size={14} className="text-skill-green" />}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${eloTier(selectedGig.elo).color}`}>{eloTier(selectedGig.elo).label} · ELO {selectedGig.elo}</span>
                      <Star size={11} className="fill-badge-gold text-badge-gold" />
                      <span className="text-xs font-medium text-badge-gold">{selectedGig.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Offering / Wants */}
                <div className="mb-4 space-y-2">
                  <div className="rounded-xl bg-skill-green/5 border border-skill-green/10 p-4">
                    <span className="text-[10px] uppercase tracking-widest text-skill-green/60">Offering</span>
                    <p className="text-base font-bold text-foreground">{selectedGig.skill}</p>
                  </div>
                  <div className="rounded-xl bg-court-blue/5 border border-court-blue/10 p-4">
                    <span className="text-[10px] uppercase tracking-widest text-court-blue/60">Looking for</span>
                    <p className="text-base font-bold text-foreground/80">{selectedGig.wants}</p>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{selectedGig.desc}</p>

                <div className="mb-6 flex flex-wrap gap-1.5">
                  <span className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${formatColor(selectedGig.format)}`}>
                    {(() => { const Icon = formatIcon(selectedGig.format); return <Icon size={10} />; })()}
                    {selectedGig.format}
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-surface-1 px-2.5 py-1 text-[11px] text-muted-foreground"><Clock size={10} />{selectedGig.posted}</span>
                  <span className="flex items-center gap-1 rounded-lg bg-surface-1 px-2.5 py-1 text-[11px] text-muted-foreground"><Eye size={10} />{selectedGig.views}</span>
                  {selectedGig.uni && <span className="flex items-center gap-1 rounded-lg bg-surface-1 px-2.5 py-1 text-[11px] text-muted-foreground"><GraduationCap size={10} />{selectedGig.uni}</span>}
                </div>

                {selectedGig.points > 0 && (
                  <div className="mb-4 flex items-center gap-1.5 rounded-xl bg-skill-green/10 border border-skill-green/15 px-4 py-2.5 text-sm font-bold text-skill-green">
                    <TrendingUp size={14} />+{selectedGig.points} SP to balance exchange
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <MessageSquare size={14} /> Propose Swap
                  </motion.button>
                  <motion.button onClick={(e) => { e.stopPropagation(); toggleLike(selectedGig.id); }} className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-alert-red" whileHover={{ scale: 1.02 }}>
                    <Heart size={16} className={liked.has(selectedGig.id) ? "fill-alert-red text-alert-red" : ""} />
                  </motion.button>
                  <motion.button className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground" whileHover={{ scale: 1.02 }}>
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default MarketplacePage;
