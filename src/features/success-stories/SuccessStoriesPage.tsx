import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, Quote, TrendingUp, Users, Award, Briefcase, GraduationCap, Globe,
  Heart, MessageSquare, Play, ArrowRight, ChevronRight, Sparkles, Trophy,
  Target, Zap, Clock, DollarSign, BookOpen, Rocket, Crown, Medal, Shield,
  CheckCircle2, MapPin, Calendar, Building2, Code, Palette, PenTool,
  BarChart3, Mic, Video, Camera, Music, Cpu, Layers, Database
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";

const featuredStories = [
  {
    id: "sarah-fullstack",
    name: "Sarah Martinez",
    avatar: "SM",
    beforeRole: "Marketing Manager",
    afterRole: "Full-Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    university: "UCLA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    quote: "SkillSwap gave me something bootcamps couldn't: real mentorship from working professionals who actually cared about my growth.",
    story: "After 5 years in marketing, I felt stuck. Traditional bootcamps were expensive and inflexible. Through SkillSwap, I exchanged my marketing expertise for coding lessons over 8 months. Today, I work as a full-stack developer earning 40% more.",
    skills: ["React", "Node.js", "Python", "SQL"],
    stats: { swaps: 47, monthsToTransition: 8, salaryIncrease: "40%" },
    tags: ["Career Change", "Tech", "Marketing"],
    featured: true,
  },
  {
    id: "marcus-agency",
    name: "Marcus Chen",
    avatar: "MC",
    beforeRole: "Freelance Designer",
    afterRole: "Agency Founder",
    company: "Chen Creative Studio",
    location: "Austin, TX",
    university: "UT Austin",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    quote: "I traded design skills for business fundamentals. Now I run a 12-person agency that's grown 300% year over year.",
    story: "As a designer, I was great at creating but terrible at running a business. SkillSwap connected me with MBAs and entrepreneurs who taught me finance, operations, and leadership in exchange for design mentorship.",
    skills: ["Business Strategy", "Finance", "Leadership", "Operations"],
    stats: { swaps: 89, teamSize: 12, growthRate: "300%" },
    tags: ["Entrepreneurship", "Design", "Business"],
    featured: true,
  },
  {
    id: "priya-datascience",
    name: "Priya Sharma",
    avatar: "PS",
    beforeRole: "Financial Analyst",
    afterRole: "Senior Data Scientist",
    company: "Fortune 500",
    location: "New York, NY",
    university: "NYU Stern",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
    quote: "My analytical background combined with Python and ML skills from SkillSwap opened doors I never imagined.",
    story: "Finance gave me analytical rigor, but I craved more technical depth. Through 60+ skill swaps, I learned Python, machine learning, and data engineering while teaching financial modeling and Excel mastery.",
    skills: ["Python", "Machine Learning", "Data Engineering", "Statistics"],
    stats: { swaps: 62, promotions: 3, salaryIncrease: "65%" },
    tags: ["Data Science", "Finance", "Career Growth"],
    featured: true,
  },
];

const moreStories = [
  { name: "Alex Kim", role: "UX Lead at Spotify", from: "Graphic Designer", avatar: "AK", quote: "Swapped illustration for UX research skills.", increase: "35%", swaps: 34 },
  { name: "Jordan Rivera", role: "DevOps Engineer", from: "IT Support", avatar: "JR", quote: "Cloud architecture through peer learning.", increase: "50%", swaps: 41 },
  { name: "Emma Thompson", role: "Product Manager", from: "Software Engineer", avatar: "ET", quote: "Technical skills + business acumen = PM role.", increase: "25%", swaps: 28 },
  { name: "David Okonkwo", role: "Startup Founder", from: "Corporate Lawyer", avatar: "DO", quote: "Legal + tech skills launched my startup.", increase: "200%", swaps: 56 },
  { name: "Lisa Wang", role: "AI Research Lead", from: "Physics PhD", avatar: "LW", quote: "Physics to ML was smoother than expected.", increase: "45%", swaps: 38 },
  { name: "Carlos Mendez", role: "Creative Director", from: "Video Editor", avatar: "CM", quote: "Strategy skills elevated my creative work.", increase: "55%", swaps: 45 },
  { name: "Nina Patel", role: "Blockchain Developer", from: "Web Developer", avatar: "NP", quote: "Web3 skills from crypto enthusiasts.", increase: "70%", swaps: 52 },
  { name: "Ryan Foster", role: "Growth Lead at Series B", from: "Sales Rep", avatar: "RF", quote: "Data + sales = growth hacking mastery.", increase: "60%", swaps: 33 },
];

