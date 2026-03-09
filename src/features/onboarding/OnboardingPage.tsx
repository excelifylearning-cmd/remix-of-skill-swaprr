import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, User, Briefcase, Users, Trophy, Check } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    id: "welcome",
    icon: Sparkles,
    title: "Welcome to Skill Swappr! 🎉",
    subtitle: "Let's set up your profile and earn your first 100 SP",
    content: (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--badge-gold)/0.15)] border border-[hsl(var(--badge-gold)/0.3)]">
          <Trophy className="w-5 h-5 text-[hsl(var(--badge-gold))]" />
          <span className="font-semibold text-[hsl(var(--badge-gold))]">+100 SP Reward</span>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">Complete this quick tour to unlock your starter Skill Points and get discovered by other users.</p>
      </div>
    ),
  },
  {
    id: "profile",
    icon: User,
    title: "Set Up Your Profile",
    subtitle: "Tell us about yourself so others can find you",
    content: (
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Display Name</label>
          <input className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
          <textarea className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground resize-none h-20" placeholder="What do you do? What are you passionate about?" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">University (optional)</label>
          <input className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" placeholder="Your university" />
        </div>
      </div>
    ),
  },
  {
    id: "skills",
    icon: Briefcase,
    title: "Add Your Skills",
    subtitle: "What can you offer? Select at least 3",
    content: (
      <div className="max-w-lg mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {["Web Development", "Graphic Design", "Video Editing", "Copywriting", "Photography", "Music Production", "3D Modeling", "Data Analysis", "Social Media", "Translation", "Tutoring", "UI/UX Design", "Animation", "Marketing", "Illustration"].map((skill) => (
            <Badge key={skill} variant="outline" className="cursor-pointer px-3 py-1.5 text-sm hover:bg-primary/20 hover:border-primary/40 transition-colors">{skill}</Badge>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "explore",
    icon: Users,
    title: "Explore the Platform",
    subtitle: "Here's what you can do on Skill Swappr",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        {[
          { emoji: "🔄", title: "Swap Skills", desc: "Exchange services with other users" },
          { emoji: "🏰", title: "Join a Guild", desc: "Team up for bigger projects" },
          { emoji: "🏆", title: "Earn Achievements", desc: "Level up your profile" },
          { emoji: "⚖️", title: "Skill Court", desc: "Help resolve disputes fairly" },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "complete",
    icon: Trophy,
    title: "You're All Set! 🎉",
    subtitle: "Your 100 SP reward has been credited",
    content: (
      <div className="text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-[hsl(var(--skill-green)/0.15)] border-2 border-[hsl(var(--skill-green)/0.3)] flex items-center justify-center mx-auto">
          <Check className="w-12 h-12 text-[hsl(var(--skill-green))]" />
        </motion.div>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--badge-gold)/0.15)] border border-[hsl(var(--badge-gold)/0.3)]">
          <Sparkles className="w-5 h-5 text-[hsl(var(--badge-gold))]" />
          <span className="text-lg font-bold text-[hsl(var(--badge-gold))]">+100 SP</span>
        </div>
        <p className="text-muted-foreground">Head to the marketplace to make your first swap!</p>
      </div>
    ),
  },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Progress value={progress} className="mb-8 h-1.5" />

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <current.icon className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-display">{current.title}</h1>
              <p className="text-muted-foreground mb-8">{current.subtitle}</p>
              {current.content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <span className="text-sm text-muted-foreground">{step + 1} / {steps.length}</span>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="gap-2" asChild>
                <a href="/marketplace">Go to Marketplace <ArrowRight className="w-4 h-4" /></a>
              </Button>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default OnboardingPage;
