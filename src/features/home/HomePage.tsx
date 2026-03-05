import Navbar from "@/components/shared/Navbar";
import HeroSection from "./sections/HeroSection";
import SkillPointsSection from "./sections/SkillPointsSection";
import MarketplacePreviewSection from "./sections/MarketplacePreviewSection";
import PlatformFormatsSection from "./sections/PlatformFormatsSection";
import GamificationSection from "./sections/GamificationSection";
import WorkspacePreviewSection from "./sections/WorkspacePreviewSection";
import SkillCourtSection from "./sections/SkillCourtSection";
import GuildSection from "./sections/GuildSection";
import UniversityPartnersSection from "./sections/UniversityPartnersSection";
import SuccessStoriesSection from "./sections/SuccessStoriesSection";
import PricingQuickSection from "./sections/PricingQuickSection";
import CTAFooterSection from "./sections/CTAFooterSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SkillPointsSection />
      <MarketplacePreviewSection />
      <PlatformFormatsSection />
      <GamificationSection />
      <WorkspacePreviewSection />
      <SkillCourtSection />
      <GuildSection />
      <UniversityPartnersSection />
      <SuccessStoriesSection />
      <PricingQuickSection />
      <CTAFooterSection />
    </div>
  );
};

export default HomePage;
