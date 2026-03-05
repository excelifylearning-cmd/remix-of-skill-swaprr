import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Gavel, Users, Layers, FolderKanban } from "lucide-react";

const formats = [
  {
    id: "direct",
    label: "Direct Swap",
    icon: ArrowLeftRight,
    title: "1-on-1 Skill Exchange",
    description: "The core experience. You offer your skill, someone offers theirs. Points balance the difference. Both parties are taxed on completion. Each gig has stages with point insurance — if someone abandons, you keep their allocated points.",
    visual: [
      { label: "Designer", skill: "Logo Design", side: "left" },
      { label: "Developer", skill: "React Frontend", side: "right" },
    ],
  },
  {
    id: "auction",
    label: "Auction",
    icon: Gavel,
    title: "Competitive Submissions",
    description: "Post a task and set the reward. Multiple people submit their work. The best submission wins the most points — runners-up get consolation points. Every submission requires proof of deliverable to prevent gaming.",
    visual: [
      { label: "3 Submissions", skill: "Best Wins", side: "left" },
      { label: "Runner-ups", skill: "Get Points Too", side: "right" },
    ],
  },
  {
    id: "cocreation",
    label: "Co-Creation",
    icon: Users,
    title: "Build Together",
    description: "Break a project into roles. Invite collaborators or post each role publicly. Everyone works in a shared workspace with whiteboard and video. Points distributed per role completion. Unlock at Silver tier.",
    visual: [
      { label: "Frontend", skill: "Role 1 of 4", side: "left" },
      { label: "Designer", skill: "Role 2 of 4", side: "right" },
    ],
  },
  {
    id: "fusion",
    label: "Skill Fusion",
    icon: Layers,
    title: "Multi-Skill Gigs",
    description: "Need a full app? Post a skill fusion gig requiring frontend, backend, and design. One person can fill all roles or multiple specialists can split it. Combined deliverable, combined value.",
    visual: [
      { label: "3 Skills", skill: "One Gig", side: "left" },
      { label: "1 or 3", skill: "People", side: "right" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    title: "Full Product Build",
    description: 'Define "build an app" and the platform suggests component gigs — logo, database, frontend, copywriting. Each becomes a sub-gig with its own workspace and point allocation. Unlock at Gold tier.',
    visual: [
      { label: "1 Vision", skill: "Auto-Split", side: "left" },
      { label: "5 Sub-Gigs", skill: "5 Workspaces", side: "right" },
    ],
  },
];

const PlatformFormatsSection = () => {
  const [active, setActive] = useState("direct");
  const current = formats.find((f) => f.id === active)!;

  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Multiple Ways to Swap
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            From simple exchanges to full project builds — pick the format that fits.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {formats.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => setActive(f.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                active === f.id
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-silver hover:text-foreground"
              }`}
            >
              <f.icon size={16} />
              {f.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="p-8 lg:p-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-foreground">
                    <current.icon size={22} />
                  </div>
                  <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">
                    {current.title}
                  </h3>
                  <p className="leading-relaxed text-silver">
                    {current.description}
                  </p>
                </div>

                <div className="flex items-center justify-center border-t border-border bg-surface-2/50 p-8 lg:border-l lg:border-t-0">
                  <div className="flex w-full max-w-xs items-center justify-between gap-6">
                    {current.visual.map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex-1 text-center"
                      >
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-3 text-silver-accent">
                          <span className="font-heading text-xs font-bold">{v.label}</span>
                        </div>
                        <p className="font-mono text-xs text-silver">{v.skill}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PlatformFormatsSection;
