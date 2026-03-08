import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, ArrowLeftRight, Gavel, Users, Layers, FolderKanban, Shield, Star,
  Target, Trophy, Flame, Medal, Swords, Scale, Bot, GraduationCap,
  Zap, MessageSquare, PenTool, Video, FolderOpen, CheckCircle2, Sparkles,
  Building2, Search, Clock, Timer, Eye, Lock, FileText, TrendingUp,
  ArrowRight, ChevronRight, BarChart3, Gauge, GitBranch, Globe, Heart,
  Lightbulb, Mic, MonitorPlay, Palette, RefreshCw, Send, Settings,
  Smartphone, Workflow, Crown, Gem, Award
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const featureCategories = [
  { id: "economy", label: "Skill Points", icon: Coins, color: "text-badge-gold", bg: "bg-badge-gold/10", tagline: "The internal currency powering fair exchanges" },
  { id: "formats", label: "Gig Formats", icon: ArrowLeftRight, color: "text-court-blue", bg: "bg-court-blue/10", tagline: "7 ways to exchange skills" },
  { id: "workspace", label: "Workspace", icon: MessageSquare, color: "text-foreground", bg: "bg-surface-2", tagline: "Your collaborative command center" },
  { id: "trust", label: "Trust & Quality", icon: Shield, color: "text-skill-green", bg: "bg-skill-green/10", tagline: "Multi-layered protection for every exchange" },
  { id: "gamification", label: "Gamification", icon: Trophy, color: "text-badge-gold", bg: "bg-badge-gold/10", tagline: "Level up, earn badges, climb ranks" },
  { id: "guilds", label: "Guilds", icon: Users, color: "text-court-blue", bg: "bg-court-blue/10", tagline: "Team up and conquer together" },
  { id: "court", label: "Skill Court", icon: Scale, color: "text-alert-red", bg: "bg-alert-red/10", tagline: "Fair, transparent dispute resolution" },
  { id: "ai", label: "AI Integration", icon: Bot, color: "text-foreground", bg: "bg-surface-2", tagline: "Intelligence woven into every feature" },
  { id: "enterprise", label: "Enterprise", icon: Building2, color: "text-foreground", bg: "bg-surface-2", tagline: "Vetted talent for your business" },
];

