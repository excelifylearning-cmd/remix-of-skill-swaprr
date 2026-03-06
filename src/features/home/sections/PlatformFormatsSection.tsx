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
    visual: {
      type: "swap" as const,
      left: { name: "Designer", skill: "Logo Design", initials: "DK", elo: 1420 },
      right: { name: "Developer", skill: "React Frontend", initials: "JT", elo: 1560 },
      points: 50,
    },
  },
  {
    id: "auction",
    label: "Auction",
    icon: Gavel,
    title: "Competitive Submissions",
    description: "Post a task and set the reward. Multiple people submit their work. The best submission wins the most points — runners-up get consolation points. Every submission requires proof of deliverable to prevent gaming.",
    visual: {
      type: "auction" as const,
      submissions: [
        { initials: "AK", rank: 1, points: 120 },
        { initials: "MR", rank: 2, points: 40 },
        { initials: "LS", rank: 3, points: 15 },
      ],
      timer: "2d 14h",
    },
  },
  {
    id: "cocreation",
    label: "Co-Creation",
    icon: Users,
    title: "Build Together",
    description: "Break a project into roles. Invite collaborators or post each role publicly. Everyone works in a shared workspace with whiteboard and video. Points distributed per role completion. Unlock at Silver tier.",
    visual: {
      type: "cocreation" as const,
      roles: [
        { role: "Frontend", filled: true, initials: "JT" },
        { role: "Designer", filled: true, initials: "MK" },
        { role: "Backend", filled: false, initials: "?" },
        { role: "Copywriter", filled: true, initials: "LS" },
      ],
    },
  },
  {
    id: "fusion",
    label: "Skill Fusion",
    icon: Layers,
    title: "Multi-Skill Gigs",
    description: "Need a full app? Post a skill fusion gig requiring frontend, backend, and design. One person can fill all roles or multiple specialists can split it. Combined deliverable, combined value.",
    visual: {
      type: "fusion" as const,
      skills: ["Frontend", "Backend", "Design"],
      output: "Full App",
    },
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    title: "Full Product Build",
    description: 'Define "build an app" and the platform suggests component gigs — logo, database, frontend, copywriting. Each becomes a sub-gig with its own workspace and point allocation. Unlock at Gold tier.',
    visual: {
      type: "project" as const,
      subgigs: [
        { name: "Logo", points: 30, done: true },
        { name: "Database", points: 50, done: true },
        { name: "Frontend", points: 80, done: false },
        { name: "Copy", points: 25, done: false },
        { name: "Deploy", points: 40, done: false },
      ],
    },
  },
];

const SwapVisual = ({ data }: { data: (typeof formats)[0]["visual"] }) => {
  if (data.type !== "swap") return null;
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-3 font-heading text-sm font-bold text-foreground">
          {data.left.initials}
        </div>
        <span className="text-xs font-medium text-foreground">{data.left.name}</span>
        <span className="font-mono text-[10px] text-silver">{data.left.skill}</span>
        <span className="font-mono text-[10px] text-silver/60">ELO {data.left.elo}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex flex-col items-center gap-1"
      >
        <ArrowLeftRight size={20} className="text-silver" />
        <span className="rounded-full bg-skill-green/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-skill-green">
          +{data.points} SP
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-3 font-heading text-sm font-bold text-foreground">
          {data.right.initials}
        </div>
        <span className="text-xs font-medium text-foreground">{data.right.name}</span>
        <span className="font-mono text-[10px] text-silver">{data.right.skill}</span>
        <span className="font-mono text-[10px] text-silver/60">ELO {data.right.elo}</span>
      </motion.div>
    </div>
  );
};

const AuctionVisual = ({ data }: { data: (typeof formats)[1]["visual"] }) => {
  if (data.type !== "auction") return null;
  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-silver">SUBMISSIONS</span>
        <span className="rounded bg-alert-red/10 px-2 py-0.5 font-mono text-[10px] text-alert-red">⏱ {data.timer}</span>
      </div>
      {data.submissions.map((s, i) => (
        <motion.div
          key={s.initials}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
            s.rank === 1 ? "bg-badge-gold/10 border border-badge-gold/20" : "bg-surface-3"
          }`}
        >
          <span className={`font-heading text-sm font-black ${s.rank === 1 ? "text-badge-gold" : "text-silver"}`}>
            #{s.rank}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-semibold text-foreground">
            {s.initials}
          </div>
          <span className={`ml-auto font-mono text-xs font-semibold ${s.rank === 1 ? "text-badge-gold" : "text-silver"}`}>
            +{s.points} SP
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const CoCreationVisual = ({ data }: { data: (typeof formats)[2]["visual"] }) => {
  if (data.type !== "cocreation") return null;
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {data.roles.map((r, i) => (
        <motion.div
          key={r.role}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${
            r.filled ? "bg-surface-3" : "border border-dashed border-border bg-transparent"
          }`}
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
            r.filled ? "bg-skill-green/15 text-skill-green" : "bg-surface-2 text-silver/40"
          }`}>
            {r.initials}
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">{r.role}</p>
            <p className="font-mono text-[9px] text-silver">{r.filled ? "Filled" : "Open"}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const FusionVisual = ({ data }: { data: (typeof formats)[3]["visual"] }) => {
  if (data.type !== "fusion") return null;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {data.skills.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-lg bg-surface-3 px-3 py-2 text-center"
          >
            <p className="text-xs font-medium text-foreground">{s}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.4 }}
        className="h-8 w-px bg-gradient-to-b from-silver/40 to-skill-green/40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="rounded-xl bg-skill-green/10 border border-skill-green/20 px-5 py-3 text-center"
      >
        <p className="font-heading text-sm font-bold text-skill-green">{data.output}</p>
        <p className="font-mono text-[9px] text-silver">Combined Deliverable</p>
      </motion.div>
    </div>
  );
};

const ProjectVisual = ({ data }: { data: (typeof formats)[4]["visual"] }) => {
  if (data.type !== "project") return null;
  return (
    <div className="space-y-2">
      <span className="font-mono text-[10px] text-silver">SUB-GIGS</span>
      {data.subgigs.map((g, i) => (
        <motion.div
          key={g.name}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 rounded-lg bg-surface-3 px-3 py-2"
        >
          <div className={`h-2 w-2 rounded-full ${g.done ? "bg-skill-green" : "bg-silver/30"}`} />
          <span className={`text-xs font-medium ${g.done ? "text-foreground" : "text-silver"}`}>{g.name}</span>
          <span className="ml-auto font-mono text-[10px] text-silver">{g.points} SP</span>
        </motion.div>
      ))}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-full rounded-full bg-gradient-to-r from-skill-green to-skill-green/60"
        />
      </div>
    </div>
  );
};

const VisualPanel = ({ visual }: { visual: (typeof formats)[number]["visual"] }) => {
  switch (visual.type) {
    case "swap": return <SwapVisual data={visual as any} />;
    case "auction": return <AuctionVisual data={visual as any} />;
    case "cocreation": return <CoCreationVisual data={visual as any} />;
    case "fusion": return <FusionVisual data={visual as any} />;
    case "project": return <ProjectVisual data={visual as any} />;
    default: return null;
  }
};

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
                  <div className="w-full max-w-xs">
                    <VisualPanel visual={current.visual} />
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
