import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCrown, faStar, faGem } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface AdBannerProps {
  variant?: "sidebar" | "inline" | "footer";
  showCloseButton?: boolean;
}

export function AdBanner({ variant = "footer", showCloseButton = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handlePremiumClick = () => {
    setLocation("/premium");
  };

  if (!isVisible) return null;

  // Different styled ad banners based on placement
  if (variant === "sidebar") {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 border-2 border-amber-500/50 shadow-lg relative overflow-hidden"
      >
        {/* Visual indicator that this is an ad zone */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/30 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold bg-amber-500/90 text-purple-950 px-2 py-0.5 rounded">SPONSORED</p>
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
          
          {/* Placeholder image for advertisement */}
          <div className="w-full h-24 bg-gradient-to-r from-purple-800 to-indigo-800 rounded mb-3 flex items-center justify-center">
            <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-xl" />
          </div>
          
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
        </div>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 p-4 rounded-lg my-6 border-2 border-amber-500/40 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Decorative elements to make ad zone more visible */}
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-start relative">
          {/* Ad content */}
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold bg-amber-500/90 text-purple-950 px-2 py-0.5 rounded">SPONSORED</p>
              {showCloseButton && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-white/50 hover:text-white ml-auto"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
              )}
            </div>
            
            <div className="md:flex items-center gap-4 mt-2">
              {/* Placeholder image for advertisement */}
              <div className="w-full md:w-24 h-20 md:h-20 bg-gradient-to-r from-purple-800 to-indigo-800 rounded mb-3 md:mb-0 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xl" />
              </div>
              
              <div>
                <h4 className="font-['Cinzel'] text-amber-400 text-sm">Unlock Your Full Astrological Profile</h4>
                <p className="text-white text-xs my-1">
                  Get a personalized birth chart analysis and discover your true cosmic potential.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs self-center mt-3 md:mt-0 md:ml-4 w-full md:w-auto"
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
      className="bg-gradient-to-r from-purple-900 to-indigo-900 p-3 border-t-2 border-amber-500/40 fixed bottom-0 left-0 right-0 z-40 shadow-lg relative overflow-hidden"
    >
      {/* Decorative elements to make ad zone more visible */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 relative">
        <div className="flex items-center">
          <div className="mr-2 sm:mr-4">
            <span className="bg-amber-500 text-purple-950 px-2 py-1 rounded text-xs font-bold">
              AD
            </span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCrown} className="text-amber-400 mr-2 hidden sm:block" />
            <p className="text-white text-sm">
              <span className="font-semibold">Premium Offer:</span> 
              <span className="hidden sm:inline"> Remove ads and unlock exclusive readings!</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-purple-950 text-xs whitespace-nowrap shadow-md"
            onClick={handlePremiumClick}
          >
            <FontAwesomeIcon icon={faCrown} className="mr-1" /> 
            Go Premium
          </Button>
          {showCloseButton && (
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white bg-purple-800/50 hover:bg-purple-800 p-1 rounded-full"
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