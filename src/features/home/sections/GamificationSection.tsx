import { motion } from "framer-motion";
import { Trophy, Flame, Target, Shield, Swords, Medal } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ELO Rating",
    description: "Chess-like rating system. Win gigs, earn great reviews, judge cases wisely — your ELO rises. It affects search ranking, court eligibility, and feature unlocks.",
    stat: "1,450",
    statLabel: "Avg ELO",
    color: "text-foreground",
  },
  {
    icon: Medal,
    title: "Skill Mastery",
    description: "Per-skill progression from Beginner to Master. Complete gigs and earn ratings in a specific skill to level up. Masters get reduced tax rates.",
    stat: "5",
    statLabel: "Levels",
    color: "text-silver-accent",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Unlock badges for milestones — first gig, first auction win, guild leader, 100 gigs. Each badge comes with a real benefit like featured listings.",
    stat: "50+",
    statLabel: "Badges",
    color: "text-badge-gold",
  },
  {
    icon: Flame,
    title: "Streaks & Challenges",
    description: "Maintain daily activity streaks for bonus points. Take on platform challenges — complete 3 gigs this week, try a new skill. Streak freeze available with points.",
    stat: "2x",
    statLabel: "Bonus",
    color: "text-alert-red",
  },
  {
    icon: Swords,
    title: "Guild Wars",
    description: "Guilds compete on metrics — gigs completed, average rating, points earned. Winning guilds get treasury bonuses. Form your team and dominate.",
    stat: "Weekly",
    statLabel: "Battles",
    color: "text-court-blue",
  },
  {
    icon: Shield,
    title: "Lifetime Tiers",
    description: "Bronze → Silver → Gold → Platinum → Diamond. Each tier unlocks formats — Co-Creation needs Silver, Projects needs Gold. Diamond gets reduced tax.",
    stat: "5",
    statLabel: "Tiers",
    color: "text-silver",
  },
];

const GamificationSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--badge-gold)/0.04),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-badge-gold/20 bg-badge-gold/5 px-4 py-1.5 font-mono text-xs text-badge-gold">
            Level Up
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Gamified From the Ground Up
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Every gig, every review, every challenge — it all counts toward your progression.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-badge-gold/20 hover:shadow-[0_0_30px_hsl(var(--badge-gold)/0.06)]">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-silver-accent transition-colors group-hover:bg-badge-gold/10 group-hover:text-badge-gold">
                    <feature.icon size={20} />
                  </div>
                  <div className="text-right">
                    <span className={`font-heading text-xl font-bold ${feature.color}`}>
                      {feature.stat}
                    </span>
                    <p className="font-mono text-[10px] text-silver">{feature.statLabel}</p>
                  </div>
                </div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-silver">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
