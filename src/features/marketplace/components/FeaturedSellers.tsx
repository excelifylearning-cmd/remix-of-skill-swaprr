import { useState, useEffect } from "react";
import { Star, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import UserPreviewPopover from "./UserPreviewPopover";

interface FeaturedSellerData {
  name: string;
  avatar: string;
  elo: number;
  rating: number;
  verified: boolean;
  swaps: number;
  badge: string;
}

export default function FeaturedSellers() {
  const [sellers, setSellers] = useState<FeaturedSellerData[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, full_name, elo, id_verified, total_gigs_completed, avatar_url")
        .order("elo", { ascending: false })
        .limit(6);

      if (data?.length) {
        setSellers(data.map((p: any) => {
          const name = p.display_name || p.full_name || "User";
          const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
          return {
            name,
            avatar: initials,
            elo: p.elo || 1000,
            rating: 4.8,
            verified: p.id_verified || false,
            swaps: p.total_gigs_completed || 0,
            badge: p.elo >= 1700 ? "Expert" : p.elo >= 1500 ? "Top Rated" : "Rising Star",
          };
        }));
      }
    };
    load();
  }, []);

  if (sellers.length === 0) {
    return <p className="text-xs text-muted-foreground">No featured sellers yet</p>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {sellers.map(s => {
        const tier = eloTier(s.elo);
        return (
          <UserPreviewPopover
            key={s.name}
            name={s.name}
            avatar={s.avatar}
            elo={s.elo}
            rating={s.rating}
            verified={s.verified}
            completedSwaps={s.swaps}
          >
            <button className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border bg-card hover:border-foreground/10 transition-all group">
              <div className={`w-8 h-8 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center font-heading font-bold text-xs ${tier.color}`}>
                {s.avatar}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-heading font-semibold text-foreground">{s.name}</span>
                  {s.verified && <Shield className="w-3 h-3 text-skill-green" />}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className={`font-mono ${tier.color}`}>{s.elo}</span>
                  <Star className="w-2.5 h-2.5 text-badge-gold fill-current" />
                  <span>{s.rating}</span>
                </div>
              </div>
              <span className="ml-1 px-1.5 py-0.5 bg-surface-2 text-[9px] font-mono text-muted-foreground rounded">
                {s.badge}
              </span>
            </button>
          </UserPreviewPopover>
        );
      })}
    </div>
  );
}
