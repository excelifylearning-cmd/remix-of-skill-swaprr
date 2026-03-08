import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Heart, Zap, Users, Target, Globe } from "lucide-react";

const values = [
  {
    icon: Shield, title: "Fairness First",
    desc: "Equal opportunity regardless of financial status. Skills are the only currency that matters. No paywalls, no gatekeeping.",
    accent: "court-blue",
  },
  {
    icon: Heart, title: "Radical Transparency",
    desc: "Open economy, public ELO, verifiable transactions. We show our math and share our metrics. Nothing hidden, ever.",
    accent: "alert-red",
  },
  {
    icon: Zap, title: "Gamified Growth",
    desc: "Learning and working should feel like leveling up. Leaderboards, badges, streaks, and guild wars make skill-building addictive.",
    accent: "badge-gold",
  },
  {
    icon: Users, title: "Community Over Competition",
    desc: "Guilds, forums, court duty, mentorship — every feature brings people together. We grow by lifting each other.",
    accent: "skill-green",
  },
  {
    icon: Target, title: "Uncompromising Quality",
    desc: "AI monitoring, peer review, ELO stakes. Great work is recognized and rewarded. Mediocrity doesn't survive here.",
    accent: "foreground",
  },
  {
    icon: Globe, title: "Universal Access",
    desc: "Multi-language, university partnerships, zero cash barrier. We're building for every student, everywhere, in every language.",
    accent: "court-blue",
  },
];

const ValuesCultureSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Our DNA
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Values That Drive Us</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Six principles that shape every decision, feature, and interaction on the platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={i}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-muted-foreground/20"
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * i }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-${value.accent}/10 flex items-center justify-center mb-6 group-hover:bg-${value.accent}/15 transition-colors`}
                whileHover={{ rotate: 5 }}
              >
                <value.icon className={`w-6 h-6 text-${value.accent}`} />
              </motion.div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesCultureSection;
