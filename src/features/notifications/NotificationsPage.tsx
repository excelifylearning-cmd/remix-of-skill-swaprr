import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, MessageCircle, Star, Trophy, Gavel, Users, ShoppingBag, AlertCircle, Settings } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockNotifications = [
  { id: "1", type: "message", icon: MessageCircle, color: "text-[hsl(var(--court-blue))]", title: "New message from Luna M.", description: "The design revisions look great!", time: "2m ago", read: false },
  { id: "2", type: "gig", icon: ShoppingBag, color: "text-[hsl(var(--skill-green))]", title: "Gig completed!", description: "Your logo design gig has been marked complete. Leave a review!", time: "1h ago", read: false },
  { id: "3", type: "achievement", icon: Trophy, color: "text-[hsl(var(--badge-gold))]", title: "Achievement Unlocked!", description: "First Swap — Complete your first skill exchange", time: "3h ago", read: false },
  { id: "4", type: "guild", icon: Users, color: "text-purple-400", title: "Guild War Starting", description: "Pixel Guild vs. Code Collective begins in 2 hours", time: "5h ago", read: true },
  { id: "5", type: "court", icon: Gavel, color: "text-[hsl(var(--alert-red))]", title: "Jury Duty Assignment", description: "You've been selected as a juror for Case #SK-2847", time: "8h ago", read: true },
  { id: "6", type: "system", icon: AlertCircle, color: "text-muted-foreground", title: "Profile Incomplete", description: "Add skills to your profile to get discovered", time: "1d ago", read: true },
  { id: "7", type: "achievement", icon: Star, color: "text-[hsl(var(--badge-gold))]", title: "New Badge Earned", description: "Quick Responder — Reply within 5 minutes", time: "2d ago", read: true },
  { id: "8", type: "gig", icon: ShoppingBag, color: "text-[hsl(var(--skill-green))]", title: "New proposal received", description: "Alex C. sent a proposal for your React Development gig", time: "3d ago", read: true },
];

const tabs = [
  { value: "all", label: "All", count: 8 },
  { value: "unread", label: "Unread", count: 3 },
  { value: "gigs", label: "Gigs", count: 2 },
  { value: "social", label: "Social", count: 2 },
  { value: "system", label: "System", count: 2 },
];

const NotificationsPage = () => (
  <PageTransition>
    <Navbar />
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your gigs, messages, and achievements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><CheckCheck className="w-4 h-4" />Mark all read</Button>
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </div>
        </motion.div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                {tab.label}
                {tab.count > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{tab.count}</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {mockNotifications.map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-accent/30 ${
                  notif.read ? "bg-card/50 border-border/30" : "bg-card border-border/50 border-l-2 border-l-primary"
                }`}>
                <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${notif.color}`}>
                  <notif.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>{notif.title}</h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.description}</p>
                </div>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
              </motion.div>
            ))}
          </TabsContent>

          {["unread", "gigs", "social", "system"].map((tab) => (
            <TabsContent key={tab} value={tab} className="text-center py-12 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>Filter view — same data, filtered by {tab}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
    <Footer />
  </PageTransition>
);

export default NotificationsPage;