const transformationStats = [
  { label: "Career Changers", value: "12,400+", icon: Briefcase, description: "Successfully transitioned careers" },
  { label: "Avg. Salary Increase", value: "42%", icon: TrendingUp, description: "After skill transformation" },
  { label: "New Skills Learned", value: "3.8", icon: Zap, description: "Average per user annually" },
  { label: "Success Rate", value: "94%", icon: Target, description: "Goal achievement rate" },
  { label: "Time to Results", value: "4.2mo", icon: Clock, description: "Average transformation time" },
  { label: "Community Rating", value: "4.9/5", icon: Star, description: "User satisfaction score" },
];

const industryBreakdown = [
  { industry: "Technology", percentage: 34, icon: Code, color: "bg-skill-green" },
  { industry: "Design & Creative", percentage: 22, icon: Palette, color: "bg-court-blue" },
  { industry: "Business & Finance", percentage: 18, icon: BarChart3, color: "bg-foreground" },
  { industry: "Data & Analytics", percentage: 14, icon: Database, color: "bg-purple-500" },
  { industry: "Marketing", percentage: 8, icon: Mic, color: "bg-alert-red" },
  { industry: "Other", percentage: 4, icon: Layers, color: "bg-muted-foreground" },
];

const videoTestimonials = [
  { name: "Jessica Lee", role: "From Teacher to Tech Lead", thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop", duration: "4:32" },
  { name: "Michael Brown", role: "Musician to Music Tech Founder", thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop", duration: "5:18" },
  { name: "Aisha Johnson", role: "Nurse to Health Tech PM", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=400&fit=crop", duration: "3:45" },
];

const skillJourneys = [
  { from: "Marketing", to: "Development", swappers: 2340, avgTime: "6 months", topSkills: ["JavaScript", "React", "Node.js"] },
  { from: "Design", to: "Product Management", swappers: 1890, avgTime: "4 months", topSkills: ["Strategy", "Analytics", "Roadmapping"] },
  { from: "Finance", to: "Data Science", swappers: 1560, avgTime: "8 months", topSkills: ["Python", "SQL", "Machine Learning"] },
  { from: "Engineering", to: "Entrepreneurship", swappers: 1230, avgTime: "5 months", topSkills: ["Business", "Leadership", "Sales"] },
];

const universityHighlights = [
  { name: "Stanford", stories: 234, topField: "AI/ML", logo: "S" },
  { name: "MIT", stories: 198, topField: "Engineering", logo: "M" },
  { name: "Harvard", stories: 176, topField: "Business", logo: "H" },
  { name: "Berkeley", stories: 165, topField: "Data Science", logo: "B" },
  { name: "UCLA", stories: 152, topField: "Design", logo: "U" },
  { name: "NYU", stories: 143, topField: "Media", logo: "N" },
];

const mentorSpotlights = [
  { name: "Dr. Emily Chen", title: "AI Research Director", expertise: "Machine Learning", mentees: 89, rating: 4.98, avatar: "EC" },
  { name: "James Wilson", title: "Serial Entrepreneur", expertise: "Startups & Growth", mentees: 67, rating: 4.95, avatar: "JW" },
  { name: "Maria Garcia", title: "Design Lead @ Apple", expertise: "Product Design", mentees: 54, rating: 4.97, avatar: "MG" },
];

const milestones = [
  { year: "2024", event: "Platform Launch", description: "Started with 500 beta users", icon: Rocket },
  { year: "2024", event: "1,000 Success Stories", description: "First major milestone", icon: Trophy },
  { year: "2025", event: "University Partnerships", description: "50+ universities joined", icon: GraduationCap },
  { year: "2025", event: "Enterprise Launch", description: "Fortune 500 companies onboarded", icon: Building2 },
  { year: "2026", event: "Global Expansion", description: "Available in 30+ countries", icon: Globe },
  { year: "2026", event: "10,000+ Transformations", description: "Lives changed through skills", icon: Heart },
];

const SuccessStoriesPage = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* SECTION 1: HERO */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--court-blue)/0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--skill-green)/0.05),transparent_40%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2 font-mono text-xs text-muted-foreground">
                <Star size={12} /> Real People, Real Transformations
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 font-heading text-5xl font-black text-foreground sm:text-6xl lg:text-7xl">
              Success <span className="text-muted-foreground">Stories</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Discover how thousands of swappers transformed their careers, launched businesses, and achieved their dreams through peer-to-peer skill exchange.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background">
                Share Your Story <ArrowRight size={16} />
              </motion.button>
              <button className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Play size={16} /> Watch Testimonials
              </button>
            </motion.div>

            {/* Hero Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "10,000+", label: "Success Stories", icon: Heart },
                { value: "42%", label: "Avg. Salary Boost", icon: TrendingUp },
                { value: "50+", label: "Industries", icon: Briefcase },
                { value: "94%", label: "Goal Achievement", icon: Target },
              ].map((stat, i) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <stat.icon size={20} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-3xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: FEATURED STORIES CAROUSEL */}
        <section className="py-20 border-t border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full border border-court-blue/20 bg-court-blue/5 px-4 py-1.5 font-mono text-xs text-court-blue">
                <Crown size={12} className="inline mr-1.5 -mt-0.5" /> Featured Transformations
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Life-Changing Journeys</h2>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              {/* Story Selector */}
              <div className="space-y-3">
                {featuredStories.map((story, i) => (
                  <motion.button
                    key={story.id}
                    onClick={() => setActiveStory(i)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-full text-left rounded-2xl border p-5 transition-all ${activeStory === i ? "border-foreground/30 bg-foreground/5" : "border-border bg-card hover:border-foreground/20"}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={story.image} alt={story.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-border" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-bold text-foreground">{story.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{story.beforeRole} → {story.afterRole}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-skill-green/10 px-2 py-0.5 text-[8px] font-semibold text-skill-green">+{story.stats.salaryIncrease}</span>
                          <span className="text-[9px] text-muted-foreground">{story.stats.swaps} swaps</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${activeStory === i ? "rotate-90 text-foreground" : "text-muted-foreground"}`} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Active Story Detail */}
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img src={featuredStories[activeStory].coverImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {featuredStories[activeStory].tags.map(tag => (
                        <span key={tag} className="rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-[10px] font-medium text-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <img src={featuredStories[activeStory].image} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-border" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{featuredStories[activeStory].name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <MapPin size={10} /> {featuredStories[activeStory].location}
                        <span>·</span>
                        <GraduationCap size={10} /> {featuredStories[activeStory].university}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
                    <Quote size={16} className="mb-2 text-court-blue" />
                    <p className="text-sm italic text-foreground">{featuredStories[activeStory].quote}</p>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{featuredStories[activeStory].story}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {featuredStories[activeStory].skills.map(skill => (
                      <span key={skill} className="rounded-full bg-surface-2 px-3 py-1 text-[10px] font-medium text-muted-foreground">{skill}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-surface-1 p-3 text-center">
                      <p className="font-heading text-lg font-bold text-foreground">{featuredStories[activeStory].stats.swaps}</p>
                      <p className="text-[9px] text-muted-foreground">Skill Swaps</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-3 text-center">
                      <p className="font-heading text-lg font-bold text-skill-green">+{featuredStories[activeStory].stats.salaryIncrease}</p>
                      <p className="text-[9px] text-muted-foreground">Salary Increase</p>
                    </div>
                    <div className="rounded-xl bg-surface-1 p-3 text-center">
                      <p className="font-heading text-lg font-bold text-foreground">{featuredStories[activeStory].stats.monthsToTransition || featuredStories[activeStory].stats.teamSize}
                        {featuredStories[activeStory].stats.monthsToTransition ? "mo" : " team"}</p>
                      <p className="text-[9px] text-muted-foreground">{featuredStories[activeStory].stats.monthsToTransition ? "To Transform" : "Team Size"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: TRANSFORMATION STATS */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">The Numbers Speak</h2>
              <p className="mt-2 text-muted-foreground">Real results from our community</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {transformationStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-skill-green/30 transition-colors"
                >
                  <stat.icon size={24} className="mb-3 text-skill-green" />
                  <p className="font-heading text-4xl font-black text-foreground">{stat.value}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: MORE SUCCESS STORIES GRID */}
        <section className="py-20 border-t border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">More Inspiring Journeys</h2>
                <p className="text-sm text-muted-foreground">Every swap tells a story</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-medium text-court-blue hover:underline">
                View All Stories <ArrowRight size={12} />
              </button>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {moreStories.map((story, i) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-all cursor-pointer"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold text-foreground ring-2 ring-border">
                      {story.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{story.name}</h3>
                      <p className="text-[10px] text-skill-green font-medium">{story.role}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-[10px] text-muted-foreground">From: {story.from}</p>
                  <p className="mb-4 text-xs text-muted-foreground italic">"{story.quote}"</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="rounded-full bg-skill-green/10 px-2 py-0.5 font-semibold text-skill-green">+{story.increase}</span>
                    <span className="text-muted-foreground">{story.swaps} swaps</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: VIDEO TESTIMONIALS */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full border border-alert-red/20 bg-alert-red/5 px-4 py-1.5 font-mono text-xs text-alert-red">
                <Video size={12} className="inline mr-1.5 -mt-0.5" /> Video Stories
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground">Hear It From Them</h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-3">
              {videoTestimonials.map((video, i) => (
                <motion.div
                  key={video.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden border border-border cursor-pointer"
                >
                  <img src={video.thumbnail} alt={video.name} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-foreground">
                      <Play size={20} fill="currentColor" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-bold text-white">{video.name}</h3>
                    <p className="text-[10px] text-white/80">{video.role}</p>
                    <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[9px] text-white">{video.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: SKILL JOURNEY PATHS */}
        <section className="py-20 border-t border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">Popular Transformation Paths</h2>
              <p className="mt-2 text-muted-foreground">See how others made the leap</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {skillJourneys.map((journey, i) => (
                <motion.div
                  key={journey.from + journey.to}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-xl bg-surface-2 px-4 py-2 text-xs font-semibold text-muted-foreground">{journey.from}</span>
                    <ArrowRight size={16} className="text-badge-gold" />
                    <span className="rounded-xl bg-skill-green/10 px-4 py-2 text-xs font-semibold text-skill-green">{journey.to}</span>
                  </div>
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users size={12} /> {journey.swappers.toLocaleString()} swappers</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Avg. {journey.avgTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {journey.topSkills.map(skill => (
                      <span key={skill} className="rounded-full bg-surface-2 px-3 py-1 text-[10px] text-muted-foreground">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: INDUSTRY BREAKDOWN */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground text-center">Success by Industry</h2>
              <p className="mt-2 text-center text-muted-foreground">Where our swappers are making impact</p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-3">
                {industryBreakdown.map((ind, i) => (
                  <motion.div
                    key={ind.industry}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onMouseEnter={() => setActiveIndustry(ind.industry)}
                    onMouseLeave={() => setActiveIndustry(null)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${activeIndustry === ind.industry ? "border-foreground/30 bg-card" : "border-border bg-surface-1"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                        <ind.icon size={18} className="text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground">{ind.industry}</span>
                          <span className="font-mono text-sm font-bold text-foreground">{ind.percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${ind.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${ind.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-72 h-72 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-heading text-5xl font-black text-foreground">50+</p>
                      <p className="text-sm text-muted-foreground">Industries</p>
                      <p className="text-xs text-muted-foreground">Represented</p>
                    </div>
                  </div>
                  {industryBreakdown.slice(0, 4).map((ind, i) => {
                    const angle = (i * 90 - 45) * (Math.PI / 180);
                    const x = Math.cos(angle) * 150;
                    const y = Math.sin(angle) * 150;
                    return (
                      <motion.div
                        key={ind.industry}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border shadow-lg"
                        style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
                      >
                        <ind.icon size={18} className="text-foreground" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: UNIVERSITY HIGHLIGHTS */}
        <section className="py-20 border-t border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full border border-skill-green/20 bg-skill-green/5 px-4 py-1.5 font-mono text-xs text-skill-green">
                <GraduationCap size={12} className="inline mr-1.5 -mt-0.5" /> Academic Excellence
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground">University Success Stories</h2>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {universityHighlights.map((uni, i) => (
                <motion.div
                  key={uni.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-skill-green/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-skill-green/10 font-heading text-xl font-black text-skill-green">
                      {uni.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-foreground">{uni.name}</h3>
                      <p className="text-xs text-muted-foreground">Top field: {uni.topField}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-2xl font-bold text-foreground">{uni.stories}</p>
                      <p className="text-[9px] text-muted-foreground">Stories</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: MENTOR SPOTLIGHTS */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">Star Mentors</h2>
              <p className="mt-2 text-muted-foreground">The experts behind the transformations</p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-3">
              {mentorSpotlights.map((mentor, i) => (
                <motion.div
                  key={mentor.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 text-center hover:border-badge-gold/30 transition-colors"
                >
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-badge-gold/10 font-heading text-2xl font-bold text-badge-gold ring-4 ring-badge-gold/20">
                    {mentor.avatar}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{mentor.name}</h3>
                  <p className="text-xs text-muted-foreground">{mentor.title}</p>
                  <span className="mt-2 inline-block rounded-full bg-court-blue/10 px-3 py-1 text-[10px] font-semibold text-court-blue">{mentor.expertise}</span>
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-foreground">{mentor.mentees}</p>
                      <p className="text-[9px] text-muted-foreground">Mentees</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="font-bold text-foreground flex items-center gap-1"><Star size={10} fill="currentColor" className="text-badge-gold" /> {mentor.rating}</p>
                      <p className="text-[9px] text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: PLATFORM MILESTONES TIMELINE */}
        <section className="py-20 border-t border-border bg-surface-1">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">Our Journey</h2>
              <p className="mt-2 text-muted-foreground">Milestones in building a community of learners</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />
              <div className="space-y-8">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.event}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                      <span className="inline-block rounded-full bg-court-blue/10 px-3 py-1 text-xs font-semibold text-court-blue mb-2">{milestone.year}</span>
                      <h3 className="font-heading text-lg font-bold text-foreground">{milestone.event}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-card shadow-lg">
                      <milestone.icon size={20} className="text-court-blue" />
                    </div>
                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11: SUBMIT YOUR STORY CTA */}
        <section className="py-24 border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--badge-gold)/0.1),transparent_70%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-badge-gold/30 bg-badge-gold/10 px-5 py-2 font-mono text-xs text-badge-gold">
                <Heart size={12} fill="currentColor" /> Your Story Matters
              </span>
              <h2 className="mb-4 font-heading text-4xl font-black text-foreground sm:text-5xl">
                Ready to Share Your Journey?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Your transformation could inspire thousands. Submit your success story and join our hall of fame.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-full bg-badge-gold px-8 py-4 text-sm font-semibold text-black">
                  Share My Story <ArrowRight size={16} />
                </motion.button>
                <button className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 12: QUICK TESTIMONIAL WALL */}
        <section className="py-16 border-t border-border bg-surface-1 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">What They're Saying</h2>
          </div>
          <div className="relative">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -1800] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...moreStories, ...moreStories].map((story, i) => (
                <div key={i} className="shrink-0 w-80 rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-bold">{story.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{story.name}</p>
                      <p className="text-[10px] text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{story.quote}"</p>
                  <div className="mt-3 flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={10} fill="currentColor" className="text-badge-gold" />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default SuccessStoriesPage;
