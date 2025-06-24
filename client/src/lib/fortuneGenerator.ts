/**
 * Advanced fortune content generation system
 * Provides dynamic, varied content for enhanced user engagement
 */

import { FortuneCategoryType } from "@shared/schema";

// Expanded fortune templates for dynamic generation
export const fortuneTemplates = {
  love: [
    {
      title: "Heart's Calling",
      content: "Your heart is ready to embrace deeper connections. A meaningful encounter awaits in an unexpected setting."
    },
    {
      title: "Romantic Renaissance", 
      content: "Past emotional wounds are healing, creating space for authentic love to flourish in your life."
    },
    {
      title: "Soul Recognition",
      content: "Someone significant will enter your life who truly understands your deepest aspirations and dreams."
    },
    {
      title: "Love's Transformation",
      content: "Your relationship dynamics are evolving. Open communication will unlock new levels of intimacy and trust."
    },
    {
      title: "Passionate Awakening",
      content: "A creative or spiritual pursuit will spark a romantic connection with someone who shares your vision."
    },
    {
      title: "Emotional Liberation",
      content: "Breaking free from limiting beliefs about love will attract the partnership your soul has been seeking."
    },
    {
      title: "Divine Timing",
      content: "The universe is aligning circumstances for a destined meeting. Trust in perfect timing and remain open."
    },
    {
      title: "Heart Healing",
      content: "Self-love practices will magnetize a partner who mirrors your newfound respect for yourself."
    }
  ],
  career: [
    {
      title: "Professional Elevation",
      content: "Your expertise will be recognized by industry leaders, opening doors to advancement you hadn't considered."
    },
    {
      title: "Creative Innovation",
      content: "A breakthrough idea will position you as a thought leader in your field. Document your insights carefully."
    },
    {
      title: "Network Amplification",
      content: "A chance conversation will connect you with a mentor who accelerates your professional growth exponentially."
    },
    {
      title: "Financial Abundance",
      content: "Multiple income streams will develop as you align your work with your authentic passions and talents."
    },
    {
      title: "Leadership Emergence",
      content: "Your natural ability to inspire others will be called upon for a significant project or initiative."
    },
    {
      title: "Skill Mastery",
      content: "Time invested in learning complementary skills will unexpectedly become your greatest professional asset."
    },
    {
      title: "Entrepreneurial Spirit",
      content: "A side project has potential to become your primary income source with dedicated focus and patience."
    },
    {
      title: "Recognition Ripple",
      content: "Consistent excellence in small tasks will create a reputation that leads to extraordinary opportunities."
    }
  ],
  general: [
    {
      title: "Intuitive Awakening",
      content: "Your psychic abilities are strengthening. Pay attention to first impressions and gut feelings."
    },
    {
      title: "Synchronicity Storm",
      content: "Meaningful coincidences will guide you toward important life decisions. Notice repeating patterns and symbols."
    },
    {
      title: "Wellness Revolution",
      content: "Small daily health improvements will compound into remarkable vitality and mental clarity."
    },
    {
      title: "Family Harmony",
      content: "Understanding and forgiveness will heal long-standing family tensions through unexpected conversations."
    },
    {
      title: "Spiritual Expansion",
      content: "A profound experience will shift your perspective and reveal your deeper life purpose."
    },
    {
      title: "Creative Expression",
      content: "Your unique talents are meant to inspire others. Don't let perfectionism block your creative gifts."
    },
    {
      title: "Travel Destiny",
      content: "A journey will introduce you to people and experiences that fundamentally change your worldview."
    },
    {
      title: "Abundance Flow",
      content: "Shifting from scarcity to gratitude thinking will manifest opportunities you never imagined possible."
    },
    {
      title: "Wisdom Integration",
      content: "Past challenges will reveal their purpose in preparing you for an important upcoming phase."
    },
    {
      title: "Inner Peace",
      content: "Finding stillness within chaos will become your superpower for navigating life's complexities."
    }
  ]
};

