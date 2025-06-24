import { db } from "./db";
import { users, fortunes, horoscopes } from "@shared/schema";
import { FortuneCategory, ZodiacSigns } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingFortunes = await db.select().from(fortunes).limit(1);
    if (existingFortunes.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Create default user
    await db.insert(users).values({
      username: "guest",
      password: "guest"
    }).onConflictDoNothing();

    // Seed fortunes
    const fortuneData = [
      // Love fortunes
      { category: FortuneCategory.LOVE, title: "Heart's Awakening", content: "A deep connection awaits you in the realm of love. Open your heart to unexpected encounters, for Venus dances favorably in your chart. The universe conspires to bring souls together - yours among them." },
      { category: FortuneCategory.LOVE, title: "Romantic Transformation", content: "Love's energy surrounds you like morning mist. A significant relationship shift approaches - embrace change with an open heart. Trust in love's divine timing." },
      { category: FortuneCategory.LOVE, title: "Soul Connection", content: "The threads of destiny weave a beautiful tapestry of romance. Someone special enters your sphere of influence. Be receptive to love's gentle whispers." },
      { category: FortuneCategory.LOVE, title: "Passion's Flame", content: "Fire ignites in matters of the heart. A passionate encounter or rekindling of existing love illuminates your path. Follow your heart's true compass." },
      { category: FortuneCategory.LOVE, title: "Emotional Healing", content: "Past wounds in love begin their sacred healing. The heart chakra opens to receive and give love freely. Trust in love's restorative power." },
      
      // Career fortunes
      { category: FortuneCategory.CAREER, title: "Professional Ascension", content: "The winds of change blow favorably in your professional realm. A significant opportunity emerges from unexpected quarters. Your skills are recognized by those who matter." },
      { category: FortuneCategory.CAREER, title: "Creative Breakthrough", content: "Innovation flows through your professional endeavors like a mighty river. Your unique perspective becomes your greatest asset. Embrace creative solutions." },
      { category: FortuneCategory.CAREER, title: "Leadership Calling", content: "The universe calls you to step into a position of greater responsibility. Your natural leadership qualities shine brightly. Trust in your ability to guide others." },
      { category: FortuneCategory.CAREER, title: "Financial Growth", content: "Prosperity seeds planted in the past begin to sprout abundantly. Multiple streams of income flow toward you. Wise investments yield unexpected returns." },
      { category: FortuneCategory.CAREER, title: "Network Expansion", content: "Valuable connections form through seemingly casual encounters. Your professional network becomes a web of opportunity. Nurture relationships with genuine care." },
      
      // General fortunes
      { category: FortuneCategory.GENERAL, title: "Spiritual Awakening", content: "The veil between worlds grows thin as your spiritual awareness expands. Ancient wisdom whispers secrets to your awakening soul. Trust your intuitive insights." },
      { category: FortuneCategory.GENERAL, title: "Life Transformation", content: "A major life chapter closes as another begins. Embrace transformation with courage and grace. The phoenix rises from the ashes of the old." },
      { category: FortuneCategory.GENERAL, title: "Inner Strength", content: "Your inner reservoir of strength runs deeper than you realize. Challenges become stepping stones to greater wisdom. You possess all you need within." },
      { category: FortuneCategory.GENERAL, title: "Cosmic Alignment", content: "The stars align in your favor, creating a portal of unlimited possibility. Synchronicities guide your path forward. Pay attention to signs and omens." },
      { category: FortuneCategory.GENERAL, title: "Manifestation Power", content: "Your thoughts carry extraordinary creative power now. Focus your intentions with laser precision. What you visualize today becomes tomorrow's reality." }
    ];

    await db.insert(fortunes).values(fortuneData);

    // Seed horoscopes with correct schema fields
    const horoscopeData = [
      { sign: ZodiacSigns.ARIES, content: "Today's cosmic energy ignites your pioneering spirit, dear Aries. Mars, your ruling planet, bestows courage for new beginnings. Trust your instincts and take that leap of faith you've been contemplating.", loveRating: 4, careerRating: 5, healthRating: 4, luckyNumber: 17, compatibleSign: "Leo" },
      { sign: ZodiacSigns.TAURUS, content: "Venus graces your sign with abundance and beauty, steadfast Taurus. Material and emotional security flourish under today's celestial influence. Plant seeds of intention in fertile ground.", loveRating: 5, careerRating: 4, healthRating: 5, luckyNumber: 14, compatibleSign: "Virgo" },
      { sign: ZodiacSigns.GEMINI, content: "Mercury dances through your communication sector, clever Gemini. Words carry extra power today - use them wisely to inspire and connect. Your curiosity opens unexpected doors.", loveRating: 3, careerRating: 5, healthRating: 3, luckyNumber: 12, compatibleSign: "Libra" },
      { sign: ZodiacSigns.CANCER, content: "The Moon illuminates your emotional depths, sensitive Cancer. Family and home matters take precedence under today's nurturing energy. Trust your intuitive guidance in all decisions.", loveRating: 5, careerRating: 3, healthRating: 4, luckyNumber: 16, compatibleSign: "Scorpio" },
      { sign: ZodiacSigns.LEO, content: "The Sun shines brilliantly on your creative expression, radiant Leo. Your natural magnetism attracts opportunities and admirers alike. Share your gifts generously with the world.", loveRating: 4, careerRating: 5, healthRating: 4, luckyNumber: 19, compatibleSign: "Sagittarius" },
      { sign: ZodiacSigns.VIRGO, content: "Earth energy supports your practical endeavors, meticulous Virgo. Details others overlook become your stepping stones to success. Your service to others creates positive karma.", loveRating: 3, careerRating: 5, healthRating: 5, luckyNumber: 15, compatibleSign: "Capricorn" },
      { sign: ZodiacSigns.LIBRA, content: "Balance and harmony flow through your relationships, graceful Libra. Partnerships reach new levels of understanding and cooperation. Beauty surrounds you in unexpected forms.", loveRating: 5, careerRating: 4, healthRating: 3, luckyNumber: 13, compatibleSign: "Aquarius" },
      { sign: ZodiacSigns.SCORPIO, content: "Transformation beckons from the depths, mysterious Scorpio. What appears to end actually begins anew in a more powerful form. Embrace your regenerative abilities.", loveRating: 4, careerRating: 4, healthRating: 4, luckyNumber: 18, compatibleSign: "Pisces" },
      { sign: ZodiacSigns.SAGITTARIUS, content: "Jupiter expands your horizons beyond familiar boundaries, adventurous Sagittarius. Higher learning and distant travels call to your restless spirit. Seek truth through experience.", loveRating: 3, careerRating: 4, healthRating: 5, luckyNumber: 21, compatibleSign: "Aries" },
      { sign: ZodiacSigns.CAPRICORN, content: "Saturn rewards your persistent efforts with tangible results, ambitious Capricorn. Long-term goals manifest through disciplined action. Your reputation grows stronger.", loveRating: 3, careerRating: 5, healthRating: 4, luckyNumber: 20, compatibleSign: "Taurus" },
      { sign: ZodiacSigns.AQUARIUS, content: "Uranus electrifies your innovative thinking, visionary Aquarius. Revolutionary ideas flow through your consciousness like lightning. Your uniqueness becomes your superpower.", loveRating: 4, careerRating: 4, healthRating: 3, luckyNumber: 23, compatibleSign: "Gemini" },
      { sign: ZodiacSigns.PISCES, content: "Neptune enhances your psychic sensitivity, intuitive Pisces. Dreams and meditation reveal hidden truths about your spiritual path. Compassion heals both yourself and others.", loveRating: 5, careerRating: 3, healthRating: 4, luckyNumber: 17, compatibleSign: "Cancer" }
    ];

    await db.insert(horoscopes).values(horoscopeData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}