export interface Gig {
  id: number;
  skill: string;
  wants: string;
  points: number;
  seller: string;
  sellerId?: string;
  elo: number;
  rating: number;
  avatar: string;
  category: string;
  hot: boolean;
  format: string;
  posted: string;
  views: number;
  uni: string;
  verified: boolean;
  desc: string;
  deliveryDays: number;
  completedSwaps: number;
  currentBid?: number;
  bidCount?: number;
  endsIn?: number;
  guildName?: string;
  guildId?: string;
  requirements?: string[];
  tags?: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  leader: string;
  leaderElo: number;
  leaderAvatar: string;
  status: string;
  roles: { name: string; filled: boolean; filler?: string }[];
  totalSP: number;
  deadline: string;
  applicants: number;
  category: string;
}

export interface SkillFusion {
  id: number;
  title: string;
  description: string;
  participants: { name: string; skill: string; elo: number; avatar: string }[];
  lookingFor: string[];
  totalSP: number;
  complexity: string;
  duration: string;
}

export interface SPOnlyGig {
  id: number;
  skill: string;
  spPrice: number;
  seller: string;
  elo: number;
  rating: number;
  avatar: string;
  category: string;
  hot: boolean;
  posted: string;
  views: number;
  uni: string;
  verified: boolean;
  desc: string;
  deliveryDays: number;
  completedGigs: number;
}

export interface RequestItem {
  id: number;
  title: string;
  description: string;
  requester: string;
  requesterElo: number;
  offering: string;
  seeking: string;
  budget: number;
  responses: number;
  posted: string;
  spOnly?: boolean;
}

export interface FeaturedSeller {
  name: string;
  skill: string;
  elo: number;
  avatar: string;
  verified: boolean;
  swaps: number;
  rating: number;
  badge: string;
}

export const categories = [
  { label: "All", count: 48 },
  { label: "Design", count: 14 },
  { label: "Development", count: 12 },
  { label: "Writing", count: 7 },
  { label: "Video", count: 6 },
  { label: "Marketing", count: 5 },
  { label: "Music", count: 2 },
  { label: "Photography", count: 2 },
];

