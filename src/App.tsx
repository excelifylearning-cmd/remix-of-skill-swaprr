import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/shared/ScrollToTop";
import LoadingScreen from "@/components/shared/LoadingScreen";
import LiveChatWidget from "@/components/shared/LiveChatWidget";
import CookieConsent from "@/components/shared/CookieConsent";

const HomePage = lazy(() => import("./features/home/HomePage"));
const AboutPage = lazy(() => import("./features/about/AboutPage"));
const FeaturesPage = lazy(() => import("./features/features/FeaturesPage"));
const HowItWorksPage = lazy(() => import("./features/how-it-works/HowItWorksPage"));
const PricingPage = lazy(() => import("./features/pricing/PricingPage"));
const EnterprisePage = lazy(() => import("./features/enterprise/EnterprisePage"));
const MarketplacePage = lazy(() => import("./features/marketplace/MarketplacePage"));
const LegalPage = lazy(() => import("./features/legal/LegalPage"));
const RoadmapPage = lazy(() => import("./features/roadmap/RoadmapPage"));
const ContactPage = lazy(() => import("./features/contact/ContactPage"));
const BlogPage = lazy(() => import("./features/blog/BlogPage"));
const ForumsPage = lazy(() => import("./features/forums/ForumsPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const SignupPage = lazy(() => import("./features/auth/SignupPage"));
const HelpPage = lazy(() => import("./features/help/HelpPage"));
const HistoryPage = lazy(() => import("./features/history/HistoryPage"));
const LeaderboardPage = lazy(() => import("./features/leaderboard/LeaderboardPage"));
const TransactionLookupPage = lazy(() => import("./features/transaction/TransactionLookupPage"));
const FAQPage = lazy(() => import("./features/faq/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MaintenancePage = lazy(() => import("./pages/Maintenance"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoon"));
const ServerErrorPage = lazy(() => import("./pages/ServerError"));
const ForbiddenPage = lazy(() => import("./pages/Forbidden"));
const OfflinePage = lazy(() => import("./pages/Offline"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/transaction" element={<TransactionLookupPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
