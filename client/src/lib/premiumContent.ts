/**
 * Premium content generation system
 * Provides exclusive, detailed content for premium subscribers
 */

import { FortuneCategoryType, ZodiacSignType } from "@shared/schema";

// Premium fortune extensions with deeper insights
export const premiumFortuneExtensions = {
  love: [
    {
      deepInsight: "The Venus-Mars conjunction in your relationship sector suggests a powerful magnetic attraction entering your life. This cosmic influence brings not just romance, but a profound soul recognition that transcends ordinary partnership.",
      actionSteps: [
        "Practice heart-opening meditation to align with loving energy",
        "Release any lingering resentment from past relationships",
        "Trust your intuitive feelings about romantic connections",
        "Express appreciation for existing relationships"
      ],
      timeframe: "Peak influence occurs within the next 3-7 days",
      spiritualGuidance: "Your heart chakra is expanding to accommodate deeper love. Allow this natural process without forcing outcomes."
    },
    {
      deepInsight: "Emotional healing from your past is accelerating now. The universe is clearing old patterns to make space for the love your soul truly deserves. This cleansing process may bring temporary sensitivity but leads to lasting romantic fulfillment.",
      actionSteps: [
        "Journal about past relationship patterns you're ready to release",
        "Practice forgiveness meditation for yourself and others",
        "Create space for new love by decluttering your environment",
        "Engage in activities that bring you joy and raise your vibration"
      ],
      timeframe: "Healing intensifies over the next 2-3 weeks",
      spiritualGuidance: "Trust the healing process. Your soul is preparing for a love that honors your authentic self."
    }
  ],
  career: [
    {
      deepInsight: "Jupiter's influence on your professional sector indicates a major expansion period beginning. Your skills and talents are about to be recognized on a much larger scale, potentially leading to leadership opportunities or industry recognition.",
      actionSteps: [
        "Document your achievements and unique value proposition",
        "Network strategically with industry leaders",
        "Develop one key skill that sets you apart from competitors",
        "Prepare for increased responsibility and visibility"
      ],
      timeframe: "Expansion accelerates over the next 4-6 weeks",
      spiritualGuidance: "Your professional growth serves a higher purpose. Trust that success will come through authentic expression of your gifts."
    },
    {
      deepInsight: "A powerful transformation in your career sector suggests you're outgrowing your current professional identity. This evolution may feel uncomfortable but is necessary for aligning with your soul's true calling and highest potential.",
      actionSteps: [
        "Explore careers that align with your deepest values",
        "Invest in skills that excite rather than just advance you",
        "Consider how your work can contribute to positive change",
        "Take calculated risks toward more fulfilling work"
      ],
      timeframe: "Transformation unfolds over the next 2-4 months",
      spiritualGuidance: "Your soul is calling you toward work that serves both your growth and humanity's evolution."
    }
  ],
  general: [
    {
      deepInsight: "You're entering a powerful spiritual awakening phase where your psychic abilities and intuitive insights are dramatically heightening. This expansion of consciousness will influence every area of your life, bringing greater clarity and purpose.",
      actionSteps: [
        "Keep a dream journal to track spiritual messages",
        "Meditate daily to strengthen your connection to higher guidance",
        "Pay attention to synchronicities and repeated number sequences",
        "Trust your first instincts in all situations"
      ],
      timeframe: "Awakening intensifies over the next 6-8 weeks",
      spiritualGuidance: "You're remembering your true spiritual nature. Allow this remembering to guide your choices."
    },
    {
      deepInsight: "A major life cycle is completing, bringing closure to patterns and experiences that have served their purpose. This ending creates space for a completely new chapter that aligns with your evolved consciousness and highest potential.",
      actionSteps: [
        "Release what no longer serves your highest good",
        "Practice gratitude for lessons learned during this cycle",
        "Set clear intentions for the new phase beginning",
        "Trust the wisdom gained through recent challenges"
      ],
      timeframe: "Completion accelerates over the next 3-5 weeks",
      spiritualGuidance: "Endings are sacred doorways to new beginnings. Honor this transition with patience and self-compassion."
    }
  ]
};

