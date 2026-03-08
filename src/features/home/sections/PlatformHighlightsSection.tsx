import { motion } from "framer-motion";
import {
  Gavel, Users, Layers, Flame, FolderKanban, Brain, Shield, Award,
  Video, PenTool, Globe, TrendingUp, Swords, GraduationCap
} from "lucide-react";

const highlights = [
  { icon: Gavel, title: "Auctions", desc: "Multiple creators compete on the same brief. Best work wins the most points.", color: "text-badge-gold", featured: true },
  { icon: Users, title: "Co-Creation Studio", desc: "Assemble a team — designer, developer, copywriter — and build a full project together.", color: "text-court-blue", featured: true },
  { icon: Layers, title: "Skill Fusion", desc: "Post multi-skill gigs like a full app that needs frontend, backend, and design.", color: "text-foreground", featured: true },
  { icon: Flame, title: "Flash Market", desc: "Time-limited gigs with bonus SP multipliers. Fast work, big rewards.", color: "text-destructive", featured: false },
  { icon: FolderKanban, title: "Project Mode", desc: "Start a project like 'Build an App' and the platform shows you every gig you need.", color: "text-court-blue", featured: false },
  { icon: Swords, title: "Guild Wars", desc: "Form guilds, pool resources, and compete against other teams in seasonal competitions.", color: "text-badge-gold", featured: false },
  { icon: Shield, title: "Skill Court", desc: "Disputes are judged by 25% community, 25% AI, 50% experts. Fair, transparent, final.", color: "text-foreground", featured: false },
  { icon: Brain, title: "AI-Powered Quality", desc: "Plagiarism checks, quality scoring, delivery predictions — AI ensures every swap meets standards.", color: "text-skill-green", featured: false },
  { icon: Video, title: "Built-in Workspace", desc: "Chat, video calls, whiteboard, file sharing — everything you need without leaving the platform.", color: "text-court-blue", featured: false },
  { icon: PenTool, title: "Portfolio & Profiles", desc: "LinkedIn-style profiles with portfolios, endorsements, case studies, and timelapse documentation.", color: "text-badge-gold", featured: false },
  { icon: TrendingUp, title: "ELO Reputation", desc: "Your skill rating goes up with great work and down with bad behavior. It's your permanent record.", color: "text-skill-green", featured: false },
  { icon: Award, title: "Achievements & Streaks", desc: "Unlock badges, maintain streaks, hit milestones — gamification that actually rewards real work.", color: "text-badge-gold", featured: false },
  { icon: Globe, title: "Enterprise Mode", desc: "Companies can discover and hire vetted experts for projects, consultations, or full-time roles.", color: "text-court-blue", featured: false },
  { icon: GraduationCap, title: "University Partnerships", desc: "Partnered universities get custom badges, verified student status, and exclusive events.", color: "text-foreground", featured: false },
];

const featuredItems = highlights.filter(h => h.featured);
const gridItems = highlights.filter(h => !h.featured);

const PlatformHighlightsSection = () => (
  <section className="py-28 px-6 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '48px 48px' }} />

    <div className="max-w-6xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
          More than a <span className="text-skill-green">marketplace</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
          SkillSwappr is a full ecosystem — auctions, guilds, AI quality control, a court system, enterprise hiring, and a gamified economy that makes every swap rewarding.
        </p>
      </motion.div>

      {/* Featured trio — larger cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        {featuredItems.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border border-border bg-card p-7 hover:border-muted-foreground/20 transition-all duration-300 hover:shadow-xl"
          >
            <h.icon size={24} className={`${h.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{h.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Remaining grid — compact */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gridItems.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group rounded-xl border border-border bg-card p-5 hover:border-muted-foreground/20 transition-all duration-300 hover:shadow-md"
          >
            <h.icon size={18} className={`${h.color} mb-3 group-hover:scale-110 transition-transform duration-300`} />
            <h3 className="font-heading text-sm font-bold text-foreground mb-1">{h.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PlatformHighlightsSection;
