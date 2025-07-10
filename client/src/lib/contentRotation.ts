/**
 * Dynamic content rotation system for enhanced user engagement
 * Provides fresh content daily across all fortune telling features
 */

import { FortuneCategoryType, ZodiacSignType } from "@shared/schema";

// Daily fortune themes that rotate weekly
export const weeklyFortuneThemes = {
  monday: {
    theme: "New Beginnings",
    focus: "Fresh starts and new opportunities await",
    energy: "Initiating and pioneering"
  },
  tuesday: {
    theme: "Action & Courage", 
    focus: "Bold moves and decisive action bring results",
    energy: "Dynamic and assertive"
  },
  wednesday: {
    theme: "Communication & Wisdom",
    focus: "Important conversations and learning opportunities",
    energy: "Intellectual and expressive"
  },
  thursday: {
    theme: "Expansion & Growth",
    focus: "Broadening horizons and embracing abundance",
    energy: "Expansive and optimistic"
  },
  friday: {
    theme: "Love & Harmony",
    focus: "Relationships and creative expression flourish",
    energy: "Harmonious and attractive"
  },
  saturday: {
    theme: "Discipline & Structure",
    focus: "Building foundations and long-term planning",
    energy: "Grounded and methodical"
  },
  sunday: {
    theme: "Reflection & Spirituality",
    focus: "Inner wisdom and spiritual insights emerge",
    energy: "Contemplative and intuitive"
  }
};

// Enhanced fortune content pool with seasonal variations
export const seasonalFortuneContent = {
  spring: {
    love: [
      { title: "Blossoming Romance", content: "Like flowers blooming in spring, new love enters your life with natural timing and organic growth." },
      { title: "Renewal of Passion", content: "Existing relationships experience a renaissance of affection and deeper emotional connection." },
      { title: "Fresh Emotional Start", content: "Winter's emotional challenges give way to hopeful new beginnings in matters of the heart." }
    ],
    career: [
      { title: "Professional Growth Spurt", content: "Your career experiences rapid development like nature's spring awakening. Seize emerging opportunities." },
      { title: "Creative Innovation", content: "Fresh ideas bloom in your professional life, leading to recognition and advancement." },
      { title: "Network Expansion", content: "New professional connections form naturally, creating pathways for future success." }
    ],
    general: [
      { title: "Life Renewal", content: "A period of personal renaissance begins, bringing vitality and renewed purpose to your journey." },
      { title: "Energy Revival", content: "Your natural enthusiasm returns stronger than ever, motivating positive life changes." },
      { title: "New Chapter Opening", content: "The seeds you've planted through difficult times now begin sprouting into visible progress." }
    ]
  },
  summer: {
    love: [
      { title: "Passionate Heights", content: "Love reaches its full expression as confidence and warmth attract meaningful connections." },
      { title: "Joyful Celebrations", content: "Relationships are highlighted through social gatherings and shared adventures under summer's influence." },
      { title: "Emotional Abundance", content: "Your heart overflows with generosity, creating magnetic attraction to like-minded souls." }
    ],
    career: [
      { title: "Peak Performance", content: "Your professional efforts reach maximum impact and visibility during this high-energy period." },
      { title: "Leadership Spotlight", content: "Natural charisma positions you for leadership roles and increased responsibility." },
      { title: "Collaborative Success", content: "Team projects flourish under your positive influence and organizational skills." }
    ],
    general: [
      { title: "Vitality Peak", content: "Physical and mental energy reach optimal levels, supporting ambitious goals and activities." },
      { title: "Social Magnetism", content: "Your natural charm attracts supportive people and beneficial opportunities." },
      { title: "Confidence Surge", content: "Self-assurance grows steadily, enabling you to tackle challenges with optimism." }
    ]
  },
  autumn: {
    love: [
      { title: "Mature Understanding", content: "Relationships deepen through wisdom gained from experience and honest communication." },
      { title: "Harvest of Hearts", content: "Past romantic investments now yield stable, committed partnerships built on mutual respect." },
      { title: "Emotional Wisdom", content: "Greater clarity about your relationship needs leads to more fulfilling romantic choices." }
    ],
    career: [
      { title: "Professional Harvest", content: "Long-term career investments now pay dividends through promotions or recognition." },
      { title: "Skill Refinement", content: "Expertise reaches new levels through experience and continued learning." },
      { title: "Strategic Planning", content: "Autumn's reflective energy supports wise career decisions and future goal-setting." }
    ],
    general: [
      { title: "Wisdom Integration", content: "Life experiences coalesce into practical wisdom that guides better decision-making." },
      { title: "Gratitude Abundance", content: "Appreciation for your journey's progress brings contentment and attracts more blessings." },
      { title: "Inner Preparation", content: "Quiet reflection prepares you mentally and spiritually for upcoming transitions." }
    ]
  },
  winter: {
    love: [
      { title: "Deep Intimacy", content: "Relationships turn inward, fostering profound emotional connections and vulnerability." },
      { title: "Quiet Devotion", content: "Love expresses itself through consistent presence and thoughtful care during challenging times." },
      { title: "Soul Connections", content: "Winter's introspective energy attracts relationships based on authentic spiritual compatibility." }
    ],
    career: [
      { title: "Strategic Foundation", content: "This contemplative period supports planning and skill-building for future professional growth." },
      { title: "Expert Development", content: "Focused study and practice during quieter times enhance your professional expertise." },
      { title: "Inner Authority", content: "Developing confidence in your abilities prepares you for increased responsibilities ahead." }
    ],
    general: [
      { title: "Inner Strength", content: "Challenges develop resilience and reveal hidden reserves of personal power." },
      { title: "Spiritual Depth", content: "Introspective energy leads to profound spiritual insights and personal transformation." },
      { title: "Patient Wisdom", content: "Learning to trust life's timing brings peace and prepares you for future opportunities." }
    ]
  }
};

