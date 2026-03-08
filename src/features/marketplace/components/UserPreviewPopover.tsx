import { Link } from "react-router-dom";
import { Star, Shield, GraduationCap, MessageSquare } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { eloTier } from "../utils/marketplace-utils";

interface UserPreviewPopoverProps {
  name: string;
  avatar: string;
  elo: number;
  rating: number;
  verified: boolean;
  uni?: string;
  completedSwaps: number;
  skills?: string[];
  children: React.ReactNode;
}

export default function UserPreviewPopover({
  name, avatar, elo, rating, verified, uni, completedSwaps, skills, children
}: UserPreviewPopoverProps) {
  const tier = eloTier(elo);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 bg-card border-border p-0" side="top" align="start">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${tier.bg} ${tier.border} border flex items-center justify-center font-heading font-bold text-sm ${tier.color}`}>
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-foreground text-sm truncate">{name}</span>
                {verified && <Shield className="w-3.5 h-3.5 text-skill-green flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-mono font-medium ${tier.color}`}>{tier.label} · {elo}</span>
                <span className="flex items-center gap-0.5 text-xs text-badge-gold">
                  <Star className="w-3 h-3 fill-current" />{rating}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{completedSwaps} swaps</span>
            {uni && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />{uni}
              </span>
            )}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 bg-surface-2 text-muted-foreground text-[10px] font-mono rounded-md">{s}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Link
              to={`/profile/${name.replace(/\s/g, "-").toLowerCase()}`}
              className="flex-1 h-8 flex items-center justify-center rounded-lg bg-foreground text-background text-xs font-heading font-semibold hover:bg-foreground/90 transition-colors"
            >
              View Profile
            </Link>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
