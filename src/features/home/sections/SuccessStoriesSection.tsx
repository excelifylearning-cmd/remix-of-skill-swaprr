import { motion } from "framer-motion";
import { Quote, ArrowRight, Star } from "lucide-react";

const featuredStory = {
  name: "Sofia Chen",
  university: "Stanford University",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  quote: "I designed 12 logos and got a complete portfolio website, a mobile app prototype, and SEO strategy in return. No money spent — just skill points and great work.",
  skillsGained: ["React", "Mobile Design", "SEO"],
  gigsCompleted: 47,
  pointsEarned: 3200,
  elo: 1720,
};

const stories = [
  {
    name: "Marcus Johnson",
    university: "MIT",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "Guild Wars got my team competing and improving. Our guild's ELO jumped 300 points in two months.",
    skill: "Backend Development",
    rating: 5.0,
  },
  {
    name: "Priya Sharma",
    university: "IIT Delhi",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
    quote: "The co-creation studio let me work with 4 people across 3 countries to build a complete SaaS product.",
    skill: "Product Design",
    rating: 4.9,
  },
  {
    name: "Thomas Berg",
    university: "ETH Zürich",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote: "Skill Court judging earned me expert status and 500 bonus points. The weighted voting system is genuinely fair.",
    skill: "Data Science",
    rating: 4.8,
  },
];

const SuccessStoriesSection = () => {
  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Real Students. Real Swaps.
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Hear from students who traded skills and built something incredible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="grid gap-0 lg:grid-cols-5">
            <div className="p-8 lg:col-span-3 lg:p-10">
              <Quote size={28} className="mb-4 text-silver/30" />
              <p className="mb-6 font-heading text-xl font-medium leading-relaxed text-foreground lg:text-2xl">
                "{featuredStory.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={featuredStory.photo}
                  alt={featuredStory.name}
                  className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div>
                  <p className="font-heading font-semibold text-foreground">{featuredStory.name}</p>
                  <p className="text-sm text-silver">{featuredStory.university}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-surface-2/30 p-8 lg:col-span-2 lg:border-l lg:border-t-0">
              <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-silver">Impact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-heading text-2xl font-bold text-foreground">{featuredStory.gigsCompleted}</span>
                  <p className="text-xs text-silver">Gigs Done</p>
                </div>
                <div>
                  <span className="font-heading text-2xl font-bold text-skill-green">{featuredStory.pointsEarned.toLocaleString()}</span>
                  <p className="text-xs text-silver">Points Earned</p>
                </div>
                <div>
                  <span className="font-heading text-2xl font-bold text-foreground">{featuredStory.elo}</span>
                  <p className="text-xs text-silver">ELO Rating</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1">
                    {featuredStory.skillsGained.map((s) => (
                      <span key={s} className="rounded bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-silver-accent">{s}</span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-silver">Skills Gained</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-silver/30"
            >
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={story.photo}
                  alt={story.name}
                  className="h-10 w-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{story.name}</p>
                  <p className="text-xs text-silver">{story.university}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star size={12} className="fill-badge-gold text-badge-gold" />
                  <span className="font-mono text-xs text-badge-gold">{story.rating}</span>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-silver">"{story.quote}"</p>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-silver">{story.skill}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <motion.a
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-silver-accent transition-colors hover:text-foreground"
            whileHover={{ x: 5 }}
          >
            Read more stories <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
