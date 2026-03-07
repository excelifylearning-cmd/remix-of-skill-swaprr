import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";
import { FileText, Download, Flag, Search } from "lucide-react";

const sections = [
  {
    id: "privacy", title: "Privacy Policy", updated: "March 1, 2026",
    summary: "We collect minimal data necessary to operate the platform. Your data is encrypted in transit and at rest. You have full control over your information.",
    content: [
      { heading: "Information We Collect", text: "Account details (name, email, university affiliation), skill data, gig activity, workspace interactions, and anonymized usage analytics. We never collect data we don't need." },
      { heading: "How We Use It", text: "To operate the platform, match skills via our algorithm, process skill points, resolve disputes through Skill Court, improve our services, and personalize your marketplace experience." },
      { heading: "Data Sharing", text: "We never sell your data. We share only with your explicit consent, with verified service providers under strict agreements, or as required by law. Your gig workspace data is visible only to participants." },
      { heading: "Data Retention", text: "Account data is retained while your account is active. Deleted accounts are purged within 30 days. Gig workspace data is archived for dispute resolution purposes for 90 days after completion." },
      { heading: "Your Rights", text: "Access, export, correct, or delete your data at any time from your account settings. Request a full data export in JSON or CSV format. Exercise your right to be forgotten with one click." },
      { heading: "Data Export", text: "Download all your data including profile information, gig history, points transactions, and workspace files. Available in your account settings under Privacy > Export Data." },
    ],
  },
  {
    id: "terms", title: "Terms of Service", updated: "March 1, 2026",
    summary: "By using SkillSwappr, you agree to fair use of the platform and respect for the community. These terms protect both you and other users.",
    content: [
      { heading: "Eligibility", text: "You must be 16 years or older to use the platform. University verification is optional but recommended for enhanced trust and campus-specific features." },
      { heading: "Account Responsibility", text: "You are responsible for maintaining the security of your account. Do not share login credentials. Report unauthorized access immediately. Multi-factor authentication is recommended." },
      { heading: "Skill Points", text: "Skill Points have no cash value and cannot be withdrawn or converted to currency. They are internal platform currency only, used to balance skill exchanges and reward participation." },
      { heading: "Content Ownership", text: "You retain full ownership of all work you create. SkillSwappr has a limited license to display your portfolio items and gig deliverables within the platform for operational purposes." },
      { heading: "Prohibited Conduct", text: "No harassment, fraud, plagiarism, impersonation, or manipulation of the rating/ELO system. Violations result in warnings, temporary bans, or permanent account termination based on severity." },
      { heading: "Gig Completion", text: "Both parties are expected to fulfill gig agreements. Abandonment at any stage triggers the insurance mechanism, protecting the non-abandoning party's allocated points." },
    ],
  },
  {
    id: "gdpr", title: "GDPR Compliance", updated: "March 1, 2026",
    summary: "We are fully compliant with GDPR for EU users. We maintain data processing agreements and have a dedicated Data Protection Officer.",
    content: [
      { heading: "Legal Basis", text: "We process data based on contractual necessity (operating your account and gigs) and legitimate interest (improving services and preventing fraud)." },
      { heading: "Data Transfers", text: "All EU user data is stored in EU-region servers. Any cross-border transfers comply with Standard Contractual Clauses and are documented in our data processing agreements." },
      { heading: "DPO Contact", text: "Our Data Protection Officer can be reached at dpo@skillswappr.com. Response time for GDPR inquiries is within 5 business days." },
      { heading: "Breach Notification", text: "We will notify affected users and relevant supervisory authorities within 72 hours of any confirmed data breach, as required by GDPR Article 33." },
      { heading: "Consent Management", text: "You can manage your data processing consents at any time through your account settings. We maintain detailed logs of all consent actions." },
    ],
  },
  {
    id: "community", title: "Community Guidelines", updated: "March 1, 2026",
    summary: "Be respectful, deliver quality work, and contribute positively. Our community thrives on mutual respect and fair dealings.",
    content: [
      { heading: "Respect", text: "Treat all users with dignity regardless of skill level, background, university, or experience. Discriminatory behavior of any kind results in immediate action." },
      { heading: "Quality Standards", text: "Deliver work that meets the agreed specifications. All deliverables go through AI quality checks. Plagiarism detection is active and results in permanent ban." },
      { heading: "Fair Rating", text: "Rate honestly based on work quality, communication, and professionalism. Coordinated rating manipulation is detectable through our AI systems and punishable by ELO reduction." },
      { heading: "Court Duty", text: "Free tier users must participate in Skill Court when called — it's part of the community contract. Thoughtful judging earns you points and ELO. Lazy judgments reduce your standing." },
      { heading: "Reporting", text: "Use the reporting system for genuine violations. Provide evidence when possible. False reports are tracked and reduce your credibility score." },
    ],
  },
  {
    id: "ip", title: "IP Policy", updated: "March 1, 2026",
    summary: "Creators retain IP rights by default. Enterprise gigs can include custom IP transfer agreements. All work is digitally fingerprinted.",
    content: [
      { heading: "Default Ownership", text: "The creator retains all intellectual property rights to their work unless explicitly agreed otherwise in the gig terms." },
      { heading: "License to Buyer", text: "Upon gig completion and acceptance, the buyer receives a perpetual, non-exclusive license to use the deliverable for the agreed purpose." },
      { heading: "Enterprise IP", text: "Enterprise-tier gigs can include full IP transfer via custom agreements. These are handled through our enterprise legal team with proper documentation." },
      { heading: "Digital Fingerprinting", text: "All deliverables are digitally fingerprinted upon submission for authenticity verification. This protects creators against unauthorized redistribution." },
    ],
  },
  {
    id: "cookies", title: "Cookie Policy", updated: "March 1, 2026",
    summary: "We use essential cookies for platform functionality and optional analytics cookies to improve the experience.",
    content: [
      { heading: "Essential Cookies", text: "Required for authentication, session management, and security. These cannot be disabled as they are necessary for the platform to function." },
      { heading: "Analytics Cookies", text: "Help us understand how users interact with the platform. Fully anonymized. You can opt out in your privacy settings." },
      { heading: "Preference Cookies", text: "Remember your settings like theme preference, language, and marketplace filters. Optional but improve your experience." },
      { heading: "Managing Cookies", text: "You can manage cookie preferences at any time through the cookie banner or in Account Settings > Privacy > Cookie Preferences." },
    ],
  },
];

