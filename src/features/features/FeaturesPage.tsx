import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, ArrowLeftRight, Gavel, Users, Layers, FolderKanban, Shield,
  Target, Trophy, Flame, Medal, Swords, Scale, Bot, GraduationCap,
  Zap, MessageSquare, PenTool, Video, FolderOpen, CheckCircle2, Sparkles,
  Building2, Search, Clock, Timer
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const featureCategories = [
  { id: "economy", label: "Skill Points", icon: Coins },
  { id: "formats", label: "Gig Formats", icon: ArrowLeftRight },
  { id: "workspace", label: "Workspace", icon: MessageSquare },
  { id: "gamification", label: "Gamification", icon: Trophy },
  { id: "guilds", label: "Guilds", icon: Users },
  { id: "court", label: "Skill Court", icon: Scale },
  { id: "enterprise", label: "Enterprise", icon: Building2 },
];

const economyFeatures = [
  { icon: Coins, title: "Earn on Signup", desc: "Get 100 skill points instantly when you create your account." },
  { icon: ArrowLeftRight, title: "Fair Exchange", desc: "Points balance the value difference between skills exchanged." },
  { icon: Shield, title: "5% Tax System", desc: "Both parties taxed 5% on completion — prevents inflation, keeps the economy healthy." },
  { icon: Zap, title: "Multiple Earning Paths", desc: "Referrals, court duty, achievements, challenges, and streaks all earn points." },
  { icon: Target, title: "Stage Insurance", desc: "If a party abandons, you keep their allocated stage points." },
  { icon: Timer, title: "Market Intelligence", desc: "AI-powered demand forecasting and dynamic pricing recommendations." },
];

const formatFeatures = [
  { icon: ArrowLeftRight, title: "Direct Swap", desc: "1-on-1 skill exchange with point balancing. Both taxed on completion." },
  { icon: Gavel, title: "Auction", desc: "Post a task, receive multiple submissions. Best wins most points." },
  { icon: Users, title: "Co-Creation Studio", desc: "Multi-person workspace with whiteboard and video. Points per role." },
  { icon: Layers, title: "Skill Fusion", desc: "Multi-skill gigs. One person fills all roles or multiple specialists split." },
  { icon: FolderKanban, title: "Projects", desc: "Full product builds broken into sub-gigs with individual workspaces." },
  { icon: Clock, title: "Flash Market", desc: "Time-limited gigs with bonus point multipliers." },
];

const workspaceFeatures = [
  { icon: MessageSquare, title: "Messenger", desc: "Real-time chat with auto-translation, voice notes, file sharing, and Discord-style threading." },
  { icon: PenTool, title: "Whiteboard", desc: "Built-in tldraw canvas for real-time collaboration and brainstorming." },
  { icon: Video, title: "Video Call", desc: "Peer-to-peer video with screen sharing. All calls recorded and saved." },
  { icon: FolderOpen, title: "File Library", desc: "All files organized chronologically with version history and search." },
  { icon: CheckCircle2, title: "Stage Tracker", desc: "Visual progress with point allocation per stage and built-in insurance." },
  { icon: Sparkles, title: "AI Quality Panel", desc: "Plagiarism check, quality scoring, and predicted buyer satisfaction." },
];

const gamificationFeatures = [
  { icon: Target, title: "ELO Rating", desc: "Chess-like rating affecting search ranking, court eligibility, and feature unlocks." },
  { icon: Medal, title: "Skill Mastery", desc: "Per-skill progression: Beginner → Intermediate → Advanced → Expert → Master." },
  { icon: Trophy, title: "Achievements", desc: "50+ badges for milestones, each with real benefits like reduced tax." },
  { icon: Flame, title: "Streaks & Challenges", desc: "Daily streaks for bonus points. Platform challenges for extra rewards." },
  { icon: Swords, title: "Guild Wars", desc: "Guilds compete on metrics. Winners get treasury bonuses." },
  { icon: Shield, title: "Lifetime Tiers", desc: "Bronze → Silver → Gold → Platinum → Diamond with progressive unlocks." },
];

const guildFeatures = [
  { icon: Coins, title: "Shared Treasury", desc: "Pool skill points. Fund member gigs. Grow together." },
  { icon: ArrowLeftRight, title: "Point Lending", desc: "Lend members points for gigs. Repaid after completion." },
  { icon: FolderKanban, title: "Gig Delegation", desc: "Leaders assign incoming gigs to the right specialist." },
  { icon: Swords, title: "Guild Wars", desc: "Compete weekly with other guilds for treasury rewards." },
  { icon: CheckCircle2, title: "Quality Control", desc: "Members review deliverables before submission." },
  { icon: Target, title: "Collective ELO", desc: "Guild ELO averages member ratings for war matchmaking." },
];

const courtFeatures = [
  { icon: Scale, title: "Fair Judging", desc: "25% community users, 25% AI analysis, 50% skill experts." },
  { icon: Bot, title: "AI Evidence Analysis", desc: "Pattern detection, evidence analysis, and bias checking." },
  { icon: GraduationCap, title: "Expert Panels", desc: "High-rated users in the relevant skill field review cases." },
  { icon: Shield, title: "Appeal System", desc: "One appeal per case goes to a higher-ELO panel." },
  { icon: Coins, title: "Judge Rewards", desc: "Earn points and ELO for fair judging." },
  { icon: Target, title: "ELO Impact", desc: "Verdicts adjust both parties' ELO ratings." },
];

const featureMap: Record<string, Array<{ icon: any; title: string; desc: string }>> = {
  economy: economyFeatures,
  formats: formatFeatures,
  workspace: workspaceFeatures,
  gamification: gamificationFeatures,
  guilds: guildFeatures,
  court: courtFeatures,
  enterprise: [
    { icon: Building2, title: "Vetted Expert Pool", desc: "Access curated, high-ELO student talent." },
    { icon: Search, title: "AI Matching", desc: "AI-matched expert recommendations for your projects." },
    { icon: Users, title: "Direct Hire Pipeline", desc: "From gig to full-time hire, seamlessly." },
    { icon: Shield, title: "NDA & IP Protection", desc: "Enterprise-grade security and IP protection." },
    { icon: FolderKanban, title: "Project Management", desc: "Full dashboard with analytics and team management." },
    { icon: Sparkles, title: "Custom Integrations", desc: "Connect with your existing tools and workflows." },
  ],
};

const FeaturesPage = () => {
  const [active, setActive] = useState("economy");

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
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground"
            >
              Platform Features
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl"
            >
              Everything You Need to{" "}
              <span className="text-muted-foreground">Swap Skills</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-xl text-lg text-muted-foreground"
            >
              From skill point economy to AI-powered dispute resolution — explore every feature of the platform.
            </motion.p>
          </div>
        </section>

        {/* Category Tabs */}
        <div className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 scrollbar-hide">
            {featureCategories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active === cat.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {(featureMap[active] || []).map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_30px_hsl(var(--silver)/0.06)]"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground transition-colors group-hover:bg-foreground/10 group-hover:text-foreground">
                      <feature.icon size={20} />
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default FeaturesPage;