// Premium horoscope with detailed planetary influences
export const premiumHoroscopeContent = {
  aries: [
    {
      planetaryInfluence: "Mars in your career sector amplifies your natural leadership abilities while Venus brings harmony to partnerships. The Sun-Jupiter aspect creates opportunities for recognition and advancement.",
      detailedForecast: "Your pioneering spirit attracts influential allies who recognize your potential. A project you initiate now has the potential to establish your reputation as an innovator in your field. Trust your instincts when making quick decisions.",
      chakraGuidance: "Focus on your solar plexus chakra to maintain confidence while balancing your assertiveness with compassion.",
      crystalRecommendation: "Carry carnelian for courage and citrine for manifestation energy.",
      luckyElements: { colors: ["red", "orange", "gold"], numbers: [1, 8, 9], direction: "east" }
    }
  ],
  taurus: [
    {
      planetaryInfluence: "Venus enhances your natural magnetism while Mercury brings profitable ideas. The Earth trine supports practical manifestation of your goals.",
      detailedForecast: "Your patience and persistence pay dividends now. A financial opportunity requires careful consideration but promises long-term stability. Focus on building rather than rushing.",
      chakraGuidance: "Strengthen your root chakra through grounding exercises and connection with nature.",
      crystalRecommendation: "Use rose quartz for love energy and green aventurine for prosperity.",
      luckyElements: { colors: ["green", "pink", "earth tones"], numbers: [2, 6, 7], direction: "north" }
    }
  ],
  gemini: [
    {
      planetaryInfluence: "Mercury heightens your communication gifts while the Air sign emphasis brings new learning opportunities. Social connections prove especially beneficial.",
      detailedForecast: "Your versatility opens multiple doors simultaneously. Information you share or receive becomes unexpectedly valuable. Written communication brings positive responses.",
      chakraGuidance: "Balance your throat chakra to enhance authentic expression and active listening.",
      crystalRecommendation: "Carry blue lace agate for clear communication and fluorite for mental clarity.",
      luckyElements: { colors: ["yellow", "blue", "silver"], numbers: [3, 5, 12], direction: "east" }
    }
  ],
  cancer: [
    {
      planetaryInfluence: "The Moon amplifies your intuitive abilities while family and home matters receive cosmic support. Emotional intelligence becomes your greatest asset.",
      detailedForecast: "Your nurturing nature attracts those seeking guidance and support. A family matter resolves positively. Trust your psychic impressions about people and situations.",
      chakraGuidance: "Open your heart chakra through self-care practices and compassionate action toward others.",
      crystalRecommendation: "Use moonstone for intuition and aquamarine for emotional healing.",
      luckyElements: { colors: ["silver", "white", "sea blue"], numbers: [2, 4, 7], direction: "west" }
    }
  ],
  leo: [
    {
      planetaryInfluence: "The Sun illuminates your creative sector while Jupiter expands opportunities for recognition. Your natural charisma draws beneficial attention.",
      detailedForecast: "Creative projects gain momentum and admiration. Your leadership inspires others to achieve their potential. Romance and artistic expression flourish under this influence.",
      chakraGuidance: "Activate your heart chakra through generous acts and creative self-expression.",
      crystalRecommendation: "Wear sunstone for confidence and tiger's eye for personal power.",
      luckyElements: { colors: ["gold", "orange", "royal purple"], numbers: [1, 5, 8], direction: "south" }
    }
  ],
  virgo: [
    {
      planetaryInfluence: "Mercury sharpens your analytical abilities while Earth signs support practical progress. Health and service themes are highlighted.",
      detailedForecast: "Your attention to detail reveals important insights others miss. A health improvement brings increased energy. Your helpful nature receives recognition and gratitude.",
      chakraGuidance: "Balance your solar plexus chakra to maintain confidence while serving others effectively.",
      crystalRecommendation: "Use amazonite for truth-seeking and moss agate for grounding energy.",
      luckyElements: { colors: ["navy blue", "forest green", "tan"], numbers: [6, 9, 15], direction: "southwest" }
    }
  ],
  libra: [
    {
      planetaryInfluence: "Venus enhances your diplomatic skills while air sign energy brings new partnerships. Justice and balance themes are prominent.",
      detailedForecast: "Your fairness and charm resolve conflicts gracefully. A partnership opportunity requires careful evaluation but shows promise. Aesthetic projects receive positive feedback.",
      chakraGuidance: "Harmonize your heart and throat chakras for authentic relationship communication.",
      crystalRecommendation: "Carry rose quartz for love and lepidolite for emotional balance.",
      luckyElements: { colors: ["pink", "light blue", "lavender"], numbers: [2, 6, 11], direction: "west" }
    }
  ],
  scorpio: [
    {
      planetaryInfluence: "Pluto intensifies your transformative power while Water signs support emotional depth. Hidden knowledge becomes accessible.",
      detailedForecast: "Your investigative nature uncovers valuable secrets or insights. A deep transformation brings renewed power and clarity. Trust your psychological intuition about others.",
      chakraGuidance: "Clear your sacral chakra to harness creative and sexual energy constructively.",
      crystalRecommendation: "Use obsidian for protection and garnet for passion and strength.",
      luckyElements: { colors: ["deep red", "black", "burgundy"], numbers: [4, 8, 13], direction: "north" }
    }
  ],
  sagittarius: [
    {
      planetaryInfluence: "Jupiter expands your horizons while Fire signs ignite adventure and learning. International or philosophical themes emerge.",
      detailedForecast: "Your optimism attracts opportunities for growth and travel. Higher education or teaching opportunities arise. Your philosophical insights inspire others' journeys.",
      chakraGuidance: "Activate your third eye chakra through meditation and philosophical study.",
      crystalRecommendation: "Carry turquoise for wisdom and aventurine for opportunity.",
      luckyElements: { colors: ["purple", "turquoise", "gold"], numbers: [3, 9, 21], direction: "southeast" }
    }
  ],
  capricorn: [
    {
      planetaryInfluence: "Saturn rewards your discipline with lasting achievement while Earth signs support material progress. Authority and respect increase.",
      detailedForecast: "Your persistent efforts gain recognition from important figures. A long-term goal reaches a significant milestone. Your leadership abilities earn respect and responsibility.",
      chakraGuidance: "Strengthen your root chakra for stability while opening your crown chakra to divine guidance.",
      crystalRecommendation: "Use hematite for grounding and clear quartz for clarity of purpose.",
      luckyElements: { colors: ["dark green", "brown", "black"], numbers: [8, 10, 26], direction: "south" }
    }
  ],
  aquarius: [
    {
      planetaryInfluence: "Uranus electrifies your innovative thinking while Air signs support networking and humanitarian causes. Technology and friendship themes are highlighted.",
      detailedForecast: "Your unique perspective leads to breakthrough solutions. Group activities and causes benefit from your involvement. Technology enhances your reach and influence.",
      chakraGuidance: "Balance your crown chakra with your heart chakra to blend wisdom with compassion.",
      crystalRecommendation: "Carry amethyst for spiritual insight and aquamarine for clear communication.",
      luckyElements: { colors: ["electric blue", "silver", "violet"], numbers: [4, 11, 22], direction: "east" }
    }
  ],
  pisces: [
    {
      planetaryInfluence: "Neptune enhances your psychic abilities while Water signs support emotional and spiritual flow. Artistic and healing themes are prominent.",
      detailedForecast: "Your compassionate nature attracts souls needing healing. Artistic projects channel divine inspiration. Dreams and meditation provide profound guidance.",
      chakraGuidance: "Open your crown and third eye chakras through spiritual practices and artistic expression.",
      crystalRecommendation: "Use labradorite for psychic protection and amazonite for emotional healing.",
      luckyElements: { colors: ["sea green", "lavender", "pearl"], numbers: [7, 12, 29], direction: "west" }
    }
  ]
};

