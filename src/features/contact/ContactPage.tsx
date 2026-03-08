import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MessageSquare, MapPin, Clock, Send, Building2, Users, HelpCircle,
  Phone, Paperclip, X, ChevronDown, CheckCircle2, Twitter, Linkedin,
  Github, Globe, Headphones, Zap, ArrowRight, Star, Shield, Sparkles,
  AlertCircle, User, AtSign, FileText
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const contactMethods = [
  { icon: Mail, title: "Email Us", desc: "hello@skillswappr.com", detail: "Response within 24 hours", color: "text-court-blue", bg: "bg-court-blue/10" },
  { icon: Headphones, title: "Live Chat", desc: "Talk to our team", detail: "Avg response: 5 minutes", color: "text-skill-green", bg: "bg-skill-green/10" },
  { icon: MapPin, title: "Office", desc: "San Francisco, CA", detail: "By appointment only", color: "text-badge-gold", bg: "bg-badge-gold/10" },
  { icon: Clock, title: "Support Hours", desc: "Mon–Fri, 9am–6pm EST", detail: "Weekend email support", color: "text-muted-foreground", bg: "bg-surface-2" },
];

const topics = [
  { icon: HelpCircle, label: "General Inquiry", desc: "Questions about the platform" },
  { icon: Building2, label: "Enterprise", desc: "Team & company plans" },
  { icon: Users, label: "Partnerships", desc: "Collaboration opportunities" },
  { icon: MessageSquare, label: "Support", desc: "Technical help & issues" },
  { icon: Zap, label: "Bug Report", desc: "Something's not working" },
  { icon: Globe, label: "Press & Media", desc: "Media & press inquiries" },
];

const priorityLevels = [
  { label: "Low", desc: "General question, no rush", color: "text-muted-foreground", bg: "border-border" },
  { label: "Medium", desc: "Need help soon", color: "text-badge-gold", bg: "border-badge-gold/30" },
  { label: "High", desc: "Blocking my work", color: "text-alert-red", bg: "border-alert-red/30" },
];

const slaCards = [
  { channel: "Email", time: "< 24 hours", icon: Mail, color: "text-court-blue", bg: "bg-court-blue/5" },
  { channel: "Live Chat", time: "< 5 minutes", icon: MessageSquare, color: "text-skill-green", bg: "bg-skill-green/5" },
  { channel: "Enterprise", time: "< 1 hour", icon: Building2, color: "text-badge-gold", bg: "bg-badge-gold/5" },
];