const featureMap: Record<string, {
  hero: { title: string; subtitle: string; stat?: { value: string; label: string }[] };
  features: Array<{ icon: any; title: string; desc: string; highlight?: boolean }>;
  workflow?: Array<{ step: string; desc: string }>;
  bottomCTA?: { text: string; link: string };
}> = {
  economy: {
    hero: {
      title: "Skill Points Economy",
      subtitle: "A self-sustaining economy where skills have real value. Earn, spend, and grow your points through platform activity — not your wallet.",
      stat: [
        { value: "100 SP", label: "Signup bonus" },
        { value: "5%", label: "Transaction tax" },
        { value: "7+", label: "Earning methods" },
      ],
    },
    features: [
      { icon: Coins, title: "Instant Signup Bonus", desc: "Every new account starts with 100 Skill Points — enough to begin your first exchange immediately. No credit card, no waiting.", highlight: true },
      { icon: ArrowLeftRight, title: "Fair Value Balancing", desc: "When skills have different market values, points balance the gap automatically. A 2-hour logo design might equal 1 hour of coding plus 15 SP." },
      { icon: Shield, title: "Anti-Inflation Tax", desc: "Both parties are taxed 5% on completion. This prevents point hoarding, funds platform operations, and maintains a healthy, circulating economy." },
      { icon: Zap, title: "Multiple Earning Paths", desc: "Referrals (+50 SP), court duty (+10 SP), achievements (5–100 SP), daily challenges (+15 SP), streak bonuses (1.5x–3x multiplier), and Guild War winnings." },
      { icon: Target, title: "Stage Insurance", desc: "Points are locked in escrow per stage. If someone abandons mid-gig, you keep all points for completed stages. Zero risk of total loss." },
      { icon: BarChart3, title: "Market Intelligence", desc: "AI analyzes demand, complexity, and historical pricing to recommend fair point values. See real-time market rates for any skill before setting your price." },
      { icon: TrendingUp, title: "Dynamic Pricing", desc: "Gig values fluctuate based on supply and demand. High-demand skills command premium rates. AI alerts you when your skills are trending." },
      { icon: RefreshCw, title: "Point Circulation", desc: "Tax revenue funds platform challenges, Guild War prizes, and seasonal events — keeping points flowing back to active users." },
    ],
    workflow: [
      { step: "Earn", desc: "Complete gigs, maintain streaks, win challenges" },
      { step: "Spend", desc: "Hire talent, bid on auctions, fund projects" },
      { step: "Grow", desc: "Reinvest in skills, unlock premium features" },
    ],
    bottomCTA: { text: "Start earning Skill Points", link: "/signup" },
  },
  formats: {
    hero: {
      title: "7 Gig Formats",
      subtitle: "Not every exchange is the same. Choose from seven distinct formats designed for different collaboration styles, from quick swaps to full product builds.",
      stat: [
        { value: "7", label: "Unique formats" },
        { value: "3x", label: "Flash bonus" },
        { value: "∞", label: "Possibilities" },
      ],
    },
    features: [
      { icon: ArrowLeftRight, title: "Direct Swap", desc: "The classic 1-on-1 skill exchange. Trade your web development for someone's graphic design. Points balance any value difference. Both taxed 5% on completion.", highlight: true },
      { icon: Gavel, title: "Auction", desc: "Post a task and let creators compete. Receive multiple submissions, review quality, and award the winner the most points. Runners-up earn partial rewards." },
      { icon: Users, title: "Co-Creation Studio", desc: "Multi-person collaborative workspace with real-time whiteboard, video calls, and shared file library. Points split by role contribution. Built for complex, multi-skill projects." },
      { icon: Layers, title: "Skill Fusion", desc: "Multi-skill gigs where a single polymath or team of specialists collaborate. One person with UX + coding skills handles an entire app prototype." },
      { icon: FolderKanban, title: "Projects", desc: "Full product builds broken into sub-gigs with individual workspaces, milestone tracking, and team management. Enterprise-grade project delivery." },
      { icon: Timer, title: "Flash Market", desc: "Time-limited gigs with 1.5x–3x point multipliers. They expire within hours, creating urgency and rewarding speed. Perfect for quick wins." },
      { icon: TrendingUp, title: "Subscription Gigs", desc: "Set up recurring exchanges — weekly content creation for weekly design work. Both parties commit to a cadence with auto-renewal." },
      { icon: Layers, title: "Gig Bundling", desc: "Package multiple small tasks together for efficiency. Bundle 'logo + business card + social headers' into one streamlined exchange." },
      { icon: Coins, title: "Skill Rental", desc: "Pay points for consultation time. Not a full gig — just rent someone's expertise for 30–60 minute sessions. Great for quick advice." },
    ],
    bottomCTA: { text: "Explore the Marketplace", link: "/marketplace" },
  },
  workspace: {
    hero: {
      title: "Collaborative Workspace",
      subtitle: "Every gig gets a dedicated workspace with real-time communication, collaborative tools, and AI-powered quality assurance — all in one place.",
      stat: [
        { value: "5+", label: "Built-in tools" },
        { value: "Real-time", label: "Collaboration" },
        { value: "AI", label: "Quality checks" },
      ],
    },
    features: [
      { icon: MessageSquare, title: "Smart Messenger", desc: "Real-time chat with auto-translation (50+ languages), voice notes, file sharing, threaded conversations, reactions, and Discord-style formatting. Never miss a message.", highlight: true },
      { icon: PenTool, title: "Live Whiteboard", desc: "Built-in tldraw canvas for real-time brainstorming, wireframing, and visual collaboration. Draw, annotate, and iterate together in real time." },
      { icon: Video, title: "Video Conferencing", desc: "Peer-to-peer video with HD quality, screen sharing, virtual backgrounds, and automatic recording. All calls saved to the workspace file library." },
      { icon: FolderOpen, title: "File Library", desc: "All shared files organized chronologically with version history, search, and preview. Supports 100+ file formats. Automatic backup and 90-day retention." },
      { icon: CheckCircle2, title: "Stage Tracker", desc: "Visual progress tracking with point allocation per stage. Built-in insurance ensures you keep points for completed work even if the other party abandons." },
      { icon: Sparkles, title: "AI Quality Panel", desc: "Real-time plagiarism detection, quality scoring (0–100), predicted buyer satisfaction, version comparison, and delivery compliance checking." },
      { icon: FileText, title: "Deliverable Submission", desc: "Submit final work through a structured process with AI quality checks, optional guild pre-approval, and buyer acceptance workflow." },
    ],
    bottomCTA: { text: "See it in action", link: "/how-it-works" },
  },
  trust: {
    hero: {
      title: "Trust & Quality System",
      subtitle: "Six layers of protection ensure every exchange is fair, authentic, and high-quality. From AI monitoring to public verification.",
      stat: [
        { value: "6", label: "Protection layers" },
        { value: "< 1%", label: "Fraud rate" },
        { value: "24/7", label: "AI monitoring" },
      ],
    },
    features: [
      { icon: Eye, title: "Progressive Work Reveal", desc: "Work shown in stages so buyers see real progress. AI predicts satisfaction at each stage. If something's off, course-correct early — not at final delivery.", highlight: true },
      { icon: Lock, title: "Transaction Codes", desc: "Every completed gig gets a unique, public verification code. Anyone can look up a transaction to confirm it happened, view quality scores, and verify authenticity." },
      { icon: Shield, title: "Digital Fingerprinting", desc: "All deliverables contain invisible digital fingerprints for authenticity verification. Proves ownership and protects against unauthorized redistribution." },
      { icon: Star, title: "Verified Reviews", desc: "Both parties rate only after completion and deliverable verification. Reviews include star ratings and written feedback. AI detects coordinated manipulation." },
      { icon: Target, title: "Reputation Insurance", desc: "High-ELO users (Platinum+) get priority in disputes, reduced tax rates, and enhanced credibility badges. Your reputation is an asset that earns dividends." },
      { icon: Bot, title: "AI Scam Detection", desc: "Pattern recognition monitors for fake accounts, suspicious behavior, rating manipulation, and plagiarism. Flagged accounts are reviewed within hours." },
    ],
    bottomCTA: { text: "Verify a transaction", link: "/transaction" },
  },
  gamification: {
    hero: {
      title: "Gamification Engine",
      subtitle: "Turn skill development into a game. Earn ELO, climb tiers, unlock achievements, maintain streaks, and compete in seasonal events.",
      stat: [
        { value: "5", label: "Lifetime tiers" },
        { value: "50+", label: "Achievements" },
        { value: "3x", label: "Max streak bonus" },
      ],
    },
    features: [
      { icon: Target, title: "ELO Rating System", desc: "Chess-inspired rating that reflects skill and reliability. Affects search ranking, court eligibility, feature unlocks, and matchmaking. Win gigs to climb, lose to drop.", highlight: true },
      { icon: Medal, title: "Skill Mastery Levels", desc: "Per-skill progression: Beginner → Intermediate → Advanced → Expert → Master. Each level requires more gigs and higher quality scores. Masters get premium marketplace placement." },
      { icon: Trophy, title: "50+ Achievements", desc: "Badges for milestones with real benefits. 'Century Club' (100 gigs) reduces tax. 'Perfectionist' (10 perfect scores) unlocks priority matching. Each badge is beautifully designed." },
      { icon: Flame, title: "Daily Streaks", desc: "Complete at least one gig activity daily. 7-day = 1.5x points, 14-day = 2x, 30-day = 3x multiplier. Breaking a streak resets your multiplier to 1x." },
      { icon: Swords, title: "Guild Wars", desc: "Weekly guild competitions on metrics like completion rate, quality scores, and member growth. Winning guilds earn treasury bonuses and exclusive seasonal badges." },
      { icon: Crown, title: "Lifetime Tiers", desc: "Bronze → Silver → Gold → Platinum → Diamond. Each tier unlocks features: Gold gets reduced tax, Platinum gets priority support, Diamond gets exclusive beta features." },
      { icon: Sparkles, title: "Quarterly Wraps", desc: "Every 3 months, a beautiful visual summary of your activity — gigs completed, points earned, skills grown, top collaborators, rank changes, and fun stats." },
      { icon: Award, title: "Milestone Celebrations", desc: "Animated celebrations on key milestones: 1st gig, 10th gig, 100th gig, 1000 SP earned, reaching Gold tier, and more. Share your achievements socially." },
    ],
    bottomCTA: { text: "View the Leaderboard", link: "/leaderboard" },
  },
  guilds: {
    hero: {
      title: "Guild System",
      subtitle: "Form teams, pool resources, compete together, and build a collective reputation. Guilds are the social backbone of SkillSwappr.",
      stat: [
        { value: "50+", label: "Active guilds" },
        { value: "Treasury", label: "Shared economy" },
        { value: "Wars", label: "Weekly events" },
      ],
    },
    features: [
      { icon: Coins, title: "Shared Treasury", desc: "Pool Skill Points into a collective fund. Treasury covers member taxes, funds training gigs, and grows through Guild War winnings. Democratic allocation voting.", highlight: true },
      { icon: ArrowLeftRight, title: "Point Lending", desc: "Members can borrow from the treasury for gigs they can't afford. Points are automatically repaid from their next earnings. Interest-free within the guild." },
      { icon: FolderKanban, title: "Gig Delegation", desc: "Guild leaders receive incoming project requests and delegate tasks to the right specialist. Members get matched based on skill, availability, and ELO." },
      { icon: Swords, title: "Guild Wars", desc: "Weekly competitive events. Guilds are matched by collective ELO for fair matchups. Metrics: completion rate, quality scores, member activity. Winners get treasury bonuses." },
      { icon: CheckCircle2, title: "Quality Control", desc: "Guild members can review each other's deliverables before submission. Internal QA catches issues early and maintains the guild's reputation." },
      { icon: Target, title: "Collective ELO", desc: "Guild rating is the weighted average of member ELOs. Higher guild ELO means better war matchmaking, premium marketplace placement, and enterprise visibility." },
      { icon: FolderOpen, title: "Guild Portfolio", desc: "A public showcase page with the guild's best work, member profiles, collective stats, war history, and client testimonials. Your guild's storefront." },
    ],
    bottomCTA: { text: "Find a Guild", link: "/marketplace" },
  },
  court: {
    hero: {
      title: "Skill Court",
      subtitle: "When disputes arise, Skill Court provides fair, transparent resolution with a hybrid panel of community members, AI analysis, and domain experts.",
      stat: [
        { value: "48h", label: "Avg resolution" },
        { value: "3-panel", label: "Hybrid judges" },
        { value: "1", label: "Appeal allowed" },
      ],
    },
    features: [
      { icon: Scale, title: "Hybrid Judging Panel", desc: "25% community users (randomly selected from eligible pool), 25% AI analysis (evidence review, pattern detection), 50% high-ELO domain experts. Balanced and fair.", highlight: true },
      { icon: Bot, title: "AI Evidence Analysis", desc: "AI reviews all workspace data: messages, files, video recordings, stage completions, and deliverables. Detects patterns, identifies inconsistencies, and provides unbiased assessment." },
      { icon: GraduationCap, title: "Expert Panels", desc: "Judges are matched by skill relevance. A design dispute gets design experts. Minimum Gold tier required. Experts earn points and ELO for service." },
      { icon: Shield, title: "Appeal System", desc: "Each party gets one appeal per case. Appeals are reviewed by a higher-ELO panel (Platinum+ judges). Appeal panel decisions are final and binding." },
      { icon: Coins, title: "Judge Rewards", desc: "Community judges earn 10 SP per case. Expert judges earn 25 SP. Consistent, fair judging boosts your judge ELO and unlocks Judge badges." },
      { icon: Target, title: "ELO Impact", desc: "Verdicts adjust both parties' ELO proportionally to case severity. Repeat offenders face escalating ELO penalties. Clean records earn stability bonuses." },
      { icon: Users, title: "Community Duty", desc: "Free tier users must serve as judges when called — it's part of the community contract. Declining reduces your gig privileges. Serving earns rewards." },
    ],
    bottomCTA: { text: "Learn more about disputes", link: "/help" },
  },
  ai: {
    hero: {
      title: "AI Integration",
      subtitle: "AI isn't a feature — it's woven into every layer. From gig creation to dispute resolution, intelligence augments every interaction.",
      stat: [
        { value: "6", label: "Integration points" },
        { value: "Real-time", label: "Analysis" },
        { value: "50+", label: "Languages" },
      ],
    },
    features: [
      { icon: Sparkles, title: "Smart Gig Creation", desc: "AI suggests optimal pricing, predicts demand, recommends timing, and writes compelling gig descriptions. Dynamic pricing updates based on real-time market conditions.", highlight: true },
      { icon: Bot, title: "Workspace Intelligence", desc: "Quality checks on deliverables, plagiarism detection across the internet, version comparison highlighting changes, and delivery compliance verification against gig requirements." },
      { icon: Scale, title: "Court Analysis", desc: "AI serves as 25% of the judging panel. Reviews all evidence, detects behavioral patterns, checks for bias, and provides structured, data-driven recommendations." },
      { icon: Target, title: "Profile Optimization", desc: "Portfolio improvement suggestions, skill gap analysis, case study generation help, and personalized recommendations for what to learn next based on market trends." },
      { icon: Search, title: "Semantic Search", desc: "Natural language search across the marketplace. Ask 'I need someone who can build a React app with animations' and get intelligent matches, not just keyword results." },
      { icon: Shield, title: "Trust & Safety AI", desc: "24/7 behavioral monitoring, fake account detection, scam pattern recognition, review manipulation flagging, and content moderation across all platform interactions." },
    ],
    bottomCTA: { text: "Experience AI matching", link: "/marketplace" },
  },
  enterprise: {
    hero: {
      title: "Enterprise Mode",
      subtitle: "Access vetted, high-ELO student talent with enterprise-grade security, project management, and seamless hire-to-full-time pipelines.",
      stat: [
        { value: "1000+", label: "Vetted experts" },
        { value: "NDA", label: "Built-in" },
        { value: "API", label: "Custom integration" },
      ],
    },
    features: [
      { icon: Building2, title: "Vetted Expert Pool", desc: "Access curated talent: minimum Gold tier (1000+ ELO), 4.5+ star rating, 50+ completed gigs, and AI quality assessment. Additional background checks for sensitive projects.", highlight: true },
      { icon: Search, title: "AI-Powered Matching", desc: "Describe your project requirements and our AI matches you with the best-fit experts based on skills, availability, past performance, and communication style." },
      { icon: Users, title: "Direct Hire Pipeline", desc: "Track candidate performance across multiple gigs. When ready, convert to a full-time offer with comprehensive performance data. From gig to hire, seamlessly." },
      { icon: Shield, title: "NDA & IP Protection", desc: "Automatic NDA coverage on all enterprise gigs. Full IP transfer agreements available through our legal team. Digital fingerprinting ensures ownership verification." },
      { icon: FolderKanban, title: "Project Dashboard", desc: "Full project management with milestone tracking, team analytics, budget monitoring, quality metrics, and real-time status updates across all active gigs." },
      { icon: Settings, title: "Custom Integrations", desc: "Connect with Slack, Jira, Notion, GitHub, Figma, and 50+ tools via API. Custom webhook configurations and dedicated integration support included." },
    ],
    bottomCTA: { text: "Request a demo", link: "/enterprise" },
  },
};