// Premium tarot interpretations with deeper symbolism
export const premiumTarotInterpretations = {
  "The Fool": {
    shadowMeaning: "Fear of new beginnings or reckless behavior that ignores consequences",
    karmic: "Past life connections to spiritual seeking and breaking conventional boundaries",
    manifestation: "Use this energy to fearlessly pursue your soul's true calling",
    timing: "New moon energy - plant seeds for future growth"
  },
  "The Magician": {
    shadowMeaning: "Manipulation or misuse of personal power for selfish gain",
    karmic: "Mastery of spiritual laws and responsibility for conscious creation",
    manifestation: "Channel divine will through focused intention and aligned action",
    timing: "Waxing moon energy - build momentum toward goals"
  },
  "The High Priestess": {
    shadowMeaning: "Secrets, hidden agendas, or disconnection from intuitive wisdom",
    karmic: "Ancient priestess wisdom and the responsibility to serve divine feminine",
    manifestation: "Trust inner knowing and allow wisdom to emerge through stillness",
    timing: "Full moon energy - revelations and psychic insights peak"
  }
  // Additional cards would continue this pattern
};

// Get premium fortune extension
export function getPremiumFortuneExtension(category: FortuneCategoryType) {
  const extensions = premiumFortuneExtensions[category];
  const randomIndex = Math.floor(Math.random() * extensions.length);
  return extensions[randomIndex];
}

// Get premium horoscope content
export function getPremiumHoroscopeContent(sign: ZodiacSignType) {
  const content = premiumHoroscopeContent[sign];
  if (!content || content.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * content.length);
  return content[randomIndex];
}

// Get premium tarot interpretation
export function getPremiumTarotInterpretation(cardName: string) {
  return premiumTarotInterpretations[cardName as keyof typeof premiumTarotInterpretations] || null;
}