import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

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

const renderNav = () =>
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

describe("Navbar", () => {
  it("renders logo and nav links", () => {
    renderNav();
    expect(screen.getByText("Skill Swappr")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("shows login button when not authenticated", () => {
    renderNav();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
});
