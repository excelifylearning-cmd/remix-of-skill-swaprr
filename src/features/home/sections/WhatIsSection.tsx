import { motion } from "framer-motion";
import { ArrowLeftRight, GraduationCap, Coins, Shield, Sparkles } from "lucide-react";

const points = [
  {
    icon: ArrowLeftRight,
    title: "Swap, Don't Pay",
    desc: "Exchange services directly — design a logo, get a website built in return. No cash needed, just skill.",
    color: "text-skill-green",
    bg: "bg-skill-green/10",
  },
  {
    icon: GraduationCap,
    title: "Built for Students",
    desc: "Whether you're in university or freshly graduated, build a real portfolio and network while you learn.",
    color: "text-court-blue",
    bg: "bg-court-blue/10",
  },
  {
    icon: Coins,
    title: "Skill Point Economy",
    desc: "When a swap isn't equal, balance it with Skill Points. Earn them through gigs, referrals, and court duty.",
    color: "text-badge-gold",
    bg: "bg-badge-gold/10",
  },
  {
    icon: Shield,
    title: "Trust & Insurance",
    desc: "Stake points per stage — if the other party abandons, you keep theirs. Every gig is verified on-chain.",
    color: "text-foreground",
    bg: "bg-surface-2",
  },
];

const WhatIsSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
          <Sparkles size={12} /> What is SkillSwappr?
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-foreground mt-4">
          Fiverr, but you <span className="text-badge-gold">trade skills</span> instead of cash
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          SkillSwappr is the first service exchange platform where students and creators barter their talents.
          Design for development. Marketing for music. Every skill has value — and here, you trade it directly.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 group hover:shadow-lg transition-shadow"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${p.bg}`}>
              <p.icon size={20} className={p.color} />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatIsSection;