// Dynamic fortune modifiers for variety
export const fortuneModifiers = {
  timeframes: [
    "within the next few days",
    "before the month ends", 
    "in the coming weeks",
    "during this lunar cycle",
    "as the season changes",
    "when you least expect it"
  ],
  intensifiers: [
    "profound",
    "remarkable", 
    "life-changing",
    "unexpected",
    "transformative",
    "destined"
  ],
  actions: [
    "Trust your instincts and",
    "Pay attention to signs while you",
    "Remain open as you",
    "Follow your heart and",
    "Listen to your inner wisdom and",
    "Stay present while you"
  ]
};

// Enhanced horoscope content with more detail
export const expandedHoroscopeContent = {
  aries: [
    {
      content: "Mars energizes your personal magnetism today, Aries. Leadership opportunities emerge in unexpected places. Your pioneering spirit inspires others to take bold action.",
      focus: "Take initiative in collaborative projects and trust your instincts in competitive situations."
    },
    {
      content: "Your natural courage is highlighted today, Aries. A challenge that seemed insurmountable will reveal a clear path forward. Dynamic energy supports all endeavors.",
      focus: "Channel your enthusiasm into physical activities and creative pursuits that showcase your originality."
    },
    {
      content: "Passionate energy surrounds you today, Aries. Your directness and honesty open doors that diplomacy cannot. Innovation and action are strongly favored.",
      focus: "Start new projects and make important decisions that require confidence and determination."
    }
  ],
  taurus: [
    {
      content: "Venus blesses your practical endeavors today, Taurus. Steady progress in financial matters brings lasting security. Your patience creates valuable opportunities.",
      focus: "Focus on building solid foundations and nurturing existing relationships with consistency and care."
    },
    {
      content: "Earth energy supports your material goals today, Taurus. Luxury and comfort are within reach through persistent effort. Sensual pleasures enhance well-being.",
      focus: "Invest in quality over quantity and trust your natural ability to create beauty and abundance."
    },
    {
      content: "Your reliability becomes a cornerstone for others today, Taurus. Practical solutions emerge through methodical thinking. Nature provides healing energy.",
      focus: "Ground yourself through outdoor activities and make decisions based on long-term stability."
    }
  ],
  gemini: [
    {
      content: "Mercury amplifies your communication gifts today, Gemini. Intellectual connections spark innovative collaborations. Curiosity leads to fascinating discoveries.",
      focus: "Engage in stimulating conversations and explore multiple interests that expand your knowledge base."
    },
    {
      content: "Your adaptability shines in changing circumstances today, Gemini. Multiple opportunities require quick thinking and flexible responses. Information flows freely.",
      focus: "Network actively and share your ideas with diverse groups who appreciate your versatile perspective."
    },
    {
      content: "Mental agility gives you competitive advantages today, Gemini. Writing and speaking opportunities highlight your talents. Learning accelerates rapidly.",
      focus: "Embrace new technologies and communication methods that amplify your natural expressiveness."
    }
  ],
  cancer: [
    {
      content: "Lunar energy enhances your intuitive abilities today, Cancer. Emotional intelligence guides important decisions. Home and family bring profound satisfaction.",
      focus: "Trust your feelings and create nurturing environments that support your emotional well-being."
    },
    {
      content: "Your protective instincts serve others beautifully today, Cancer. Caring gestures create lasting bonds. Memory and tradition provide wisdom.",
      focus: "Honor your roots while opening your heart to new forms of security and belonging."
    },
    {
      content: "Psychic sensitivity reaches new heights today, Cancer. Dreams and symbols carry important messages. Compassion heals old wounds.",
      focus: "Practice self-care rituals and pay attention to emotional undercurrents in all interactions."
    }
  ],
  leo: [
    {
      content: "Solar energy magnifies your natural charisma today, Leo. Creative expression attracts admiration and opportunities. Generous spirit uplifts everyone around you.",
      focus: "Shine your light boldly and embrace leadership roles that showcase your unique talents."
    },
    {
      content: "Your dramatic flair creates memorable moments today, Leo. Artistic endeavors receive recognition and praise. Heart-centered choices bring joy.",
      focus: "Express yourself authentically and don't be afraid to take center stage in important situations."
    },
    {
      content: "Royal energy surrounds your endeavors today, Leo. Pride in your accomplishments is well-deserved. Playfulness enhances serious pursuits.",
      focus: "Combine work with pleasure and inspire others through your passionate approach to life."
    }
  ],
  virgo: [
    {
      content: "Mercury supports your analytical powers today, Virgo. Attention to detail reveals hidden opportunities. Service to others brings deep fulfillment.",
      focus: "Organize your environment and tackle complex problems with your systematic approach."
    },
    {
      content: "Your practical wisdom solves persistent problems today, Virgo. Health improvements through small changes create lasting benefits. Efficiency increases productivity.",
      focus: "Refine your daily routines and offer helpful guidance to those who value your expertise."
    },
    {
      content: "Earth energy grounds your ambitious plans today, Virgo. Perfectionism balanced with progress creates excellence. Natural healing methods prove effective.",
      focus: "Focus on incremental improvements and maintain high standards in all your endeavors."
    }
  ],
  libra: [
    {
      content: "Venus harmonizes your relationships today, Libra. Diplomatic skills resolve conflicts gracefully. Beauty and balance enhance your environment.",
      focus: "Seek win-win solutions and surround yourself with art and beauty that inspire your soul."
    },
    {
      content: "Your sense of justice creates positive change today, Libra. Partnership opportunities require careful consideration. Aesthetic sense guides choices.",
      focus: "Collaborate with others and make decisions that honor both fairness and elegance."
    },
    {
      content: "Air energy elevates your social connections today, Libra. Charm and grace open doors that force cannot. Legal matters favor balanced approaches.",
      focus: "Network with intention and use your natural diplomacy to build bridges between people."
    }
  ],
  scorpio: [
    {
      content: "Plutonian energy intensifies your transformative power today, Scorpio. Hidden truths surface for healing. Passion fuels important changes.",
      focus: "Embrace deep transformation and trust your ability to regenerate from any challenge."
    },
    {
      content: "Your investigative nature uncovers valuable secrets today, Scorpio. Psychological insight guides relationships. Magnetic presence attracts loyalty.",
      focus: "Dive beneath surface appearances and use your penetrating wisdom to help others heal."
    },
    {
      content: "Water energy flows through emotional depths today, Scorpio. Intuitive understanding transcends logic. Phoenix-like renewal begins.",
      focus: "Allow natural cycles of death and rebirth to clear space for your authentic power."
    }
  ],
  sagittarius: [
    {
      content: "Jupiter expands your horizons today, Sagittarius. Adventure calls and wisdom awaits in distant places. Teaching opportunities highlight your knowledge.",
      focus: "Explore new philosophies and share your discoveries with others who appreciate your perspective."
    },
    {
      content: "Your optimistic spirit conquers obstacles today, Sagittarius. International connections bring exciting possibilities. Higher learning accelerates growth.",
      focus: "Think big and pursue opportunities that align with your highest ideals and values."
    },
    {
      content: "Fire energy ignites your wanderlust today, Sagittarius. Truth-seeking leads to enlightening discoveries. Humor heals and connects.",
      focus: "Follow your curiosity and maintain the adventurous spirit that makes life meaningful."
    }
  ],
  capricorn: [
    {
      content: "Saturn rewards your disciplined efforts today, Capricorn. Authority and respect come through consistent performance. Mountain-climbing patience pays off.",
      focus: "Build lasting structures and demonstrate the leadership qualities that others admire."
    },
    {
      content: "Your ambitious nature finds practical outlets today, Capricorn. Executive decisions create long-term stability. Reputation strengthens through integrity.",
      focus: "Set high standards and work systematically toward goals that create lasting legacy."
    },
    {
      content: "Earth energy supports your material ambitions today, Capricorn. Time and effort invested wisely compound into success. Tradition provides guidance.",
      focus: "Honor proven methods while innovating within established frameworks for maximum impact."
    }
  ],
  aquarius: [
    {
      content: "Uranian energy electrifies your innovative thinking today, Aquarius. Humanitarian causes benefit from your unique perspective. Technology aids progress.",
      focus: "Champion progressive ideas and connect with groups that share your vision for a better future."
    },
    {
      content: "Your rebellious spirit challenges outdated systems today, Aquarius. Friendship networks provide valuable support. Unconventional wisdom prevails.",
      focus: "Trust your originality and use your independence to create positive change in your community."
    },
    {
      content: "Air energy circulates fresh ideas today, Aquarius. Collective consciousness supports individual freedom. Eccentric qualities become assets.",
      focus: "Embrace your uniqueness and collaborate with others who appreciate your innovative approach."
    }
  ],
  pisces: [
    {
      content: "Neptune enhances your psychic sensitivity today, Pisces. Compassionate action heals others and yourself. Artistic inspiration flows freely.",
      focus: "Trust your intuitive guidance and express your deep emotions through creative channels."
    },
    {
      content: "Your empathetic nature creates profound connections today, Pisces. Spiritual practices bring clarity and peace. Imagination manifests reality.",
      focus: "Set healthy boundaries while offering your natural healing presence to those in need."
    },
    {
      content: "Water energy deepens your emotional wisdom today, Pisces. Dreams carry important messages. Sacrifice for others brings unexpected rewards.",
      focus: "Flow with life's currents and use your sensitivity to navigate complex emotional situations."
    }
  ]
};

