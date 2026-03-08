import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Quote, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";

const stories = [
  {
    name: "Aisha K.",
    university: "MIT",
    skill: "UI/UX Design",
    quote: "I designed 15 projects and earned enough points to fund my entire senior thesis. SkillSwappr gave me access to developers I never could have afforded.",
    metrics: { gigs: 47, points: 12400, rating: 4.9 },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    background: "Started trading quick logo designs for coding help, scaled into a full UX practice.",
  },
  {
    name: "Marco R.",
    university: "Stanford",
    skill: "Full-Stack Dev",
    quote: "The guild system changed everything — my team now handles enterprise projects together. We've built 3 real products through SkillSwappr alone.",
    metrics: { gigs: 83, points: 28500, rating: 5.0 },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    background: "Formed a dev guild with 12 members. Now handles enterprise-grade contracts.",
  },
  {
    name: "Priya S.",
    university: "Oxford",
    skill: "Data Science",
    quote: "Through SkillSwappr, I built a portfolio that landed me my dream internship at a top AI lab. Real projects, real feedback, real growth.",
    metrics: { gigs: 31, points: 8900, rating: 4.8 },
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
    background: "Traded data visualization skills for machine learning mentorship.",
  },
  {
    name: "James L.",
    university: "UCLA",
    skill: "Video Production",
    quote: "No more chasing invoices. I swap my editing skills for graphic design, music, and motion work. My reel has never looked better.",
    metrics: { gigs: 56, points: 15200, rating: 4.7 },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    background: "Built a video production pipeline entirely through skill exchanges.",
  },
];

const SuccessStoriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  const next = () => setActive((p) => (p + 1) % stories.length);
  const prev = () => setActive((p) => (p - 1 + stories.length) % stories.length);
  const story = stories[active];

  return (
    <section ref={ref} className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Success Stories
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Real Students, Real Impact</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Hear from the community members who transformed their skills into opportunities.</p>
        </motion.div>

        {/* Featured story carousel */}
        <motion.div
          className="rounded-3xl border border-border bg-card overflow-hidden mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent md:hidden" />
              </div>

              {/* Content side */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <Quote size={32} className="text-badge-gold/30 mb-4" />
                <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-6">
                  "{story.quote}"
                </p>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{story.background}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground">{story.name}</p>
                    <p className="text-xs text-muted-foreground">{story.university} · {story.skill}</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="font-heading text-xl font-black text-foreground">{story.metrics.gigs}</p>
                    <p className="text-[10px] text-muted-foreground">Gigs</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <p className="font-heading text-xl font-black text-skill-green">{story.metrics.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Points</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <p className="font-heading text-xl font-black text-badge-gold flex items-center gap-1"><Star size={14} className="fill-current" />{story.metrics.rating}</p>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation & thumbnails */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-surface-2 transition-colors">
              <ChevronLeft size={16} className="text-foreground" />
            </button>
            <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-surface-2 transition-colors">
              <ChevronRight size={16} className="text-foreground" />
            </button>
          </div>

          <div className="flex gap-3">
            {stories.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} className="relative">
                <img
                  src={s.image}
                  alt={s.name}
                  className={`w-10 h-10 rounded-full object-cover transition-all duration-300 ${
                    i === active ? "ring-2 ring-foreground ring-offset-2 ring-offset-background grayscale-0" : "grayscale opacity-50 hover:opacity-80"
                  }`}
                />
              </button>
            ))}
          </div>

          <motion.a
            href="/signup"
            className="hidden sm:inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 3 }}
          >
            Share Your Story <ArrowRight size={12} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
