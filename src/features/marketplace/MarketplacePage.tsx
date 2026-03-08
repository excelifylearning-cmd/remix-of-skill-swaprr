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
  MapPin, ExternalLink, Play, Handshake, GitMerge, Coins, CalendarDays,
  ThumbsUp, Send, Bookmark, CircleDot, Wand2, Building2, Laptop,
  FileText, Boxes, Workflow, HandHeart, Medal, CircleDollarSign, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA MODELS
───────────────────────────────────────────────────────────────────────────── */

const categories = [
  { label: "All", icon: LayoutGrid, count: 48, color: "text-foreground" },
  { label: "Design", icon: Palette, count: 14, color: "text-pink-400" },
  { label: "Development", icon: Code, count: 12, color: "text-court-blue" },
  { label: "Writing", icon: PenTool, count: 7, color: "text-orange-400" },
  { label: "Video", icon: Video, count: 6, color: "text-red-400" },
  { label: "Marketing", icon: BarChart3, count: 5, color: "text-skill-green" },
  { label: "Music", icon: Music, count: 2, color: "text-purple-400" },
  { label: "Photography", icon: Camera, count: 2, color: "text-amber-400" },
];

const sidebarNav = [
  { label: "Explore", icon: Compass, section: "explore", badge: null },
  { label: "Trending", icon: Flame, section: "trending", badge: "HOT" },
  { label: "SP Only", icon: CircleDollarSign, section: "sp-only", badge: "BUY" },
  { label: "Auctions", icon: Gavel, section: "auctions", badge: "LIVE" },
  { label: "Co-Creation", icon: Layers, section: "cocreation", badge: null },
  { label: "Skill Fusion", icon: GitMerge, section: "fusion", badge: "NEW" },
  { label: "Projects", icon: Briefcase, section: "projects", badge: null },
  { label: "Flash Market", icon: Zap, section: "flash", badge: "2.5x" },
  { label: "Request Board", icon: HandHeart, section: "requests", badge: null },
  { label: "For You", icon: Sparkles, section: "recommended", badge: "AI" },
];

const formats = ["All Formats", "Direct Swap", "SP Only", "Auction", "Co-Creation", "Skill Fusion", "Projects", "Flash Market"];
const sortOptions = ["Trending", "Newest", "Highest ELO", "Most Points", "Most Views", "Ending Soon"];
const eloRanges = ["Any ELO", "Bronze (0-1299)", "Silver (1300-1499)", "Gold (1500-1699)", "Diamond (1700+)"];
const verifiedFilters = ["All Users", "Verified Only", "University Verified"];

