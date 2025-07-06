import { aiImageService } from "./aiImageService";
import { trendAnalyzer } from "./trendAnalyzer";
import { storage } from "./storage";
import { FortuneCategory, type FortuneCategoryType } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

interface SocialMediaPost {
  id: string;
  content: string;
  imageUrl?: string;
  platform: string;
  scheduledTime: Date;
  status: 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  viralScore?: number;
  isABTest?: boolean;
  originalPostId?: string;
}

interface PromotionalContent {
  fortuneContent: string;
  imagePrompt: string;
  socialCaptions: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
  };
  hashtags: string[];
}

class PromotionService {
  private postsQueue: SocialMediaPost[] = [];
  private assetsDir = path.join(process.cwd(), "client", "public", "generated-assets");

  constructor() {
    this.initializeAssetsDirectory();
  }

  private async initializeAssetsDirectory() {
    try {
      await fs.mkdir(this.assetsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create assets directory:", error);
    }
  }

  private generatePromotionalCaptions(fortuneContent: string, category: FortuneCategoryType): PromotionalContent['socialCaptions'] {
    const categoryEmojis = {
      love: "💕✨💖",
      career: "🌟💼🚀", 
      general: "🔮✨🌙"
    };

    const emojis = categoryEmojis[category] || categoryEmojis.general;
    const snippet = fortuneContent.substring(0, 80) + "...";

    return {
      instagram: `${emojis} Your mystic reading awaits! ${snippet}\n\n✨ Get your personalized reading at MysticFortune\n#fortunetelling #mystical #spirituality #guidance`,
      
      twitter: `${emojis} ${snippet}\n\nUnlock your destiny → MysticFortune 🔮\n#fortune #mystical #guidance`,
      
      facebook: `✨ Discover what the universe has in store for you! ✨\n\n${snippet}\n\nGet your full personalized reading and connect with your spiritual path. Our mystic insights have guided thousands to clarity and purpose.\n\n🔮 Visit MysticFortune today!`,
      
      tiktok: `POV: The universe is sending you signs ${emojis}\n\n${snippet}\n\n🔮 Full reading on MysticFortune\n#spiritualtok #fortune #mystical #guidance #manifest`
    };
  }

  private generateHashtags(category: FortuneCategoryType): string[] {
    const baseHashtags = ["#fortunetelling", "#mystical", "#spiritual", "#guidance", "#universe", "#destiny"];
    
    const categoryHashtags = {
      love: ["#love", "#romance", "#soulmate", "#relationships", "#heartguidance"],
      career: ["#career", "#success", "#business", "#professional", "#leadership"],
      general: ["#wisdom", "#intuition", "#psychic", "#meditation", "#enlightenment"]
    };

    return [...baseHashtags, ...(categoryHashtags[category] || categoryHashtags.general)];
  }

  async generatePromotionalContent(category?: FortuneCategoryType): Promise<PromotionalContent> {
    // Get a random fortune for promotion
    const selectedCategory = category || this.getRandomCategory();
    const fortune = await storage.getRandomFortune(selectedCategory);
    
    if (!fortune) {
      throw new Error(`No fortune found for category: ${selectedCategory}`);
    }

    // Generate AI artwork
    const artwork = await aiImageService.generateMysticalArtwork(selectedCategory);
    
    // Generate social media captions
    const socialCaptions = this.generatePromotionalCaptions(fortune.content, selectedCategory);
    const hashtags = this.generateHashtags(selectedCategory);

    return {
      fortuneContent: fortune.content,
      imagePrompt: artwork.prompt,
      socialCaptions,
      hashtags
    };
  }

  async createPromotionalAsset(category?: FortuneCategoryType): Promise<{
    imagePath: string;
    content: PromotionalContent;
  }> {
    const content = await this.generatePromotionalContent(category);
    const artwork = await aiImageService.generateMysticalArtwork(category || this.getRandomCategory());
    
    // Save image to assets directory
    const timestamp = Date.now();
    const filename = `promo-${category || 'general'}-${timestamp}.png`;
    const imagePath = path.join(this.assetsDir, filename);
    
    await fs.writeFile(imagePath, artwork.imageBuffer);
    
    // Return web-accessible path
    const webPath = `/generated-assets/${filename}`;
    
    return {
      imagePath: webPath,
      content
    };
  }

  async scheduleOptimizedPosts(frequency: 'daily' | 'weekly' = 'daily'): Promise<SocialMediaPost[]> {
    const scheduledPosts: SocialMediaPost[] = [];
    const platforms = ['instagram', 'twitter', 'facebook', 'tiktok'];
    const categories = [FortuneCategory.LOVE, FortuneCategory.CAREER, FortuneCategory.GENERAL];
    
    const hoursInterval = frequency === 'daily' ? 24 : 24 * 7;
    
    for (let i = 0; i < 7; i++) { // Schedule 7 posts
      const category = categories[i % categories.length];
      const platform = platforms[i % platforms.length];
      
      try {
        const asset = await this.createPromotionalAsset(category);
        const scheduledTime = new Date(Date.now() + (i * hoursInterval * 60 * 60 * 1000));
        
        const post: SocialMediaPost = {
          id: `post-${Date.now()}-${i}`,
          content: asset.content.socialCaptions[platform as keyof typeof asset.content.socialCaptions],
          imageUrl: asset.imagePath,
          platform,
          scheduledTime,
          status: 'scheduled',
          engagement: { likes: 0, shares: 0, comments: 0 }
        };
        
        scheduledPosts.push(post);
      } catch (error) {
        console.error(`Failed to create promotional asset for ${category}:`, error);
      }
    }
    
    this.postsQueue.push(...scheduledPosts);
    return scheduledPosts;
  }

  async generateViralContent(): Promise<{
    hook: string;
    content: string;
    imageUrl: string;
    platforms: Record<string, string>;
  }> {
    const viralHooks = [
      "POV: The universe just sent you the most accurate reading ever 🤯",
      "This fortune reading literally predicted my entire week...",
      "If you're seeing this, the universe wants you to know...",
      "The accuracy of this reading has me SHOOK 😱",
      "This is your sign to check your fortune today ✨"
    ];

    const hook = viralHooks[Math.floor(Math.random() * viralHooks.length)];
    const promotional = await this.createPromotionalAsset();
    
    return {
      hook,
      content: promotional.content.fortuneContent,
      imageUrl: promotional.imagePath,
      platforms: promotional.content.socialCaptions
    };
  }

  getScheduledPosts(): SocialMediaPost[] {
    return this.postsQueue;
  }

  private getRandomCategory(): FortuneCategoryType {
    const categories = [FortuneCategory.LOVE, FortuneCategory.CAREER, FortuneCategory.GENERAL];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}

export const promotionService = new PromotionService();