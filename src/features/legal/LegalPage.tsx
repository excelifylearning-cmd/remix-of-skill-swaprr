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
      { heading: "1. Information We Collect", text: "We collect information you provide directly: account registration data (full name, email address, password hash, university affiliation), profile information (skills offered/wanted, bio, portfolio links, avatar), and gig activity data (messages, files, deliverables, video call recordings within workspaces). We also collect automatically: device information (browser type, OS, screen resolution), IP address and approximate location, usage analytics (pages visited, features used, session duration), and performance data (load times, error logs). We use cookies as described in our Cookie Policy section." },
      { heading: "2. How We Use Your Data", text: "Your data is used to: (a) operate and maintain your account and platform access; (b) facilitate skill matching through our AI recommendation engine; (c) process Skill Point transactions and maintain ledger accuracy; (d) resolve disputes through Skill Court by providing judges with relevant workspace evidence; (e) improve platform services through anonymized usage analytics; (f) personalize your marketplace experience with relevant recommendations; (g) send transactional emails (gig updates, security alerts) and optional marketing communications; (h) prevent fraud, abuse, and violations of our Terms of Service; (i) comply with legal obligations and respond to lawful requests." },
      { heading: "3. Data Sharing & Third Parties", text: "We never sell, rent, or trade your personal data. We share data only: (a) with your explicit consent (e.g., sharing your profile with an enterprise client); (b) with verified service providers under strict data processing agreements (hosting: AWS, analytics: PostHog, email: Resend); (c) with Skill Court judges when you are party to a dispute (limited to relevant workspace data); (d) as required by law, court order, or governmental request; (e) to protect our rights, property, or safety, or that of our users. Your gig workspace data is visible only to gig participants and, in case of dispute, to assigned Skill Court judges." },
      { heading: "4. Data Retention & Deletion", text: "Account data is retained while your account is active. Upon account deletion: profile data is removed within 7 days; workspace data (messages, files) is anonymized within 30 days; transaction records are retained in anonymized form for 2 years for financial auditing; Skill Court evidence is retained for 1 year after case resolution. Inactive accounts (no login for 24 months) receive deletion warning emails at 18, 21, and 23 months. After 24 months, accounts are automatically suspended and data deletion begins." },
      { heading: "5. Your Rights (GDPR, CCPA, and Global)", text: "You have the right to: (a) Access — request a complete copy of all data we hold about you; (b) Rectification — correct inaccurate or incomplete data; (c) Erasure — request deletion of your data ('right to be forgotten'); (d) Portability — export your data in machine-readable format (JSON, CSV); (e) Restriction — limit how we process your data; (f) Objection — object to processing based on legitimate interest; (g) Non-discrimination — exercising your rights will not affect your service quality. For California residents (CCPA): you have the right to know what data we collect, request deletion, and opt out of data sales (we don't sell data). Exercise any right from Account Settings > Privacy or email privacy@skillswappr.com." },
      { heading: "6. Data Security", text: "We implement industry-standard security measures: TLS 1.3 encryption for all data in transit; AES-256 encryption for data at rest; bcrypt password hashing with salt; regular penetration testing by third-party security firms; SOC 2 Type II compliance (in progress); bug bounty program for responsible vulnerability disclosure; role-based access controls for internal data access; automated security scanning of all code deployments; 24/7 infrastructure monitoring and alerting." },
      { heading: "7. International Data Transfers", text: "SkillSwappr operates globally. Data may be transferred to and processed in countries other than your own. For EU users, we ensure adequate protection through: Standard Contractual Clauses (SCCs) approved by the European Commission; data processing agreements with all sub-processors; storage of EU user data in EU-region servers where possible. For a list of our sub-processors and their locations, contact dpo@skillswappr.com." },
      { heading: "8. Children's Privacy", text: "SkillSwappr is not intended for users under 16 years of age. We do not knowingly collect personal information from children under 16. If we discover we have collected data from a child under 16, we will delete it immediately. If you believe a child under 16 has provided us with personal data, please contact us at privacy@skillswappr.com." },
      { heading: "9. Changes to This Policy", text: "We may update this Privacy Policy from time to time. We will notify you of material changes via: email notification to your registered address; in-app notification banner; and a 30-day advance notice period before changes take effect. Continued use of the platform after the notice period constitutes acceptance of the updated policy. Previous versions are archived and available upon request." },
    ],
  },
  {
    id: "terms", title: "Terms of Service", updated: "March 1, 2026",
    summary: "By using SkillSwappr, you agree to fair use of the platform and respect for the community. These terms protect both you and other users.",
    content: [
      { heading: "1. Acceptance of Terms", text: "By accessing or using SkillSwappr ('the Platform'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree, you must not use the Platform. These Terms constitute a legally binding agreement between you and SkillSwappr Inc. We reserve the right to modify these Terms at any time with 30 days' notice. Your continued use after the notice period constitutes acceptance." },
      { heading: "2. Eligibility", text: "You must be at least 16 years old to use the Platform. If you are between 16–18, you represent that your parent or legal guardian has reviewed and agreed to these Terms. University verification is optional but recommended for enhanced trust features, campus-specific marketplace access, and student discounts. You must provide accurate, current information during registration." },
      { heading: "3. Account Responsibility", text: "You are solely responsible for maintaining the confidentiality and security of your account credentials. You must not share login credentials with any third party. You must notify us immediately of any unauthorized access at security@skillswappr.com. We strongly recommend enabling multi-factor authentication (MFA). You are responsible for all activity under your account. We reserve the right to suspend accounts showing suspicious activity pending investigation." },
      { heading: "4. Skill Points", text: "Skill Points ('SP') are the Platform's internal currency. Key terms: (a) SP have no cash value and cannot be purchased, sold, exchanged for real currency, or transferred outside the Platform; (b) SP are non-refundable and non-transferable except through Platform mechanisms (gigs, guild treasury, lending); (c) The 5% transaction tax is non-negotiable and applies to both parties; (d) SkillSwappr reserves the right to adjust SP values, earning rates, and tax rates with 14 days' notice; (e) Upon account deletion, all SP are permanently forfeited; (f) Attempts to manipulate the SP economy (farming, exploiting bugs, unauthorized automation) will result in immediate account termination." },
      { heading: "5. Content Ownership & Licensing", text: "You retain full intellectual property rights to all original content you create and submit through the Platform. By using the Platform, you grant SkillSwappr a limited, non-exclusive, worldwide, royalty-free license to: (a) display your portfolio items and gig deliverables within the Platform; (b) use your content for Platform promotion (with your consent); (c) cache and backup your content for operational purposes. This license terminates when you delete your content or account, except for content shared in completed gigs (which remains accessible to the other party)." },
      { heading: "6. Prohibited Conduct", text: "You must not: (a) harass, bully, threaten, or discriminate against any user; (b) submit plagiarized, fraudulent, or AI-generated work passed off as original without disclosure; (c) impersonate another person or entity; (d) manipulate the ELO rating system, reviews, or Skill Court judgments; (e) create multiple accounts to circumvent bans, earn multiple signup bonuses, or manipulate matchmaking; (f) use automated tools (bots, scrapers) without written permission; (g) share, distribute, or sell another user's deliverables outside the agreed scope; (h) engage in any activity that disrupts Platform operations or degrades service for others. Violations result in: first offense — warning and 48-hour restriction; second offense — 30-day suspension and ELO penalty; third offense — permanent account termination." },
      { heading: "7. Gig Agreements & Completion", text: "When you enter a gig, you enter a binding agreement to deliver the agreed work. Both parties are expected to: (a) communicate clearly and respond within 48 hours; (b) deliver work meeting the agreed specifications; (c) complete all stages as outlined in the gig terms; (d) rate honestly and fairly after completion. Abandonment: if you abandon a gig after the first stage, the other party retains all points allocated to completed stages (insurance mechanism). Repeated abandonment (3+ within 90 days) results in a gig privilege suspension." },
      { heading: "8. Dispute Resolution", text: "All disputes between users are resolved through Skill Court, our internal dispute resolution system. By using the Platform, you agree to: (a) submit disputes through Skill Court before seeking external resolution; (b) provide honest, complete evidence; (c) accept Skill Court verdicts as binding (subject to one appeal); (d) not retaliate against the other party regardless of outcome. SkillSwappr Inc. is not a party to disputes between users and bears no liability for gig outcomes. For disputes with SkillSwappr Inc. itself, you agree to binding arbitration under the rules of the American Arbitration Association." },
      { heading: "9. Limitation of Liability", text: "To the maximum extent permitted by law: (a) SkillSwappr provides the Platform 'as is' without warranties of any kind; (b) we are not liable for any indirect, incidental, consequential, or punitive damages; (c) our total liability to you shall not exceed the amount you've paid us in the 12 months preceding the claim; (d) we are not responsible for the quality, legality, or safety of gig deliverables exchanged between users; (e) we are not liable for any loss of Skill Points, ELO rating changes, or account restrictions resulting from Platform operations or your violations of these Terms." },
      { heading: "10. Termination", text: "You may terminate your account at any time from Account Settings. SkillSwappr may terminate or suspend your account for: (a) violation of these Terms; (b) fraudulent activity; (c) prolonged inactivity (24+ months); (d) failure to comply with Skill Court judgments. Upon termination: all active gigs are cancelled, SP are forfeited, data is handled per our Privacy Policy, and you may not create a new account without written permission if terminated for cause." },
      { heading: "11. Governing Law", text: "These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any legal action must be brought in the federal or state courts located in San Francisco County, California. If any provision is found unenforceable, the remaining provisions remain in full force." },
    ],
  },
  {
    id: "gdpr", title: "GDPR Compliance", updated: "March 1, 2026",
    summary: "We are fully compliant with GDPR for EU/EEA users. We maintain data processing agreements, appoint a DPO, and ensure all transfers are lawful.",
    content: [
      { heading: "1. Data Controller", text: "SkillSwappr Inc. is the data controller for personal data processed through the Platform. Our registered address is 123 Innovation Blvd, San Francisco, CA 94107, USA. For all GDPR inquiries, contact our Data Protection Officer at dpo@skillswappr.com." },
      { heading: "2. Legal Basis for Processing", text: "We process personal data on the following legal bases under GDPR Article 6: (a) Contract performance (Article 6(1)(b)) — processing necessary to operate your account, facilitate gigs, process SP transactions, and provide Platform services; (b) Legitimate interest (Article 6(1)(f)) — fraud prevention, platform security, service improvement, and analytics; (c) Consent (Article 6(1)(a)) — marketing communications, optional analytics cookies, and profile sharing with enterprise clients; (d) Legal obligation (Article 6(1)(c)) — compliance with tax, financial, and regulatory requirements." },
      { heading: "3. Data Subject Rights", text: "Under GDPR, you have the right to: (a) Access (Article 15) — obtain confirmation of processing and a copy of your data; (b) Rectification (Article 16) — correct inaccurate data; (c) Erasure (Article 17) — request deletion ('right to be forgotten'); (d) Restriction (Article 18) — limit processing in certain circumstances; (e) Portability (Article 20) — receive your data in a structured, machine-readable format; (f) Object (Article 21) — object to processing based on legitimate interest; (g) Automated decision-making (Article 22) — not be subject to solely automated decisions with legal effects. To exercise any right, use Account Settings > Privacy or email dpo@skillswappr.com. We respond within 30 days as required by GDPR." },
      { heading: "4. International Data Transfers", text: "EU/EEA user data may be transferred to the United States for processing. We ensure adequate protection through: (a) Standard Contractual Clauses (SCCs) approved by the European Commission (Decision 2021/914); (b) Data Processing Agreements (DPAs) with all sub-processors; (c) Storage of EU user data in EU-region servers (AWS eu-west-1) where technically feasible; (d) Regular assessment of transfer impact per Schrems II requirements. Sub-processors: AWS (hosting, eu-west-1 and us-east-1), PostHog (analytics, EU), Resend (email, US), Cloudflare (CDN, global)." },
      { heading: "5. Data Protection Impact Assessments", text: "We conduct DPIAs for: (a) AI-powered skill matching and recommendation systems; (b) Skill Court evidence processing and automated analysis; (c) Behavioral monitoring for fraud and scam detection; (d) Any new feature involving large-scale processing of personal data. DPIA records are maintained and available to supervisory authorities upon request." },
      { heading: "6. Breach Notification", text: "In the event of a personal data breach: (a) We will notify the relevant supervisory authority within 72 hours of becoming aware (Article 33); (b) We will notify affected data subjects without undue delay if the breach poses high risk to their rights (Article 34); (c) Notifications will include: nature of the breach, categories and approximate number of affected individuals, likely consequences, and measures taken to address and mitigate the breach; (d) We maintain a breach register documenting all incidents, their effects, and remedial actions taken." },
      { heading: "7. Data Protection Officer", text: "Our appointed DPO can be reached at: Email: dpo@skillswappr.com; Address: SkillSwappr Inc., Attn: Data Protection Officer, 123 Innovation Blvd, San Francisco, CA 94107, USA. Response time for GDPR inquiries: within 5 business days for initial acknowledgment, within 30 days for complete response. The DPO reports directly to executive management and operates independently." },
      { heading: "8. Supervisory Authority", text: "If you are unsatisfied with our handling of your data, you have the right to lodge a complaint with your local data protection supervisory authority. For a list of EU/EEA supervisory authorities, visit: https://edpb.europa.eu/about-edpb/about-edpb/members_en" },
    ],
  },
  {
    id: "community", title: "Community Guidelines", updated: "March 1, 2026",
    summary: "Be respectful, deliver quality work, and contribute positively. Our community thrives on mutual respect and fair dealings.",
    content: [
      { heading: "1. Core Values", text: "SkillSwappr is built on four core values: (a) Respect — treat every user with dignity regardless of skill level, background, university, experience, or identity; (b) Quality — deliver work that meets or exceeds agreed specifications; (c) Fairness — engage honestly in all transactions, reviews, and disputes; (d) Community — contribute positively to the platform ecosystem through mentorship, court service, and constructive feedback." },
      { heading: "2. Communication Standards", text: "When communicating on the Platform: (a) Use professional, respectful language in all interactions; (b) Respond to messages within 48 hours during active gigs; (c) Do not send unsolicited promotional messages or spam; (d) Do not share personal contact information to circumvent Platform fees; (e) Report harassment, threats, or discriminatory language immediately; (f) Voice notes and video calls follow the same standards — no abusive, threatening, or discriminatory content." },
      { heading: "3. Quality Standards", text: "All deliverables must: (a) Be original work or properly attributed/licensed; (b) Meet the specifications agreed in the gig terms; (c) Pass Platform AI quality checks (plagiarism, quality score); (d) Not contain malware, viruses, or malicious code; (e) Not violate third-party intellectual property rights; (f) Be submitted through the Platform's deliverable submission system. AI-generated content must be disclosed. Submitting AI-generated work as original human work constitutes fraud." },
      { heading: "4. Rating & Review Ethics", text: "Your ratings and reviews must: (a) Reflect your genuine experience with the other party; (b) Be based on work quality, communication, and professionalism; (c) Not be influenced by external agreements, threats, or compensation; (d) Not be coordinated with other users to artificially inflate or deflate ratings. Violations: coordinated rating manipulation is detectable through our AI systems and results in ELO reduction (50–200 points) and potential account suspension." },
      { heading: "5. Skill Court Participation", text: "As a Platform member: (a) Free tier users must serve as Skill Court judges when called — this is a community responsibility; (b) Declining court duty reduces your gig privileges (max 3 gigs/month instead of 5); (c) Judges must review evidence thoroughly and make fair, unbiased decisions; (d) Lazy judgments (decisions without reviewing evidence) are detected and result in judge ELO reduction; (e) Excellent judging earns bonus SP and judge-specific achievements." },
      { heading: "6. Prohibited Content", text: "The following content is prohibited on the Platform: (a) Sexually explicit, pornographic, or obscene material; (b) Content promoting violence, self-harm, or illegal activities; (c) Hate speech, discriminatory content, or harassment; (d) Content that infringes on intellectual property rights; (e) Malware, phishing attempts, or security exploits; (f) Personal information of third parties without their consent; (g) Misleading or deceptive content, including fake portfolios." },
      { heading: "7. Enforcement & Consequences", text: "Violations are enforced progressively: (a) Minor violations (late responses, low-quality work): warning and coaching; (b) Moderate violations (review manipulation, minor fraud): 30-day suspension + ELO penalty; (c) Severe violations (harassment, plagiarism, scam): permanent ban; (d) Critical violations (illegal activity, threats): immediate ban + report to authorities. Appeals can be submitted within 14 days of enforcement action through Account Settings > Appeals." },
    ],
  },
  {
    id: "ip", title: "Intellectual Property Policy", updated: "March 1, 2026",
    summary: "Creators retain IP rights by default. Enterprise gigs can include custom IP transfer agreements. All work is digitally fingerprinted.",
    content: [
      { heading: "1. Default Ownership", text: "Unless explicitly agreed otherwise in the gig terms: (a) The creator retains all intellectual property rights to their original work; (b) This includes copyright, moral rights, and any related rights; (c) The creator may use the work in their portfolio, case studies, and future projects; (d) This default applies to all gig formats including Direct Swap, Auction, Co-Creation, and Skill Fusion." },
      { heading: "2. License to Buyer", text: "Upon gig completion and buyer acceptance: (a) The buyer receives a perpetual, non-exclusive, worldwide, royalty-free license to use the deliverable for the agreed purpose; (b) The buyer may modify the deliverable for their own use; (c) The buyer may not sublicense, resell, or redistribute the deliverable without creator consent; (d) The license survives account deletion by either party; (e) The scope of use should be discussed and agreed upon during gig setup." },
      { heading: "3. Work-for-Hire & Full Transfer", text: "Full IP transfer is available through: (a) Enterprise-tier gigs with explicit IP transfer clauses in the gig agreement; (b) Custom IP transfer agreements facilitated by our legal team; (c) Work-for-hire arrangements where both parties acknowledge in writing that the buyer will own all rights. Full transfer includes: copyright, reproduction rights, distribution rights, modification rights, and derivative work rights. The creator retains moral rights where applicable by law." },
      { heading: "4. Co-Creation IP", text: "For multi-person Co-Creation Studio gigs: (a) Each contributor retains IP over their individual contributions; (b) The combined work is jointly owned unless otherwise agreed; (c) All contributors must consent before the combined work can be licensed to third parties; (d) Guild projects follow the guild's IP agreement, which members accept upon joining; (e) We recommend documenting IP expectations before starting any co-creation project." },
      { heading: "5. Digital Fingerprinting", text: "All deliverables submitted through the Platform are digitally fingerprinted: (a) Invisible watermarks embedded in images, documents, and media files; (b) Code submissions are hashed and timestamped for provenance verification; (c) Fingerprints are stored permanently and linked to the creator's account; (d) Any user can verify the authenticity and origin of a deliverable through our Transaction Lookup system; (e) Fingerprinting is automatic and cannot be disabled." },
      { heading: "6. DMCA & Takedown Procedures", text: "If you believe your intellectual property has been infringed on the Platform: (a) Submit a DMCA takedown notice to ip@skillswappr.com; (b) Include: identification of the copyrighted work, location of the infringing material, your contact information, a statement of good faith belief, and a statement under penalty of perjury; (c) We will respond within 48 hours and remove infringing content within 5 business days; (d) Counter-notices may be filed within 10 business days; (e) Repeat infringers will be permanently banned after 3 valid DMCA notices." },
      { heading: "7. Platform Content License", text: "Content you post publicly on the Platform (forum posts, blog comments, guild descriptions): (a) You grant SkillSwappr a non-exclusive, worldwide, royalty-free license to display, distribute, and promote this content within the Platform; (b) You may delete public content at any time, which revokes this license going forward; (c) Cached or archived versions may persist for up to 30 days after deletion; (d) We will never use your content for AI training without explicit opt-in consent." },
    ],
  },
  {
    id: "cookies", title: "Cookie Policy", updated: "March 1, 2026",
    summary: "We use essential cookies for platform functionality and optional analytics cookies to improve the experience.",
    content: [
      { heading: "1. What Are Cookies", text: "Cookies are small text files stored on your device when you visit our Platform. They help us provide essential functionality, remember your preferences, and understand how you use our services. We also use similar technologies including local storage, session storage, and pixel tags." },
      { heading: "2. Essential Cookies (Required)", text: "These cookies are necessary for the Platform to function and cannot be disabled: (a) Authentication cookies — maintain your login session; (b) Security cookies — CSRF protection, rate limiting tokens; (c) Load balancing cookies — ensure optimal server routing; (d) Cookie consent cookie — remembers your cookie preferences. Duration: session or up to 30 days. These cookies do not track you across other websites." },
      { heading: "3. Functional Cookies (Optional)", text: "These cookies remember your preferences: (a) Theme preference (light/dark mode); (b) Language settings; (c) Marketplace filter defaults; (d) Notification preferences; (e) Workspace layout preferences. Duration: up to 1 year. You can disable these, but some Platform features may not work optimally." },
      { heading: "4. Analytics Cookies (Optional)", text: "These help us understand Platform usage: (a) PostHog — page views, feature usage, session duration, user flows; (b) Error tracking — JavaScript errors, API failures. All analytics data is: fully anonymized (no PII), aggregated for reporting, never shared with third parties for advertising, retained for 12 months maximum. You can opt out via cookie preferences or browser settings." },
      { heading: "5. Third-Party Cookies", text: "We minimize third-party cookies. Currently used: (a) Cloudflare — security and performance (essential); (b) PostHog — analytics (optional, EU-hosted). We do NOT use: advertising cookies, social media tracking pixels, cross-site tracking cookies, or any cookie that builds an advertising profile." },
      { heading: "6. Managing Your Preferences", text: "You can manage cookies through: (a) Our cookie consent banner — appears on first visit, accessible anytime via footer link; (b) Account Settings > Privacy > Cookie Preferences; (c) Your browser settings (note: disabling essential cookies will prevent Platform use); (d) Browser extensions for cookie management. Changes take effect immediately. Previously collected data from opted-out cookies is deleted within 30 days." },
    ],
  },
  {
    id: "acceptable-use", title: "Acceptable Use Policy", updated: "March 1, 2026",
    summary: "This policy defines acceptable and prohibited uses of the SkillSwappr platform to ensure a safe, fair environment for all users.",
    content: [
      { heading: "1. Permitted Uses", text: "You may use the Platform to: (a) exchange skills with other verified users; (b) build and showcase your professional portfolio; (c) participate in guilds and community activities; (d) serve as a Skill Court judge when eligible; (e) use the marketplace to find talent or offer your services; (f) participate in challenges, events, and Guild Wars; (g) access enterprise features if subscribed to the appropriate tier." },
      { heading: "2. Prohibited Uses", text: "You must not: (a) use the Platform for any illegal purpose; (b) attempt to gain unauthorized access to other accounts or Platform systems; (c) interfere with or disrupt Platform services or servers; (d) use automated tools, bots, or scripts without written authorization; (e) circumvent rate limits, security measures, or access controls; (f) reverse engineer, decompile, or disassemble any Platform software; (g) use the Platform to distribute malware, viruses, or harmful code." },
      { heading: "3. Rate Limits & Fair Use", text: "To ensure fair access for all users: (a) API requests are limited per tier (Free: 100/hour, Pro: 500/hour, Team: 2000/hour, Enterprise: custom); (b) File uploads are limited to 50MB per file, 1GB per month (Free), 10GB per month (Pro+); (c) Message sending is rate-limited to prevent spam; (d) Workspace video calls are limited to 60 minutes (Free), unlimited (Pro+); (e) Exceeding limits results in temporary throttling, not account suspension." },
      { heading: "4. Security Responsibilities", text: "You are responsible for: (a) using a strong, unique password for your account; (b) enabling MFA when available; (c) not sharing account credentials; (d) reporting security vulnerabilities through our bug bounty program (not exploiting them); (e) keeping your devices and browsers updated; (f) logging out of shared/public devices." },
      { heading: "5. Consequences of Violation", text: "Violations are handled proportionally: (a) first violation: warning + 24-hour feature restriction; (b) repeated minor violations: 7-day suspension; (c) serious violations (security breach attempts, harassment): immediate suspension pending investigation; (d) criminal activity: permanent ban + referral to law enforcement. All enforcement decisions can be appealed through Account Settings > Appeals within 14 days." },
    ],
  },
  {
    id: "disclaimer", title: "Disclaimers & Liability", updated: "March 1, 2026",
    summary: "Important disclaimers about Platform availability, user-generated content, and limitations of liability.",
    content: [
      { heading: "1. Service Availability", text: "We strive for 99.9% uptime but do not guarantee uninterrupted service. The Platform may be temporarily unavailable due to: (a) scheduled maintenance (announced 48 hours in advance); (b) emergency security patches; (c) force majeure events (natural disasters, infrastructure failures); (d) DDoS attacks or other security incidents. We are not liable for any losses resulting from Platform unavailability." },
      { heading: "2. User-Generated Content", text: "SkillSwappr does not endorse, verify, or guarantee: (a) the accuracy of user profiles, portfolios, or skill claims; (b) the quality of deliverables exchanged between users; (c) the accuracy of user reviews and ratings; (d) claims made in forum posts, blog comments, or guild descriptions. You interact with other users at your own risk. Due diligence (checking portfolios, ratings, transaction history) is your responsibility." },
      { heading: "3. AI System Limitations", text: "Our AI systems (skill matching, quality scoring, court analysis) are tools, not guarantees: (a) AI recommendations are suggestions, not mandates; (b) quality scores are estimates based on algorithms, not definitive assessments; (c) AI court analysis contributes 25% of the verdict weight and is reviewed by human judges; (d) AI scam detection may produce false positives — flagged accounts are always reviewed by humans before action." },
      { heading: "4. Financial Disclaimer", text: "Skill Points have no monetary value. SkillSwappr: (a) does not provide financial services; (b) is not a payment processor, bank, or financial institution; (c) does not guarantee any financial outcome from Platform use; (d) is not responsible for any real-world financial decisions made based on Platform activity; (e) subscription fees are non-refundable after the 14-day money-back guarantee period." },
      { heading: "5. Indemnification", text: "You agree to indemnify and hold harmless SkillSwappr Inc., its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from: (a) your use of the Platform; (b) your violation of these Terms or any applicable law; (c) your infringement of any third-party rights; (d) content you submit or share through the Platform." },
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
            <nav className="flex flex-row gap-1 overflow-x-auto lg:w-60 lg:flex-shrink-0 lg:flex-col lg:overflow-visible">
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
                        transition={{ delay: i * 0.03 }}
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
