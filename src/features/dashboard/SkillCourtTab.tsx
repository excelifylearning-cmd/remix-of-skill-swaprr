import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, Gavel, FileText, Users, Cpu, Crown, Clock, CheckCircle2,
  XCircle, AlertTriangle, Shield, ThumbsUp, ThumbsDown, Send, Paperclip,
  Eye, MessageSquare, ChevronRight, ChevronLeft, Plus, Upload, File,
  ArrowLeft, Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

/* ═══ Types ═══ */
interface Dispute {
  id: string; title: string; description: string; status: string;
  sp_amount: number; filed_by: string; filed_against: string;
  outcome: string | null; created_at: string; resolved_at: string | null;
}
interface Evidence {
  id: string; case_id: string; submitted_by: string; evidence_type: string;
  title: string; content: string; file_url: string | null; created_at: string;
}
interface Comment {
  id: string; case_id: string; author_id: string; content: string;
  is_judge_note: boolean; created_at: string;
}
interface JuryAssignment {
  id: string; case_id: string; juror_id: string; juror_type: string;
  status: string; deadline: string | null; assigned_at: string;
}
interface JuryVote {
  id: string; case_id: string; juror_id: string; vote: string;
  reasoning: string; weight: number; voted_at: string;
}

const statusBadge = (s: string) => {
  switch (s) {
    case "Open": return "bg-alert-red/10 text-alert-red border-alert-red/20";
    case "Under Review": return "bg-badge-gold/10 text-badge-gold border-badge-gold/20";
    case "Resolved": return "bg-skill-green/10 text-skill-green border-skill-green/20";
    case "Closed": return "bg-muted text-muted-foreground border-border";
    default: return "bg-surface-2 text-muted-foreground border-border";
  }
};

/* ═══════════════════════════════════════════════════════
   CASE DETAIL VIEW
═══════════════════════════════════════════════════════ */

