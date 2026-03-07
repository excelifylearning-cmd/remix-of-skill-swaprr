import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import {
  Heart, Target, Zap, Shield, Users, Globe, ArrowRight, Play, Star,
  Award, TrendingUp, BookOpen, Handshake, Building2, Mail, Linkedin,
  Twitter, Github, ChevronDown, MapPin, GraduationCap, Briefcase,
  Clock, CheckCircle2, Quote, ExternalLink, BarChart3, Trophy
} from "lucide-react";

/* ───── helpers ───── */
const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
};

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ───── Section 1: Mission Hero ───── */
const MissionHeroSection = () => {
  const headline = "Built by students, for students.";
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop"
          alt="Students collaborating"
          className="h-full w-full object-cover opacity-15 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-border/30"
            style={{
              width: 100 + i * 80,
              height: 100 + i * 80,
              left: `${20 + i * 10}%`,
              top: `${15 + i * 8}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8">
          {headline.split("").map((char, i) => (
            <motion.span
              key={i}
              className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.5 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl text-silver max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          We believe every student has something valuable to offer. Skill Swappr eliminates the cash barrier
          and lets talent flow freely — no wallets, just skills.
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.a
            href="/signup"
            className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background"
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(var(--silver)/0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            Join the Movement
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-silver/50" />
      </motion.div>
    </section>
  );
};

/* ───── Section 2: The Problem We Solve ───── */
const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    { icon: Briefcase, problem: "High freelancing fees (20-30%)", solution: "Zero cash fees — trade skills directly" },
    { icon: Shield, problem: "No trust between strangers", solution: "ELO ratings, verified identities, Skill Court" },
    { icon: Target, problem: "Cash barrier for students", solution: "Skill Points economy — earn by doing" },
    { icon: Clock, problem: "No dispute resolution", solution: "AI + community-powered Skill Court" },
  ];

  return (
    <motion.section
      ref={ref}
      className="py-32 px-6"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          variants={fadeUp}
        >
          The Problem We Solve
        </motion.h2>
        <motion.p className="text-silver text-center mb-20 max-w-2xl mx-auto" variants={fadeUp}>
          Traditional freelancing wasn't built for students. We fixed that.
        </motion.p>

        <motion.div className="space-y-8" variants={staggerContainer}>
          {problems.map((item, i) => (
            <motion.div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center"
              variants={fadeUp}
            >
              {/* Problem */}
              <div className="glass rounded-2xl p-6 text-right overflow-hidden relative">
                <div className="flex items-center justify-end gap-3 relative z-10">
                  <span className="text-destructive font-medium">{item.problem}</span>
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Connector */}
              <motion.div
                className="hidden md:flex items-center justify-center"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <ArrowRight className="w-6 h-6 text-skill-green" />
              </motion.div>

              {/* Solution */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--skill-green)/0.1)] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-skill-green" />
                  </div>
                  <span className="text-skill-green font-medium">{item.solution}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── Section 3: Platform Timeline ───── */
const TimelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const milestones = [
    { date: "Jan 2024", title: "Idea Born", desc: "Two university students frustrated with freelancing fees sketch the first concept.", icon: Zap },
    { date: "Mar 2024", title: "Prototype Built", desc: "First working prototype with basic skill swapping and points system.", icon: Target },
    { date: "Jun 2024", title: "Beta Launch", desc: "500 students across 3 universities join the private beta.", icon: Users },
    { date: "Sep 2024", title: "Skill Court Added", desc: "Community-powered dispute resolution goes live.", icon: Shield },
    { date: "Dec 2024", title: "Guild System", desc: "Teams form, treasuries pool, and guild wars begin.", icon: Trophy },
    { date: "Mar 2025", title: "10K Users", desc: "Platform crosses 10,000 active users across 20 universities.", icon: TrendingUp },
    { date: "Jun 2025", title: "Enterprise Mode", desc: "Companies start hiring vetted student talent.", icon: Building2 },
    { date: "2026", title: "Global Expansion", desc: "Multi-language support and international university partnerships.", icon: Globe },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6 bg-surface-1">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Our Journey
        </motion.h2>
        <motion.p
          className="text-silver text-center mb-20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          From a dorm room idea to a global platform.
        </motion.p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border">
            <motion.div className="w-full bg-foreground origin-top" style={{ height: lineHeight }} />
          </div>

          {milestones.map((m, i) => (
            <motion.div
              key={i}
              className={`relative flex items-start gap-8 mb-16 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
            >
              <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""} hidden md:block`}>
                <div className="glass rounded-2xl p-6">
                  <span className="text-xs font-mono text-silver">{m.date}</span>
                  <h3 className="font-heading text-lg font-bold mt-1">{m.title}</h3>
                  <p className="text-sm text-silver mt-2">{m.desc}</p>
                </div>
              </div>

              {/* Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="w-10 h-10 rounded-full bg-card border-2 border-foreground flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  <m.icon className="w-4 h-4 text-foreground" />
                </motion.div>
              </div>

              <div className="flex-1 hidden md:block" />

              {/* Mobile card */}
              <div className="md:hidden ml-16 glass rounded-2xl p-6">
                <span className="text-xs font-mono text-silver">{m.date}</span>
                <h3 className="font-heading text-lg font-bold mt-1">{m.title}</h3>
                <p className="text-sm text-silver mt-2">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

/* ───── Section 4: Success Stories Gallery ───── */
const SuccessStoriesGallery = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number | null>(null);

  const stories = [
    {
      name: "Aisha K.",
      university: "MIT",
      skill: "UI/UX Design",
      quote: "I designed 15 projects and earned enough points to fund my entire senior thesis.",
      metrics: { gigs: 47, points: 12400, rating: 4.9 },
      avatar: "AK",
    },
    {
      name: "Marco R.",
      university: "Stanford",
      skill: "Full-Stack Dev",
      quote: "The guild system changed everything — my team now handles enterprise projects together.",
      metrics: { gigs: 83, points: 28500, rating: 5.0 },
      avatar: "MR",
    },
    {
      name: "Priya S.",
      university: "Oxford",
      skill: "Data Science",
      quote: "Through Skill Swappr, I built a portfolio that landed me my dream internship.",
      metrics: { gigs: 31, points: 8900, rating: 4.8 },
      avatar: "PS",
    },
    {
      name: "James L.",
      university: "UCLA",
      skill: "Video Production",
      quote: "No more chasing invoices. Swap skills, get points, build your craft.",
      metrics: { gigs: 56, points: 15200, rating: 4.7 },
      avatar: "JL",
    },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Success Stories
        </motion.h2>
        <motion.p
          className="text-silver text-center mb-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Real students. Real results.
        </motion.p>

        {/* Featured Story */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[hsl(var(--badge-gold)/0.05)] to-transparent" />
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
              alt={stories[0].name}
              className="w-24 h-24 rounded-full object-cover border-2 shrink-0 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ borderColor: "hsl(var(--badge-gold))" }}
            />
            <div className="flex-1 text-center md:text-left">
              <Quote className="w-8 h-8 text-badge-gold mb-4 mx-auto md:mx-0" />
              <p className="text-xl md:text-2xl font-medium mb-4 leading-relaxed">"{stories[0].quote}"</p>
              <p className="text-silver">
                <span className="text-foreground font-semibold">{stories[0].name}</span> · {stories[0].university} · {stories[0].skill}
              </p>
              <div className="flex gap-6 mt-4 justify-center md:justify-start">
                <span className="text-sm"><span className="text-foreground font-bold">{stories[0].metrics.gigs}</span> <span className="text-silver">gigs</span></span>
                <span className="text-sm"><span className="text-skill-green font-bold">{stories[0].metrics.points.toLocaleString()}</span> <span className="text-silver">points</span></span>
                <span className="text-sm"><span className="text-badge-gold font-bold">★ {stories[0].metrics.rating}</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Story Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
          {stories.slice(1).map((story, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 card-3d cursor-pointer group"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(i + 1)}
            >
              <div className="card-3d-inner">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    ][i]}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div>
                    <p className="font-semibold text-sm">{story.name}</p>
                    <p className="text-xs text-silver">{story.university}</p>
                  </div>
                </div>
                <p className="text-sm text-silver mb-4 line-clamp-3">"{story.quote}"</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-skill-green font-mono">{story.metrics.points.toLocaleString()} pts</span>
                  <span className="text-badge-gold">★ {story.metrics.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/signup"
            className="inline-flex items-center gap-2 text-sm text-silver hover:text-foreground transition-colors"
            whileHover={{ x: 5 }}
          >
            Submit Your Story <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── Section 5: University Partnerships ───── */
const UniversityPartnershipsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const universities = [
    "MIT", "Stanford", "Oxford", "Cambridge", "UCLA", "Harvard",
    "ETH Zürich", "Imperial College", "Berkeley", "Princeton",
    "Carnegie Mellon", "Georgia Tech", "Yale", "Columbia", "NYU",
  ];

  const benefits = [
    { title: "For Universities", items: ["Branded skill badges", "Student engagement analytics", "Curriculum integration", "Co-branded events"] },
    { title: "For Students", items: ["Verified university badge", "Campus-specific marketplace", "Academic credit potential", "Priority in enterprise gigs"] },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          University Partners
        </motion.h2>
        <motion.p
          className="text-silver text-center mb-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Trusted by leading institutions worldwide.
        </motion.p>

        {/* Map placeholder with dots */}
        <motion.div
          className="relative glass rounded-3xl p-8 md:p-12 mb-16 h-64 md:h-96 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop"
            alt="University campus"
            className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          {universities.slice(0, 10).map((uni, i) => (
            <motion.div
              key={i}
              className="absolute group"
              style={{
                left: `${15 + (i % 5) * 18}%`,
                top: `${20 + Math.floor(i / 5) * 30}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-foreground cursor-pointer"
                whileHover={{ scale: 2 }}
                animate={{ boxShadow: ["0 0 0 0 hsl(var(--foreground)/0.3)", "0 0 0 8px hsl(var(--foreground)/0)", "0 0 0 0 hsl(var(--foreground)/0.3)"] }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity, delay: i * 0.3 } }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-card border border-border text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {uni}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((section, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <h3 className="font-heading text-xl font-bold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-silver">
                    <CheckCircle2 className="w-4 h-4 text-skill-green shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/enterprise"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Become a Partner <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── Section 6: Industry Partnerships ───── */
const IndustryPartnershipsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const partners = [
    { name: "Figma", category: "Design" },
    { name: "GitHub", category: "Development" },
    { name: "Notion", category: "Productivity" },
    { name: "Slack", category: "Communication" },
    { name: "Vercel", category: "Deployment" },
    { name: "Linear", category: "Project Management" },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Industry Integrations
        </motion.h2>
        <motion.p className="text-silver text-center mb-16" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
          Built to work with the tools you already use.
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {partners.map((p, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8 text-center group"
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: "hsl(var(--foreground)/0.3)" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4 group-hover:bg-surface-3 transition-colors">
                <span className="font-heading font-bold text-lg">{p.name[0]}</span>
              </div>
              <h3 className="font-heading font-semibold mb-1">{p.name}</h3>
              <p className="text-xs text-silver">{p.category}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── Section 7: Team Section ───── */
const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [flipped, setFlipped] = useState<number | null>(null);

  const team = [
    { name: "Alex Chen", role: "Co-Founder & CEO", bio: "Former MIT CS. Obsessed with making education accessible.", initials: "AC" },
    { name: "Sarah Park", role: "Co-Founder & CTO", bio: "Ex-Stripe engineer. Building the skill economy infrastructure.", initials: "SP" },
    { name: "David Okafor", role: "Head of Design", bio: "Award-winning designer. Making complexity feel simple.", initials: "DO" },
    { name: "Mia Zhang", role: "Head of Community", bio: "Built communities of 100K+. Knows what students need.", initials: "MZ" },
    { name: "James Miller", role: "Lead Engineer", bio: "Full-stack wizard. Ships features at light speed.", initials: "JM" },
    { name: "Lena Kovac", role: "Head of Partnerships", bio: "Connected 50+ universities. Expanding globally.", initials: "LK" },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Meet the Team
        </motion.h2>
        <motion.p className="text-silver text-center mb-16" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
          The people building the future of skill exchange.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="relative h-64 cursor-pointer"
              style={{ perspective: 1000 }}
              variants={fadeUp}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped === i ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
                    ][i]}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border border-border mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <h3 className="font-heading font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-silver mt-1">{member.role}</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <p className="text-sm text-silver text-center mb-6">{member.bio}</p>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-silver" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-silver" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/careers"
            className="inline-flex items-center gap-2 text-sm text-silver hover:text-foreground transition-colors"
            whileHover={{ x: 5 }}
          >
            Join the Team <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── Section 8: Community Stats ───── */
const CommunityStatsSection = () => {
  const stats = [
    { label: "Active Users", value: 24500, suffix: "+" },
    { label: "Gigs Completed", value: 89200, suffix: "+" },
    { label: "Points Exchanged", value: 2400000, suffix: "+" },
    { label: "Guilds Formed", value: 1200, suffix: "+" },
    { label: "Disputes Resolved", value: 4800, suffix: "" },
    { label: "Universities", value: 52, suffix: "" },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Community in Numbers
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <motion.div
                key={i}
                ref={ref}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-heading text-4xl sm:text-5xl font-bold">
                  {count.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-sm text-silver mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ───── Section 9: Values & Culture ───── */
const ValuesCultureSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    { icon: Shield, title: "Fairness", desc: "Equal opportunity regardless of financial status. Skills are the only currency that matters." },
    { icon: Heart, title: "Transparency", desc: "Open economy, public ELO, verifiable transactions. Nothing hidden." },
    { icon: Zap, title: "Gamification", desc: "Learning and working should be engaging. We make skill-building feel like leveling up." },
    { icon: Users, title: "Community", desc: "Guilds, forums, court duty — every feature brings people together." },
    { icon: Target, title: "Quality", desc: "AI monitoring, peer review, ELO stakes. Great work is rewarded, always." },
    { icon: Globe, title: "Accessibility", desc: "Multi-language, university partnerships, zero cash barrier. Everyone belongs." },
  ];

  return (
    <motion.section ref={ref} className="py-32 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-heading text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Our Values
        </motion.h2>
        <motion.p className="text-silver text-center mb-16" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
          The principles that drive every decision.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {values.map((value, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8 group"
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: "hsl(var(--foreground)/0.2)" }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mb-6 group-hover:bg-surface-3 transition-colors"
                whileHover={{ rotate: 5 }}
              >
                <value.icon className="w-6 h-6 text-foreground" />
              </motion.div>
              <h3 className="font-heading text-lg font-bold mb-3">{value.title}</h3>
              <p className="text-sm text-silver leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ───── About CTA Footer ───── */
const AboutCTASection = () => (
  <section className="py-32 px-6 text-center">
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="font-heading text-4xl sm:text-6xl font-bold mb-6">
        Ready to Start <span className="text-silver">Swapping?</span>
      </h2>
      <p className="text-silver text-lg mb-10">
        Join thousands of students who are trading skills, building portfolios, and leveling up together.
      </p>
      <motion.a
        href="/signup"
        className="inline-flex rounded-full bg-foreground px-10 py-4 text-lg font-medium text-background"
        whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--silver)/0.3)" }}
        whileTap={{ scale: 0.98 }}
      >
        Get Started Free
      </motion.a>
    </motion.div>
  </section>
);

/* ───── Main Page ───── */
const AboutPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <CursorGlow />
      <Navbar />
    <MissionHeroSection />
    <ProblemSection />
    <TimelineSection />
    <SuccessStoriesGallery />
    <UniversityPartnershipsSection />
    <IndustryPartnershipsSection />
    <TeamSection />
    <CommunityStatsSection />
    <ValuesCultureSection />
      <AboutCTASection />
    </div>
  </PageTransition>
);

export default AboutPage;
