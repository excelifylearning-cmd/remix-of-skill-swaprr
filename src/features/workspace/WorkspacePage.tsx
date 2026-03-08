import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Pencil, Video, FileText, Send, Paperclip,
  Smile, Phone, PhoneOff, Mic, MicOff, Monitor, Settings, Clock,
  CheckCircle2, Circle, Lock, Shield, Coins, Flag, FileImage, File,
  Download, Plus, ZoomIn, ZoomOut, MousePointer2, Square,
  Circle as CircleIcon, Minus, Type, Eraser, Upload, AlertTriangle,
  Layers, Bot, Package, Gavel, ChevronRight, Copy, Bell, BellOff,
  Archive, ExternalLink, Eye, X
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import { logActivity, logInteraction, logPageView } from "@/lib/activity-logger";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

type Panel = "chat" | "whiteboard" | "video" | "files" | "stages" | "escrow" | "submit" | "dispute" | "settings";

interface WsMessage {
  id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

interface WsFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: string;
  file_type: string;
  version: number;
  uploaded_by: string;
  created_at: string;
}

interface WsStage {
  id: string;
  name: string;
  status: string;
  sp_allocated: number;
  order_index: number;
  completed_at: string | null;
}

interface Escrow {
  id: string;
  workspace_id: string;
  buyer_id: string;
  seller_id: string;
  total_sp: number;
  released_sp: number;
  status: string;
  terms: any;
  created_at: string;
}

interface WsDispute {
  id: string;
  reason: string;
  status: string;
  outcome: string | null;
  created_at: string;
  filed_by: string;
}

