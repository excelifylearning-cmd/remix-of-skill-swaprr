import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight, GraduationCap, Building2 } from "lucide-react";

const universities = [
  "MIT", "Stanford", "Oxford", "Cambridge", "UCLA", "Harvard",
  "ETH Zürich", "Imperial College", "Berkeley", "Princeton",
  "Carnegie Mellon", "Georgia Tech", "Yale", "Columbia", "NYU",
];

const forUniversities = [
  "Branded skill badges and verification",
  "Real-time student engagement analytics",
  "Curriculum integration APIs",
  "Co-branded events and hackathons",
  "Dedicated success manager",
];

const forStudents = [
  "Verified university badge on profile",
  "Campus-specific marketplace access",
  "Academic credit eligibility",
  "Priority in enterprise gig matching",
  "Exclusive guild tournaments",
];

const UniversityPartnershipsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Partnerships
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">University Partners</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Trusted by leading institutions worldwide to power student skill development.</p>
        </motion.div>

        {/* University grid */}
        <motion.div
          className="rounded-2xl border border-border bg-card p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {universities.map((uni, i) => (
              <motion.div
                key={uni}
                className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 hover:border-muted-foreground/30 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.04 }}
                whileHover={{ y: -2 }}
              >
                <GraduationCap size={13} className="text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{uni}</span>
              </motion.div>
            ))}
            <motion.div
              className="rounded-full border border-dashed border-muted-foreground/30 px-4 py-2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <span className="text-xs text-muted-foreground">+37 more</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "For Universities", icon: Building2, items: forUniversities, accent: "court-blue" },
            { title: "For Students", icon: GraduationCap, items: forStudents, accent: "skill-green" },
          ].map((section, si) => (
            <motion.div
              key={si}
              className="rounded-2xl border border-border bg-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + si * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${section.accent}/10`}>
                  <section.icon size={18} className={`text-${section.accent}`} />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className={`w-4 h-4 text-${section.accent} shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/enterprise"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Become a Partner <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityPartnershipsSection;
