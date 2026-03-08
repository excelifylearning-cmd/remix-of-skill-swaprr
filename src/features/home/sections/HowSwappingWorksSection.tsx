import { motion } from "framer-motion";
import { UserPlus, Search, Handshake, MessageSquare, CheckCircle2, Star } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up & Get Rewarded", desc: "Create your account, take the guided tour, and earn your first 100 Skill Points for completing it.", color: "text-skill-green", accent: "bg-skill-green/10 border-skill-green/20" },
  { icon: Search, title: "Browse or Post a Gig", desc: "Find a skill you need on the marketplace, or post your own service. AI recommends perfect matches based on your profile.", color: "text-court-blue", accent: "bg-court-blue/10 border-court-blue/20" },
  { icon: Handshake, title: "Match & Agree", desc: "Found your swap partner? Agree on deliverables, set stages, and stake Skill Points as insurance on each milestone.", color: "text-badge-gold", accent: "bg-badge-gold/10 border-badge-gold/20" },
  { icon: MessageSquare, title: "Collaborate in the Workspace", desc: "Every gig gets a private workspace with real-time chat, video calls, whiteboard, file sharing — all built in.", color: "text-court-blue", accent: "bg-court-blue/10 border-court-blue/20" },
  { icon: CheckCircle2, title: "Deliver & Approve", desc: "Submit deliverables stage by stage. Work is AI quality-checked, and both parties must approve before points are released.", color: "text-skill-green", accent: "bg-skill-green/10 border-skill-green/20" },
  { icon: Star, title: "Rate, Review & Level Up", desc: "Leave verified reviews, earn ELO rating boosts, unlock achievements, and climb the leaderboard.", color: "text-badge-gold", accent: "bg-badge-gold/10 border-badge-gold/20" },
];

const HowSwappingWorksSection = () => (
  <section className="py-28 px-6 bg-surface-1 relative overflow-hidden">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

    <div className="max-w-5xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
          How a <span className="text-court-blue">Swap</span> works
        </h2>
        <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg leading-relaxed">
          From signup to 5-star review in 6 simple steps. No payments, no middlemen — just pure skill exchange.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative rounded-2xl border border-border bg-card p-6 hover:border-muted-foreground/20 transition-all duration-300 hover:shadow-lg"
          >
            {/* Step number */}
            <span className="absolute top-5 right-5 font-mono text-xs text-muted-foreground/40 font-bold">
              0{i + 1}
            </span>

            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${s.accent}`}>
              <s.icon size={20} className={s.color} />
            </div>

            <h3 className="font-heading text-base font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

            {/* Bottom accent line on hover */}
            <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${s.color.replace('text-', 'bg-')} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowSwappingWorksSection;
