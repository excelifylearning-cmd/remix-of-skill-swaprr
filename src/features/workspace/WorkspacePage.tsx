import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Pencil, Video, FileText, BarChart3,
  Send, Paperclip, Smile, Phone, PhoneOff, Mic, MicOff, Monitor,
  MonitorOff, Settings, Users, Clock, CheckCircle2, Circle, Lock,
  Unlock, AlertTriangle, FileImage, File, Download, Trash2, Plus,
  Play, Pause, RotateCcw, ZoomIn, ZoomOut, MousePointer2, Square,
  Circle as CircleIcon, Minus, Type, Eraser, Palette, Layers,
  ChevronRight, Shield, Coins, Calendar, Flag, ThumbsUp, ThumbsDown
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/shared/PageTransition";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

const gigData = {
  id: 1,
  title: "Logo Design",
  offering: "Logo Design",
  seeking: "React Development",
  status: "active",
  partner: { name: "James T.", elo: 1680, avatar: "JT", verified: true },
  sp: 30,
  stages: [
    { id: 1, name: "Requirements", status: "completed", unlockedAt: "2026-03-01" },
    { id: 2, name: "First Draft", status: "current", unlockedAt: "2026-03-05" },
    { id: 3, name: "Revisions", status: "locked", unlockedAt: null },
    { id: 4, name: "Final Delivery", status: "locked", unlockedAt: null },
  ],
  deadline: "2026-03-15",
  createdAt: "2026-03-01",
};

const messages = [
  { id: 1, sender: "partner", text: "Hey! Excited to work on this together 🎨", time: "10:30 AM", translated: false },
  { id: 2, sender: "me", text: "Same here! I've attached my initial concepts", time: "10:32 AM", translated: false },
  { id: 3, sender: "partner", text: "These look great! I especially like option 2", time: "10:45 AM", translated: false },
  { id: 4, sender: "me", text: "Perfect, I'll refine that one. When can you start on the React components?", time: "10:47 AM", translated: false },
  { id: 5, sender: "partner", text: "I can start tomorrow. I'll need the design specs for the dashboard", time: "11:00 AM", translated: false },
];

