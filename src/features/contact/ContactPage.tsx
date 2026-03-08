import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MessageSquare, MapPin, Clock, Send, Building2, Users, HelpCircle,
  Phone, Paperclip, X, ChevronDown, CheckCircle2, Twitter, Linkedin,
  Github, Globe, Headphones, Zap, ArrowRight, Bot, User
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
  { icon: HelpCircle, label: "General Inquiry" },
  { icon: Building2, label: "Enterprise" },
  { icon: Users, label: "Partnerships" },
  { icon: MessageSquare, label: "Support" },
  { icon: Zap, label: "Bug Report" },
  { icon: Globe, label: "Other" },
];

const slaCards = [
  { channel: "Email", time: "< 24 hours", icon: Mail, color: "text-court-blue" },
  { channel: "Live Chat", time: "< 5 minutes", icon: MessageSquare, color: "text-skill-green" },
  { channel: "Enterprise", time: "< 1 hour", icon: Building2, color: "text-badge-gold" },
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
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const maxMsg = 1000;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage(""); setAttachment(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
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
                  className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-foreground/20"
                >
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${m.bg}`}>
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
              <h3 className="mb-4 text-center font-heading text-lg font-bold text-foreground">Response Time Guarantees</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {slaCards.map((s) => (
                  <div key={s.channel} className="flex items-center gap-3 rounded-xl bg-surface-1 p-4">
                    <s.icon size={18} className={s.color} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.channel}</p>
                      <p className="font-mono text-xs text-muted-foreground">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form + FAQ */}
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              {/* Enhanced Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Send us a message</h2>
                <p className="mb-6 text-sm text-muted-foreground">Fill out the form and we'll get back to you within 24 hours.</p>

                {/* Topics */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setTopic(t.label)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                        topic === t.label ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 rounded-2xl border border-skill-green/20 bg-skill-green/5 py-16">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                        <CheckCircle2 size={48} className="text-skill-green" />
                      </motion.div>
                      <p className="font-heading text-lg font-bold text-foreground">Message Sent!</p>
                      <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Name *</label>
                          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Email *</label>
                          <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone (optional)</label>
                          <input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Subject</label>
                          <input type="text" placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-xs font-medium text-muted-foreground">Message *</label>
                          <span className={`text-[10px] ${message.length > maxMsg ? "text-alert-red" : "text-muted-foreground"}`}>{message.length}/{maxMsg}</span>
                        </div>
                        <textarea
                          placeholder="Tell us more..."
                          value={message}
                          onChange={(e) => { if (e.target.value.length <= maxMsg) setMessage(e.target.value); }}
                          rows={5}
                          required
                          className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none"
                        />
                      </div>

                      {/* Attachment */}
                      <div className="flex items-center gap-3">
                        <input ref={fileRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0]?.name || null)} />
                        <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
                          <Paperclip size={14} /> Attach file
                        </button>
                        {attachment && (
                          <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-foreground">
                            {attachment}
                            <button onClick={() => setAttachment(null)}><X size={12} className="text-muted-foreground" /></button>
                          </div>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={!name.trim() || !email.trim() || !message.trim()}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background disabled:opacity-40"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Send Message <Send size={16} />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* FAQ Accordion */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="mb-6 font-heading text-xl font-bold text-foreground">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
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

                {/* Office Map Placeholder */}
                <div className="mt-8 rounded-2xl border border-border bg-surface-1 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-badge-gold" />
                    <h4 className="text-sm font-bold text-foreground">Our Office</h4>
                  </div>
                  <div className="mb-4 aspect-video rounded-xl bg-surface-2 flex items-center justify-center">
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
