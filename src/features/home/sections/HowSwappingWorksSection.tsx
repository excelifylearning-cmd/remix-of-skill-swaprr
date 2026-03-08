import { motion } from "framer-motion";
import { UserPlus, Search, Handshake, MessageSquare, CheckCircle2, Star } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "1. Sign Up & Get Rewarded", desc: "Create your account, take the guided tour, and earn your first 100 Skill Points for completing it.", color: "text-skill-green" },
  { icon: Search, title: "2. Browse or Post a Gig", desc: "Find a skill you need on the marketplace, or post your own service. AI recommends perfect matches based on your profile.", color: "text-court-blue" },
  { icon: Handshake, title: "3. Match & Agree", desc: "Found your swap partner? Agree on deliverables, set stages, and stake Skill Points as insurance on each milestone.", color: "text-badge-gold" },
  { icon: MessageSquare, title: "4. Collaborate in the Workspace", desc: "Every gig gets a private workspace with real-time chat, video calls, whiteboard, file sharing — all built in. No Zoom needed.", color: "text-foreground" },
  { icon: CheckCircle2, title: "5. Deliver & Approve", desc: "Submit deliverables stage by stage. Work is AI quality-checked, and both parties must approve before points are released.", color: "text-skill-green" },
  { icon: Star, title: "6. Rate, Review & Level Up", desc: "Leave verified reviews, earn ELO rating boosts, unlock achievements, and climb the leaderboard. Your reputation is your currency.", color: "text-badge-gold" },
];

const HowSwappingWorksSection = () => (
  <section className="py-24 px-6 bg-surface-1">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-foreground">
          How a <span className="text-court-blue">Swap</span> works
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
          From signup to 5-star review in 6 simple steps. No payments, no middlemen — just pure skill exchange.
        </p>
      </motion.div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex gap-5 sm:pl-16"
            >
              {/* Step dot on line */}
              <div className="hidden sm:flex absolute left-0 top-5 h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card z-10">
                <s.icon size={18} className={s.color} />
              </div>
              <div className="flex-1 rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-start gap-3 sm:hidden mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 shrink-0">
                    <s.icon size={16} className={s.color} />
                  </div>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowSwappingWorksSection;