const files = [
  { id: 1, name: "logo_concepts_v1.fig", type: "figma", size: "2.4 MB", uploadedBy: "me", date: "2026-03-05" },
  { id: 2, name: "brand_guidelines.pdf", type: "pdf", size: "1.2 MB", uploadedBy: "me", date: "2026-03-04" },
  { id: 3, name: "dashboard_wireframe.png", type: "image", size: "856 KB", uploadedBy: "partner", date: "2026-03-06" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CHAT TAB
═══════════════════════════════════════════════════════════════════════════ */

const ChatTab = () => {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setLocalMessages([...localMessages, {
      id: localMessages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      translated: false
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-badge-gold/10 font-mono text-sm font-bold text-badge-gold">
            {gigData.partner.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              {gigData.partner.name}
              {gigData.partner.verified && <CheckCircle2 size={12} className="text-skill-green" />}
            </p>
            <p className="text-xs text-skill-green">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
            <Phone size={16} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
            <Video size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
              msg.sender === "me" 
                ? "bg-foreground text-background rounded-br-md" 
                : "bg-surface-2 text-foreground rounded-bl-md"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-background/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
            <Smile size={18} />
          </button>
          <button
            onClick={sendMessage}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   WHITEBOARD TAB
═══════════════════════════════════════════════════════════════════════════ */

const WhiteboardTab = () => {
  const [tool, setTool] = useState("select");
  const [color, setColor] = useState("#ffffff");

  const tools = [
    { id: "select", icon: MousePointer2 },
    { id: "pen", icon: Pencil },
    { id: "rectangle", icon: Square },
    { id: "circle", icon: CircleIcon },
    { id: "line", icon: Minus },
    { id: "text", icon: Type },
    { id: "eraser", icon: Eraser },
  ];

  const colors = ["#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                tool === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-1"
              }`}
            >
              <t.icon size={16} />
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs text-muted-foreground px-2">100%</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
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
   VIDEO TAB
═══════════════════════════════════════════════════════════════════════════ */

const VideoTab = () => {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [sharing, setSharing] = useState(false);

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
            <button
              onClick={() => setInCall(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-court-blue px-6 py-3 text-sm font-semibold text-white hover:bg-court-blue/90 transition-colors"
            >
              <Phone size={16} /> Start Call
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Video Area */}
          <div className="flex-1 bg-surface-1 relative">
            {/* Partner Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
              <div className="text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-badge-gold/10 mx-auto mb-2 font-mono text-3xl font-bold text-badge-gold">
                  JT
                </div>
                <p className="text-sm text-foreground">{gigData.partner.name}</p>
              </div>
            </div>
            {/* My Video */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-surface-3 border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">You</span>
            </div>
            {/* Screen Share Indicator */}
            {sharing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-alert-red/90 px-3 py-1.5">
                <Monitor size={14} className="text-white" />
                <span className="text-xs font-medium text-white">Sharing Screen</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 border-t border-border py-4">
            <button
              onClick={() => setMuted(!muted)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${muted ? "bg-alert-red text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}
            >
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${!videoOn ? "bg-alert-red text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}
            >
              {videoOn ? <Video size={20} /> : <Video size={20} />}
            </button>
            <button
              onClick={() => setSharing(!sharing)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${sharing ? "bg-skill-green text-white" : "bg-surface-2 text-foreground hover:bg-surface-3"}`}
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setInCall(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-alert-red text-white hover:bg-alert-red/90 transition-colors"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   FILES TAB
═══════════════════════════════════════════════════════════════════════════ */

const FilesTab = () => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return FileImage;
      case "pdf": return FileText;
      default: return File;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-medium text-foreground">Shared Files</h3>
        <button className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">
          <Plus size={14} /> Upload
        </button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div key={file.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-foreground/15 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                  <FileIcon size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size} · {file.uploadedBy === "me" ? "You" : gigData.partner.name} · {file.date}</p>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1">
                  <Download size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS TAB
═══════════════════════════════════════════════════════════════════════════ */

const ProgressTab = () => {
  const currentStageIndex = gigData.stages.findIndex(s => s.status === "current");
  const progress = ((currentStageIndex + 1) / gigData.stages.length) * 100;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      {/* Progress Overview */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Gig Progress</h3>
          <Badge className="bg-skill-green/10 text-skill-green border-none">Stage {currentStageIndex + 1}/{gigData.stages.length}</Badge>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Started {gigData.createdAt}</span>
          <span>Deadline {gigData.deadline}</span>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {gigData.stages.map((stage, i) => (
          <div
            key={stage.id}
            className={`rounded-xl border p-4 ${
              stage.status === "completed" ? "border-skill-green/20 bg-skill-green/5" :
              stage.status === "current" ? "border-foreground/20 bg-card" :
              "border-border bg-surface-1"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                stage.status === "completed" ? "bg-skill-green/10" :
                stage.status === "current" ? "bg-foreground" :
                "bg-surface-2"
              }`}>
                {stage.status === "completed" ? (
                  <CheckCircle2 size={16} className="text-skill-green" />
                ) : stage.status === "current" ? (
                  <Circle size={16} className="text-background" />
                ) : (
                  <Lock size={14} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${stage.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                  {stage.name}
                </p>
                {stage.unlockedAt && (
                  <p className="text-xs text-muted-foreground">Unlocked {stage.unlockedAt}</p>
                )}
              </div>
              {stage.status === "current" && (
                <button className="rounded-lg bg-skill-green px-3 py-1.5 text-xs font-medium text-background">
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Insurance Info */}
      <div className="mt-6 rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-court-blue" />
          <span className="text-sm font-medium text-foreground">SP Insurance Active</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your {gigData.sp} SP is protected. If the swap is abandoned, you'll be refunded based on progress.
        </p>
      </div>

      {/* Report Issue */}
      <button className="mt-4 w-full rounded-xl border border-alert-red/20 py-3 text-sm text-alert-red hover:bg-alert-red/5 transition-colors flex items-center justify-center gap-2">
        <Flag size={14} /> Report Issue / Open Dispute
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN WORKSPACE PAGE
═══════════════════════════════════════════════════════════════════════════ */

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "whiteboard", label: "Whiteboard", icon: Pencil },
    { id: "video", label: "Video", icon: Video },
    { id: "files", label: "Files", icon: FileText },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

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
              <h1 className="font-heading text-lg font-bold text-foreground">{gigData.title}</h1>
              <p className="text-xs text-muted-foreground">with {gigData.partner.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-skill-green/10 text-skill-green border-none">{gigData.sp} SP</Badge>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "whiteboard" && <WhiteboardTab />}
          {activeTab === "video" && <VideoTab />}
          {activeTab === "files" && <FilesTab />}
          {activeTab === "progress" && <ProgressTab />}
        </div>
      </div>
    </PageTransition>
  );
};

export default WorkspacePage;