const FeaturesPage = () => {
  const [active, setActive] = useState("economy");
  const currentCategory = featureCategories.find((c) => c.id === active)!;
  const currentData = featureMap[active];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--silver)/0.05),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">Platform Features</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              Everything You Need to{" "}<span className="text-muted-foreground">Swap Skills</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto max-w-xl text-lg text-muted-foreground">
              9 feature categories, 60+ capabilities. Explore every tool, system, and innovation powering the SkillSwappr platform.
            </motion.p>
          </div>
        </section>

        {/* Sticky Category Tabs */}
        <div className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 scrollbar-hide">
            {featureCategories.map((cat) => (
              <motion.button key={cat.id} onClick={() => setActive(cat.id)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${active === cat.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                <cat.icon size={14} />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feature Content */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                {/* Section Hero */}
                <div className="mb-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${currentCategory.bg}`}>
                      <currentCategory.icon size={28} className={currentCategory.color} />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-foreground">{currentData.hero.title}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{currentData.hero.subtitle}</p>
                    </div>
                  </div>
                  {currentData.hero.stat && (
                    <div className="flex gap-6">
                      {currentData.hero.stat.map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="font-heading text-2xl font-black text-foreground">{s.value}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feature Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {currentData.features.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`group rounded-2xl border p-6 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--silver)/0.06)] ${
                        feature.highlight
                          ? "border-foreground/20 bg-foreground/[0.03] sm:col-span-2 lg:col-span-1"
                          : "border-border bg-card hover:border-foreground/20"
                      }`}
                    >
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                        feature.highlight ? `${currentCategory.bg} ${currentCategory.color}` : "bg-surface-2 text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground"
                      }`}>
                        <feature.icon size={20} />
                      </div>
                      <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                      {feature.highlight && (
                        <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                          <Star size={12} className="text-badge-gold" /> Core Feature
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Workflow Steps */}
                {currentData.workflow && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 rounded-2xl border border-border bg-card p-8">
                    <h3 className="mb-6 text-center font-heading text-lg font-bold text-foreground">How It Works</h3>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
                      {currentData.workflow.map((w, i) => (
                        <div key={w.step} className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-foreground font-mono text-sm font-bold text-background">{i + 1}</div>
                            <p className="font-heading text-sm font-bold text-foreground">{w.step}</p>
                            <p className="max-w-[160px] text-xs text-muted-foreground">{w.desc}</p>
                          </div>
                          {i < currentData.workflow!.length - 1 && <ChevronRight size={16} className="hidden text-muted-foreground sm:block" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Bottom CTA */}
                {currentData.bottomCTA && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 text-center">
                    <a href={currentData.bottomCTA.link} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90">
                      {currentData.bottomCTA.text} <ArrowRight size={16} />
                    </a>
                  </motion.div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Global Stats */}
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-6 sm:grid-cols-4">
              {[
                { value: "60+", label: "Features" },
                { value: "9", label: "Categories" },
                { value: "7", label: "Gig Formats" },
                { value: "AI", label: "Powered" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <p className="font-heading text-4xl font-black text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
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

export default FeaturesPage;
