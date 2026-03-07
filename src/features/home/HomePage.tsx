import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
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
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
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
    </PageTransition>
  );
};

export default HomePage;
