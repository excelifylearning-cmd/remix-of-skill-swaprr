import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Coins, ChevronRight, ShoppingCart, Star, Shield, Eye } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import GigQuickView from "../components/GigQuickView";
import MarketplacePagination from "../components/MarketplacePagination";
import { type Gig } from "../data/mockData";
import { useAuth } from "@/lib/auth-context";
import LoginPrompt from "@/components/shared/LoginPrompt";

function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; }

export default function SPOnlyPage() {
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
      const { data } = await supabase.from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("status", "active").eq("format", "SP Only")
        .order("created_at", { ascending: false }).limit(200);
      setListings(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / perPage));
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  const toGig = (l: any): Gig => {
    const name = l.profiles?.display_name || l.profiles?.full_name || "User";
    return { id: l.id, skill: l.title, wants: "SP Payment", points: l.points, seller: name, sellerId: l.user_id, elo: l.profiles?.elo || 1000, rating: l.rating, avatar: name.slice(0, 2).toUpperCase(), category: l.category, hot: l.hot, format: l.format, posted: timeAgo(l.created_at), views: l.views, uni: l.profiles?.university || "", verified: l.profiles?.id_verified || false, desc: l.description, deliveryDays: l.delivery_days, completedSwaps: l.profiles?.total_gigs_completed || 0, tags: [] };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
        <div className="border-b border-border bg-badge-gold/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <ChevronRight className="w-3 h-3" /><span className="text-foreground">SP Only</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-badge-gold/10 flex items-center justify-center"><Coins className="w-6 h-6 text-badge-gold" /></div>
              <div>
                <h1 className="font-heading font-black text-3xl text-foreground">SP Only Store</h1>
                <p className="text-sm text-muted-foreground">Purchase skills directly with SkillPoints. No swap required — instant access.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground"><ShoppingCart className="w-3.5 h-3.5 text-badge-gold" /><span>{listings.length} gigs for sale</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center"><p className="text-lg font-heading font-bold text-foreground">No SP-only gigs</p><p className="text-sm text-muted-foreground mt-1">List a gig for SP purchase from your dashboard!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paged.map(l => {
                const tier = eloTier(l.profiles?.elo || 1000);
                const name = l.profiles?.display_name || l.profiles?.full_name || "User";
                return (
                  <motion.div key={l.id} whileHover={{ y: -2 }} className="rounded-2xl border border-badge-gold/20 bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg" onClick={() => { setSelectedGig(toGig(l)); setDrawerOpen(true); }}>
                    <div className="bg-gradient-to-r from-badge-gold/10 to-badge-gold/5 px-5 py-3 flex items-center justify-between">
                      <span className="text-2xl font-mono font-black text-badge-gold">{l.points} SP</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-badge-gold bg-badge-gold/10 px-2 py-1 rounded-lg"><Coins className="w-3 h-3" /> BUY NOW</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-1">{l.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-badge-gold fill-current" />{l.rating}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views}</span>
                        <span>{l.delivery_days}d delivery</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center text-xs font-bold ${tier.color}`}>{name.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <span className="text-xs text-foreground font-semibold flex items-center gap-1">{name} {l.profiles?.id_verified && <Shield className="w-3 h-3 text-skill-green" />}</span>
                            <span className={`text-[10px] ${tier.color}`}>{tier.label}</span>
                          </div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); if (!user) { setLoginOpen(true); return; } setSelectedGig(toGig(l)); setDrawerOpen(true); }}
                          className="h-8 px-4 rounded-lg bg-badge-gold text-background text-xs font-heading font-bold hover:bg-badge-gold/90 transition-colors">
                          Purchase
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
      <LoginPrompt open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
