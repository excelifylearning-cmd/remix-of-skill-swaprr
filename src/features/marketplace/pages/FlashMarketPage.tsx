import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ChevronRight, Clock, Flame, Shield, Star } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import GigQuickView from "../components/GigQuickView";
import MarketplacePagination from "../components/MarketplacePagination";
import { type Gig } from "../data/mockData";

function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; }

export default function FlashMarketPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("status", "active").eq("format", "Flash Market")
        .order("created_at", { ascending: false }).limit(200);
      setListings(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / perPage));
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  const toGig = (l: any): Gig => {
    const name = l.profiles?.display_name || l.profiles?.full_name || "User";
    return { id: l.id, skill: l.title, wants: l.wants || "Quick delivery", points: l.points, seller: name, sellerId: l.user_id, elo: l.profiles?.elo || 1000, rating: l.rating, avatar: name.slice(0, 2).toUpperCase(), category: l.category, hot: l.hot, format: l.format, posted: timeAgo(l.created_at), views: l.views, uni: l.profiles?.university || "", verified: l.profiles?.id_verified || false, desc: l.description, deliveryDays: l.delivery_days, completedSwaps: l.profiles?.total_gigs_completed || 0, endsIn: l.ends_at ? Math.max(0, Math.floor((new Date(l.ends_at).getTime() - Date.now()) / 60000)) : undefined, tags: [] };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
        <div className="border-b border-border bg-gradient-to-r from-badge-gold/10 to-alert-red/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <ChevronRight className="w-3 h-3" /><span className="text-foreground">Flash Market</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-badge-gold/10 flex items-center justify-center"><Zap className="w-6 h-6 text-badge-gold" /></div>
              <div>
                <h1 className="font-heading font-black text-3xl text-foreground">Flash Market ⚡</h1>
                <p className="text-sm text-muted-foreground">Time-limited gigs with <span className="text-badge-gold font-bold">2.5x SP multiplier</span>. Act fast — these expire!</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground"><Flame className="w-3.5 h-3.5 text-alert-red" /><span>{listings.length} flash deals live</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center"><p className="text-lg font-heading font-bold text-foreground">No flash deals right now</p><p className="text-sm text-muted-foreground mt-1">Flash gigs appear here when sellers offer time-limited deals with bonus SP!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paged.map(l => {
                const tier = eloTier(l.profiles?.elo || 1000);
                const name = l.profiles?.display_name || l.profiles?.full_name || "User";
                const endsIn = l.ends_at ? Math.max(0, Math.floor((new Date(l.ends_at).getTime() - Date.now()) / 60000)) : null;
                const multiplied = Math.round(l.points * 2.5);
                return (
                  <motion.div key={l.id} whileHover={{ y: -2 }} className="rounded-2xl border-2 border-badge-gold/30 bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg relative" onClick={() => { setSelectedGig(toGig(l)); setDrawerOpen(true); }}>
                    {/* Urgency banner */}
                    <div className="bg-gradient-to-r from-badge-gold to-alert-red px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-heading font-bold text-background flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> FLASH DEAL</span>
                      {endsIn !== null && (
                        <span className="text-xs font-mono font-bold text-background flex items-center gap-1"><Clock className="w-3 h-3" /> {endsIn > 60 ? `${Math.floor(endsIn / 60)}h ${endsIn % 60}m` : `${endsIn}m left`}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-1">{l.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.description}</p>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-lg bg-badge-gold/10 px-3 py-2 text-center">
                          <p className="text-lg font-mono font-black text-badge-gold">{multiplied} SP</p>
                          <p className="text-[9px] text-muted-foreground">2.5x VALUE</p>
                        </div>
                        <div className="rounded-lg bg-surface-1 px-3 py-2 text-center">
                          <p className="text-sm font-mono text-muted-foreground line-through">{l.points} SP</p>
                          <p className="text-[9px] text-muted-foreground">BASE</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center text-xs font-bold ${tier.color}`}>{name.slice(0, 2).toUpperCase()}</div>
                          <span className="text-xs text-foreground font-semibold flex items-center gap-1">{name} {l.profiles?.id_verified && <Shield className="w-3 h-3 text-skill-green" />}</span>
                        </div>
                        <button className="h-8 px-4 rounded-lg bg-gradient-to-r from-badge-gold to-alert-red text-background text-xs font-heading font-bold hover:opacity-90 transition-opacity">
                          Grab Deal
                        </button>
                      </div>
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
    </div>
  );
}
