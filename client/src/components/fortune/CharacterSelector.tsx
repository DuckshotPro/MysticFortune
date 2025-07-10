
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Heart } from "lucide-react";
import { characterArchetypes, FortuneTellerCharacter } from "@/lib/fortuneTellerCharacters";

interface CharacterSelectorProps {
  selectedCharacter: string | null;
  onCharacterSelect: (characterId: string | null) => void;
  onRandomSelect: () => void;
}

export default function CharacterSelector({ selectedCharacter, onCharacterSelect, onRandomSelect }: CharacterSelectorProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (characterId: string) => {
    setFavorites(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-['Cinzel'] text-amber-400">
          Choose Your Mystical Guide
        </h3>
        <p className="text-purple-300">
          Select a fortune teller to channel your cosmic destiny, or let the universe decide
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onRandomSelect}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:text-purple-100"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Surprise Me
          </Button>
          
          {selectedCharacter && (
            <Button
              onClick={() => onCharacterSelect(null)}
              variant="ghost"
              className="text-purple-400 hover:text-purple-300"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characterArchetypes.map((character) => (
          <motion.div
            key={character.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedCharacter === character.id
                  ? 'bg-gradient-to-br from-purple-800/60 to-pink-800/60 border-amber-500 shadow-lg shadow-amber-500/25'
                  : 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 hover:border-purple-400/50'
              }`}
              onClick={() => onCharacterSelect(character.id)}
            >
              <CardContent className="p-6 space-y-4">
                {/* Character Avatar Placeholder */}
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-purple-700/50 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-2xl">🔮</span>
                      </div>
                      <p className="text-sm text-purple-300">
                        Preview image will generate during reading
                      </p>
                    </div>
                  </div>
                  
                  {/* Favorite Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(character.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(character.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-purple-400'
                      }`}
                    />
                  </Button>
                  
                  {selectedCharacter === character.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-amber-500/20 rounded-lg flex items-center justify-center"
                    >
                      <Badge className="bg-amber-500 text-purple-900 font-semibold">
                        Selected
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Character Info */}
                <div className="space-y-2">
                  <h4 className="font-['Cinzel'] text-lg text-amber-400">
                    {character.name}
                  </h4>
                  <p className="text-sm text-purple-300">
                    {character.personality}
                  </p>
                  <p className="text-xs text-purple-400">
                    {character.style}
                  </p>
                </div>

                {/* Selection Indicator */}
                {selectedCharacter === character.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                      Your Chosen Oracle
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-purple-400">
            💖 You have {favorites.length} favorite fortune teller{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