// Generate random fortune with enhanced variety
export function generateRandomFortune(category: FortuneCategoryType): { title: string; content: string } {
  const templates = fortuneTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Add random modifiers for variety
  const timeframe = fortuneModifiers.timeframes[Math.floor(Math.random() * fortuneModifiers.timeframes.length)];
  const intensifier = fortuneModifiers.intensifiers[Math.floor(Math.random() * fortuneModifiers.intensifiers.length)];
  const action = fortuneModifiers.actions[Math.floor(Math.random() * fortuneModifiers.actions.length)];
  
  // Sometimes add modifiers, sometimes use original
  const shouldModify = Math.random() > 0.6;
  
  if (shouldModify) {
    const enhancedContent = `${template.content} ${action} prepare for this ${intensifier} shift ${timeframe}.`;
    return {
      title: template.title,
      content: enhancedContent
    };
  }
  
  return template;
}

// Generate enhanced horoscope content
export function generateEnhancedHoroscope(sign: string): any {
  const signContent = expandedHoroscopeContent[sign as keyof typeof expandedHoroscopeContent];
  if (!signContent) return null;
  
  const randomContent = signContent[Math.floor(Math.random() * signContent.length)];
  
  // Generate random ratings that feel authentic
  const loveRating = Math.floor(Math.random() * 3) + 3; // 3-5
  const careerRating = Math.floor(Math.random() * 3) + 3; // 3-5  
  const healthRating = Math.floor(Math.random() * 3) + 3; // 3-5
  const luckyNumber = Math.floor(Math.random() * 9) + 1; // 1-9
  
  // Compatible signs based on astrological compatibility
  const compatibleSigns: Record<string, string[]> = {
    aries: ["leo", "sagittarius", "gemini"],
    taurus: ["virgo", "capricorn", "cancer"],
    gemini: ["libra", "aquarius", "aries"],
    cancer: ["scorpio", "pisces", "taurus"],
    leo: ["aries", "sagittarius", "libra"],
    virgo: ["taurus", "capricorn", "scorpio"],
    libra: ["gemini", "aquarius", "leo"],
    scorpio: ["cancer", "pisces", "virgo"],
    sagittarius: ["aries", "leo", "aquarius"],
    capricorn: ["taurus", "virgo", "pisces"],
    aquarius: ["gemini", "libra", "sagittarius"],
    pisces: ["cancer", "scorpio", "capricorn"]
  };
  
  const compatibles = compatibleSigns[sign] || ["leo"];
  const compatibleSign = compatibles[Math.floor(Math.random() * compatibles.length)];
  
  return {
    sign,
    content: `${randomContent.content} ${randomContent.focus}`,
    loveRating,
    careerRating,
    healthRating,
    luckyNumber,
    compatibleSign
  };
}