import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, X, Send, Bot, User } from "lucide-react";

const chatBotResponses = [
  "Hi! 👋 I'm SkillBot. How can I help you today?",
  "I can help with account issues, billing, finding gigs, or connecting you to a human agent.",
  "For technical issues, try our Help Center first — most answers are there!",
  "Want me to connect you with a live agent? They're available Mon–Fri, 9am–6pm EST.",
  "You can also check our FAQ page for quick answers to common questions!",
  "Need help with Skill Points? I can walk you through earning, spending, and transfers.",
  "Having trouble with a gig? I can help you navigate the dispute process.",
];

const LiveChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: chatBotResponses[0] },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typing]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "user", text: chatInput }]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const resp = chatBotResponses[Math.floor(Math.random() * chatBotResponses.length)];
      setChatMessages((prev) => [...prev, { from: "bot", text: resp }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9994]">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 flex h-[420px] w-[340px] flex-col rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-skill-green/10">
                  <Bot size={14} className="text-skill-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">SkillBot</p>
                  <p className="flex items-center gap-1 text-[10px] text-skill-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-skill-green" />Online
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.from === "user" ? "justify-end" : ""}`}>
                  {msg.from === "bot" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2">
                      <Bot size={12} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.from === "user" ? "bg-foreground text-background" : "bg-surface-2 text-foreground"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.from === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2">
                      <User size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2">
                    <Bot size={12} className="text-muted-foreground" />
                  </div>
                  <div className="flex gap-1 rounded-2xl bg-surface-2 px-3 py-2">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  className="h-9 flex-1 rounded-lg border border-border bg-surface-1 px-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <motion.button onClick={sendChat} whileTap={{ scale: 0.9 }} className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                  <Send size={12} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
      >
        {chatOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
};

export default LiveChatWidget;
