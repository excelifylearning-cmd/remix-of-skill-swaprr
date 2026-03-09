import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ForecastPoint, ScenarioData } from "../hooks/useForecasting";

interface ForecastChartProps {
  data?: ForecastPoint[];
  scenarios?: ScenarioData[];
  height?: number;
  showConfidence?: boolean;
  title?: string;
  valuePrefix?: string;
}

const ForecastChart = ({ data, scenarios, height = 300, showConfidence = true, title, valuePrefix = "" }: ForecastChartProps) => {
  if (scenarios && scenarios.length > 0) {
    // Merge scenarios into single dataset
    const merged = scenarios[0].points.map((p, i) => {
      const entry: any = { month: p.month };
      scenarios.forEach(s => { entry[s.label] = s.points[i]?.value || 0; });
      return entry;
    });
    const colors = scenarios.map(s => s.color);

    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        {title && <h3 className="text-sm font-bold text-foreground mb-4">{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={merged} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${valuePrefix}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
              formatter={(v: number) => [`${valuePrefix}${v.toLocaleString()}`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {scenarios.map((s, i) => (
              <Area key={s.label} type="monotone" dataKey={s.label} stroke={colors[i]} fill={colors[i]} fillOpacity={0.05} strokeWidth={i === 1 ? 2.5 : 1.5} strokeDasharray={i !== 1 ? "4 4" : undefined} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {title && <h3 className="text-sm font-bold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${valuePrefix}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
          />
          {showConfidence && (
            <>
              <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--muted-foreground))" fillOpacity={0.06} />
              <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
            </>
          )}
          {data.some(d => d.actual !== undefined) && (
            <Area type="monotone" dataKey="actual" stroke="hsl(var(--skill-green))" fill="hsl(var(--skill-green))" fillOpacity={0.1} strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--skill-green))" }} />
          )}
          <Area type="monotone" dataKey="projected" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.05} strokeWidth={2} strokeDasharray="6 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
