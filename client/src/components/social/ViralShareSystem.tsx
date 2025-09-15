import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Copy, Sparkles, Heart, MessageCircle, Users, Gift } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faTiktok, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faMagic, faGem, faHandSparkles } from "@fortawesome/free-solid-svg-icons";
import html2canvas from 'html2canvas';

interface ShareableContent {
  fortuneText: string;
  category: 'love' | 'career' | 'general';
  zodiacSign?: string;
  userName?: string;
  shareableImage?: string;
}

interface ViralShareSystemProps {
  content: ShareableContent;
  onShare?: (platform: string) => void;
}

export default function ViralShareSystem({ content, onShare }: ViralShareSystemProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const templates = [
    {
      name: "Mystic Glow",
      gradient: "from-purple-600 via-pink-500 to-amber-500",
      textColor: "text-white",
      accentColor: "text-amber-300",
      emoji: "✨"
    },
    {
      name: "Cosmic Dream",
      gradient: "from-indigo-900 via-purple-800 to-pink-700",
      textColor: "text-white",
      accentColor: "text-cyan-300",
      emoji: "🌌"
    },
    {
      name: "Golden Oracle",
      gradient: "from-amber-600 via-orange-500 to-red-500",
      textColor: "text-white",
      accentColor: "text-yellow-200",
      emoji: "🔮"
    },
    {
      name: "Ethereal Light",
      gradient: "from-blue-400 via-purple-500 to-pink-500",
      textColor: "text-white",
      accentColor: "text-blue-200",
      emoji: "⭐"
    }
  ];

  const socialPlatforms = [
    {
      name: "Instagram",
      icon: faInstagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      hashtags: "#MysticFortune #Spiritual #Guidance #Destiny",
      template: (text: string) => `${content.fortuneText}\n\n✨ Get your free personalized reading at MysticFortune.com\n\n${content.zodiacSign ? `#${content.zodiacSign}` : ''} ${hashtags}`
    },
    {
      name: "Twitter",
      icon: faTwitter,
      color: "bg-blue-500",
      hashtags: "#Fortune #Mystical #AI #Guidance",
      template: (text: string) => `🔮 My fortune revealed: "${content.fortuneText.slice(0, 100)}..."\n\n✨ Get yours free → MysticFortune.com\n\n${hashtags}`
    },
    {
      name: "TikTok",
      icon: faTiktok,
      color: "bg-black",
      hashtags: "#MysticTok #Fortune #Spiritual #FYP",
      template: (text: string) => `My AI fortune said this... 🤯\n\n"${content.fortuneText}"\n\nLink in bio for your free reading! ${hashtags}`
    },
    {
      name: "Facebook",
      icon: faFacebook,
      color: "bg-blue-600",
      hashtags: "#Spiritual #Fortune #Guidance",
      template: (text: string) => `I just got the most amazing personalized fortune reading! 🔮\n\n"${content.fortuneText}"\n\nYou can get your free reading too at MysticFortune.com ✨`
    }
  ];

  const generateShareableImage = async () => {
    if (!shareCardRef.current) return null;

    setGeneratingImage(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2,
        width: 400,
        height: 600
      });
      
      const imageData = canvas.toDataURL('image/png');
      setGeneratingImage(false);
      return imageData;
    } catch (error) {
      console.error('Error generating image:', error);
      setGeneratingImage(false);
      return null;
    }
  };

  const shareToSocial = async (platform: any) => {
    const shareText = platform.template(content.fortuneText);
    const url = window.location.origin;
    
    // Generate image for visual platforms
    let imageUrl = '';
    if (platform.name === 'Instagram' || platform.name === 'Facebook') {
      imageUrl = await generateShareableImage() || '';
    }

    // Platform-specific sharing
    switch (platform.name) {
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${url}`, '_blank');
        break;
      case 'Facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'Instagram':
      case 'TikTok':
        // Copy to clipboard for manual sharing
        await navigator.clipboard.writeText(shareText);
        alert(`${platform.name} content copied to clipboard! Paste it in your ${platform.name} app.`);
        break;
    }

    onShare?.(platform.name);
  };

  const copyToClipboard = async () => {
    const shareText = `🔮 "${content.fortuneText}"\n\n✨ Get your free mystical reading at MysticFortune.com`;
    await navigator.clipboard.writeText(shareText);
  };

  const downloadImage = async () => {
    const imageData = await generateShareableImage();
    if (imageData) {
      const link = document.createElement('a');
      link.download = 'mystic-fortune-share.png';
      link.href = imageData;
      link.click();
    }
  };

  const template = templates[selectedTemplate];

  return (
    <>
      <Card className="bg-purple-950/60 border-purple-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Cinzel'] text-lg text-amber-400 flex items-center">
              <Share2 className="mr-2" />
              Share Your Fortune
            </h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Earn Mystical Points! 🌟
            </Badge>
          </div>

          {/* Template Selector */}
          <div className="mb-6">
            <p className="text-sm text-white/70 mb-3">Choose your mystical style:</p>
            <div className="grid grid-cols-4 gap-2">
              {templates.map((tmpl, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTemplate(index)}
                  className={`relative h-16 rounded-lg bg-gradient-to-br ${tmpl.gradient} flex items-center justify-center text-2xl border-2 transition-all ${
                    selectedTemplate === index ? 'border-white' : 'border-transparent'
                  }`}
                >
                  {tmpl.emoji}
                  {selectedTemplate === index && (
                    <motion.div
                      layoutId="selected-template"
                      className="absolute inset-0 border-2 border-amber-400 rounded-lg"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Shareable Card Preview */}
          <div 
            ref={shareCardRef}
            className={`relative w-full aspect-[2/3] rounded-xl bg-gradient-to-br ${template.gradient} p-6 flex flex-col justify-between overflow-hidden mb-4`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl">{template.emoji}</div>
              <div className="absolute bottom-4 right-4 text-4xl opacity-50">✨</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🔮</div>
            </div>

            <div className="relative z-10">
              <div className={`text-center ${template.textColor} mb-4`}>
                <h4 className="font-['Cinzel'] text-xl mb-2">Your Mystical Fortune</h4>
                {content.zodiacSign && (
                  <Badge className={`${template.accentColor} bg-white/20 backdrop-blur-sm`}>
                    {content.zodiacSign}
                  </Badge>
                )}
              </div>

              <div className={`${template.textColor} text-center mb-4`}>
                <p className="text-lg font-medium leading-relaxed px-2">
                  "{content.fortuneText}"
                </p>
              </div>
            </div>

            <div className={`relative z-10 text-center ${template.textColor}`}>
              <div className={`${template.accentColor} mb-2`}>
                <FontAwesomeIcon icon={faHandSparkles} className="text-2xl" />
              </div>
              <p className="text-sm font-medium">MysticFortune.com</p>
              <p className="text-xs opacity-80">Free AI-Powered Readings</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Share2 className="mr-2 w-4 h-4" />
              Share Now
            </Button>
            <Button
              onClick={downloadImage}
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              disabled={generatingImage}
            >
              <Download className="mr-2 w-4 h-4" />
              {generatingImage ? 'Generating...' : 'Download'}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="text-white/70 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Sharing Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-700 rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <h3 className="font-['Cinzel'] text-xl text-amber-400 mb-2">
                  Share Your Fortune
                </h3>
                <p className="text-white/70 text-sm">
                  Spread the mystical wisdom and earn bonus points!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => (
                  <motion.button
                    key={platform.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => shareToSocial(platform)}
                    className={`${platform.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-all hover:shadow-lg`}
                  >
                    <FontAwesomeIcon icon={platform.icon} className="text-2xl" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <p className="text-green-400 text-sm">
                  <Gift className="inline mr-1 w-4 h-4" />
                  Earn 50 Mystical Points for each share!
                </p>
              </div>

              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="w-full mt-4 border-purple-600 text-white hover:bg-purple-800"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}