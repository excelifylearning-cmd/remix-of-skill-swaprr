import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Briefcase, Shield, Target, Clock, CheckCircle2, ArrowRight, X,
  TrendingDown, AlertTriangle, DollarSign, Scale, Zap, Users, Sparkles,
  ChevronRight
} from "lucide-react";

const problems = [
  {
    problemIcon: TrendingDown,
    solutionIcon: Zap,
    problem: "High freelancing fees",
    stat: "20-30%",
    statLabel: "cut per gig",
    detail: "Traditional platforms charge up to 30% on every transaction, eating into student earnings. A $100 gig nets you just $70.",
    solution: "Zero cash fees — trade skills directly",
    solutionStat: "0%",
    solutionStatLabel: "platform fees",
    solutionDetail: "Our Skill Points economy eliminates middleman costs entirely. Every point you earn is yours to keep and spend.",
    impactMetrics: [
      { label: "Avg savings per user", value: "$840/yr" },
      { label: "SP economy volume", value: "2.4M SP" },
    ],
  },
  {
    problemIcon: AlertTriangle,
    solutionIcon: Shield,
    problem: "No trust between strangers",
    stat: "87%",
    statLabel: "report anxiety",
    detail: "Students fear scams, ghosting, and low-quality deliveries with no recourse. There's no accountability on traditional platforms.",
    solution: "ELO ratings + peer-powered Skill Court",
    solutionStat: "98%",
    solutionStatLabel: "resolution rate",
    solutionDetail: "Dynamic trust scoring and community-elected jurors ensure fair outcomes. Every interaction builds your reputation.",
    impactMetrics: [
      { label: "Disputes resolved", value: "412" },
      { label: "User satisfaction", value: "94%" },
    ],
  },
  {
    problemIcon: DollarSign,
    solutionIcon: Sparkles,
    problem: "Cash barrier for students",
    stat: "$0",
    statLabel: "student budget",
    detail: "Students need help with projects but can't afford professional services. Talent exists but money doesn't.",
    solution: "Skill Points — earn by doing, spend on learning",
    solutionStat: "∞",
    solutionStatLabel: "potential value",
    solutionDetail: "Every skill you have is currency. Teach what you know, learn what you need. No wallet required, ever.",
    impactMetrics: [
      { label: "Skills exchanged", value: "18.4K" },
      { label: "Avg SP earned/mo", value: "320 SP" },
    ],
  },
  {
    problemIcon: Clock,
    solutionIcon: Scale,
    problem: "Unresolved disputes drag on",
    stat: "14+",
    statLabel: "days industry avg",
    detail: "Platform disputes drag on for weeks with no clear resolution path. Users feel powerless and abandoned.",
    solution: "AI + community Skill Court",
    solutionStat: "48hr",
    solutionStatLabel: "avg resolution",
    solutionDetail: "AI-assisted case analysis with ELO-ranked peer jurors deliver swift, transparent justice for every dispute.",
    impactMetrics: [
      { label: "AI pre-analysis accuracy", value: "89%" },
      { label: "Appeal rate", value: "8%" },
    ],
  },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section ref={ref} id="our-story" className="py-32 px-6 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--alert-red)/0.03),transparent_70%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--skill-green)/0.03),transparent_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="mb-5 inline-block rounded-full border border-alert-red/20 bg-alert-red/5 px-5 py-2 font-mono text-xs text-alert-red">
            The broken model
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-5 tracking-tight">
            Freelancing wasn't built
            <br />
            <span className="text-muted-foreground">for students</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            We identified the four biggest pain points and engineered a solution for each one. Here's the before and after.
          </p>
        </motion.div>

        {/* Problem → Solution Cards */}
        <div className="space-y-5">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-muted-foreground/20">
                {/* Problem Side */}
                <div className="relative p-7 lg:p-8">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-alert-red/40 via-alert-red/20 to-transparent" />
                  <div className="flex items-start gap-5">
                    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-alert-red/8 border border-alert-red/10">
                      <item.problemIcon className="w-6 h-6 text-alert-red" />
                      <X size={10} className="absolute -top-1 -right-1 rounded-full bg-alert-red text-background p-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground mb-1.5">{item.problem}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.detail}</p>
                      <div className="inline-flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-black text-alert-red">{item.stat}</span>
                        <span className="text-[10px] text-alert-red/60 font-medium">{item.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="hidden lg:flex items-center justify-center px-2">
                  <motion.div
                    className="flex flex-col items-center gap-1"
                    animate={hoveredCard === i ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-px h-8 bg-gradient-to-b from-alert-red/30 to-skill-green/30" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2">
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-skill-green/30 to-transparent" />
                  </motion.div>
                </div>

                {/* Mobile divider */}
                <div className="lg:hidden flex items-center justify-center py-2 border-t border-b border-border/50 bg-surface-1">
                  <ArrowRight size={14} className="text-muted-foreground rotate-90 lg:rotate-0" />
                </div>

                {/* Solution Side */}
                <div className="relative p-7 lg:p-8 bg-skill-green/[0.02]">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-skill-green/40 via-skill-green/20 to-transparent" />
                  <div className="flex items-start gap-5">
                    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-skill-green/8 border border-skill-green/10">
                      <item.solutionIcon className="w-6 h-6 text-skill-green" />
                      <CheckCircle2 size={12} className="absolute -top-1.5 -right-1.5 rounded-full bg-skill-green text-background p-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground mb-1.5">{item.solution}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.solutionDetail}</p>
                      <div className="flex items-center gap-6">
                        <div className="inline-flex items-baseline gap-1.5">
                          <span className="font-mono text-2xl font-black text-skill-green">{item.solutionStat}</span>
                          <span className="text-[10px] text-skill-green/60 font-medium">{item.solutionStatLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Metrics — reveal on hover */}
                  <AnimatePresence>
                    {hoveredCard === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-3 pt-4 border-t border-skill-green/10">
                          {item.impactMetrics.map((m) => (
                            <div key={m.label} className="flex-1 rounded-xl bg-skill-green/5 border border-skill-green/10 px-4 py-3 text-center">
                              <p className="font-mono text-lg font-bold text-skill-green">{m.value}</p>
                              <p className="text-[9px] text-muted-foreground mt-0.5">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm text-muted-foreground mb-5">See how every feature connects to solve these problems</p>
          <motion.a
            href="/features"
            className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore all features <ArrowRight size={15} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
