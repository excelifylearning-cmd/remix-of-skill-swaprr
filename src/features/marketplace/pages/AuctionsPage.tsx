import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gavel, ArrowLeft, Clock, Flame, TrendingUp, ChevronRight } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import GigQuickView from "../components/GigQuickView";
import MarketplacePagination from "../components/MarketplacePagination";
import { type Gig } from "../data/mockData";
import { useAuth } from "@/lib/auth-context";
import LoginPrompt from "@/components/shared/LoginPrompt";

function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; }

export default function AuctionsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("status", "active").eq("format", "Auction")
        .order("created_at", { ascending: false }).limit(200);
      setListings(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / perPage));
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  const toGig = (l: any): Gig => {
    const name = l.profiles?.display_name || l.profiles?.full_name || "User";
    return { id: l.id, skill: l.title, wants: l.wants || "Open", points: l.points, seller: name, sellerId: l.user_id, elo: l.profiles?.elo || 1000, rating: l.rating, avatar: name.slice(0, 2).toUpperCase(), category: l.category, hot: l.hot, format: l.format, posted: timeAgo(l.created_at), views: l.views, uni: l.profiles?.university || "", verified: l.profiles?.id_verified || false, desc: l.description, deliveryDays: l.delivery_days, completedSwaps: l.profiles?.total_gigs_completed || 0, currentBid: l.current_bid, bidCount: l.bid_count, endsIn: l.ends_at ? Math.max(0, Math.floor((new Date(l.ends_at).getTime() - Date.now()) / 60000)) : undefined, tags: [] };
  };

  const handleBid = (l: any) => {
    if (!user) { setLoginOpen(true); return; }
    const g = toGig(l);
    setSelectedGig(g);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-alert-red/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">Auctions</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-alert-red/10 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-alert-red" />
              </div>
              <div>
                <h1 className="font-heading font-black text-3xl text-foreground">Live Auctions</h1>
                <p className="text-sm text-muted-foreground">Bid on skills in real-time. Highest bidder wins the gig.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-alert-red" />
                <span>{listings.length} live auctions</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-skill-green" />
                <span>{listings.reduce((s, l) => s + (l.bid_count || 0), 0)} total bids</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-heading font-bold text-foreground">No live auctions</p>
              <p className="text-sm text-muted-foreground mt-1">Check back soon or create one from your dashboard!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paged.map(l => {
                const tier = eloTier(l.profiles?.elo || 1000);
                const endsIn = l.ends_at ? Math.max(0, Math.floor((new Date(l.ends_at).getTime() - Date.now()) / 60000)) : null;
                const name = l.profiles?.display_name || l.profiles?.full_name || "User";
                return (
                  <motion.div key={l.id} whileHover={{ y: -2 }} className={`rounded-2xl border border-alert-red/20 bg-card p-5 cursor-pointer transition-shadow hover:shadow-lg`} onClick={() => handleBid(l)}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-alert-red bg-alert-red/10 px-2 py-1 rounded-lg">
                        <Gavel className="w-3 h-3" /> AUCTION
                        {l.hot && <span className="ml-1">🔥</span>}
                      </span>
                      {endsIn !== null && (
                        <span className="flex items-center gap-1 text-xs font-mono text-badge-gold">
                          <Clock className="w-3 h-3" /> {endsIn > 60 ? `${Math.floor(endsIn / 60)}h ${endsIn % 60}m` : `${endsIn}m`}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-1">{l.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{l.description}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="rounded-lg bg-surface-1 p-2 text-center">
                        <p className="text-lg font-mono font-bold text-alert-red">{l.current_bid || l.points} SP</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Current Bid</p>
                      </div>
                      <div className="rounded-lg bg-surface-1 p-2 text-center">
                        <p className="text-lg font-mono font-bold text-foreground">{l.bid_count || 0}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Bids</p>
                      </div>
                      <div className="rounded-lg bg-surface-1 p-2 text-center">
                        <p className="text-lg font-mono font-bold text-foreground">{l.points} SP</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Starting</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center text-xs font-bold ${tier.color}`}>
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs text-muted-foreground">{name}</span>
                      </div>
                      <button className="h-8 px-4 rounded-lg bg-alert-red text-white text-xs font-heading font-bold hover:bg-alert-red/90 transition-colors">
                        Place Bid
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <MarketplacePagination page={page} totalPages={totalPages} totalResults={listings.length} onPageChange={setPage} />
        </div>
      </motion.div>
      <GigQuickView gig={selectedGig} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <LoginPrompt open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
