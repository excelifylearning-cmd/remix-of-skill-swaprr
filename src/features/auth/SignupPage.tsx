import { useState, useMemo } from "react";
import { validateEmail } from "@/lib/email-validation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, GraduationCap, CheckCircle2, Github,
  Circle, AlertCircle, Camera, Globe, Briefcase, Tag, Link2, Shield, Play, SkipForward,
  Upload, Award, Users, MessageSquare, Zap, BookOpen, Star, Sparkles, FileText, IdCard,
  MapPin, Languages, Clock, Heart, ChevronRight
} from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const TOTAL_STEPS = 8;

const passwordCriteria = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const allSkills = [
  "UI/UX Design", "Web Development", "Mobile Dev", "Video Editing", "Copywriting",
  "Data Science", "Marketing", "Illustration", "Photography", "3D Modeling",
  "Animation", "Music Production", "SEO", "Graphic Design", "Game Dev",
  "AI/ML", "Cybersecurity", "Cloud/DevOps", "Technical Writing", "Social Media",
];

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const languages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Korean", "Portuguese", "Arabic", "Hindi", "Russian", "Italian"];

const interests = [
  "Design", "Engineering", "Business", "Arts", "Science", "Music",
  "Writing", "Gaming", "Education", "Health", "Finance", "Law",
];

const platformTourSteps = [
  { icon: Briefcase, title: "Post & Browse Gigs", desc: "List your skills or find what you need. Choose from 7 gig formats including auctions and co-creation." },
  { icon: Zap, title: "Earn Skill Points", desc: "Complete gigs to earn SP — our cashless currency. No wallets, no fees, just skills." },
  { icon: MessageSquare, title: "Collaborate in Workspaces", desc: "Each gig gets a private workspace with messenger, whiteboard, video calls, and file sharing." },
  { icon: Shield, title: "Trust & Skill Court", desc: "ELO ratings, community judges, and AI analysis keep every exchange fair and transparent." },
  { icon: Users, title: "Join Guilds", desc: "Team up with like-minded swappers, compete in Guild Wars, and build your reputation together." },
  { icon: Award, title: "Level Up & Earn Badges", desc: "Progress through tiers, unlock achievements, and showcase your expertise with verified badges." },
];

