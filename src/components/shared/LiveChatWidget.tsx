import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, Globe, UserCheck, MoreVertical, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

type ChatMsg = {
  role: "user" | "assistant" | "system";
  content: string;
  time: string;
  error?: boolean;
  translated?: string;
};

const QUICK_ACTIONS = [
  "How do Skill Points work?",
  "Report an issue",
  "Find a gig",
  "Pricing details",
];

const LANGUAGES = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "ja", label: "Japanese" },
  { code: "pt", label: "Portuguese" },
];

const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ── Message Bubble ── */
const ChatBubble = ({ msg }: { msg: ChatMsg }) => {
  if (msg.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-muted/30 border border-border/40 px-4 py-1 text-[10px] text-muted-foreground">
          {msg.content}
        </div>
      </div>
    );
  }

  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[260px] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed ${
          isUser
            ? "bg-foreground text-background rounded-br-sm"
            : msg.error
              ? "bg-destructive/5 text-destructive border border-destructive/10 rounded-bl-sm"
              : "border border-border/50 bg-card text-foreground rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
      {msg.translated && (
        <div className="max-w-[260px] mt-1 rounded-xl border border-border/30 bg-muted/10 px-3 py-1.5 text-[10px] text-muted-foreground">
          <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest mr-1">TR</span>
          {msg.translated}
        </div>
      )}
      <span className={`text-[9px] text-muted-foreground/30 font-mono mt-0.5 ${isUser ? "mr-1" : "ml-1"}`}>{msg.time}</span>
    </div>
  );
};

/* ── Typing Indicator ── */
const TypingIndicator = () => (
  <div className="flex items-start">
    <div className="flex items-center gap-1.5 rounded-2xl border border-border/50 bg-card px-4 py-2.5 rounded-bl-sm">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      ))}
    </div>
  </div>
);

