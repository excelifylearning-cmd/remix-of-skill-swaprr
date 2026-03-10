import { useLocation, Link } from "react-router-dom";
import { Store, LayoutDashboard, Film, Shield, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/marketplace", label: "Market", icon: Store },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/clips", label: "Clips", icon: Film },
  { path: "/guilds", label: "Guilds", icon: Shield },
  { path: "/forums", label: "Forums", icon: MessageSquare },
];

const APP_PATHS = [
  "/marketplace", "/dashboard", "/clips", "/guilds", "/forums",
  "/profile", "/guild", "/workspace", "/leaderboard", "/analytics",
  "/transaction", "/events", "/enterprise-dashboard", "/guild-dashboard",
  "/saved", "/users",
];

const MobileBottomNav = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const location = useLocation();

  const isAppPage = APP_PATHS.some(p => location.pathname.startsWith(p));
  if (!isMobile || !user || !isAppPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9990] border-t border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground/50"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <span className="text-[9px] font-semibold tracking-wide">{label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