export const gigs: Gig[] = [
  { id: 1, skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, format: "Direct Swap", posted: "2h ago", views: 124, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. I specialize in minimal, modern brand identities.", deliveryDays: 5, completedSwaps: 47, guildName: "Design Collective", guildId: "g1", requirements: ["Brand brief", "Color preferences", "Example logos you like"], tags: ["logo", "brand", "minimal"] },
  { id: 2, skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 89, uni: "Stanford", verified: true, desc: "Full-stack Python/Django backend development. REST APIs, database design, and deployment.", deliveryDays: 7, completedSwaps: 82, requirements: ["API spec or wireframes", "Database schema sketch"], tags: ["python", "django", "api"] },
  { id: 3, skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 67, uni: "Harvard", verified: true, desc: "Professional video editing using Premiere Pro and After Effects.", deliveryDays: 4, completedSwaps: 23, currentBid: 45, bidCount: 8, endsIn: 180, tags: ["video", "editing", "premiere"] },
  { id: 4, skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: true, format: "Co-Creation", posted: "1h ago", views: 203, uni: "Georgia Tech", verified: true, desc: "Blender & Maya 3D modeling for games, AR/VR, and product visualization.", deliveryDays: 10, completedSwaps: 34, tags: ["3d", "blender", "maya"] },
  { id: 5, skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, format: "Direct Swap", posted: "8h ago", views: 45, uni: "UC Berkeley", verified: false, desc: "Data-driven SEO strategy including keyword research and analytics.", deliveryDays: 3, completedSwaps: 19, tags: ["seo", "marketing", "analytics"] },
  { id: 6, skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, format: "Skill Fusion", posted: "30m ago", views: 312, uni: "MIT", verified: true, desc: "Advanced data analysis with Python, R, and Tableau.", deliveryDays: 6, completedSwaps: 91, guildName: "Data Wizards", guildId: "g2", tags: ["data", "python", "tableau"] },
  { id: 7, skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", category: "Design", hot: false, format: "Direct Swap", posted: "12h ago", views: 78, uni: "", verified: false, desc: "Digital illustration — editorial, children's book, and character design.", deliveryDays: 7, completedSwaps: 28, tags: ["illustration", "digital art"] },
  { id: 8, skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, format: "Auction", posted: "3h ago", views: 156, uni: "Stanford", verified: true, desc: "Cinema 4D and After Effects motion graphics for explainers and ads.", deliveryDays: 5, completedSwaps: 56, currentBid: 55, bidCount: 12, endsIn: 90, tags: ["motion", "c4d", "after effects"] },
  { id: 9, skill: "Blog Writing", wants: "Logo Design", points: 10, seller: "Nina F.", elo: 1290, rating: 4.5, avatar: "NF", category: "Writing", hot: false, format: "Direct Swap", posted: "1d ago", views: 34, uni: "", verified: false, desc: "SEO-optimized blog writing for tech, lifestyle, and business.", deliveryDays: 2, completedSwaps: 15, tags: ["writing", "blog", "seo"] },
  { id: 10, skill: "Social Media Ads", wants: "Animation", points: 20, seller: "Tom W.", elo: 1510, rating: 4.8, avatar: "TW", category: "Marketing", hot: true, format: "Flash Market", posted: "45m ago", views: 234, uni: "Harvard", verified: true, desc: "Facebook, Instagram, and TikTok ad campaigns with proven ROI.", deliveryDays: 4, completedSwaps: 67, tags: ["ads", "social media", "roi"] },
  { id: 11, skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, format: "Projects", posted: "15m ago", views: 445, uni: "MIT", verified: true, desc: "Cross-platform mobile apps with React Native. Published 5 apps.", deliveryDays: 14, completedSwaps: 103, guildName: "Code Forge", guildId: "g3", tags: ["react native", "mobile", "ios", "android"] },
  { id: 12, skill: "Product Photography", wants: "Web Development", points: 25, seller: "Kate M.", elo: 1420, rating: 4.7, avatar: "KM", category: "Photography", hot: false, format: "Direct Swap", posted: "5h ago", views: 92, uni: "", verified: false, desc: "Studio and lifestyle product photography with professional retouching.", deliveryDays: 3, completedSwaps: 31, tags: ["photography", "product", "retouching"] },
  { id: 13, skill: "UX Research", wants: "Data Viz", points: 15, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: false, format: "Co-Creation", posted: "7h ago", views: 110, uni: "Stanford", verified: true, desc: "User research, usability testing, and persona development.", deliveryDays: 8, completedSwaps: 44, tags: ["ux", "research", "usability"] },
  { id: 14, skill: "Technical Writing", wants: "Frontend Dev", points: 20, seller: "Sam D.", elo: 1350, rating: 4.6, avatar: "SD", category: "Writing", hot: false, format: "Direct Swap", posted: "9h ago", views: 56, uni: "Georgia Tech", verified: true, desc: "API documentation and user guides for SaaS products.", deliveryDays: 5, completedSwaps: 22, tags: ["docs", "api", "technical"] },
  { id: 15, skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", category: "Design", hot: true, format: "Skill Fusion", posted: "2h ago", views: 178, uni: "UC Berkeley", verified: true, desc: "Game mechanics design, level design, and balancing for indie games.", deliveryDays: 12, completedSwaps: 38, tags: ["games", "level design", "balancing"] },
  { id: 16, skill: "API Development", wants: "Illustration", points: 35, seller: "Dev K.", elo: 1660, rating: 5.0, avatar: "DK", category: "Development", hot: false, format: "Direct Swap", posted: "4h ago", views: 98, uni: "MIT", verified: true, desc: "RESTful and GraphQL API development with Node.js, Go, or Python.", deliveryDays: 6, completedSwaps: 71, tags: ["api", "graphql", "nodejs"] },
  { id: 17, skill: "Podcast Editing", wants: "Thumbnail Design", points: 10, seller: "Zara N.", elo: 1280, rating: 4.5, avatar: "ZN", category: "Video", hot: false, format: "Flash Market", posted: "11h ago", views: 41, uni: "", verified: false, desc: "Podcast editing including noise removal, EQ, and show notes.", deliveryDays: 2, completedSwaps: 12, tags: ["podcast", "audio", "editing"] },
  { id: 18, skill: "Content Strategy", wants: "App Prototype", points: 40, seller: "Leo R.", elo: 1440, rating: 4.7, avatar: "LR", category: "Writing", hot: false, format: "Projects", posted: "6h ago", views: 87, uni: "Harvard", verified: true, desc: "Content strategy for startups — editorial calendars and voice guides.", deliveryDays: 10, completedSwaps: 29, tags: ["content", "strategy", "editorial"] },
  { id: 19, skill: "Music Production", wants: "Video Editing", points: 30, seller: "DJ Kael", elo: 1530, rating: 4.9, avatar: "DK", category: "Music", hot: true, format: "Direct Swap", posted: "1h ago", views: 189, uni: "", verified: false, desc: "Beat production, mixing, and mastering across genres.", deliveryDays: 4, completedSwaps: 45, tags: ["music", "production", "mixing"] },
  { id: 20, skill: "Brand Photography", wants: "Social Media Mgmt", points: 20, seller: "Iris V.", elo: 1410, rating: 4.7, avatar: "IV", category: "Photography", hot: false, format: "Auction", posted: "3h ago", views: 73, uni: "", verified: false, desc: "Brand and lifestyle photography for e-commerce and campaigns.", deliveryDays: 5, completedSwaps: 26, currentBid: 30, bidCount: 5, endsIn: 240, tags: ["photography", "brand", "lifestyle"] },
  { id: 21, skill: "Machine Learning", wants: "UX Design", points: 55, seller: "Victor Z.", elo: 1780, rating: 5.0, avatar: "VZ", category: "Development", hot: true, format: "Skill Fusion", posted: "20m ago", views: 521, uni: "MIT", verified: true, desc: "ML model development, NLP, computer vision. Published researcher.", deliveryDays: 14, completedSwaps: 67, guildName: "Data Wizards", guildId: "g2", tags: ["ml", "nlp", "computer vision"] },
  { id: 22, skill: "Songwriting", wants: "Graphic Design", points: 15, seller: "Melody P.", elo: 1340, rating: 4.6, avatar: "MP", category: "Music", hot: false, format: "Direct Swap", posted: "8h ago", views: 62, uni: "", verified: false, desc: "Original songwriting for commercials, indie films, and projects.", deliveryDays: 7, completedSwaps: 18, tags: ["songwriting", "composition"] },
  { id: 23, skill: "Infographic Design", wants: "Python Scripts", points: 20, seller: "Tara J.", elo: 1470, rating: 4.8, avatar: "TJ", category: "Design", hot: false, format: "Direct Swap", posted: "5h ago", views: 88, uni: "UC Berkeley", verified: true, desc: "Data visualization and infographic design for reports.", deliveryDays: 4, completedSwaps: 35, tags: ["infographic", "data viz"] },
  { id: 24, skill: "Cloud Architecture", wants: "Brand Strategy", points: 60, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, format: "Projects", posted: "10m ago", views: 634, uni: "Stanford", verified: true, desc: "AWS/GCP cloud architecture, DevOps pipelines, and IaC.", deliveryDays: 21, completedSwaps: 89, guildName: "Code Forge", guildId: "g3", tags: ["cloud", "aws", "devops"] },
  { id: 25, skill: "Copywriting", wants: "Motion Graphics", points: 15, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, format: "Flash Market", posted: "2h ago", views: 94, uni: "Harvard", verified: true, desc: "Conversion-focused copywriting for landing pages and emails.", deliveryDays: 3, completedSwaps: 41, tags: ["copywriting", "conversion"] },
  { id: 26, skill: "Digital Ads", wants: "App Development", points: 25, seller: "Rita G.", elo: 1480, rating: 4.8, avatar: "RG", category: "Marketing", hot: false, format: "Co-Creation", posted: "4h ago", views: 112, uni: "Georgia Tech", verified: true, desc: "Google Ads and Meta Ads with A/B testing and optimization.", deliveryDays: 5, completedSwaps: 53, tags: ["ads", "google", "meta"] },
  { id: 27, skill: "Figma Prototyping", wants: "Backend Dev", points: 30, seller: "Suki T.", elo: 1540, rating: 4.9, avatar: "ST", category: "Design", hot: true, format: "Direct Swap", posted: "1h ago", views: 201, uni: "MIT", verified: true, desc: "High-fidelity Figma prototypes with interactive design systems.", deliveryDays: 6, completedSwaps: 62, tags: ["figma", "prototype", "design system"] },
  { id: 28, skill: "Video Production", wants: "Data Analysis", points: 35, seller: "Finn B.", elo: 1590, rating: 4.9, avatar: "FB", category: "Video", hot: false, format: "Auction", posted: "6h ago", views: 143, uni: "Stanford", verified: true, desc: "End-to-end video production — scripting, filming, and grading.", deliveryDays: 10, completedSwaps: 48, currentBid: 60, bidCount: 9, endsIn: 120, tags: ["video", "production", "filming"] },
  { id: 29, skill: "Cybersecurity Audit", wants: "Design System", points: 45, seller: "Hack M.", elo: 1700, rating: 5.0, avatar: "HM", category: "Development", hot: true, format: "Skill Fusion", posted: "45m ago", views: 387, uni: "Caltech", verified: true, desc: "Penetration testing and security hardening for web apps.", deliveryDays: 7, completedSwaps: 54, tags: ["security", "pentest", "hardening"] },
  { id: 30, skill: "Typography Design", wants: "SEO Strategy", points: 20, seller: "Vera L.", elo: 1430, rating: 4.7, avatar: "VL", category: "Design", hot: false, format: "Direct Swap", posted: "7h ago", views: 69, uni: "UC Berkeley", verified: false, desc: "Custom typeface design for brand identities.", deliveryDays: 14, completedSwaps: 21, tags: ["typography", "typeface", "font"] },
];

export const projects: Project[] = [
  {
    id: 101, title: "SaaS Dashboard MVP",
    description: "Build a complete analytics dashboard with authentication, real-time charts, and user management.",
    leader: "Chen L.", leaderElo: 1750, leaderAvatar: "CL", status: "Recruiting",
    roles: [
      { name: "Lead Developer", filled: true, filler: "Chen L." },
      { name: "UI/UX Designer", filled: true, filler: "Maya K." },
      { name: "Backend Engineer", filled: false },
      { name: "DevOps", filled: false },
    ],
    totalSP: 200, deadline: "2026-04-15", applicants: 12, category: "Development"
  },
  {
    id: 102, title: "Indie Game Launch",
    description: "2D platformer game needing art, music, and marketing for Steam launch.",
    leader: "Alex F.", leaderElo: 1490, leaderAvatar: "AF", status: "In Progress",
    roles: [
      { name: "Game Designer", filled: true, filler: "Alex F." },
      { name: "Pixel Artist", filled: true, filler: "Lena S." },
      { name: "Composer", filled: true, filler: "DJ Kael" },
      { name: "Marketing Lead", filled: false },
    ],
    totalSP: 150, deadline: "2026-05-01", applicants: 8, category: "Design"
  },
  {
    id: 103, title: "E-commerce Rebrand",
    description: "Complete rebrand for fashion e-commerce — new logo, photography, copy, and website redesign.",
    leader: "Maya K.", leaderElo: 1450, leaderAvatar: "MK", status: "Recruiting",
    roles: [
      { name: "Brand Designer", filled: true, filler: "Maya K." },
      { name: "Photographer", filled: false },
      { name: "Copywriter", filled: false },
      { name: "Web Developer", filled: false },
    ],
    totalSP: 180, deadline: "2026-04-20", applicants: 15, category: "Design"
  },
];

export const skillFusions: SkillFusion[] = [
  {
    id: 201, title: "AI-Powered Design Tool",
    description: "Combining ML expertise with UX design to create an intelligent design assistant prototype.",
    participants: [
      { name: "Victor Z.", skill: "Machine Learning", elo: 1780, avatar: "VZ" },
      { name: "Priya S.", skill: "UX Research", elo: 1580, avatar: "PS" },
    ],
    lookingFor: ["Frontend Development", "Product Strategy"],
    totalSP: 120, complexity: "Advanced", duration: "4 weeks"
  },
  {
    id: 202, title: "Security + Branding Package",
    description: "Comprehensive security audit paired with brand identity refresh for tech startups.",
    participants: [
      { name: "Hack M.", skill: "Cybersecurity", elo: 1700, avatar: "HM" },
      { name: "Maya K.", skill: "Brand Design", elo: 1450, avatar: "MK" },
    ],
    lookingFor: ["Copywriting"],
    totalSP: 90, complexity: "Intermediate", duration: "2 weeks"
  },
  {
    id: 203, title: "Data Storytelling Suite",
    description: "Data analysis + infographic design + video explainer — tell your data story end-to-end.",
    participants: [
      { name: "Raj P.", skill: "Data Analysis", elo: 1720, avatar: "RP" },
      { name: "Tara J.", skill: "Infographics", elo: 1470, avatar: "TJ" },
    ],
    lookingFor: ["Video Editing", "Narration"],
    totalSP: 100, complexity: "Intermediate", duration: "3 weeks"
  },
];

export const spOnlyGigs: SPOnlyGig[] = [
  { id: 401, skill: "Logo Design", spPrice: 80, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, posted: "1h ago", views: 234, uni: "MIT", verified: true, desc: "Professional logo design with 3 revision rounds. Pure SP purchase.", deliveryDays: 5, completedGigs: 47 },
  { id: 402, skill: "Python Backend API", spPrice: 150, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", category: "Development", hot: true, posted: "2h ago", views: 189, uni: "Stanford", verified: true, desc: "Full REST API development with documentation. Pay with SP only.", deliveryDays: 7, completedGigs: 82 },
  { id: 403, skill: "Video Editing", spPrice: 60, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", category: "Video", hot: false, posted: "3h ago", views: 98, uni: "Harvard", verified: true, desc: "Professional video editing for YouTube, TikTok, or Instagram.", deliveryDays: 3, completedGigs: 23 },
  { id: 404, skill: "React Dashboard", spPrice: 200, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", category: "Development", hot: true, posted: "45m ago", views: 312, uni: "MIT", verified: true, desc: "Complete React dashboard with charts, auth, and responsive design.", deliveryDays: 10, completedGigs: 103 },
  { id: 405, skill: "SEO Strategy", spPrice: 45, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", category: "Marketing", hot: false, posted: "4h ago", views: 67, uni: "UC Berkeley", verified: false, desc: "Comprehensive SEO audit and strategy document.", deliveryDays: 4, completedGigs: 19 },
  { id: 406, skill: "Mobile App Design", spPrice: 120, seller: "Priya S.", elo: 1580, rating: 4.9, avatar: "PS", category: "Design", hot: true, posted: "30m ago", views: 278, uni: "Stanford", verified: true, desc: "Complete mobile app UI/UX design in Figma.", deliveryDays: 6, completedGigs: 44 },
  { id: 407, skill: "Copywriting", spPrice: 35, seller: "Jules C.", elo: 1360, rating: 4.7, avatar: "JC", category: "Writing", hot: false, posted: "5h ago", views: 54, uni: "Harvard", verified: true, desc: "Landing page copy, email sequences, or ad copy.", deliveryDays: 2, completedGigs: 41 },
  { id: 408, skill: "3D Modeling", spPrice: 90, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", category: "Design", hot: false, posted: "2h ago", views: 145, uni: "Georgia Tech", verified: true, desc: "3D models for games, AR/VR, or product visualization.", deliveryDays: 7, completedGigs: 34 },
  { id: 409, skill: "Data Analysis", spPrice: 100, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", category: "Development", hot: true, posted: "1h ago", views: 198, uni: "MIT", verified: true, desc: "Data analysis with Python/R, Tableau dashboards included.", deliveryDays: 5, completedGigs: 91 },
  { id: 410, skill: "Brand Identity", spPrice: 150, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", category: "Design", hot: true, posted: "20m ago", views: 167, uni: "MIT", verified: true, desc: "Complete brand identity: logo, colors, typography, guidelines.", deliveryDays: 8, completedGigs: 47 },
  { id: 411, skill: "Motion Graphics", spPrice: 85, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", category: "Video", hot: false, posted: "3h ago", views: 123, uni: "Stanford", verified: true, desc: "Animated explainer videos or social media clips.", deliveryDays: 4, completedGigs: 56 },
  { id: 412, skill: "Cloud Setup", spPrice: 180, seller: "Niko A.", elo: 1800, rating: 5.0, avatar: "NA", category: "Development", hot: true, posted: "15m ago", views: 421, uni: "Stanford", verified: true, desc: "AWS/GCP setup, CI/CD pipelines, infrastructure as code.", deliveryDays: 5, completedGigs: 89 },
];

export const requests: RequestItem[] = [
  { id: 301, title: "Need React Dev for Portfolio", description: "I can offer logo design and brand identity work", requester: "Maya K.", requesterElo: 1450, offering: "Logo Design", seeking: "React Development", budget: 40, responses: 7, posted: "1h ago" },
  { id: 302, title: "Looking for Video Editor", description: "Have Python/Django skills to trade for promo video editing", requester: "James T.", requesterElo: 1680, offering: "Backend Development", seeking: "Video Editing", budget: 25, responses: 4, posted: "3h ago" },
  { id: 303, title: "Content Writer Needed", description: "Offering SEO strategy consultation in exchange", requester: "Emma L.", requesterElo: 1400, offering: "SEO Strategy", seeking: "Blog Writing", budget: 15, responses: 2, posted: "5h ago" },
  { id: 304, title: "UI Designer for App Mockups", description: "Can provide ML model development/integration", requester: "Victor Z.", requesterElo: 1780, offering: "Machine Learning", seeking: "UI/UX Design", budget: 50, responses: 11, posted: "30m ago" },
  { id: 305, title: "SP Purchase: Logo + Business Cards", description: "Paying 100 SP for complete brand starter kit", requester: "Startup Inc.", requesterElo: 1200, offering: "100 SP", seeking: "Brand Design", budget: 100, responses: 9, posted: "2h ago", spOnly: true },
  { id: 306, title: "SP Purchase: Landing Page", description: "Paying 120 SP for responsive landing page", requester: "Product Co.", requesterElo: 1150, offering: "120 SP", seeking: "Web Development", budget: 120, responses: 6, posted: "4h ago", spOnly: true },
];

export const featuredSellers: FeaturedSeller[] = [
  { name: "Victor Z.", skill: "Machine Learning", elo: 1780, avatar: "VZ", verified: true, swaps: 67, rating: 5.0, badge: "Top Rated" },
  { name: "Chen L.", skill: "Mobile Development", elo: 1750, avatar: "CL", verified: true, swaps: 103, rating: 5.0, badge: "Rising Star" },
  { name: "Niko A.", skill: "Cloud Architecture", elo: 1800, avatar: "NA", verified: true, swaps: 89, rating: 5.0, badge: "Expert" },
  { name: "Raj P.", skill: "Data Analysis", elo: 1720, avatar: "RP", verified: true, swaps: 91, rating: 5.0, badge: "Consistent" },
  { name: "James T.", skill: "Backend Dev", elo: 1680, avatar: "JT", verified: true, swaps: 82, rating: 5.0, badge: "Reliable" },
];

export const aiSuggestions = [
  "Design a logo for my startup",
  "Build a React dashboard",
  "Edit a YouTube video",
  "Write blog posts for SaaS",
  "Create social media ads",
  "Build a mobile app",
  "Security audit my site",
  "Make an explainer video",
];

export const modes = [
  { label: "Explore", key: "explore", badge: null },
  { label: "Trending", key: "trending", badge: "HOT" },
  { label: "SP Only", key: "sp-only", badge: "BUY" },
  { label: "Auctions", key: "auctions", badge: "LIVE" },
  { label: "Co-Creation", key: "cocreation", badge: null },
  { label: "Skill Fusion", key: "fusion", badge: "NEW" },
  { label: "Projects", key: "projects", badge: null },
  { label: "Flash Market", key: "flash", badge: "2.5x" },
  { label: "Requests", key: "requests", badge: null },
  { label: "For You", key: "recommended", badge: "AI" },
] as const;

export type MarketplaceMode = typeof modes[number]["key"];
