import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import LoginPrompt from "@/components/shared/LoginPrompt";
import LoadingScreen from "@/components/shared/LoadingScreen";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, isLoading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(true);

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return (
      <LoginPrompt
        open={showPrompt}
        onOpenChange={setShowPrompt}
        message="You need to sign in to access this page."
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
