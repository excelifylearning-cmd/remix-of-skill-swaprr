import { motion } from "framer-motion";
import { MessageCircle, Search, Send, Phone, Video, MoreVertical, Pin, Star, Archive, Plus } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockConversations = [
  { id: "1", name: "Luna Martinez", avatar: "🎨", lastMsg: "The design revisions look great! Let me know when stage 2 is ready.", time: "2m ago", unread: 3, online: true },
  { id: "2", name: "Alex Chen", avatar: "💻", lastMsg: "Can you send the API docs?", time: "15m ago", unread: 1, online: true },
  { id: "3", name: "Pixel Guild", avatar: "🏰", lastMsg: "New project assignment posted", time: "1h ago", unread: 0, online: false, isGuild: true },
  { id: "4", name: "Sarah Kim", avatar: "📸", lastMsg: "Thanks for the quick turnaround!", time: "3h ago", unread: 0, online: false },
  { id: "5", name: "Jordan Tech", avatar: "⚙️", lastMsg: "I'll have the deliverable ready by Friday", time: "1d ago", unread: 0, online: false },
  { id: "6", name: "Design Collective", avatar: "🎭", lastMsg: "Guild war starts tomorrow!", time: "2d ago", unread: 5, online: false, isGuild: true },
];

const mockMessages = [
  { id: "m1", sender: "Luna Martinez", content: "Hey! I finished the first round of logo concepts 🎨", time: "10:30 AM", isMe: false },
  { id: "m2", sender: "You", content: "These look amazing! I especially like option 3 with the gradient", time: "10:32 AM", isMe: true },
  { id: "m3", sender: "Luna Martinez", content: "Great taste! I'll refine that one. Should I also explore a flat version?", time: "10:33 AM", isMe: false },
  { id: "m4", sender: "You", content: "Yes please! A flat version would be great for smaller sizes", time: "10:35 AM", isMe: true },
  { id: "m5", sender: "Luna Martinez", content: "The design revisions look great! Let me know when stage 2 is ready.", time: "10:40 AM", isMe: false },
];

const MessagesPage = () => (
  <PageTransition>
    <Navbar />
    <main className="min-h-screen bg-background pt-20">
      <div className="h-[calc(100vh-5rem)] flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/50 flex flex-col bg-card/50">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Messages</h2>
              <Button variant="ghost" size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" placeholder="Search messages..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv, i) => (
              <motion.div key={conv.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors border-b border-border/20 ${i === 0 ? "bg-accent/30" : ""}`}>
                <div className="relative">
                  <span className="text-2xl">{conv.avatar}</span>
                  {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[hsl(var(--skill-green))] rounded-full border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                      {conv.name}
                      {conv.isGuild && <Badge variant="outline" className="text-[10px] px-1 py-0">Guild</Badge>}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMsg}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{conv.unread}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-medium text-foreground text-sm">Luna Martinez</h3>
                <span className="text-xs text-[hsl(var(--skill-green))]">Online</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Pin className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/50 text-foreground rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <span className={`text-[10px] mt-1 block ${msg.isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-card/30">
            <div className="flex gap-2">
              <input className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground" placeholder="Type a message..." />
              <Button size="icon" className="rounded-xl"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </PageTransition>
);

export default MessagesPage;
