import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, X, Send, Bot, User, RotateCcw, Languages, UserCheck, Sparkles, Globe } from "lucide-react";
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

const LiveChatWidget = () => {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "human">("ai");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! 👋 I'm SkillBot. Ask me anything about SkillSwap, or pick a topic below.", time: timeNow() },
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

      // Auto-translate last assistant message
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

    // Create conversation if needed
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
      content: "🔄 Connecting you with a human agent. You'll be notified when someone joins.",
      time: timeNow(),
    }]);
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: "Hi! 👋 I'm SkillBot. Ask me anything, or pick a topic below.", time: timeNow() }]);
    setMode("ai");
    setConvId(null);
  };

  const handleOpen = () => { setChatOpen(true); setUnread(0); setShowPulse(false); };

  // AI recommendation
  const suggestion = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];

  return (
    <div className="fixed bottom-6 right-6 z-[9994] max-sm:bottom-4 max-sm:right-4">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] max-sm:w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header — monotone */}
            <div className="flex items-center justify-between bg-surface-1 px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-border">
                  {mode === "ai" ? <Bot size={14} className="text-foreground" /> : <UserCheck size={14} className="text-foreground" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{mode === "ai" ? "SkillBot" : "Live Support"}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {mode === "ai" ? "AI Assistant" : "Human Agent"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {/* Auto-translate toggle */}
                <button
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  title={autoTranslate ? "Disable auto-translate" : "Enable auto-translate"}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${autoTranslate ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}
                >
                  <Globe size={12} />
                </button>
                {mode === "ai" && (
                  <button onClick={switchToHuman} title="Talk to a human" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
                    <UserCheck size={12} />
                  </button>
                )}
                <button onClick={resetChat} title="New conversation" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
                  <RotateCcw size={12} />
                </button>
                <button onClick={() => setChatOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Language selector (when auto-translate is on) */}
            {autoTranslate && (
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-1 border-b border-border">
                <Languages size={11} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Translate to:</span>
                <select
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className="h-6 rounded border border-border bg-card px-1.5 text-[10px] text-foreground focus:outline-none"
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

            {/* Messages */}
            <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : ""}`}
                >
                  {msg.role === "system" ? (
                    <div className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-[10px] text-muted-foreground text-center max-w-[85%]">
                      {msg.content}
                    </div>
                  ) : (
                    <>
                      {msg.role === "assistant" && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-2 border border-border mt-0.5">
                          <Bot size={10} className="text-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5 max-w-[240px]">
                        <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-foreground text-background rounded-br-sm"
                            : msg.error
                              ? "bg-surface-2 text-alert-red border border-alert-red/20 rounded-bl-sm"
                              : "bg-surface-2 text-foreground border border-border rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        {/* Translated text */}
                        {msg.translated && (
                          <div className="rounded-lg bg-surface-1 border border-border px-2.5 py-1.5 text-[10px] text-muted-foreground">
                            <span className="font-mono text-[9px] text-muted-foreground/60 uppercase">Translated: </span>
                            {msg.translated}
                          </div>
                        )}
                        <span className={`text-[9px] text-muted-foreground/50 ${msg.role === "user" ? "text-right" : ""}`}>{msg.time}</span>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-2 border border-border mt-0.5">
                          <User size={10} className="text-foreground" />
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}

              {/* Quick actions */}
              {messages.length === 1 && mode === "ai" && !streaming && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2 pl-8">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ACTIONS.map(q => (
                      <button key={q.label} onClick={() => handleSend(q.label)} className="rounded-lg border border-border bg-surface-1 px-2.5 py-1.5 text-[10px] text-foreground hover:bg-surface-2 transition-colors">
                        {q.icon} {q.label}
                      </button>
                    ))}
                  </div>
                  {/* AI recommendation */}
                  <div className="rounded-lg border border-border bg-surface-1 p-2.5 flex items-start gap-2">
                    <Sparkles size={10} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground"><span className="font-medium text-foreground">Tip:</span> {suggestion}</p>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {streaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-2 border border-border">
                    <Bot size={10} className="text-foreground" />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-surface-2 border border-border px-3 py-2">
                    <div className="flex gap-0.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.9, delay: d }} className="h-1 w-1 rounded-full bg-muted-foreground" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-surface-1 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={mode === "ai" ? "Ask SkillBot…" : "Message support…"}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={streaming || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-20 transition-opacity"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div className="relative">
        {showPulse && !chatOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-foreground/20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
        {unread > 0 && !chatOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background border-2 border-card">
            {unread}
          </motion.div>
        )}
        <motion.button
          onClick={chatOpen ? () => setChatOpen(false) : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg border border-foreground/10"
          title="Chat with SkillBot"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={18} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Headset size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default LiveChatWidget;
