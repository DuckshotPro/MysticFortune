import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Fortune, FortuneCategoryType } from "@shared/schema";
import { modalVariants, backdropVariants } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faBriefcase, 
  faStar, 
  faTimes, 
  faBookmark,
  faShareAlt,
  faCrown
} from "@fortawesome/free-solid-svg-icons";

const categoryIcons: Record<FortuneCategoryType, any> = {
  love: faHeart,
  career: faBriefcase,
  general: faStar
};

interface FortuneModalProps {
  fortune: Fortune;
  onClose: () => void;
  onSave: () => void;
}

export function FortuneModal({ fortune, onClose, onSave }: FortuneModalProps) {
  const { toast } = useToast();
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  
  const handleShare = () => {
    // In a real app, this would open a share dialog or copy a unique link
    navigator.clipboard.writeText(
      `Check out my mystical fortune from Mystic Fortune: "${fortune.title}" - ${fortune.content}`
    ).then(() => {
      toast({
        title: "Fortune copied to clipboard!",
        description: "Share your fortune with friends and family.",
        variant: "default",
      });
    }).catch(err => {
      toast({
        title: "Couldn't copy fortune",
        description: "Please try again later.",
        variant: "destructive",
      });
    });
  };
  
  const handleUpgradeToPremium = () => {
    // In a real app, this would redirect to payment page or open payment modal
    toast({
      title: "Premium Coming Soon!",
      description: "Premium features will be available in the next update.",
      variant: "default",
    });
    setShowPremiumOffer(false);
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-purple-950/80 flex items-center justify-center z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="w-11/12 max-w-md bg-purple-950 rounded-lg shadow-2xl border border-amber-500 p-6 transform transition-all"
        variants={modalVariants}
      >
        <div className="text-right mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-amber-500"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-900">
            <FontAwesomeIcon 
              icon={categoryIcons[fortune.category as FortuneCategoryType]} 
              className="text-amber-500 text-2xl" 
            />
          </div>
          
          <h3 className="font-['Cinzel'] text-2xl text-amber-500 mb-2">{fortune.title}</h3>
          <p className="mb-6 text-white">{fortune.content}</p>
          
          {/* Premium Content Teaser */}
          <div className="mb-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 border border-amber-500/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FontAwesomeIcon icon={faCrown} className="text-amber-400" />
              <h4 className="font-['Cinzel'] text-amber-400 text-lg">Premium Insights</h4>
            </div>
            <p className="text-white/80 text-sm mb-3">
              {showPremiumOffer ? 
                "Unlock deeper cosmic insights, personalized guidance, and ad-free experience with Mystic Fortune Premium." :
                "Upgrade to Premium to reveal deeper cosmic insights and detailed guidance for your path..."
              }
            </p>
            <Button 
              variant="outline"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 border-none hover:from-amber-400 hover:to-amber-500 text-sm px-4 py-2 font-semibold"
              onClick={() => setShowPremiumOffer(!showPremiumOffer)}
            >
              {showPremiumOffer ? "Hide Premium Details" : "Tell Me More"}
            </Button>
            
            {showPremiumOffer && (
              <div className="mt-3 animate-fadeIn">
                <ul className="text-white/80 text-sm text-left space-y-1 mb-3">
                  <li>• Detailed astrological analysis</li>
                  <li>• Personalized monthly forecasts</li>
                  <li>• Compatibility insights</li>
                  <li>• Ad-free experience</li>
                </ul>
                <Button 
                  className="bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold"
                  onClick={handleUpgradeToPremium}
                >
                  <FontAwesomeIcon icon={faCrown} className="mr-2" /> 
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-6 mb-4">
            <Button 
              variant="ghost" 
              className="text-teal-500 hover:text-teal-400 flex items-center"
              onClick={onSave}
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-1" /> Save
            </Button>
            <Button 
              variant="ghost" 
              className="text-teal-500 hover:text-teal-400 flex items-center"
              onClick={handleShare}
            >
              <FontAwesomeIcon icon={faShareAlt} className="mr-1" /> Share
            </Button>
          </div>
          
          <div className="text-xs text-white/60">
            <p>Fortune revealed on {formatDate(new Date())}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
