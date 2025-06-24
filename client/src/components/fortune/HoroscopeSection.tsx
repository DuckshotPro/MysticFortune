import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getZodiacDateRange, getStarRating, capitalizeFirstLetter } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { ZodiacSignType, Horoscope } from "@shared/schema";
import { AdBanner } from "@/components/monetization/AdBanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFire, 
  faLeaf, 
  faWind, 
  faWater, 
  faSun, 
  faSeedling,
  faBalanceScale,
  faDragon,
  faHorse,
  faMountain,
  faTintSlash,
  faFish,
  faStar
} from "@fortawesome/free-solid-svg-icons";

// Icons for zodiac signs
const zodiacIcons: Record<ZodiacSignType, any> = {
  aries: faFire,
  taurus: faLeaf,
  gemini: faWind,
  cancer: faWater,
  leo: faSun,
  virgo: faSeedling,
  libra: faBalanceScale,
  scorpio: faDragon,
  sagittarius: faHorse,
  capricorn: faMountain,
  aquarius: faTintSlash,
  pisces: faFish
};

const ZodiacButton = ({ sign, icon, isSelected, onClick }: { 
  sign: ZodiacSignType, 
  icon: any, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  return (
    <Button
      variant="ghost"
      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center m-1 transition-colors ${
        isSelected ? "bg-purple-900" : "hover:bg-purple-900/50"
      }`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="text-amber-500" />
    </Button>
  );
};

const StarRating = ({ rating, label }: { rating: number, label: string }) => {
  const stars = getStarRating(rating);
  
  return (
    <div className="bg-purple-950/40 p-2 rounded">
      <div className="text-amber-500 text-xs mb-1">{label}</div>
      <div className="flex justify-center">
        {[...Array(stars.filled)].map((_, i) => (
          <FontAwesomeIcon key={`filled-${i}`} icon={faStar} className="text-amber-500" />
        ))}
        {[...Array(stars.empty)].map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-white/30" />
        ))}
      </div>
    </div>
  );
};

export default function HoroscopeSection() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignType>("taurus");
  const { playSoundEffect, playFortuneMusic } = useSound();
  
  const { data: horoscope, isLoading } = useQuery<Horoscope>({
    queryKey: [`/api/horoscopes/${selectedSign}`]
  });
  
  const handleSignChange = (sign: ZodiacSignType) => {
    setSelectedSign(sign);
    playSoundEffect('cosmic-transition');
    playFortuneMusic('horoscope');
  };
  
  // Group zodiac signs into rows for better mobile layout
  const zodiacSignsRows: ZodiacSignType[][] = [
    ["aries", "taurus", "gemini", "cancer"],
    ["leo", "virgo", "libra", "scorpio"],
    ["sagittarius", "capricorn", "aquarius", "pisces"]
  ];
  
  return (
    <section id="daily-horoscope" className="py-16 px-4 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950">
      <div className="container mx-auto">
        <motion.h2 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-['Cinzel'] text-3xl md:text-4xl text-center mb-12 text-amber-500"
        >
          Daily Celestial Guidance
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex flex-col items-center mb-6 gap-2">
              {zodiacSignsRows.map((row, rowIndex) => (
                <div 
                  key={`row-${rowIndex}`} 
                  className="inline-flex bg-purple-950/60 rounded-full p-1 shadow-lg"
                >
                  {row.map((sign) => (
                    <ZodiacButton
                      key={sign}
                      sign={sign}
                      icon={zodiacIcons[sign]}
                      isSelected={selectedSign === sign}
                      onClick={() => handleSignChange(sign)}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            <Card className="bg-gray-900/80 border-purple-800">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="w-10 h-10 text-amber-500" />
                  </div>
                ) : horoscope ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['Cinzel'] text-xl text-amber-500">
                        {capitalizeFirstLetter(selectedSign)}
                      </h3>
                      <p className="text-sm text-white">{getZodiacDateRange(selectedSign)}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="mb-3">{(horoscope as Horoscope).content}</p>
                      <div className="flex space-x-2 text-xs text-white/70">
                        <span>Lucky Number: {(horoscope as Horoscope).luckyNumber}</span>
                        <span>•</span>
                        <span>Compatible Sign: {capitalizeFirstLetter((horoscope as Horoscope).compatibleSign)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                      <StarRating rating={(horoscope as Horoscope).loveRating} label="Love" />
                      <StarRating rating={(horoscope as Horoscope).careerRating} label="Career" />
                      <StarRating rating={(horoscope as Horoscope).healthRating} label="Health" />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p>Could not load horoscope information.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar Ad */}
          <div className="hidden md:block">
            <div className="sticky top-20">
              <AdBanner variant="sidebar" />
              
              <div className="mt-6 bg-purple-900/50 p-4 rounded-lg border border-purple-700/50">
                <h4 className="font-['Cinzel'] text-amber-500 text-lg mb-2">Premium Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 mr-2" />
                    <span>Extended monthly forecasts</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 mr-2" />
                    <span>Personal compatibility reports</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 mr-2" />
                    <span>Career & financial insights</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 hover:from-amber-400 hover:to-amber-500"
                  onClick={() => window.location.href = '/premium'}
                >
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
