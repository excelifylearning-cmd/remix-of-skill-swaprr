import { Link } from "react-router-dom";
import { Users, Trophy } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface GuildPreviewPopoverProps {
  guildName: string;
  guildId: string;
  children: React.ReactNode;
}

export default function GuildPreviewPopover({ guildName, guildId, children }: GuildPreviewPopoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-56 bg-card border-border p-0" side="top">
        <div className="p-3 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center">
              <Trophy className="w-4 h-4 text-badge-gold" />
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">{guildName}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />12 members
              </p>
            </div>
          </div>
          <Link
            to={`/guild/${guildId}`}
            className="block w-full h-7 flex items-center justify-center rounded-md bg-surface-2 text-foreground text-xs font-heading font-semibold hover:bg-surface-3 transition-colors"
          >
            View Guild
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
