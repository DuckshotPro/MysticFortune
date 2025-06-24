import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { tarotCards } from "@/lib/data";
import { flipCard, fadeIn } from "@/lib/animations";
import { useSound } from "@/hooks/useSound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faRedoAlt, faBook, faStar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { PremiumFeature } from "@/components/monetization/PremiumFeature";

type CardReadingType = "three-card" | "single-card" | "celtic-cross";

type TarotCardProps = {
  position: string;
  description: string;
  card: {
    name: string;
    image: string;
    meaning: string;
  } | null;
};

const TarotCard = ({ position, description, card }: TarotCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-80 w-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={flipCard}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full bg-purple-950 border-2 border-amber-500 rounded-lg p-4 flex flex-col justify-between shadow-xl backface-hidden">
          <div className="text-center">
            <h3 className="font-['Cinzel'] text-lg text-amber-500 mb-1">{position}</h3>
            <p className="text-xs text-white/70">{description}</p>
          </div>
          
          <div className="flex justify-center items-center flex-grow">
            <div className="w-20 h-32 border border-amber-500 rounded-md flex items-center justify-center">
              <FontAwesomeIcon 
                icon={faQuestion} 
                className="text-4xl text-amber-500 opacity-50" 
              />
            </div>
          </div>
          
          <div className="text-center text-xs text-white/50">
            Hover to reveal
          </div>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full bg-purple-900 border-2 border-amber-500 rounded-lg p-4 flex flex-col justify-between shadow-xl backface-hidden rotate-y-180">
          <div className="text-center">
            <h3 className="font-['Cinzel'] text-lg text-amber-500 mb-1">{card?.name}</h3>
          </div>
          
          <div className="flex justify-center items-center flex-grow">
            <img 
              src={card?.image} 
              alt={card?.name} 
              className="h-40 rounded-md shadow-lg object-cover"
            />
          </div>
          
          <div className="text-center text-xs text-white">
            {card?.meaning}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function FortuneCards() {
  const [readingType, setReadingType] = useState<CardReadingType>("three-card");
  const [cards, setCards] = useState(generateRandomCards());

  function generateRandomCards() {
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  const positions = [
    { name: "Past", description: "What influences are fading" },
    { name: "Present", description: "Current energies" },
    { name: "Future", description: "Emerging potential" }
  ];

  const handleShuffle = () => {
    setCards(generateRandomCards());
  };

  return (
    <section id="fortune-cards" className="py-16 px-4 bg-purple-950">
      <div className="container mx-auto">
        <motion.h2 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-['Cinzel'] text-3xl md:text-4xl text-center mb-12 text-amber-500"
        >
          Mystic Card Reading
        </motion.h2>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-purple-950 rounded-lg p-2">
            <Button
              variant={readingType === "three-card" ? "default" : "ghost"}
              className={`px-4 py-2 rounded text-sm font-['Cinzel'] ${
                readingType === "three-card" ? "bg-purple-900" : ""
              }`}
              onClick={() => setReadingType("three-card")}
            >
              Three Card
            </Button>
            <Button
              variant={readingType === "single-card" ? "default" : "ghost"}
              className={`px-4 py-2 rounded text-sm font-['Cinzel'] ${
                readingType === "single-card" ? "bg-purple-900" : ""
              }`}
              onClick={() => setReadingType("single-card")}
            >
              Single Card
            </Button>
            <Button
              variant={readingType === "celtic-cross" ? "default" : "ghost"}
              className={`px-4 py-2 rounded text-sm font-['Cinzel'] ${
                readingType === "celtic-cross" ? "bg-purple-900" : ""
              }`}
              onClick={() => setReadingType("celtic-cross")}
            >
              Celtic Cross
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {positions.map((position, index) => (
            <motion.div
              key={position.name}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              <TarotCard
                position={position.name}
                description={position.description}
                card={cards[index]}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            className="bg-amber-500 text-purple-950 hover:bg-amber-500/90 px-8 py-6 rounded-full font-['Cinzel'] shadow-lg transition-all transform hover:scale-105"
            onClick={handleShuffle}
          >
            <FontAwesomeIcon icon={faRedoAlt} className="mr-2" /> Shuffle & Draw New Cards
          </Button>
        </div>

        {/* Premium Features Section */}
        <div className="mt-16 border-t border-purple-800 pt-12">
          <h3 className="font-['Cinzel'] text-2xl text-center mb-8 text-amber-500">
            Advanced Tarot Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <PremiumFeature
              title="Expert Card Analysis"
              description="Get detailed interpretations of your tarot spread from professional readers. Understand the nuanced meanings beyond basic readings."
              icon={<FontAwesomeIcon icon={faBook} />}
              isPremium={false}
            />
            
            <PremiumFeature
              title="Relationship Compatibility"
              description="Discover how your cards relate to your romantic relationships. Get insights on compatibility, challenges, and opportunities."
              icon={<FontAwesomeIcon icon={faStar} />}
              isPremium={false}
            />
            
            <PremiumFeature
              title="Year Ahead Forecast"
              description="Explore a comprehensive 12-month forecast with monthly predictions based on your unique energetic signature."
              icon={<FontAwesomeIcon icon={faChartLine} />}
              isPremium={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
