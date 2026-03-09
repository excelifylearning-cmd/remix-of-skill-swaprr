import { motion } from "framer-motion";
import { User, Bell, Shield, Eye, Palette, Globe, Trash2, Download, Key, Mail, Smartphone } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const settingsSections = [
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Manage your public profile information",
    settings: [
      { label: "Display Name", type: "text", value: "Your Name", placeholder: "Enter display name" },
      { label: "Bio", type: "textarea", value: "", placeholder: "Tell us about yourself..." },
      { label: "University", type: "text", value: "", placeholder: "Your university" },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Choose what you want to be notified about",
    toggles: [
      { label: "Email notifications", description: "Receive email updates about your gigs", enabled: true },
      { label: "In-app notifications", description: "Show notifications inside the app", enabled: true },
      { label: "Marketing emails", description: "Tips, product updates, and offers", enabled: false },
      { label: "Workspace updates", description: "Messages, file uploads, stage changes", enabled: true },
    ],
  },
  {
    id: "privacy",
    icon: Eye,
    title: "Privacy",
    description: "Control who can see your information",
    toggles: [
      { label: "Public profile", description: "Allow others to find and view your profile", enabled: true },
      { label: "Show ELO rating", description: "Display your ELO on your public profile", enabled: true },
      { label: "Show activity status", description: "Let others see when you're online", enabled: false },
      { label: "Show portfolio", description: "Display portfolio items on your profile", enabled: true },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Protect your account",
    actions: [
      { label: "Change Password", description: "Update your account password", action: "password", icon: Key },
      { label: "Two-Factor Authentication", description: "Add an extra layer of security", action: "2fa", icon: Smartphone, badge: "Coming Soon" },
      { label: "Connected Accounts", description: "Manage Google, GitHub connections", action: "oauth", icon: Globe, badge: "Coming Soon" },
    ],
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Customize how SkillSwappr looks",
    toggles: [
      { label: "Custom cursor", description: "Use SkillSwappr's custom cursor effect", enabled: true },
      { label: "Cursor glow", description: "Show glow effect following cursor", enabled: true },
      { label: "Animations", description: "Enable page transitions and motion", enabled: true },
    ],
  },
];

const SettingsPage = () => {
  const { profile } = useAuth();

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your account preferences and privacy</p>
          </motion.div>

          <div className="space-y-8">
            {settingsSections.map((section, si) => (
              <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.05 }}
                className="rounded-xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <section.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5 ml-8">{section.description}</p>

                {section.toggles && (
                  <div className="space-y-4 ml-8">
                    {section.toggles.map((toggle) => (
                      <div key={toggle.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                          <p className="text-xs text-muted-foreground">{toggle.description}</p>
                        </div>
                        <Switch defaultChecked={toggle.enabled} />
                      </div>
                    ))}
                  </div>
                )}

                {section.actions && (
                  <div className="space-y-3 ml-8">
                    {section.actions.map((action) => (
                      <div key={action.label} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                        <div className="flex items-center gap-3">
                          <action.icon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        {action.badge ? (
                          <Badge variant="outline" className="text-xs">{action.badge}</Badge>
                        ) : (
                          <Button variant="outline" size="sm">Manage</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.settings && (
                  <div className="space-y-4 ml-8">
                    {section.settings.map((setting) => (
                      <div key={setting.label}>
                        <label className="text-sm font-medium text-foreground mb-1 block">{setting.label}</label>
                        {setting.type === "textarea" ? (
                          <textarea className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground resize-none h-20" placeholder={setting.placeholder} defaultValue={setting.value} />
                        ) : (
                          <input type="text" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" placeholder={setting.placeholder} defaultValue={setting.value} />
                        )}
                      </div>
                    ))}
                    <Button size="sm">Save Changes</Button>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-xl border border-destructive/30 p-6">
              <h2 className="text-lg font-semibold text-destructive mb-1 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Irreversible actions</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export Data</Button>
                <Button variant="destructive" size="sm" className="gap-2"><Trash2 className="w-4 h-4" /> Delete Account</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default SettingsPage;
