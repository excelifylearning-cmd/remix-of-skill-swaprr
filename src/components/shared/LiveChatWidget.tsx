import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, X, Send, Bot, User, RotateCcw, Sparkles } from "lucide-react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

type ChatMsg = { role: "user" | "assistant"; content: string; time: string; error?: boolean };

const QUICK_ACTIONS = [
  "How do SP work?",
  "Report a bug",
  "Find a gig",
  "Pricing help",
];

/** Simple markdown-ish rendering: bold, inline code, line breaks */
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="rounded bg-surface-2 px-1 py-0.5 text-[10px] font-mono">{part.slice(1, -1)}</code>;
    if (part === "\n") return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
};

const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const LiveChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! 👋 I'm SkillBot — your AI assistant. Ask me anything about SkillSwap, or pick a quick topic below.", time: timeNow() },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showPulse, setShowPulse] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Stop pulse after 8s
  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const sendChat = useCallback(async (overrideInput?: string) => {
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
      setMessages((prev) => {
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
        const errJson = resp.ok ? null : await resp.json().catch(() => null);
        upsert(errJson?.error || "Sorry, I'm having trouble connecting. Please try again.", true);
        setStreaming(false);
        if (!chatOpen) setUnread((u) => u + 1);
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
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      upsert("Sorry, something went wrong. Please try again.", true);
    }
    setStreaming(false);
    if (!chatOpen) setUnread((u) => u + 1);
  }, [input, messages, streaming, chatOpen]);

  const resetChat = () => {
    setMessages([
      { role: "assistant", content: "Hi! 👋 I'm SkillBot — your AI assistant. Ask me anything about SkillSwap, or pick a quick topic below.", time: timeNow() },
    ]);
  };

  const handleOpen = () => {
    setChatOpen(true);
    setUnread(0);
    setShowPulse(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9994] max-sm:bottom-4 max-sm:right-4">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] max-sm:w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-skill-green via-court-blue to-skill-green" />

            {/* Header */}
            <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-skill-green/10">
                  <Bot size={16} className="text-skill-green" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-skill-green" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">SkillBot</p>
                  <p className="flex items-center gap-1 text-[10px] text-skill-green font-medium">
                    <Sparkles size={8} /> AI Powered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={resetChat} title="New conversation" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
                  <RotateCcw size={13} />
                </button>
                <button onClick={() => setChatOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-skill-green/10 mt-1">
                      <Bot size={11} className="text-skill-green" />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <div className={`max-w-[240px] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : msg.error
                          ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-md"
                          : "bg-surface-2 text-foreground rounded-bl-md"
                    }`}>
                      {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                    </div>
                    <span className={`text-[9px] text-muted-foreground/60 ${msg.role === "user" ? "text-right" : ""}`}>
                      {msg.time}
                    </span>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 mt-1">
                      <User size={11} className="text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Quick actions — show only after initial greeting */}
              {messages.length === 1 && !streaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-1.5 pl-8"
                >
                  {QUICK_ACTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendChat(q)}
                      className="rounded-full border border-border bg-surface-1 px-3 py-1.5 text-[10px] font-medium text-foreground hover:bg-surface-2 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Typing indicator */}
              {streaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-skill-green/10">
                    <Bot size={11} className="text-skill-green" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 py-2">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">SkillBot is thinking…</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card/80 backdrop-blur-sm p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask SkillBot anything…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                  className="h-10 flex-1 rounded-xl border border-border bg-surface-1 px-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none transition-colors"
                />
                <motion.button
                  onClick={() => sendChat()}
                  whileTap={{ scale: 0.9 }}
                  disabled={streaming || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background disabled:opacity-30 transition-opacity"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div className="relative">
        {/* Pulse ring */}
        {showPulse && !chatOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-skill-green/20"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          />
        )}

        {/* Unread badge */}
        {unread > 0 && !chatOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
          >
            {unread}
          </motion.div>
        )}

        <motion.button
          onClick={chatOpen ? () => setChatOpen(false) : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg shadow-foreground/10"
          title="Chat with SkillBot"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Headset size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default LiveChatWidget;
