import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, Users, Trophy, Zap, Star, ArrowRight, ChevronLeft, ChevronRight,
  Flame, Target, Globe, Award, PartyPopper, Swords, Shield, Video, Mic,
  BookOpen, TrendingUp, Crown, Timer, Heart, Share2, Bell, Filter,
  Gift, Medal, GraduationCap, Gamepad2, Palette, MessageSquare, Ticket,
  Sparkles, Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { Badge } from "@/components/ui/badge";

/* ─── icon map ─── */
const iconMap: Record<string, any> = {
  Target, BookOpen, Mic, Palette, Flame, Shield, TrendingUp, Crown, Swords, Award, GraduationCap, Gamepad2, Calendar, Users, Trophy, Video, MapPin, Globe, PartyPopper, Star, Zap, Gift, Medal, Timer, Sparkles
};
const getIcon = (name: string) => iconMap[name] || Calendar;

/* ─── countdown ─── */
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
};

/* ─── count up ─── */
const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return { count, ref };
};

const eventTypes = [
  { label: "All", icon: Globe },
  { label: "Tournament", icon: Trophy },
  { label: "Workshop", icon: BookOpen },
];

const eventPerks = [
  { icon: Trophy, title: "Exclusive Badges", desc: "Earn event-specific badges that permanently display on your profile" },
  { icon: Zap, title: "Bonus SP", desc: "Participants receive SP rewards — winners get the lion's share" },
  { icon: TrendingUp, title: "ELO Boost", desc: "Tournament wins give a significant ELO rating multiplier" },
  { icon: Users, title: "Networking", desc: "Connect with top swappers, guild leaders, and industry pros" },
  { icon: Gift, title: "Swag & Merch", desc: "In-person attendees receive exclusive SkillSwappr merchandise" },
  { icon: Star, title: "Featured Profile", desc: "Top 3 winners get featured on the homepage for a week" },
];

const eventFaqs = [
  { q: "Are events free to join?", a: "Most events are completely free. Some premium tournaments may require a small SP entry fee." },
  { q: "Can I participate from any country?", a: "Yes! All online events are open globally. In-person events are location-specific." },
  { q: "How are tournament prizes distributed?", a: "1st place gets 50%, 2nd gets 25%, 3rd gets 15%, rest split among top 10." },
  { q: "Can I host my own event?", a: "Once you reach Gold tier, you can submit event proposals through the Community Events portal." },
  { q: "How do team tournaments work?", a: "Team events allow forming/joining teams during registration. Our matchmaking helps solo players." },
];

