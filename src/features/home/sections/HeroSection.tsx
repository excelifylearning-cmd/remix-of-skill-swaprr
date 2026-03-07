import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const headlineWords = ["Trade", "Skills.", "Build", "Together."];

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      spotlightX.set(e.clientX - rect.left);
      spotlightY.set(e.clientY - rect.top);
      setSpotlightOpacity(1);
    };

    const handleMouseLeave = () => setSpotlightOpacity(0);

    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [spotlightX, spotlightY]);

  return (
    <section ref={containerRef} className="relative flex min-h-screen items-center overflow-hidden bg-background">
      {/* Cursor-following gradient spotlight */}
      <motion.div
        className="pointer-events-none absolute z-[1] h-[600px] w-[600px] rounded-full"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(var(--silver) / 0.07) 0%, transparent 70%)",
          opacity: spotlightOpacity,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2">
        {/* Left: Spline 3D Robot */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-square w-full max-w-[600px] mx-auto lg:mx-0"
        >
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-HTe9Lm88u5SNyHQbXlcTcSeH/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="rounded-2xl"
            title="3D Robot"
          />
        </motion.div>

        {/* Right: Text content */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
              The skill exchange platform for students
            </span>
          </motion.div>

          <h1 className="mb-6 font-heading text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + i * 0.15,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="mr-3 inline-block sm:mr-4"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl"
          >
            Exchange your design skills for development, writing for marketing — no money needed. Just skill points.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <motion.a
              href="/signup"
              className="rounded-full bg-foreground px-8 py-3.5 text-center text-sm font-semibold text-background shadow-[0_0_30px_hsl(var(--silver)/0.15)] transition-shadow hover:shadow-[0_0_40px_hsl(var(--silver)/0.3)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Swapping
            </motion.a>
            <motion.button
              className="rounded-full border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch How It Works
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mt-12 flex items-center gap-8"
          >
            <div className="text-center">
              <span className="font-heading text-2xl font-bold text-foreground">10K+</span>
              <p className="text-xs text-muted-foreground">Skill Swaps</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <span className="font-heading text-2xl font-bold text-foreground">50+</span>
              <p className="text-xs text-muted-foreground">Universities</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <span className="font-heading text-2xl font-bold text-foreground">2M+</span>
              <p className="text-xs text-muted-foreground">Points Exchanged</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
