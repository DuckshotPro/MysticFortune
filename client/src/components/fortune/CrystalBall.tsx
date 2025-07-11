import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Users, Shuffle } from "lucide-react";
import { Fortune, FortuneCategoryType } from "@shared/schema";
import { FortuneModal } from "./FortuneModal";
import DramaticFortuneReveal from "./DramaticFortuneReveal";
import CharacterSelector from "./CharacterSelector";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/useSound";
import { getRandomCharacter } from "@/lib/fortuneTellerCharacters";
import { apiRequest } from "@/lib/queryClient";
import { Spinner } from "@/components/ui/spinner";
import { float, spin } from "@/lib/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faBriefcase, 
  faStar, 
  faHandSparkles, 
  faMagic 
} from "@fortawesome/free-solid-svg-icons";

type CategoryButtonProps = {
  category: FortuneCategoryType;
  label: string;
  icon: any;
  isSelected: boolean;
  onClick: () => void;
};

const CategoryButton = ({ category, label, icon, isSelected, onClick }: CategoryButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`flex flex-col items-center justify-center py-2 transition-transform hover:scale-105 ${
        isSelected 
          ? "bg-purple-900 border-amber-500 text-white" 
          : "bg-purple-950 border-purple-800 text-white/80 hover:bg-purple-900/80"
      }`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="mb-1" />
      <span className="block">{label}</span>
    </Button>
  );
};

