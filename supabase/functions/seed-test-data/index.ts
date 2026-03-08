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

  // Get user ID (either from creation or lookup)
  let userId = userData?.user?.id;
  if (!userId) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const found = users?.users?.find((u: any) => u.email === "Admin123@skillswappr.com");
    userId = found?.id;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not find/create user" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // 2. Update profile with rich data
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
      { role: "CTO", company: "SkillSwappr", period: "2024 – Present", description: "Leading platform development and engineering team." },
      { role: "Senior Engineer", company: "Meta", period: "2021 – 2024", description: "Worked on React core team and internal developer tools." },
      { role: "Full-Stack Developer", company: "Stripe", period: "2019 – 2021", description: "Built payment infrastructure serving millions of transactions." },
    ],
    education_history: [
      { school: "Stanford University", degree: "M.S. Computer Science", period: "2017 – 2019" },
      { school: "MIT", degree: "B.S. Computer Science", period: "2013 – 2017" },
    ],
    certificates: [
      { name: "AWS Solutions Architect", issuer: "Amazon", date: "2023", verified: true },
      { name: "Google Cloud Professional", issuer: "Google", date: "2022", verified: true },
    ],
    portfolio_items: [
      { title: "SkillSwappr Platform", description: "The skill exchange marketplace", image: "" },
      { title: "Payment Dashboard", description: "Real-time analytics for transactions", image: "" },
    ],
    interests: ["Open Source", "EdTech", "AI/ML", "Community Building"],
    needs: ["Design Feedback", "Content Writers", "Beta Testers"],
  }).eq("user_id", userId);

  // 3. Give admin role
  await supabase.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  // 4. Create a test guild
  const { data: guildData } = await supabase.from("guilds").insert({
    name: "Code Collective",
    description: "An elite guild of full-stack developers, designers, and architects. We tackle the most challenging projects and mentor the next generation of tech talent.",
    slogan: "Build. Ship. Repeat.",
    category: "Engineering",
    rank: 1,
    is_public: true,
    total_sp: 125000,
    total_gigs: 847,
    avg_elo: 2100,
    win_rate: 78,
    created_by: userId,
    requirements: ["ELO 1500+", "3+ completed gigs", "Portfolio review", "Code challenge pass"],
    perks: ["Priority project access", "Monthly SP bonus", "Mentorship program", "Exclusive workshops", "Guild War participation"],
  }).select("id").single();

  const guildId = guildData?.id;

  if (guildId) {
    // Add admin as Guild Master
    await supabase.from("guild_members").insert({
      guild_id: guildId,
      user_id: userId,
      role: "Guild Master",
    });

    // Get badge and achievement IDs
    const { data: badges } = await supabase.from("badges").select("id, name").limit(5);
    const { data: achievements } = await supabase.from("achievements").select("id, name").limit(6);

    // Award badges to guild
    if (badges && badges.length > 0) {
      await supabase.from("guild_badges").insert(
        badges.slice(0, 3).map((b: any) => ({ guild_id: guildId, badge_id: b.id }))
      );
      // Award badges to user
      await supabase.from("user_badges").insert(
        badges.map((b: any) => ({ user_id: userId, badge_id: b.id }))
      );
    }

    // Award achievements
    if (achievements && achievements.length > 0) {
      await supabase.from("guild_achievements").insert(
        achievements.slice(0, 3).map((a: any, i: number) => ({
          guild_id: guildId,
          achievement_id: a.id,
          progress: i === 0 ? 100 : 50 + i * 15,
          completed: i === 0,
          completed_at: i === 0 ? new Date().toISOString() : null,
        }))
      );
      await supabase.from("user_achievements").insert(
        achievements.map((a: any, i: number) => ({
          user_id: userId,
          achievement_id: a.id,
          progress: i < 2 ? 100 : 30 + i * 10,
          completed: i < 2,
          completed_at: i < 2 ? new Date().toISOString() : null,
        }))
      );
    }
  }

  // 5. Create test listings
  await supabase.from("listings").insert([
    { user_id: userId, title: "Full-Stack Web App Development", description: "Build modern React + Node.js applications from scratch.", category: "Development", price: "500 SP", status: "Active", views: 234, inquiries: 12 },
    { user_id: userId, title: "System Architecture Review", description: "Review and optimize your app architecture for scalability.", category: "Consulting", price: "300 SP", status: "Active", views: 156, inquiries: 8 },
    { user_id: userId, title: "TypeScript Migration", description: "Migrate your JavaScript codebase to TypeScript with best practices.", category: "Development", price: "400 SP", status: "Paused", views: 89, inquiries: 4 },
  ]);

  return new Response(JSON.stringify({ success: true, userId, guildId }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
