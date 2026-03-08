import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";
import { FileText, Download, Flag, Search } from "lucide-react";
import { sections } from "./legalSections";

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