// Main gigs data
const gigs = [
  { id: 1, skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, format: "Direct Swap", posted: "2h ago", views: 124, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. I specialize in minimal, modern brand identities.", deliveryDays: 5, completedSwaps: 47 },
  { id: 2, skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 89, uni: "Stanford", verified: true, desc: "Full-stack Python/Django backend development. REST APIs, database design, and deployment.", deliveryDays: 7, completedSwaps: 82 },
  { id: 3, skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 67, uni: "Harvard", verified: true, desc: "Professional video editing using Premiere Pro and After Effects.", deliveryDays: 4, completedSwaps: 23, currentBid: 45, bidCount: 8, endsIn: 180 },
  { id: 4, skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true, format: "Co-Creation", posted: "1h ago", views: 203, uni: "Georgia Tech", verified: true, desc: "Blender & Maya 3D modeling for games, AR/VR, and product visualization.", deliveryDays: 10, completedSwaps: 34 },
  { id: 5, skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, format: "Direct Swap", posted: "8h ago", views: 45, uni: "UC Berkeley", verified: false, desc: "Data-driven SEO strategy including keyword research and analytics.", deliveryDays: 3, completedSwaps: 19 },
  { id: 6, skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, format: "Skill Fusion", posted: "30m ago", views: 312, uni: "MIT", verified: true, desc: "Advanced data analysis with Python, R, and Tableau.", deliveryDays: 6, completedSwaps: 91 },
  { id: 7, skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false, format: "Direct Swap", posted: "12h ago", views: 78, uni: "", verified: false, desc: "Digital illustration — editorial, children's book, and character design.", deliveryDays: 7, completedSwaps: 28 },
  { id: 8, skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, format: "Auction", posted: "3h ago", views: 156, uni: "Stanford", verified: true, desc: "Cinema 4D and After Effects motion graphics for explainers and ads.", deliveryDays: 5, completedSwaps: 56, currentBid: 55, bidCount: 12, endsIn: 90 },
  { id: 9, skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false, format: "Direct Swap", posted: "1d ago", views: 34, uni: "", verified: false, desc: "SEO-optimized blog writing for tech, lifestyle, and business.", deliveryDays: 2, completedSwaps: 15 },
  { id: 10, skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true, format: "Flash Market", posted: "45m ago", views: 234, uni: "Harvard", verified: true, desc: "Facebook, Instagram, and TikTok ad campaigns with proven ROI.", deliveryDays: 4, completedSwaps: 67 },
  { id: 11, skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, format: "Projects", posted: "15m ago", views: 445, uni: "MIT", verified: true, desc: "Cross-platform mobile apps with React Native. Published 5 apps.", deliveryDays: 14, completedSwaps: 103 },
  { id: 12, skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Photography", hot: false, format: "Direct Swap", posted: "5h ago", views: 92, uni: "", verified: false, desc: "Studio and lifestyle product photography with professional retouching.", deliveryDays: 3, completedSwaps: 31 },
  { id: 13, skill: "UX Research", wants: "Data Viz", points: 15, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: false, format: "Co-Creation", posted: "7h ago", views: 110, uni: "Stanford", verified: true, desc: "User research, usability testing, and persona development.", deliveryDays: 8, completedSwaps: 44 },
  { id: 14, skill: "Technical Writing", wants: "Frontend Dev", points: 20, seller: "Sam D.", elo: 1350, rating: 4.6, avatar: "SD", category: "Writing", hot: false, format: "Direct Swap", posted: "9h ago", views: 56, uni: "Georgia Tech", verified: true, desc: "API documentation and user guides for SaaS products.", deliveryDays: 5, completedSwaps: 22 },
  { id: 15, skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", category: "Design", hot: true, format: "Skill Fusion", posted: "2h ago", views: 178, uni: "UC Berkeley", verified: true, desc: "Game mechanics design, level design, and balancing for indie games.", deliveryDays: 12, completedSwaps: 38 },
  { id: 16, skill: "API Development", wants: "Illustration", points: 35, seller: "Dev K.", elo: 1660, rating: 5.0, avatar: "DK", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 98, uni: "MIT", verified: true, desc: "RESTful and GraphQL API development with Node.js, Go, or Python.", deliveryDays: 6, completedSwaps: 71 },
  { id: 17, skill: "Podcast Editing", wants: "Thumbnail Design", points: 10, seller: "Zara N.", elo: 1280, rating: 4.5, avatar: "ZN", category: "Video", hot: false, format: "Flash Market", posted: "11h ago", views: 41, uni: "", verified: false, desc: "Podcast editing including noise removal, EQ, and show notes.", deliveryDays: 2, completedSwaps: 12 },
  { id: 18, skill: "Content Strategy", wants: "App Prototype", points: 40, seller: "Leo R.", elo: 1440, rating: 4.7, avatar: "LR", category: "Writing", hot: false, format: "Projects", posted: "6h ago", views: 87, uni: "Harvard", verified: true, desc: "Content strategy for startups — editorial calendars and voice guides.", deliveryDays: 10, completedSwaps: 29 },
  { id: 19, skill: "Music Production", wants: "Video Editing", points: 30, seller: "DJ Kael", elo: 1530, rating: 4.9, avatar: "DK", category: "Music", hot: true, format: "Direct Swap", posted: "1h ago", views: 189, uni: "", verified: false, desc: "Beat production, mixing, and mastering across genres.", deliveryDays: 4, completedSwaps: 45 },
  { id: 20, skill: "Brand Photography", wants: "Social Media Mgmt", points: 20, seller: "Iris V.", elo: 1410, rating: 4.7, avatar: "IV", category: "Photography", hot: false, format: "Auction", posted: "3h ago", views: 73, uni: "", verified: false, desc: "Brand and lifestyle photography for e-commerce and campaigns.", deliveryDays: 5, completedSwaps: 26, currentBid: 30, bidCount: 5, endsIn: 240 },
  { id: 21, skill: "Machine Learning", wants: "UX Design", points: 55, seller: "Victor Z.", elo: 1780, rating: 5.0, avatar: "VZ", category: "Development", hot: true, format: "Skill Fusion", posted: "20m ago", views: 521, uni: "MIT", verified: true, desc: "ML model development, NLP, computer vision. Published researcher.", deliveryDays: 14, completedSwaps: 67 },
  { id: 22, skill: "Songwriting", wants: "Graphic Design", points: 15, seller: "Melody P.", elo: 1340, rating: 4.6, avatar: "MP", category: "Music", hot: false, format: "Direct Swap", posted: "8h ago", views: 62, uni: "", verified: false, desc: "Original songwriting for commercials, indie films, and projects.", deliveryDays: 7, completedSwaps: 18 },
  { id: 23, skill: "Infographic Design", wants: "Python Scripts", points: 20, seller: "Tara J.", elo: 1470, rating: 4.8, avatar: "TJ", category: "Design", hot: false, format: "Direct Swap", posted: "5h ago", views: 88, uni: "UC Berkeley", verified: true, desc: "Data visualization and infographic design for reports.", deliveryDays: 4, completedSwaps: 35 },
  { id: 24, skill: "Cloud Architecture", wants: "Brand Strategy", points: 60, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, format: "Projects", posted: "10m ago", views: 634, uni: "Stanford", verified: true, desc: "AWS/GCP cloud architecture, DevOps pipelines, and IaC.", deliveryDays: 21, completedSwaps: 89 },
  { id: 25, skill: "Copywriting", wants: "Motion Graphics", points: 15, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, format: "Flash Market", posted: "2h ago", views: 94, uni: "Harvard", verified: true, desc: "Conversion-focused copywriting for landing pages and emails.", deliveryDays: 3, completedSwaps: 41 },
  { id: 26, skill: "Digital Ads", wants: "App Development", points: 25, seller: "Rita G.", elo: 1480, rating: 4.8, avatar: "RG", category: "Marketing", hot: false, format: "Co-Creation", posted: "4h ago", views: 112, uni: "Georgia Tech", verified: true, desc: "Google Ads and Meta Ads with A/B testing and optimization.", deliveryDays: 5, completedSwaps: 53 },
  { id: 27, skill: "Figma Prototyping", wants: "Backend Dev", points: 30, seller: "Suki T.", elo: 1540, rating: 4.9, avatar: "ST", category: "Design", hot: true, format: "Direct Swap", posted: "1h ago", views: 201, uni: "MIT", verified: true, desc: "High-fidelity Figma prototypes with interactive design systems.", deliveryDays: 6, completedSwaps: 62 },
  { id: 28, skill: "Video Production", wants: "Data Analysis", points: 35, seller: "Finn B.", elo: 1590, rating: 4.9, avatar: "FB", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 143, uni: "Stanford", verified: true, desc: "End-to-end video production — scripting, filming, and grading.", deliveryDays: 10, completedSwaps: 48, currentBid: 60, bidCount: 9, endsIn: 120 },
  { id: 29, skill: "Cybersecurity Audit", wants: "Design System", points: 45, seller: "Hack M.", elo: 1700, rating: 5.0, avatar: "HM", category: "Development", hot: true, format: "Skill Fusion", posted: "45m ago", views: 387, uni: "Caltech", verified: true, desc: "Penetration testing and security hardening for web apps.", deliveryDays: 7, completedSwaps: 54 },
  { id: 30, skill: "Typography Design", wants: "SEO Strategy", points: 20, seller: "Vera L.", elo: 1430, rating: 4.7, avatar: "VL", category: "Design", hot: false, format: "Direct Swap", posted: "7h ago", views: 69, uni: "UC Berkeley", verified: false, desc: "Custom typeface design for brand identities.", deliveryDays: 14, completedSwaps: 21 },
];

// Projects data (larger scope team collaborations)
const projects = [
  {
    id: 101,
    title: "SaaS Dashboard MVP",
    description: "Build a complete analytics dashboard with authentication, real-time charts, and user management. Looking for a full team.",
    leader: "Chen L.",
    leaderElo: 1750,
    leaderAvatar: "CL",
    status: "Recruiting",
    roles: [
      { name: "Lead Developer", filled: true, filler: "Chen L." },
      { name: "UI/UX Designer", filled: true, filler: "Maya K." },
      { name: "Backend Engineer", filled: false },
      { name: "DevOps", filled: false },
    ],
    totalSP: 200,
    deadline: "2026-04-15",
    applicants: 12,
    category: "Development"
  },
  {
    id: 102,
    title: "Indie Game Launch",
    description: "2D platformer game needing art, music, and marketing for Steam launch. Revenue share model after release.",
    leader: "Alex F.",
    leaderElo: 1490,
    leaderAvatar: "AF",
    status: "In Progress",
    roles: [
      { name: "Game Designer", filled: true, filler: "Alex F." },
      { name: "Pixel Artist", filled: true, filler: "Lena S." },
      { name: "Composer", filled: true, filler: "DJ Kael" },
      { name: "Marketing Lead", filled: false },
    ],
    totalSP: 150,
    deadline: "2026-05-01",
    applicants: 8,
    category: "Design"
  },
  {
    id: 103,
    title: "E-commerce Rebrand",
    description: "Complete rebrand for fashion e-commerce — new logo, photography, copy, and website redesign.",
    leader: "Maya K.",
    leaderElo: 1450,
    leaderAvatar: "MK",
    status: "Recruiting",
    roles: [
      { name: "Brand Designer", filled: true, filler: "Maya K." },
      { name: "Photographer", filled: false },
      { name: "Copywriter", filled: false },
      { name: "Web Developer", filled: false },
    ],
    totalSP: 180,
    deadline: "2026-04-20",
    applicants: 15,
    category: "Design"
  }
];

// Skill Fusion data (multi-skill collaborative swaps)
const skillFusions = [
  {
    id: 201,
    title: "AI-Powered Design Tool",
    description: "Combining ML expertise with UX design to create an intelligent design assistant prototype.",
    participants: [
      { name: "Victor Z.", skill: "Machine Learning", elo: 1780, avatar: "VZ" },
      { name: "Priya S.", skill: "UX Research", elo: 1580, avatar: "PS" },
    ],
    lookingFor: ["Frontend Development", "Product Strategy"],
    totalSP: 120,
    complexity: "Advanced",
    duration: "4 weeks"
  },
  {
    id: 202,
    title: "Security + Branding Package",
    description: "Comprehensive security audit paired with brand identity refresh for tech startups.",
    participants: [
      { name: "Hack M.", skill: "Cybersecurity", elo: 1700, avatar: "HM" },
      { name: "Maya K.", skill: "Brand Design", elo: 1450, avatar: "MK" },
    ],
    lookingFor: ["Copywriting"],
    totalSP: 90,
    complexity: "Intermediate",
    duration: "2 weeks"
  },
  {
    id: 203,
    title: "Data Storytelling Suite",
    description: "Data analysis + infographic design + video explainer — tell your data story end-to-end.",
    participants: [
      { name: "Raj P.", skill: "Data Analysis", elo: 1720, avatar: "RP" },
      { name: "Tara J.", skill: "Infographics", elo: 1470, avatar: "TJ" },
    ],
    lookingFor: ["Video Editing", "Narration"],
    totalSP: 100,
    complexity: "Intermediate",
    duration: "3 weeks"
  }
];

// SP Only Gigs (buyers paying only with SP, no skill exchange required)
const spOnlyGigs = [
  { id: 401, skill: "Logo Design", spPrice: 80, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, posted: "1h ago", views: 234, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. Pure SP purchase — no skill swap required.", deliveryDays: 5, completedGigs: 47 },
  { id: 402, skill: "Python Backend API", spPrice: 150, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: true, posted: "2h ago", views: 189, uni: "Stanford", verified: true, desc: "Full REST API development with documentation. Pay with SP only.", deliveryDays: 7, completedGigs: 82 },
  { id: 403, skill: "Video Editing", spPrice: 60, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, posted: "3h ago", views: 98, uni: "Harvard", verified: true, desc: "Professional video editing for YouTube, TikTok, or Instagram. SP purchase only.", deliveryDays: 3, completedGigs: 23 },
  { id: 404, skill: "React Dashboard", spPrice: 200, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, posted: "45m ago", views: 312, uni: "MIT", verified: true, desc: "Complete React dashboard with charts, auth, and responsive design. SP only.", deliveryDays: 10, completedGigs: 103 },
  { id: 405, skill: "SEO Strategy", spPrice: 45, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, posted: "4h ago", views: 67, uni: "UC Berkeley", verified: false, desc: "Comprehensive SEO audit and strategy document. No skill swap needed.", deliveryDays: 4, completedGigs: 19 },
  { id: 406, skill: "Mobile App Design", spPrice: 120, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: true, posted: "30m ago", views: 278, uni: "Stanford", verified: true, desc: "Complete mobile app UI/UX design in Figma. Pay with SP.", deliveryDays: 6, completedGigs: 44 },
  { id: 407, skill: "Copywriting", spPrice: 35, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, posted: "5h ago", views: 54, uni: "Harvard", verified: true, desc: "Landing page copy, email sequences, or ad copy. SP only.", deliveryDays: 2, completedGigs: 41 },
  { id: 408, skill: "3D Modeling", spPrice: 90, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: false, posted: "2h ago", views: 145, uni: "Georgia Tech", verified: true, desc: "3D models for games, AR/VR, or product visualization. SP purchase.", deliveryDays: 7, completedGigs: 34 },
  { id: 409, skill: "Data Analysis", spPrice: 100, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, posted: "1h ago", views: 198, uni: "MIT", verified: true, desc: "Data analysis with Python/R, Tableau dashboards included. SP only.", deliveryDays: 5, completedGigs: 91 },
  { id: 410, skill: "Brand Identity", spPrice: 150, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, posted: "20m ago", views: 167, uni: "MIT", verified: true, desc: "Complete brand identity: logo, colors, typography, guidelines. SP only.", deliveryDays: 8, completedGigs: 47 },
  { id: 411, skill: "Motion Graphics", spPrice: 85, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, posted: "3h ago", views: 123, uni: "Stanford", verified: true, desc: "Animated explainer videos or social media clips. No swap needed.", deliveryDays: 4, completedGigs: 56 },
  { id: 412, skill: "Cloud Setup", spPrice: 180, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, posted: "15m ago", views: 421, uni: "Stanford", verified: true, desc: "AWS/GCP setup, CI/CD pipelines, infrastructure as code. SP purchase.", deliveryDays: 5, completedGigs: 89 },
];

// Request Board (users posting what they need)
const requests = [
  { id: 301, title: "Need React Dev for Portfolio", description: "I can offer logo design and brand identity work", requester: "Maya K.", requesterElo: 1450, offering: "Logo Design", seeking: "React Development", budget: 40, responses: 7, posted: "1h ago" },
  { id: 302, title: "Looking for Video Editor", description: "Have Python/Django skills to trade for promo video editing", requester: "James T.", requesterElo: 1680, offering: "Backend Development", seeking: "Video Editing", budget: 25, responses: 4, posted: "3h ago" },
  { id: 303, title: "Content Writer Needed", description: "Offering SEO strategy consultation in exchange", requester: "Emma L.", requesterElo: 1400, offering: "SEO Strategy", seeking: "Blog Writing", budget: 15, responses: 2, posted: "5h ago" },
  { id: 304, title: "UI Designer for App Mockups", description: "Can provide ML model development/integration", requester: "Victor Z.", requesterElo: 1780, offering: "Machine Learning", seeking: "UI/UX Design", budget: 50, responses: 11, posted: "30m ago" },
  { id: 305, title: "SP Purchase: Logo + Business Cards", description: "Paying 100 SP for complete brand starter kit, no swap", requester: "Startup Inc.", requesterElo: 1200, offering: "100 SP", seeking: "Brand Design", budget: 100, responses: 9, posted: "2h ago", spOnly: true },
  { id: 306, title: "SP Purchase: Landing Page", description: "Paying 120 SP for responsive landing page, no skill swap", requester: "Product Co.", requesterElo: 1150, offering: "120 SP", seeking: "Web Development", budget: 120, responses: 6, posted: "4h ago", spOnly: true },
];

// Featured Sellers
const featuredSellers = [
  { name: "Victor Z.", skill: "Machine Learning", elo: 1780, avatar: "VZ", verified: true, swaps: 67, rating: 5.0, badge: "Top Rated" },
  { name: "Chen L.", skill: "Mobile Development", elo: 1750, avatar: "CL", verified: true, swaps: 103, rating: 5.0, badge: "Rising Star" },
  { name: "Niko A.", skill: "Cloud Architecture", elo: 1800, avatar: "NA", verified: true, swaps: 89, rating: 5.0, badge: "Expert" },
  { name: "Raj P.", skill: "Data Analysis", elo: 1720, avatar: "RP", verified: true, swaps: 91, rating: 5.0, badge: "Consistent" },
  { name: "James T.", skill: "Backend Dev", elo: 1680, avatar: "JT", verified: true, swaps: 82, rating: 5.0, badge: "Reliable" },
];

const aiSuggestions = [
  "Design a logo for my startup",
  "Build a React dashboard",
  "Edit a YouTube video",
  "Write blog posts for SaaS",
  "Create social media ads",
  "Build a mobile app",
  "Security audit my site",
  "Make an explainer video",
];

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
───────────────────────────────────────────────────────────────────────────── */

const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10", border: "border-court-blue/20", glow: "shadow-[0_0_20px_-5px_hsl(var(--court-blue)/0.3)]" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10", border: "border-badge-gold/20", glow: "shadow-[0_0_20px_-5px_hsl(var(--badge-gold)/0.3)]" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2", border: "border-border", glow: "" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", glow: "" };
};

const formatIcon = (format: string) => {
  switch (format) {
    case "Auction": return Gavel;
    case "Co-Creation": return Layers;
    case "Flash Market": return Zap;
    case "Skill Fusion": return GitMerge;
    case "Projects": return Briefcase;
    default: return Handshake;
  }
};

const formatColor = (format: string) => {
  switch (format) {
    case "Auction": return "text-badge-gold bg-badge-gold/10 border-badge-gold/20";
    case "Co-Creation": return "text-court-blue bg-court-blue/10 border-court-blue/20";
    case "Flash Market": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "Skill Fusion": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "Projects": return "text-skill-green bg-skill-green/10 border-skill-green/20";
    default: return "text-muted-foreground bg-surface-2 border-border";
  }
};

const complexityColor = (complexity: string) => {
  switch (complexity) {
    case "Advanced": return "text-alert-red bg-alert-red/10";
    case "Intermediate": return "text-badge-gold bg-badge-gold/10";
    default: return "text-skill-green bg-skill-green/10";
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────────────────────────────────────── */

const useCountdown = (minutes: number) => {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const iv = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

/* ─────────────────────────────────────────────────────────────────────────────
   GIG CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const GigCard = ({ gig, liked, toggleLike, onClick, compact = false }: {
  gig: typeof gigs[0];
  liked: Set<number>;
  toggleLike: (id: number) => void;
  onClick: () => void;
  compact?: boolean;
}) => {
  const tier = eloTier(gig.elo);
  const FmtIcon = formatIcon(gig.format);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.12)] ${tier.glow}`}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${formatColor(gig.format)}`}>
          <FmtIcon size={10} />
          {gig.format}
        </div>
        <div className="flex items-center gap-2">
          {gig.hot && (
            <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-1.5 py-0.5 text-[10px] text-alert-red font-medium">
              <Flame size={9} className="animate-pulse" /> Hot
            </span>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground/60 hover:text-alert-red transition-colors">
            <Heart size={14} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={compact ? "p-3" : "p-4"}>
        {/* Offering / Wants */}
        <div className="mb-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-skill-green/10">
              <ArrowRight size={10} className="text-skill-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Offering</p>
              <p className="text-sm font-bold text-foreground leading-tight truncate">{gig.skill}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-court-blue/10">
              <Target size={10} className="text-court-blue" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Looking for</p>
              <p className="text-sm font-medium text-foreground/70 leading-tight truncate">{gig.wants}</p>
            </div>
          </div>
        </div>

        {/* Seller row */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tier.border} ${tier.bg} font-mono text-[11px] font-bold ${tier.color}`}>
            {gig.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground truncate">
              {gig.seller}
              {gig.verified && <CheckCircle2 size={11} className="text-skill-green shrink-0" />}
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-medium ${tier.color}`}>{tier.label}</span>
              <span className="text-muted-foreground/30">·</span>
              <Star size={9} className="fill-badge-gold text-badge-gold" />
              <span className="text-[10px] font-medium text-badge-gold">{gig.rating}</span>
              {gig.completedSwaps && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-[10px] text-muted-foreground">{gig.completedSwaps} swaps</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground/70">
          <span className="flex items-center gap-0.5"><Clock size={9} />{gig.posted}</span>
          <span className="flex items-center gap-0.5"><Eye size={9} />{gig.views}</span>
          {gig.uni && <span className="flex items-center gap-0.5"><GraduationCap size={9} />{gig.uni}</span>}
          {gig.deliveryDays && <span className="flex items-center gap-0.5"><CalendarDays size={9} />{gig.deliveryDays}d</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-2.5">
        {gig.points > 0 ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-bold text-skill-green">
              <Coins size={11} />+{gig.points} SP
            </span>
            <span className="text-[10px] text-muted-foreground/50">to balance swap</span>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <Handshake size={11} /> Equal value exchange
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   AUCTION CARD COMPONENT (Enhanced)
───────────────────────────────────────────────────────────────────────────── */

const AuctionCard = ({ gig, onBid }: { gig: typeof gigs[0]; onBid?: () => void }) => {
  const tier = eloTier(gig.elo);
  const countdown = useCountdown(gig.endsIn || 120);
  const urgency = (gig.endsIn || 120) < 60;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`min-w-[320px] max-w-[320px] rounded-2xl border ${urgency ? 'border-alert-red/30' : 'border-badge-gold/20'} bg-card transition-all hover:shadow-[0_0_40px_-10px_hsl(var(--badge-gold)/0.2)]`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between border-b ${urgency ? 'border-alert-red/20 bg-alert-red/5' : 'border-badge-gold/10'} px-4 py-3`}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-badge-gold/10">
            <Gavel size={14} className="text-badge-gold" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-badge-gold tracking-wider">LIVE AUCTION</span>
            <p className="text-[10px] text-muted-foreground">{gig.bidCount || 5} bids</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-lg ${urgency ? 'bg-alert-red/10' : 'bg-surface-2'} px-2.5 py-1.5`}>
          <Timer size={11} className={`${urgency ? 'text-alert-red' : 'text-muted-foreground'} animate-pulse`} />
          <span className={`font-mono text-xs font-bold ${urgency ? 'text-alert-red' : 'text-foreground'}`}>{countdown}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="mb-1 text-base font-bold text-foreground">{gig.skill}</h4>
        <p className="mb-4 text-xs text-muted-foreground">↔ {gig.wants}</p>

        {/* Seller */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tier.bg} text-[10px] font-bold ${tier.color}`}>{gig.avatar}</div>
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-foreground">
              {gig.seller}
              {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
            </p>
            <p className={`text-[10px] ${tier.color}`}>{tier.label} · {gig.elo} ELO</p>
          </div>
        </div>

        {/* Current Bid */}
        <div className="mb-4 rounded-xl bg-surface-1 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Current Bid</span>
            <span className="text-[10px] text-muted-foreground">{gig.bidCount} participants</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-skill-green">{gig.currentBid || gig.points}</span>
            <span className="text-sm font-semibold text-skill-green">SP</span>
          </div>
        </div>

        {/* Bid Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onBid}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-badge-gold py-2.5 text-sm font-semibold text-background transition-all hover:bg-badge-gold/90"
          >
            <Gavel size={14} /> Place Bid
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CO-CREATION CARD COMPONENT (Enhanced)
───────────────────────────────────────────────────────────────────────────── */

const CoCreationCard = ({ gig, onApply }: { gig: typeof gigs[0]; onApply?: () => void }) => {
  const tier = eloTier(gig.elo);
  const roles = [
    { name: gig.skill, filled: true, filler: gig.seller },
    { name: gig.wants, filled: false },
    { name: "QA / Review", filled: Math.random() > 0.6 },
  ];
  const filledCount = roles.filter(r => r.filled).length;
  const progress = (filledCount / roles.length) * 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-court-blue/15 bg-card transition-all hover:border-court-blue/30 hover:shadow-[0_0_40px_-10px_hsl(var(--court-blue)/0.15)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-court-blue/10">
            <Layers size={14} className="text-court-blue" />
          </div>
          <span className="text-[10px] font-bold text-court-blue tracking-wider">CO-CREATION</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${filledCount < roles.length ? 'bg-skill-green animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-[10px] text-muted-foreground">{filledCount < roles.length ? 'Recruiting' : 'Team Full'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="mb-1 text-base font-bold text-foreground">{gig.skill} × {gig.wants}</h4>
        <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{gig.desc}</p>

        {/* Team Lead */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-surface-1 p-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tier.bg} text-[10px] font-bold ${tier.color}`}>{gig.avatar}</div>
          <div className="flex-1">
            <p className="flex items-center gap-1 text-xs font-medium text-foreground">
              {gig.seller}
              {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
              <Crown size={10} className="text-badge-gold ml-1" />
            </p>
            <p className="text-[10px] text-muted-foreground">Team Lead · {tier.label}</p>
          </div>
        </div>

        {/* Roles */}
        <div className="mb-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Team Roles</p>
          {roles.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-surface-1/50 px-3 py-2">
              <span className="text-xs text-foreground">{r.name}</span>
              {r.filled ? (
                <span className="flex items-center gap-1 text-[10px] font-medium text-skill-green">
                  <CheckCircle2 size={10} /> {r.filler || 'Filled'}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-medium text-badge-gold">
                  <Plus size={10} /> Open
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted-foreground">Team Progress</span>
            <span className="text-[10px] font-medium text-foreground">{filledCount}/{roles.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Actions */}
        {filledCount < roles.length && (
          <button 
            onClick={onApply}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-court-blue py-2.5 text-sm font-semibold text-white transition-all hover:bg-court-blue/90"
          >
            <Send size={14} /> Apply to Join
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const ProjectCard = ({ project, onApply }: { project: typeof projects[0]; onApply?: () => void }) => {
  const tier = eloTier(project.leaderElo);
  const filledRoles = project.roles.filter(r => r.filled).length;
  const progress = (filledRoles / project.roles.length) * 100;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-skill-green/15 bg-card transition-all hover:border-skill-green/30 hover:shadow-[0_0_40px_-10px_hsl(var(--skill-green)/0.15)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-skill-green/10">
            <Briefcase size={14} className="text-skill-green" />
          </div>
          <span className="text-[10px] font-bold text-skill-green tracking-wider">PROJECT</span>
        </div>
        <Badge variant="secondary" className={`text-[10px] ${project.status === 'Recruiting' ? 'bg-skill-green/10 text-skill-green' : 'bg-court-blue/10 text-court-blue'}`}>
          {project.status}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="mb-2 text-lg font-bold text-foreground">{project.title}</h4>
        <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{project.description}</p>

        {/* Leader */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-surface-1 p-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tier.bg} text-[11px] font-bold ${tier.color}`}>{project.leaderAvatar}</div>
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {project.leader}
              <Crown size={12} className="text-badge-gold" />
            </p>
            <p className="text-[10px] text-muted-foreground">Project Lead · {tier.label}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-skill-green">{project.totalSP} SP</p>
            <p className="text-[10px] text-muted-foreground">Total Pool</p>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {project.roles.map((r, i) => (
            <div key={i} className={`rounded-lg px-3 py-2 text-xs ${r.filled ? 'bg-skill-green/5 border border-skill-green/10' : 'bg-surface-1 border border-dashed border-border'}`}>
              <p className={`font-medium ${r.filled ? 'text-foreground' : 'text-muted-foreground'}`}>{r.name}</p>
              <p className={`text-[10px] ${r.filled ? 'text-skill-green' : 'text-badge-gold'}`}>
                {r.filled ? r.filler : 'Open Position'}
              </p>
            </div>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays size={10} />{daysLeft}d left</span>
            <span className="flex items-center gap-1"><Users size={10} />{project.applicants} applicants</span>
          </div>
          <Progress value={progress} className="w-20 h-1.5" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onApply}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-skill-green py-2.5 text-sm font-semibold text-background transition-all hover:bg-skill-green/90"
          >
            <Briefcase size={14} /> View Project
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SKILL FUSION CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const SkillFusionCard = ({ fusion, onJoin }: { fusion: typeof skillFusions[0]; onJoin?: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-purple-400/15 bg-card transition-all hover:border-purple-400/30 hover:shadow-[0_0_40px_-10px_hsl(270_60%_60%/0.15)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-gradient-to-r from-purple-400/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/10">
            <GitMerge size={14} className="text-purple-400" />
          </div>
          <span className="text-[10px] font-bold text-purple-400 tracking-wider">SKILL FUSION</span>
        </div>
        <Badge className={`text-[10px] ${complexityColor(fusion.complexity)}`}>
          {fusion.complexity}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="mb-2 text-base font-bold text-foreground">{fusion.title}</h4>
        <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{fusion.description}</p>

        {/* Current Participants */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Active Collaborators</p>
          <div className="space-y-2">
            {fusion.participants.map((p, i) => {
              const tier = eloTier(p.elo);
              return (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tier.bg} text-[9px] font-bold ${tier.color}`}>{p.avatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.skill}</p>
                  </div>
                  <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Looking For */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Looking For</p>
          <div className="flex flex-wrap gap-1.5">
            {fusion.lookingFor.map((skill, i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-dashed border-purple-400/30 text-purple-400">
                + {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock size={10} />{fusion.duration}</span>
          <span className="flex items-center gap-1 text-skill-green font-medium"><Coins size={10} />{fusion.totalSP} SP Pool</span>
        </div>

        {/* Action */}
        <button 
          onClick={onJoin}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-500/90"
        >
          <GitMerge size={14} /> Join Fusion
        </button>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FLASH MARKET CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const FlashMarketCard = ({ gig, onClick }: { gig: typeof gigs[0]; onClick?: () => void }) => {
  const tier = eloTier(gig.elo);
  const multiplier = (Math.random() * 1.5 + 1.5).toFixed(1);
  const countdown = useCountdown(Math.floor(Math.random() * 60) + 15);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative cursor-pointer rounded-2xl border border-amber-400/20 bg-card transition-all hover:border-amber-400/40 hover:shadow-[0_0_40px_-10px_hsl(var(--badge-gold)/0.2)] overflow-hidden"
    >
      {/* Multiplier Badge */}
      <div className="absolute -right-1 -top-1 z-10">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1.5 rounded-bl-xl rounded-tr-xl shadow-lg">
          <span className="text-sm font-black text-background">{multiplier}x</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-400/10 px-4 py-3 bg-gradient-to-r from-amber-400/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10">
            <Zap size={14} className="text-amber-400" />
          </div>
          <span className="text-[10px] font-bold text-amber-400 tracking-wider">FLASH DEAL</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-alert-red/10 px-2 py-1">
          <Timer size={10} className="text-alert-red animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-alert-red">{countdown}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="mb-1 text-base font-bold text-foreground">{gig.skill}</h4>
        <p className="mb-3 text-xs text-muted-foreground">↔ {gig.wants}</p>

        {/* Seller */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tier.bg} text-[10px] font-bold ${tier.color}`}>{gig.avatar}</div>
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-foreground">
              {gig.seller}
              {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
            </p>
            <p className={`text-[10px] ${tier.color}`}>{tier.label}</p>
          </div>
        </div>

        {/* Bonus SP */}
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-skill-green/10 to-amber-400/10 border border-skill-green/20 px-4 py-3">
          <Rocket size={16} className="text-skill-green" />
          <div>
            <p className="text-xs font-bold text-skill-green">+{gig.points} SP</p>
            <p className="text-[10px] text-amber-400">×{multiplier} bonus active!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   REQUEST CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const RequestCard = ({ request, onRespond }: { request: typeof requests[0]; onRespond?: () => void }) => {
  const tier = eloTier(request.requesterElo);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border bg-card transition-all hover:border-foreground/15"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">{request.title}</h4>
          <span className="text-[10px] text-muted-foreground">{request.posted}</span>
        </div>

        <p className="mb-4 text-xs text-muted-foreground">{request.description}</p>

        {/* Exchange Info */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-skill-green/5 border border-skill-green/10 p-2.5">
            <p className="text-[9px] uppercase tracking-widest text-skill-green/60 mb-0.5">Offering</p>
            <p className="text-xs font-medium text-foreground">{request.offering}</p>
          </div>
          <div className="rounded-lg bg-court-blue/5 border border-court-blue/10 p-2.5">
            <p className="text-[9px] uppercase tracking-widest text-court-blue/60 mb-0.5">Seeking</p>
            <p className="text-xs font-medium text-foreground">{request.seeking}</p>
          </div>
        </div>

        {/* Requester & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tier.bg} text-[9px] font-bold ${tier.color}`}>
              {request.requester.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{request.requester}</p>
              <p className={`text-[10px] ${tier.color}`}>{tier.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MessageSquare size={10} />{request.responses}
            </span>
            <span className="text-xs font-bold text-skill-green">+{request.budget} SP</span>
            <button 
              onClick={onRespond}
              className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background hover:opacity-90 transition-opacity"
            >
              <Send size={10} /> Respond
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED SELLER CARD
───────────────────────────────────────────────────────────────────────────── */

const FeaturedSellerCard = ({ seller }: { seller: typeof featuredSellers[0] }) => {
  const tier = eloTier(seller.elo);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="min-w-[200px] rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/15"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${tier.bg} border ${tier.border} font-mono text-lg font-bold ${tier.color} ${tier.glow}`}>
          {seller.avatar}
        </div>
        <Badge className="mb-2 text-[9px]" variant="secondary">{seller.badge}</Badge>
        <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
          {seller.name}
          {seller.verified && <CheckCircle2 size={12} className="text-skill-green" />}
        </p>
        <p className="text-xs text-muted-foreground mb-2">{seller.skill}</p>
        <div className="flex items-center gap-2 text-[10px]">
          <span className={tier.color}>{tier.label}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="flex items-center gap-0.5 text-badge-gold">
            <Star size={9} className="fill-badge-gold" />{seller.rating}
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-muted-foreground">{seller.swaps} swaps</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN MARKETPLACE PAGE
───────────────────────────────────────────────────────────────────────────── */

const MarketplacePage = () => {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFormat, setActiveFormat] = useState("All Formats");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("Trending");
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [eloRange, setEloRange] = useState("Any ELO");
  const [verifiedFilter, setVerifiedFilter] = useState("All Users");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedGig, setSelectedGig] = useState<typeof gigs[0] | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
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

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = gigs.filter((g) => {
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    const matchFormat = activeFormat === "All Formats" || g.format === activeFormat;
    const matchSearch = !searchQuery || 
      g.skill.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.wants.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchElo = eloRange === "Any ELO" ||
      (eloRange.includes("Bronze") && g.elo < 1300) ||
      (eloRange.includes("Silver") && g.elo >= 1300 && g.elo < 1500) ||
      (eloRange.includes("Gold") && g.elo >= 1500 && g.elo < 1700) ||
      (eloRange.includes("Diamond") && g.elo >= 1700);
    const matchVerified = verifiedFilter === "All Users" ||
      (verifiedFilter === "Verified Only" && g.verified) ||
      (verifiedFilter === "University Verified" && g.uni);
    return matchCat && matchFormat && matchSearch && matchElo && matchVerified;
  });

  // Section data
  const trendingGigs = gigs.filter((g) => g.hot).sort((a, b) => b.views - a.views);
  const auctionGigs = gigs.filter((g) => g.format === "Auction");
  const coCreationGigs = gigs.filter((g) => g.format === "Co-Creation");
  const flashGigs = gigs.filter((g) => g.format === "Flash Market");
  const fusionGigs = gigs.filter((g) => g.format === "Skill Fusion");
  const projectGigs = gigs.filter((g) => g.format === "Projects");
  const recommendedGigs = gigs.filter((g) => g.elo >= 1500 && g.verified).slice(0, 6);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(`mp-${section}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Stats
  const totalSwaps = gigs.reduce((acc, g) => acc + (g.completedSwaps || 0), 0);
  const avgRating = (gigs.reduce((acc, g) => acc + g.rating, 0) / gigs.length).toFixed(1);
  const onlineUsers = 1247;

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">

        {/* ═══════════════════════════════════════════════════════════════════
            SIDEBAR
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.aside
          animate={{ width: sidebarOpen ? 260 : 72 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card/95 backdrop-blur-xl"
        >
          {/* Logo area */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            {sidebarOpen && (
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground">
                  <Handshake size={16} className="text-background" />
                </div>
                <span className="font-heading text-lg font-bold text-foreground">
                  Skill<span className="text-muted-foreground">Swappr</span>
                </span>
              </Link>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
            {sidebarOpen && (
              <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Browse</p>
            )}
            <div className="space-y-1">
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
                  <item.icon size={18} className="shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`text-[9px] px-1.5 py-0 ${
                            item.badge === 'HOT' ? 'bg-alert-red/10 text-alert-red' :
                            item.badge === 'LIVE' ? 'bg-badge-gold/10 text-badge-gold' :
                            item.badge === 'NEW' ? 'bg-purple-400/10 text-purple-400' :
                            item.badge === 'AI' ? 'bg-skill-green/10 text-skill-green' :
                            'bg-amber-400/10 text-amber-400'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>

            {sidebarOpen && (
              <>
                <div className="my-4 border-t border-border/50" />
                <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Categories</p>
                <div className="space-y-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => { setActiveCategory(cat.label); scrollToSection("explore"); }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                        activeCategory === cat.label
                          ? "bg-surface-2 text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-1"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <cat.icon size={14} className={activeCategory === cat.label ? cat.color : ''} />
                        {cat.label}
                      </span>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="border-t border-border p-3 space-y-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-90"
              >
                <Plus size={16} />
                Post a Gig
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Briefcase size={14} />
                My Dashboard
              </Link>
            </div>
          )}
        </motion.aside>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════════════════════════════════ */}
        <main
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? 260 : 72 }}
        >
          {/* ═══ STICKY SEARCH HEADER ═══ */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6">
              {/* Top bar */}
              <div className="flex h-16 items-center gap-4">
                {/* Search */}
                <div className={`relative flex-1 transition-all duration-200 ${searchFocused ? "max-w-3xl" : "max-w-2xl"}`}>
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder='Search skills, sellers, or describe what you need...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-medium transition-all ${showFilters ? "border-foreground/20 bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/15"}`}
                  >
                    <SlidersHorizontal size={14} /> 
                    Filters
                    {(activeFormat !== "All Formats" || eloRange !== "Any ELO" || verifiedFilter !== "All Users") && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-skill-green text-[9px] font-bold text-background">
                        {[activeFormat !== "All Formats", eloRange !== "Any ELO", verifiedFilter !== "All Users"].filter(Boolean).length}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <button onClick={() => setShowSort(!showSort)} className="flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/15 transition-all">
                      <ArrowUpDown size={14} /> {sort}
                    </button>
                    {showSort && (
                      <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                        {sortOptions.map((s) => (
                          <button 
                            key={s} 
                            onClick={() => { setSort(s); setShowSort(false); }} 
                            className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${sort === s ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex rounded-xl border border-border bg-card p-1">
                    <button 
                      onClick={() => setView("grid")} 
                      className={`rounded-lg p-2 transition-colors ${view === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Grid3X3 size={14} />
                    </button>
                    <button 
                      onClick={() => setView("list")} 
                      className={`rounded-lg p-2 transition-colors ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI suggestions */}
              <AnimatePresence>
                {(searchFocused || searchQuery) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mr-1">
                        <Wand2 size={12} className="text-badge-gold" />
                        AI suggestions:
                      </div>
                      {aiSuggestions.map((s) => (
                        <button 
                          key={s} 
                          onClick={() => setSearchQuery(s)} 
                          className="rounded-full border border-border bg-surface-1 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground hover:bg-surface-2"
                        >
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
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden border-t border-border/50"
                  >
                    <div className="grid gap-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Format</label>
                        <div className="flex flex-wrap gap-1.5">
                          {formats.map((f) => (
                            <button 
                              key={f} 
                              onClick={() => setActiveFormat(f)} 
                              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${activeFormat === f ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">ELO Range</label>
                        <div className="flex flex-wrap gap-1.5">
                          {eloRanges.map((e) => (
                            <button 
                              key={e} 
                              onClick={() => setEloRange(e)} 
                              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${eloRange === e ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}
                            >
                              {e.split(" (")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Verification</label>
                        <div className="flex flex-wrap gap-1.5">
                          {verifiedFilters.map((v) => (
                            <button 
                              key={v} 
                              onClick={() => setVerifiedFilter(v)} 
                              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${verifiedFilter === v ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={() => { setActiveFormat("All Formats"); setEloRange("Any ELO"); setVerifiedFilter("All Users"); setActiveCategory("All"); setSearchQuery(""); }} 
                          className="rounded-lg border border-border bg-surface-1 px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                        >
                          Clear All Filters
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
              <div className="grid lg:grid-cols-5">
                <div className="lg:col-span-3 p-8 lg:p-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-skill-green/10">
                      <div className="h-2.5 w-2.5 rounded-full bg-skill-green animate-pulse" />
                    </div>
                    <span className="text-xs font-medium text-skill-green">{gigs.length} active gigs · {onlineUsers.toLocaleString()} users online</span>
                  </div>
                  <h1 className="mb-4 font-heading text-3xl font-black text-foreground lg:text-4xl leading-tight">
                    Find Your Perfect<br />Skill Exchange
                  </h1>
                  <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-lg">
                    Browse {gigs.length}+ active gigs across design, development, writing, video and more. 
                    Trade skills, earn SP, collaborate on projects, and build your portfolio.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 shadow-lg">
                      <Plus size={16} /> Post a Gig
                    </Link>
                    <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-all">
                      <Play size={14} /> How It Works
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:block lg:col-span-2 p-6">
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {[
                      { val: totalSwaps.toLocaleString(), label: "Swaps Done", icon: Trophy, color: "text-badge-gold" },
                      { val: "99.2%", label: "Satisfaction", icon: Shield, color: "text-skill-green" },
                      { val: `${avgRating}★`, label: "Avg Rating", icon: Star, color: "text-badge-gold" },
                      { val: `${(gigs.length * 12).toLocaleString()}+`, label: "Active Users", icon: Users, color: "text-court-blue" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border border-border bg-card/80 p-4 flex flex-col items-center justify-center text-center backdrop-blur">
                        <s.icon size={20} className={`mb-2 ${s.color}`} />
                        <p className="font-heading text-xl font-black text-foreground">{s.val}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ═══ FEATURED SELLERS ═══ */}
            <section className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-badge-gold/10">
                    <Medal size={16} className="text-badge-gold" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Top Rated Sellers</h2>
                    <p className="text-[11px] text-muted-foreground">Highest rated members this month</p>
                  </div>
                </div>
                <Link to="/leaderboard" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  View Leaderboard <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {featuredSellers.map((seller) => (
                  <FeaturedSellerCard key={seller.name} seller={seller} />
                ))}
              </div>
            </section>

            {/* ═══ TRENDING SECTION ═══ */}
            <section id="mp-trending" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-alert-red/10">
                    <Flame size={16} className="text-alert-red" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Trending Now</h2>
                    <p className="text-[11px] text-muted-foreground">{trendingGigs.length} most viewed gigs right now</p>
                  </div>
                  <span className="ml-2 flex items-center gap-1.5 rounded-full bg-alert-red/10 px-2.5 py-1 text-[10px] font-bold text-alert-red">
                    <div className="h-1.5 w-1.5 rounded-full bg-alert-red animate-pulse" /> LIVE
                  </span>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {trendingGigs.map((gig) => (
                  <div key={gig.id} className="min-w-[300px] max-w-[300px]">
                    <GigCard gig={gig} liked={liked} toggleLike={toggleLike} onClick={() => setSelectedGig(gig)} />
                  </div>
                ))}
              </div>
            </section>

            {/* ═══ LIVE AUCTIONS ═══ */}
            <section id="mp-auctions" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-badge-gold/10">
                    <Gavel size={16} className="text-badge-gold" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Live Auctions</h2>
                    <p className="text-[11px] text-muted-foreground">{auctionGigs.length} active auctions · Bid your skills</p>
                  </div>
                </div>
                <Link to="#" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {auctionGigs.map((g) => (
                  <AuctionCard key={g.id} gig={g} />
                ))}
              </div>
            </section>

            {/* ═══ CO-CREATION ═══ */}
            <section id="mp-cocreation" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-court-blue/10">
                    <Layers size={16} className="text-court-blue" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Co-Creation</h2>
                    <p className="text-[11px] text-muted-foreground">Join teams · Collaborate in shared workspaces</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coCreationGigs.map((gig) => (
                  <CoCreationCard key={gig.id} gig={gig} />
                ))}
              </div>
            </section>

            {/* ═══ SKILL FUSION ═══ */}
            <section id="mp-fusion" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-400/10">
                    <GitMerge size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Skill Fusion</h2>
                    <p className="text-[11px] text-muted-foreground">Combine skills for powerful deliverables</p>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-[9px] bg-purple-400/10 text-purple-400">NEW</Badge>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skillFusions.map((fusion) => (
                  <SkillFusionCard key={fusion.id} fusion={fusion} />
                ))}
              </div>
            </section>

            {/* ═══ PROJECTS ═══ */}
            <section id="mp-projects" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-skill-green/10">
                    <Briefcase size={16} className="text-skill-green" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Projects</h2>
                    <p className="text-[11px] text-muted-foreground">Large-scale team collaborations</p>
                  </div>
                </div>
                <Link to="#" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  Browse All Projects <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>

            {/* ═══ FLASH MARKET ═══ */}
            <section id="mp-flash" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10">
                    <Zap size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Flash Market</h2>
                    <p className="text-[11px] text-muted-foreground">Limited-time deals with bonus SP multipliers</p>
                  </div>
                  <Badge className="ml-2 text-[9px] bg-amber-400/10 text-amber-400 border-amber-400/20">UP TO 2.5x SP</Badge>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {flashGigs.map((gig) => (
                  <FlashMarketCard key={gig.id} gig={gig} onClick={() => setSelectedGig(gig)} />
                ))}
              </div>
            </section>

            {/* ═══ SP ONLY SECTION ═══ */}
            <section id="mp-sp-only" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-badge-gold/10">
                    <CircleDollarSign size={16} className="text-badge-gold" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">SP Only</h2>
                    <p className="text-[11px] text-muted-foreground">Pay with Skill Points — no skill swap required</p>
                  </div>
                  <Badge className="ml-2 text-[9px] bg-badge-gold/10 text-badge-gold border-badge-gold/20">BUYER MODE</Badge>
                </div>
                <Link to="#" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {spOnlyGigs.slice(0, 8).map((gig) => {
                  const tier = eloTier(gig.elo);
                  return (
                    <motion.div
                      key={gig.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`cursor-pointer rounded-2xl border border-border bg-card transition-all duration-300 hover:border-badge-gold/30 hover:shadow-[0_12px_48px_-12px_hsl(var(--badge-gold)/0.15)] ${tier.glow}`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                        <span className="flex items-center gap-1.5 rounded-full bg-badge-gold/10 border border-badge-gold/20 px-2 py-0.5 text-[10px] font-semibold text-badge-gold">
                          <CircleDollarSign size={10} /> SP Only
                        </span>
                        {gig.hot && (
                          <span className="flex items-center gap-1 rounded-full bg-alert-red/10 px-1.5 py-0.5 text-[10px] text-alert-red font-medium">
                            <Flame size={9} className="animate-pulse" /> Hot
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-foreground mb-2">{gig.skill}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{gig.desc}</p>

                        {/* Seller */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${tier.border} ${tier.bg} font-mono text-[10px] font-bold ${tier.color}`}>
                            {gig.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="flex items-center gap-1 text-xs font-medium text-foreground truncate">
                              {gig.seller}
                              {gig.verified && <CheckCircle2 size={10} className="text-skill-green shrink-0" />}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{gig.uni} · {tier.label}</p>
                          </div>
                        </div>

                        {/* Price & Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Coins size={14} className="text-badge-gold" />
                            <span className="text-lg font-black text-badge-gold">{gig.spPrice}</span>
                            <span className="text-xs text-muted-foreground">SP</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={9} /> {gig.deliveryDays}d</span>
                            <span className="flex items-center gap-1"><Star size={9} className="text-badge-gold" /> {gig.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-border/50 px-4 py-2.5 bg-surface-1">
                        <button className="w-full rounded-lg bg-badge-gold py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity">
                          Buy with SP
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ═══ REQUEST BOARD ═══ */}
            <section id="mp-requests" className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-2">
                    <HandHeart size={16} className="text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Request Board</h2>
                    <p className="text-[11px] text-muted-foreground">Users looking for specific skills</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 transition-opacity">
                  <Plus size={12} /> Post Request
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
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
                <Badge variant="secondary" className="ml-2 text-[9px] bg-skill-green/10 text-skill-green">AI POWERED</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedGigs.map((gig) => {
                  const matchScore = Math.floor(Math.random() * 15) + 85;
                  return (
                    <div key={gig.id} className="relative">
                      <div className="absolute -top-2 left-4 z-10 rounded-lg bg-gradient-to-r from-skill-green to-emerald-500 px-2.5 py-1 text-[10px] font-bold text-background shadow-lg">
                        {matchScore}% Match
                      </div>
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
                    <p className="text-[11px] text-muted-foreground">
                      {filtered.length} results
                      {activeCategory !== "All" && ` in ${activeCategory}`}
                      {activeFormat !== "All Formats" && ` · ${activeFormat}`}
                    </p>
                  </div>
                </div>
              </div>

              {view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((gig) => (
                      <GigCard key={gig.id} gig={gig} liked={liked} toggleLike={toggleLike} onClick={() => setSelectedGig(gig)} compact />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((gig) => {
                      const tier = eloTier(gig.elo);
                      const FmtIcon = formatIcon(gig.format);
                      return (
                        <motion.div
                          key={gig.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setSelectedGig(gig)}
                          className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:border-foreground/15 hover:bg-surface-1"
                        >
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tier.border} ${tier.bg} font-mono text-sm font-bold ${tier.color}`}>{gig.avatar}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="truncate text-sm font-semibold text-foreground">{gig.skill}</p>
                              <ArrowRight size={10} className="shrink-0 text-muted-foreground/40" />
                              <p className="truncate text-sm text-muted-foreground">{gig.wants}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="font-medium text-foreground">{gig.seller}</span>
                              {gig.verified && <CheckCircle2 size={10} className="text-skill-green" />}
                              <span className={tier.color}>{tier.label}</span>
                              <span className="text-muted-foreground/30">·</span>
                              <span className="text-muted-foreground">{gig.posted}</span>
                              <span className="text-muted-foreground/30">·</span>
                              <span className="text-muted-foreground">{gig.views} views</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-medium ${formatColor(gig.format)}`}>
                              <FmtIcon size={10} />{gig.format}
                            </span>
                            {gig.points > 0 && (
                              <span className="flex items-center gap-1 text-xs font-bold text-skill-green">
                                <Coins size={11} />+{gig.points} SP
                              </span>
                            )}
                            {gig.hot && <Flame size={14} className="text-alert-red" />}
                            <button onClick={(e) => { e.stopPropagation(); toggleLike(gig.id); }} className="text-muted-foreground hover:text-alert-red transition-colors">
                              <Heart size={14} className={liked.has(gig.id) ? "fill-alert-red text-alert-red" : ""} />
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
                  <AlertCircle size={36} className="mx-auto mb-4 text-muted-foreground/30" />
                  <p className="mb-1 text-foreground font-semibold">No gigs found</p>
                  <p className="mb-4 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveFormat("All Formats"); setEloRange("Any ELO"); setVerifiedFilter("All Users"); }} 
                    className="text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </section>

            {/* Load More */}
            {filtered.length > 0 && (
              <div className="mb-16 text-center">
                <motion.button 
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:bg-surface-1" 
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.99 }}
                >
                  <Loader2 size={14} className="animate-spin hidden" />
                  Load More Gigs <ArrowRight size={14} />
                </motion.button>
              </div>
            )}
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════════
            QUICK VIEW MODAL
        ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedGig && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center sm:p-4" 
              onClick={() => setSelectedGig(null)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl scrollbar-hide"
              >
                <button onClick={() => setSelectedGig(null)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>

                {/* Format Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${formatColor(selectedGig.format)}`}>
                    {(() => { const Icon = formatIcon(selectedGig.format); return <Icon size={12} />; })()}
                    {selectedGig.format}
                  </span>
                </div>

                {/* Seller */}
                <div className="mb-6 flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${eloTier(selectedGig.elo).border} ${eloTier(selectedGig.elo).bg} font-mono text-xl font-bold ${eloTier(selectedGig.elo).color} ${eloTier(selectedGig.elo).glow}`}>
                    {selectedGig.avatar}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xl font-bold text-foreground">
                      {selectedGig.seller}
                      {selectedGig.verified && <CheckCircle2 size={16} className="text-skill-green" />}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${eloTier(selectedGig.elo).color}`}>{eloTier(selectedGig.elo).label}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-sm text-muted-foreground">ELO {selectedGig.elo}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-badge-gold text-badge-gold" />
                        <span className="text-sm font-medium text-badge-gold">{selectedGig.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Offering / Wants */}
                <div className="mb-5 space-y-3">
                  <div className="rounded-xl bg-skill-green/5 border border-skill-green/15 p-4">
                    <span className="text-[10px] uppercase tracking-widest text-skill-green/70">Offering</span>
                    <p className="text-lg font-bold text-foreground">{selectedGig.skill}</p>
                  </div>
                  <div className="rounded-xl bg-court-blue/5 border border-court-blue/15 p-4">
                    <span className="text-[10px] uppercase tracking-widest text-court-blue/70">Looking For</span>
                    <p className="text-lg font-bold text-foreground/80">{selectedGig.wants}</p>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{selectedGig.desc}</p>

                {/* Meta tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />{selectedGig.posted}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
                    <Eye size={12} />{selectedGig.views} views
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
                    <CalendarDays size={12} />{selectedGig.deliveryDays}d delivery
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
                    <Handshake size={12} />{selectedGig.completedSwaps} swaps
                  </span>
                  {selectedGig.uni && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
                      <GraduationCap size={12} />{selectedGig.uni}
                    </span>
                  )}
                </div>

                {/* SP Balance */}
                {selectedGig.points > 0 && (
                  <div className="mb-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-skill-green/10 to-emerald-500/5 border border-skill-green/20 px-4 py-3">
                    <Coins size={18} className="text-skill-green" />
                    <div>
                      <p className="text-base font-bold text-skill-green">+{selectedGig.points} SP</p>
                      <p className="text-[11px] text-muted-foreground">Added to balance the exchange</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button 
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background shadow-lg" 
                    whileHover={{ scale: 1.01 }} 
                    whileTap={{ scale: 0.99 }}
                  >
                    <MessageSquare size={16} /> Propose Swap
                  </motion.button>
                  <motion.button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(selectedGig.id); }} 
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${liked.has(selectedGig.id) ? 'border-alert-red/30 bg-alert-red/10 text-alert-red' : 'border-border text-muted-foreground hover:text-alert-red hover:border-alert-red/30'}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Heart size={18} className={liked.has(selectedGig.id) ? "fill-current" : ""} />
                  </motion.button>
                  <motion.button 
                    onClick={(e) => { e.stopPropagation(); toggleSave(selectedGig.id); }} 
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${saved.has(selectedGig.id) ? 'border-badge-gold/30 bg-badge-gold/10 text-badge-gold' : 'border-border text-muted-foreground hover:text-badge-gold hover:border-badge-gold/30'}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Bookmark size={18} className={saved.has(selectedGig.id) ? "fill-current" : ""} />
                  </motion.button>
                  <motion.button 
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors" 
                    whileHover={{ scale: 1.02 }}
                  >
                    <Share2 size={18} />
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
