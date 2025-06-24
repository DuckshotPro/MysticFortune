import { 
  users, type User, type InsertUser,
  fortunes, type Fortune, type InsertFortune,
  savedFortunes, type SavedFortune, type InsertSavedFortune,
  horoscopes, type Horoscope, type InsertHoroscope,
  type FortuneCategoryType, type ZodiacSignType
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Fortune methods
  getAllFortunes(): Promise<Fortune[]>;
  getFortunesByCategory(category: FortuneCategoryType): Promise<Fortune[]>;
  getRandomFortune(category: FortuneCategoryType): Promise<Fortune | undefined>;
  createFortune(fortune: InsertFortune): Promise<Fortune>;
  
  // Saved Fortune methods
  getSavedFortunes(userId: number): Promise<SavedFortune[]>;
  getSavedFortunesByCategory(userId: number, category: FortuneCategoryType): Promise<SavedFortune[]>;
  saveFortune(savedFortune: InsertSavedFortune): Promise<SavedFortune>;
  deleteSavedFortune(id: number): Promise<boolean>;
  
  // Horoscope methods
  getHoroscopeBySign(sign: ZodiacSignType): Promise<Horoscope | undefined>;
  createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllFortunes(): Promise<Fortune[]> {
    return await db.select().from(fortunes);
  }

  async getFortunesByCategory(category: FortuneCategoryType): Promise<Fortune[]> {
    return await db.select().from(fortunes).where(eq(fortunes.category, category));
  }

  async getRandomFortune(category: FortuneCategoryType): Promise<Fortune | undefined> {
    const categoryFortunes = await db.select().from(fortunes).where(eq(fortunes.category, category));
    if (categoryFortunes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * categoryFortunes.length);
    return categoryFortunes[randomIndex];
  }

  async createFortune(insertFortune: InsertFortune): Promise<Fortune> {
    const [fortune] = await db
      .insert(fortunes)
      .values(insertFortune)
      .returning();
    return fortune;
  }

  async getSavedFortunes(userId: number): Promise<SavedFortune[]> {
    return await db.select().from(savedFortunes).where(eq(savedFortunes.userId, userId));
  }

  async getSavedFortunesByCategory(userId: number, category: FortuneCategoryType): Promise<SavedFortune[]> {
    return await db.select().from(savedFortunes)
      .where(
        and(
          eq(savedFortunes.userId, userId),
          eq(savedFortunes.category, category)
        )
      );
  }

  async saveFortune(insertSavedFortune: InsertSavedFortune): Promise<SavedFortune> {
    const [savedFortune] = await db
      .insert(savedFortunes)
      .values(insertSavedFortune)
      .returning();
    return savedFortune;
  }

  async deleteSavedFortune(id: number): Promise<boolean> {
    const result = await db.delete(savedFortunes).where(eq(savedFortunes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getHoroscopeBySign(sign: ZodiacSignType): Promise<Horoscope | undefined> {
    const [horoscope] = await db.select().from(horoscopes).where(eq(horoscopes.sign, sign));
    return horoscope || undefined;
  }

  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const [horoscope] = await db
      .insert(horoscopes)
      .values(insertHoroscope)
      .returning();
    return horoscope;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private fortunesDb: Map<number, Fortune>;
  private savedFortunesDb: Map<number, SavedFortune>;
  private horoscopesDb: Map<string, Horoscope>;
  
  currentUserId: number;
  currentFortuneId: number;
  currentSavedFortuneId: number;
  currentHoroscopeId: number;

  constructor() {
    this.users = new Map();
    this.fortunesDb = new Map();
    this.savedFortunesDb = new Map();
    this.horoscopesDb = new Map();
    
    this.currentUserId = 1;
    this.currentFortuneId = 1;
    this.currentSavedFortuneId = 1;
    this.currentHoroscopeId = 1;
    
    // Initialize with some fortunes
    this.initializeFortunes();
    this.initializeHoroscopes();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllFortunes(): Promise<Fortune[]> {
    return Array.from(this.fortunesDb.values());
  }
  
  async getFortunesByCategory(category: FortuneCategoryType): Promise<Fortune[]> {
    return Array.from(this.fortunesDb.values()).filter(
      (fortune) => fortune.category === category
    );
  }
  
  async getRandomFortune(category: FortuneCategoryType): Promise<Fortune | undefined> {
    const fortunes = await this.getFortunesByCategory(category);
    if (fortunes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
  }
  
  async createFortune(insertFortune: InsertFortune): Promise<Fortune> {
    const id = this.currentFortuneId++;
    const date = new Date();
    const fortune: Fortune = { ...insertFortune, id, date };
    this.fortunesDb.set(id, fortune);
    return fortune;
  }
  
  async getSavedFortunes(userId: number): Promise<SavedFortune[]> {
    return Array.from(this.savedFortunesDb.values()).filter(
      (savedFortune) => savedFortune.userId === userId
    );
  }
  
  async getSavedFortunesByCategory(userId: number, category: FortuneCategoryType): Promise<SavedFortune[]> {
    return Array.from(this.savedFortunesDb.values()).filter(
      (savedFortune) => savedFortune.userId === userId && savedFortune.category === category
    );
  }
  
  async saveFortune(insertSavedFortune: InsertSavedFortune): Promise<SavedFortune> {
    const id = this.currentSavedFortuneId++;
    const date = new Date();
    const savedFortune: SavedFortune = { ...insertSavedFortune, id, date };
    this.savedFortunesDb.set(id, savedFortune);
    return savedFortune;
  }
  
  async deleteSavedFortune(id: number): Promise<boolean> {
    return this.savedFortunesDb.delete(id);
  }
  
  async getHoroscopeBySign(sign: ZodiacSignType): Promise<Horoscope | undefined> {
    const horoscope = this.horoscopesDb.get(sign);
    if (!horoscope) return undefined;
    
    // Add daily variation to horoscope content while maintaining core structure
    const variations = [
      "Today's cosmic energy particularly emphasizes ",
      "The planetary alignments suggest a focus on ",
      "Your natural " + sign + " qualities are highlighted through ",
      "The universe encourages you to embrace "
    ];
    
    const today = new Date();
    const dayIndex = today.getDate() % variations.length;
    const variation = variations[dayIndex];
    
    // Create a slightly varied version while keeping original meaning
    const enhancedContent = horoscope.content.replace(/^[A-Z]/, (match) => 
      variation + match.toLowerCase()
    );
    
    return {
      ...horoscope,
      content: enhancedContent
    };
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const id = this.currentHoroscopeId++;
    const date = new Date();
    const horoscope: Horoscope = { ...insertHoroscope, id, date };
    this.horoscopesDb.set(insertHoroscope.sign, horoscope);
    return horoscope;
  }
  
  private initializeFortunes() {
    // Expanded Love fortunes collection
    const loveFortunesData = [
      { title: "Love Awaits", content: "A meaningful connection with someone from your past will resurface soon. Be open to rekindling this relationship in a new form." },
      { title: "Heart's Desire", content: "Your heart's deepest desire will manifest in unexpected ways. Stay open to love appearing in forms you might not recognize at first." },
      { title: "Romantic Journey", content: "A new romantic journey is about to begin. Trust that the universe is guiding you toward meaningful connections." },
      { title: "Soul Recognition", content: "Someone who truly understands your deepest aspirations will enter your life through a creative or spiritual pursuit." },
      { title: "Passionate Awakening", content: "A shared interest or hobby will spark a romantic connection with someone who appreciates your authentic self." },
      { title: "Emotional Liberation", content: "Breaking free from past relationship patterns will attract a partner who mirrors your newfound self-respect." },
      { title: "Divine Timing", content: "The universe is orchestrating a destined meeting. Trust in perfect timing and remain open to unexpected encounters." },
      { title: "Heart Healing", content: "Self-love practices will magnetize a relationship that supports your highest growth and happiness." },
      { title: "Love's Transformation", content: "Your understanding of love is evolving. Open communication will unlock deeper intimacy in existing relationships." },
      { title: "Romantic Renaissance", content: "Past emotional wounds are healing completely, creating space for authentic love to flourish in your life." }
    ];

    // Expanded Career fortunes collection  
    const careerFortunesData = [
      { title: "Career Advancement", content: "A leadership opportunity will present itself soon. Your preparation will be the key to success in this new role." },
      { title: "Creative Success", content: "Your creative talents will soon be recognized by someone influential. This recognition will open doors to new opportunities." },
      { title: "Professional Growth", content: "A period of significant professional growth awaits you. Embrace challenges as they are preparing you for advancement." },
      { title: "Financial Abundance", content: "Multiple income streams will develop as you align your work with your authentic passions and natural talents." },
      { title: "Network Expansion", content: "A chance conversation will connect you with a mentor who accelerates your professional growth exponentially." },
      { title: "Skill Mastery", content: "Time invested in learning complementary skills will unexpectedly become your greatest professional asset." },
      { title: "Entrepreneurial Spirit", content: "Your side project has potential to become your primary income source with dedicated focus and patience." },
      { title: "Recognition Ripple", content: "Consistent excellence in small tasks will create a reputation that leads to extraordinary opportunities." },
      { title: "Innovation Breakthrough", content: "A breakthrough idea will position you as a thought leader in your field. Document your insights carefully." },
      { title: "Leadership Emergence", content: "Your natural ability to inspire others will be called upon for a significant project or initiative." }
    ];

    // Expanded General fortunes collection
    const generalFortunesData = [
      { title: "Life's Path", content: "Trust your intuition in the coming days. A moment of clarity will guide your next steps on life's journey." },
      { title: "Spiritual Awakening", content: "You are on the verge of a spiritual awakening. Pay attention to signs and symbols that appear in your daily life." },
      { title: "Inner Wisdom", content: "Your inner wisdom holds the answers you seek. Take time for quiet reflection to access this profound knowledge." },
      { title: "Synchronicity Storm", content: "Meaningful coincidences will guide you toward important life decisions. Notice repeating patterns and symbols." },
      { title: "Wellness Revolution", content: "Small daily health improvements will compound into remarkable vitality and enhanced mental clarity." },
      { title: "Family Harmony", content: "Understanding and forgiveness will heal long-standing family tensions through unexpected conversations." },
      { title: "Creative Expression", content: "Your unique talents are meant to inspire others. Don't let perfectionism block your creative gifts." },
      { title: "Travel Destiny", content: "A journey will introduce you to people and experiences that fundamentally change your worldview." },
      { title: "Abundance Flow", content: "Shifting from scarcity to gratitude thinking will manifest opportunities you never imagined possible." },
      { title: "Wisdom Integration", content: "Past challenges will reveal their purpose in preparing you for an important upcoming phase of growth." }
    ];

    // Initialize all fortune categories
    loveFortunesData.forEach(fortune => {
      this.createFortune({ ...fortune, category: "love" });
    });

    careerFortunesData.forEach(fortune => {
      this.createFortune({ ...fortune, category: "career" });
    });

    generalFortunesData.forEach(fortune => {
      this.createFortune({ ...fortune, category: "general" });
    });
  }
  
  private initializeHoroscopes() {
    // Enhanced horoscope content with deeper insights
    const horoscopeVariations = {
      aries: [
        {
          content: "Mars energizes your personal magnetism today, Aries. Leadership opportunities emerge in unexpected places. Your pioneering spirit inspires others to take bold action.",
          focus: "Take initiative in collaborative projects and trust your instincts in competitive situations."
        },
        {
          content: "Your natural courage is highlighted today, Aries. A challenge that seemed insurmountable will reveal a clear path forward. Dynamic energy supports all endeavors.",
          focus: "Channel your enthusiasm into physical activities and creative pursuits that showcase your originality."
        }
      ],
      taurus: [
        {
          content: "Venus blesses your practical endeavors today, Taurus. Steady progress in financial matters brings lasting security. Your patience creates valuable opportunities.",
          focus: "Focus on building solid foundations and nurturing existing relationships with consistency and care."
        }
      ],
      // Add more variations for other signs as needed
    };

    this.createHoroscope({
      sign: "aries",
      content: "Mars energizes your personal magnetism today, Aries. Leadership opportunities emerge in unexpected places. Your pioneering spirit inspires others to take bold action. Take initiative in collaborative projects and trust your instincts in competitive situations.",
      loveRating: 4,
      careerRating: 5,
      healthRating: 4,
      luckyNumber: 7,
      compatibleSign: "leo"
    });
    
    this.createHoroscope({
      sign: "taurus",
      content: "Today brings stability in your financial matters, Taurus. Your natural patience serves you well in negotiations. Focus on self-care and grounding activities.",
      loveRating: 3,
      careerRating: 4,
      healthRating: 5,
      luckyNumber: 6,
      compatibleSign: "virgo"
    });
    
    this.createHoroscope({
      sign: "gemini",
      content: "Your communication skills are enhanced today, Gemini. It's an excellent time for important conversations and sharing your ideas. Intellectual pursuits are favored.",
      loveRating: 4,
      careerRating: 4,
      healthRating: 3,
      luckyNumber: 3,
      compatibleSign: "libra"
    });
    
    this.createHoroscope({
      sign: "cancer",
      content: "Emotional insights come easily today, Cancer. You'll find clarity regarding personal relationships. Your intuition is particularly strong, so trust your first impressions.",
      loveRating: 5,
      careerRating: 3,
      healthRating: 4,
      luckyNumber: 2,
      compatibleSign: "scorpio"
    });
    
    this.createHoroscope({
      sign: "leo",
      content: "Your creative energy is at a peak today, Leo. It's an excellent time for self-expression and pursuing artistic interests. Recognition for your talents may come your way.",
      loveRating: 4,
      careerRating: 5,
      healthRating: 4,
      luckyNumber: 1,
      compatibleSign: "aries"
    });
    
    this.createHoroscope({
      sign: "virgo",
      content: "Details matter more than usual today, Virgo. Your analytical skills are enhanced, making this a good day for problem-solving and organizing. Pay attention to your health routines.",
      loveRating: 3,
      careerRating: 5,
      healthRating: 4,
      luckyNumber: 5,
      compatibleSign: "taurus"
    });
    
    this.createHoroscope({
      sign: "libra",
      content: "Harmony in relationships is highlighted today, Libra. You'll find it easier to balance different areas of your life. Aesthetic appreciation brings joy, so surround yourself with beauty.",
      loveRating: 5,
      careerRating: 3,
      healthRating: 4,
      luckyNumber: 9,
      compatibleSign: "gemini"
    });
    
    this.createHoroscope({
      sign: "scorpio",
      content: "Transformation is your theme today, Scorpio. You may experience profound insights or make important discoveries. Your emotional intensity serves you well in intimate connections.",
      loveRating: 5,
      careerRating: 4,
      healthRating: 3,
      luckyNumber: 8,
      compatibleSign: "cancer"
    });
    
    this.createHoroscope({
      sign: "sagittarius",
      content: "Adventure calls to you today, Sagittarius. Your horizons are expanding, possibly through travel, education, or new philosophical ideas. Optimism brings good fortune your way.",
      loveRating: 3,
      careerRating: 4,
      healthRating: 5,
      luckyNumber: 4,
      compatibleSign: "aquarius"
    });
    
    this.createHoroscope({
      sign: "capricorn",
      content: "Professional matters are favored today, Capricorn. Your disciplined approach brings recognition from authority figures. Long-term planning yields positive results.",
      loveRating: 3,
      careerRating: 5,
      healthRating: 4,
      luckyNumber: 10,
      compatibleSign: "taurus"
    });
    
    this.createHoroscope({
      sign: "aquarius",
      content: "Innovation is your strength today, Aquarius. Your unique perspective solves problems in unexpected ways. Social connections bring opportunities for meaningful collaboration.",
      loveRating: 4,
      careerRating: 4,
      healthRating: 3,
      luckyNumber: 11,
      compatibleSign: "sagittarius"
    });
    
    this.createHoroscope({
      sign: "pisces",
      content: "Your intuitive and creative abilities are heightened today, Pisces. Artistic pursuits bring satisfaction. Pay attention to your dreams, as they may contain important messages.",
      loveRating: 4,
      careerRating: 3,
      healthRating: 5,
      luckyNumber: 12,
      compatibleSign: "scorpio"
    });
  }
}

export const storage = new DatabaseStorage();