interface WsDeliverable {
  id: string;
  title: string;
  description: string;
  status: string;
  reviewer_notes: string | null;
  created_at: string;
  submitted_by: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR NAV CONFIG
═══════════════════════════════════════════════════════════════════════════ */

const sidebarSections = [
  {
    label: "Communication",
    items: [
      { id: "chat" as Panel, icon: MessageSquare, label: "Chat" },
      { id: "whiteboard" as Panel, icon: Pencil, label: "Whiteboard" },
      { id: "video" as Panel, icon: Video, label: "Video" },
      { id: "files" as Panel, icon: FileText, label: "Files" },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "stages" as Panel, icon: Layers, label: "Stages" },
      { id: "escrow" as Panel, icon: Coins, label: "Escrow" },
      { id: "submit" as Panel, icon: Package, label: "Submit" },
      { id: "dispute" as Panel, icon: Gavel, label: "Dispute" },
    ],
  },
  {
    label: "Other",
    items: [
      { id: "settings" as Panel, icon: Settings, label: "Settings" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CHAT PANEL
═══════════════════════════════════════════════════════════════════════════ */

const ChatPanel = ({ workspaceId, userId, partnerName }: { workspaceId: string; userId: string | null; partnerName: string }) => {
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("workspace_messages")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data) setMessages(data as WsMessage[]);
  }, [workspaceId]);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`ws-chat-${workspaceId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "workspace_messages", filter: `workspace_id=eq.${workspaceId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as WsMessage])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [workspaceId, fetchMessages]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!newMsg.trim() || !userId) return;
    await supabase.from("workspace_messages").insert({ workspace_id: workspaceId, sender_id: userId, content: newMsg.trim(), message_type: "text" });
    logActivity("workspace:message_sent", { entity_type: "workspace", entity_id: workspaceId, context: { message_length: newMsg.trim().length } });
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-badge-gold/10 font-mono text-sm font-bold text-badge-gold">
            {partnerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{partnerName}</p>
            <p className="text-xs text-skill-green">Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-foreground text-background rounded-br-md" : "bg-surface-2 text-foreground rounded-bl-md"}`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-background/60" : "text-muted-foreground"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <button onClick={send} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   WHITEBOARD PANEL (placeholder)
═══════════════════════════════════════════════════════════════════════════ */

const WhiteboardPanel = () => {
  const [tool, setTool] = useState("select");
  const [color, setColor] = useState("#ffffff");
  const tools = [
    { id: "select", icon: MousePointer2 }, { id: "pen", icon: Pencil }, { id: "rectangle", icon: Square },
    { id: "circle", icon: CircleIcon }, { id: "line", icon: Minus }, { id: "text", icon: Type }, { id: "eraser", icon: Eraser },
  ];
  const colors = ["#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          {tools.map((t) => (
            <button key={t.id} onClick={() => { setTool(t.id); logInteraction("whiteboard_tool", { tool: t.id }); }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${tool === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-1"}`}>
              <t.icon size={16} />
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          {colors.map((c) => (
            <button key={c} onClick={() => setColor(c)} className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`} style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1"><ZoomOut size={16} /></button>
          <span className="text-xs text-muted-foreground px-2">100%</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1"><ZoomIn size={16} /></button>
        </div>
      </div>
      <div className="flex-1 bg-surface-1 flex items-center justify-center">
        <div className="text-center">
          <Pencil size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Collaborative whiteboard</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Draw together in real-time</p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   VIDEO PANEL (placeholder)
═══════════════════════════════════════════════════════════════════════════ */

const VideoPanel = ({ partnerName, workspaceId }: { partnerName: string; workspaceId: string }) => {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  const startCall = () => { setInCall(true); logActivity("workspace:video_start", { entity_type: "workspace", entity_id: workspaceId }); };
  const endCall = () => { setInCall(false); logActivity("workspace:video_end", { entity_type: "workspace", entity_id: workspaceId }); };

  return (
    <div className="flex flex-col h-full">
      {!inCall ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-court-blue/10 mx-auto mb-4">
              <Video size={32} className="text-court-blue" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Video Call</h3>
            <p className="text-sm text-muted-foreground mb-6">Connect face-to-face with your swap partner</p>
            <button onClick={startCall} className="inline-flex items-center gap-2 rounded-xl bg-court-blue px-6 py-3 text-sm font-semibold text-white hover:bg-court-blue/90 transition-colors">
              <Phone size={16} /> Start Call
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 bg-surface-1 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
              <div className="text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-badge-gold/10 mx-auto mb-2 font-mono text-3xl font-bold text-badge-gold">
                  {partnerName.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm text-foreground">{partnerName}</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-surface-3 border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">You</span>
            </div>
            {sharing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-alert-red/90 px-3 py-1.5">
                <Monitor size={14} className="text-white" /><span className="text-xs font-medium text-white">Sharing Screen</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 border-t border-border py-4">
            <button onClick={() => setMuted(!muted)} className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${muted ? "bg-alert-red text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}>
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button onClick={() => setVideoOn(!videoOn)} className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${!videoOn ? "bg-alert-red text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}>
              <Video size={20} />
            </button>
            <button onClick={() => setSharing(!sharing)} className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${sharing ? "bg-skill-green text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}>
              <Monitor size={20} />
            </button>
            <button onClick={endCall} className="flex h-12 w-12 items-center justify-center rounded-full bg-alert-red text-white hover:bg-alert-red/90 transition-colors">
              <PhoneOff size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   FILES PANEL
═══════════════════════════════════════════════════════════════════════════ */

const FilesPanel = ({ workspaceId, userId }: { workspaceId: string; userId: string | null }) => {
  const [files, setFiles] = useState<WsFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspace_files").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      if (data) setFiles(data as WsFile[]);
    })();
  }, [workspaceId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    const path = `${workspaceId}/${userId}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("workspace-files").upload(path, file);
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("workspace-files").getPublicUrl(path);
    await supabase.from("workspace_files").insert({ workspace_id: workspaceId, uploaded_by: userId, file_name: file.name, file_url: publicUrl, file_size: `${(file.size / 1024).toFixed(0)} KB`, file_type: file.type.split("/")[0] || "file" });
    logActivity("workspace:file_upload", { entity_type: "workspace", entity_id: workspaceId, context: { file_name: file.name, file_size: file.size } });
    const { data: refreshed } = await supabase.from("workspace_files").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (refreshed) setFiles(refreshed as WsFile[]);
    setUploading(false);
    toast.success("File uploaded");
  };

  const getIcon = (t: string) => (t === "image" ? FileImage : t === "application" ? FileText : File);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-medium text-foreground">Shared Files</h3>
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-50">
          <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {files.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No files shared yet</p>}
        {files.map((f) => {
          const Icon = getIcon(f.file_type);
          return (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-foreground/15 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2"><Icon size={18} className="text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.file_name}</p>
                <p className="text-xs text-muted-foreground">{f.file_size} · v{f.version} · {new Date(f.created_at).toLocaleDateString()}</p>
              </div>
              {f.file_url && (
                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1"
                  onClick={() => logActivity("workspace:file_download", { entity_type: "workspace", entity_id: f.id })}>
                  <Download size={14} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   STAGES PANEL
═══════════════════════════════════════════════════════════════════════════ */

const StagesPanel = ({ workspaceId, userId, escrow, onTransactionCreated }: { workspaceId: string; userId: string | null; escrow: Escrow | null; onTransactionCreated: (code: string) => void }) => {
  const [stages, setStages] = useState<WsStage[]>([]);
  const [completing, setCompleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspace_stages").select("*").eq("workspace_id", workspaceId).order("order_index", { ascending: true });
      if (data) setStages(data as WsStage[]);
    })();
  }, [workspaceId]);

  const markComplete = async (stage: WsStage) => {
    await supabase.from("workspace_stages").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", stage.id);
    const nextIdx = stage.order_index + 1;
    await supabase.from("workspace_stages").update({ status: "active" }).eq("workspace_id", workspaceId).eq("order_index", nextIdx);
    logActivity("workspace:stage_completed", { entity_type: "workspace", entity_id: workspaceId, context: { stage_name: stage.name, sp_allocated: stage.sp_allocated } });
    toast.success(`Stage "${stage.name}" completed!`);
    const { data } = await supabase.from("workspace_stages").select("*").eq("workspace_id", workspaceId).order("order_index", { ascending: true });
    if (data) setStages(data as WsStage[]);
  };

  const completeGig = async () => {
    if (!escrow || !userId) return;
    setCompleting(true);
    try {
      // Fetch all workspace data for the transaction
      const [msgRes, fileRes, delRes] = await Promise.all([
        supabase.from("workspace_messages").select("*").eq("workspace_id", workspaceId),
        supabase.from("workspace_files").select("*").eq("workspace_id", workspaceId),
        supabase.from("workspace_deliverables").select("*").eq("workspace_id", workspaceId),
      ]);

      const { createWorkspaceTransaction } = await import("@/lib/transaction-generator");
      const { code, error } = await createWorkspaceTransaction({
        workspaceId,
        escrow,
        stages,
        messages: msgRes.data || [],
        files: fileRes.data || [],
        deliverables: delRes.data || [],
      });

      if (error) {
        toast.error(`Transaction failed: ${error}`);
      } else {
        // Update escrow to released
        await supabase.from("escrow_contracts").update({ status: "released", released_sp: escrow.total_sp, updated_at: new Date().toISOString() }).eq("id", escrow.id);
        toast.success(`Gig completed! Transaction: ${code}`, {
          action: { label: "View", onClick: () => navigate(`/transaction?code=${code}`) },
          duration: 10000,
        });
        onTransactionCreated(code);
        logActivity("workspace:gig_completed", { entity_type: "workspace", entity_id: workspaceId, context: { transaction_code: code, total_sp: escrow.total_sp } });
      }
    } catch (e: any) {
      toast.error("Failed to complete gig");
    }
    setCompleting(false);
  };

  const completed = stages.filter((s) => s.status === "completed").length;
  const allDone = stages.length > 0 && completed === stages.length;
  const progress = stages.length > 0 ? (completed / stages.length) * 100 : 0;
  const totalSP = stages.reduce((a, s) => a + s.sp_allocated, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Gig Progress</h3>
          <Badge className="bg-skill-green/10 text-skill-green border-none">{completed}/{stages.length} Stages</Badge>
        </div>
        <Progress value={progress} className="h-2 mb-3" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total: {totalSP} SP allocated</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Complete Gig Button */}
      {allDone && escrow && escrow.status !== "released" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={completeGig} disabled={completing}
            className="w-full rounded-2xl bg-skill-green py-4 text-sm font-bold text-background hover:bg-skill-green/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            {completing ? "Generating Transaction..." : "Complete Gig & Release Escrow"}
          </button>
          <p className="text-xs text-muted-foreground text-center mt-2">This will release {escrow.total_sp} SP and generate a verifiable transaction ID</p>
        </motion.div>
      )}

      {escrow?.status === "released" && (
        <div className="mb-6 rounded-2xl border border-skill-green/20 bg-skill-green/5 p-4 text-center">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-skill-green" />
          <p className="text-sm font-medium text-foreground">Gig Completed & Escrow Released</p>
          <p className="text-xs text-muted-foreground mt-1">All SP has been distributed</p>
        </div>
      )}

      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.id} className={`rounded-xl border p-4 ${stage.status === "completed" ? "border-skill-green/20 bg-skill-green/5" : stage.status === "active" ? "border-foreground/20 bg-card" : "border-border bg-surface-1"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stage.status === "completed" ? "bg-skill-green/10" : stage.status === "active" ? "bg-foreground" : "bg-surface-2"}`}>
                {stage.status === "completed" ? <CheckCircle2 size={16} className="text-skill-green" /> : stage.status === "active" ? <Circle size={16} className="text-background" /> : <Lock size={14} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${stage.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>{stage.name}</p>
                <p className="text-xs text-muted-foreground">{stage.sp_allocated} SP · {stage.completed_at ? `Completed ${new Date(stage.completed_at).toLocaleDateString()}` : stage.status}</p>
              </div>
              {stage.status === "active" && (
                <button onClick={() => markComplete(stage)} className="rounded-lg bg-skill-green px-3 py-1.5 text-xs font-medium text-background hover:bg-skill-green/90 transition-colors">
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
        {stages.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No stages configured for this workspace</p>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ESCROW PANEL
═══════════════════════════════════════════════════════════════════════════ */

const EscrowPanel = ({ escrow, stages }: { escrow: Escrow | null; stages: WsStage[] }) => {
  useEffect(() => { logInteraction("escrow_viewed"); }, []);

  if (!escrow) return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <Coins size={48} className="mb-4 opacity-30" />
      <p className="text-sm">No escrow contract found for this workspace</p>
    </div>
  );

  const releasedPct = escrow.total_sp > 0 ? (escrow.released_sp / escrow.total_sp) * 100 : 0;
  const statusColors: Record<string, string> = { held: "bg-badge-gold/10 text-badge-gold", partial_release: "bg-court-blue/10 text-court-blue", released: "bg-skill-green/10 text-skill-green", refunded: "bg-alert-red/10 text-alert-red", disputed: "bg-alert-red/10 text-alert-red" };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground flex items-center gap-2"><Shield size={16} className="text-court-blue" /> Escrow Contract</h3>
          <Badge className={`border-none ${statusColors[escrow.status] || "bg-surface-2 text-muted-foreground"}`}>{escrow.status.replace("_", " ").toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-surface-1 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{escrow.total_sp}</p>
            <p className="text-xs text-muted-foreground">Total SP</p>
          </div>
          <div className="rounded-xl bg-surface-1 p-3 text-center">
            <p className="text-2xl font-bold text-skill-green">{escrow.released_sp}</p>
            <p className="text-xs text-muted-foreground">Released</p>
          </div>
          <div className="rounded-xl bg-surface-1 p-3 text-center">
            <p className="text-2xl font-bold text-badge-gold">{escrow.total_sp - escrow.released_sp}</p>
            <p className="text-xs text-muted-foreground">Held</p>
          </div>
        </div>
        <Progress value={releasedPct} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground text-right">{Math.round(releasedPct)}% released</p>
      </div>

      <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-court-blue" />
          <span className="text-sm font-medium text-foreground">SP Insurance Active</span>
        </div>
        <p className="text-xs text-muted-foreground">Your SP is protected. If the swap is abandoned, you'll be refunded based on stage progress.</p>
      </div>

      {stages.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">SP per Stage</h4>
          <div className="space-y-2">
            {stages.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className={s.status === "completed" ? "text-skill-green" : "text-muted-foreground"}>{s.name}</span>
                <span className="font-mono text-foreground">{s.sp_allocated} SP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SUBMIT DELIVERABLE PANEL
═══════════════════════════════════════════════════════════════════════════ */

const SubmitPanel = ({ workspaceId, userId }: { workspaceId: string; userId: string | null }) => {
  const [deliverables, setDeliverables] = useState<WsDeliverable[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("workspace_deliverables").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (data) setDeliverables(data as WsDeliverable[]);
  }, [workspaceId]);

  useEffect(() => { fetch(); }, [fetch]);

  const submit = async () => {
    if (!title.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from("workspace_deliverables").insert({ workspace_id: workspaceId, submitted_by: userId, title: title.trim(), description: desc.trim() });
    logActivity("workspace:deliverable_submitted", { entity_type: "workspace", entity_id: workspaceId, context: { title: title.trim() } });
    toast.success("Deliverable submitted!");
    setTitle(""); setDesc("");
    await fetch();
    setSubmitting(false);
  };

  const statusBadge: Record<string, string> = { pending: "bg-badge-gold/10 text-badge-gold", accepted: "bg-skill-green/10 text-skill-green", revision_requested: "bg-court-blue/10 text-court-blue", rejected: "bg-alert-red/10 text-alert-red" };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2"><Package size={16} className="text-court-blue" /> Submit Deliverable</h3>
        <div className="space-y-3">
          <Input placeholder="Deliverable title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-surface-1 border-border" />
          <Textarea placeholder="Description of what you're submitting..." value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-surface-1 border-border min-h-[80px]" />
          <button onClick={submit} disabled={submitting || !title.trim()} className="w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50 hover:opacity-90 transition-opacity">
            {submitting ? "Submitting..." : "Submit Work"}
          </button>
        </div>
      </div>

      <h4 className="text-sm font-medium text-foreground mb-3">History</h4>
      <div className="space-y-2">
        {deliverables.length === 0 && <p className="text-sm text-muted-foreground text-center">No submissions yet</p>}
        {deliverables.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-foreground">{d.title}</p>
              <Badge className={`border-none text-[10px] ${statusBadge[d.status] || "bg-surface-2"}`}>{d.status.replace("_", " ")}</Badge>
            </div>
            {d.description && <p className="text-xs text-muted-foreground mb-1">{d.description}</p>}
            {d.reviewer_notes && <p className="text-xs text-court-blue mt-1">📝 {d.reviewer_notes}</p>}
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DISPUTE PANEL
═══════════════════════════════════════════════════════════════════════════ */

const DisputePanel = ({ workspaceId, userId, escrow }: { workspaceId: string; userId: string | null; escrow: Escrow | null }) => {
  const [disputes, setDisputes] = useState<WsDispute[]>([]);
  const [reason, setReason] = useState("");
  const [filing, setFiling] = useState(false);

  const fetchDisputes = useCallback(async () => {
    const { data } = await supabase.from("workspace_disputes").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (data) setDisputes(data as WsDispute[]);
  }, [workspaceId]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  const fileDispute = async () => {
    if (!reason.trim() || !userId || !escrow) return;
    setFiling(true);
    const filedAgainst = escrow.buyer_id === userId ? escrow.seller_id : escrow.buyer_id;
    await supabase.from("workspace_disputes").insert({ workspace_id: workspaceId, filed_by: userId, filed_against: filedAgainst, reason: reason.trim() });
    logActivity("workspace:dispute_filed", { entity_type: "workspace", entity_id: workspaceId, context: { reason: reason.trim() } });
    toast.success("Dispute filed. Our team will review it.");
    setReason("");
    await fetchDisputes();
    setFiling(false);
  };

  const statusColor: Record<string, string> = { open: "bg-badge-gold/10 text-badge-gold", under_review: "bg-court-blue/10 text-court-blue", resolved: "bg-skill-green/10 text-skill-green" };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-alert-red/20 bg-alert-red/5 p-5 mb-6">
        <h3 className="font-medium text-foreground mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-alert-red" /> Open a Dispute</h3>
        <p className="text-xs text-muted-foreground mb-4">Filing a dispute will freeze escrow and notify both parties. Our mediation team will review the case.</p>
        <Textarea placeholder="Describe the issue in detail..." value={reason} onChange={(e) => setReason(e.target.value)} className="bg-surface-1 border-border min-h-[100px] mb-3" />
        <button onClick={fileDispute} disabled={filing || !reason.trim()} className="w-full rounded-xl bg-alert-red py-2.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-alert-red/90 transition-colors">
          {filing ? "Filing..." : "File Dispute"}
        </button>
      </div>

      <h4 className="text-sm font-medium text-foreground mb-3">Dispute History</h4>
      <div className="space-y-2">
        {disputes.length === 0 && <p className="text-sm text-muted-foreground text-center">No disputes filed — great!</p>}
        {disputes.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-1">
              <Badge className={`border-none text-[10px] ${statusColor[d.status] || "bg-surface-2"}`}>{d.status.replace("_", " ")}</Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-foreground">{d.reason}</p>
            {d.outcome && <p className="text-xs text-skill-green mt-1">Outcome: {d.outcome}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS PANEL
═══════════════════════════════════════════════════════════════════════════ */

const SettingsPanel = ({ workspaceId, escrow, partnerName }: { workspaceId: string; escrow: Escrow | null; partnerName: string }) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <h3 className="font-medium text-foreground mb-6 flex items-center gap-2"><Settings size={16} /> Workspace Settings</h3>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Workspace Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Workspace ID</span><span className="font-mono text-foreground text-xs">{workspaceId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Partner</span><span className="text-foreground">{partnerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Escrow Status</span><span className="text-foreground">{escrow?.status || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="text-foreground">{escrow?.created_at ? new Date(escrow.created_at).toLocaleDateString() : "N/A"}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Preferences</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notifications ? <Bell size={16} className="text-foreground" /> : <BellOff size={16} className="text-muted-foreground" />}
              <span className="text-sm text-foreground">Notifications</span>
            </div>
            <button onClick={() => { setNotifications(!notifications); logInteraction("workspace_settings_toggle", { setting: "notifications", value: !notifications }); }}
              className={`relative w-10 h-5 rounded-full transition-colors ${notifications ? "bg-skill-green" : "bg-surface-3"}`}>
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Actions</h4>
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-1 flex items-center justify-center gap-2 transition-colors">
              <Archive size={14} /> Archive Workspace
            </button>
            <button className="w-full rounded-lg border border-alert-red/20 py-2 text-sm text-alert-red hover:bg-alert-red/5 flex items-center justify-center gap-2 transition-colors">
              <X size={14} /> Leave Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN WORKSPACE PAGE
═══════════════════════════════════════════════════════════════════════════ */

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activePanel, setActivePanel] = useState<Panel>("chat");
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [stages, setStages] = useState<WsStage[]>([]);
  const workspaceId = id || "demo-workspace-001";
  const userId = user?.id || null;

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    logPageView("workspace");
    logActivity("workspace:opened", { entity_type: "workspace", entity_id: workspaceId });
  }, [workspaceId]);

  // Fetch escrow + stages
  useEffect(() => {
    (async () => {
      const { data: esc } = await supabase.from("escrow_contracts").select("*").eq("workspace_id", workspaceId).maybeSingle();
      if (esc) setEscrow(esc as Escrow);
      const { data: stg } = await supabase.from("workspace_stages").select("*").eq("workspace_id", workspaceId).order("order_index", { ascending: true });
      if (stg) setStages(stg as WsStage[]);
    })();
  }, [workspaceId]);

  const switchPanel = (p: Panel) => {
    setActivePanel(p);
    logInteraction("workspace_tab_switch", { from: activePanel, to: p });
  };

  const partnerName = escrow ? (escrow.buyer_id === userId ? "Seller" : "Buyer") : "Partner";

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard?tab=my-gigs")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">Workspace</h1>
              <p className="text-xs text-muted-foreground">ID: {workspaceId.slice(0, 16)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {escrow && <Badge className="bg-skill-green/10 text-skill-green border-none">{escrow.total_sp} SP</Badge>}
            <Badge className="bg-surface-2 text-muted-foreground border-none capitalize">{escrow?.status || "No escrow"}</Badge>
          </div>
        </header>

        {/* Body: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav className="w-14 shrink-0 border-r border-border bg-surface-1 flex flex-col py-2 overflow-y-auto">
            {sidebarSections.map((section, si) => (
              <div key={section.label}>
                {si > 0 && <div className="mx-2 my-1.5 h-px bg-border" />}
                {section.items.map((item) => {
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => switchPanel(item.id)}
                      title={item.label}
                      className={`relative flex h-10 w-full items-center justify-center transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-foreground" />}
                      <item.icon size={18} />
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={activePanel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="h-full">
                {activePanel === "chat" && <ChatPanel workspaceId={workspaceId} userId={userId} partnerName={partnerName} />}
                {activePanel === "whiteboard" && <WhiteboardPanel />}
                {activePanel === "video" && <VideoPanel partnerName={partnerName} workspaceId={workspaceId} />}
                {activePanel === "files" && <FilesPanel workspaceId={workspaceId} userId={userId} />}
                {activePanel === "stages" && <StagesPanel workspaceId={workspaceId} userId={userId} escrow={escrow} />}
                {activePanel === "escrow" && <EscrowPanel escrow={escrow} stages={stages} />}
                {activePanel === "submit" && <SubmitPanel workspaceId={workspaceId} userId={userId} />}
                {activePanel === "dispute" && <DisputePanel workspaceId={workspaceId} userId={userId} escrow={escrow} />}
                {activePanel === "settings" && <SettingsPanel workspaceId={workspaceId} escrow={escrow} partnerName={partnerName} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default WorkspacePage;
