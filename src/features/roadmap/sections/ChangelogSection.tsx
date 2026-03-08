import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Bug, Sparkles, Wrench, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

type ChangeType = "feature" | "fix" | "improvement" | "breaking";

interface ChangeEntry {
  type: ChangeType;
  text: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  highlight?: string;
  changes: ChangeEntry[];
}

const typeConfig: Record<ChangeType, { label: string; icon: typeof Tag; color: string; bg: string }> = {
  feature: { label: "New", icon: Sparkles, color: "text-skill-green", bg: "bg-skill-green/10" },
  fix: { label: "Fix", icon: Bug, color: "text-alert-red", bg: "bg-alert-red/10" },
  improvement: { label: "Improved", icon: Wrench, color: "text-court-blue", bg: "bg-court-blue/10" },
  breaking: { label: "Breaking", icon: Tag, color: "text-badge-gold", bg: "bg-badge-gold/10" },
};

const changelog: ChangelogEntry[] = [
  {
    version: "2.4.0", date: "Mar 5, 2026", title: "Co-Creation Studio Launch",
    highlight: "Multi-person collaborative workspaces are now live!",
    changes: [
      { type: "feature", text: "Co-Creation Studio with real-time whiteboard, video chat, and shared code editor" },
      { type: "feature", text: "Role-based point distribution in collaborative gigs" },
      { type: "improvement", text: "Redesigned gig detail page with tabbed layout and richer media previews" },
      { type: "fix", text: "Fixed ELO rating not updating correctly after disputed gigs" },
      { type: "fix", text: "Resolved notification badge count mismatch on mobile" },
    ],
  },
  {
    version: "2.3.2", date: "Feb 18, 2026", title: "Performance & Polish",
    changes: [
      { type: "improvement", text: "50% faster marketplace search with optimized indexing" },
      { type: "improvement", text: "Smoother animations on low-end devices with reduced motion support" },
      { type: "fix", text: "Fixed guild treasury display showing incorrect balance after withdrawals" },
      { type: "fix", text: "Auction countdown timer now syncs correctly across timezones" },
    ],
  },
  {
    version: "2.3.0", date: "Jan 28, 2026", title: "Guild Wars Season 2",
    highlight: "Competitive guild tournaments with new reward tiers.",
    changes: [
      { type: "feature", text: "Guild Wars Season 2 with bracket-style tournaments and live leaderboards" },
      { type: "feature", text: "New guild badges: Warmaster, Strategist, and MVP" },
      { type: "improvement", text: "Guild treasury now supports scheduled payouts and contribution history" },
      { type: "breaking", text: "Guild API v1 endpoints deprecated — migrate to v2 by March 2026" },
      { type: "fix", text: "Fixed skill tag autocomplete not showing results for multi-word queries" },
    ],
  },
  {
    version: "2.2.0", date: "Dec 12, 2025", title: "Skill Court Overhaul",
    changes: [
      { type: "feature", text: "Redesigned Skill Court with evidence timeline and structured juror deliberation" },
      { type: "feature", text: "Juror reputation system with ELO-based case assignment" },
      { type: "improvement", text: "Dispute resolution time reduced by 40% with AI-assisted case summaries" },
      { type: "improvement", text: "Added dark mode support for all email templates" },
      { type: "fix", text: "Fixed profile portfolio images not loading on Safari" },
    ],
  },
  {
    version: "2.1.0", date: "Nov 1, 2025", title: "Auction Format & Analytics",
    changes: [
      { type: "feature", text: "Auction gig format with competitive bidding and multi-submission review" },
      { type: "feature", text: "Personal analytics dashboard with monthly performance charts" },
      { type: "improvement", text: "Onboarding flow redesigned with skill assessment quiz" },
      { type: "fix", text: "Fixed point transfer failing silently when recipient had a full inbox" },
    ],
  },
];

const ChangelogSection = () => {
  const [expanded, setExpanded] = useState<string[]>([changelog[0].version]);

  const toggle = (v: string) =>
    setExpanded((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center font-heading text-3xl font-bold text-foreground">
          Changelog
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
          Every update, fix, and improvement — documented transparently.
        </motion.p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 hidden h-full w-px bg-border md:block" />

          <div className="space-y-4">
            {changelog.map((entry, i) => {
              const isOpen = expanded.includes(entry.version);
              return (
                <motion.div
                  key={entry.version}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative md:pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[14px] top-5 hidden h-[11px] w-[11px] rounded-full border-2 border-border bg-card md:block" />

                  <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <button
                      onClick={() => toggle(entry.version)}
                      className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-surface-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono text-xs font-bold text-foreground">
                          v{entry.version}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{entry.title}</h3>
                          <span className="text-xs text-muted-foreground">{entry.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-1.5 sm:flex">
                          {Array.from(new Set(entry.changes.map((c) => c.type))).map((t) => {
                            const cfg = typeConfig[t];
                            return (
                              <span key={t} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                            );
                          })}
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                      </div>
                    </button>

                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border">
                        {entry.highlight && (
                          <div className="border-b border-border bg-skill-green/5 px-5 py-3">
                            <p className="flex items-center gap-2 text-sm font-medium text-skill-green">
                              <Sparkles size={14} /> {entry.highlight}
                            </p>
                          </div>
                        )}
                        <ul className="divide-y divide-border">
                          {entry.changes.map((change, ci) => {
                            const cfg = typeConfig[change.type];
                            return (
                              <li key={ci} className="flex items-start gap-3 px-5 py-3">
                                <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${cfg.bg}`}>
                                  <cfg.icon size={10} className={cfg.color} />
                                </span>
                                <span className="text-sm text-muted-foreground">{change.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
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

export default ChangelogSection;