const LegalPage = () => {
  const [active, setActive] = useState("privacy");
  const [searchQuery, setSearchQuery] = useState("");
  const current = sections.find((s) => s.id === active)!;

  const filteredContent = searchQuery
    ? current.content.filter((c) => c.heading.toLowerCase().includes(searchQuery.toLowerCase()) || c.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : current.content;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="mb-2 font-heading text-4xl font-black text-foreground sm:text-5xl">Legal & Privacy</h1>
            <p className="text-muted-foreground">Everything you need to know about how we handle your data and what we expect from users.</p>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <nav className="flex flex-row gap-1 overflow-x-auto lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-visible">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActive(s.id); setSearchQuery(""); }}
                  className={`flex-shrink-0 rounded-lg px-4 py-2.5 text-left text-sm transition-all ${
                    active === s.id
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1"
              >
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground">{current.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">Last updated: {current.updated}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <Download size={12} /> Export PDF
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <Flag size={12} /> Report Issue
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6 rounded-xl bg-surface-1 p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <FileText size={16} className="flex-shrink-0 mt-0.5 text-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Key Points</p>
                        <p className="text-sm text-muted-foreground">{current.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="mb-6 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search this section..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-surface-1 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {filteredContent.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-border/50 p-5"
                      >
                        <h3 className="mb-2 font-heading text-sm font-bold text-foreground">{item.heading}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {filteredContent.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">No results found in this section.</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default LegalPage;
