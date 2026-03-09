import { motion } from "framer-motion";
import type { FunnelStep } from "../hooks/useLiveAnalytics";

interface FunnelVisualizationProps {
  steps: FunnelStep[];
}

const FunnelVisualization = ({ steps }: FunnelVisualizationProps) => {
  if (!steps.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No funnel data available yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...steps.map(s => s.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-6">User Acquisition Funnel</h3>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const widthPct = Math.max(8, (step.count / maxCount) * 100);
          const conversionRate = i > 0 && steps[i - 1].count > 0
            ? ((step.count / steps[i - 1].count) * 100).toFixed(1)
            : null;

          return (
            <div key={step.step} className="flex items-center gap-4">
              <div className="w-24 text-right">
                <p className="text-xs font-medium text-foreground">{step.step}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{step.count.toLocaleString()}</p>
              </div>
              <div className="flex-1 relative">
                <div className="h-8 rounded-lg bg-surface-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-lg bg-gradient-to-r from-foreground/80 to-foreground/40"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${widthPct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                {conversionRate ? (
                  <span className={`font-mono text-[10px] font-bold ${parseFloat(conversionRate) >= 50 ? "text-skill-green" : parseFloat(conversionRate) >= 20 ? "text-badge-gold" : "text-destructive"}`}>
                    {conversionRate}%
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelVisualization;
