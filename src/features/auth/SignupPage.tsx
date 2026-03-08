import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, CheckCircle2, Github, Circle, AlertCircle,
  Palette, Code, Sparkles, Users, Star, Zap
} from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const passwordCriteria = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const journeySteps = [
  {
    step: 1, title: "Create Your Profile", desc: "Set up your identity on the platform",
    visual: (name: string) => (
      <div className="mx-auto w-64 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-heading text-sm font-bold text-foreground">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{name || "Your Name"}</p>
            <p className="text-[10px] text-muted-foreground">New Member</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={10} className="text-border" />
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground">+100 SP</span>
          <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[9px] text-skill-green">Newcomer</span>
        </div>
      </div>
    ),
  },
  {
    step: 2, title: "Join Your Campus", desc: "Connect with your university community",
    visual: (uni: string) => (
      <div className="mx-auto w-64">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <GraduationCap size={28} className="mx-auto mb-3 text-court-blue" />
          <p className="text-sm font-medium text-foreground">{uni || "Your University"}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Campus community</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["234 peers", "12 guilds", "89 gigs"].map((s) => (
            <div key={s} className="rounded-lg bg-surface-2 p-2 text-center">
              <p className="text-[10px] font-medium text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: 3, title: "Pick Your Skills", desc: "Showcase what you can offer",
    visual: () => (
      <div className="mx-auto w-64">
        <div className="relative flex flex-wrap justify-center gap-2">
          {[
            { label: "UI/UX", icon: Palette, color: "text-court-blue" },
            { label: "React", icon: Code, color: "text-skill-green" },
            { label: "AI/ML", icon: Sparkles, color: "text-badge-gold" },
            { label: "Marketing", icon: Users, color: "text-muted-foreground" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2"
            >
              <s.icon size={12} className={s.color} />
              <span className="text-xs text-foreground">{s.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Zap size={14} className="text-badge-gold" />
          <span className="text-xs text-muted-foreground">AI will match you with skill seekers</span>
        </div>
      </div>
    ),
  },
];

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const allSkills = ["UI/UX Design", "Web Dev", "Mobile Dev", "Video Editing", "Copywriting", "Data Science", "Marketing", "Illustration", "Photography", "3D Modeling"];

  const toggleSkill = (s: string) => setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const criteriaMet = useMemo(() => passwordCriteria.map((c) => c.test(password)), [password]);
  const passedCount = criteriaMet.filter(Boolean).length;
  const strengthLabel = passedCount <= 1 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount <= 4 ? "Good" : "Strong";
  const strengthColor = passedCount <= 1 ? "bg-destructive" : passedCount <= 3 ? "bg-badge-gold" : "bg-skill-green";
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canContinueStep1 = name.trim() && email.trim() && passedCount >= 4 && passwordsMatch;

  const currentJourney = journeySteps[step - 1];

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <Link to="/" className="mb-10 inline-block font-heading text-2xl font-bold text-foreground">
              Skill<span className="text-muted-foreground">Swappr</span>
            </Link>

            {/* Progress */}
            <div className="mb-8 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-foreground" : "bg-border"}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Create your account</h1>
                  <p className="mb-8 text-sm text-muted-foreground">Start your skill exchange journey.</p>
                  <div className="space-y-4">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>

                    {password.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-muted-foreground">Password strength</span>
                            <span className={`text-[10px] font-semibold ${passedCount <= 1 ? "text-destructive" : passedCount <= 3 ? "text-badge-gold" : "text-skill-green"}`}>{strengthLabel}</span>
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passedCount ? strengthColor : "bg-border"}`} />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {passwordCriteria.map((c, i) => (
                            <motion.div key={c.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2">
                              {criteriaMet[i] ? <CheckCircle2 size={13} className="text-skill-green flex-shrink-0" /> : <Circle size={13} className="text-muted-foreground/40 flex-shrink-0" />}
                              <span className={`text-[11px] transition-colors ${criteriaMet[i] ? "text-skill-green" : "text-muted-foreground/60"}`}>{c.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`h-12 w-full rounded-xl border bg-card pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
                          passwordsMismatch ? "border-destructive focus:border-destructive" : passwordsMatch ? "border-skill-green/50 focus:border-skill-green" : "border-border focus:border-ring"
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    {passwordsMismatch && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-[11px] text-destructive"><AlertCircle size={12} /> Passwords don't match</motion.p>
                    )}
                    {passwordsMatch && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-[11px] text-skill-green"><CheckCircle2 size={12} /> Passwords match</motion.p>
                    )}

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">
                        <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google
                      </button>
                      <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">
                        <Github size={16} /> GitHub
                      </button>
                    </div>

                    <motion.button
                      onClick={() => canContinueStep1 && setStep(2)}
                      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${canContinueStep1 ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                      whileHover={canContinueStep1 ? { scale: 1.01 } : {}}
                      whileTap={canContinueStep1 ? { scale: 0.99 } : {}}
                    >
                      Continue <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Your university</h1>
                  <p className="mb-8 text-sm text-muted-foreground">Optional — get a verified campus badge.</p>
                  <div className="space-y-4">
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="University name" value={university} onChange={(e) => setUniversity(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-border py-3 text-sm text-muted-foreground">Back</button>
                      <motion.button onClick={() => setStep(3)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        Continue <ArrowRight size={16} />
                      </motion.button>
                    </div>
                    <button onClick={() => setStep(3)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Skip for now</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Pick your skills</h1>
                  <p className="mb-8 text-sm text-muted-foreground">Select skills you can offer. You can change these later.</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {allSkills.map((s) => (
                      <button key={s} onClick={() => toggleSkill(s)} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all ${skills.includes(s) ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                        {skills.includes(s) && <CheckCircle2 size={14} />}
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-border py-3 text-sm text-muted-foreground">Back</button>
                    <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      Create Account <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
            </p>
          </div>
        </div>

        {/* Right: Dynamic Journey Preview */}
        <div className="hidden flex-1 flex-col items-center justify-center bg-surface-1 lg:flex">
          <div className="max-w-md px-12">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-center">
                {/* Step indicator */}
                <div className="mb-8 flex justify-center gap-3">
                  {journeySteps.map((js) => (
                    <div key={js.step} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${js.step === step ? "bg-foreground text-background" : js.step < step ? "bg-skill-green text-background" : "bg-surface-2 text-muted-foreground"}`}>
                      {js.step < step ? <CheckCircle2 size={14} /> : js.step}
                    </div>
                  ))}
                </div>

                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">{currentJourney.title}</h2>
                <p className="mb-8 text-sm text-muted-foreground">{currentJourney.desc}</p>

                {/* Dynamic visual */}
                <div className="mb-8">
                  {step === 1 && journeySteps[0].visual(name)}
                  {step === 2 && journeySteps[1].visual(university)}
                  {step === 3 && journeySteps[2].visual("")}
                </div>

                <div className="mt-8 space-y-2">
                  {["No credit card required", "Free forever tier", "100 SP signup bonus"].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={12} className="text-skill-green" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;
