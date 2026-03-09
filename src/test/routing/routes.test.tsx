import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ user: null, profile: null, isAuthenticated: false, logout: vi.fn() }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/shared/TelemetryProvider", () => ({ default: () => null }));
vi.mock("@/components/shared/LiveChatWidget", () => ({ default: () => null }));
vi.mock("@/components/shared/CookieConsent", () => ({ default: () => null }));

const NotFound = lazy(() => import("@/pages/NotFound"));

describe("Routing", () => {
  it("renders 404 for unknown routes", async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={["/this-does-not-exist"]}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    });
  });
});
