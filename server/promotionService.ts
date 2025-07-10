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

  // Self-promotion ad generator for the platform
  async generateSelfPromotionAd(adType: string): Promise<{
    type: string;
    content: string;
    platform: string;
    createdAt: Date;
    downloadUrl?: string;
  }> {
    const templates = {
      social_media: {
        instagram: [
          "🔮 Unlock your mystic destiny with AI-powered fortune telling! ✨ Get personalized readings that reveal your true path. #MysticFortune #AI #Astrology #FortuneTelling",
          "✨ Ancient wisdom meets modern AI 🤖 Experience the most accurate fortune readings online! Discover what the cosmos has in store for you. #MysticFortune #Cosmic #AI",
          "🌟 Your future awaits! Get AI-enhanced tarot readings, personalized horoscopes, and crystal ball insights. Join thousands who've found their path! #MysticFortune #Tarot #AI"
        ],
        twitter: [
          "🔮 The future of fortune telling is here! AI-powered personalized readings that actually work. Try Mystic Fortune today! #AI #FortuneTelling #MysticFortune",
          "✨ Ancient mysticism + Modern AI = Incredible accuracy! Get your personalized fortune reading now 🌟 #MysticFortune #AI #Astrology",
          "🌙 Discover your cosmic destiny with AI-enhanced fortune telling. Thousands of accurate readings delivered daily! #MysticFortune #AI #Cosmic"
        ],
        tiktok: [
          "POV: You discover an AI that predicts your future with mystical accuracy 🔮✨ #MysticFortune #AI #FortuneTelling #Viral",
          "This AI fortune teller knew my future before I did 😱🔮 Try it yourself! #MysticFortune #AI #MindBlown #Viral",
          "When the AI fortune app predicts exactly what happens next 🤯✨ #MysticFortune #AI #Accurate #Viral"
        ]
      },
      banner: [
        "🔮 Unlock Your Mystic Destiny with AI-Powered Fortune Telling - Try Mystic Fortune Today!",
        "✨ Ancient Wisdom Meets Modern AI - Get Your Personalized Reading Now!",
        "🌟 Discover Your True Path - AI-Enhanced Mystical Insights Await!"
      ],
      video: [
        "Create a mystical video showing AI generating personalized fortunes with cosmic animations",
        "Show testimonials of users amazed by accurate AI fortune predictions",
        "Demonstrate the app's AI features with magical visual effects and user success stories"
      ]
    };

    let content: string;
    let platform = 'general';

    switch (adType) {
      case 'social_media':
        const platforms = ['instagram', 'twitter', 'tiktok'];
        platform = platforms[Math.floor(Math.random() * platforms.length)];
        const platformTemplates = templates.social_media[platform as keyof typeof templates.social_media];
        content = platformTemplates[Math.floor(Math.random() * platformTemplates.length)];
        break;
      case 'banner':
        content = templates.banner[Math.floor(Math.random() * templates.banner.length)];
        platform = 'web';
        break;
      case 'video':
        content = templates.video[Math.floor(Math.random() * templates.video.length)];
        platform = 'video';
        break;
      default:
        content = "🔮 Experience the future of fortune telling with AI-powered Mystic Fortune!";
        break;
    }

    // If it's a banner or video, generate visual content
    let downloadUrl;
    if (adType === 'banner' || adType === 'video') {
      try {
        const artwork = await aiImageService.generatePromotionalArtwork();
        downloadUrl = `/generated-assets/promotion-${Date.now()}.png`;
      } catch (error) {
        console.error('Failed to generate promotional artwork:', error);
      }
    }

    return {
      type: adType,
      content,
      platform,
      createdAt: new Date(),
      downloadUrl
    };
  }

  private getRandomCategory(): FortuneCategoryType {
    const categories = [FortuneCategory.LOVE, FortuneCategory.CAREER, FortuneCategory.GENERAL];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}

export const promotionService = new PromotionService();