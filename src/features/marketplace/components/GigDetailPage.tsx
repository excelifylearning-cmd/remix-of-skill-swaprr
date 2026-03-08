import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Shield, Clock, Eye, ArrowRight, Heart, Share2, Bookmark,
  MessageSquare, Flag, GraduationCap, CheckCircle2, Trophy, ChevronRight,
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { gigs } from "../data/mockData";
import { eloTier, formatIcon, formatColor } from "../utils/marketplace-utils";
import UserPreviewPopover from "./UserPreviewPopover";
import GuildPreviewPopover from "./GuildPreviewPopover";
import GigCard from "./GigCard";

const mockReviews = [
  { name: "Alice M.", rating: 5, text: "Excellent work, delivered early with great communication. Would definitely swap again!", time: "2 weeks ago" },
  { name: "Bob R.", rating: 5, text: "Very professional. The quality exceeded my expectations.", time: "1 month ago" },
  { name: "Sara K.", rating: 4, text: "Good quality, needed one revision but overall solid work.", time: "1 month ago" },
  { name: "Dev T.", rating: 5, text: "Fast turnaround, great attention to detail. Highly recommended.", time: "2 months ago" },
];

const deliveryStages = [
  { stage: "Requirements Review", days: 1 },
  { stage: "Initial Draft", days: 2 },
  { stage: "Revision Round", days: 1 },
  { stage: "Final Delivery", days: 1 },
];

export default function GigDetailPage() {
  const { gigId } = useParams();
  const gig = gigs.find(g => g.id === Number(gigId));

  if (!gig) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-lg font-heading font-bold text-foreground">Gig not found</p>
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tier = eloTier(gig.elo);
  const FormatIcon = formatIcon(gig.format);
  const fColor = formatColor(gig.format);
  const relatedGigs = gigs.filter(g => g.category === gig.category && g.id !== gig.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{gig.skill}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex items-center gap-1 text-xs font-mono ${fColor} bg-surface-2 px-2.5 py-1 rounded-lg`}>
                  <FormatIcon className="w-3.5 h-3.5" />{gig.format}
                </span>
                {gig.hot && <span className="text-xs font-mono text-alert-red bg-alert-red/10 px-2 py-1 rounded-lg">🔥 Trending</span>}
                <span className="text-xs text-muted-foreground font-mono ml-auto">Posted {gig.posted}</span>
              </div>
              <h1 className="font-heading font-black text-3xl text-foreground">{gig.skill}</h1>
              <p className="text-base text-muted-foreground mt-2 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> Looking for: <span className="text-foreground font-heading font-semibold">{gig.wants}</span>
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">About This Gig</h3>
              <p className="text-foreground/90 leading-relaxed">{gig.desc}</p>
              <p className="text-foreground/80 leading-relaxed mt-3">
                This gig includes detailed project scoping, regular progress updates, and multiple revision rounds
                to ensure your complete satisfaction. Communication throughout the process is a priority.
              </p>
            </div>

            {/* Requirements */}
            {gig.requirements && gig.requirements.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Requirements</h3>
                <div className="space-y-2">
                  {gig.requirements.map(r => (
                    <div key={r} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-1 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-skill-green mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Stages */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Delivery Timeline</h3>
              <div className="space-y-2">
                {deliveryStages.map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-mono font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{s.stage}</span>
                    <span className="text-xs font-mono text-muted-foreground">{s.days} day{s.days > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                Reviews ({mockReviews.length})
              </h3>
              <div className="space-y-3">
                {mockReviews.map(r => (
                  <div key={r.name} className="p-4 rounded-xl bg-surface-1 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-heading font-semibold text-foreground">{r.name}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-badge-gold fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.text}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{r.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related gigs */}
            {relatedGigs.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Related Gigs</h3>
                <div className="grid grid-cols-2 gap-4">
                  {relatedGigs.map(g => (
                    <GigCard key={g.id} gig={g} viewMode="grid" onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Seller card */}
              <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-5 ${tier.glow}`}>
                <UserPreviewPopover
                  name={gig.seller} avatar={gig.avatar} elo={gig.elo} rating={gig.rating}
                  verified={gig.verified} uni={gig.uni} completedSwaps={gig.completedSwaps} skills={gig.tags}
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-14 h-14 rounded-xl border ${tier.border} ${tier.bg} flex items-center justify-center font-heading font-bold text-lg ${tier.color}`}>
                      {gig.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-bold text-foreground text-lg">{gig.seller}</span>
                        {gig.verified && <Shield className="w-4 h-4 text-skill-green" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-mono font-medium ${tier.color}`}>{tier.label} · {gig.elo}</span>
                        <span className="flex items-center gap-0.5 text-xs text-badge-gold">
                          <Star className="w-3 h-3 fill-current" />{gig.rating}
                        </span>
                      </div>
                      {gig.uni && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <GraduationCap className="w-3 h-3" />{gig.uni}
                        </span>
                      )}
                    </div>
                  </div>
                </UserPreviewPopover>

                {gig.guildName && gig.guildId && (
                  <GuildPreviewPopover guildName={gig.guildName} guildId={gig.guildId}>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs text-badge-gold cursor-pointer hover:underline">
                      <Trophy className="w-3 h-3" />{gig.guildName}
                    </span>
                  </GuildPreviewPopover>
                )}

                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  {gig.completedSwaps} completed swaps
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Delivery", value: `${gig.deliveryDays}d`, icon: Clock },
                  { label: "Views", value: `${gig.views}`, icon: Eye },
                  { label: "Swaps", value: `${gig.completedSwaps}`, icon: CheckCircle2 },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-surface-1 border border-border p-3 text-center">
                    <s.icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm font-mono font-bold text-foreground">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-mono">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* SP bonus */}
              {gig.points > 0 && (
                <div className="rounded-xl bg-skill-green/5 border border-skill-green/20 p-4 text-center">
                  <p className="text-2xl font-mono font-bold text-skill-green">+{gig.points} SP</p>
                  <p className="text-xs text-muted-foreground mt-1">Bonus SkillPoints</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full h-12 rounded-xl bg-foreground text-background font-heading font-bold text-sm hover:bg-foreground/90 transition-colors">
                  Propose Swap
                </button>
                <button className="w-full h-10 rounded-xl border border-border text-foreground text-xs font-heading font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />Message Seller
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 h-9 rounded-lg border border-border text-muted-foreground text-xs hover:text-foreground hover:bg-surface-2 transition-colors flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5" />Like
                  </button>
                  <button className="flex-1 h-9 rounded-lg border border-border text-muted-foreground text-xs hover:text-foreground hover:bg-surface-2 transition-colors flex items-center justify-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" />Save
                  </button>
                  <button className="flex-1 h-9 rounded-lg border border-border text-muted-foreground text-xs hover:text-foreground hover:bg-surface-2 transition-colors flex items-center justify-center gap-1">
                    <Share2 className="w-3.5 h-3.5" />Share
                  </button>
                </div>
              </div>

              {/* Tags */}
              {gig.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {gig.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-surface-2 text-muted-foreground text-[10px] font-mono rounded-md">{t}</span>
                  ))}
                </div>
              )}

              <button className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-alert-red transition-colors">
                <Flag className="w-3 h-3" />Report this listing
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
