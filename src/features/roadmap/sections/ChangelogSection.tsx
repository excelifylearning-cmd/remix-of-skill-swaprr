import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Bug, Sparkles, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const ChangelogSection = () => {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("changelog_entries")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        const entries = data.map((d: any) => ({
          version: d.version,
          date: d.date,
          title: d.title,
          highlight: d.highlight,
          changes: (d.changes || []) as ChangeEntry[],
        }));
        setChangelog(entries);
        if (entries.length > 0) setExpanded([entries[0].version]);
      }
      setLoading(false);
    };
    load();
  }, []);

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

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading changelog...</div>
        ) : (
          <div className="relative">
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
        )}
      </div>
    </section>
  );
};

export default ChangelogSection;
