import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import MissionHeroSection from "./sections/MissionHeroSection";
import ProblemSection from "./sections/ProblemSection";
import TimelineSection from "./sections/TimelineSection";
import SuccessStoriesSection from "./sections/SuccessStoriesSection";
import UniversityPartnershipsSection from "./sections/UniversityPartnershipsSection";
import IndustryPartnershipsSection from "./sections/IndustryPartnershipsSection";
import TeamSection from "./sections/TeamSection";
import CommunityStatsSection from "./sections/CommunityStatsSection";
import ValuesCultureSection from "./sections/ValuesCultureSection";
import AboutCTASection from "./sections/AboutCTASection";

const AboutPage = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <CursorGlow />
      <Navbar />
      <MissionHeroSection />
      <ProblemSection />
      <TimelineSection />
      <SuccessStoriesSection />
      <UniversityPartnershipsSection />
      <IndustryPartnershipsSection />
      <TeamSection />
      <CommunityStatsSection />
      <ValuesCultureSection />
      <AboutCTASection />
    </div>
  </PageTransition>
);

export default AboutPage;
