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
    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("ss_registered_users") || "[]");
    const found = registeredUsers.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const userData: User = {
        name: found.name,
        email: found.email,
        role: "user",
        sp: 100,
        elo: 1000,
        tier: "Bronze",
        joinedAt: found.joinedAt || new Date().toISOString().split("T")[0],
      };
      persist(userData);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const signup = (name: string, email: string, password: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem("ss_registered_users") || "[]");
    const exists = registeredUsers.find((u: any) => u.email === email);
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser = { name, email, password, joinedAt: new Date().toISOString().split("T")[0] };
    registeredUsers.push(newUser);
    localStorage.setItem("ss_registered_users", JSON.stringify(registeredUsers));
    
    const userData: User = {
      name,
      email,
      role: "user",
      sp: 100,
      elo: 1000,
      tier: "Bronze",
      joinedAt: newUser.joinedAt,
    };
    persist(userData);
    return { success: true };
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