export function CrystalBall() {
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategoryType>("love");
  const [showModal, setShowModal] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showDramaticReveal, setShowDramaticReveal] = useState(false);
  const { playSoundEffect, playFortuneMusic } = useSound();

  const saveFortuneMutation = useMutation({
    mutationFn: (fortune: Fortune) => {
      return apiRequest("POST", "/api/save-fortune", {
        userId: 1, // In a real app, this would be the actual user ID
        fortuneTitle: fortune.title,
        fortuneContent: fortune.content,
        category: fortune.category
      });
    }
  });

  const handleStartReading = () => {
    playSoundEffect('energy-pulse');
    playFortuneMusic('mystical-ambient');
    
    // Go directly to dramatic reveal with random character - one-click experience
    const randomCharacter = getRandomCharacter();
    setSelectedCharacter(randomCharacter.id);
    setShowDramaticReveal(true);
  };

  const handleCharacterSelect = (characterId: string | null) => {
    setSelectedCharacter(characterId);
  };

  const handleRandomCharacterSelect = () => {
    const randomCharacter = getRandomCharacter();
    setSelectedCharacter(randomCharacter.id);
  };

  const handleBeginDramaticReading = () => {
    playSoundEffect('energy-pulse');
    playFortuneMusic('mystical-ambient');
    setShowCharacterSelector(false);
    setShowDramaticReveal(true);
  };

  const handleFortuneRevealed = (fortune: Fortune) => {
    setCurrentFortune(fortune);
    playSoundEffect('mystical-reveal');
    setShowModal(true);
    setShowDramaticReveal(false);
    
    // Track fortune generation for achievements
    const userId = 1; // In a real app, this would be the actual user ID
    fetch(`/api/track-fortune/${userId}`, { method: 'POST' })
      .catch(error => console.error('Failed to track fortune:', error));
  };

  const handleSaveFortune = async () => {
    if (currentFortune) {
      await saveFortuneMutation.mutateAsync(currentFortune);
      
      // Track fortune saving for achievements
      const userId = 1; // In a real app, this would be the actual user ID
      fetch(`/api/track-fortune-saved/${userId}`, { method: 'POST' })
        .catch(error => console.error('Failed to track fortune saved:', error));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCharacter(null);
    setShowCharacterSelector(false);
    setShowDramaticReveal(false);
  };

  return (
    <section id="fortune-teller" className="py-16 px-4 bg-purple-950/50 relative overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.2)_2px,transparent_7px),radial-gradient(white,rgba(255,255,255,.15)_1px,transparent_5px),radial-gradient(white,rgba(255,255,255,.1)_2px,transparent_10px)] bg-[size:550px_550px,350px_350px,250px_250px] bg-[position:0_0,40px_60px,130px_270px] opacity-20"></div>

      <div className="container mx-auto relative z-10">
        <h2 className="font-['Cinzel'] text-3xl md:text-4xl text-center mb-12 text-amber-500">Crystal Ball Fortune Teller</h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Crystal Ball Visualization */}
          <div className="flex justify-center">
            <motion.div
              variants={float}
              initial="hidden"
              animate="visible"
              className="relative w-64 h-64 rounded-full border-4 border-purple-800 shadow-xl flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(63, 29, 99, 0.1) 40%, rgba(10, 9, 20, 0.2) 100%)"
              }}
            >
              <motion.div 
                className="absolute w-full h-full rounded-full opacity-20"
                variants={spin}
                style={{
                  backgroundImage: "radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 10px)",
                  backgroundSize: "250px 250px"
                }}
              />
              <div className="text-center">
                <p className="font-['Tangerine'] text-3xl text-amber-500 mb-2">
                  {showCharacterSelector || showDramaticReveal ? "Reading the stars..." : "Choose Your Fortune Teller"}
                </p>
                {showCharacterSelector || showDramaticReveal ? (
                  <Spinner className="text-amber-500" />
                ) : (
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <FontAwesomeIcon icon={faHandSparkles} className="text-amber-500 text-2xl" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Fortune Controls */}
          <Card className="bg-purple-950/60 border-purple-800">
            <CardContent className="p-6">
              <h3 className="font-['Cinzel'] text-xl mb-4 text-center">Choose Your Path</h3>

              <div className="mb-6">
                <label className="block font-['Cinzel'] text-sm mb-2 text-amber-500">Select Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <CategoryButton
                    category="love"
                    label="Love"
                    icon={faHeart}
                    isSelected={selectedCategory === "love"}
                    onClick={() => {
                      setSelectedCategory("love");
                      playSoundEffect('cosmic-transition');
                    }}
                  />
                  <CategoryButton
                    category="career"
                    label="Career"
                    icon={faBriefcase}
                    isSelected={selectedCategory === "career"}
                    onClick={() => {
                      setSelectedCategory("career");
                      playSoundEffect('cosmic-transition');
                    }}
                  />
                  <CategoryButton
                    category="general"
                    label="General"
                    icon={faStar}
                    isSelected={selectedCategory === "general"}
                    onClick={() => {
                      setSelectedCategory("general");
                      playSoundEffect('cosmic-transition');
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm italic text-white/80 mb-4">Focus on your question as you reveal your fortune...</p>
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-500/90 text-purple-950 py-6 rounded-full font-['Cinzel'] text-base font-bold transition-all transform hover:scale-105 flex items-center justify-center"
                  onClick={handleStartReading}
                  disabled={showCharacterSelector || showDramaticReveal}
                >
                  <FontAwesomeIcon icon={faMagic} className="mr-2" /> Begin Mystical Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Character Selection Modal */}
      <AnimatePresence>
        {showCharacterSelector && (
          <CharacterSelector
            selectedCategory={selectedCategory}
            onCharacterSelect={handleCharacterSelect}
            onRandomSelect={handleRandomCharacterSelect}
            onCancel={() => setShowCharacterSelector(false)}
            onConfirm={handleBeginDramaticReading}
            selectedCharacterId={selectedCharacter}
          />
        )}
      </AnimatePresence>

      {/* Dramatic Fortune Reveal */}
      <AnimatePresence>
        {showDramaticReveal && selectedCharacter && (
          <DramaticFortuneReveal
            characterId={selectedCharacter}
            category={selectedCategory}
            onFortuneRevealed={handleFortuneRevealed}
            onCancel={() => setShowDramaticReveal(false)}
          />
        )}
      </AnimatePresence>

      {/* Fortune Result Modal */}
      <AnimatePresence>
        {showModal && currentFortune && (
          <FortuneModal 
            fortune={currentFortune} 
            onClose={handleCloseModal} 
            onSave={handleSaveFortune}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default CrystalBall;