const LiveChatWidget = () => {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "human">("ai");
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi — I'm your AI assistant. How can I help you today?", time: timeNow() },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [convId, setConvId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!convId || mode !== "human") return;
    const channel = supabase
      .channel(`support-${convId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages", filter: `conversation_id=eq.${convId}` }, (payload) => {
        const msg = payload.new as any;
        if (msg.sender_id !== user?.id) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }]);
          if (!chatOpen) setUnread(u => u + 1);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [convId, mode, user, chatOpen]);

  const translateText = async (text: string): Promise<string> => {
    if (!autoTranslate) return "";
    try {
      const resp = await supabase.functions.invoke("workspace-ai", {
        body: { action: "translate", content: text, targetLanguage: targetLang },
      });
      return resp.data?.result || "";
    } catch { return ""; }
  };

  const sendAIChat = useCallback(async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || streaming) return;
    const userMsg: ChatMsg = { role: "user", content: text, time: timeNow() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    let assistantSoFar = "";
    const upsert = (chunk: string, isError = false) => {
      assistantSoFar += chunk;
      const t = timeNow();
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar, error: isError } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar, time: t, error: isError }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages.map(({ role, content }) => ({ role, content })) }),
      });

      if (!resp.ok || !resp.body) {
        upsert("Unable to connect. Please try again.", true);
        setStreaming(false);
        return;
      }

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

      if (autoTranslate && assistantSoFar) {
        const translated = await translateText(assistantSoFar);
        if (translated) {
          setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, translated } : m));
        }
      }
    } catch { upsert("Something went wrong. Please try again.", true); }
    setStreaming(false);
    if (!chatOpen) setUnread(u => u + 1);
  }, [input, messages, streaming, chatOpen, autoTranslate, targetLang]);

  const sendHumanMessage = async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || !user) return;

    let cid = convId;
    if (!cid) {
      const { data } = await supabase.from("support_conversations").insert({ user_id: user.id, subject: "Live Chat" }).select("id").single();
      if (data) { cid = data.id; setConvId(data.id); }
      else return;
    }

    const userMsg: ChatMsg = { role: "user", content: text, time: timeNow() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    await supabase.from("support_messages").insert({
      conversation_id: cid,
      sender_id: user.id,
      content: text,
    });
  };

  const handleSend = (override?: string) => {
    if (mode === "ai") sendAIChat(override);
    else sendHumanMessage(override);
  };

  const switchToHuman = () => {
    setMode("human");
    setMenuOpen(false);
    setMessages(prev => [...prev, { role: "system", content: "Connecting you with a support agent...", time: timeNow() }]);
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: "Hi — I'm your AI assistant. How can I help you today?", time: timeNow() }]);
    setMode("ai");
    setConvId(null);
    setMenuOpen(false);
  };

  const handleOpen = () => { setChatOpen(true); setUnread(0); };

  return (
    <div className="fixed bottom-6 right-6 z-[9994] max-sm:bottom-20 max-sm:right-4">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="mb-3 flex h-[500px] w-[360px] max-w-[calc(100vw-2rem)] max-sm:w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border/50 bg-background shadow-[0_20px_60px_-12px_hsl(var(--foreground)/0.1)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 border border-border/50">
                    {mode === "ai" ? (
                      <span className="text-[10px] font-bold text-foreground">AI</span>
                    ) : (
                      <UserCheck size={14} className="text-foreground/70" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground tracking-tight">{mode === "ai" ? "Support" : "Live Agent"}</p>
                  <p className="text-[9px] text-muted-foreground/50 font-mono">{mode === "ai" ? "Online" : "Connecting..."}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted/30 transition-all"
                  >
                    <MoreVertical size={14} />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        className="absolute right-0 top-8 w-44 rounded-xl border border-border/50 bg-background shadow-lg overflow-hidden z-20"
                      >
                        <button onClick={resetChat} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] text-foreground hover:bg-muted/30 transition-colors">
                          <RotateCcw size={12} className="text-muted-foreground" /> Reset conversation
                        </button>
                        <button
                          onClick={() => { setAutoTranslate(!autoTranslate); setMenuOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] text-foreground hover:bg-muted/30 transition-colors"
                        >
                          <Globe size={12} className="text-muted-foreground" /> {autoTranslate ? "Disable translate" : "Auto-translate"}
                        </button>
                        {mode === "ai" && (
                          <button onClick={switchToHuman} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] text-foreground hover:bg-muted/30 transition-colors border-t border-border/30">
                            <UserCheck size={12} className="text-muted-foreground" /> Talk to a human
                          </button>
                        )}
                        {autoTranslate && (
                          <div className="px-3.5 py-2 border-t border-border/30">
                            <select
                              value={targetLang}
                              onChange={e => setTargetLang(e.target.value)}
                              className="w-full h-7 rounded-md border border-border/40 bg-background px-2 text-[10px] text-foreground focus:outline-none"
                            >
                              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                            </select>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => setChatOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-muted/30 transition-all">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" onClick={() => menuOpen && setMenuOpen(false)}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                  <ChatBubble msg={msg} />
                </motion.div>
              ))}

              {/* Quick actions — first message only */}
              {messages.length === 1 && mode === "ai" && !streaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map(q => (
                    <button key={q} onClick={() => handleSend(q)} className="rounded-full border border-border/50 bg-background px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all">
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {streaming && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/30 bg-background p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={mode === "ai" ? "Ask anything..." : "Message..."}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="h-9 flex-1 rounded-xl border border-border/30 bg-muted/10 px-3.5 text-[11px] text-foreground placeholder:text-muted-foreground/25 focus:border-foreground/15 focus:outline-none transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={streaming || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background disabled:opacity-10 hover:opacity-90 transition-all"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="relative">
        {unread > 0 && !chatOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background border-2 border-background">
            {unread}
          </motion.div>
        )}
        <button
          onClick={chatOpen ? () => setChatOpen(false) : handleOpen}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-[0_4px_20px_-4px_hsl(var(--foreground)/0.15)] hover:shadow-[0_8px_30px_-4px_hsl(var(--foreground)/0.25)] transition-all"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                <X size={16} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                <MessageCircle size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default LiveChatWidget;
