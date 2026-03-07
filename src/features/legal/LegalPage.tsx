import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import PageTransition from "@/components/shared/PageTransition";

const sections = [
  {
    id: "privacy", title: "Privacy Policy", updated: "March 1, 2026",
    summary: "We collect minimal data necessary to operate the platform. Your data is encrypted in transit and at rest.",
    content: [
      "Information We Collect: Account details (name, email, university), skill data, gig activity, and workspace interactions.",
      "How We Use It: To operate the platform, match skills, process points, resolve disputes, and improve our services.",
      "Data Sharing: We never sell your data. We share only with your explicit consent or as required by law.",
      "Data Retention: Account data is retained while your account is active. Deleted accounts are purged within 30 days.",
      "Your Rights: Access, export, correct, or delete your data at any time from your account settings.",
    ],
  },
  {
    id: "terms", title: "Terms of Service", updated: "March 1, 2026",
    summary: "By using SkillSwappr, you agree to fair use of the platform and respect for the community.",
    content: [
      "Eligibility: You must be 16+ to use the platform. University verification is optional but recommended.",
      "Account Responsibility: You are responsible for maintaining the security of your account.",
      "Skill Points: Points have no cash value and cannot be withdrawn. They are internal platform currency only.",
      "Content Ownership: You retain ownership of all work you create. SkillSwappr has a limited license to display it.",
      "Prohibited Conduct: No harassment, fraud, plagiarism, or manipulation of the rating system.",
    ],
  },
  {
    id: "gdpr", title: "GDPR Compliance", updated: "March 1, 2026",
    summary: "We are fully compliant with GDPR for EU users with data processing agreements and DPO contact.",
    content: [
      "Legal Basis: We process data based on contractual necessity and legitimate interest.",
      "Data Transfers: All data stored in EU-region servers. Cross-border transfers comply with Standard Contractual Clauses.",
      "DPO Contact: Our Data Protection Officer can be reached at dpo@skillswappr.com.",
      "Breach Notification: We will notify affected users within 72 hours of any data breach.",
    ],
  },
  {
    id: "community", title: "Community Guidelines", updated: "March 1, 2026",
    summary: "Be respectful, deliver quality work, and contribute positively to the community.",
    content: [
      "Respect: Treat all users with dignity regardless of skill level, background, or university.",
      "Quality: Deliver work that meets the agreed specifications. Plagiarism results in permanent ban.",
      "Fair Rating: Rate honestly. Coordinated rating manipulation is detectable and punishable.",
      "Court Duty: Free tier users must participate in Skill Court when called. It's part of the community.",
      "Reporting: Use the reporting system for violations. False reports reduce your ELO.",
    ],
  },
  {
    id: "ip", title: "IP Policy", updated: "March 1, 2026",
    summary: "Creators retain IP rights. Enterprise gigs can include custom IP transfer agreements.",
    content: [
      "Default Ownership: The creator retains all intellectual property rights to their work.",
      "License to Buyer: Upon completion, the buyer receives a perpetual, non-exclusive license to use the deliverable.",
      "Enterprise IP: Enterprise gigs can include full IP transfer via custom agreements.",
      "Digital Fingerprinting: All deliverables are fingerprinted for authenticity verification.",
    ],
  },
];

const LegalPage = () => {
  const [active, setActive] = useState("privacy");
  const current = sections.find((s) => s.id === active)!;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <Navbar />

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 font-heading text-4xl font-black text-foreground sm:text-5xl"
          >
            Legal & Privacy
          </motion.h1>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <nav className="flex flex-row gap-2 overflow-x-auto lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-visible">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex-shrink-0 rounded-lg px-4 py-2.5 text-left text-sm transition-all ${
                    active === s.id
                      ? "bg-surface-2 font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>

            {/* Content */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground">{current.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Last updated: {current.updated}</p>
                </div>

                <div className="mb-6 rounded-xl bg-surface-2 p-4">
                  <p className="text-sm font-medium text-foreground">Key Points</p>
                  <p className="mt-1 text-sm text-muted-foreground">{current.summary}</p>
                </div>

                <div className="space-y-4">
                  {current.content.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LegalPage;
