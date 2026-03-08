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

  // 3. Give admin role
  await supabase.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  // 4. Create a test guild
  const { data: guildData } = await supabase.from("guilds").insert({
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
    requirements: ["ELO 1500+", "3+ completed gigs"],
    perks: ["Priority project access", "Monthly SP bonus", "Mentorship program"],
  }).select("id").single();

  const guildId = guildData?.id;

  if (guildId) {
    await supabase.from("guild_members").insert({
      guild_id: guildId,
      user_id: userId,
      role: "Guild Master",
    });

    // Seed guild project
    await supabase.from("guild_projects").insert({
      guild_id: guildId,
      title: "Platform Redesign v3",
      client: "SkillSwappr",
      status: "In Progress",
      progress: 65,
      sp_pool: 5000,
      members_count: 4,
    });

    // Seed guild war
    await supabase.from("guild_wars").insert({
      guild_id: guildId,
      opponent_name: "Design Union",
      start_date: new Date().toISOString(),
      status: "Active",
      our_score: 3,
      their_score: 1,
      stakes: 2000,
    });

    const { data: badges } = await supabase.from("badges").select("id, name").limit(5);
    const { data: achievements } = await supabase.from("achievements").select("id, name").limit(6);

    if (badges && badges.length > 0) {
      await supabase.from("guild_badges").insert(badges.slice(0, 3).map((b: any) => ({ guild_id: guildId, badge_id: b.id })));
      await supabase.from("user_badges").insert(badges.map((b: any) => ({ user_id: userId, badge_id: b.id })));
    }

    if (achievements && achievements.length > 0) {
      await supabase.from("guild_achievements").insert(achievements.slice(0, 3).map((a: any, i: number) => ({
        guild_id: guildId, achievement_id: a.id, progress: i === 0 ? 100 : 50 + i * 15, completed: i === 0, completed_at: i === 0 ? new Date().toISOString() : null,
      })));
      await supabase.from("user_achievements").insert(achievements.map((a: any, i: number) => ({
        user_id: userId, achievement_id: a.id, progress: i < 2 ? 100 : 30 + i * 10, completed: i < 2, completed_at: i < 2 ? new Date().toISOString() : null,
      })));
    }
  }

  // 5. Create test listings
  await supabase.from("listings").insert([
    { user_id: userId, title: "Full-Stack Web App Development", description: "Build modern React + Node.js applications from scratch.", category: "Development", price: "500 SP", status: "Active", views: 234, inquiries: 12 },
    { user_id: userId, title: "System Architecture Review", description: "Review and optimize your app architecture for scalability.", category: "Consulting", price: "300 SP", status: "Active", views: 156, inquiries: 8 },
    { user_id: userId, title: "TypeScript Migration", description: "Migrate your JavaScript codebase to TypeScript.", category: "Development", price: "400 SP", status: "Paused", views: 89, inquiries: 4 },
  ]);

  // 6. Create enterprise project
  const { data: epData } = await supabase.from("enterprise_projects").insert({
    user_id: userId,
    name: "Campus Talent Pipeline",
    description: "Enterprise pilot program to connect Stanford CS students with internship-level gigs.",
    status: "In Progress",
    priority: "high",
    progress: 45,
    budget: 25000,
    team_size: 8,
    deadline: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
  }).select("id").single();

  // 7. Seed platform_metrics
  await supabase.from("platform_metrics").upsert({
    metric_date: new Date().toISOString().split("T")[0],
    total_users: 24531,
    total_gigs: 89204,
    points_circulated: 2400000,
    monthly_signups: 2431,
    monthly_revenue: "$593K",
    active_guilds: 1247,
    avg_satisfaction: 4.81,
    disputes_resolved: 4821,
    universities: 52,
    enterprise_clients: 128,
    format_distribution: [
      { format: "Direct Swap", pct: 38, count: 33897 },
      { format: "Auction", pct: 18, count: 16057 },
      { format: "Co-Creation", pct: 15, count: 13381 },
      { format: "Flash Market", pct: 12, count: 10704 },
      { format: "Skill Fusion", pct: 8, count: 7136 },
    ],
    economy_health: [
      { metric: "Inflation Rate", value: "1.2%", status: "healthy", target: "< 3%", desc: "Well below target. Tax mechanism working effectively." },
      { metric: "Velocity (Monthly)", value: "3.4x", status: "healthy", target: "> 2x", desc: "Points changing hands 3.4 times/month on average." },
      { metric: "Gini Coefficient", value: "0.31", status: "healthy", target: "< 0.40", desc: "Relatively equal distribution. No hoarding detected." },
      { metric: "Active Circulation", value: "78%", status: "healthy", target: "> 60%", desc: "78% of all minted points are actively circulating." },
      { metric: "Tax Revenue", value: "120K SP", status: "neutral", target: "—", desc: "Monthly tax collected. Funds challenges and prizes." },
      { metric: "New Minting", value: "45K SP", status: "neutral", target: "—", desc: "New points entering via signups, bonuses, and events." },
    ],
    revenue_breakdown: [
      { source: "Enterprise Subscriptions", amount: "$248K", pct: 42 },
      { source: "Premium Plans", amount: "$142K", pct: 24 },
      { source: "Transaction Fees", amount: "$89K", pct: 15 },
      { source: "University Licenses", amount: "$67K", pct: 11 },
      { source: "API Access", amount: "$47K", pct: 8 },
    ],
    retention_data: {
      cohorts: [
        { month: "Oct 2025", d1: 85, d7: 68, d30: 52, d90: 35 },
        { month: "Nov 2025", d1: 87, d7: 71, d30: 55, d90: 38 },
        { month: "Dec 2025", d1: 88, d7: 73, d30: 57, d90: 40 },
        { month: "Jan 2026", d1: 89, d7: 74, d30: 58, d90: null },
        { month: "Feb 2026", d1: 91, d7: 76, d30: null, d90: null },
        { month: "Mar 2026", d1: 92, d7: 78, d30: null, d90: null },
      ],
      avgSessionLength: "18 min", avgGigsPerUser: 3.6, churnRate: "4.2%", nps: 72,
    },
    community_impact: [
      { metric: "Skills Learned", value: 142000, suffix: "+", desc: "Individual skills exchanged" },
      { metric: "Hours Saved", value: 890000, suffix: "+", desc: "Estimated hours saved vs hiring" },
      { metric: "Connections Made", value: 67000, suffix: "+", desc: "Unique user connections formed" },
      { metric: "Countries Active", value: 72, suffix: "", desc: "Countries with active users" },
      { metric: "Forum Posts", value: 52400, suffix: "+", desc: "Community discussions" },
      { metric: "Guides Published", value: 240, suffix: "+", desc: "Educational guides authored" },
    ],
    platform_uptime: [
      { month: "Oct '25", uptime: 99.94, incidents: 2, avgResponse: "4m" },
      { month: "Nov '25", uptime: 99.97, incidents: 1, avgResponse: "3m" },
      { month: "Dec '25", uptime: 99.91, incidents: 3, avgResponse: "6m" },
      { month: "Jan '26", uptime: 99.98, incidents: 1, avgResponse: "2m" },
      { month: "Feb '26", uptime: 99.99, incidents: 0, avgResponse: "—" },
      { month: "Mar '26", uptime: 99.96, incidents: 1, avgResponse: "5m" },
    ],
    hall_of_fame: [
      { name: "The Admin", title: "Most Gigs Completed", value: "147 gigs", avatar: "TA", tier: "Diamond" },
      { name: "Code Collective", title: "Top Guild (ELO)", value: "2,100 ELO", avatar: "CC", tier: "Guild" },
    ],
    content_metrics: [
      { type: "Workspace Messages", count: "1.2M+", growth: "+24%" },
      { type: "Files Shared", count: "340K+", growth: "+31%" },
      { type: "Video Calls", count: "89K+", growth: "+45%" },
      { type: "Reviews Written", count: "67K+", growth: "+18%" },
      { type: "Portfolios Created", count: "12K+", growth: "+28%" },
      { type: "API Calls (Daily)", count: "2.1M", growth: "+62%" },
    ],
  }, { onConflict: "metric_date" });

  // 8. Seed quarterly_reports
  const quartersData = [
    {
      quarter_id: "q1-2026", label: "Q1 2026", period: "Jan – Mar 2026", status: "current",
      kpis: { users: 24531, gigs: 89204, points: 2400000, revenue: "$593K", guilds: 1247, universities: 52 },
      growth: { userGrowth: "+28.4%", gigGrowth: "+31.2%", revenueGrowth: "+42.1%", retentionRate: "91%" },
      highlights: ["Co-Creation Studio launched", "25,000 total gigs milestone", "Guild Wars Season 2 completed", "AI Quality Panel v2 deployed", "3 new university partnerships"],
      monthly_breakdown: [
        { month: "Jan", users: 19800, gigs: 26400, revenue: "$178K", newSignups: 2100 },
        { month: "Feb", users: 22100, gigs: 29800, revenue: "$194K", newSignups: 2300 },
        { month: "Mar", users: 24531, gigs: 33004, revenue: "$221K", newSignups: 2431 },
      ],
      top_skills: [
        { skill: "React / Next.js", gigs: 4210, growth: "+23%" },
        { skill: "UI/UX Design", gigs: 3890, growth: "+18%" },
        { skill: "AI/ML Engineering", gigs: 2140, growth: "+41%" },
        { skill: "Video Production", gigs: 2870, growth: "+15%" },
        { skill: "Data Science", gigs: 1890, growth: "+29%" },
      ],
    },
    {
      quarter_id: "q2-2026", label: "Q2 2026", period: "Apr – Jun 2026", status: "projected",
      kpis: { users: 32000, gigs: 120000, points: 3500000, revenue: "$820K", guilds: 1600, universities: 58 },
      growth: { userGrowth: "+30.5%", gigGrowth: "+34.5%", revenueGrowth: "+38.3%", retentionRate: "92%" },
      highlights: ["Mobile app launch (iOS + Android)", "50 new enterprise companies", "Skill Fusion becomes #2 format", "Multi-currency SP system live"],
      monthly_breakdown: [
        { month: "Apr", users: 27000, gigs: 36000, revenue: "$250K", newSignups: 2500 },
        { month: "May", users: 29500, gigs: 40000, revenue: "$275K", newSignups: 2500 },
        { month: "Jun", users: 32000, gigs: 44000, revenue: "$295K", newSignups: 2500 },
      ],
      top_skills: [
        { skill: "Mobile Development", gigs: 5200, growth: "+68%" },
        { skill: "AI/ML Engineering", gigs: 3800, growth: "+78%" },
        { skill: "React / Next.js", gigs: 5100, growth: "+21%" },
        { skill: "Blockchain/Web3", gigs: 1800, growth: "+120%" },
        { skill: "3D/AR Design", gigs: 2200, growth: "+45%" },
      ],
    },
    {
      quarter_id: "q3-2026", label: "Q3 2026", period: "Jul – Sep 2026", status: "projected",
      kpis: { users: 45000, gigs: 180000, points: 5200000, revenue: "$1.2M", guilds: 2100, universities: 72 },
      growth: { userGrowth: "+40.6%", gigGrowth: "+50.0%", revenueGrowth: "+46.3%", retentionRate: "93%" },
      highlights: ["Multi-language support for 12 markets", "API Marketplace with 50+ integrations", "100K gigs milestone", "University network expands to Asia-Pacific"],
      monthly_breakdown: [
        { month: "Jul", users: 36000, gigs: 55000, revenue: "$370K", newSignups: 4000 },
        { month: "Aug", users: 40000, gigs: 60000, revenue: "$400K", newSignups: 4000 },
        { month: "Sep", users: 45000, gigs: 65000, revenue: "$430K", newSignups: 5000 },
      ],
      top_skills: [
        { skill: "AI/ML Engineering", gigs: 8200, growth: "+116%" },
        { skill: "React / Next.js", gigs: 6400, growth: "+24%" },
        { skill: "Cloud Architecture", gigs: 3100, growth: "+89%" },
        { skill: "DevOps/SRE", gigs: 2800, growth: "+72%" },
        { skill: "Data Engineering", gigs: 3500, growth: "+55%" },
      ],
    },
    {
      quarter_id: "q4-2026", label: "Q4 2026", period: "Oct – Dec 2026", status: "projected",
      kpis: { users: 62000, gigs: 260000, points: 7800000, revenue: "$1.8M", guilds: 2800, universities: 100 },
      growth: { userGrowth: "+37.8%", gigGrowth: "+44.4%", revenueGrowth: "+50.0%", retentionRate: "94%" },
      highlights: ["100 university partnerships", "Platform break-even projected", "Skill Court AI v3 with 98% accuracy", "Corporate training vertical launches"],
      monthly_breakdown: [
        { month: "Oct", users: 50000, gigs: 80000, revenue: "$550K", newSignups: 5000 },
        { month: "Nov", users: 55000, gigs: 88000, revenue: "$600K", newSignups: 5000 },
        { month: "Dec", users: 62000, gigs: 92000, revenue: "$650K", newSignups: 7000 },
      ],
      top_skills: [
        { skill: "AI/ML Engineering", gigs: 12000, growth: "+146%" },
        { skill: "Full-Stack Dev", gigs: 9800, growth: "+53%" },
        { skill: "Product Design", gigs: 7200, growth: "+38%" },
        { skill: "Cybersecurity", gigs: 4100, growth: "+94%" },
        { skill: "Data Science", gigs: 5500, growth: "+61%" },
      ],
    },
  ];

  for (const q of quartersData) {
    await supabase.from("quarterly_reports").upsert(q, { onConflict: "quarter_id" });
  }

  // 9. Seed leaderboard achievements
  await supabase.from("leaderboard_achievements").insert([
    { user_name: "The Admin", badge: "🏆 First Diamond", achieved_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { user_name: "Code Collective", badge: "⚔️ Guild War Victory", achieved_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { user_name: "Marco R.", badge: "📊 100 Data Gigs", achieved_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { user_name: "Zara N.", badge: "🔥 21-Day Streak", achieved_at: new Date(Date.now() - 6 * 86400000).toISOString() },
    { user_name: "Design Union", badge: "👥 30+ Members", achieved_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { user_name: "The Admin", badge: "💎 Diamond Tier", achieved_at: new Date(Date.now() - 8 * 86400000).toISOString() },
    { user_name: "Liam K.", badge: "⚡ 50 Quick Gigs", achieved_at: new Date(Date.now() - 9 * 86400000).toISOString() },
    { user_name: "Priya S.", badge: "🎨 Design Master", achieved_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  ]);

  // 10. Seed ranking_history
  await supabase.from("ranking_history").insert([
    {
      category: "global",
      snapshot_date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
      rankings: [{ name: "The Admin", elo: 2450, rank: 1 }],
      changes: [
        { name: "The Admin", from: 2, to: 1, elo: 2450 },
        { name: "Marco R.", from: 1, to: 2, elo: 2380 },
        { name: "Zara N.", from: 5, to: 3, elo: 2210 },
      ],
    },
    {
      category: "global",
      snapshot_date: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      rankings: [{ name: "Marco R.", elo: 2400, rank: 1 }],
      changes: [
        { name: "Marco R.", from: 3, to: 1, elo: 2400 },
        { name: "Liam K.", from: 4, to: 2, elo: 2350 },
        { name: "The Admin", from: 1, to: 3, elo: 2320 },
        { name: "Priya S.", from: 6, to: 4, elo: 2180 },
      ],
    },
    {
      category: "global",
      snapshot_date: new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0],
      rankings: [{ name: "The Admin", elo: 2320, rank: 1 }],
      changes: [
        { name: "Code Collective", from: 3, to: 1, elo: 2100 },
        { name: "Design Union", from: 1, to: 2, elo: 2050 },
      ],
    },
  ]);

  // 11. Seed workspace data (escrow, stages, messages, files, deliverable)
  const wsId = "demo-workspace-001";

  // Create a second user for the partner side
  const { data: partnerData } = await supabase.auth.admin.createUser({
    email: "partner@skillswappr.com",
    password: "Partner123!",
    email_confirm: true,
    user_metadata: { full_name: "James T." },
  });
  let partnerId = partnerData?.user?.id;
  if (!partnerId) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const found = users?.users?.find((u: any) => u.email === "partner@skillswappr.com");
    partnerId = found?.id;
  }

  if (partnerId) {
    // Escrow contract
    await supabase.from("escrow_contracts").upsert({
      workspace_id: wsId,
      buyer_id: userId,
      seller_id: partnerId,
      total_sp: 30,
      released_sp: 8,
      status: "partial_release",
      terms: { insurance: true, auto_release: false, deadline: "2026-03-15" },
    }, { onConflict: "workspace_id" });

    // Stages
    const stagesData = [
      { workspace_id: wsId, name: "Requirements", status: "completed", sp_allocated: 5, order_index: 0, completed_at: "2026-03-02T10:00:00Z" },
      { workspace_id: wsId, name: "First Draft", status: "completed", sp_allocated: 8, order_index: 1, completed_at: "2026-03-06T14:00:00Z" },
      { workspace_id: wsId, name: "Revisions", status: "active", sp_allocated: 7, order_index: 2, completed_at: null },
      { workspace_id: wsId, name: "Final Delivery", status: "locked", sp_allocated: 5, order_index: 3, completed_at: null },
      { workspace_id: wsId, name: "Acceptance", status: "locked", sp_allocated: 5, order_index: 4, completed_at: null },
    ];
    // Delete old stages first to avoid duplicates
    await supabase.from("workspace_stages").delete().eq("workspace_id", wsId);
    await supabase.from("workspace_stages").insert(stagesData);

    // Messages
    await supabase.from("workspace_messages").delete().eq("workspace_id", wsId);
    const msgs = [
      { workspace_id: wsId, sender_id: partnerId, content: "Hey! Excited to work on this together 🎨", message_type: "text" },
      { workspace_id: wsId, sender_id: userId, content: "Same here! I've attached my initial concepts", message_type: "text" },
      { workspace_id: wsId, sender_id: partnerId, content: "These look great! I especially like option 2", message_type: "text" },
      { workspace_id: wsId, sender_id: userId, content: "Perfect, I'll refine that one. When can you start on the React components?", message_type: "text" },
      { workspace_id: wsId, sender_id: partnerId, content: "I can start tomorrow. I'll need the design specs for the dashboard", message_type: "text" },
      { workspace_id: wsId, sender_id: userId, content: "I'll have them ready by tonight. The color palette is in the brand_guidelines.pdf", message_type: "text" },
      { workspace_id: wsId, sender_id: partnerId, content: "Got it! I'll review everything and start first thing in the morning", message_type: "text" },
      { workspace_id: wsId, sender_id: userId, content: "Sounds good. Let me know if you need anything else 🚀", message_type: "text" },
      { workspace_id: wsId, sender_id: partnerId, content: "The first draft is looking solid. Made some tweaks to the nav", message_type: "text" },
      { workspace_id: wsId, sender_id: userId, content: "Love the nav changes! Let's move to revisions stage", message_type: "text" },
    ];
    await supabase.from("workspace_messages").insert(msgs);

    // Files
    await supabase.from("workspace_files").delete().eq("workspace_id", wsId);
    await supabase.from("workspace_files").insert([
      { workspace_id: wsId, uploaded_by: userId, file_name: "logo_concepts_v1.fig", file_url: "", file_size: "2.4 MB", file_type: "application", version: 1 },
      { workspace_id: wsId, uploaded_by: userId, file_name: "brand_guidelines.pdf", file_url: "", file_size: "1.2 MB", file_type: "application", version: 1 },
      { workspace_id: wsId, uploaded_by: partnerId, file_name: "dashboard_wireframe.png", file_url: "", file_size: "856 KB", file_type: "image", version: 1 },
    ]);

    // Deliverable
    await supabase.from("workspace_deliverables").delete().eq("workspace_id", wsId);
    const { data: stageRows } = await supabase.from("workspace_stages").select("id").eq("workspace_id", wsId).eq("order_index", 0).single();
    await supabase.from("workspace_deliverables").insert({
      workspace_id: wsId,
      submitted_by: userId,
      stage_id: stageRows?.id || null,
      title: "Requirements Document v1",
      description: "Full requirements spec including user stories, acceptance criteria, and wireframes.",
      status: "accepted",
    });
  }

  // Build links
  const links = {
    dashboard: "/dashboard",
    profile: `/profile/${userId}`,
    guild: guildId ? `/guild/${guildId}` : null,
    guildDashboard: guildId ? `/guild-dashboard/${guildId}` : null,
    enterpriseDashboard: "/enterprise-dashboard",
    workspace: `/workspace/demo-workspace-001`,
    leaderboard: "/leaderboard",
    analytics: "/analytics",
    marketplace: "/marketplace",
    login: "/login (Admin123@skillswappr.com / Admin123!)",
  };

  return new Response(JSON.stringify({ success: true, userId, partnerId, guildId, links }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
