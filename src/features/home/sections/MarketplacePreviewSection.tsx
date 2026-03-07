import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Palette, Code, PenTool, Video, BarChart3, ArrowRight, Clock, Eye, Flame } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

const categories = [
  { label: "Design", icon: Palette },
  { label: "Development", icon: Code },
  { label: "Writing", icon: PenTool },
  { label: "Video", icon: Video },
  { label: "Marketing", icon: BarChart3 },
];

const mockGigs = [
  { skill: "Logo Design", wants: "React Development", points: 30, seller: "Maya K.", elo: 1450, rating: 4.9, avatar: "MK", hot: true, posted: "2h", views: 124 },
  { skill: "Python Backend", wants: "UI/UX Design", points: 0, seller: "James T.", elo: 1680, rating: 5.0, avatar: "JT", hot: false, posted: "4h", views: 89 },
  { skill: "Video Editing", wants: "Copywriting", points: 15, seller: "Aisha R.", elo: 1320, rating: 4.7, avatar: "AR", hot: false, posted: "6h", views: 67 },
  { skill: "3D Modeling", wants: "Mobile App Dev", points: 45, seller: "Carlos M.", elo: 1550, rating: 4.8, avatar: "CM", hot: true, posted: "1h", views: 203 },
  { skill: "SEO Strategy", wants: "Graphic Design", points: 10, seller: "Emma L.", elo: 1400, rating: 4.6, avatar: "EL", hot: false, posted: "8h", views: 45 },
  { skill: "Data Analysis", wants: "Brand Identity", points: 25, seller: "Raj P.", elo: 1720, rating: 5.0, avatar: "RP", hot: true, posted: "30m", views: 312 },
  { skill: "Illustration", wants: "WordPress Dev", points: 20, seller: "Lena S.", elo: 1380, rating: 4.8, avatar: "LS", hot: false, posted: "12h", views: 78 },
  { skill: "Motion Graphics", wants: "Backend API", points: 35, seller: "Omar H.", elo: 1600, rating: 4.9, avatar: "OH", hot: false, posted: "3h", views: 156 },
  { skill: "React Native App", wants: "UI Design", points: 50, seller: "Chen L.", elo: 1750, rating: 5.0, avatar: "CL", hot: true, posted: "15m", views: 445 },
  { skill: "Game Design", wants: "Sound Design", points: 30, seller: "Alex F.", elo: 1490, rating: 4.8, avatar: "AF", hot: true, posted: "2h", views: 178 },
];

const GigCard = ({ gig }: { gig: (typeof mockGigs)[0] }) => (
  <div className="card-3d group min-w-0 flex-[0_0_300px]">
    <div className="card-3d-inner h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_0_20px_hsl(var(--silver)/0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold text-foreground">
          {gig.avatar}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{gig.seller}</p>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">ELO {gig.elo}</span>
            <span className="text-muted-foreground/40">·</span>
            <Star size={10} className="fill-badge-gold text-badge-gold" />
            <span className="font-mono text-[10px] text-badge-gold">{gig.rating}</span>
          </div>
        </div>
        {gig.hot && <Flame size={14} className="text-alert-red" />}
      </div>

      <div className="mb-3 space-y-2">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Offering</span>
          <p className="text-sm font-medium text-foreground">{gig.skill}</p>
        </div>
        <div className="rounded-lg border border-dashed border-border px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Wants</span>
          <p className="text-sm font-medium text-foreground/80">{gig.wants}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Clock size={10} /> {gig.posted} ago</span>
        <span className="flex items-center gap-1"><Eye size={10} /> {gig.views}</span>
      </div>

      {gig.points > 0 ? (
        <div className="flex items-center gap-1.5 rounded-full bg-skill-green/10 px-3 py-1 text-xs font-semibold text-skill-green">
          <TrendingUp size={12} />
          +{gig.points} SP to balance
        </div>
      ) : (
        <div className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground">
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

  const autoScroll = useCallback(() => {
    if (!emblaApi) return;
    if (!emblaApi.canScrollNext()) emblaApi.scrollTo(0);
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
          <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Live Activity
          </span>
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Live Marketplace
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Real gigs happening right now. Find your perfect skill exchange.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap justify-center gap-8"
        >
          {[
            { label: "Active Gigs", value: "240+" },
            { label: "Online Now", value: "1.2K" },
            { label: "Avg Response", value: "< 5min" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
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
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-shadow hover:shadow-[0_0_20px_hsl(var(--silver)/0.2)]"
          >
            Browse Full Marketplace
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplacePreviewSection;
