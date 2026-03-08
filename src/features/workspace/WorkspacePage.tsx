import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Pencil, Video, FileText, Send, Paperclip,
  Phone, PhoneOff, Mic, MicOff, Monitor, Settings, Clock,
  CheckCircle2, Circle, Lock, Shield, Coins, Flag, FileImage, File,
  Download, Plus, ZoomIn, ZoomOut, MousePointer2, Square,
  Circle as CircleIcon, Minus, Type, Eraser, Upload, AlertTriangle,
  Layers, Bot, Package, Gavel, ChevronRight, Copy, Bell, BellOff,
  Archive, ExternalLink, Eye, X, Users, UserPlus, Crown, Edit3,
  EyeIcon, Trash2, Languages, AudioLines, StopCircle, Sparkles,
  ListChecks, RotateCcw, Star, MessageCircle
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

type Panel = "chat" | "whiteboard" | "video" | "files" | "stages" | "escrow" | "submit" | "dispute" | "settings" | "members" | "ai";

interface WsMessage { id: string; sender_id: string; content: string; message_type: string; created_at: string; translated_text?: Record<string, string> | null; }
interface WsFile { id: string; file_name: string; file_url: string; file_size: string; file_type: string; version: number; uploaded_by: string; created_at: string; access_level?: string; tags?: string[]; description?: string; }
interface WsStage { id: string; name: string; status: string; sp_allocated: number; order_index: number; completed_at: string | null; }
interface Escrow { id: string; workspace_id: string; buyer_id: string; seller_id: string; total_sp: number; released_sp: number; status: string; terms: any; created_at: string; }
interface WsDispute { id: string; reason: string; status: string; outcome: string | null; created_at: string; filed_by: string; }
interface WsDeliverable { id: string; title: string; description: string; status: string; reviewer_notes: string | null; created_at: string; submitted_by: string; requirements?: any[]; file_urls?: string[]; ai_quality_score?: number; ai_feedback?: string; revision_count?: number; max_revisions?: number; }
interface WsMember { id: string; workspace_id: string; user_id: string; role: string; status: string; invited_by: string | null; invited_at: string; accepted_at: string | null; }
interface VoiceMsg { id: string; workspace_id: string; sender_id: string; audio_url: string; duration_seconds: number; transcript: string | null; translated_text?: Record<string, string> | null; created_at: string; }

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workspace-ai`;
const AUTH_HEADER = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" };

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
    label: "System",
    items: [
      { id: "members" as Panel, icon: Users, label: "Members" },
      { id: "ai" as Panel, icon: Bot, label: "AI Assistant" },
      { id: "settings" as Panel, icon: Settings, label: "Settings" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

const callAI = async (body: any): Promise<string> => {
  try {
    const resp = await fetch(AI_URL, { method: "POST", headers: AUTH_HEADER, body: JSON.stringify(body) });
    if (!resp.ok) throw new Error("AI unavailable");
    const data = await resp.json();
    return data.result || "";
  } catch { return ""; }
};

const translateText = async (text: string, lang: string): Promise<string> => {
  return callAI({ action: "translate", content: text, targetLanguage: lang });
};

/* ═══════════════════════════════════════════════════════════════════════════
   CHAT PANEL — with voice messages + auto-translate
═══════════════════════════════════════════════════════════════════════════ */

const ChatPanel = ({ workspaceId, userId, partnerName, preferredLang }: { workspaceId: string; userId: string | null; partnerName: string; preferredLang: string }) => {
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [recording, setRecording] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const [{ data: msgs }, { data: voice }] = await Promise.all([
      supabase.from("workspace_messages").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: true }).limit(200),
      supabase.from("workspace_voice_messages").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: true }).limit(100),
    ]);
    if (msgs) setMessages(msgs as WsMessage[]);
    if (voice) setVoiceMessages(voice as VoiceMsg[]);
  }, [workspaceId]);

  useEffect(() => {
    fetchMessages();
    const channel = supabase.channel(`ws-chat-${workspaceId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "workspace_messages", filter: `workspace_id=eq.${workspaceId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as WsMessage]))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "workspace_voice_messages", filter: `workspace_id=eq.${workspaceId}` },
        (payload) => setVoiceMessages((prev) => [...prev, payload.new as VoiceMsg]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [workspaceId, fetchMessages]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, voiceMessages]);

  const send = async () => {
    if (!newMsg.trim() || !userId) return;
    const content = newMsg.trim();
    let translated: Record<string, string> = {};
    
    // Auto-translate if enabled
    if (autoTranslate && preferredLang !== "en") {
      const t = await translateText(content, preferredLang);
      if (t) translated[preferredLang] = t;
    }

    await supabase.from("workspace_messages").insert({ workspace_id: workspaceId, sender_id: userId, content, message_type: "text", translated_text: Object.keys(translated).length ? translated : null });
    logActivity("workspace:message_sent", { entity_type: "workspace", entity_id: workspaceId, context: { message_length: content.length, auto_translated: autoTranslate } });
    setNewMsg("");
  };

  const translateMessage = async (msg: WsMessage) => {
    setTranslating(msg.id);
    const translated = await translateText(msg.content, preferredLang || "en");
    if (translated) {
      await supabase.from("workspace_messages").update({ translated_text: { ...(msg.translated_text || {}), [preferredLang]: translated } }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, translated_text: { ...(m.translated_text || {}), [preferredLang]: translated } } : m));
    }
    setTranslating(null);
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        if (!userId) return;
        const path = `${workspaceId}/voice/${userId}/${Date.now()}.webm`;
        const { error } = await supabase.storage.from("workspace-files").upload(path, blob);
        if (error) { toast.error("Voice upload failed"); return; }
        const { data: { publicUrl } } = supabase.storage.from("workspace-files").getPublicUrl(path);
        await supabase.from("workspace_voice_messages").insert({ workspace_id: workspaceId, sender_id: userId, audio_url: publicUrl, duration_seconds: Math.round(chunksRef.current.length) });
        logActivity("workspace:voice_message_sent", { entity_type: "workspace", entity_id: workspaceId });
        toast.success("Voice message sent");
        fetchMessages();
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch { toast.error("Microphone access denied"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Merge text + voice into timeline
  const allItems = [
    ...messages.map(m => ({ ...m, type: "text" as const, ts: new Date(m.created_at).getTime() })),
    ...voiceMessages.map(v => ({ ...v, type: "voice" as const, sender_id: v.sender_id, ts: new Date(v.created_at).getTime() })),
  ].sort((a, b) => a.ts - b.ts);

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
        <button onClick={() => setAutoTranslate(!autoTranslate)} title={`Auto-translate: ${autoTranslate ? "ON" : "OFF"}`}
          className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors ${autoTranslate ? "bg-court-blue/10 text-court-blue" : "text-muted-foreground hover:text-foreground hover:bg-surface-1"}`}>
          <Languages size={14} />
          {autoTranslate ? "Auto" : "Translate"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {allItems.map((item) => {
          const isMe = item.sender_id === userId;
          if (item.type === "voice") {
            const v = item as VoiceMsg & { type: "voice"; ts: number };
            return (
              <motion.div key={`v-${v.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-foreground text-background rounded-br-md" : "bg-surface-2 text-foreground rounded-bl-md"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AudioLines size={14} />
                    <span className="text-xs font-medium">Voice Message</span>
                    <span className="text-[10px] opacity-60">{v.duration_seconds}s</span>
                  </div>
                  <audio src={v.audio_url} controls className="w-full h-8" style={{ filter: isMe ? "invert(1)" : "none" }} />
                  {v.transcript && <p className="text-xs mt-1 opacity-80">{v.transcript}</p>}
                  <p className={`text-[10px] mt-1 ${isMe ? "text-background/60" : "text-muted-foreground"}`}>
                    {new Date(v.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          }
          const m = item as WsMessage & { type: "text"; ts: number };
          const translated = m.translated_text && preferredLang && m.translated_text[preferredLang];
          return (
            <motion.div key={`m-${m.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-foreground text-background rounded-br-md" : "bg-surface-2 text-foreground rounded-bl-md"}`}>
                <p className="text-sm">{m.content}</p>
                {translated && <p className="text-xs mt-1 opacity-70 italic border-t border-current/10 pt-1">🌐 {translated}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <p className={`text-[10px] ${isMe ? "text-background/60" : "text-muted-foreground"}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {!isMe && !translated && (
                    <button onClick={() => translateMessage(m)} disabled={translating === m.id}
                      className={`text-[10px] flex items-center gap-0.5 ${isMe ? "text-background/40 hover:text-background/70" : "text-muted-foreground/50 hover:text-muted-foreground"}`}>
                      <Languages size={10} /> {translating === m.id ? "..." : "Translate"}
                    </button>
                  )}
                </div>
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
          {recording ? (
            <div className="flex-1 flex items-center gap-3 rounded-xl border border-alert-red/30 bg-alert-red/5 px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-alert-red animate-pulse" />
              <span className="text-sm text-alert-red flex-1">Recording...</span>
              <button onClick={stopRecording} className="flex h-8 w-8 items-center justify-center rounded-lg bg-alert-red text-white">
                <StopCircle size={16} />
              </button>
            </div>
          ) : (
            <>
              <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Type a message..." className="flex-1 rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20" />
              <button onClick={startRecording} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
                <Mic size={18} />
              </button>
            </>
          )}
          {!recording && (
            <button onClick={send} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity">
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   WHITEBOARD PANEL
═══════════════════════════════════════════════════════════════════════════ */

const WhiteboardPanel = () => {
  const [tool, setTool] = useState("select");
  const [color, setColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const tools = [
    { id: "select", icon: MousePointer2 }, { id: "pen", icon: Pencil }, { id: "rectangle", icon: Square },
    { id: "circle", icon: CircleIcon }, { id: "line", icon: Minus }, { id: "text", icon: Type }, { id: "eraser", icon: Eraser },
  ];
  const colors = ["#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "pen" && tool !== "eraser") return;
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#1a1a2e" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 2;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const onMouseUp = () => { setDrawing(false); lastPos.current = null; };

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
      <div className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   VIDEO PANEL
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
   FILES PANEL — with role-based access, tags, descriptions
═══════════════════════════════════════════════════════════════════════════ */

const FilesPanel = ({ workspaceId, userId, userRole }: { workspaceId: string; userId: string | null; userRole: string }) => {
  const [files, setFiles] = useState<WsFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    const { data } = await supabase.from("workspace_files").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (data) setFiles(data as WsFile[]);
  }, [workspaceId]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (userRole === "viewer") { toast.error("Viewers cannot upload files"); return; }
    setUploading(true);
    const path = `${workspaceId}/${userId}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("workspace-files").upload(path, file);
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("workspace-files").getPublicUrl(path);
    await supabase.from("workspace_files").insert({ workspace_id: workspaceId, uploaded_by: userId, file_name: file.name, file_url: publicUrl, file_size: `${(file.size / 1024).toFixed(0)} KB`, file_type: file.type.split("/")[0] || "file", access_level: "all" });
    logActivity("workspace:file_upload", { entity_type: "workspace", entity_id: workspaceId, context: { file_name: file.name, file_size: file.size } });
    await fetchFiles();
    setUploading(false);
    toast.success("File uploaded");
  };

  const deleteFile = async (file: WsFile) => {
    if (userRole === "viewer") { toast.error("Viewers cannot delete files"); return; }
    await supabase.from("workspace_files").delete().eq("id", file.id);
    logActivity("workspace:file_deleted", { entity_type: "workspace", entity_id: workspaceId, context: { file_name: file.file_name } });
    toast.success("File deleted");
    fetchFiles();
  };

  const getIcon = (t: string) => (t === "image" ? FileImage : t === "application" ? FileText : File);
  const filtered = filter === "all" ? files : files.filter(f => f.file_type === filter);
  const types = ["all", ...Array.from(new Set(files.map(f => f.file_type)))];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Files</h3>
          <div className="flex gap-1 ml-2">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`rounded-md px-2 py-0.5 text-[10px] transition-colors ${filter === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-1"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {userRole !== "viewer" && (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-50">
            <Upload size={14} /> {uploading ? "..." : "Upload"}
          </button>
        )}
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No files</p>}
        {filtered.map((f) => {
          const Icon = getIcon(f.file_type);
          return (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-foreground/15 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2"><Icon size={18} className="text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.file_name}</p>
                <p className="text-xs text-muted-foreground">{f.file_size} · v{f.version} · {new Date(f.created_at).toLocaleDateString()}</p>
                {f.description && <p className="text-xs text-muted-foreground/70 mt-0.5">{f.description}</p>}
                {f.access_level && f.access_level !== "all" && <Badge className="mt-1 bg-badge-gold/10 text-badge-gold border-none text-[9px]">{f.access_level}</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {f.file_url && (
                  <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1"
                    onClick={() => logActivity("workspace:file_download", { entity_type: "workspace", entity_id: f.id })}>
                    <Download size={14} />
                  </a>
                )}
                {userRole !== "viewer" && (
                  <button onClick={() => deleteFile(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-alert-red hover:bg-alert-red/5">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
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

const StagesPanel = ({ workspaceId, userId, escrow, userRole, onTransactionCreated }: { workspaceId: string; userId: string | null; escrow: Escrow | null; userRole: string; onTransactionCreated: (code: string) => void }) => {
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
    if (userRole === "viewer") { toast.error("Viewers cannot modify stages"); return; }
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
      const [msgRes, fileRes, delRes] = await Promise.all([
        supabase.from("workspace_messages").select("*").eq("workspace_id", workspaceId),
        supabase.from("workspace_files").select("*").eq("workspace_id", workspaceId),
        supabase.from("workspace_deliverables").select("*").eq("workspace_id", workspaceId),
      ]);
      const { createWorkspaceTransaction } = await import("@/lib/transaction-generator");
      const { code, error } = await createWorkspaceTransaction({ workspaceId, escrow, stages, messages: msgRes.data || [], files: fileRes.data || [], deliverables: delRes.data || [] });
      if (error) { toast.error(`Transaction failed: ${error}`); }
      else {
        await supabase.from("escrow_contracts").update({ status: "released", released_sp: escrow.total_sp, updated_at: new Date().toISOString() }).eq("id", escrow.id);
        toast.success(`Gig completed! Transaction: ${code}`, { action: { label: "View", onClick: () => navigate(`/transaction?code=${code}`) }, duration: 10000 });
        onTransactionCreated(code);
        logActivity("workspace:gig_completed", { entity_type: "workspace", entity_id: workspaceId, context: { transaction_code: code, total_sp: escrow.total_sp } });
      }
    } catch { toast.error("Failed to complete gig"); }
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
      {allDone && escrow && escrow.status !== "released" && userRole !== "viewer" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={completeGig} disabled={completing} className="w-full rounded-2xl bg-skill-green py-4 text-sm font-bold text-background hover:bg-skill-green/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> {completing ? "Generating Transaction..." : "Complete Gig & Release Escrow"}
          </button>
        </motion.div>
      )}
      {escrow?.status === "released" && (
        <div className="mb-6 rounded-2xl border border-skill-green/20 bg-skill-green/5 p-4 text-center">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-skill-green" />
          <p className="text-sm font-medium text-foreground">Gig Completed</p>
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
                <p className="text-xs text-muted-foreground">{stage.sp_allocated} SP · {stage.completed_at ? `Done ${new Date(stage.completed_at).toLocaleDateString()}` : stage.status}</p>
              </div>
              {stage.status === "active" && userRole !== "viewer" && (
                <button onClick={() => markComplete(stage)} className="rounded-lg bg-skill-green px-3 py-1.5 text-xs font-medium text-background hover:bg-skill-green/90 transition-colors">Done</button>
              )}
            </div>
          </div>
        ))}
        {stages.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No stages configured</p>}
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
      <Coins size={48} className="mb-4 opacity-30" /><p className="text-sm">No escrow contract found</p>
    </div>
  );
  const releasedPct = escrow.total_sp > 0 ? (escrow.released_sp / escrow.total_sp) * 100 : 0;
  const sc: Record<string, string> = { held: "bg-badge-gold/10 text-badge-gold", partial_release: "bg-court-blue/10 text-court-blue", released: "bg-skill-green/10 text-skill-green", refunded: "bg-alert-red/10 text-alert-red", disputed: "bg-alert-red/10 text-alert-red" };
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground flex items-center gap-2"><Shield size={16} className="text-court-blue" /> Escrow</h3>
          <Badge className={`border-none ${sc[escrow.status] || "bg-surface-2"}`}>{escrow.status.replace("_", " ").toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-surface-1 p-3 text-center"><p className="text-2xl font-bold text-foreground">{escrow.total_sp}</p><p className="text-xs text-muted-foreground">Total SP</p></div>
          <div className="rounded-xl bg-surface-1 p-3 text-center"><p className="text-2xl font-bold text-skill-green">{escrow.released_sp}</p><p className="text-xs text-muted-foreground">Released</p></div>
          <div className="rounded-xl bg-surface-1 p-3 text-center"><p className="text-2xl font-bold text-badge-gold">{escrow.total_sp - escrow.released_sp}</p><p className="text-xs text-muted-foreground">Held</p></div>
        </div>
        <Progress value={releasedPct} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground text-right">{Math.round(releasedPct)}% released</p>
      </div>
      <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2"><Shield size={14} className="text-court-blue" /><span className="text-sm font-medium text-foreground">SP Insurance Active</span></div>
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
   SUBMIT PANEL — with requirements, AI review, revisions
═══════════════════════════════════════════════════════════════════════════ */

const SubmitPanel = ({ workspaceId, userId, userRole }: { workspaceId: string; userId: string | null; userRole: string }) => {
  const [deliverables, setDeliverables] = useState<WsDeliverable[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const [suggestingReqs, setSuggestingReqs] = useState(false);

  const fetchDel = useCallback(async () => {
    const { data } = await supabase.from("workspace_deliverables").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (data) setDeliverables(data as WsDeliverable[]);
  }, [workspaceId]);

  useEffect(() => { fetchDel(); }, [fetchDel]);

  const addReq = () => { if (newReq.trim()) { setRequirements([...requirements, newReq.trim()]); setNewReq(""); } };

  const suggestRequirements = async () => {
    if (!desc.trim()) { toast.error("Add a description first"); return; }
    setSuggestingReqs(true);
    const result = await callAI({ action: "suggest_requirements", content: desc });
    try {
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed)) setRequirements(prev => [...prev, ...parsed]);
      else toast.info("AI couldn't generate requirements. Try a more detailed description.");
    } catch { toast.info("AI suggestion format error. Add requirements manually."); }
    setSuggestingReqs(false);
  };

  const submit = async () => {
    if (!title.trim() || !userId) return;
    if (userRole === "viewer") { toast.error("Viewers cannot submit deliverables"); return; }
    setSubmitting(true);

    // AI quality review
    setAiReviewing(true);
    const aiReview = await callAI({ action: "review_deliverable", content: { title: title.trim(), description: desc.trim(), requirements } });
    setAiReviewing(false);

    let aiScore: number | null = null;
    const scoreMatch = aiReview.match(/(\d{1,3})\/100|score[:\s]+(\d{1,3})/i);
    if (scoreMatch) aiScore = parseInt(scoreMatch[1] || scoreMatch[2]);

    await supabase.from("workspace_deliverables").insert({
      workspace_id: workspaceId, submitted_by: userId, title: title.trim(), description: desc.trim(),
      requirements: requirements.map(r => ({ text: r, met: false })),
      ai_quality_score: aiScore, ai_feedback: aiReview || null,
    });
    logActivity("workspace:deliverable_submitted", { entity_type: "workspace", entity_id: workspaceId, context: { title: title.trim(), ai_score: aiScore, req_count: requirements.length } });
    toast.success("Deliverable submitted with AI review!");
    setTitle(""); setDesc(""); setRequirements([]);
    await fetchDel();
    setSubmitting(false);
  };

  const statusBadge: Record<string, string> = { pending: "bg-badge-gold/10 text-badge-gold", accepted: "bg-skill-green/10 text-skill-green", revision_requested: "bg-court-blue/10 text-court-blue", rejected: "bg-alert-red/10 text-alert-red" };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      {userRole !== "viewer" && (
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2"><Package size={16} className="text-court-blue" /> Submit Deliverable</h3>
          <div className="space-y-3">
            <Input placeholder="Deliverable title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-surface-1 border-border" />
            <Textarea placeholder="Description of what you're submitting..." value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-surface-1 border-border min-h-[80px]" />

            {/* Requirements */}
            <div className="rounded-xl border border-border bg-surface-1 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground flex items-center gap-1"><ListChecks size={12} /> Requirements ({requirements.length})</span>
                <button onClick={suggestRequirements} disabled={suggestingReqs} className="text-[10px] text-court-blue hover:underline flex items-center gap-1 disabled:opacity-50">
                  <Sparkles size={10} /> {suggestingReqs ? "Thinking..." : "AI Suggest"}
                </button>
              </div>
              {requirements.map((r, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={12} className="text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground flex-1">{r}</span>
                  <button onClick={() => setRequirements(requirements.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-alert-red"><X size={10} /></button>
                </div>
              ))}
              <div className="flex gap-1 mt-1">
                <input value={newReq} onChange={(e) => setNewReq(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReq()}
                  placeholder="Add requirement..." className="flex-1 text-xs bg-transparent border-b border-border py-1 text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                <button onClick={addReq} className="text-xs text-court-blue hover:underline">Add</button>
              </div>
            </div>

            <button onClick={submit} disabled={submitting || !title.trim()} className="w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {aiReviewing ? <><Sparkles size={14} className="animate-spin" /> AI Reviewing...</> : submitting ? "Submitting..." : "Submit with AI Review"}
            </button>
          </div>
        </div>
      )}

      <h4 className="text-sm font-medium text-foreground mb-3">Submissions</h4>
      <div className="space-y-2">
        {deliverables.length === 0 && <p className="text-sm text-muted-foreground text-center">No submissions yet</p>}
        {deliverables.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-foreground">{d.title}</p>
              <div className="flex items-center gap-1">
                {d.ai_quality_score != null && (
                  <Badge className={`border-none text-[10px] ${d.ai_quality_score >= 70 ? "bg-skill-green/10 text-skill-green" : d.ai_quality_score >= 40 ? "bg-badge-gold/10 text-badge-gold" : "bg-alert-red/10 text-alert-red"}`}>
                    AI: {d.ai_quality_score}/100
                  </Badge>
                )}
                <Badge className={`border-none text-[10px] ${statusBadge[d.status] || "bg-surface-2"}`}>{d.status.replace("_", " ")}</Badge>
              </div>
            </div>
            {d.description && <p className="text-xs text-muted-foreground mb-1">{d.description}</p>}
            {d.ai_feedback && (
              <details className="mt-1">
                <summary className="text-[10px] text-court-blue cursor-pointer flex items-center gap-1"><Sparkles size={10} /> AI Feedback</summary>
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{d.ai_feedback}</p>
              </details>
            )}
            {d.requirements && Array.isArray(d.requirements) && d.requirements.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {(d.requirements as any[]).map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-1 text-[10px]">
                    {r.met ? <CheckCircle2 size={10} className="text-skill-green" /> : <Circle size={10} className="text-muted-foreground" />}
                    <span className={r.met ? "text-skill-green" : "text-muted-foreground"}>{r.text}</span>
                  </div>
                ))}
              </div>
            )}
            {d.revision_count != null && d.revision_count > 0 && (
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><RotateCcw size={8} /> Revision {d.revision_count}/{d.max_revisions || 3}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DISPUTE PANEL — with AI help
═══════════════════════════════════════════════════════════════════════════ */

const DisputePanel = ({ workspaceId, userId, escrow }: { workspaceId: string; userId: string | null; escrow: Escrow | null }) => {
  const [disputes, setDisputes] = useState<WsDispute[]>([]);
  const [reason, setReason] = useState("");
  const [filing, setFiling] = useState(false);
  const [aiHelping, setAiHelping] = useState(false);

  const fetchDisputes = useCallback(async () => {
    const { data } = await supabase.from("workspace_disputes").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
    if (data) setDisputes(data as WsDispute[]);
  }, [workspaceId]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  const aiHelpDispute = async () => {
    if (!reason.trim()) { toast.error("Describe the issue first"); return; }
    setAiHelping(true);
    const result = await callAI({ action: "help_dispute", content: reason });
    if (result) setReason(result);
    setAiHelping(false);
  };

  const fileDispute = async () => {
    if (!reason.trim() || !userId || !escrow) return;
    setFiling(true);
    const filedAgainst = escrow.buyer_id === userId ? escrow.seller_id : escrow.buyer_id;
    await supabase.from("workspace_disputes").insert({ workspace_id: workspaceId, filed_by: userId, filed_against: filedAgainst, reason: reason.trim() });
    logActivity("workspace:dispute_filed", { entity_type: "workspace", entity_id: workspaceId, context: { reason: reason.trim() } });
    toast.success("Dispute filed.");
    setReason("");
    await fetchDisputes();
    setFiling(false);
  };

  const statusColor: Record<string, string> = { open: "bg-badge-gold/10 text-badge-gold", under_review: "bg-court-blue/10 text-court-blue", resolved: "bg-skill-green/10 text-skill-green" };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="rounded-2xl border border-alert-red/20 bg-alert-red/5 p-5 mb-6">
        <h3 className="font-medium text-foreground mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-alert-red" /> Open a Dispute</h3>
        <p className="text-xs text-muted-foreground mb-4">Filing freezes escrow and notifies both parties.</p>
        <Textarea placeholder="Describe the issue..." value={reason} onChange={(e) => setReason(e.target.value)} className="bg-surface-1 border-border min-h-[100px] mb-3" />
        <div className="flex gap-2">
          <button onClick={aiHelpDispute} disabled={aiHelping || !reason.trim()} className="flex-1 rounded-xl border border-court-blue/30 py-2 text-xs text-court-blue disabled:opacity-50 hover:bg-court-blue/5 flex items-center justify-center gap-1">
            <Sparkles size={12} /> {aiHelping ? "AI Writing..." : "AI Help Draft"}
          </button>
          <button onClick={fileDispute} disabled={filing || !reason.trim()} className="flex-1 rounded-xl bg-alert-red py-2 text-xs font-medium text-white disabled:opacity-50 hover:bg-alert-red/90">
            {filing ? "Filing..." : "File Dispute"}
          </button>
        </div>
      </div>
      <h4 className="text-sm font-medium text-foreground mb-3">History</h4>
      <div className="space-y-2">
        {disputes.length === 0 && <p className="text-sm text-muted-foreground text-center">No disputes — great!</p>}
        {disputes.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-1">
              <Badge className={`border-none text-[10px] ${statusColor[d.status] || "bg-surface-2"}`}>{d.status.replace("_", " ")}</Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{d.reason}</p>
            {d.outcome && <p className="text-xs text-skill-green mt-1">Outcome: {d.outcome}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MEMBERS PANEL — invites, roles
═══════════════════════════════════════════════════════════════════════════ */

const MembersPanel = ({ workspaceId, userId, userRole }: { workspaceId: string; userId: string | null; userRole: string }) => {
  const [members, setMembers] = useState<WsMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("editor");
  const [inviting, setInviting] = useState(false);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase.from("workspace_members").select("*").eq("workspace_id", workspaceId);
    if (data) setMembers(data as WsMember[]);
  }, [workspaceId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !userId) return;
    if (userRole !== "owner" && userRole !== "editor") { toast.error("Only owners/editors can invite"); return; }
    setInviting(true);
    // Look up user by email
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", inviteEmail.trim()).maybeSingle();
    if (!profile) { toast.error("User not found with that email"); setInviting(false); return; }
    // Check if already member
    const existing = members.find(m => m.user_id === profile.user_id);
    if (existing) { toast.error("User already in workspace"); setInviting(false); return; }
    await supabase.from("workspace_members").insert([{ workspace_id: workspaceId, user_id: profile.user_id, role: inviteRole as "editor" | "owner" | "viewer", invited_by: userId, status: "pending" }]);
    logActivity("workspace:member_invited", { entity_type: "workspace", entity_id: workspaceId, context: { invited_email: inviteEmail, role: inviteRole } });
    toast.success(`Invited ${inviteEmail} as ${inviteRole}`);
    setInviteEmail("");
    await fetchMembers();
    setInviting(false);
  };

  const removeMember = async (member: WsMember) => {
    if (userRole !== "owner") { toast.error("Only owners can remove members"); return; }
    if (member.user_id === userId) { toast.error("Can't remove yourself"); return; }
    await supabase.from("workspace_members").delete().eq("id", member.id);
    logActivity("workspace:member_removed", { entity_type: "workspace", entity_id: workspaceId, context: { removed_user: member.user_id } });
    toast.success("Member removed");
    fetchMembers();
  };

  const changeRole = async (member: WsMember, newRole: string) => {
    if (userRole !== "owner") { toast.error("Only owners can change roles"); return; }
    await supabase.from("workspace_members").update({ role: newRole as "editor" | "owner" | "viewer" }).eq("id", member.id);
    logActivity("workspace:member_role_changed", { entity_type: "workspace", entity_id: workspaceId, context: { user: member.user_id, from: member.role, to: newRole } });
    toast.success("Role updated");
    fetchMembers();
  };

  const roleIcon = (role: string) => role === "owner" ? <Crown size={12} className="text-badge-gold" /> : role === "editor" ? <Edit3 size={12} className="text-court-blue" /> : <EyeIcon size={12} className="text-muted-foreground" />;
  const roleColor = (role: string) => role === "owner" ? "bg-badge-gold/10 text-badge-gold" : role === "editor" ? "bg-court-blue/10 text-court-blue" : "bg-surface-2 text-muted-foreground";

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2"><Users size={16} /> Members ({members.length})</h3>

      {(userRole === "owner" || userRole === "editor") && (
        <div className="rounded-2xl border border-border bg-card p-4 mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><UserPlus size={14} /> Invite Member</h4>
          <div className="space-y-2">
            <Input placeholder="Email address" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="bg-surface-1 border-border" />
            <div className="flex gap-2">
              {["editor", "viewer"].map(r => (
                <button key={r} onClick={() => setInviteRole(r)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${inviteRole === r ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={inviteMember} disabled={inviting || !inviteEmail.trim()} className="w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50 hover:opacity-90">
              {inviting ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-mono text-sm font-bold text-muted-foreground">
              {m.user_id.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{m.user_id === userId ? "You" : m.user_id.slice(0, 8)}</p>
                <Badge className={`border-none text-[9px] ${roleColor(m.role)}`}>{roleIcon(m.role)} {m.role}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{m.status === "pending" ? "Invite pending" : `Joined ${m.accepted_at ? new Date(m.accepted_at).toLocaleDateString() : ""}`}</p>
            </div>
            {userRole === "owner" && m.user_id !== userId && (
              <div className="flex items-center gap-1">
                {m.role !== "editor" && <button onClick={() => changeRole(m, "editor")} className="flex h-7 items-center rounded-md px-2 text-[10px] text-court-blue hover:bg-court-blue/5">→ Editor</button>}
                {m.role !== "viewer" && m.role !== "owner" && <button onClick={() => changeRole(m, "viewer")} className="flex h-7 items-center rounded-md px-2 text-[10px] text-muted-foreground hover:bg-surface-1">→ Viewer</button>}
                <button onClick={() => removeMember(m)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-alert-red hover:bg-alert-red/5">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        {members.length === 0 && <p className="text-sm text-muted-foreground text-center mt-4">No members yet — invite someone!</p>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   AI ASSISTANT PANEL — streaming chat
═══════════════════════════════════════════════════════════════════════════ */

type AiMsg = { role: "user" | "assistant"; content: string };

const AiAssistantPanel = ({ workspaceId }: { workspaceId: string }) => {
  const [messages, setMessages] = useState<AiMsg[]>([
    { role: "assistant", content: "👋 I'm your Workspace AI Assistant. I can help with:\n\n• **Deliverable reviews** & quality checks\n• **Requirement suggestions**\n• **Dispute drafting** & evidence\n• **Translation** of messages\n• **Stage planning** & SP advice\n\nAsk me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: AiMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setStreaming(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMsgs.length + 1)
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(AI_URL, { method: "POST", headers: AUTH_HEADER, body: JSON.stringify({ messages: newMsgs }) });
      if (!resp.ok || !resp.body) { upsert("Sorry, AI is unavailable right now."); setStreaming(false); return; }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch { upsert("Something went wrong. Please try again."); }
    logActivity("workspace:ai_chat", { entity_type: "workspace", entity_id: workspaceId });
    setStreaming(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-court-blue/10"><Bot size={16} className="text-court-blue" /></div>
        <div><p className="text-sm font-semibold text-foreground">AI Assistant</p><p className="text-[10px] text-court-blue">Powered by Lovable AI</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-court-blue/10"><Bot size={12} className="text-court-blue" /></div>}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-foreground text-background" : "bg-surface-2 text-foreground"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {streaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-court-blue/10"><Bot size={12} className="text-court-blue" /></div>
            <div className="flex gap-1 rounded-2xl bg-surface-2 px-3 py-2">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input type="text" placeholder="Ask AI anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            className="h-9 flex-1 rounded-lg border border-border bg-surface-1 px-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          <button onClick={send} disabled={streaming} className="flex h-9 w-9 items-center justify-center rounded-lg bg-court-blue text-white disabled:opacity-50"><Send size={12} /></button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS PANEL
═══════════════════════════════════════════════════════════════════════════ */

const SettingsPanel = ({ workspaceId, escrow, partnerName, transactionCode, preferredLang, onLangChange }: { workspaceId: string; escrow: Escrow | null; partnerName: string; transactionCode: string | null; preferredLang: string; onLangChange: (l: string) => void }) => {
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();
  const languages = [
    { code: "en", label: "English" }, { code: "es", label: "Spanish" }, { code: "fr", label: "French" },
    { code: "de", label: "German" }, { code: "zh", label: "Chinese" }, { code: "ar", label: "Arabic" },
    { code: "hi", label: "Hindi" }, { code: "ja", label: "Japanese" }, { code: "ko", label: "Korean" },
    { code: "pt", label: "Portuguese" }, { code: "ru", label: "Russian" }, { code: "tr", label: "Turkish" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <h3 className="font-medium text-foreground mb-6 flex items-center gap-2"><Settings size={16} /> Workspace Settings</h3>
      <div className="space-y-4">
        {transactionCode && (
          <div className="rounded-xl border border-skill-green/20 bg-skill-green/5 p-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-skill-green" /> Transaction ID</h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-surface-1 px-3 py-2 font-mono text-xs text-foreground">{transactionCode}</code>
              <button onClick={() => { navigator.clipboard.writeText(transactionCode); toast.success("Copied!"); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1"><Copy size={14} /></button>
            </div>
            <button onClick={() => navigate(`/transaction?code=${transactionCode}`)} className="mt-2 w-full rounded-lg border border-skill-green/20 py-1.5 text-xs text-skill-green hover:bg-skill-green/10 flex items-center justify-center gap-1"><ExternalLink size={12} /> View Transaction</button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Workspace Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono text-foreground text-xs">{workspaceId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Partner</span><span className="text-foreground">{partnerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Escrow</span><span className="text-foreground">{escrow?.status || "N/A"}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Languages size={14} /> Language</h4>
          <div className="grid grid-cols-3 gap-1">
            {languages.map(l => (
              <button key={l.code} onClick={() => { onLangChange(l.code); logInteraction("workspace_language_changed", { language: l.code }); }}
                className={`rounded-lg py-1.5 text-xs transition-colors ${preferredLang === l.code ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-1"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Preferences</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">{notifications ? <Bell size={16} className="text-foreground" /> : <BellOff size={16} className="text-muted-foreground" />}<span className="text-sm text-foreground">Notifications</span></div>
            <button onClick={() => { setNotifications(!notifications); logInteraction("workspace_settings_toggle", { setting: "notifications", value: !notifications }); }}
              className={`relative w-10 h-5 rounded-full transition-colors ${notifications ? "bg-skill-green" : "bg-surface-3"}`}>
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Actions</h4>
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-1 flex items-center justify-center gap-2"><Archive size={14} /> Archive Workspace</button>
            <button className="w-full rounded-lg border border-alert-red/20 py-2 text-sm text-alert-red hover:bg-alert-red/5 flex items-center justify-center gap-2"><X size={14} /> Leave Workspace</button>
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
  const [transactionCode, setTransactionCode] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("owner");
  const [preferredLang, setPreferredLang] = useState("en");
  const workspaceId = id || "demo-workspace-001";
  const userId = user?.id || null;

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    logPageView("workspace");
    logActivity("workspace:opened", { entity_type: "workspace", entity_id: workspaceId });
  }, [workspaceId]);

  // Fetch escrow + stages + member role
  useEffect(() => {
    (async () => {
      const [{ data: esc }, { data: stg }] = await Promise.all([
        supabase.from("escrow_contracts").select("*").eq("workspace_id", workspaceId).maybeSingle(),
        supabase.from("workspace_stages").select("*").eq("workspace_id", workspaceId).order("order_index", { ascending: true }),
      ]);
      if (esc) setEscrow(esc as Escrow);
      if (stg) setStages(stg as WsStage[]);

      // Check member role
      if (userId) {
        const { data: member } = await supabase.from("workspace_members").select("role").eq("workspace_id", workspaceId).eq("user_id", userId).maybeSingle();
        if (member) setUserRole(member.role);
        else {
          // If user is buyer/seller in escrow, they're owner
          if (esc && (esc.buyer_id === userId || esc.seller_id === userId)) setUserRole("owner");
        }
      }

      // Load preferred language from profile
      if (userId) {
        const { data: profile } = await supabase.from("profiles").select("languages").eq("user_id", userId).maybeSingle();
        if (profile?.languages?.[0]) setPreferredLang(profile.languages[0]);
      }
    })();
  }, [workspaceId, userId]);

  const switchPanel = (p: Panel) => {
    setActivePanel(p);
    logInteraction("workspace_tab_switch", { from: activePanel, to: p });
  };

  const partnerName = escrow ? (escrow.buyer_id === userId ? "Seller" : "Buyer") : "Partner";

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard?tab=my-gigs")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors"><ArrowLeft size={18} /></button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">Workspace</h1>
              <p className="text-xs text-muted-foreground">ID: {workspaceId.slice(0, 16)}... · <span className="capitalize">{userRole}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {escrow && <Badge className="bg-skill-green/10 text-skill-green border-none">{escrow.total_sp} SP</Badge>}
            <Badge className="bg-surface-2 text-muted-foreground border-none capitalize">{escrow?.status || "No escrow"}</Badge>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-14 shrink-0 border-r border-border bg-surface-1 flex flex-col py-2 overflow-y-auto">
            {sidebarSections.map((section, si) => (
              <div key={section.label}>
                {si > 0 && <div className="mx-2 my-1.5 h-px bg-border" />}
                {section.items.map((item) => {
                  const isActive = activePanel === item.id;
                  return (
                    <button key={item.id} onClick={() => switchPanel(item.id)} title={item.label}
                      className={`relative flex h-10 w-full items-center justify-center transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-foreground" />}
                      <item.icon size={18} />
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={activePanel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="h-full">
                {activePanel === "chat" && <ChatPanel workspaceId={workspaceId} userId={userId} partnerName={partnerName} preferredLang={preferredLang} />}
                {activePanel === "whiteboard" && <WhiteboardPanel />}
                {activePanel === "video" && <VideoPanel partnerName={partnerName} workspaceId={workspaceId} />}
                {activePanel === "files" && <FilesPanel workspaceId={workspaceId} userId={userId} userRole={userRole} />}
                {activePanel === "stages" && <StagesPanel workspaceId={workspaceId} userId={userId} escrow={escrow} userRole={userRole} onTransactionCreated={(code) => { setTransactionCode(code); setEscrow(prev => prev ? { ...prev, status: "released", released_sp: prev.total_sp } : null); }} />}
                {activePanel === "escrow" && <EscrowPanel escrow={escrow} stages={stages} />}
                {activePanel === "submit" && <SubmitPanel workspaceId={workspaceId} userId={userId} userRole={userRole} />}
                {activePanel === "dispute" && <DisputePanel workspaceId={workspaceId} userId={userId} escrow={escrow} />}
                {activePanel === "members" && <MembersPanel workspaceId={workspaceId} userId={userId} userRole={userRole} />}
                {activePanel === "ai" && <AiAssistantPanel workspaceId={workspaceId} />}
                {activePanel === "settings" && <SettingsPanel workspaceId={workspaceId} escrow={escrow} partnerName={partnerName} transactionCode={transactionCode} preferredLang={preferredLang} onLangChange={setPreferredLang} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default WorkspacePage;
