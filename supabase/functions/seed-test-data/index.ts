import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Create test user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: "Admin123@skillswappr.com",
    password: "Admin123!",
    email_confirm: true,
    user_metadata: { full_name: "Admin User" },
  });

  if (userError && !userError.message.includes("already been registered")) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let userId = userData?.user?.id;
  if (!userId) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const found = users?.users?.find((u: any) => u.email === "Admin123@skillswappr.com");
    userId = found?.id;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not find/create user" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // 2. Update profile
  await supabase.from("profiles").update({
    full_name: "Admin User",
    display_name: "The Admin",
    bio: "Platform administrator and full-stack developer. Building SkillSwappr to empower student freelancers worldwide.",
    slogan: "Building the future of skill exchange",
    location: "San Francisco, CA",
    university: "Stanford University",
    timezone: "PST",
    languages: ["English", "Spanish", "Mandarin"],
    skills: ["React", "TypeScript", "Node.js", "Python", "UI/UX Design", "System Architecture", "DevOps"],
    skill_levels: { "React": 95, "TypeScript": 90, "Node.js": 88, "Python": 82, "UI/UX Design": 75, "System Architecture": 92, "DevOps": 80 },
    elo: 2450,
    sp: 15000,
    tier: "Diamond",
    total_gigs_completed: 147,
    streak_days: 42,
    availability: "Available",
    response_time: "Within 1 hour",
    id_verified: true,
    onboarding_complete: true,
    github_url: "https://github.com/admin",
    linkedin_url: "https://linkedin.com/in/admin",
    twitter_url: "https://twitter.com/admin",
    personal_website: "https://skillswappr.com",
    work_history: [
      { role: "CTO", company: "SkillSwappr", period: "2024 – Present", description: "Leading platform development." },
      { role: "Senior Engineer", company: "Meta", period: "2021 – 2024", description: "React core team." },
    ],
    education_history: [
      { school: "Stanford University", degree: "M.S. Computer Science", period: "2017 – 2019" },
      { school: "MIT", degree: "B.S. Computer Science", period: "2013 – 2017" },
    ],
    certificates: [
      { name: "AWS Solutions Architect", issuer: "Amazon", date: "2023", verified: true },
    ],
    portfolio_items: [
      { title: "SkillSwappr Platform", description: "The skill exchange marketplace", image: "" },
    ],
    interests: ["Open Source", "EdTech", "AI/ML", "Community Building"],
    needs: ["Design Feedback", "Content Writers", "Beta Testers"],
  }).eq("user_id", userId);

  // 3. Admin role
  await supabase.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  // 4. Create test guild
  const { data: guildData } = await supabase.from("guilds").upsert({
    name: "Code Collective",
    description: "An elite guild of full-stack developers, designers, and architects.",
    slogan: "Build. Ship. Repeat.",
    category: "Engineering",
    rank: 1,
    is_public: true,
    total_sp: 125000,
    total_gigs: 847,
    avg_elo: 2100,
    win_rate: 78,
    created_by: userId,
    requirements: ["ELO 1500+", "3+ completed gigs", "Portfolio review"],
    perks: ["Priority project access", "Monthly SP bonus", "Mentorship program"],
  }, { onConflict: "name" }).select("id").single();

  const guildId = guildData?.id;

  if (guildId) {
    // Guild member
    await supabase.from("guild_members").upsert({
      guild_id: guildId,
      user_id: userId,
      role: "Guild Master",
    }, { onConflict: "guild_id,user_id" });

    // Seed guild treasury
    await supabase.from("guild_treasury_log").insert([
      { guild_id: guildId, user_id: userId, type: "deposit", amount: 5000, reason: "Guild Wars S4 prize" },
      { guild_id: guildId, user_id: userId, type: "deposit", amount: 3500, reason: "Monthly contributions" },
      { guild_id: guildId, user_id: userId, type: "withdrawal", amount: -1200, reason: "Project funding: UI Kit v2" },
      { guild_id: guildId, user_id: userId, type: "deposit", amount: 2000, reason: "Tournament winnings" },
      { guild_id: guildId, user_id: userId, type: "withdrawal", amount: -800, reason: "Member SP advances" },
    ]);

    // Seed guild wars
    await supabase.from("guild_wars").insert([
      { guild_id: guildId, opponent_name: "Tech Titans", status: "Upcoming", start_date: "2026-03-15T18:00:00Z", stakes: 500, our_score: 0, their_score: 0 },
      { guild_id: guildId, opponent_name: "Creative Collective", status: "Victory", start_date: "2026-03-01T18:00:00Z", stakes: 300, our_score: 1250, their_score: 980 },
      { guild_id: guildId, opponent_name: "Code Ninjas", status: "Defeat", start_date: "2026-02-15T18:00:00Z", stakes: 400, our_score: 890, their_score: 1100 },
    ]);

    // Seed guild projects
    await supabase.from("guild_projects").insert([
      { guild_id: guildId, title: "Platform API v2", client: "Internal", status: "In Progress", progress: 65, sp_pool: 2500, members_count: 4 },
      { guild_id: guildId, title: "Brand Identity Suite", client: "External", status: "Planning", progress: 15, sp_pool: 800, members_count: 3 },
      { guild_id: guildId, title: "Motion Graphics Pack", client: "External", status: "Completed", progress: 100, sp_pool: 500, members_count: 2 },
    ]);

    // Badges & achievements
    const { data: badges } = await supabase.from("badges").select("id").limit(5);
    const { data: achievements } = await supabase.from("achievements").select("id").limit(6);

    if (badges?.length) {
      await supabase.from("guild_badges").insert(badges.slice(0, 3).map((b: any) => ({ guild_id: guildId, badge_id: b.id })));
      await supabase.from("user_badges").insert(badges.map((b: any) => ({ user_id: userId, badge_id: b.id })));
    }

    if (achievements?.length) {
      await supabase.from("guild_achievements").insert(
        achievements.slice(0, 3).map((a: any, i: number) => ({
          guild_id: guildId, achievement_id: a.id,
          progress: i === 0 ? 100 : 50 + i * 15,
          completed: i === 0,
          completed_at: i === 0 ? new Date().toISOString() : null,
        }))
      );
      await supabase.from("user_achievements").insert(
        achievements.map((a: any, i: number) => ({
          user_id: userId, achievement_id: a.id,
          progress: i < 2 ? 100 : 30 + i * 10,
          completed: i < 2,
          completed_at: i < 2 ? new Date().toISOString() : null,
        }))
      );
    }
  }

  // 5. Enterprise test data
  const { data: ep1 } = await supabase.from("enterprise_projects").insert([
    { user_id: userId, name: "AI Chatbot Integration", description: "Build conversational AI for customer support.", status: "In Progress", progress: 65, team_size: 4, budget: 5000, deadline: "2026-04-01", priority: "high" },
    { user_id: userId, name: "Mobile App Redesign", description: "Complete redesign of the mobile experience.", status: "Planning", progress: 15, team_size: 3, budget: 3500, deadline: "2026-05-15", priority: "medium" },
    { user_id: userId, name: "Data Pipeline Setup", description: "ETL pipeline for analytics and reporting.", status: "In Progress", progress: 40, team_size: 2, budget: 2800, deadline: "2026-04-20", priority: "high" },
    { user_id: userId, name: "Security Audit", description: "Comprehensive security review and penetration testing.", status: "Completed", progress: 100, team_size: 1, budget: 1500, deadline: "2026-03-01", priority: "low" },
  ]).select("id");

  await supabase.from("enterprise_consultations").insert([
    { user_id: userId, expert_name: "Victor Z.", topic: "ML Architecture Review", scheduled_date: "2026-03-12", scheduled_time: "2:00 PM", status: "Scheduled", sp_cost: 150 },
    { user_id: userId, expert_name: "Niko A.", topic: "Cloud Migration Strategy", scheduled_date: "2026-03-15", scheduled_time: "10:00 AM", status: "Pending", sp_cost: 200 },
  ]);

  // 6. Listings
  await supabase.from("listings").insert([
    { user_id: userId, title: "Full-Stack Web App Development", description: "Build modern React + Node.js applications.", category: "Development", price: "500 SP", status: "Active", views: 234, inquiries: 12 },
    { user_id: userId, title: "System Architecture Review", description: "Review and optimize your app architecture.", category: "Consulting", price: "300 SP", status: "Active", views: 156, inquiries: 8 },
  ]);

  return new Response(JSON.stringify({ success: true, userId, guildId }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
