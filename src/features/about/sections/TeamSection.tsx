import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Twitter, ArrowRight } from "lucide-react";

const team = [
  { name: "Alex Chen", role: "Co-Founder & CEO", bio: "Former MIT CS. Obsessed with making education accessible. Built 3 startups before 25.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face", fun: "Can solve a Rubik's cube in 47 seconds." },
  { name: "Sarah Park", role: "Co-Founder & CTO", bio: "Ex-Stripe engineer. Building the skill economy infrastructure from the ground up.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", fun: "Writes Rust for fun on weekends." },
  { name: "David Okafor", role: "Head of Design", bio: "Award-winning designer. Making complexity feel effortlessly simple.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", fun: "Sketches every UI on paper first." },
  { name: "Mia Zhang", role: "Head of Community", bio: "Built communities of 100K+. Knows exactly what students need.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", fun: "Has visited 34 university campuses." },
  { name: "James Miller", role: "Lead Engineer", bio: "Full-stack wizard. Ships production features at an alarming pace.", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face", fun: "Automated his coffee machine with an API." },
  { name: "Lena Kovac", role: "Head of Partnerships", bio: "Connected 50+ universities globally. Expanding to new markets.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", fun: "Speaks 4 languages fluently." },
];

const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-28 px-6 bg-surface-1">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            The Team
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Meet the Humans Behind It</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A small team with a big mission — building the future of skill exchange.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-muted-foreground/20"
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Social overlay */}
                <motion.div
                  className="absolute bottom-3 right-3 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={hoveredIdx === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border cursor-pointer hover:bg-background transition-colors">
                    <Linkedin size={13} className="text-foreground" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border cursor-pointer hover:bg-background transition-colors">
                    <Twitter size={13} className="text-foreground" />
                  </div>
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading text-base font-bold text-foreground">{member.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{member.bio}</p>
                <p className="text-[10px] text-badge-gold/70 italic">✦ {member.fun}</p>
              </div>
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
            href="/careers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
          >
            Join the Team <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
