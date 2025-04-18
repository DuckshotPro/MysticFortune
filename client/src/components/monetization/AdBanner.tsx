import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCrown } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AdBannerProps {
  variant?: "sidebar" | "inline" | "footer";
  showCloseButton?: boolean;
}

export function AdBanner({ variant = "footer", showCloseButton = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const handlePremiumClick = () => {
    toast({
      title: "Premium Coming Soon!",
      description: "Upgrade to Premium to remove ads and unlock more features.",
      variant: "default",
    });
  };

  if (!isVisible) return null;

  // Different styled ad banners based on placement
  if (variant === "sidebar") {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 border border-purple-700 shadow-lg"
      >
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-white/70">Sponsored</p>
          {showCloseButton && (
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/50 hover:text-white"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          )}
        </div>
        <h4 className="font-['Cinzel'] text-amber-400 text-sm mb-2">Enhance Your Spiritual Journey</h4>
        <p className="text-white text-xs mb-3">
          Discover premium crystals and tarot decks from trusted spiritual suppliers.
        </p>
        <Button 
          size="sm" 
          className="w-full bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs"
          onClick={() => window.open('https://example.com/spiritual-shop', '_blank')}
        >
          Explore Collection
        </Button>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 p-3 rounded-lg my-6 border border-purple-700/50 backdrop-blur-sm"
      >
        <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/70">Sponsored Content</p>
              {showCloseButton && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-white/50 hover:text-white ml-auto"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
              )}
            </div>
            <h4 className="font-['Cinzel'] text-amber-400 text-sm mt-1">Unlock Your Full Astrological Profile</h4>
            <p className="text-white text-xs my-1">
              Get a personalized birth chart analysis and discover your true cosmic potential.
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs self-center ml-4"
            onClick={() => window.open('https://example.com/astrology', '_blank')}
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    );
  }

  // Default footer banner
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900 to-indigo-900 p-3 border-t border-purple-700 fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 hidden sm:block">
            <span className="bg-amber-500 text-purple-950 px-2 py-1 rounded text-xs font-bold">
              AD
            </span>
          </div>
          <p className="text-white text-sm">
            <span className="font-semibold">Premium Offer:</span> 
            <span className="hidden sm:inline"> Remove ads and unlock exclusive readings.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs whitespace-nowrap"
            onClick={handlePremiumClick}
          >
            <FontAwesomeIcon icon={faCrown} className="mr-1" /> 
            Go Premium
          </Button>
          {showCloseButton && (
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white"
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