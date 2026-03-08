import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut, Trophy, Zap, Star, Shield, Users, TrendingUp, ArrowRight,
  Calendar, MessageSquare, BookOpen, Award, Settings, Bell, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

const quickStats = [
  { label: "Skill Points", value: "12,500", icon: Zap, color: "text-badge-gold" },
  { label: "ELO Rating", value: "1,850", icon: TrendingUp, color: "text-skill-green" },
  { label: "Gigs Completed", value: "47", icon: Trophy, color: "text-court-blue" },
  { label: "Active Guilds", value: "3", icon: Users, color: "text-foreground" },
];

const recentActivity = [
  { action: "Completed gig: Logo Redesign", time: "2 hours ago", icon: Award, color: "text-skill-green" },
  { action: "Earned 250 SP from auction win", time: "5 hours ago", icon: Zap, color: "text-badge-gold" },
  { action: "New forum reply on your thread", time: "1 day ago", icon: MessageSquare, color: "text-court-blue" },
  { action: "Guild Wars S4 badge unlocked", time: "2 days ago", icon: Shield, color: "text-foreground" },
  { action: "Workshop attendance: API v2", time: "3 days ago", icon: BookOpen, color: "text-muted-foreground" },
];

const quickLinks = [
  { label: "Browse Marketplace", href: "/marketplace", icon: Star },
  { label: "My Gigs", href: "/marketplace", icon: Trophy },
  { label: "Forums", href: "/forums", icon: MessageSquare },
  { label: "Leaderboard", href: "/leaderboard", icon: TrendingUp },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero / Welcome */}
        <section className="pt-28 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">{user.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="rounded-full bg-badge-gold/10 border border-badge-gold/20 px-3 py-1 text-xs font-mono text-badge-gold">{user.tier}</span>
                  <span className="rounded-full bg-skill-green/10 border border-skill-green/20 px-3 py-1 text-xs font-mono text-skill-green">{user.role === "admin" ? "Admin" : "Member"}</span>
                  <span className="text-xs text-muted-foreground">Member since {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Bell size={14} className="inline mr-1.5" /> Notifications
                </button>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="rounded-full border border-destructive/30 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={14} className="inline mr-1.5" /> Log Out
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card p-5 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <stat.icon size={18} className={`mx-auto mb-2 ${stat.color}`} />
                <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Grid: Activity + Quick Links */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                      <item.icon size={14} className={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Quick Links</h2>
              <div className="space-y-2">
                {quickLinks.map((link, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                    <Link
                      to={link.href}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/20 transition-all"
                    >
                      <link.icon size={14} />
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight size={12} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {user.role === "admin" && (
                <div className="mt-4 rounded-lg border border-badge-gold/20 bg-badge-gold/5 p-3">
                  <p className="text-xs font-bold text-badge-gold flex items-center gap-1"><Shield size={12} /> Admin Access</p>
                  <p className="text-[10px] text-muted-foreground mt-1">You have full platform admin permissions.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <CTAFooterSection />
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
