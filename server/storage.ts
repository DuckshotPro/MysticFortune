import { 
  users, type User, type InsertUser,
  fortunes, type Fortune, type InsertFortune,
  savedFortunes, type SavedFortune, type InsertSavedFortune,
  horoscopes, type Horoscope, type InsertHoroscope,
  type FortuneCategoryType, type ZodiacSignType
} from "@shared/schema";

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
    return this.horoscopesDb.get(sign);
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const id = this.currentHoroscopeId++;
    const date = new Date();
    const horoscope: Horoscope = { ...insertHoroscope, id, date };
    this.horoscopesDb.set(insertHoroscope.sign, horoscope);
    return horoscope;
  }
  
  private initializeFortunes() {
    // Love fortunes
    this.createFortune({
      title: "Love Awaits",
      content: "A meaningful connection with someone from your past will resurface soon. Be open to rekindling this relationship in a new form.",
      category: "love"
    });
    
    this.createFortune({
      title: "Heart's Desire",
      content: "Your heart's deepest desire will manifest in unexpected ways. Stay open to love appearing in forms you might not recognize at first.",
      category: "love"
    });
    
    this.createFortune({
      title: "Romantic Journey",
      content: "A new romantic journey is about to begin. Trust that the universe is guiding you toward meaningful connections.",
      category: "love"
    });
    
    // Career fortunes
    this.createFortune({
      title: "Career Advancement",
      content: "A leadership opportunity will present itself soon. Your preparation will be the key to success in this new role.",
      category: "career"
    });
    
    this.createFortune({
      title: "Creative Success",
      content: "Your creative talents will soon be recognized by someone influential. This recognition will open doors to new opportunities.",
      category: "career"
    });
    
    this.createFortune({
      title: "Professional Growth",
      content: "A period of significant professional growth awaits you. Embrace challenges as they are preparing you for advancement.",
      category: "career"
    });
    
    // General fortunes
    this.createFortune({
      title: "Life's Path",
      content: "Trust your intuition in the coming days. A moment of clarity will guide your next steps on life's journey.",
      category: "general"
    });
    
    this.createFortune({
      title: "Spiritual Awakening",
      content: "You are on the verge of a spiritual awakening. Pay attention to signs and symbols that appear in your daily life.",
      category: "general"
    });
    
    this.createFortune({
      title: "Inner Wisdom",
      content: "Your inner wisdom holds the answers you seek. Take time for quiet reflection to access this profound knowledge.",
      category: "general"
    });
  }
  
  private initializeHoroscopes() {
    this.createHoroscope({
      sign: "aries",
      content: "Today brings exciting opportunities for advancement, Aries. Your natural leadership abilities will shine, particularly in group settings. Focus on collaborative projects.",
      loveRating: 3,
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

export const storage = new MemStorage();
