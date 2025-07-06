import { FortuneCategoryType } from "@shared/schema";

interface TrendData {
  hashtag: string;
  volume: number;
  engagement: number;
  platform: string;
  trend_score: number;
}

interface ViralPrediction {
  score: number;
  confidence: number;
  optimizations: string[];
  bestTime: string;
  suggestedHashtags: string[];
}

class TrendAnalyzer {
  private trendingHashtags: Map<string, TrendData[]> = new Map();
  private engagementPatterns: Map<string, number[]> = new Map();

  constructor() {
    this.initializeTrendData();
    this.loadEngagementPatterns();
  }

  private initializeTrendData() {
    // Simulated trending data - in production, this would come from social media APIs
    const currentTrends = {
      spiritual: [
        { hashtag: '#manifestation', volume: 15000, engagement: 8.5, platform: 'instagram', trend_score: 92 },
        { hashtag: '#spiritualawakening', volume: 12000, engagement: 7.8, platform: 'tiktok', trend_score: 88 },
        { hashtag: '#crystalhealing', volume: 9500, engagement: 9.2, platform: 'instagram', trend_score: 85 },
        { hashtag: '#tarotreading', volume: 8200, engagement: 8.9, platform: 'twitter', trend_score: 83 }
      ],
      astrology: [
        { hashtag: '#astrology', volume: 25000, engagement: 9.1, platform: 'tiktok', trend_score: 95 },
        { hashtag: '#zodiacsigns', volume: 18000, engagement: 8.3, platform: 'instagram', trend_score: 90 },
        { hashtag: '#horoscope', volume: 14000, engagement: 7.9, platform: 'twitter', trend_score: 87 },
        { hashtag: '#fullmoon', volume: 11000, engagement: 8.7, platform: 'instagram', trend_score: 84 }
      ],
      general: [
        { hashtag: '#selflove', volume: 22000, engagement: 8.8, platform: 'instagram', trend_score: 93 },
        { hashtag: '#positivity', volume: 16000, engagement: 7.5, platform: 'tiktok', trend_score: 89 },
        { hashtag: '#motivation', volume: 19000, engagement: 8.1, platform: 'twitter', trend_score: 91 },
        { hashtag: '#mindfulness', volume: 13000, engagement: 9.0, platform: 'instagram', trend_score: 86 }
      ]
    };

    for (const [category, trends] of Object.entries(currentTrends)) {
      this.trendingHashtags.set(category, trends);
    }
  }

  private loadEngagementPatterns() {
    // Historical engagement data by hour (0-23)
    const patterns = {
      instagram: [2, 3, 4, 5, 6, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 44, 38, 32, 25, 18, 12],
      tiktok: [5, 6, 8, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 72, 65, 55, 45, 35, 25],
      twitter: [8, 10, 12, 15, 18, 22, 28, 35, 42, 48, 52, 55, 58, 60, 62, 58, 55, 50, 45, 38, 32, 25, 18, 12],
      facebook: [3, 4, 5, 6, 8, 12, 18, 25, 32, 38, 42, 45, 48, 50, 48, 45, 42, 38, 32, 25, 18, 12, 8, 5]
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      this.engagementPatterns.set(platform, pattern);
    }
  }

