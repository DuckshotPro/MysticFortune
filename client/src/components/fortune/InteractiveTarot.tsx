import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMoon, faSun, faHeart, faCoins, faCrown, faWandMagicSparkles, faBolt, faGem } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// Import ethereal character images using the @assets alias for proper bundling
import etherealFigure1 from "@assets/generated_images/Ethereal_fortune_teller_figure_dd1645ae.png";
import etherealFigure2 from "@assets/generated_images/Mystical_tarot_reader_portrait_1cd6954d.png";
import etherealFigure3 from "@assets/generated_images/Crystal_ball_fortune_reader_b0c2a4eb.png";
import etherealFigure4 from "@assets/generated_images/Horoscope_mystic_guide_8fb8eb98.png";

interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversedMeaning: string;
  icon: any;
  color: string;
  backImage?: string;
}

const tarotDeck: TarotCard[] = [
  { id: 1, name: "The Fool", meaning: "New beginnings, spontaneity, innocence", reversedMeaning: "Recklessness, risk-taking", icon: faStar, color: "from-yellow-400 to-amber-500", backImage: etherealFigure1 },
  { id: 2, name: "The Magician", meaning: "Manifestation, resourcefulness, power", reversedMeaning: "Manipulation, poor planning", icon: faWandMagicSparkles, color: "from-purple-400 to-indigo-500", backImage: etherealFigure2 },
  { id: 3, name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine", reversedMeaning: "Secrets, disconnection", icon: faMoon, color: "from-blue-400 to-purple-500", backImage: etherealFigure3 },
  { id: 4, name: "The Empress", meaning: "Femininity, beauty, nature, abundance", reversedMeaning: "Creative block, dependence", icon: faCrown, color: "from-green-400 to-emerald-500", backImage: etherealFigure4 },
  { id: 5, name: "The Emperor", meaning: "Authority, structure, control, father figure", reversedMeaning: "Tyranny, rigidity", icon: faCrown, color: "from-red-400 to-orange-500", backImage: etherealFigure1 },
  { id: 6, name: "The Lovers", meaning: "Love, harmony, relationships, values", reversedMeaning: "Disharmony, imbalance", icon: faHeart, color: "from-pink-400 to-rose-500", backImage: etherealFigure2 },
  { id: 7, name: "The Chariot", meaning: "Control, willpower, success, determination", reversedMeaning: "Lack of control, aggression", icon: faBolt, color: "from-sky-400 to-blue-500", backImage: etherealFigure3 },
  { id: 8, name: "Strength", meaning: "Inner strength, courage, patience, control", reversedMeaning: "Weakness, self-doubt", icon: faGem, color: "from-amber-400 to-yellow-500", backImage: etherealFigure4 },
  { id: 9, name: "The Hermit", meaning: "Soul searching, introspection, inner guidance", reversedMeaning: "Isolation, loneliness", icon: faStar, color: "from-indigo-400 to-purple-500", backImage: etherealFigure1 },
  { id: 10, name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny", reversedMeaning: "Bad luck, lack of control", icon: faStar, color: "from-teal-400 to-cyan-500", backImage: etherealFigure2 }
];

export default function InteractiveTarot() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [spreadType, setSpreadType] = useState<"single" | "three" | "celtic">("three");
  const { toast } = useToast();

  const shuffleDeck = () => {
    setIsShuffling(true);
    setSelectedCards([]);
    setRevealedCards([]);
    
    setTimeout(() => {
      const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
      const numCards = spreadType === "single" ? 1 : spreadType === "three" ? 3 : 5;
      setSelectedCards(shuffled.slice(0, numCards).map(card => card.id));
      setIsShuffling(false);
      
      toast({
        title: "Cards Shuffled",
        description: "Your mystical reading is ready. Click cards to reveal your destiny.",
      });
    }, 2000);
  };

  const revealCard = (cardId: number) => {
    if (!revealedCards.includes(cardId)) {
      setRevealedCards([...revealedCards, cardId]);
    }
  };

  const getPositionName = (index: number) => {
    if (spreadType === "three") {
      return ["Past", "Present", "Future"][index];
    } else if (spreadType === "celtic") {
      return ["Present", "Challenge", "Past", "Future", "Outcome"][index];
    }
    return "Your Card";
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-indigo-950/50 to-purple-950/50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-['Cinzel'] text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
            Interactive Tarot Reading
          </h2>
          <p className="text-purple-200 text-lg">Choose your spread and discover your destiny through the cards</p>
        </motion.div>

        {/* Spread Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setSpreadType("single")}
            className={`${spreadType === "single" ? "bg-amber-500" : "bg-purple-700"} hover:bg-amber-600`}
          >
            Single Card
          </Button>
          <Button
            onClick={() => setSpreadType("three")}
            className={`${spreadType === "three" ? "bg-amber-500" : "bg-purple-700"} hover:bg-amber-600`}
          >
            Three Card Spread
          </Button>
          <Button
            onClick={() => setSpreadType("celtic")}
            className={`${spreadType === "celtic" ? "bg-amber-500" : "bg-purple-700"} hover:bg-amber-600`}
          >
            Celtic Cross
          </Button>
        </div>

        {/* Shuffle Button */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={shuffleDeck}
            disabled={isShuffling}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold px-8 py-6 text-lg shadow-2xl transform hover:scale-105 transition-all"
          >
            {isShuffling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FontAwesomeIcon icon={faStar} className="mr-2" />
              </motion.div>
            ) : (
              <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
            )}
            {isShuffling ? "Shuffling..." : "Shuffle & Draw Cards"}
          </Button>
        </div>

        {/* Card Display Area */}
        <AnimatePresence>
          {selectedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`grid ${
                spreadType === "single" ? "grid-cols-1 max-w-sm" : 
                spreadType === "three" ? "grid-cols-1 md:grid-cols-3 max-w-4xl" : 
                "grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl"
              } gap-6 mx-auto`}
            >
              {selectedCards.map((cardId, index) => {
                const card = tarotDeck.find(c => c.id === cardId)!;
                const isRevealed = revealedCards.includes(cardId);
                
                return (
                  <motion.div
                    key={cardId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="text-center mb-2">
                      <span className="text-amber-400 font-['Cinzel'] text-sm">
                        {getPositionName(index)}
                      </span>
                    </div>
                    
                    <motion.div
                      className="relative h-80 cursor-pointer preserve-3d"
                      onClick={() => revealCard(cardId)}
                      animate={{ rotateY: isRevealed ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Card Back */}
                      <div className="absolute inset-0 backface-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-xl shadow-2xl border-2 border-amber-500/50 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="relative z-10 text-center p-4">
                            <FontAwesomeIcon 
                              icon={faMoon} 
                              className="text-6xl text-amber-500 mb-4 animate-pulse"
                            />
                            <p className="text-amber-400 font-['Cinzel'] text-sm">
                              Click to Reveal
                            </p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                        </div>
                      </div>
                      
                      {/* Card Front */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <div 
                          className={`h-full w-full bg-gradient-to-br ${card.color} rounded-xl shadow-2xl border-2 border-amber-500 overflow-hidden relative`}
                          style={card.backImage ? {
                            backgroundImage: `url(${card.backImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          } : {}}
                        >
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                          <div className="relative z-10 h-full flex flex-col justify-between p-4">
                            <div className="text-center">
                              <h3 className="font-['Cinzel'] text-xl text-white font-bold mb-2 drop-shadow-lg">
                                {card.name}
                              </h3>
                            </div>
                            
                            <div className="flex justify-center">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                                <FontAwesomeIcon 
                                  icon={card.icon}
                                  className="text-5xl text-white drop-shadow-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                              <p className="text-white text-sm text-center leading-relaxed">
                                {card.meaning}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {selectedCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-8 border border-amber-500/30">
                <FontAwesomeIcon icon={faStar} className="text-4xl text-amber-500 mb-4" />
                <h3 className="font-['Cinzel'] text-2xl text-amber-400 mb-4">
                  Ready for Your Reading?
                </h3>
                <p className="text-purple-200 mb-6">
                  Select your preferred spread type above, then click "Shuffle & Draw Cards" to begin your mystical journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Single Card</h4>
                    <p className="text-purple-300 text-sm">Quick insight into your current situation</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Three Card Spread</h4>
                    <p className="text-purple-300 text-sm">Past, Present, and Future revealed</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Celtic Cross</h4>
                    <p className="text-purple-300 text-sm">Comprehensive 5-card reading</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}