import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";

const partners = [
  { name: "Figma", category: "Design", desc: "Import designs directly into gig submissions and portfolio." },
  { name: "GitHub", category: "Development", desc: "Link repos, showcase contributions, and verify coding skills." },
  { name: "Notion", category: "Productivity", desc: "Sync project briefs, documentation, and team wikis." },
  { name: "Slack", category: "Communication", desc: "Get gig notifications, court alerts, and guild updates." },
  { name: "Vercel", category: "Deployment", desc: "Deploy projects from gigs directly to production." },
  { name: "Linear", category: "Project Mgmt", desc: "Track gig milestones and team sprints seamlessly." },
  { name: "Stripe", category: "Payments", desc: "Enterprise clients can pay with cash for premium gigs." },
  { name: "Loom", category: "Video", desc: "Record walkthroughs, tutorials, and gig delivery videos." },
];

const IndustryPartnershipsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Integrations
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Works With Your Stack</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Plug into the tools you already love. No context switching.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-muted-foreground/20"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center group-hover:bg-surface-3 transition-colors">
                  <span className="font-heading font-black text-lg text-foreground">{p.name[0]}</span>
                </div>
                <ExternalLink size={12} className="text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground mb-0.5">{p.name}</h3>
              <span className="text-[10px] font-mono text-muted-foreground">{p.category}</span>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryPartnershipsSection;