/* ─── page ─── */
const EventsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState("All");
  const [events, setEvents] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    const fetchData = async () => {
      const [eRes, tRes] = await Promise.all([
        supabase.from("events").select("*").order("event_date", { ascending: true }),
        supabase.from("tournaments").select("*").order("start_date", { ascending: true }),
      ]);
      setEvents(eRes.data || []);
      setTournaments(tRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const featuredTournament = tournaments.find(t => t.status === "registration_open") || tournaments[0];
  const countdown = useCountdown(new Date(featuredTournament?.start_date || "2026-06-15"));

  const filteredEvents = selectedType === "All" ? events : events.filter(e => e.event_type === selectedType);

  // Calendar computation
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const eventDates = events.map(e => new Date(e.event_date).getDate()).filter(d => {
      const eDate = events.find(ev => new Date(ev.event_date).getDate() === d);
      if (!eDate) return false;
      const ed = new Date(eDate.event_date);
      return ed.getMonth() === month && ed.getFullYear() === year;
    });
    return { firstDay, daysInMonth, eventDates: [...new Set(eventDates)] };
  }, [calendarMonth, events]);

  const calendarLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleRegister = (eventId: string) => {
    if (!isAuthenticated) { setShowLogin(true); return; }
    // Registration logic would go here
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* ────── HERO + COUNTDOWN ────── */}
        <section className="relative pt-28 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-court-blue/5 blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-skill-green/5 blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Calendar size={12} className="inline mr-1.5 -mt-0.5" /> Platform Events
              </span>
              <h1 className="font-heading text-5xl sm:text-7xl font-black text-foreground mt-4">
                Events &<br /><span className="text-court-blue">Tournaments</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl text-lg">
                Compete, connect, and level up. From global tournaments to workshops — there's always something happening.
              </p>

              {/* Countdown */}
              {featuredTournament && (
                <div className="mt-8">
                  <p className="text-sm text-muted-foreground mb-3">{featuredTournament.name} — starts in:</p>
                  <div className="grid grid-cols-4 gap-3 max-w-md">
                    {[
                      { label: "Days", value: countdown.days },
                      { label: "Hours", value: countdown.hours },
                      { label: "Mins", value: countdown.minutes },
                      { label: "Secs", value: countdown.seconds },
                    ].map(t => (
                      <div key={t.label} className="rounded-xl bg-surface-2 border border-border p-3 text-center">
                        <p className="font-heading text-2xl sm:text-3xl font-black text-foreground">{String(t.value).padStart(2, "0")}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{t.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Trophy size={12} className="text-foreground" /> {featuredTournament.prize_pool} Prize Pool</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {featuredTournament.max_teams} teams max</span>
                    <span className="flex items-center gap-1"><Shield size={12} /> Min ELO: {featuredTournament.min_elo}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => handleRegister(featuredTournament?.id)} className="rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:shadow-lg transition-shadow">
                  Register Now <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────── PLATFORM STATS ────── */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Events This Month", value: events.filter(e => { const d = new Date(e.event_date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length, icon: Calendar },
              { label: "Total Events", value: events.length, icon: Globe },
              { label: "Tournaments", value: tournaments.length, icon: Trophy },
              { label: "Open Registration", value: tournaments.filter(t => t.status === "registration_open").length, icon: Ticket },
            ].map((stat, i) => {
              const { count, ref } = useCountUp(stat.value);
              return (
                <motion.div key={i} ref={ref} className="rounded-xl border border-border bg-card p-5 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <stat.icon size={18} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-heading text-2xl sm:text-3xl font-black text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ────── EVENT PERKS ────── */}
        <section className="py-16 px-6 bg-surface-1">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-3 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Gift size={12} className="inline mr-1.5 -mt-0.5" /> Rewards
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Why Participate?</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventPerks.map((perk, i) => (
                <motion.div key={perk.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border">
                    <perk.icon size={22} className="text-foreground" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-1">{perk.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ────── UPCOMING EVENTS (from DB) ────── */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">Monthly events — first week of every month</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {eventTypes.map(t => (
                <button key={t.label} onClick={() => setSelectedType(t.label)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedType === t.label ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading events...</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={selectedType} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-4">
                  {filteredEvents.map((event, i) => {
                    const Icon = getIcon(event.icon);
                    return (
                      <motion.div key={event.id} className="rounded-xl border border-border bg-card p-5 cursor-pointer transition-all hover:border-muted-foreground/30"
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -2 }} onClick={() => setSelectedEvent(event)}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 border border-border">
                              <Icon size={18} className="text-foreground" />
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-foreground">{event.title}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{event.category}</p>
                            </div>
                          </div>
                          {event.prize && <span className="rounded-full bg-skill-green/10 border border-skill-green/30 px-2.5 py-1 text-xs font-mono text-skill-green">{event.prize}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(event.event_date).toLocaleDateString()}</span>
                          {event.time_label && <span className="flex items-center gap-1"><Clock size={11} /> {event.time_label}</span>}
                          {event.spots && <span className="flex items-center gap-1"><Users size={11} /> {event.spots_filled}/{event.spots} spots</span>}
                        </div>
                        <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.event_type === "Tournament" ? "bg-court-blue/10 text-court-blue border border-court-blue/20" :
                          "bg-foreground/10 text-foreground border border-border"
                        }`}>{event.event_type}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Globe size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No events found. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ────── EVENT MODAL ────── */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
              <motion.div className="relative max-w-lg w-full rounded-2xl border border-border bg-card p-6 sm:p-8 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">✕</button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border">
                    {(() => { const Icon = getIcon(selectedEvent.icon); return <Icon size={22} className="text-foreground" />; })()}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{selectedEvent.title}</h3>
                    <p className="text-xs text-muted-foreground">{selectedEvent.category} · {selectedEvent.event_type}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-lg bg-surface-2 p-3 text-center">
                    <Calendar size={14} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-foreground font-medium">{new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedEvent.time_label}</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-3 text-center">
                    {selectedEvent.prize ? (
                      <>
                        <Trophy size={14} className="mx-auto mb-1 text-skill-green" />
                        <p className="text-xs text-foreground font-medium">{selectedEvent.prize}</p>
                        <p className="text-[10px] text-muted-foreground">Prize Pool</p>
                      </>
                    ) : (
                      <>
                        <Users size={14} className="mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-foreground font-medium">{selectedEvent.spots ?? "Unlimited"}</p>
                        <p className="text-[10px] text-muted-foreground">Spots</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleRegister(selectedEvent.id)} className="flex-1 rounded-full bg-foreground text-background py-2.5 text-sm font-medium">Register</button>
                  <button className="rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"><Share2 size={14} /></button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ────── TOURNAMENTS (quarterly, from DB) ────── */}
        <section className="py-20 px-6 bg-surface-1">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="mb-3 inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <Trophy size={12} className="inline mr-1.5 -mt-0.5" /> Every 3 Months
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Quarterly Tournaments</h2>
              <p className="text-muted-foreground mt-2">Ranked competitions with real SP prizes and eligibility requirements</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {tournaments.map((t, i) => {
                const Icon = getIcon(t.icon);
                return (
                  <motion.div key={t.id} className="rounded-xl border border-border bg-card p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 border border-border shrink-0">
                        <Icon size={24} className="text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-bold text-foreground">{t.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={
                        t.status === "registration_open" ? "bg-skill-green/10 text-skill-green border-none" :
                        "bg-surface-2 text-muted-foreground border-none"
                      }>{t.status === "registration_open" ? "Registration Open" : "Upcoming"}</Badge>
                      <Badge variant="secondary">{t.format}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="rounded-lg bg-surface-1 p-2">
                        <span className="text-muted-foreground">Prize Pool</span>
                        <p className="font-bold text-skill-green">{t.prize_pool}</p>
                      </div>
                      <div className="rounded-lg bg-surface-1 p-2">
                        <span className="text-muted-foreground">Teams</span>
                        <p className="font-bold text-foreground">{t.max_teams} max</p>
                      </div>
                      <div className="rounded-lg bg-surface-1 p-2">
                        <span className="text-muted-foreground">Start</span>
                        <p className="font-bold text-foreground">{new Date(t.start_date).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-lg bg-surface-1 p-2">
                        <span className="text-muted-foreground">Entry Fee</span>
                        <p className="font-bold text-foreground">{t.entry_fee > 0 ? `${t.entry_fee} SP` : "Free"}</p>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="rounded-lg border border-border bg-surface-1 p-3 mb-4">
                      <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Eligibility</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">Min ELO: {t.min_elo}</span>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">Tier: {t.min_tier}+</span>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">Min Gigs: {t.min_gigs}</span>
                        {t.team_size > 0 && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">Team Size: {t.team_size}</span>}
                      </div>
                    </div>

                    <button onClick={() => handleRegister(t.id)}
                      className={`w-full rounded-full py-2.5 text-sm font-medium ${t.status === "registration_open" ? "bg-foreground text-background" : "border border-border text-muted-foreground"}`}>
                      {t.status === "registration_open" ? "Register Now" : "Coming Soon"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ────── MONTHLY CALENDAR (editable) ────── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Event Calendar</h2>
              <p className="text-muted-foreground mt-2">Monthly events happen in the first week of every month</p>
            </motion.div>

            <motion.div className="rounded-2xl border border-border bg-card p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarMonth(p => ({ year: p.month === 0 ? p.year - 1 : p.year, month: p.month === 0 ? 11 : p.month - 1 }))}
                  className="text-muted-foreground hover:text-foreground"><ChevronLeft size={18} /></button>
                <h3 className="font-heading font-bold text-foreground">{calendarLabel}</h3>
                <button onClick={() => setCalendarMonth(p => ({ year: p.month === 11 ? p.year + 1 : p.year, month: p.month === 11 ? 0 : p.month + 1 }))}
                  className="text-muted-foreground hover:text-foreground"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <span key={d} className="py-1">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: calendarDays.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: calendarDays.daysInMonth }, (_, i) => i + 1).map(day => {
                  const hasEvent = calendarDays.eventDates.includes(day);
                  return (
                    <motion.div key={day}
                      className={`relative flex h-9 sm:h-10 items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${
                        hasEvent ? "bg-skill-green/10 text-skill-green font-bold border border-skill-green/20 hover:bg-skill-green/20" : "text-muted-foreground hover:bg-surface-2"
                      }`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      {day}
                      {hasEvent && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-skill-green" />}
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-4 pt-3 border-t border-border/30">
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-skill-green" /><span className="text-[10px] text-muted-foreground">Event Day</span></div>
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-surface-2 border border-border" /><span className="text-[10px] text-muted-foreground">No Events</span></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────── IN-PERSON & LIVE STREAMS — COMING SOON ────── */}
        <section className="py-20 px-6 bg-surface-1">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div className="rounded-2xl border border-border bg-card p-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border mx-auto mb-4">
                  <MapPin size={28} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">In-Person Events</h3>
                <p className="text-sm text-muted-foreground mb-4">Meetups, socials, and co-working sessions in cities worldwide.</p>
                <Badge className="bg-badge-gold/10 text-badge-gold border-none">Coming Soon</Badge>
              </motion.div>
              <motion.div className="rounded-2xl border border-border bg-card p-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border mx-auto mb-4">
                  <Video size={28} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Live Streams</h3>
                <p className="text-sm text-muted-foreground mb-4">AMAs, podcasts, and live coding sessions with community leaders.</p>
                <Badge className="bg-badge-gold/10 text-badge-gold border-none">Coming Soon</Badge>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ────── HOW EVENTS WORK ────── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">How Events Work</h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Browse & Register", desc: "Find events that match your skills. One-click registration.", icon: Ticket },
                { step: "02", title: "Compete or Attend", desc: "Join tournaments or workshops. Earn XP and SP.", icon: Zap },
                { step: "03", title: "Claim Rewards", desc: "Winners get SP prizes, badges, and leaderboard positions.", icon: Award },
              ].map((s, i) => (
                <motion.div key={i} className="rounded-2xl border border-border bg-card p-6 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <span className="absolute top-3 right-4 font-heading text-6xl font-black text-foreground/[0.03]">{s.step}</span>
                  <span className="font-mono text-xs text-muted-foreground">Step {s.step}</span>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 border border-border mx-auto my-4">
                    <s.icon size={24} className="text-foreground" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ────── FAQ ────── */}
        <section className="py-20 px-6 bg-surface-1">
          <div className="max-w-3xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Event FAQ</h2>
            </motion.div>
            <div className="space-y-3">
              {eventFaqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                    <span className="font-heading text-sm font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronRight size={14} className={`text-muted-foreground transition-transform shrink-0 ${expandedFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ────── CTA ────── */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <PartyPopper size={36} className="mx-auto mb-4 text-skill-green" />
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">Don't Miss Out</h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">Join the next event and start earning SP, badges, and recognition in the community.</p>
              <div className="mt-8">
                <button onClick={() => { if (!isAuthenticated) setShowLogin(true); }} className="rounded-full bg-foreground text-background px-8 py-3 text-sm font-medium">
                  Browse All Events <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <LoginPrompt open={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    </PageTransition>
  );
};

export default EventsPage;