// Monthly horoscope themes with deeper astrological insights
export const monthlyHoroscopeThemes = {
  january: { theme: "New Year, New You", focus: "Setting intentions and building foundation" },
  february: { theme: "Love & Self-Worth", focus: "Relationships and personal value" },
  march: { theme: "Action & Initiative", focus: "Taking charge and starting projects" },
  april: { theme: "Growth & Expansion", focus: "Developing talents and opportunities" },
  may: { theme: "Stability & Beauty", focus: "Creating security and aesthetic pleasure" },
  june: { theme: "Communication & Learning", focus: "Expression and intellectual growth" },
  july: { theme: "Home & Emotions", focus: "Family, feelings, and inner security" },
  august: { theme: "Creativity & Recognition", focus: "Self-expression and achievement" },
  september: { theme: "Service & Refinement", focus: "Improvement and helping others" },
  october: { theme: "Balance & Partnership", focus: "Harmony and cooperation" },
  november: { theme: "Transformation & Depth", focus: "Deep change and regeneration" },
  december: { theme: "Wisdom & Adventure", focus: "Philosophy and expanding horizons" }
};

// Enhanced tarot spreads for different reading types
export const advancedTarotSpreads = {
  "relationship-clarity": {
    name: "Relationship Clarity Spread",
    positions: [
      { name: "Your Energy", description: "What you bring to relationships" },
      { name: "Their Energy", description: "What they bring to the connection" },
      { name: "The Bond", description: "The nature of your connection" },
      { name: "Challenges", description: "Obstacles to overcome together" },
      { name: "Potential", description: "Where this relationship can lead" }
    ]
  },
  "career-guidance": {
    name: "Career Path Spread",
    positions: [
      { name: "Current Position", description: "Your present professional status" },
      { name: "Hidden Talents", description: "Underutilized skills and abilities" },
      { name: "Opportunities", description: "Emerging professional possibilities" },
      { name: "Obstacles", description: "Challenges to address" },
      { name: "Next Steps", description: "Immediate actions to take" },
      { name: "Long-term Outcome", description: "Where this path leads" }
    ]
  },
  "spiritual-growth": {
    name: "Spiritual Development Spread",
    positions: [
      { name: "Soul Purpose", description: "Your spiritual mission" },
      { name: "Current Lesson", description: "What you're learning now" },
      { name: "Past Wisdom", description: "Knowledge to integrate" },
      { name: "Spiritual Gifts", description: "Your innate psychic abilities" },
      { name: "Growth Area", description: "Where to focus development" },
      { name: "Divine Guidance", description: "Message from your higher self" }
    ]
  },
  "life-transition": {
    name: "Life Transition Spread",
    positions: [
      { name: "What You're Leaving", description: "Aspects of life to release" },
      { name: "The Transition", description: "The change process itself" },
      { name: "What You're Entering", description: "New phase approaching" },
      { name: "Fears to Release", description: "Anxieties to let go" },
      { name: "Strengths to Use", description: "Resources for navigation" },
      { name: "Final Outcome", description: "Result of this transition" }
    ]
  }
};

