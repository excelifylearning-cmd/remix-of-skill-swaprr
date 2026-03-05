import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Platform: ["Marketplace", "Features", "Pricing", "How It Works", "Roadmap"],
  Community: ["Forums", "Guilds", "Leaderboard", "Success Stories", "Blog"],
  Resources: ["Help Center", "Docs & API", "Status", "Bug Bounty", "Changelog"],
  Legal: ["Privacy Policy", "Terms of Service", "GDPR", "Community Guidelines", "IP Policy"],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

const CTAFooterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-surface-1">
      <div className="relative border-b border-border py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--silver)/0.05),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6 font-heading text-4xl font-black text-foreground sm:text-5xl lg:text-6xl"
          >
            Start Swapping Skills Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-10 max-w-lg text-lg text-silver"
          >
            Join thousands of students exchanging skills, building portfolios, and leveling up — without spending a dime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground placeholder:text-silver/50 focus:border-silver focus:outline-none"
              />
            </div>
            <motion.button
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-xs text-silver/60"
          >
            Free forever. No credit card required. 100 skill points on signup.
          </motion.p>
        </div>
      </div>

      <footer className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a href="/" className="font-heading text-xl font-bold text-foreground">
              Skill<span className="text-silver">Swappr</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-silver">
              The skill exchange platform for students. Trade what you know for what you need.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-silver transition-colors hover:bg-surface-3 hover:text-foreground"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-silver transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-silver/60">
            © 2026 SkillSwappr. All rights reserved.
          </p>
          <p className="text-xs text-silver/60">
            Built by students, for students.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default CTAFooterSection;
