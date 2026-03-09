import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  delay?: number;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const MetricCard = ({ label, value, suffix = "", icon: Icon, trend, trendValue, description, delay = 0, animate = true, size = "md" }: MetricCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numericValue) && animate;

  useEffect(() => {
    if (!inView || !isNumeric) return;
    const end = numericValue;
    let start = 0;
    const step = end / (1500 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayValue(end); clearInterval(timer); }
      else setDisplayValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericValue, isNumeric]);

  const trendColors = { up: "text-skill-green", down: "text-destructive", neutral: "text-muted-foreground" };
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };
  const valueSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`rounded-xl border border-border bg-card ${sizeClasses[size]} group hover:border-muted-foreground/30 transition-colors`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon size={size === "lg" ? 18 : 14} className="text-muted-foreground" />
        {trend && trendValue && (
          <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${trendColors[trend]}`}>
            <TrendIcon size={8} />{trendValue}
          </span>
        )}
      </div>
      <p className={`font-heading ${valueSizes[size]} font-black text-foreground leading-tight font-mono`}>
        {isNumeric ? displayValue.toLocaleString() : value}{suffix}
      </p>
      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{label}</p>
      {description && <p className="text-[9px] text-muted-foreground/60 mt-0.5">{description}</p>}
    </motion.div>
  );
};

export default MetricCard;
