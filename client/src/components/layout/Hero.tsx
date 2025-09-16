import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Zap, Heart, Compass } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHandSparkles, faMagic } from "@fortawesome/free-solid-svg-icons";

export default function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [showInteractivePrompt, setShowInteractivePrompt] = useState(false);

  const mysticalTexts = [
    "✨ Discover Your Destiny",
    "🔮 Unveil Hidden Truths", 
    "⭐ Embrace Your Future",
    "💫 Awaken Your Power"
  ];

  const quickPrompts = [
    { icon: Heart, text: "Will I find love?", color: "text-pink-400" },
    { icon: Zap, text: "What's my purpose?", color: "text-yellow-400" },
    { icon: Star, text: "What lies ahead?", color: "text-blue-400" },
    { icon: Compass, text: "Guide my path", color: "text-purple-400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % mysticalTexts.length);
    }, 3000);
    
    // Show interactive prompt after 5 seconds
    const promptTimer = setTimeout(() => {
      setShowInteractivePrompt(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(promptTimer);
    };
  }, []);

  const scrollToFortuneTeller = () => {
    const element = document.getElementById('fortune-teller');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating mystical elements */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [-20, -100],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`
            }}
          >
            {i % 4 === 0 && <Sparkles className="text-amber-400 w-4 h-4" />}
            {i % 4 === 1 && <Star className="text-purple-400 w-3 h-3" />}
            {i % 4 === 2 && <div className="w-2 h-2 bg-pink-400 rounded-full" />}
            {i % 4 === 3 && <div className="w-1 h-1 bg-blue-400 rounded-full" />}
          </motion.div>
        ))}

        {/* Pulsing cosmic rings */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-amber-500 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto relative z-10 text-center">
        {/* Main Crystal Ball Animation */}
        <motion.div
          className="relative inline-block mb-8"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 via-transparent to-amber-400 p-1">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FontAwesomeIcon icon={faGem} className="text-4xl text-amber-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1 
          key={currentText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="font-['Tangerine'] text-6xl md:text-8xl mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {mysticalTexts[currentText]}
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-['Cinzel'] text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white/90"
        >
          🌟 AI-Powered Fortune Telling • Personalized Insights • Mystical Guidance
        </motion.p>

        {/* Quick Interaction Prompts */}
        {showInteractivePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <p className="text-amber-400 font-['Cinzel'] mb-4 text-lg">What's calling to your spirit today?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToFortuneTeller}
                    className="bg-purple-900/60 hover:bg-purple-800/60 backdrop-blur-sm border border-purple-700 hover:border-amber-500 rounded-lg p-4 text-center transition-all group"
                  >
                    <Icon className={`mx-auto mb-2 w-6 h-6 ${prompt.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm text-white/80 group-hover:text-white">{prompt.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Enhanced CTA Button */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={2}
          className="space-y-4"
        >
          <Button
            onClick={scrollToFortuneTeller}
            size="lg"
            className="bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 hover:from-amber-600 hover:via-purple-700 hover:to-pink-600 text-white font-['Cinzel'] px-12 py-4 text-xl rounded-full shadow-2xl border-2 border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-amber-500/25"
          >
            <FontAwesomeIcon icon={faHandSparkles} className="mr-3" />
            Get My Free Reading
          </Button>
          
          <p className="text-white/60 text-sm">✨ No signup required • Instant results • AI-personalized</p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center"
        >
          <div>
            <div className="text-2xl font-bold text-amber-400">50K+</div>
            <div className="text-sm text-white/70">Readings Given</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">AI-Powered</div>
            <div className="text-sm text-white/70">Personalized Insights</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">24/7</div>
            <div className="text-sm text-white/70">Always Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
