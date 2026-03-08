import { X, Star, Shield, Clock, Eye, ArrowRight, Heart, Share2, Bookmark, MessageSquare, Flag, GraduationCap, CheckCircle2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { type Gig } from "../data/mockData";
import { eloTier, formatIcon, formatColor } from "../utils/marketplace-utils";
import UserPreviewPopover from "./UserPreviewPopover";
import GuildPreviewPopover from "./GuildPreviewPopover";

interface Props {
  gig: Gig | null;
  open: boolean;
  onClose: () => void;
}

export default function GigQuickView({ gig, open, onClose }: Props) {
  if (!gig) return null;

  const tier = eloTier(gig.elo);
  const FormatIcon = formatIcon(gig.format);
  const fColor = formatColor(gig.format);

  const mockReviews = [
    { name: "Alice M.", rating: 5, text: "Excellent work, delivered early with great communication.", time: "2 weeks ago" },
    { name: "Bob R.", rating: 5, text: "Very professional. Would swap again.", time: "1 month ago" },
    { name: "Sara K.", rating: 4, text: "Good quality, needed one revision but overall solid.", time: "1 month ago" },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-card border-l border-border z-50 transform transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      } overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-card/90 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-[10px] font-mono ${fColor} bg-surface-2 px-2 py-0.5 rounded-md`}>
              <FormatIcon className="w-3 h-3" />{gig.format}
            </span>
            {gig.hot && <span className="text-[10px] font-mono text-alert-red bg-alert-red/10 px-1.5 py-0.5 rounded-md">🔥 HOT</span>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="font-heading font-bold text-foreground text-xl leading-tight">{gig.skill}</h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" /> Wants: <span className="text-foreground font-medium">{gig.wants}</span>
            </p>
          </div>

          {/* Seller card */}
          <div className={`rounded-xl border ${tier.border} ${tier.bg} p-4`}>
            <UserPreviewPopover
              name={gig.seller} avatar={gig.avatar} elo={gig.elo} rating={gig.rating}
              verified={gig.verified} uni={gig.uni} completedSwaps={gig.completedSwaps} skills={gig.tags}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center font-heading font-bold text-base ${tier.color}`}>
                  {gig.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-foreground">{gig.seller}</span>
                    {gig.verified && <Shield className="w-4 h-4 text-skill-green" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-mono font-medium ${tier.color}`}>{tier.label} · {gig.elo}</span>
                    <span className="flex items-center gap-0.5 text-xs text-badge-gold">
                      <Star className="w-3 h-3 fill-current" />{gig.rating}
                    </span>
                    {gig.uni && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <GraduationCap className="w-3 h-3" />{gig.uni}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </UserPreviewPopover>
            {gig.guildName && gig.guildId && (
              <GuildPreviewPopover guildName={gig.guildName} guildId={gig.guildId}>
                <span className="inline-flex items-center gap-1 mt-2 text-xs text-badge-gold cursor-pointer hover:underline">
                  <Trophy className="w-3 h-3" />{gig.guildName}
                </span>
              </GuildPreviewPopover>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Description</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{gig.desc}</p>
          </div>

          {/* Requirements */}
          {gig.requirements && gig.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Requirements</h4>
              <div className="space-y-1.5">
                {gig.requirements.map(r => (
                  <div key={r} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-skill-green mt-0.5 flex-shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Delivery", value: `${gig.deliveryDays} days`, icon: Clock },
              { label: "Views", value: gig.views.toString(), icon: Eye },
              { label: "Swaps", value: gig.completedSwaps.toString(), icon: CheckCircle2 },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-surface-1 border border-border p-3 text-center">
                <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-mono font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">{s.label}</p>
              </div>
            ))}
          </div>

          {/* SP Info */}
          {gig.points > 0 && (
            <div className="rounded-xl bg-skill-green/5 border border-skill-green/20 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">SP Bonus</p>
                <p className="text-xl font-mono font-bold text-skill-green">+{gig.points} SP</p>
              </div>
              <p className="text-xs text-muted-foreground max-w-[200px]">Additional SkillPoints included with this swap</p>
            </div>
          )}

          {/* Tags */}
          {gig.tags && (
            <div className="flex flex-wrap gap-1.5">
              {gig.tags.map(t => (
                <span key={t} className="px-2.5 py-1 bg-surface-2 text-muted-foreground text-xs font-mono rounded-lg">{t}</span>
              ))}
            </div>
          )}

          {/* Reviews preview */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Recent Reviews</h4>
            <div className="space-y-3">
              {mockReviews.map(r => (
                <div key={r.name} className="rounded-xl bg-surface-1 border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-semibold text-foreground">{r.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-badge-gold fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.text}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{r.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pb-6">
            <button className="w-full h-12 rounded-xl bg-foreground text-background font-heading font-bold text-sm hover:bg-foreground/90 transition-colors">
              Propose Swap
            </button>
            <div className="flex gap-2">
              <button className="flex-1 h-10 rounded-xl border border-border text-foreground text-xs font-heading font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />Like
              </button>
              <button className="flex-1 h-10 rounded-xl border border-border text-foreground text-xs font-heading font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />Save
              </button>
              <button className="flex-1 h-10 rounded-xl border border-border text-foreground text-xs font-heading font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />Share
              </button>
            </div>
            <Link
              to={`/marketplace/${gig.id}`}
              className="w-full h-10 rounded-xl border border-foreground/20 text-foreground text-xs font-heading font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
            >
              View Full Gig Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-alert-red transition-colors">
              <Flag className="w-3 h-3" />Report this listing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
