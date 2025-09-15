import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import DailyRewardSystem from "@/components/rewards/DailyRewardSystem";
import InteractiveTarot from "@/components/fortune/InteractiveTarot";
import CrystalBall from "@/components/fortune/CrystalBall";
import HoroscopeSection from "@/components/fortune/HoroscopeSection";
import FortuneCards from "@/components/fortune/FortuneCards";
import SavedFortunes from "@/components/fortune/SavedFortunes";
import PersonalizedFortuneGenerator from "@/components/ai/PersonalizedFortuneGenerator";
import WeeklyPreview from "@/components/premium/WeeklyPreview";
import AIArtworkGenerator from "@/components/premium/AIArtworkGenerator";
import AdBanner from "@/components/monetization/AdBanner";
import ContentPreview from "@/components/content/ContentPreview";
import { SoundControls } from "@/components/ui/sound-controls";
import { shouldShowAds } from "@/lib/premiumUtils";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import GuidedTour from "@/components/onboarding/GuidedTour";
import DailyStreakTracker from "@/components/engagement/DailyStreakTracker";
import ViralShareSystem from "@/components/social/ViralShareSystem";
import { errorHandler, handleApiError, ErrorType } from "@/lib/errorHandling";

export default function Home() {
  const [showAds, setShowAds] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [userOnboarded, setUserOnboarded] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<any>(null);

  // Check premium status and onboarding status
  useEffect(() => {
    setShowAds(shouldShowAds());

    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem('mystic-onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('mystic-onboarding-skipped');
    const hasCompletedTour = localStorage.getItem('mystic-tour-completed');
    const hasSkippedTour = localStorage.getItem('mystic-tour-skipped');
    
    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      setShowOnboarding(true);
    } else {
      setUserOnboarded(true);
      
      // Show guided tour for returning users who haven't seen it
      if (!hasCompletedTour && !hasSkippedTour) {
        setTimeout(() => setShowGuidedTour(true), 2000);
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      setShowAds(shouldShowAds());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed with data:', data);
    localStorage.setItem('mystic-onboarding-completed', 'true');
    localStorage.setItem('mystic-user-preferences', JSON.stringify(data));
    setShowOnboarding(false);
    setUserOnboarded(true);
    
    // Show tour after onboarding
    setTimeout(() => setShowGuidedTour(true), 1000);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('mystic-onboarding-skipped', 'true');
    setShowOnboarding(false);
    setUserOnboarded(true);
    
    // Still show tour for skipped onboarding
    setTimeout(() => setShowGuidedTour(true), 1000);
  };

  const handleTourComplete = () => {
    setShowGuidedTour(false);
  };

  const handleTourSkip = () => {
    setShowGuidedTour(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-950 text-white font-['Montserrat']">
      <Header />
      <main className="flex-grow pb-16" id="main-content">
        <Hero />

        {/* DAILY REWARDS - FRONT AND CENTER */}
        <DailyRewardSystem />

        {/* Sound Controls - Fixed Position */}
        <div className="fixed top-20 right-4 z-40">
          <SoundControls compact />
        </div>

        {/* INTERACTIVE TAROT - VISUAL AND ENGAGING */}
        <InteractiveTarot />

        <CrystalBall />
        
        {/* Engagement Features */}
        {userOnboarded && (
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Daily Streak Tracker */}
              <div data-tour="daily-streak">
                <DailyStreakTracker />
              </div>
              
              {/* Viral Share System */}
              {currentFortune && (
                <div data-tour="share-system">
                  <ViralShareSystem 
                    content={{
                      fortuneText: currentFortune.content,
                      category: currentFortune.category,
                      zodiacSign: "Mystical Soul",
                      userName: "Fortune Seeker"
                    }}
                    onShare={(platform) => {
                      console.log(`Shared to ${platform}`);
                      // Track sharing analytics
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        <ContentPreview />

        {/* Inline Ad - only shown for non-premium users */}
        {showAds && (
          <div className="container mx-auto px-4">
            <AdBanner variant="inline" />
          </div>
        )}

        <HoroscopeSection />

        {/* Weekly Preview - Premium Feature */}
        <div className="container mx-auto px-4 py-8">
          <WeeklyPreview />
        </div>

        {/* Full Sound Controls */}
        <div className="container mx-auto px-4 py-8">
          <SoundControls />
        </div>

        <FortuneCards />
        <SavedFortunes />
      </main>

      {/* Footer Ad - only shown for non-premium users */}
      {showAds && <AdBanner variant="footer" />}

      <Footer />
      
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      {/* Guided Tour */}
      <GuidedTour 
        isActive={showGuidedTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </div>
  );
}