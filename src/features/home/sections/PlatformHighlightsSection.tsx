import { motion } from "framer-motion";
import {
  Gavel, Users, Layers, Flame, FolderKanban, Brain, Shield, Award,
  Video, PenTool, Globe, TrendingUp, Swords, GraduationCap
} from "lucide-react";

const highlights = [
  { icon: Gavel, title: "Auctions", desc: "Multiple creators compete on the same brief. Best work wins the most points.", color: "text-badge-gold" },
  { icon: Users, title: "Co-Creation Studio", desc: "Assemble a team — designer, developer, copywriter — and build a full project together.", color: "text-court-blue" },
  { icon: Layers, title: "Skill Fusion", desc: "Post multi-skill gigs like a full app that needs frontend, backend, and design.", color: "text-foreground" },
  { icon: Flame, title: "Flash Market", desc: "Time-limited gigs with bonus SP multipliers. Fast work, big rewards.", color: "text-destructive" },
  { icon: FolderKanban, title: "Project Mode", desc: "Start a project like 'Build an App' and the platform shows you every gig you need.", color: "text-court-blue" },
  { icon: Swords, title: "Guild Wars", desc: "Form guilds, pool resources, and compete against other teams in seasonal competitions.", color: "text-badge-gold" },
  { icon: Shield, title: "Skill Court", desc: "Disputes are judged by 25% community, 25% AI, 50% experts. Fair, transparent, final.", color: "text-foreground" },
  { icon: Brain, title: "AI-Powered Quality", desc: "Plagiarism checks, quality scoring, delivery predictions — AI ensures every swap meets standards.", color: "text-skill-green" },
  { icon: Video, title: "Built-in Workspace", desc: "Chat, video calls, whiteboard, file sharing — everything you need without leaving the platform.", color: "text-court-blue" },
  { icon: PenTool, title: "Portfolio & Profiles", desc: "LinkedIn-style profiles with portfolios, endorsements, case studies, and timelapse documentation.", color: "text-badge-gold" },
  { icon: TrendingUp, title: "ELO Reputation", desc: "Your skill rating goes up with great work and down with bad behavior. It's your permanent record.", color: "text-skill-green" },
  { icon: Award, title: "Achievements & Streaks", desc: "Unlock badges, maintain streaks, hit milestones — gamification that actually rewards real work.", color: "text-badge-gold" },
  { icon: Globe, title: "Enterprise Mode", desc: "Companies can discover and hire vetted experts for projects, consultations, or full-time roles.", color: "text-court-blue" },
  { icon: GraduationCap, title: "University Partnerships", desc: "Partnered universities get custom badges, verified student status, and exclusive events.", color: "text-foreground" },
];

const PlatformHighlightsSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-foreground">
          More than a <span className="text-skill-green">marketplace</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          SkillSwappr is a full ecosystem — auctions, guilds, AI quality control, a court system, enterprise hiring, and a gamified economy that makes every swap rewarding.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border bg-card p-5 hover:bg-surface-1 transition-colors group"
          >
            <h.icon size={18} className={`${h.color} mb-3 group-hover:scale-110 transition-transform`} />
            <h3 className="font-heading text-sm font-bold text-foreground mb-1">{h.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PlatformHighlightsSection;