const faqs = [
  { q: "Is SkillSwappr free?", a: "Yes! Our Free tier gives you 5 gigs/month and 100 signup points. Most users never need to pay." },
  { q: "How do I verify my university?", a: "Sign up with your .edu email or upload proof of enrollment. You'll get a verified badge within 24 hours." },
  { q: "Can companies use the platform?", a: "Absolutely. Our Enterprise tier gives access to vetted student talent with dedicated support and SLA guarantees." },
  { q: "How are disputes handled?", a: "Through Skill Court — a fair, transparent process with community judges and AI-assisted analysis." },
  { q: "How do I earn Skill Points?", a: "Complete gigs, get positive reviews, maintain streaks, and participate in community activities to earn SP." },
  { q: "Can I cancel a swap after matching?", a: "Yes, within the first 24 hours. After that, cancellations may affect your ELO rating and require a Skill Court review." },
];

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("General Inquiry");
  const [priority, setPriority] = useState("Low");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStep, setFormStep] = useState(0); // 0: topic select, 1: details, 2: message
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const maxMsg = 2000;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    }
    if (step === 2) {
      if (!message.trim()) newErrors.message = "Please enter a message";
      if (message.length > maxMsg) newErrors.message = `Message too long (${message.length}/${maxMsg})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (formStep === 0) {
      setFormStep(1);
    } else if (formStep === 1 && validateStep(1)) {
      setFormStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormStep(0);
    }, 4000);
    setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage(""); setAttachments([]); setPriority("Low");
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newNames = Array.from(files).map(f => f.name).slice(0, 3 - attachments.length);
      setAttachments(prev => [...prev, ...newNames].slice(0, 3));
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const stepLabels = ["Topic", "Details", "Message"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Mail size={12} className="mr-1.5 inline" /> Contact Us
              </motion.span>
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">Get in Touch</h1>
              <p className="mx-auto max-w-lg text-lg text-muted-foreground">Have a question, partnership proposal, or just want to say hi? We'd love to hear from you.</p>
            </motion.div>

            {/* Contact Methods */}
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactMethods.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${m.bg} transition-transform group-hover:scale-110`}>
                    <m.icon size={20} className={m.color} />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{m.title}</h3>
                  <p className="text-sm text-foreground">{m.desc}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* SLA Response Guarantees */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Shield size={16} className="text-skill-green" />
                <h3 className="font-heading text-lg font-bold text-foreground">Response Time Guarantees</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {slaCards.map((s) => (
                  <div key={s.channel} className={`flex items-center gap-3 rounded-xl ${s.bg} border border-border p-4`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
                      <s.icon size={18} className={s.color} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.channel}</p>
                      <p className="font-mono text-xs text-muted-foreground">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form + FAQ */}
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Multi-Step Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  {/* Form Header */}
                  <div className="border-b border-border bg-surface-1 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">Send us a message</h2>
                        <p className="mt-1 text-xs text-muted-foreground">We'll get back to you within 24 hours.</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1">
                        <Sparkles size={12} className="text-badge-gold" />
                        <span className="text-[10px] font-medium text-muted-foreground">Avg reply: 4h</span>
                      </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="mt-5 flex items-center gap-2">
                      {stepLabels.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (i < formStep) setFormStep(i);
                            }}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                              i === formStep
                                ? "bg-foreground text-background"
                                : i < formStep
                                ? "bg-skill-green/10 text-skill-green cursor-pointer"
                                : "bg-surface-2 text-muted-foreground"
                            }`}
                          >
                            {i < formStep ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-current/10 text-[10px]">{i + 1}</span>
                            )}
                            {label}
                          </button>
                          {i < stepLabels.length - 1 && (
                            <div className={`h-px w-6 ${i < formStep ? "bg-skill-green" : "bg-border"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-4 py-16"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-skill-green/10"
                          >
                            <CheckCircle2 size={40} className="text-skill-green" />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                            <p className="font-heading text-xl font-bold text-foreground">Message Sent!</p>
                            <p className="mt-1 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                            <p className="mt-3 text-xs text-muted-foreground">Ticket #{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                          </motion.div>
                        </motion.div>
                      ) : formStep === 0 ? (
                        <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <p className="mb-4 text-sm font-medium text-foreground">What can we help you with?</p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {topics.map((t) => (
                              <motion.button
                                key={t.label}
                                onClick={() => { setTopic(t.label); setFormStep(1); }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                                  topic === t.label
                                    ? "border-foreground/30 bg-foreground/5"
                                    : "border-border hover:border-foreground/20"
                                }`}
                              >
                                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
                                  <t.icon size={16} className="text-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ) : formStep === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <div className="mb-2 flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                            {(() => { const TopicIcon = topics.find(t => t.label === topic)!.icon; return <TopicIcon size={14} className="text-muted-foreground" />; })()}
                            <span className="text-xs font-medium text-muted-foreground">{topic}</span>
                            <button onClick={() => setFormStep(0)} className="ml-auto text-[10px] text-muted-foreground hover:text-foreground underline">Change</button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <User size={12} /> Full Name <span className="text-alert-red">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
                                className={`h-11 w-full rounded-xl border ${errors.name ? "border-alert-red" : "border-border"} bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none`}
                              />
                              {errors.name && <p className="mt-1 flex items-center gap-1 text-[10px] text-alert-red"><AlertCircle size={10} /> {errors.name}</p>}
                            </div>
                            <div>
                              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <AtSign size={12} /> Email <span className="text-alert-red">*</span>
                              </label>
                              <input
                                type="email"
                                placeholder="you@university.edu"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                                className={`h-11 w-full rounded-xl border ${errors.email ? "border-alert-red" : "border-border"} bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none`}
                              />
                              {errors.email && <p className="mt-1 flex items-center gap-1 text-[10px] text-alert-red"><AlertCircle size={10} /> {errors.email}</p>}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <Phone size={12} /> Phone <span className="text-muted-foreground/50">(optional)</span>
                              </label>
                              <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <FileText size={12} /> Subject
                              </label>
                              <input
                                type="text"
                                placeholder="What's this about?"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-surface-1 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Priority */}
                          <div>
                            <label className="mb-2 block text-xs font-medium text-muted-foreground">Priority Level</label>
                            <div className="flex gap-2">
                              {priorityLevels.map((p) => (
                                <button
                                  key={p.label}
                                  type="button"
                                  onClick={() => setPriority(p.label)}
                                  className={`flex-1 rounded-xl border px-3 py-2.5 text-center transition-all ${
                                    priority === p.label
                                      ? `${p.bg} bg-surface-1`
                                      : "border-border hover:border-foreground/20"
                                  }`}
                                >
                                  <p className={`text-xs font-semibold ${priority === p.label ? p.color : "text-foreground"}`}>{p.label}</p>
                                  <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            onClick={nextStep}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            Continue <ArrowRight size={16} />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4" onSubmit={handleSubmit}>
                          {/* Context bar */}
                          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                            <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                              {(() => { const TopicIcon = topics.find(t => t.label === topic)!.icon; return <TopicIcon size={10} />; })()} {topic}
                            </span>
                            <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                              <User size={10} /> {name}
                            </span>
                            <span className={`flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium ${
                              priority === "High" ? "text-alert-red" : priority === "Medium" ? "text-badge-gold" : "text-muted-foreground"
                            }`}>
                              {priority} priority
                            </span>
                          </div>

                          <div>
                            <div className="mb-1.5 flex items-center justify-between">
                              <label className="text-xs font-medium text-muted-foreground">Your Message <span className="text-alert-red">*</span></label>
                              <span className={`text-[10px] font-mono ${message.length > maxMsg * 0.9 ? message.length > maxMsg ? "text-alert-red" : "text-badge-gold" : "text-muted-foreground"}`}>
                                {message.length}/{maxMsg}
                              </span>
                            </div>
                            <textarea
                              placeholder="Tell us what's on your mind. The more detail you provide, the faster we can help..."
                              value={message}
                              onChange={(e) => { if (e.target.value.length <= maxMsg) { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: "" })); } }}
                              rows={7}
                              className={`w-full rounded-xl border ${errors.message ? "border-alert-red" : "border-border"} bg-surface-1 p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none resize-none`}
                            />
                            {errors.message && <p className="mt-1 flex items-center gap-1 text-[10px] text-alert-red"><AlertCircle size={10} /> {errors.message}</p>}
                          </div>

                          {/* Attachments */}
                          <div>
                            <input ref={fileRef} type="file" className="hidden" multiple onChange={handleFileAttach} />
                            <div className="flex flex-wrap items-center gap-2">
                              {attachments.length < 3 && (
                                <button
                                  type="button"
                                  onClick={() => fileRef.current?.click()}
                                  className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                                >
                                  <Paperclip size={14} /> Attach files ({attachments.length}/3)
                                </button>
                              )}
                              {attachments.map((name, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-foreground"
                                >
                                  <Paperclip size={10} className="text-muted-foreground" />
                                  <span className="max-w-[120px] truncate">{name}</span>
                                  <button type="button" onClick={() => removeAttachment(idx)}>
                                    <X size={12} className="text-muted-foreground hover:text-foreground" />
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                            <p className="mt-2 text-[10px] text-muted-foreground">Max 3 files, 10MB each. PNG, JPG, PDF, or ZIP.</p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setFormStep(1)}
                              className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border px-5 text-sm text-muted-foreground hover:text-foreground"
                            >
                              Back
                            </button>
                            <motion.button
                              type="submit"
                              disabled={!message.trim()}
                              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background disabled:opacity-40"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Send size={16} /> Send Message
                            </motion.button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* FAQ + Info Sidebar */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="mb-6 font-heading text-xl font-bold text-foreground">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between p-4 text-left"
                      >
                        <p className="text-sm font-medium text-foreground">{faq.q}</p>
                        <ChevronDown size={14} className={`shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield, label: "SSL Encrypted", value: "256-bit" },
                    { icon: Clock, label: "Avg Response", value: "4 hours" },
                    { icon: Star, label: "Satisfaction", value: "98.2%" },
                  ].map((b) => (
                    <div key={b.label} className="rounded-xl border border-border bg-card p-3 text-center">
                      <b.icon size={16} className="mx-auto mb-1 text-muted-foreground" />
                      <p className="font-mono text-sm font-bold text-foreground">{b.value}</p>
                      <p className="text-[10px] text-muted-foreground">{b.label}</p>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h4 className="mb-3 text-sm font-medium text-muted-foreground">Find us online</h4>
                  <div className="flex gap-3">
                    {[
                      { icon: Twitter, label: "Twitter" },
                      { icon: Linkedin, label: "LinkedIn" },
                      { icon: Github, label: "GitHub" },
                      { icon: Globe, label: "Discord" },
                    ].map((s) => (
                      <motion.button
                        key={s.label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <s.icon size={16} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Office */}
                <div className="mt-8 rounded-2xl border border-border bg-surface-1 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-badge-gold" />
                    <h4 className="text-sm font-bold text-foreground">Our Office</h4>
                  </div>
                  <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-surface-2">
                    <div className="text-center">
                      <MapPin size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground">123 Innovation Blvd</p>
                      <p className="text-xs text-muted-foreground">San Francisco, CA 94107</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Open for in-person meetings by appointment. Schedule via email or our contact form.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
