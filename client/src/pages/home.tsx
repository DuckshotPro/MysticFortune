import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import CrystalBall from "@/components/fortune/CrystalBall";
import HoroscopeSection from "@/components/fortune/HoroscopeSection";
import FortuneCards from "@/components/fortune/FortuneCards";
import SavedFortunes from "@/components/fortune/SavedFortunes";
import { AdBanner } from "@/components/monetization/AdBanner";
import { shouldShowAds } from "@/lib/premiumUtils";

export default function Home() {
  const [showAds, setShowAds] = useState(true);
  
  // Check premium status to determine if ads should be shown
  useEffect(() => {
    setShowAds(shouldShowAds());
    
    // Listen for storage changes (in case premium status changes in another tab)
    const handleStorageChange = () => {
      setShowAds(shouldShowAds());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-purple-950 text-white font-['Montserrat']">
      <Header />
      <main className="flex-grow pb-16" id="main-content">
        <Hero />
        <CrystalBall />
        
        {/* Inline Ad - only shown for non-premium users */}
        {showAds && (
          <div className="container mx-auto px-4">
            <AdBanner variant="inline" />
          </div>
        )}
        
        <HoroscopeSection />
        <FortuneCards />
        <SavedFortunes />
      </main>
      
      {/* Footer Ad - only shown for non-premium users */}
      {showAds && <AdBanner variant="footer" />}
      
      <Footer />
    </div>
  );
}
