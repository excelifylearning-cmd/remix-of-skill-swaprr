import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Contact Us", href: "/contact" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "Events", href: "/events" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal" },
    { label: "Terms of Service", href: "/legal" },
    { label: "GDPR", href: "/legal" },
    { label: "Cookie Policy", href: "/legal" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

const Footer = () => (
  <footer className="bg-surface-1 border-t border-border">
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-1">
          <Link to="/" className="font-heading text-xl font-bold text-foreground">
            Skill<span className="text-muted-foreground">Swappr</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The skill exchange platform for students. Trade what you know for what you need.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The skill exchange platform for students. Trade what you know for what you need.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
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
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
        <p className="text-xs text-muted-foreground/60">
          © 2026 SkillSwappr. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60">
          Built by students, for students.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
