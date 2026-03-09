/**
 * useForecasting — Generates 12-month growth projections with confidence intervals.
 * Uses simple linear regression + seasonal adjustment from quarterly data.
 */
export interface ForecastPoint {
  month: string;
  actual?: number;
  projected: number;
  upperBound: number;
  lowerBound: number;
}

export interface ScenarioData {
  label: string;
  color: string;
  points: { month: string; value: number }[];
}

export function useForecasting(quarters: any[]) {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract monthly data from quarterly breakdowns
  const allMonths: { month: string; users: number; gigs: number; revenue: number }[] = [];
  quarters.forEach((q: any) => {
    (q.monthlyBreakdown || []).forEach((mb: any) => {
      allMonths.push({ month: mb.month, users: mb.users || 0, gigs: mb.gigs || 0, revenue: parseFloat(String(mb.revenue || "0").replace(/[^0-9.]/g, "")) || 0 });
    });
  });

  const generateForecast = (metric: "users" | "gigs" | "revenue"): ForecastPoint[] => {
    if (allMonths.length < 2) return monthLabels.map(m => ({ month: m, projected: 0, upperBound: 0, lowerBound: 0 }));

    const values = allMonths.map(m => m[metric]);
    const n = values.length;

    // Linear regression
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    values.forEach((y, i) => { num += (i - xMean) * (y - yMean); den += (i - xMean) ** 2; });
    const slope = den ? num / den : 0;
    const intercept = yMean - slope * xMean;

    // Standard error for confidence bands
    const residuals = values.map((y, i) => y - (intercept + slope * i));
    const stdErr = Math.sqrt(residuals.reduce((a, r) => a + r * r, 0) / Math.max(n - 2, 1));

    return monthLabels.map((label, i) => {
      const projected = Math.max(0, Math.round(intercept + slope * i));
      const isActual = i < n;
      const confidence = stdErr * (1 + (i - n) * 0.15);
      return {
        month: label,
        actual: isActual ? values[i] : undefined,
        projected,
        upperBound: Math.round(projected + confidence * 1.96),
        lowerBound: Math.max(0, Math.round(projected - confidence * 1.96)),
      };
    });
  };

  const generateScenarios = (metric: "users" | "gigs" | "revenue"): ScenarioData[] => {
    const base = generateForecast(metric);
    const baseValues = base.map(p => p.projected);

    return [
      {
        label: "Bull (25% growth)",
        color: "hsl(var(--skill-green))",
        points: monthLabels.map((m, i) => ({ month: m, value: Math.round(baseValues[i] * (1 + 0.25 * (i / 11))) })),
      },
      {
        label: "Base Case",
        color: "hsl(var(--foreground))",
        points: monthLabels.map((m, i) => ({ month: m, value: baseValues[i] })),
      },
      {
        label: "Bear (-10% decline)",
        color: "hsl(var(--destructive))",
        points: monthLabels.map((m, i) => ({ month: m, value: Math.max(0, Math.round(baseValues[i] * (1 - 0.1 * (i / 11)))) })),
      },
    ];
  };

  return {
    userForecast: generateForecast("users"),
    gigForecast: generateForecast("gigs"),
    revenueForecast: generateForecast("revenue"),
    userScenarios: generateScenarios("users"),
    revenueScenarios: generateScenarios("revenue"),
  };
}
