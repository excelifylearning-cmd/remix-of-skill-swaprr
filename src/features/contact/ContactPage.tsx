import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Clock, Send, Building2, Users, HelpCircle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const contactMethods = [
  { icon: Mail, title: "Email Us", desc: "hello@skillswappr.com", detail: "We respond within 24 hours" },
  { icon: MessageSquare, title: "Live Chat", desc: "Available 9am–6pm EST", detail: "Average response: 5 minutes" },
  { icon: MapPin, title: "Office", desc: "San Francisco, CA", detail: "By appointment only" },
  { icon: Clock, title: "Support Hours", desc: "Mon–Fri, 9am–6pm EST", detail: "Weekend email support" },
];

const topics = [
  { icon: HelpCircle, label: "General Inquiry" },
  { icon: Building2, label: "Enterprise" },
  { icon: Users, label: "Partnerships" },
  { icon: MessageSquare, label: "Support" },
];

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General Inquiry");
  const [message, setMessage] = useState("");

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
            <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactMethods.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-foreground/20"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2">
                    <m.icon size={20} className="text-foreground" />
                  </div>
                  <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{m.title}</h3>
                  <p className="text-sm text-foreground">{m.desc}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Send us a message</h2>
                <p className="mb-6 text-sm text-muted-foreground">Fill out the form and we'll get back to you within 24 hours.</p>

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

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
                  <textarea placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
                  <motion.button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    Send Message <Send size={16} />
                  </motion.button>
                </form>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center">
                <div className="w-full rounded-2xl border border-border bg-surface-1 p-8 lg:p-12">
                  <h3 className="mb-6 font-heading text-xl font-bold text-foreground">Frequently Asked</h3>
                  <div className="space-y-4">
                    {[
                      { q: "Is SkillSwappr free?", a: "Yes! Our Free tier gives you 5 gigs/month and 100 signup points. Most users never need to pay." },
                      { q: "How do I verify my university?", a: "Sign up with your .edu email or upload proof of enrollment. You'll get a verified badge." },
                      { q: "Can companies use the platform?", a: "Absolutely. Our Enterprise tier gives access to vetted student talent with dedicated support." },
                      { q: "How are disputes handled?", a: "Through Skill Court — a fair, transparent process with community judges and AI analysis." },
                    ].map((faq, i) => (
                      <div key={i} className="rounded-xl bg-card p-4">
                        <p className="mb-1 text-sm font-medium text-foreground">{faq.q}</p>
                        <p className="text-xs text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
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