const CaseDetailView = ({ caseId, onBack, isJuror }: { caseId: string; onBack: () => void; isJuror: boolean }) => {
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [jurors, setJurors] = useState<JuryAssignment[]>([]);
  const [votes, setVotes] = useState<JuryVote[]>([]);
  const [myVote, setMyVote] = useState<JuryVote | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvContent, setNewEvContent] = useState("");
  const [voteChoice, setVoteChoice] = useState("");
  const [voteReason, setVoteReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [dRes, eRes, cRes, jRes, vRes] = await Promise.all([
      supabase.from("disputes").select("*").eq("id", caseId).single(),
      supabase.from("case_evidence").select("*").eq("case_id", caseId).order("created_at"),
      supabase.from("case_comments").select("*").eq("case_id", caseId).order("created_at"),
      supabase.from("jury_assignments").select("*").eq("case_id", caseId),
      supabase.from("jury_votes").select("*").eq("case_id", caseId),
    ]);
    setDispute(dRes.data as any);
    setEvidence((eRes.data || []) as any);
    setComments((cRes.data || []) as any);
    setJurors((jRes.data || []) as any);
    setVotes((vRes.data || []) as any);
    if (user) {
      const mine = (vRes.data || []).find((v: any) => v.juror_id === user.id);
      setMyVote(mine as any || null);
    }
    setLoading(false);
  }, [caseId, user]);

  useEffect(() => { load(); }, [load]);

  const submitComment = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    await supabase.from("case_comments").insert({
      case_id: caseId, author_id: user.id, content: newComment.trim(),
    });
    setNewComment("");
    await load();
    setSubmitting(false);
  };

  const submitEvidence = async () => {
    if (!newEvTitle.trim() || !user) return;
    setSubmitting(true);
    await supabase.from("case_evidence").insert({
      case_id: caseId, submitted_by: user.id, title: newEvTitle.trim(), content: newEvContent.trim(),
    });
    setNewEvTitle(""); setNewEvContent("");
    await load();
    setSubmitting(false);
  };

  const castVote = async () => {
    if (!voteChoice || !user) return;
    setSubmitting(true);
    await supabase.from("jury_votes").insert({
      case_id: caseId, juror_id: user.id, vote: voteChoice, reasoning: voteReason.trim(),
      weight: isJuror ? 1.0 : 0.25,
    });
    // Update assignment status
    await supabase.from("jury_assignments").update({ status: "voted" })
      .eq("case_id", caseId).eq("juror_id", user.id);
    await load();
    setSubmitting(false);
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="h-6 w-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
    </div>
  );

  if (!dispute) return (
    <div className="py-20 text-center">
      <XCircle size={32} className="mx-auto mb-3 text-muted-foreground/30" />
      <p className="text-foreground font-medium">Case not found</p>
      <button onClick={onBack} className="mt-3 text-sm text-court-blue hover:underline">← Back</button>
    </div>
  );

  const isParty = user && (dispute.filed_by === user.id || dispute.filed_against === user.id);
  const isResolved = dispute.status === "Resolved" || dispute.status === "Closed";

  // Vote tally
  const forFiler = votes.filter(v => v.vote === "for_filer").reduce((s, v) => s + Number(v.weight), 0);
  const forDefendant = votes.filter(v => v.vote === "for_defendant").reduce((s, v) => s + Number(v.weight), 0);
  const totalWeight = forFiler + forDefendant || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-foreground">{dispute.title}</h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${statusBadge(dispute.status)}`}>{dispute.status}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dispute.sp_amount} SP at stake · Filed {new Date(dispute.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Verdict bar (if votes exist) */}
      {votes.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Verdict Progress</p>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium text-skill-green">Filer</span>
            <div className="flex-1 h-3 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full bg-skill-green rounded-full transition-all" style={{ width: `${(forFiler / totalWeight) * 100}%` }} />
            </div>
            <span className="text-xs font-medium text-alert-red">Defendant</span>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{Math.round((forFiler / totalWeight) * 100)}%</span>
            <span>{votes.length} votes cast</span>
            <span>{Math.round((forDefendant / totalWeight) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Jury composition */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Jury Panel</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { type: "random", label: "Random Users", icon: Users, weight: "25%", color: "text-muted-foreground" },
            { type: "ai", label: "AI Judge", icon: Cpu, weight: "25%", color: "text-court-blue" },
            { type: "expert", label: "Expert Panel", icon: Crown, weight: "50%", color: "text-badge-gold" },
          ].map(j => {
            const assigned = jurors.filter(a => a.juror_type === j.type);
            const voted = assigned.filter(a => a.status === "voted");
            return (
              <div key={j.type} className="rounded-lg bg-surface-1 border border-border p-3 text-center">
                <j.icon size={16} className={`${j.color} mx-auto mb-1`} />
                <p className="text-xs font-medium text-foreground">{j.label}</p>
                <p className="text-[10px] text-muted-foreground">{j.weight} weight</p>
                <p className="text-[10px] font-mono mt-1">
                  {voted.length}/{assigned.length || "—"} voted
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs">Evidence ({evidence.length})</TabsTrigger>
          <TabsTrigger value="discussion" className="text-xs">Discussion ({comments.length})</TabsTrigger>
          <TabsTrigger value="vote" className="text-xs">Vote</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2">Case Description</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{dispute.description || "No description provided."}</p>
          </div>

          {dispute.outcome && (
            <div className="rounded-xl border border-skill-green/20 bg-skill-green/5 p-4">
              <h4 className="text-xs font-mono uppercase text-skill-green mb-1">Verdict</h4>
              <p className="text-sm font-medium text-foreground">{dispute.outcome}</p>
              {dispute.resolved_at && (
                <p className="text-[10px] text-muted-foreground mt-1">Resolved {new Date(dispute.resolved_at).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </TabsContent>

        {/* Evidence */}
        <TabsContent value="evidence" className="space-y-4">
          {evidence.map(e => (
            <div key={e.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <File size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{e.title}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{e.content}</p>
              {e.file_url && (
                <a href={e.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-court-blue hover:underline">
                  <Paperclip size={10} />View Attachment
                </a>
              )}
            </div>
          ))}

          {evidence.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No evidence submitted yet</div>
          )}

          {/* Submit evidence form */}
          {isParty && !isResolved && (
            <div className="rounded-xl border border-border bg-surface-1 p-4 space-y-3">
              <h4 className="text-xs font-mono uppercase text-muted-foreground">Submit Evidence</h4>
              <input
                value={newEvTitle}
                onChange={e => setNewEvTitle(e.target.value)}
                placeholder="Evidence title..."
                className="w-full h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              <textarea
                value={newEvContent}
                onChange={e => setNewEvContent(e.target.value)}
                placeholder="Describe or paste evidence..."
                rows={3}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none"
              />
              <button
                onClick={submitEvidence}
                disabled={submitting || !newEvTitle.trim()}
                className="h-9 px-4 rounded-lg bg-foreground text-background text-xs font-semibold disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Evidence"}
              </button>
            </div>
          )}
        </TabsContent>

        {/* Discussion */}
        <TabsContent value="discussion" className="space-y-3">
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
            {comments.map(c => (
              <div key={c.id} className={`rounded-xl p-3 ${c.is_judge_note ? "border border-badge-gold/20 bg-badge-gold/5" : "border border-border bg-card"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {c.author_id === user?.id ? "You" : c.is_judge_note ? "Judge" : "Participant"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-xs text-foreground/80">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No comments yet</div>
            )}
          </div>

          {(isParty || isJuror) && !isResolved && (
            <div className="flex gap-2 pt-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitComment()}
                placeholder="Add a comment..."
                className="flex-1 h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
              <button onClick={submitComment} disabled={submitting || !newComment.trim()} className="h-10 w-10 flex items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-40">
                <Send size={14} />
              </button>
            </div>
          )}
        </TabsContent>

        {/* Vote */}
        <TabsContent value="vote" className="space-y-4">
          {myVote ? (
            <div className="rounded-xl border border-skill-green/20 bg-skill-green/5 p-4 text-center">
              <CheckCircle2 size={24} className="text-skill-green mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">You voted: <span className="font-bold">{myVote.vote === "for_filer" ? "For Filer" : "For Defendant"}</span></p>
              {myVote.reasoning && <p className="text-xs text-muted-foreground mt-1">"{myVote.reasoning}"</p>}
            </div>
          ) : isJuror && !isResolved ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
                <p className="text-sm font-medium text-foreground mb-1">Cast Your Verdict</p>
                <p className="text-xs text-muted-foreground">Review all evidence and discussion before voting. Your vote is final.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setVoteChoice("for_filer")}
                  className={`rounded-xl border p-4 text-center transition-all ${voteChoice === "for_filer" ? "border-skill-green bg-skill-green/5" : "border-border bg-card hover:border-foreground/20"}`}
                >
                  <ThumbsUp size={20} className={voteChoice === "for_filer" ? "text-skill-green mx-auto mb-1" : "text-muted-foreground mx-auto mb-1"} />
                  <p className="text-sm font-medium text-foreground">For Filer</p>
                  <p className="text-[10px] text-muted-foreground">Filer's claim is valid</p>
                </button>
                <button
                  onClick={() => setVoteChoice("for_defendant")}
                  className={`rounded-xl border p-4 text-center transition-all ${voteChoice === "for_defendant" ? "border-alert-red bg-alert-red/5" : "border-border bg-card hover:border-foreground/20"}`}
                >
                  <ThumbsDown size={20} className={voteChoice === "for_defendant" ? "text-alert-red mx-auto mb-1" : "text-muted-foreground mx-auto mb-1"} />
                  <p className="text-sm font-medium text-foreground">For Defendant</p>
                  <p className="text-[10px] text-muted-foreground">Defendant is right</p>
                </button>
              </div>

              <textarea
                value={voteReason}
                onChange={e => setVoteReason(e.target.value)}
                placeholder="Explain your reasoning (optional but recommended)..."
                rows={3}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none"
              />

              <button
                onClick={castVote}
                disabled={!voteChoice || submitting}
                className="w-full h-11 rounded-xl bg-court-blue text-white font-heading font-bold text-sm disabled:opacity-40 hover:bg-court-blue/90 transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Vote"}
              </button>
            </div>
          ) : isResolved ? (
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Gavel size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">Case has been resolved</p>
              {dispute.outcome && <p className="text-xs text-muted-foreground mt-1">{dispute.outcome}</p>}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <Shield size={24} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Only assigned jurors can vote</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   FILE A CASE FORM
═══════════════════════════════════════════════════════ */

const FileCaseForm = ({ onBack, onFiled }: { onBack: () => void; onFiled: () => void }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [againstId, setAgainstId] = useState("");
  const [spAmount, setSpAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim() || !againstId.trim() || !user) { setError("Fill all required fields"); return; }
    setSubmitting(true); setError("");
    const { error: e } = await supabase.from("disputes").insert({
      title: title.trim(),
      description: desc.trim(),
      filed_by: user.id,
      filed_against: againstId.trim(),
      sp_amount: parseInt(spAmount) || 0,
    });
    if (e) { setError(e.message); setSubmitting(false); return; }
    onFiled();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h2 className="font-heading text-xl font-bold text-foreground">File a Dispute</h2>
      </div>

      {error && (
        <div className="rounded-lg bg-alert-red/5 border border-alert-red/20 p-3 text-xs text-alert-red">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Case Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief description of the dispute" className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Filed Against (User ID) *</label>
          <input value={againstId} onChange={e => setAgainstId(e.target.value)} placeholder="User ID of the other party" className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">SP Amount at Stake</label>
          <input type="number" value={spAmount} onChange={e => setSpAmount(e.target.value)} placeholder="0" className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Full Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Describe the dispute in detail with timelines and facts..." className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none resize-none" />
        </div>
      </div>

      <button onClick={submit} disabled={submitting || !title.trim() || !againstId.trim()} className="w-full h-12 rounded-xl bg-alert-red text-white font-heading font-bold text-sm disabled:opacity-40 hover:bg-alert-red/90 transition-colors">
        {submitting ? "Filing..." : "File Dispute"}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN SKILL COURT TAB
═══════════════════════════════════════════════════════ */

export default function SkillCourtTab() {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "case" | "file">("list");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isJurorForCase, setIsJurorForCase] = useState(false);
  const [myDisputes, setMyDisputes] = useState<Dispute[]>([]);
  const [juryDuty, setJuryDuty] = useState<(JuryAssignment & { dispute?: Dispute })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ judged: 0, earned: 0, filed: 0 });

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [mineRes, juryRes, votesRes] = await Promise.all([
      supabase.from("disputes").select("*").or(`filed_by.eq.${user.id},filed_against.eq.${user.id}`).order("created_at", { ascending: false }),
      supabase.from("jury_assignments").select("*").eq("juror_id", user.id).eq("status", "pending"),
      supabase.from("jury_votes").select("*").eq("juror_id", user.id),
    ]);

    setMyDisputes((mineRes.data || []) as any);

    // Load dispute details for jury assignments
    const assignments = (juryRes.data || []) as any[];
    if (assignments.length > 0) {
      const caseIds = [...new Set(assignments.map(a => a.case_id))];
      const { data: cases } = await supabase.from("disputes").select("*").in("id", caseIds);
      const caseMap = new Map((cases || []).map((c: any) => [c.id, c]));
      setJuryDuty(assignments.map(a => ({ ...a, dispute: caseMap.get(a.case_id) })));
    } else {
      setJuryDuty([]);
    }

    setStats({
      judged: (votesRes.data || []).length,
      earned: (votesRes.data || []).length * 15,
      filed: (mineRes.data || []).length,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCase = (id: string, asJuror: boolean) => {
    setSelectedCaseId(id);
    setIsJurorForCase(asJuror);
    setView("case");
  };

  if (view === "case" && selectedCaseId) {
    return <CaseDetailView caseId={selectedCaseId} onBack={() => { setView("list"); loadData(); }} isJuror={isJurorForCase} />;
  }

  if (view === "file") {
    return <FileCaseForm onBack={() => setView("list")} onFiled={() => { setView("list"); loadData(); }} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-court-blue/10">
            <Scale size={24} className="text-court-blue" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Skill Court</h2>
            <p className="text-sm text-muted-foreground">Resolve disputes · Serve jury duty · Earn SP</p>
          </div>
        </div>
        <button onClick={() => setView("file")} className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-alert-red text-white text-xs font-heading font-bold hover:bg-alert-red/90 transition-colors">
          <Plus size={14} />File Dispute
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-2xl font-black text-court-blue">{stats.judged}</p>
          <p className="text-xs text-muted-foreground">Cases Judged</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-2xl font-black text-skill-green">{stats.earned}</p>
          <p className="text-xs text-muted-foreground">SP Earned</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="font-heading text-2xl font-black text-badge-gold">{stats.filed}</p>
          <p className="text-xs text-muted-foreground">My Cases</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="jury" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jury">
            Jury Duty {juryDuty.length > 0 && <span className="ml-1.5 text-[10px] bg-alert-red text-white rounded-full px-1.5">{juryDuty.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="my-cases">My Cases ({myDisputes.length})</TabsTrigger>
        </TabsList>

        {/* Jury Duty */}
        <TabsContent value="jury" className="space-y-4">
          <div className="rounded-xl border border-court-blue/20 bg-court-blue/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-court-blue" />
              <span className="text-sm font-medium text-foreground">Jury Duty Required</span>
            </div>
            <p className="text-xs text-muted-foreground">Free tier members must complete jury duty. Review evidence, vote on verdicts, and earn 15 SP per case.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" /></div>
          ) : juryDuty.length > 0 ? juryDuty.map(j => (
            <motion.div key={j.id} className="rounded-2xl border border-border bg-card overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-surface-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-court-blue/10 text-court-blue border-none text-[10px]">Jury Duty</Badge>
                  <Badge className="bg-surface-2 text-muted-foreground border-none text-[10px]">{j.juror_type}</Badge>
                </div>
                <span className="text-xs font-bold text-skill-green">+15 SP</span>
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-foreground mb-1">{j.dispute?.title || "Case"}</h4>
                <p className="text-xs text-muted-foreground mb-3">{j.dispute?.sp_amount || 0} SP at stake</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} />Assigned {new Date(j.assigned_at).toLocaleDateString()}
                  </span>
                  <button onClick={() => openCase(j.case_id, true)} className="rounded-lg bg-court-blue px-4 py-2 text-xs font-semibold text-white hover:bg-court-blue/90 transition-colors flex items-center gap-1">
                    Review Case <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-12 text-center">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-skill-green" />
              <p className="text-foreground font-medium">No pending jury duty</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </TabsContent>

        {/* My Cases */}
        <TabsContent value="my-cases" className="space-y-4">
          {loading ? (
            <div className="py-12 text-center"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" /></div>
          ) : myDisputes.length > 0 ? myDisputes.map(d => (
            <motion.div key={d.id} className="rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-foreground/20 transition-colors" onClick={() => openCase(d.id, false)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-surface-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${statusBadge(d.status)}`}>{d.status}</span>
                <span className="text-xs text-muted-foreground">{d.filed_by === user?.id ? "You filed" : "Filed against you"}</span>
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-foreground mb-1">{d.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{d.sp_amount} SP · {new Date(d.created_at).toLocaleDateString()}</p>

                {/* Verdict breakdown */}
                <div className="rounded-lg bg-surface-1 p-3 mb-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1.5">Jury Weight</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs"><Users size={10} className="text-muted-foreground" /><span>25% Users</span></div>
                    <div className="flex items-center gap-1 text-xs"><Cpu size={10} className="text-court-blue" /><span>25% AI</span></div>
                    <div className="flex items-center gap-1 text-xs"><Crown size={10} className="text-badge-gold" /><span>50% Expert</span></div>
                  </div>
                </div>

                {d.outcome && (
                  <div className="rounded-lg bg-skill-green/5 border border-skill-green/20 p-2 mb-3">
                    <p className="text-xs font-medium text-skill-green">{d.outcome}</p>
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <span className="flex items-center gap-1 text-xs text-court-blue hover:underline">
                    View Details <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-12 text-center">
              <Shield size={32} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-foreground font-medium">No active disputes</p>
              <p className="text-sm text-muted-foreground">All your gigs are running smoothly</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
