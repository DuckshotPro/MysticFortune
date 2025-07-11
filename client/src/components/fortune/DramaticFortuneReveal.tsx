
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Eye, Zap } from "lucide-react";
import { Fortune, FortuneCategoryType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FortuneTellerCharacter, generateCharacterPrompt, selectEmotionForFortune, getCharacterById, getRandomCharacter } from "@/lib/fortuneTellerCharacters";

interface DramaticFortuneRevealProps {
  characterId: string;
  category: FortuneCategoryType;
  onFortuneRevealed: (fortune: Fortune) => void;
  onCancel: () => void;
}

export default function DramaticFortuneReveal({ characterId, category, onFortuneRevealed, onCancel }: DramaticFortuneRevealProps) {
  const [phase, setPhase] = useState<'idle' | 'building' | 'channeling' | 'revealing' | 'complete'>('idle');
  const [character, setCharacter] = useState<FortuneTellerCharacter | null>(null);
  const [characterImage, setCharacterImage] = useState<string>('');
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [buildupText, setBuildupText] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  // Auto-start the fortune telling when component mounts
  useEffect(() => {
    if (phase === 'idle') {
      startFortuneTelling();
    }
  }, []);

  const buildupMessages = [
    "The cosmic energies are aligning...",
    "I sense powerful vibrations around you...",
    "The universe is whispering your secrets...",
    "Ancient forces are converging...",
    "Your destiny is becoming clear...",
    "The mystical veil is lifting...",
    "I can see your path emerging..."
  ];

  const startFortuneTelling = async () => {
    setPhase('building');
    
    // Select character
    const selectedChar = getCharacterById(characterId);
    if (!selectedChar) return;
    
    setCharacter(selectedChar);
    
    // Generate initial character image (neutral expression)
    await generateCharacterImage(selectedChar, 'neutral');
    
    // Dramatic buildup sequence
    let messageIndex = 0;
    const buildupInterval = setInterval(() => {
      if (messageIndex < buildupMessages.length) {
        setBuildupText(buildupMessages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(buildupInterval);
        setPhase('channeling');
        setTimeout(() => channelFortune(), 2000);
      }
    }, 1500);
  };

  const generateCharacterImage = async (char: FortuneTellerCharacter, emotion: keyof FortuneTellerCharacter['emotionVariants']) => {
    setIsGeneratingImage(true);
    try {
      const prompt = generateCharacterPrompt(char, emotion);
      
      // Generate session ID if not available for cost optimization
      const sessionId = localStorage.getItem('mystic-session-id') || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mystic-session-id', sessionId);
      
      const response = await fetch('/api/ai/character-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          characterId: char.id, 
          emotion,
          sessionId,
          userId: null // Will be set when user authentication is added
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCharacterImage(data.imageUrl);
        
        // Show cost optimization info if image was cached
        if (data.cached && data.costSaved > 0) {
          console.log(`💰 Cost optimization: Reused cached image (saved $${data.costSaved.toFixed(3)})`);
        }
      }
    } catch (error) {
      console.error('Error generating character image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const channelFortune = async () => {
    if (!character) return;
    
    setBuildupText(`${character.name} is channeling your fortune...`);
    
    try {
      // Generate the fortune
      const response = await fetch(`/api/fortunes/${category}`);
      const fortuneData = await response.json();
      
      if (fortuneData) {
        setFortune(fortuneData);
        
        // Determine character emotion based on fortune content
        const emotion = selectEmotionForFortune(fortuneData.content, category);
        
        // Generate character image with appropriate emotion
        await generateCharacterImage(character, emotion);
        
        setPhase('revealing');
        
        // Final dramatic pause before reveal
        setTimeout(() => {
          setPhase('complete');
          onFortuneRevealed(fortuneData);
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "The cosmic connection was interrupted",
        description: "Please try again to receive your fortune.",
        variant: "destructive",
      });
      setPhase('idle');
    }
  };

  const reset = () => {
    setPhase('idle');
    setCharacter(null);
    setCharacterImage('');
    setFortune(null);
    setBuildupText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-24 h-24 mx-auto text-purple-400 mb-4" />
            </motion.div>
            
            <h2 className="text-4xl font-['Cinzel'] text-amber-400 mb-6">
              Ready to Reveal Your Destiny?
            </h2>
            
            <p className="text-xl text-purple-300 mb-8">
              A mystical fortune teller will channel the cosmic energies to reveal your {category} fortune
            </p>
            
            <Button
              onClick={startFortuneTelling}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Eye className="mr-3 h-6 w-6" />
              Begin the Mystical Reading
            </Button>
          </motion.div>
        )}

        {(phase === 'building' || phase === 'channeling' || phase === 'revealing') && (
          <motion.div
            key="building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Character Image */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(168, 85, 247, 0.4)",
                          "0 0 40px rgba(168, 85, 247, 0.8)",
                          "0 0 20px rgba(168, 85, 247, 0.4)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="rounded-lg overflow-hidden"
                    >
                      {characterImage ? (
                        <motion.img
                          key={characterImage}
                          src={characterImage}
                          alt={character?.name}
                          className="w-full h-96 object-cover rounded-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      ) : (
                        <div className="w-full h-96 bg-purple-900/50 rounded-lg flex items-center justify-center">
                          {isGeneratingImage ? (
                            <div className="text-center space-y-4">
                              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto" />
                              <p className="text-purple-300">Manifesting your fortune teller...</p>
                            </div>
                          ) : (
                            <Sparkles className="w-24 h-24 text-purple-400 animate-pulse" />
                          )}
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Mystical effects overlay */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-lg pointer-events-none"
                    />
                  </div>

                  {/* Buildup Text */}
                  <div className="space-y-6 text-center lg:text-left">
                    {character && (
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-['Cinzel'] text-amber-400"
                      >
                        {character.name}
                      </motion.h3>
                    )}
                    
                    <motion.div
                      key={buildupText}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-xl text-purple-300 italic">
                        "{buildupText}"
                      </p>
                      
                      {phase === 'revealing' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="flex items-center justify-center lg:justify-start space-x-2"
                        >
                          <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
                          <span className="text-amber-400 font-semibold">
                            Your fortune is crystallizing...
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Animated loading elements */}
                    <div className="flex justify-center lg:justify-start space-x-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                          className="w-3 h-3 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && fortune && character && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <h2 className="text-4xl font-['Cinzel'] text-amber-400 mb-4">
                Your Fortune Has Been Revealed!
              </h2>
              <p className="text-lg text-purple-300">
                {character.name} has channeled the cosmic energies for you
              </p>
            </motion.div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={reset}
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:text-purple-100"
              >
                Consult Another Oracle
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
