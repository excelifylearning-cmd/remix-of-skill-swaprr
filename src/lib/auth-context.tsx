import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  sp: number;
  elo: number;
  tier: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TEST_EMAIL = "AdminTester123";
const TEST_PASSWORD = "AdminTester123";

const TEST_USER: User = {
  name: "Admin Tester",
  email: "AdminTester123",
  role: "admin",
  sp: 12500,
  elo: 1850,
  tier: "Diamond",
  joinedAt: "2026-01-15",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ss_auth_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("ss_auth_user", JSON.stringify(u));
    else localStorage.removeItem("ss_auth_user");
  };

  const login = (email: string, password: string) => {
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      persist(TEST_USER);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password. Use test credentials to log in." };
  };

  const signup = (name: string, email: string, password: string) => {
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      persist({ ...TEST_USER, name: name || TEST_USER.name });
      return { success: true };
    }
    return { success: false, error: "Signup is in demo mode. Use 'AdminTester123' as email & password." };
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
