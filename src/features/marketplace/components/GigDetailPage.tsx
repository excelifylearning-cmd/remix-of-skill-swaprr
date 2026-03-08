import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Shield, Clock, Eye, ArrowRight, Heart, Share2, Bookmark,
  MessageSquare, Flag, GraduationCap, CheckCircle2, Trophy, ChevronRight,
} from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { gigs as mockGigs } from "../data/mockData";
import { eloTier, formatIcon, formatColor } from "../utils/marketplace-utils";
import UserPreviewPopover from "./UserPreviewPopover";
import GuildPreviewPopover from "./GuildPreviewPopover";
import GigCard from "./GigCard";
import ProposalModal from "./ProposalModal";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { useAuth } from "@/lib/auth-context";

const deliveryStages = [
  { stage: "Requirements Review", days: 1 },
  { stage: "Initial Draft", days: 2 },
  { stage: "Revision Round", days: 1 },
  { stage: "Final Delivery", days: 1 },
];

export default function GigDetailPage() {
  const { gigId } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Try DB first, fallback to mock
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Try UUID lookup
      const { data: dbListing } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("id", gigId!)
        .single();

      if (dbListing) {
        setListing(dbListing);
        setSellerProfile(dbListing.profiles);
        // Load reviews for this seller
        const { data: revs } = await (supabase as any)
          .from("reviews")
          .select("*")
          .eq("reviewee_id", dbListing.user_id)
          .order("created_at", { ascending: false })
          .limit(5);
        setReviews(revs || []);
      } else {
        // Fallback to mock
        const mock = mockGigs.find(g => g.id === Number(gigId));
        if (mock) {
          setListing({
            id: mock.id, title: mock.skill, description: mock.desc, wants: mock.wants,
            category: mock.category, format: mock.format, points: mock.points,
            delivery_days: mock.deliveryDays, views: mock.views, hot: mock.hot,
            rating: mock.rating, user_id: mock.sellerId || "mock", price: `${mock.points} SP`,
            _mock: true, _gig: mock,
          });
          setSellerProfile({
            display_name: mock.seller, full_name: mock.seller, elo: mock.elo,
            id_verified: mock.verified, university: mock.uni,
            total_gigs_completed: mock.completedSwaps,
          });
          setReviews([
            { reviewer_name: "Alice M.", overall_rating: 5, comment: "Excellent work, delivered early!", created_at: "2026-02-20" },
            { reviewer_name: "Bob R.", overall_rating: 5, comment: "Very professional.", created_at: "2026-02-10" },
            { reviewer_name: "Sara K.", overall_rating: 4, comment: "Good quality, solid work.", created_at: "2026-01-25" },
          ]);
        }
      }
      setLoading(false);
    };
    if (gigId) load();
  }, [gigId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!listing) {
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

  const elo = sellerProfile?.elo || 1000;
  const tier = eloTier(elo);
  const FormatIcon = formatIcon(listing.format || "Direct Swap");
  const fColor = formatColor(listing.format || "Direct Swap");
  const sellerName = sellerProfile?.display_name || sellerProfile?.full_name || "User";
  const initials = sellerName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const handlePropose = () => {
    if (!user) { setLoginOpen(true); return; }
    setProposalOpen(true);
  };

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
          <span className="text-foreground">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex items-center gap-1 text-xs font-mono ${fColor} bg-surface-2 px-2.5 py-1 rounded-lg`}>
                  <FormatIcon className="w-3.5 h-3.5" />{listing.format}
                </span>
                {listing.hot && <span className="text-xs font-mono text-alert-red bg-alert-red/10 px-2 py-1 rounded-lg">🔥 Trending</span>}
              </div>
              <h1 className="font-heading font-black text-3xl text-foreground">{listing.title}</h1>
              {listing.wants && (
                <p className="text-base text-muted-foreground mt-2 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" /> Looking for: <span className="text-foreground font-heading font-semibold">{listing.wants}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">About This Gig</h3>
              <p className="text-foreground/90 leading-relaxed">{listing.description}</p>
            </div>

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
                Reviews ({reviews.length})
              </h3>
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-1 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-heading font-semibold text-foreground">{r.reviewer_name || "User"}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.overall_rating || 5 }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-badge-gold fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.comment}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No reviews yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Seller card */}
              <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-5 ${tier.glow}`}>
                <Link to={`/profile/${listing.user_id}`} className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl border ${tier.border} ${tier.bg} flex items-center justify-center font-heading font-bold text-lg ${tier.color}`}>
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-foreground text-lg">{sellerName}</span>
                      {sellerProfile?.id_verified && <Shield className="w-4 h-4 text-skill-green" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-mono font-medium ${tier.color}`}>{tier.label} · {elo}</span>
                      <span className="flex items-center gap-0.5 text-xs text-badge-gold">
                        <Star className="w-3 h-3 fill-current" />{listing.rating || 4.5}
                      </span>
                    </div>
                    {sellerProfile?.university && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <GraduationCap className="w-3 h-3" />{sellerProfile.university}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  {sellerProfile?.total_gigs_completed || 0} completed swaps
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Delivery", value: `${listing.delivery_days || 7}d`, icon: Clock },
                  { label: "Views", value: `${listing.views || 0}`, icon: Eye },
                  { label: "Swaps", value: `${sellerProfile?.total_gigs_completed || 0}`, icon: CheckCircle2 },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-surface-1 border border-border p-3 text-center">
                    <s.icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm font-mono font-bold text-foreground">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-mono">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* SP bonus */}
              {listing.points > 0 && (
                <div className="rounded-xl bg-skill-green/5 border border-skill-green/20 p-4 text-center">
                  <p className="text-2xl font-mono font-bold text-skill-green">+{listing.points} SP</p>
                  <p className="text-xs text-muted-foreground mt-1">Bonus SkillPoints</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handlePropose}
                  className="w-full h-12 rounded-xl bg-foreground text-background font-heading font-bold text-sm hover:bg-foreground/90 transition-colors"
                >
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

              <button className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-alert-red transition-colors">
                <Flag className="w-3 h-3" />Report this listing
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proposal Modal */}
      {proposalOpen && (
        <ProposalModal
          listing={{
            id: String(listing.id),
            title: listing.title,
            user_id: listing.user_id,
            points: listing.points || 0,
            price: listing.price || `${listing.points} SP`,
          }}
          onClose={() => setProposalOpen(false)}
        />
      )}

      <LoginPrompt open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
