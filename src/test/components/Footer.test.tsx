import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../utils";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ user: null, profile: null, isAuthenticated: false, logout: vi.fn() }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import Footer from "@/components/shared/Footer";

describe("Footer", () => {
  it("renders copyright and brand", () => {
    render(<Footer />);
    expect(screen.getByText(/Skill Swappr/i)).toBeInTheDocument();
  });

  it("renders navigation sections", () => {
    render(<Footer />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });
});
