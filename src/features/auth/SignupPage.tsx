import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, CheckCircle2, Github } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const allSkills = ["UI/UX Design", "Web Dev", "Mobile Dev", "Video Editing", "Copywriting", "Data Science", "Marketing", "Illustration", "Photography", "3D Modeling"];

  const toggleSkill = (s: string) => setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

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

                    <motion.button onClick={() => setStep(2)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all ${
                          skills.includes(s) ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
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

        {/* Right: Visual */}
        <div className="hidden flex-1 items-center justify-center bg-surface-1 lg:flex">
          <div className="max-w-md px-12 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div className="mx-auto mb-8 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-skill-green/10">
                  <span className="font-heading text-3xl font-black text-skill-green">+100</span>
                </div>
                <p className="text-sm text-muted-foreground">Earn 100 Skill Points on signup</p>
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">Your Journey Starts Here</h2>
              <p className="text-sm text-muted-foreground">Create your profile, showcase your skills, and start swapping with students worldwide.</p>

              <div className="mt-10 space-y-3 text-left">
                {["No credit card required", "Free forever tier", "100 SP signup bonus", "Join 10,000+ students"].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-skill-green flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;
