import { motion } from "framer-motion";
import { Shield, Coins, Users, Swords, HandCoins, FolderKanban } from "lucide-react";

const benefits = [
  { icon: Coins, title: "Shared Treasury", desc: "Pool skill points. Fund member gigs. Grow together." },
  { icon: HandCoins, title: "Point Lending", desc: "Lend members points for gigs. They repay after completion." },
  { icon: FolderKanban, title: "Gig Delegation", desc: "Leaders assign incoming gigs to the right specialist." },
  { icon: Swords, title: "Guild Wars", desc: "Compete weekly with other guilds. Winners get treasury bonuses." },
  { icon: Users, title: "Quality Control", desc: "Members review deliverables before submission for quality assurance." },
  { icon: Shield, title: "Collective ELO", desc: "Guild ELO averages member ratings. Affects war matchmaking." },
];

const GuildSection = () => {
  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-silver">
              Teamwork
            </span>
            <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Form Your Guild
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-silver">
              Guilds are teams that pool resources, share reputation, and compete together. Lend points to members, delegate gigs, and rise through the guild leaderboard.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="border-b border-border px-5 py-3">
                <span className="font-heading text-sm font-semibold text-foreground">Sample Guild</span>
              </div>
                <div className="p-5">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop"
                    alt="Lambda X guild"
                    className="h-12 w-12 rounded-xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Lambda X</h3>
                    <p className="text-xs text-silver">Full-stack design & dev collective</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Members", value: "12" },
                    { label: "Avg ELO", value: "1,580" },
                    { label: "Treasury", value: "4,200 SP" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-surface-2 p-2.5 text-center">
                      <span className="block font-heading text-lg font-bold text-foreground">{stat.value}</span>
                      <span className="font-mono text-[10px] text-silver">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-silver/30"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-silver-accent transition-colors group-hover:text-foreground">
                  <b.icon size={18} />
                </div>
                <h4 className="mb-1 font-heading text-sm font-semibold text-foreground">{b.title}</h4>
                <p className="text-xs leading-relaxed text-silver">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GuildSection;
