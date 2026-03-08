import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Shield, Target, Clock, CheckCircle2, ArrowRight, X } from "lucide-react";

const problems = [
  {
    icon: Briefcase,
    problem: "High freelancing fees",
    stat: "20-30%",
    detail: "Traditional platforms charge up to 30% on every transaction, eating into student earnings.",
    solution: "Zero cash fees — trade skills directly",
    solutionStat: "0% fees",
    solutionDetail: "Our Skill Points economy eliminates middleman costs entirely.",
  },
  {
    icon: Shield,
    problem: "No trust between strangers",
    stat: "87% worry",
    detail: "Students fear scams, ghosting, and low-quality deliveries with no recourse.",
    solution: "ELO ratings + peer-powered Skill Court",
    solutionStat: "98% resolution",
    solutionDetail: "Dynamic trust scoring and community-elected jurors ensure fair outcomes.",
  },
  {
    icon: Target,
    problem: "Cash barrier for students",
    stat: "$0 budget",
    detail: "Students need help with projects but can't afford professional services.",
    solution: "Skill Points — earn by doing, spend on learning",
    solutionStat: "∞ potential",
    solutionDetail: "Every skill you have is currency. No wallet needed, ever.",
  },
  {
    icon: Clock,
    problem: "Unresolved disputes",
    stat: "Weeks lost",
    detail: "Platform disputes drag on for weeks with no clear resolution path.",
    solution: "AI + community Skill Court",
    solutionStat: "48hr avg",
    solutionDetail: "AI-assisted case analysis with ELO-ranked peer jurors for swift justice.",
  },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="our-story" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Why SkillSwappr?
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The Problem We Solve
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Traditional freelancing wasn't built for students. We reimagined the entire model.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-muted-foreground/20"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              {/* Problem half */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-alert-red/10">
                    <item.icon className="w-5 h-5 text-alert-red" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <X size={12} className="text-alert-red" />
                        <span className="text-sm font-semibold text-alert-red">{item.problem}</span>
                      </div>
                      <span className="rounded-full bg-alert-red/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-alert-red">{item.stat}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.detail}</p>
                    <div className="mt-3 h-1 rounded-full bg-alert-red/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-alert-red/30"
                        initial={{ width: 0 }}
                        animate={inView ? { width: "100%" } : {}}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution half */}
              <div className="p-6 bg-skill-green/[0.02]">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-skill-green/10">
                    <CheckCircle2 className="w-5 h-5 text-skill-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-skill-green">{item.solution}</span>
                      <span className="rounded-full bg-skill-green/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-skill-green">{item.solutionStat}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.solutionDetail}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/features"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
          >
            Explore all features <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
