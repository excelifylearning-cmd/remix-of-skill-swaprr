import { motion } from "framer-motion";
import { Scale, Users, Bot, GraduationCap, ShieldCheck, AlertTriangle } from "lucide-react";

const judgeComposition = [
  { label: "Community Users", percentage: 25, icon: Users, description: "Random users above minimum ELO threshold" },
  { label: "AI Analysis", percentage: 25, icon: Bot, description: "Pattern detection, evidence analysis, bias check" },
  { label: "Skill Experts", percentage: 50, icon: GraduationCap, description: "High-rated users in the relevant skill field" },
];

const SkillCourtSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--court-blue)/0.06),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-court-blue/20 bg-court-blue/5 px-4 py-1.5 font-mono text-xs text-court-blue">
            Dispute Resolution
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Skill Court
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Disputes resolved by weighted community votes, expert judgment, and AI analysis. Your reputation is your currency.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-12 grid gap-6 lg:grid-cols-3">
            {judgeComposition.map((judge, i) => (
              <motion.div
                key={judge.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-court-blue/30"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-silver-accent transition-colors group-hover:bg-court-blue/10 group-hover:text-court-blue">
                    <judge.icon size={20} />
                  </div>
                  <span className="font-heading text-3xl font-black text-court-blue">
                    {judge.percentage}%
                  </span>
                </div>
                <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
                  {judge.label}
                </h3>
                <p className="text-sm text-silver">{judge.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="border-b border-border bg-surface-2/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <Scale size={18} className="text-court-blue" />
                <span className="font-heading text-sm font-semibold text-foreground">How a Case Flows</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "01", title: "Dispute Filed", desc: "Either party files. Evidence auto-collected from workspace.", icon: AlertTriangle },
                  { step: "02", title: "Judges Assigned", desc: "25% users + 25% AI + 50% experts. Weighted by ELO.", icon: Users },
                  { step: "03", title: "Review & Vote", desc: "Judges review evidence, cast vote with written reasoning.", icon: Scale },
                  { step: "04", title: "Verdict", desc: "Points redistributed. ELO adjusted. One appeal allowed.", icon: ShieldCheck },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="relative"
                  >
                    <span className="mb-2 block font-mono text-xs text-court-blue">{s.step}</span>
                    <h4 className="mb-1 font-heading text-sm font-semibold text-foreground">{s.title}</h4>
                    <p className="text-xs leading-relaxed text-silver">{s.desc}</p>
                    {i < 3 && (
                      <div className="absolute right-0 top-3 hidden h-px w-6 bg-border lg:block" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillCourtSection;
