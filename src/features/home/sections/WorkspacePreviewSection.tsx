import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, PenTool, Video, FolderOpen, CheckCircle2, Sparkles } from "lucide-react";

const tools = [
  {
    id: "messenger",
    icon: MessageSquare,
    label: "Messenger",
    description: "Real-time chat with auto-translation, voice notes, file sharing with timestamps, and Discord-style threading. Every message logged for dispute evidence.",
    preview: [
      { sender: "You", msg: "Here's the first draft of the wireframes 🎨", time: "2:34 PM" },
      { sender: "Alex", msg: "Love the layout! Can we adjust the nav?", time: "2:36 PM" },
      { sender: "AI", msg: "Quality check: Design follows accessibility guidelines ✓", time: "2:36 PM" },
    ],
  },
  {
    id: "whiteboard",
    icon: PenTool,
    label: "Whiteboard",
    description: "Built-in tldraw canvas for real-time collaboration. Sketch ideas, annotate designs, brainstorm together. All snapshots saved to your workspace files.",
    preview: null,
  },
  {
    id: "video",
    icon: Video,
    label: "Video Call",
    description: "Peer-to-peer video and audio with built-in screen sharing. Show your work live, get real-time feedback. All calls recorded and saved to workspace.",
    preview: null,
  },
  {
    id: "files",
    icon: FolderOpen,
    label: "File Library",
    description: "All shared files organized chronologically with version history. Preview images, PDFs, and code files. Search, filter, and reference files in chat.",
    preview: null,
  },
  {
    id: "stages",
    icon: CheckCircle2,
    label: "Stage Tracker",
    description: "Visual progress bar with point allocation per stage. If a party abandons, the other gets their points back plus the abandoner's allocated stage points. Built-in insurance.",
    preview: null,
  },
  {
    id: "ai",
    icon: Sparkles,
    label: "AI Quality",
    description: "Automated plagiarism checks, quality scoring, version comparison, and delivery standard compliance. AI predicts buyer satisfaction and suggests improvements.",
    preview: null,
  },
];

const WorkspacePreviewSection = () => {
  const [activeTool, setActiveTool] = useState("messenger");
  const current = tools.find((t) => t.id === activeTool)!;

  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Every Gig Gets Its Own Workspace
          </h2>
          <p className="mx-auto max-w-lg text-lg text-silver">
            Messenger, whiteboard, video calls, files, stages — everything in one place. No third-party tools needed.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-surface-2/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-alert-red/60" />
                <div className="h-3 w-3 rounded-full bg-badge-gold/60" />
                <div className="h-3 w-3 rounded-full bg-skill-green/60" />
              </div>
              <span className="font-mono text-xs text-silver">Gig Workspace — Logo Design ↔ React Frontend</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-row gap-1 border-b border-border p-2 lg:w-56 lg:flex-col lg:border-b-0 lg:border-r overflow-x-auto lg:overflow-visible">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                    activeTool === tool.id
                      ? "bg-surface-3 text-foreground"
                      : "text-silver hover:bg-surface-2 hover:text-silver-accent"
                  }`}
                >
                  <tool.icon size={16} />
                  <span className="hidden sm:inline">{tool.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    {current.label}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-silver">
                    {current.description}
                  </p>

                  {current.id === "messenger" && current.preview && (
                    <div className="space-y-3 rounded-xl bg-surface-2 p-4">
                      {current.preview.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className={`flex gap-3 ${msg.sender === "AI" ? "opacity-70" : ""}`}
                        >
                          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            msg.sender === "AI" ? "bg-skill-green/20 text-skill-green" : "bg-surface-3 text-silver-accent"
                          }`}>
                            {msg.sender === "AI" ? "AI" : msg.sender[0]}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                              <span className="font-mono text-[10px] text-silver">{msg.time}</span>
                            </div>
                            <p className="text-sm text-silver-accent">{msg.msg}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {current.id === "stages" && (
                    <div className="space-y-2">
                      {["Research", "Wireframes", "Design", "Revisions", "Delivery"].map((stage, i) => (
                        <div key={stage} className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${i < 3 ? "bg-skill-green" : "bg-surface-3"}`} />
                          <span className={`text-sm ${i < 3 ? "text-foreground" : "text-silver"}`}>{stage}</span>
                          <span className="ml-auto font-mono text-xs text-silver">{[10, 15, 30, 20, 25][i]} SP</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {current.id === "whiteboard" && (
                    <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2">
                      <p className="text-sm text-silver">Interactive tldraw canvas preview</p>
                    </div>
                  )}

                  {current.id === "video" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex h-28 items-center justify-center rounded-xl bg-surface-2">
                        <p className="text-xs text-silver">Your Camera</p>
                      </div>
                      <div className="flex h-28 items-center justify-center rounded-xl bg-surface-3">
                        <p className="text-xs text-silver">Partner</p>
                      </div>
                    </div>
                  )}

                  {current.id === "files" && (
                    <div className="space-y-2">
                      {["wireframes-v2.fig", "brand-guide.pdf", "component-lib.zip"].map((file) => (
                        <div key={file} className="flex items-center gap-3 rounded-lg bg-surface-2 px-3 py-2">
                          <FolderOpen size={14} className="text-silver" />
                          <span className="text-sm text-silver-accent">{file}</span>
                          <span className="ml-auto font-mono text-[10px] text-silver">v2 · 2h ago</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {current.id === "ai" && (
                    <div className="space-y-2">
                      {[
                        { label: "Plagiarism Check", status: "Passed", color: "text-skill-green" },
                        { label: "Quality Score", status: "92/100", color: "text-foreground" },
                        { label: "Delivery Standards", status: "Met", color: "text-skill-green" },
                        { label: "Buyer Satisfaction", status: "Predicted: High", color: "text-badge-gold" },
                      ].map((check) => (
                        <div key={check.label} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                          <span className="text-sm text-silver">{check.label}</span>
                          <span className={`font-mono text-xs font-semibold ${check.color}`}>{check.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkspacePreviewSection;
