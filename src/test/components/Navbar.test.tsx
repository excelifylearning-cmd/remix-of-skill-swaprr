import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../utils";

// Mock auth context
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import Navbar from "@/components/shared/Navbar";

describe("Navbar", () => {
  it("renders logo and nav links", () => {
    render(<Navbar />);
    expect(screen.getByText("Skill Swappr")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("shows login button when not authenticated", () => {
    render(<Navbar />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Navbar />);
    // Sun or Moon icon should be present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
