import { useNavigate } from "react-router-dom";
import { LogIn, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

interface LoginPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}

const LoginPrompt = ({ open, onOpenChange, message }: LoginPromptProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
            <LogIn size={18} /> Sign in required
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {message || "You need to be signed in to perform this action."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => { onOpenChange(false); navigate("/login"); }}
            className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Sign In
          </button>
          <button
            onClick={() => { onOpenChange(false); navigate("/signup"); }}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-1"
          >
            Create Account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
