import { motion } from "framer-motion";

interface CohortRow {
  month: string;
  d1: number;
  d7: number;
  d30: number;
  d60?: number;
  d90: number | string;
}

interface RetentionHeatmapProps {
  cohorts: CohortRow[];
}

const getColor = (value: number | string): string => {
  if (typeof value !== "number") return "bg-surface-2 text-muted-foreground/40";
  if (value >= 80) return "bg-skill-green/30 text-skill-green";
  if (value >= 60) return "bg-skill-green/15 text-skill-green";
  if (value >= 40) return "bg-badge-gold/15 text-badge-gold";
  if (value >= 20) return "bg-destructive/10 text-destructive";
  return "bg-surface-2 text-muted-foreground";
};

const RetentionHeatmap = ({ cohorts }: RetentionHeatmapProps) => {
  const periods = ["D1", "D7", "D30", "D60", "D90"];
  const keys = ["d1", "d7", "d30", "d60", "d90"] as const;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="bg-surface-2 px-5 py-3 text-xs font-bold text-foreground">Cohort Retention Matrix</div>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-6 gap-0 border-b border-border px-4 py-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Cohort</span>
            {periods.map(p => (
              <span key={p} className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{p}</span>
            ))}
          </div>
          {cohorts.map((c, i) => (
            <motion.div
              key={c.month}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-6 gap-0 border-b border-border/50 last:border-0 px-4 py-1.5 items-center"
            >
              <span className="font-mono text-[10px] font-medium text-foreground">{c.month}</span>
              {keys.map(k => {
                const val = c[k as keyof CohortRow];
                if (val === undefined) return <div key={k} className="text-center"><span className="inline-block rounded px-2 py-1 text-[10px] font-mono bg-surface-2 text-muted-foreground/30">—</span></div>;
                return (
                  <div key={k} className="text-center">
                    <span className={`inline-block rounded px-2 py-1 text-[10px] font-mono font-bold ${getColor(val)}`}>
                      {typeof val === "number" ? `${val}%` : val}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetentionHeatmap;
