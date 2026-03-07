import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/shared/ScrollToTop";
import LoadingScreen from "@/components/shared/LoadingScreen";

const HomePage = lazy(() => import("./features/home/HomePage"));
const AboutPage = lazy(() => import("./features/about/AboutPage"));
const FeaturesPage = lazy(() => import("./features/features/FeaturesPage"));
const HowItWorksPage = lazy(() => import("./features/how-it-works/HowItWorksPage"));
const PricingPage = lazy(() => import("./features/pricing/PricingPage"));
const EnterprisePage = lazy(() => import("./features/enterprise/EnterprisePage"));
const MarketplacePage = lazy(() => import("./features/marketplace/MarketplacePage"));
const LegalPage = lazy(() => import("./features/legal/LegalPage"));
const RoadmapPage = lazy(() => import("./features/roadmap/RoadmapPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
