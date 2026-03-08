import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles, Users, Globe, Zap } from "lucide-react";

const stats = [
  { value: "24K+", label: "Active Students", icon: Users },
  { value: "52", label: "Universities", icon: Globe },
  { value: "89K+", label: "Gigs Completed", icon: Zap },
  { value: "2.4M+", label: "Points Exchanged", icon: Sparkles },
];

const MissionHeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const headline = ["Built", "by", "students,", "for", "students."];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop"
          alt="Students collaborating"
          className="h-full w-full object-cover opacity-10 grayscale scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />

      {/* Floating grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-foreground/5"
            style={{ width: 200 + i * 120, height: 200 + i * 120, left: "50%", top: "50%", x: "-50%", y: "-50%" }}
            animate={{ rotate: [0, 360], opacity: [0.03, 0.08, 0.03] }}
            transition={{ rotate: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" }, opacity: { duration: 5 + i * 2, repeat: Infinity } }}
          />
        ))}
      </div>

      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/80 backdrop-blur-sm px-5 py-2"
        >
          <Sparkles size={14} className="text-badge-gold" />
          <span className="font-mono text-xs text-muted-foreground">About SkillSwappr</span>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-2 mb-8">
          {headline.map((word, i) => (
            <motion.span
              key={i}
              className="font-heading text-4xl sm:text-6xl lg:text-8xl font-black text-foreground"
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.2 + 0.12 * i, duration: 0.6, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          We believe every student has something valuable to offer. SkillSwappr eliminates the cash barrier 
          and lets talent flow freely — no wallets, just skills.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <motion.a
            href="/signup"
            className="rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background"
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--foreground)/0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            Join the Movement
          </motion.a>
          <motion.a
            href="#our-story"
            className="rounded-full border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Our Story ↓
          </motion.a>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 text-center"
              whileHover={{ y: -2, borderColor: "hsl(var(--foreground)/0.2)" }}
            >
              <s.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
              <p className="font-heading text-xl sm:text-2xl font-black text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
      </motion.div>
    </section>
  );
};

export default MissionHeroSection;
