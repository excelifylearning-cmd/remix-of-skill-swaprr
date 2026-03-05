import { motion } from "framer-motion";
import { UserPlus, FileText, ArrowLeftRight, Coins, Receipt, Gift } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign Up",
    description: "Create your account and earn 100 skill points instantly. Complete the guided tour for bonus points.",
    highlight: "+100 SP",
  },
  {
    icon: FileText,
    number: "02",
    title: "Post a Gig",
    description: 'Offer your skill — "I\'ll design your logo" — and specify what skill you want in return.',
    highlight: "Your Skill",
  },
  {
    icon: ArrowLeftRight,
    number: "03",
    title: "Get Matched",
    description: "Someone accepts your gig and offers their skill. A web developer wants your logo? Perfect match.",
    highlight: "Skill ↔ Skill",
  },
  {
    icon: Coins,
    number: "04",
    title: "Balance with Points",
    description: "A full website is worth more than a logo. The logo designer adds 50 skill points to balance the exchange.",
    highlight: "+50 SP",
  },
  {
    icon: Receipt,
    number: "05",
    title: "Completion Tax",
    description: "Both users are taxed 5% of the gig value on completion. This keeps the economy healthy and prevents inflation.",
    highlight: "−5% Tax",
  },
  {
    icon: Gift,
    number: "06",
    title: "Earn More",
    description: "Earn bonus points through referrals, court duty, achievements, challenges, and streaks. The more you engage, the more you earn.",
    highlight: "∞ Ways",
  },
];

const SkillPointsSection = () => {
  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--skill-green)/0.05),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-skill-green/20 bg-skill-green/5 px-4 py-1.5 font-mono text-xs text-skill-green">
            Economy System
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            How Skill Points Work
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            No money changes hands. Skill points are the currency of fair exchange.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative h-full rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-skill-green/30 hover:shadow-[0_0_30px_hsl(var(--skill-green)/0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-silver">{step.number}</span>
                  <span className="rounded-full bg-skill-green/10 px-3 py-1 font-mono text-xs font-semibold text-skill-green">
                    {step.highlight}
                  </span>
                </div>

                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-silver-accent transition-colors group-hover:bg-skill-green/10 group-hover:text-skill-green"
                  whileHover={{ rotate: 5 }}
                >
                  <step.icon size={22} />
                </motion.div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-silver">
                  {step.description}
                </p>

                {i < steps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 hidden h-6 w-px bg-gradient-to-b from-border to-transparent lg:block" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillPointsSection;
