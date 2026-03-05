import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Hash, Cpu, Star } from "lucide-react";

const universities = [
  "MIT", "Stanford", "Oxford", "Cambridge", "Harvard", "Caltech", "ETH Zürich", "Imperial College",
  "UC Berkeley", "Princeton", "Yale", "Columbia", "NUS Singapore", "University of Toronto", "TU Munich",
  "Seoul National", "Tsinghua", "IIT Delhi", "KAIST", "University of Melbourne",
];

const trustIndicators = [
  { icon: ShieldCheck, label: "Verified Identity", description: "Every user verified via university email or government ID" },
  { icon: Star, label: "ELO Reputation", description: "Transparent, chess-like rating visible on every profile" },
  { icon: Hash, label: "Transaction Codes", description: "Every gig gets a unique code anyone can look up for verification" },
  { icon: Cpu, label: "AI Quality Checks", description: "Automated plagiarism, quality scoring, and satisfaction prediction" },
];

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <span className="font-heading text-4xl font-black text-foreground lg:text-5xl">
        {count.toLocaleString()}{suffix}
      </span>
      <p className="mt-1 text-sm text-silver">{label}</p>
    </div>
  );
};

const UniversityPartnersSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Trusted by Top Universities
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Partnered with leading institutions worldwide. Your university badge is your verified credential.
          </p>
        </motion.div>

        <div className="relative mb-16 overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
          <div className="flex animate-marquee gap-8">
            {[...universities, ...universities].map((uni, i) => (
              <div
                key={`${uni}-${i}`}
                className="flex flex-shrink-0 items-center justify-center rounded-xl border border-border bg-card px-6 py-3"
              >
                <span className="whitespace-nowrap font-heading text-sm font-semibold text-silver">{uni}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4"
        >
          <StatCounter value={10000} suffix="+" label="Skill Swaps Completed" />
          <StatCounter value={2000000} suffix="+" label="Points Exchanged" />
          <StatCounter value={50} suffix="+" label="Partner Universities" />
          <StatCounter value={98} suffix="%" label="Dispute Resolution Rate" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustIndicators.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-silver/30"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-silver-accent">
                <item.icon size={18} />
              </div>
              <h4 className="mb-1 font-heading text-sm font-semibold text-foreground">{item.label}</h4>
              <p className="text-xs leading-relaxed text-silver">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversityPartnersSection;
