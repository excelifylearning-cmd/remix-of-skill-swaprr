import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ReviewModalProps {
  listing: { id: string; title: string; user_id: string } | null;
  onClose: () => void;
}

const ReviewModal = ({ listing, onClose }: ReviewModalProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [quality, setQuality] = useState(5);
  const [timeliness, setTimeliness] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  if (!listing || !user) return null;

  const handleSubmit = async () => {
    setSending(true);
    const { error } = await (supabase as any).from("reviews").insert({
      listing_id: listing.id,
      reviewer_id: user.id,
      reviewee_id: listing.user_id,
      rating,
      communication_rating: communication,
      quality_rating: quality,
      timeliness_rating: timeliness,
      comment: comment.trim() || null,
    });

    if (error) {
      toast.error(error.message.includes("duplicate") ? "You already reviewed this" : "Failed to submit review");
    } else {
      toast.success("Review submitted!");
      onClose();
    }
    setSending(false);
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => onChange(s)} className="p-0.5">
            <Star size={18} className={s <= value ? "text-badge-gold fill-badge-gold" : "text-muted-foreground/30"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl border border-border bg-card overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Leave a Review</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-xl bg-surface-1 p-3">
              <p className="text-sm font-medium text-foreground">{listing.title}</p>
            </div>

            <StarRating value={rating} onChange={setRating} label="Overall Rating" />

            <div className="grid grid-cols-3 gap-4">
              <StarRating value={communication} onChange={setCommunication} label="Communication" />
              <StarRating value={quality} onChange={setQuality} label="Quality" />
              <StarRating value={timeliness} onChange={setTimeliness} label="Timeliness" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Comment (optional)</label>
              <textarea
                value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit} disabled={sending}
              className="w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-background flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={14} /> {sending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
