import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "wouter";
import { AdSense } from "@/components/AdSense";

interface AdBannerProps {
  variant?: "footer" | "sidebar" | "inline";
  showCloseButton?: boolean;
}

function AdBanner({ variant = "footer", showCloseButton = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [, setLocation] = useLocation();

  if (!isVisible) return null;

  const handlePremiumClick = () => {
    setLocation("/premium");
  };

  // NOTE: Replace these placeholder IDs with your actual Google AdSense Ad Unit IDs
  // Go to AdSense Console -> Ads -> By ad unit -> Create new ad unit
  const AD_SLOTS = {
    // Recommended: "Display ad" -> "Square" or "Vertical"
    sidebar: import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT || "1234567890",
    // Recommended: "Display ad" -> "Horizontal" or "Square"
    inline: import.meta.env.VITE_ADSENSE_INLINE_SLOT || "1234567891",
    // Recommended: "Display ad" -> "Horizontal"
    footer: import.meta.env.VITE_ADSENSE_FOOTER_SLOT || "1234567892"
  };

  if (variant === "sidebar") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-4 relative bg-purple-950/30 rounded-lg p-2 min-h-[600px] flex flex-col items-center justify-center border border-purple-900/50"
      >
        <div className="absolute top-0 right-0 p-1">
          {showCloseButton && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {/* AdSense Unit */}
          <AdSense
            adSlot={AD_SLOTS.sidebar}
            adFormat="vertical"
            adStyle={{ display: 'block', minWidth: '250px', minHeight: '250px' }}
          />
        </div>
        <p className="text-[10px] text-white/20 mt-2">Advertisement</p>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-8 relative bg-purple-950/30 rounded-lg p-4 min-h-[250px] flex flex-col items-center justify-center border border-purple-900/50"
      >
        <div className="absolute top-2 right-2">
          {showCloseButton && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {/* AdSense Unit */}
          <AdSense
            adSlot={AD_SLOTS.inline}
            adFormat="auto"
            adStyle={{ display: 'block', width: '100%' }}
          />
        </div>
        <p className="text-[10px] text-white/20 mt-2">Advertisement</p>
      </motion.div>
    );
  }

  // Default footer banner
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900 to-indigo-900 p-2 border-t border-amber-500/30 fixed bottom-0 left-0 right-0 z-40 shadow-lg"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* AdSense Area */}
        <div className="flex-grow w-full sm:w-auto flex justify-center min-h-[90px] bg-black/20 rounded relative">
           <AdSense
             adSlot={AD_SLOTS.footer}
             adFormat="horizontal"
             adStyle={{ display: 'block', width: '100%', maxHeight: '90px' }}
           />
           <span className="absolute bottom-0 right-1 text-[8px] text-white/30">Ad</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            size="sm" 
            className="bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs whitespace-nowrap shadow-md h-8"
            onClick={handlePremiumClick}
          >
            <FontAwesomeIcon icon={faCrown} className="mr-1" /> 
            Remove Ads
          </Button>
          {showCloseButton && (
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/50 hover:text-white p-1"
              aria-label="Close advertisement"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AdBanner;
