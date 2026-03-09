import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ user: null, profile: null, isAuthenticated: false, logout: vi.fn() }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import Footer from "@/components/shared/Footer";

describe("Footer", () => {
  it("renders brand name", () => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
    expect(screen.getByText(/Skill Swappr/i)).toBeInTheDocument();
  });

  it("renders navigation sections", () => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });
});
