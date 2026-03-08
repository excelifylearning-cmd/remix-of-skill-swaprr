import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Zap, Target, Users, Shield, Trophy, TrendingUp, Building2, Globe } from "lucide-react";

const milestones = [
  { date: "Jan 2024", title: "Idea Born", desc: "Two university students frustrated with freelancing fees sketch the first concept on a whiteboard.", icon: Zap, highlight: false },
  { date: "Mar 2024", title: "Prototype Built", desc: "First working prototype with basic skill swapping and a rudimentary points system.", icon: Target, highlight: false },
  { date: "Jun 2024", title: "Beta Launch", desc: "500 students across 3 universities join the private beta. First skill swap completed in 4 minutes.", icon: Users, highlight: true },
  { date: "Sep 2024", title: "Skill Court Added", desc: "Community-powered dispute resolution goes live. First case resolved in under 24 hours.", icon: Shield, highlight: false },
  { date: "Dec 2024", title: "Guild System", desc: "Teams form, treasuries pool resources, and the first Guild Wars tournament begins.", icon: Trophy, highlight: true },
  { date: "Mar 2025", title: "10K Users", desc: "Platform crosses 10,000 active users across 20 universities. 50,000 gigs completed.", icon: TrendingUp, highlight: false },
  { date: "Jun 2025", title: "Enterprise Mode", desc: "Companies start hiring vetted student talent through dedicated enterprise dashboards.", icon: Building2, highlight: false },
  { date: "2026", title: "Global Expansion", desc: "Multi-language support, 50+ university partnerships, and mobile app launch.", icon: Globe, highlight: true },
];

const TimelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={ref} className="py-28 px-6 bg-surface-1">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Our Journey
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">From Dorm Room to Global Platform</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Every milestone that shaped who we are today.</p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border">
            <motion.div className="w-full bg-foreground/40 origin-top" style={{ height: lineHeight }} />
          </div>

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.12 * i, duration: 0.5 }}
                >
                  {/* Desktop card */}
                  <div className={`flex-1 hidden md:block ${isLeft ? "text-right" : ""}`}>
                    <motion.div
                      className={`rounded-2xl border bg-card p-6 inline-block ${isLeft ? "ml-auto" : "mr-auto"} max-w-sm ${m.highlight ? "border-badge-gold/20" : "border-border"}`}
                      whileHover={{ y: -3, borderColor: "hsl(var(--foreground)/0.15)" }}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${isLeft ? "justify-end" : ""}`}>
                        <span className="font-mono text-[11px] text-muted-foreground">{m.date}</span>
                        {m.highlight && (
                          <span className="rounded-full bg-badge-gold/10 px-2 py-0.5 text-[9px] font-bold text-badge-gold">KEY</span>
                        )}
                      </div>
                      <h3 className="font-heading text-base font-bold text-foreground mb-1">{m.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    </motion.div>
                  </div>

                  {/* Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${m.highlight ? "bg-card border-badge-gold/40" : "bg-card border-border"}`}
                      whileHover={{ scale: 1.15 }}
                    >
                      <m.icon className="w-5 h-5 text-foreground" />
                    </motion.div>
                  </div>

                  <div className="flex-1 hidden md:block" />

                  {/* Mobile card */}
                  <div className="md:hidden ml-16">
                    <div className={`rounded-2xl border bg-card p-5 ${m.highlight ? "border-badge-gold/20" : "border-border"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{m.date}</span>
                        {m.highlight && (
                          <span className="rounded-full bg-badge-gold/10 px-2 py-0.5 text-[9px] font-bold text-badge-gold">KEY</span>
                        )}
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground mb-1">{m.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
