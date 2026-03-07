import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, Circle, Zap, Target, Users, Shield, Trophy,
  Globe, Building2, Smartphone, Bot
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const phases = [
  {
    phase: "Phase 1", status: "completed", label: "Foundation",
    items: [
      { title: "Core Marketplace", status: "completed", icon: Zap },
      { title: "Skill Points Economy", status: "completed", icon: Target },
      { title: "Direct Swap Format", status: "completed", icon: Users },
      { title: "Basic Profiles", status: "completed", icon: Shield },
    ],
  },
  {
    phase: "Phase 2", status: "completed", label: "Growth",
    items: [
      { title: "Auction Format", status: "completed", icon: Trophy },
      { title: "Skill Court System", status: "completed", icon: Shield },
      { title: "Guild System", status: "completed", icon: Users },
      { title: "ELO Rating System", status: "completed", icon: Target },
    ],
  },
  {
    phase: "Phase 3", status: "in-progress", label: "Expansion",
    items: [
      { title: "Co-Creation Studio", status: "completed", icon: Users },
      { title: "Enterprise Mode", status: "in-progress", icon: Building2 },
      { title: "AI Quality Panel", status: "in-progress", icon: Bot },
      { title: "Mobile App", status: "planned", icon: Smartphone },
    ],
  },
  {
    phase: "Phase 4", status: "planned", label: "Global",
    items: [
      { title: "Multi-language Support", status: "planned", icon: Globe },
      { title: "Skill Fusion & Projects", status: "planned", icon: Target },
      { title: "Quarterly Wraps", status: "planned", icon: Trophy },
      { title: "API Marketplace", status: "planned", icon: Zap },
    ],
  },
];

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle2 size={16} className="text-skill-green" />;
  if (s === "in-progress") return <Clock size={16} className="text-badge-gold" />;
  return <Circle size={16} className="text-muted-foreground" />;
};

const statusColor = (s: string) => {
  if (s === "completed") return "border-skill-green/30";
  if (s === "in-progress") return "border-badge-gold/30";
  return "border-border";
};

const RoadmapPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-20 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl"
            >
              Built in Public, <span className="text-muted-foreground">Shaped by You</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-xl text-lg text-muted-foreground"
            >
              See what we've shipped, what we're building, and what's coming next.
            </motion.p>
          </div>
        </section>

        {/* Roadmap */}
        <section className="pb-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

              {phases.map((phase, pi) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: pi * 0.1 }}
                  className="relative mb-12 ml-16"
                >
                  <div className="absolute -left-[2.5rem] top-1 z-10">
                    {statusIcon(phase.status)}
                  </div>

                  <div className="mb-4">
                    <span className="font-mono text-xs text-muted-foreground">{phase.phase}</span>
                    <h3 className="font-heading text-xl font-bold text-foreground">{phase.label}</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {phase.items.map((item) => (
                      <div
                        key={item.title}
                        className={`flex items-center gap-3 rounded-xl border bg-card p-4 ${statusColor(item.status)}`}
                      >
                        {statusIcon(item.status)}
                        <span className="text-sm text-foreground">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default RoadmapPage;