const SignupPage = () => {
  const [step, setStep] = useState(1);

  // Step 1: Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2: Profile
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [slogan, setSlogan] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 3: Details
  const [university, setUniversity] = useState("");
  const [location, setLocation] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Step 4: Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<Record<string, string>>({});

  // Step 5: Interests (what you want to learn)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Step 6: Preferences
  const [availability, setAvailability] = useState("Part-time");
  const [responseTime, setResponseTime] = useState("Within 24 hours");
  const [referralCode, setReferralCode] = useState("");

  // Step 7: Verification (skippable)
  const [idUploaded, setIdUploaded] = useState(false);

  // Step 8: Platform tour

  const criteriaMet = useMemo(() => passwordCriteria.map((c) => c.test(password)), [password]);
  const passedCount = criteriaMet.filter(Boolean).length;
  const strengthLabel = passedCount <= 1 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount <= 4 ? "Good" : "Strong";
  const strengthColor = passedCount <= 1 ? "bg-destructive" : passedCount <= 3 ? "bg-badge-gold" : "bg-skill-green";
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const emailError = useMemo(() => email.trim() ? (validateEmail(email) === true ? "" : validateEmail(email) as string) : "", [email]);
  const canContinueStep1 = name.trim() && email.trim() && !emailError && passedCount >= 4 && passwordsMatch;

  const toggleSkill = (s: string) => setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleLanguage = (l: string) => setSelectedLanguages((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  const toggleInterest = (i: string) => setSelectedInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="mb-6 text-center">
            <Link to="/" className="inline-block font-heading text-2xl font-bold text-foreground">
              Skill<span className="text-muted-foreground">Swappr</span>
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-2 flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-foreground" : "bg-border"}`} />
            ))}
          </div>
          <p className="mb-6 text-center text-[10px] text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>

          <motion.div className="rounded-2xl border border-border bg-card p-7 sm:p-9" layout>
            <AnimatePresence mode="wait">

              {/* ═══ STEP 1: Account ═══ */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Create your account</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Start your skill exchange journey.</p>
                  <div className="space-y-3">
                    <div className="relative">
                      <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={`h-11 w-full rounded-xl border ${emailError ? "border-destructive" : "border-border"} bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none`} />
                    </div>
                    {emailError && <p className="text-xs text-destructive -mt-1 ml-1">{emailError}</p>}
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>

                    {password.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Password strength</span>
                          <span className={`text-[10px] font-semibold ${passedCount <= 1 ? "text-destructive" : passedCount <= 3 ? "text-badge-gold" : "text-skill-green"}`}>{strengthLabel}</span>
                        </div>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passedCount ? strengthColor : "bg-border"}`} />
                          ))}
                        </div>
                        <div className="space-y-1">
                          {passwordCriteria.map((c, i) => (
                            <div key={c.label} className="flex items-center gap-2">
                              {criteriaMet[i] ? <CheckCircle2 size={12} className="text-skill-green shrink-0" /> : <Circle size={12} className="text-muted-foreground/40 shrink-0" />}
                              <span className={`text-[10px] ${criteriaMet[i] ? "text-skill-green" : "text-muted-foreground/60"}`}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`h-11 w-full rounded-xl border bg-surface-1 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${passwordsMismatch ? "border-destructive" : passwordsMatch ? "border-skill-green/50" : "border-border"}`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>
                    {passwordsMismatch && <p className="flex items-center gap-1 text-[10px] text-destructive"><AlertCircle size={11} /> Passwords don't match</p>}
                    {passwordsMatch && <p className="flex items-center gap-1 text-[10px] text-skill-green"><CheckCircle2 size={11} /> Passwords match</p>}

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center"><span className="bg-card px-3 text-[10px] text-muted-foreground">or sign up with</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google
                      </button>
                      <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                        <Github size={14} /> GitHub
                      </button>
                    </div>

                    <motion.button onClick={() => canContinueStep1 && next()} className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${canContinueStep1 ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"}`} whileHover={canContinueStep1 ? { scale: 1.01 } : {}} whileTap={canContinueStep1 ? { scale: 0.99 } : {}}>
                      Continue <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 2: Profile ═══ */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Customize your profile</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Make a great first impression on other swappers.</p>
                  <div className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                      <label className="group relative cursor-pointer">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface-1 transition-colors group-hover:border-foreground/30">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <Camera size={28} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
                          <Upload size={12} />
                        </div>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </label>
                      <p className="text-[10px] text-muted-foreground">JPG, PNG or GIF · Max 5MB</p>
                    </div>

                    <div className="relative">
                      <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Display name (public)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>

                    <div className="relative">
                      <Sparkles size={15} className="absolute left-4 top-3 text-muted-foreground" />
                      <input type="text" placeholder="Tagline / Slogan (e.g. &quot;Design wizard ✨&quot;)" value={slogan} onChange={(e) => setSlogan(e.target.value)} maxLength={60} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">{slogan.length}/60</span>
                    </div>

                    <div>
                      <textarea placeholder="Bio — tell others about yourself, your passions, and what you're looking for..." value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} className="h-24 w-full resize-none rounded-xl border border-border bg-surface-1 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                      <p className="mt-1 text-right text-[9px] text-muted-foreground">{bio.length}/300</p>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                      <motion.button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        Continue <ArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 3: Details ═══ */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Your details</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Help us connect you with the right community.</p>
                  <div className="space-y-3">
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="University (optional — get a verified badge)" value={university} onChange={(e) => setUniversity(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Location (city, country)" value={location} onChange={(e) => setLocation(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="url" placeholder="Portfolio website (optional)" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="url" placeholder="LinkedIn profile (optional)" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>

                    {/* Languages */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-foreground flex items-center gap-1.5"><Languages size={13} /> Languages you speak</p>
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((l) => (
                          <button key={l} onClick={() => toggleLanguage(l)} className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-all ${selectedLanguages.includes(l) ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                            {selectedLanguages.includes(l) && <CheckCircle2 size={10} className="inline mr-1" />}{l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                      <motion.button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        Continue <ArrowRight size={15} />
                      </motion.button>
                    </div>
                    <button onClick={next} className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground">Skip for now</button>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 4: Skills ═══ */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">What can you offer?</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Select skills you can teach or provide. Pick at least 1.</p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {allSkills.map((s) => (
                      <button key={s} onClick={() => toggleSkill(s)} className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-all ${skills.includes(s) ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                        {skills.includes(s) && <CheckCircle2 size={10} className="inline mr-1" />}{s}
                      </button>
                    ))}
                  </div>

                  {/* Skill levels for selected */}
                  {skills.length > 0 && (
                    <div className="mb-4 space-y-2 rounded-xl border border-border bg-surface-1 p-4">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2">Rate your proficiency</p>
                      {skills.map((s) => (
                        <div key={s} className="flex items-center justify-between">
                          <span className="text-xs text-foreground">{s}</span>
                          <div className="flex gap-1">
                            {skillLevels.map((level) => (
                              <button key={level} onClick={() => setSkillLevel((prev) => ({ ...prev, [s]: level }))} className={`rounded-md px-2 py-0.5 text-[8px] font-medium transition-colors ${skillLevel[s] === level ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}>
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                    <motion.button onClick={() => skills.length > 0 && next()} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${skills.length > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"}`} whileHover={skills.length > 0 ? { scale: 1.01 } : {}} whileTap={skills.length > 0 ? { scale: 0.99 } : {}}>
                      Continue <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 5: Interests ═══ */}
              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">What do you want to learn?</h1>
                  <p className="mb-6 text-sm text-muted-foreground">We'll match you with swappers who can help. Pick as many as you like.</p>
                  <div className="mb-6 grid grid-cols-3 gap-2">
                    {interests.map((interest) => (
                      <button key={interest} onClick={() => toggleInterest(interest)} className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-all ${selectedInterests.includes(interest) ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/20"}`}>
                        <Heart size={16} className={selectedInterests.includes(interest) ? "text-foreground" : "text-muted-foreground"} fill={selectedInterests.includes(interest) ? "currentColor" : "none"} />
                        <span className={`text-[10px] font-medium ${selectedInterests.includes(interest) ? "text-foreground" : "text-muted-foreground"}`}>{interest}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                    <motion.button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      Continue <ArrowRight size={15} />
                    </motion.button>
                  </div>
                  <button onClick={next} className="mt-2 w-full text-center text-[10px] text-muted-foreground hover:text-foreground">Skip for now</button>
                </motion.div>
              )}

              {/* ═══ STEP 6: Preferences ═══ */}
              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Almost there!</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Set your availability and preferences.</p>
                  <div className="space-y-4">
                    {/* Availability */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-foreground flex items-center gap-1.5"><Clock size={13} /> Availability</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Full-time", "Part-time", "Weekends only"].map((a) => (
                          <button key={a} onClick={() => setAvailability(a)} className={`rounded-xl border py-3 text-xs font-medium transition-all ${availability === a ? "border-foreground bg-foreground/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Response Time */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-foreground flex items-center gap-1.5"><MessageSquare size={13} /> Typical response time</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Within 1 hour", "Within 24 hours", "Within 3 days", "Flexible"].map((r) => (
                          <button key={r} onClick={() => setResponseTime(r)} className={`rounded-xl border py-2.5 text-[10px] font-medium transition-all ${responseTime === r ? "border-foreground bg-foreground/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Referral */}
                    <div className="relative">
                      <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Referral code (optional — earn bonus SP!)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                    </div>
                    {referralCode && (
                      <p className="flex items-center gap-1 text-[10px] text-skill-green"><Zap size={10} /> You'll both earn 50 bonus SP!</p>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                      <motion.button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        Continue <ArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 7: Verification (Skippable) ═══ */}
              {step === 7 && (
                <motion.div key="s7" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Identity verification</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Optional — get a verified badge and unlock higher gig limits.</p>

                  <div className="space-y-4">
                    <div className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${idUploaded ? "border-skill-green/30 bg-skill-green/5" : "border-border hover:border-foreground/20 bg-surface-1"}`} onClick={() => setIdUploaded(!idUploaded)}>
                      {idUploaded ? (
                        <>
                          <CheckCircle2 size={32} className="mx-auto mb-3 text-skill-green" />
                          <p className="text-sm font-medium text-skill-green">ID uploaded successfully</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">We'll verify within 24 hours</p>
                        </>
                      ) : (
                        <>
                          <IdCard size={32} className="mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Upload government ID</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">Passport, driver's license, or national ID</p>
                          <p className="mt-2 text-[9px] text-muted-foreground/60">Your data is encrypted and never shared</p>
                        </>
                      )}
                    </div>

                    <div className="rounded-xl border border-border bg-surface-1 p-4">
                      <p className="text-xs font-medium text-foreground mb-2">Benefits of verification</p>
                      <div className="space-y-1.5">
                        {["Verified badge on your profile", "Higher gig value limits", "Priority in search results", "Access to premium gig formats"].map((b) => (
                          <div key={b} className="flex items-center gap-2">
                            <CheckCircle2 size={11} className="text-skill-green shrink-0" />
                            <span className="text-[10px] text-muted-foreground">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                      <motion.button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        Continue <ArrowRight size={15} />
                      </motion.button>
                    </div>
                    <button onClick={next} className="flex w-full items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                      <SkipForward size={10} /> Skip verification
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 8: Platform Tour ═══ */}
              {step === 8 && (
                <motion.div key="s8" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">Welcome aboard! 🎉</h1>
                  <p className="mb-6 text-sm text-muted-foreground">Here's a quick rundown of how SkillSwappr works.</p>

                  {/* Video Preview */}
                  <div className="mb-6 overflow-hidden rounded-xl border border-border bg-surface-1">
                    <div className="aspect-video flex flex-col items-center justify-center bg-surface-2">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 backdrop-blur">
                        <Play size={24} className="text-foreground ml-1" />
                      </div>
                      <p className="text-xs font-medium text-foreground">Watch Platform Tour</p>
                      <p className="text-[10px] text-muted-foreground">2 min overview</p>
                    </div>
                  </div>

                  {/* Tour Steps */}
                  <div className="mb-6 space-y-2">
                    {platformTourSteps.map((t, i) => (
                      <motion.div
                        key={t.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface-1 p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                          <t.icon size={14} className="text-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{t.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{t.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Reward */}
                  <div className="mb-6 rounded-xl border border-skill-green/20 bg-skill-green/5 p-4 text-center">
                    <Zap size={20} className="mx-auto mb-1 text-skill-green" />
                    <p className="text-sm font-bold text-foreground">+100 Skill Points</p>
                    <p className="text-[10px] text-muted-foreground">Welcome bonus credited to your account</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={back} className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Back</button>
                    <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      Start Swapping <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;
