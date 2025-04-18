import { useState, useEffect } from "react";
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
  faCrown,
  faCopy,
  faImage
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebook, 
  faTwitter, 
  faSnapchat, 
  faWhatsapp, 
  faTelegram, 
  faPinterest
} from "@fortawesome/free-brands-svg-icons";
import { generateFortuneBackground, generateFortuneSnippet, generateCallToAction } from "@/lib/fortuneVisuals";

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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showVisualPreview, setShowVisualPreview] = useState(false);
  const [shareVisualUrl, setShareVisualUrl] = useState('');
  const [shareSnippet, setShareSnippet] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  // Generate engaging fortune snippet and visual background
  useEffect(() => {
    // Create the visual background for sharing
    const category = fortune.category as FortuneCategoryType;
    const visualUrl = generateFortuneBackground(category, fortune.title);
    setShareVisualUrl(visualUrl);
    
    // Generate the engaging text snippet
    const snippet = generateFortuneSnippet(fortune.content, category);
    setShareSnippet(snippet);
  }, [fortune]);
  
  // Create dynamic share URLs with tracking and snippets
  const getShareUrl = (platform: string) => {
    // Replace the platform placeholder in the tracking URL
    const trackingSnippet = shareSnippet.replace('{platform}', platform);
    const encodedSnippet = encodeURIComponent(trackingSnippet);
    
    // Add call to action based on platform
    const callToAction = generateCallToAction(platform);
    const fullShareText = `${trackingSnippet}\n\n${callToAction}`;
    const encodedFullShareText = encodeURIComponent(fullShareText);
    
    // Create platform-specific share URLs
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedFullShareText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedSnippet}`,
      whatsapp: `https://wa.me/?text=${encodedFullShareText}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedFullShareText}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(shareVisualUrl)}&description=${encodedSnippet}`,
      snapchat: `https://snapchat.com/scan?attachmentUrl=${encodeURIComponent(window.location.href)}`
    };
    
    return urls[platform] || '';
  };
  
  const handleShareToSocial = (platform: string) => {
    setSelectedPlatform(platform);
    
    // Show visual preview for image-focused platforms like Pinterest
    if (platform === 'pinterest') {
      setShowVisualPreview(true);
    } else {
      // Open share dialog directly for text-focused platforms
      window.open(getShareUrl(platform), '_blank', 'noopener,noreferrer,width=600,height=600');
      
      toast({
        title: `Sharing to ${platform}`,
        description: generateCallToAction(platform),
        variant: "default",
      });
    }
  };
  
  const handleConfirmVisualShare = () => {
    if (selectedPlatform) {
      window.open(getShareUrl(selectedPlatform), '_blank', 'noopener,noreferrer,width=600,height=600');
      setShowVisualPreview(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    // Use the engaging snippet with tracking for copy/paste sharing
    navigator.clipboard.writeText(shareSnippet.replace('{platform}', 'clipboard'))
      .then(() => {
        toast({
          title: "Fortune copied to clipboard!",
          description: "Share your fortune with friends and family.",
          variant: "default",
        });
        setShowShareOptions(false);
      })
      .catch(err => {
        toast({
          title: "Couldn't copy fortune",
          description: "Please try again later.",
          variant: "destructive",
        });
      });
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
    
    // Hide visual preview when closing share options
    if (showShareOptions) {
      setShowVisualPreview(false);
    }
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
              className="text-teal-500 hover:text-teal-400 flex items-center relative"
              onClick={handleShare}
            >
              <FontAwesomeIcon icon={faShareAlt} className="mr-1" /> Share
            </Button>
          </div>
          
          {/* Social Share Options */}
          {showShareOptions && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-900 rounded-lg p-4 mb-4 border border-amber-500/30 shadow-lg"
            >
              <h4 className="text-amber-400 font-semibold mb-3">Share Your Fortune</h4>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-blue-500 hover:text-blue-400 h-auto py-2"
                  onClick={() => handleShareToSocial('facebook')}
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-xl mb-1" />
                  <span className="text-xs">Facebook</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-sky-500 hover:text-sky-400 h-auto py-2"
                  onClick={() => handleShareToSocial('twitter')}
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-xl mb-1" />
                  <span className="text-xs">Twitter</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 h-auto py-2"
                  onClick={() => handleShareToSocial('snapchat')}
                >
                  <FontAwesomeIcon icon={faSnapchat} className="text-xl mb-1" />
                  <span className="text-xs">Snapchat</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-green-500 hover:text-green-400 h-auto py-2"
                  onClick={() => handleShareToSocial('whatsapp')}
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-xl mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-cyan-500 hover:text-cyan-400 h-auto py-2"
                  onClick={() => handleShareToSocial('telegram')}
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-xl mb-1" />
                  <span className="text-xs">Telegram</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center justify-center text-red-500 hover:text-red-400 h-auto py-2"
                  onClick={() => handleShareToSocial('pinterest')}
                >
                  <FontAwesomeIcon icon={faPinterest} className="text-xl mb-1" />
                  <span className="text-xs">Pinterest</span>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center justify-center w-full border-amber-500/50 text-amber-400 hover:text-amber-300"
                onClick={handleCopyToClipboard}
              >
                <FontAwesomeIcon icon={faCopy} className="mr-2" /> 
                Copy to Clipboard
              </Button>
            </motion.div>
          )}
          
          <div className="text-xs text-white/60">
            <p>Fortune revealed on {formatDate(new Date())}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
