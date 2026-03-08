import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

interface AppNavProps {
  backTo?: string;
  backLabel?: string;
}

const AppNav = ({ backTo, backLabel }: AppNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => backTo ? navigate(backTo) : navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            {backLabel || "Back"}
          </button>
        </div>
        <Link to="/" className="font-heading text-sm font-bold text-foreground">
          Skill<span className="text-muted-foreground">Swappr</span>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Home size={14} />
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default AppNav;
