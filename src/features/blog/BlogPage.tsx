import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag, TrendingUp, User } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import CTAFooterSection from "@/features/home/sections/CTAFooterSection";

const categories = ["All", "Product", "Engineering", "Community", "Tips & Tricks", "Case Studies"];

const posts = [
  {
    title: "Introducing Skill Court: Community-Powered Dispute Resolution",
    excerpt: "How we built a fair, transparent system that combines community wisdom with AI analysis to resolve disputes.",
    category: "Product",
    author: "Alex Chen",
    date: "Mar 5, 2026",
    readTime: "8 min",
    featured: true,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
  },
  {
    title: "How We Scaled to 10,000 Users Without VC Funding",
    excerpt: "The bootstrapped journey from a dorm room idea to a platform used by students across 50+ universities.",
    category: "Community",
    author: "Sarah Park",
    date: "Mar 1, 2026",
    readTime: "6 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
  },
  {
    title: "5 Ways to Maximize Your Skill Points Without Spending a Dime",
    excerpt: "From referrals to court duty — here are the best ways to earn points and grow on the platform.",
    category: "Tips & Tricks",
    author: "Mia Zhang",
    date: "Feb 25, 2026",
    readTime: "4 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
  },
  {
    title: "Building Real-Time Collaboration: Our WebSocket Architecture",
    excerpt: "A deep dive into how we built the gig workspace with real-time messaging, whiteboard, and video.",
    category: "Engineering",
    author: "James Miller",
    date: "Feb 20, 2026",
    readTime: "12 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
  },
  {
    title: "From Zero to Guild Leader: Maya's SkillSwappr Journey",
    excerpt: "How a design student built a guild of 30 members and completed over 200 skill swaps in one year.",
    category: "Case Studies",
    author: "Lena Kovac",
    date: "Feb 15, 2026",
    readTime: "7 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
  },
  {
    title: "The Economics of Skill Points: Why We Tax Transactions",
    excerpt: "Understanding the 5% tax system and how it prevents inflation while keeping the economy healthy.",
    category: "Product",
    author: "Alex Chen",
    date: "Feb 10, 2026",
    readTime: "5 min",
    featured: false,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
  },
];

const BlogPage = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
  const featured = posts.find((p) => p.featured);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">Blog</h1>
              <p className="text-lg text-muted-foreground">Product updates, engineering insights, and community stories.</p>
            </motion.div>

            {/* Categories */}
            <div className="mb-10 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${active === cat ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured */}
            {featured && active === "All" && (
              <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto">
                    <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-skill-green/10 px-3 py-1 text-xs font-semibold text-skill-green">Featured</span>
                      <span className="text-xs text-muted-foreground">{featured.category}</span>
                    </div>
                    <h2 className="mb-3 font-heading text-2xl font-bold text-foreground lg:text-3xl">{featured.title}</h2>
                    <p className="mb-6 text-sm text-muted-foreground">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={12} /> {featured.author}</span>
                      <span>{featured.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.filter((p) => !p.featured || active !== "All").map((post, i) => (
                <motion.article key={post.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-[10px] font-medium text-muted-foreground">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground line-clamp-2">{post.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author} · {post.date}</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default BlogPage;