// Get current season based on date
export function getCurrentSeason(): keyof typeof seasonalFortuneContent {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// Get current day theme
export function getDayTheme() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  return weeklyFortuneThemes[today as keyof typeof weeklyFortuneThemes];
}

// Get monthly theme
export function getMonthlyTheme() {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                  'july', 'august', 'september', 'october', 'november', 'december'];
  const currentMonth = months[new Date().getMonth()];
  return monthlyHoroscopeThemes[currentMonth as keyof typeof monthlyHoroscopeThemes];
}

// Content freshness tracking
const contentHistory = new Map<string, number[]>();

// Get seasonal fortune content with freshness tracking
export function getSeasonalFortune(category: FortuneCategoryType) {
  const season = getCurrentSeason();
  const fortunes = seasonalFortuneContent[season][category];

  // Track content usage to ensure variety
  const key = `${season}-${category}`;
  const usedIndices = contentHistory.get(key) || [];

  // If we've used all content, reset the tracking
  if (usedIndices.length >= fortunes.length) {
    contentHistory.set(key, []);
  }

  // Find unused content
  const availableIndices = fortunes
    .map((_, index) => index)
    .filter(index => !usedIndices.includes(index));

  const randomIndex = availableIndices.length > 0 
    ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
    : Math.floor(Math.random() * fortunes.length);

  // Track this usage
  const updatedHistory = contentHistory.get(key) || [];
  updatedHistory.push(randomIndex);
  contentHistory.set(key, updatedHistory);

  const selectedFortune = fortunes[randomIndex];

  // Add daily theme influence with time-based variations
  const dayTheme = getDayTheme();
  const hour = new Date().getHours();
  const timeVariant = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const enhancedContent = `${selectedFortune.content} This ${timeVariant}'s ${dayTheme.theme} energy supports ${dayTheme.focus.toLowerCase()}.`;

  return {
    ...selectedFortune,
    content: enhancedContent,
    freshness: `New ${timeVariant} insight`,
    timeGenerated: new Date().toLocaleTimeString()
  };
}

// Generate contextual horoscope content
export function getContextualHoroscope(sign: ZodiacSignType) {
  const monthlyTheme = getMonthlyTheme();
  const dayTheme = getDayTheme();

  // Base horoscope content with seasonal and daily influences
  const contextualContent = `${monthlyTheme.theme} energy influences your ${sign} nature today. ${dayTheme.focus} ${monthlyTheme.focus} becomes your focus.`;

  return {
    thematicContent: contextualContent,
    monthlyFocus: monthlyTheme.focus,
    dailyEnergy: dayTheme.energy
  };
}

// Weekly fortune preview system
export function getWeeklyPreview() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const themeKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return days.map((day, index) => {
    const theme = weeklyFortuneThemes[themeKeys[index] as keyof typeof weeklyFortuneThemes];
    return {
      day,
      theme: theme.theme,
      focus: theme.focus,
      energy: theme.energy
    };
  });
}