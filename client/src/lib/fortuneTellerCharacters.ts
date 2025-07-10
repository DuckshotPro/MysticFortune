
/**
 * Fortune Teller Character System
 * Generates diverse AI characters with dynamic emotions and reactions
 */

export interface FortuneTellerCharacter {
  id: string;
  name: string;
  personality: string;
  style: string;
  basePrompt: string;
  emotionVariants: {
    neutral: string;
    excited: string;
    mysterious: string;
    concerned: string;
    wise: string;
  };
}

// Pre-defined character archetypes for consistent personalities
export const characterArchetypes: FortuneTellerCharacter[] = [
  {
    id: "mystical-oracle",
    name: "Seraphina the Oracle",
    personality: "Ancient wisdom, ethereal presence",
    style: "Flowing robes, glowing eyes, celestial symbols",
    basePrompt: "A mystical oracle woman with flowing dark hair, glowing ethereal eyes, wearing elaborate purple and gold robes with celestial symbols, ornate jewelry, surrounded by cosmic energy and floating mystical symbols",
    emotionVariants: {
      neutral: "serene expression, eyes closed in meditation, peaceful aura",
      excited: "eyes wide with cosmic energy, enthusiastic smile, hands gesturing dramatically",
      mysterious: "half-smile, one eye glowing brighter, finger to lips, shrouded in mist",
      concerned: "furrowed brow, caring expression, protective gesture, warm lighting",
      wise: "knowing smile, ancient eyes, hands forming mystical signs, golden aura"
    }
  },
  {
    id: "gypsy-fortune-teller",
    name: "Esmeralda the Mystic",
    personality: "Passionate, intuitive, dramatic",
    style: "Colorful scarves, crystal jewelry, expressive gestures",
    basePrompt: "A passionate gypsy fortune teller with flowing curly hair, expressive dark eyes, wearing colorful layered clothing, crystal jewelry, ornate earrings, surrounded by tarot cards and crystal balls",
    emotionVariants: {
      neutral: "confident pose, slight smile, hands on crystal ball",
      excited: "animated expression, hands in the air, jewelry sparkling, vibrant energy",
      mysterious: "intense gaze, dramatic shadows, cards floating around her",
      concerned: "empathetic expression, reaching out comfortingly, soft lighting",
      wise: "thoughtful pose, finger on temple, surrounded by ancient symbols"
    }
  },
  {
    id: "celtic-druid",
    name: "Morgana the Wise",
    personality: "Nature-connected, ancient knowledge",
    style: "Natural fabrics, celtic knots, forest elements",
    basePrompt: "A Celtic druid fortune teller with braided red hair, piercing green eyes, wearing earth-toned robes with celtic knotwork, natural jewelry, surrounded by forest elements and glowing runes",
    emotionVariants: {
      neutral: "calm expression, hands on wooden staff, nature backdrop",
      excited: "bright smile, runes glowing around her, wind in hair",
      mysterious: "hooded, glowing eyes, mist swirling, ancient trees",
      concerned: "gentle frown, protective stance, healing light in hands",
      wise: "serene smile, eyes reflecting ancient knowledge, golden light"
    }
  },
  {
    id: "modern-mystic",
    name: "Luna the Contemporary Seer",
    personality: "Tech-savvy, modern spirituality",
    style: "Modern witch aesthetic, neon accents, tech elements",
    basePrompt: "A modern mystic fortune teller with sleek hair, bright eyes, wearing contemporary witch attire with neon purple accents, modern jewelry, surrounded by holographic tarot cards and digital mystical elements",
    emotionVariants: {
      neutral: "cool confidence, tech gadgets glowing, modern pose",
      excited: "energetic smile, holograms dancing, neon lighting",
      mysterious: "smirking, digital effects swirling, cyberpunk atmosphere",
      concerned: "caring expression, soft neon glow, comforting gesture",
      wise: "knowing look, data streams in background, balanced energy"
    }
  },
  {
    id: "cosmic-priestess",
    name: "Astara the Star Reader",
    personality: "Cosmic consciousness, stellar wisdom",
    style: "Starry robes, galaxy patterns, cosmic jewelry",
    basePrompt: "A cosmic priestess fortune teller with silver-blue hair, star-filled eyes, wearing robes patterned with galaxies and constellations, cosmic jewelry, surrounded by floating planets and starlight",
    emotionVariants: {
      neutral: "peaceful expression, hands forming constellation shapes, starry aura",
      excited: "radiant smile, stars swirling around, cosmic energy bursting",
      mysterious: "enigmatic gaze, nebula clouds, distant planets glowing",
      concerned: "compassionate look, gentle starlight, protective constellation",
      wise: "ancient smile, galaxy backdrop, cosmic symbols rotating"
    }
  }
];

// Generate emotion-specific AI prompts
export function generateCharacterPrompt(character: FortuneTellerCharacter, emotion: keyof FortuneTellerCharacter['emotionVariants']): string {
  const emotionDetails = character.emotionVariants[emotion];
  return `${character.basePrompt}, ${emotionDetails}, high quality digital art, mystical lighting, ornate details, cinematic composition`;
}

// Select emotion based on fortune content
export function selectEmotionForFortune(fortuneContent: string, category: string): keyof FortuneTellerCharacter['emotionVariants'] {
  const lowerContent = fortuneContent.toLowerCase();
  
  // Analyze fortune content for emotional context
  if (lowerContent.includes('warning') || lowerContent.includes('careful') || lowerContent.includes('challenge')) {
    return 'concerned';
  }
  
  if (lowerContent.includes('exciting') || lowerContent.includes('amazing') || lowerContent.includes('wonderful')) {
    return 'excited';
  }
  
  if (lowerContent.includes('mystery') || lowerContent.includes('hidden') || lowerContent.includes('secret')) {
    return 'mysterious';
  }
  
  if (lowerContent.includes('wisdom') || lowerContent.includes('understand') || lowerContent.includes('learn')) {
    return 'wise';
  }
  
  return 'neutral';
}

// Random character selection
export function getRandomCharacter(): FortuneTellerCharacter {
  return characterArchetypes[Math.floor(Math.random() * characterArchetypes.length)];
}

// Get character by ID
export function getCharacterById(id: string): FortuneTellerCharacter | undefined {
  return characterArchetypes.find(char => char.id === id);
}