  public getTrendingHashtags(category: FortuneCategoryType, platform: string): string[] {
    const categoryMap = {
      love: 'spiritual',
      career: 'general',
      general: 'astrology'
    };

    const trends = this.trendingHashtags.get(categoryMap[category]) || [];
    return trends
      .filter(trend => trend.platform === platform || trend.trend_score > 90)
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, 5)
      .map(trend => trend.hashtag);
  }

  public predictViralPotential(content: string, platform: string, scheduledTime: Date): ViralPrediction {
    let score = 50; // Base score
    const optimizations: string[] = [];
    
    // Content analysis
    const wordCount = content.split(' ').length;
    if (platform === 'twitter' && wordCount <= 25) {
      score += 10;
    } else if (platform === 'instagram' && wordCount >= 20 && wordCount <= 50) {
      score += 8;
    } else if (platform === 'tiktok' && wordCount <= 15) {
      score += 12;
    }

    // Hashtag analysis
    const hashtagCount = (content.match(/#/g) || []).length;
    if (hashtagCount >= 3 && hashtagCount <= 8) {
      score += 8;
    } else if (hashtagCount < 3) {
      optimizations.push("Add more relevant hashtags (3-8 recommended)");
    }

    // Emotional content detection
    const emotionalWords = ['love', 'amazing', 'incredible', 'shocking', 'beautiful', 'powerful', 'mystical'];
    const emotionCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    score += emotionCount * 3;

    // Time optimization
    const hour = scheduledTime.getHours();
    const platformPattern = this.engagementPatterns.get(platform) || [];
    const timeScore = platformPattern[hour] || 30;
    score += (timeScore - 30) / 2; // Normalize to +/- 15 points

    if (timeScore < 40) {
      optimizations.push(`Consider posting at peak hours (${this.getBestPostingTime(platform)})`);
    }

    // Platform-specific optimizations
    if (platform === 'instagram' && !content.includes('✨')) {
      optimizations.push("Add visual emojis for Instagram engagement");
    }
    
    if (platform === 'tiktok' && !content.toLowerCase().includes('pov')) {
      optimizations.push("Consider using trending TikTok formats like 'POV:'");
    }

    // Calculate confidence based on data quality
    const confidence = Math.min(95, 60 + (score - 50) / 2);

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      confidence: Math.round(confidence),
      optimizations,
      bestTime: this.getBestPostingTime(platform),
      suggestedHashtags: this.getTrendingHashtags('general', platform)
    };
  }

  private getBestPostingTime(platform: string): string {
    const pattern = this.engagementPatterns.get(platform) || [];
    const maxEngagement = Math.max(...pattern);
    const bestHour = pattern.indexOf(maxEngagement);
    
    const timeMap: Record<string, string> = {
      instagram: `${bestHour}:00 (Peak: ${bestHour}-${(bestHour + 2) % 24}:00)`,
      tiktok: `${bestHour}:00 (Peak: ${bestHour}-${(bestHour + 1) % 24}:00)`,
      twitter: `${bestHour}:00 (Peak: ${bestHour}-${(bestHour + 2) % 24}:00)`,
      facebook: `${bestHour}:00 (Peak: ${bestHour}-${(bestHour + 3) % 24}:00)`
    };

    return timeMap[platform] || `${bestHour}:00`;
  }

  public analyzeContentPerformance(posts: any[]): any {
    const platformMetrics = new Map();

    posts.forEach(post => {
      if (!platformMetrics.has(post.platform)) {
        platformMetrics.set(post.platform, {
          totalPosts: 0,
          totalEngagement: 0,
          bestTime: 0,
          topHashtags: new Map()
        });
      }

      const metrics = platformMetrics.get(post.platform);
      metrics.totalPosts++;
      metrics.totalEngagement += post.engagement.likes + post.engagement.shares;

      // Extract hashtags for analysis
      const hashtags = post.content.match(/#\w+/g) || [];
      hashtags.forEach((tag: string) => {
        metrics.topHashtags.set(tag, (metrics.topHashtags.get(tag) || 0) + 1);
      });
    });

    return {
      platformInsights: Array.from(platformMetrics.entries()).map(([platform, data]) => ({
        platform,
        averageEngagement: Math.round(data.totalEngagement / data.totalPosts),
        topHashtags: Array.from(data.topHashtags.entries())
          .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]: [string, number]) => tag),
        recommendation: this.generatePlatformRecommendation(platform, data)
      })),
      overallScore: this.calculateOverallScore(posts),
      nextOptimizations: this.generateOptimizations(posts)
    };
  }

  private generatePlatformRecommendation(platform: string, data: any): string {
    const avgEngagement = data.totalEngagement / data.totalPosts;
    
    if (avgEngagement > 50) {
      return `Excellent performance on ${platform}. Continue current strategy.`;
    } else if (avgEngagement > 25) {
      return `Good performance on ${platform}. Try experimenting with posting times.`;
    } else {
      return `${platform} needs optimization. Focus on trending hashtags and better timing.`;
    }
  }

  private calculateOverallScore(posts: any[]): number {
    const totalEngagement = posts.reduce((sum, post) => 
      sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0);
    
    return Math.min(100, Math.round(totalEngagement / posts.length));
  }

  private generateOptimizations(posts: any[]): string[] {
    const optimizations = [];
    
    const avgHashtags = posts.reduce((sum, post) => 
      sum + (post.content.match(/#/g) || []).length, 0) / posts.length;
    
    if (avgHashtags < 3) {
      optimizations.push("Increase hashtag usage to 3-8 per post");
    }
    
    const platformDistribution = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {});
    
    if (Object.keys(platformDistribution).length < 3) {
      optimizations.push("Expand to more social media platforms");
    }
    
    return optimizations;
  }

  public getABTestVariations(originalContent: string, platform: string): string[] {
    const variations = [originalContent];
    
    // Variation 1: More emojis
    const emojiVariation = originalContent + " ✨🔮💫";
    variations.push(emojiVariation);
    
    // Variation 2: Question format
    const questionVariation = "What if " + originalContent.toLowerCase() + " 🤔";
    variations.push(questionVariation);
    
    // Variation 3: Call to action
    const ctaVariation = originalContent + "\n\nDouble tap if you agree! 👇";
    variations.push(ctaVariation);
    
    return variations.slice(0, 3); // Return top 3 variations
  }
}

export const trendAnalyzer = new TrendAnalyzer();