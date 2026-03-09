import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, RotateCcw, Languages, UserCheck, Sparkles, Globe, MessageCircle } from "lucide-react";
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
  { label: "How do SP work?", icon: "💰" },
  { label: "Report a bug", icon: "🐛" },
  { label: "Find a gig", icon: "🔍" },
  { label: "Pricing help", icon: "💳" },
];

const AI_SUGGESTIONS = [
  "Try searching for 'React development' in the marketplace",
  "Check your SP wallet for recent earnings",
  "Visit Guild Wars to earn bonus SP",
  "Set up your profile skills to get matched",
];

const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ── Chat Message Bubble ── */
const ChatBubble = ({ msg }: { msg: ChatMsg }) => {
  if (msg.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-muted/50 border border-border px-4 py-1.5 text-[10px] text-muted-foreground text-center max-w-[85%]">
          {msg.content}
        </div>
      </div>
    );
  }

  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/5 border border-border/50 mt-0.5">
          <Bot size={12} className="text-foreground/70" />
        </div>
      )}
      <div className="flex flex-col gap-0.5 max-w-[240px]">
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
            isUser
              ? "bg-foreground text-background rounded-br-md"
              : msg.error
                ? "bg-destructive/5 text-destructive border border-destructive/10 rounded-bl-md"
                : "bg-muted/40 text-foreground border border-border/40 rounded-bl-md"
          }`}
        >
          {msg.content}
        </div>
        {msg.translated && (
          <div className="rounded-xl bg-muted/20 border border-border/30 px-3 py-1.5 text-[10px] text-muted-foreground">
            <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider">Translated </span>
            {msg.translated}
          </div>
        )}
        <span className={`text-[9px] text-muted-foreground/40 font-mono ${isUser ? "text-right" : ""}`}>{msg.time}</span>
      </div>
      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background mt-0.5">
          <User size={12} />
        </div>
      )}
    </div>
  );
};

/* ── Typing Indicator ── */
const TypingIndicator = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/5 border border-border/50">
      <Bot size={12} className="text-foreground/70" />
    </div>
    <div className="flex items-center gap-2 rounded-2xl bg-muted/40 border border-border/40 px-4 py-2.5 rounded-bl-md">
      <div className="flex gap-1">
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        ))}
      </div>
    </div>
  </div>
);

const LiveChatWidget = () => {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "human">("ai");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I'm SkillBot — your AI assistant. Ask me anything about SkillSwap, or pick a topic below.", time: timeNow() },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showPulse, setShowPulse] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [convId, setConvId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Realtime subscription for human support messages
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
        upsert("Sorry, I'm having trouble connecting. Please try again.", true);
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
    } catch { upsert("Sorry, something went wrong. Please try again.", true); }
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
    setMessages(prev => [...prev, {
      role: "system" as any,
      content: "Connecting you with a human agent…",
      time: timeNow(),
    }]);
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: "Hi! I'm SkillBot — your AI assistant. Ask me anything, or pick a topic below.", time: timeNow() }]);
    setMode("ai");
    setConvId(null);
  };

  const handleOpen = () => { setChatOpen(true); setUnread(0); setShowPulse(false); };

  const suggestion = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];

  return (
    <div className="fixed bottom-6 right-6 z-[9994] max-sm:bottom-4 max-sm:right-4">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="mb-3 flex h-[520px] w-[370px] max-w-[calc(100vw-2rem)] max-sm:w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border/60 bg-background shadow-[0_24px_80px_-12px_hsl(var(--foreground)/0.12)] overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
                    {mode === "ai" ? <Bot size={16} /> : <UserCheck size={16} />}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-skill-green border-2 border-background" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">{mode === "ai" ? "SkillBot" : "Live Support"}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono tracking-wide">
                    {mode === "ai" ? "Online • AI Assistant" : "Connecting…"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  title={autoTranslate ? "Disable translate" : "Auto-translate"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${autoTranslate ? "bg-foreground text-background" : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/40"}`}
                >
                  <Globe size={14} />
                </button>
                {mode === "ai" && (
                  <button onClick={switchToHuman} title="Talk to human" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/40 transition-all">
                    <UserCheck size={14} />
                  </button>
                )}
                <button onClick={resetChat} title="Reset" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/40 transition-all">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setChatOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/40 transition-all">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Language bar ── */}
            {autoTranslate && (
              <div className="flex items-center gap-2 px-5 py-2 bg-muted/20 border-b border-border/30">
                <Languages size={11} className="text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground/60">Translate to:</span>
                <select
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className="h-6 rounded-md border border-border/40 bg-background px-2 text-[10px] text-foreground focus:outline-none"
                >
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                  <option value="ja">Japanese</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            )}

            {/* ── Messages ── */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <ChatBubble msg={msg} />
                </motion.div>
              ))}

              {/* Quick actions on first message */}
              {messages.length === 1 && mode === "ai" && !streaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3 pl-9">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ACTIONS.map(q => (
                      <button key={q.label} onClick={() => handleSend(q.label)} className="rounded-full border border-border/50 bg-background px-3 py-1.5 text-[10px] text-foreground hover:bg-muted/40 transition-all">
                        {q.icon} {q.label}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border/30 bg-muted/20 p-3 flex items-start gap-2.5">
                    <Sparkles size={11} className="text-muted-foreground/50 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                      <span className="font-medium text-foreground/80">Tip:</span> {suggestion}
                    </p>
                  </div>
                </motion.div>
              )}

              {streaming && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="border-t border-border/40 bg-background p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={mode === "ai" ? "Ask SkillBot anything…" : "Message support…"}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="h-10 flex-1 rounded-xl border border-border/40 bg-muted/20 px-4 text-xs text-foreground placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:outline-none focus:bg-background transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={streaming || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background disabled:opacity-15 hover:opacity-90 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-2 text-center text-[9px] text-muted-foreground/30 font-mono tracking-wide">Powered by SkillBot AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <div className="relative">
        {showPulse && !chatOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-foreground/10"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        )}
        {unread > 0 && !chatOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background border-2 border-background">
            {unread}
          </motion.div>
        )}
        <motion.button
          onClick={chatOpen ? () => setChatOpen(false) : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-[0_8px_30px_-4px_hsl(var(--foreground)/0.25)] transition-shadow hover:shadow-[0_12px_40px_-4px_hsl(var(--foreground)/0.35)]"
          title="Chat with SkillBot"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={16} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default LiveChatWidget;
