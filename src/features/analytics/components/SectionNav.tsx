import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Section {
  id: string;
  label: string;
  icon?: string;
}

interface SectionNavProps {
  sections: Section[];
}

const SectionNav = ({ sections }: SectionNavProps) => {
  const [active, setActive] = useState(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-2 space-y-0.5 max-h-[70vh] overflow-y-auto scrollbar-none">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
            className={`block rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all whitespace-nowrap ${active === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default SectionNav;
