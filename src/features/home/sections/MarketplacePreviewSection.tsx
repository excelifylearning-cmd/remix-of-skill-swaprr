import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const categories = [
  { label: "Design", icon: Palette },
  { label: "Development", icon: Code },
  { label: "Writing", icon: PenTool },
  { label: "Video", icon: Video },
  { label: "Marketing", icon: BarChart3 },
];

const mockGigs = [
  { skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK" },
  { skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT" },
  { skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR" },
  { skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM" },
  { skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL" },
  { skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP" },
  { skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS" },
  { skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH" },
];

const GigCard = ({ gig }: { gig: (typeof mockGigs)[0] }) => (
  <div className="card-3d group min-w-0 flex-[0_0_300px]">
    <div className="card-3d-inner h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-silver/30">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-silver-accent">
          {gig.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{gig.seller}</p>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-silver">ELO {gig.elo}</span>
            <span className="text-silver/40">·</span>
            <Star size={10} className="fill-badge-gold text-badge-gold" />
            <span className="font-mono text-[10px] text-badge-gold">{gig.rating}</span>
          </div>
        </div>
      </div>

      <div className="mb-3 space-y-2">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-silver">Offering</span>
          <p className="text-sm font-medium text-foreground">{gig.skill}</p>
        </div>
        <div className="rounded-lg border border-dashed border-border px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-silver">Wants</span>
          <p className="text-sm font-medium text-silver-accent">{gig.wants}</p>
        </div>
      </div>

      {gig.points > 0 && (
        <div className="flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1 text-xs font-semibold text-skill-green">
          <TrendingUp size={12} />
          +{gig.points} SP to balance
        </div>
      )}
      {gig.points === 0 && (
        <div className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-silver">
          Equal value exchange
        </div>
      )}
    </div>
  </div>
);

const MarketplacePreviewSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    containScroll: false,
  });
  const animationRef = useRef<number>();

  const autoScroll = useCallback(() => {
    if (!emblaApi) return;
    if (!emblaApi.canScrollNext()) {
      emblaApi.scrollTo(0);
    }
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(autoScroll, 3000);
    emblaApi.on("pointerDown", () => clearInterval(interval));
    return () => clearInterval(interval);
  }, [emblaApi, autoScroll]);

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Live Marketplace
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Real gigs happening right now. Find your perfect skill exchange.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-2 text-sm text-silver transition-all hover:border-silver/40 hover:text-foreground"
            >
              <cat.icon size={14} />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {[...mockGigs, ...mockGigs].map((gig, i) => (
                <GigCard key={i} gig={gig} />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <motion.a
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-silver-accent transition-all hover:border-silver hover:text-foreground"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Browse Full Marketplace
            <span className="text-silver">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplacePreviewSection;
