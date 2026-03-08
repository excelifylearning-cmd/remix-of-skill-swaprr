import {
  Handshake, Coins, Gavel, Layers, GitMerge, Briefcase, Zap, HandHeart,
  Palette, Code, PenTool, Video, BarChart3, Music, Camera, LayoutGrid,
} from "lucide-react";

export const eloTier = (elo: number) => {
  if (elo >= 1700) return { label: "Diamond", color: "text-court-blue", bg: "bg-court-blue/10", border: "border-court-blue/20", glow: "shadow-[0_0_20px_-5px_hsl(var(--court-blue)/0.3)]" };
  if (elo >= 1500) return { label: "Gold", color: "text-badge-gold", bg: "bg-badge-gold/10", border: "border-badge-gold/20", glow: "shadow-[0_0_20px_-5px_hsl(var(--badge-gold)/0.3)]" };
  if (elo >= 1300) return { label: "Silver", color: "text-muted-foreground", bg: "bg-surface-2", border: "border-border", glow: "" };
  return { label: "Bronze", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", glow: "" };
};

export const formatIcon = (format: string) => {
  switch (format) {
    case "Direct Swap": return Handshake;
    case "SP Only": return Coins;
    case "Auction": return Gavel;
    case "Co-Creation": return Layers;
    case "Skill Fusion": return GitMerge;
    case "Projects": return Briefcase;
    case "Flash Market": return Zap;
    default: return Handshake;
  }
};

export const formatColor = (format: string) => {
  switch (format) {
    case "Direct Swap": return "text-skill-green";
    case "SP Only": return "text-badge-gold";
    case "Auction": return "text-alert-red";
    case "Co-Creation": return "text-court-blue";
    case "Skill Fusion": return "text-purple-400";
    case "Projects": return "text-orange-400";
    case "Flash Market": return "text-badge-gold";
    default: return "text-muted-foreground";
  }
};

export const categoryIcon = (cat: string) => {
  switch (cat) {
    case "Design": return Palette;
    case "Development": return Code;
    case "Writing": return PenTool;
    case "Video": return Video;
    case "Marketing": return BarChart3;
    case "Music": return Music;
    case "Photography": return Camera;
    default: return LayoutGrid;
  }
};

export const categoryColor = (cat: string) => {
  switch (cat) {
    case "Design": return "text-pink-400";
    case "Development": return "text-court-blue";
    case "Writing": return "text-orange-400";
    case "Video": return "text-alert-red";
    case "Marketing": return "text-skill-green";
    case "Music": return "text-purple-400";
    case "Photography": return "text-badge-gold";
    default: return "text-foreground";
  }
};

export const ITEMS_PER_PAGE_GRID = 12;
export const ITEMS_PER_PAGE_LIST = 20;
