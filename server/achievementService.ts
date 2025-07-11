/**
 * Achievement and Milestone Service
 * Tracks user progress and manages achievement unlocking
 */

import { db } from './db';
import { 
  achievements, 
  userAchievements, 
  userMilestones, 
  userStats,
  users,
  InsertAchievement,
  InsertUserAchievement,
  InsertUserMilestone,
  InsertUserStats,
  Achievement,
  UserAchievement,
  UserMilestone,
  UserStats
} from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

interface AchievementProgress {
  achievementId: number;
  progress: number;
  requirement: number;
  isCompleted: boolean;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
}

interface UserLevel {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

class AchievementService {
  
  /**
   * Initialize default achievements
   */
  async initializeAchievements(): Promise<void> {
    const defaultAchievements: InsertAchievement[] = [
      // Fortune achievements
      {
        name: "First Steps",
        description: "Generate your first fortune",
        icon: "🔮",
        category: "fortune",
        type: "milestone",
        requirement: 1,
        requirementType: "fortunes_generated",
        rarity: "common",
        points: 10
      },
      {
        name: "Fortune Seeker",
        description: "Generate 10 fortunes",
        icon: "✨",
        category: "fortune",
        type: "milestone",
        requirement: 10,
        requirementType: "fortunes_generated",
        rarity: "common",
        points: 25
      },
      {
        name: "Mystic Explorer",
        description: "Generate 50 fortunes",
        icon: "🌟",
        category: "fortune",
        type: "milestone",
        requirement: 50,
        requirementType: "fortunes_generated",
        rarity: "rare",
        points: 100
      },
      {
        name: "Fortune Master",
        description: "Generate 100 fortunes",
        icon: "🏆",
        category: "fortune",
        type: "milestone",
        requirement: 100,
        requirementType: "fortunes_generated",
        rarity: "epic",
        points: 250
      },

      // Horoscope achievements
      {
        name: "Star Gazer",
        description: "View your first horoscope",
        icon: "⭐",
        category: "engagement",
        type: "milestone",
        requirement: 1,
        requirementType: "horoscopes_viewed",
        rarity: "common",
        points: 10
      },
      {
        name: "Cosmic Reader",
        description: "View 25 horoscopes",
        icon: "🌙",
        category: "engagement",
        type: "milestone",
        requirement: 25,
        requirementType: "horoscopes_viewed",
        rarity: "rare",
        points: 75
      },

      // Membership achievements
      {
        name: "Loyal Member",
        description: "Maintain consecutive membership for 1 month",
        icon: "👑",
        category: "membership",
        type: "milestone",
        requirement: 30,
        requirementType: "consecutive_membership_days",
        rarity: "rare",
        points: 150
      },
      {
        name: "Devoted Mystic",
        description: "Maintain consecutive membership for 3 months",
        icon: "💎",
        category: "membership",
        type: "milestone",
        requirement: 90,
        requirementType: "consecutive_membership_days",
        rarity: "epic",
        points: 400
      },
      {
        name: "Eternal Seeker",
        description: "Maintain consecutive membership for 6 months",
        icon: "🌌",
        category: "membership",
        type: "milestone",
        requirement: 180,
        requirementType: "consecutive_membership_days",
        rarity: "legendary",
        points: 1000
      },

      // Streak achievements
      {
        name: "Daily Devotee",
        description: "Visit for 3 consecutive days",
        icon: "🔥",
        category: "streak",
        type: "streak",
        requirement: 3,
        requirementType: "consecutive_days",
        rarity: "common",
        points: 30
      },
      {
        name: "Weekly Warrior",
        description: "Visit for 7 consecutive days",
        icon: "💪",
        category: "streak",
        type: "streak",
        requirement: 7,
        requirementType: "consecutive_days",
        rarity: "rare",
        points: 100
      },
      {
        name: "Monthly Master",
        description: "Visit for 30 consecutive days",
        icon: "👑",
        category: "streak",
        type: "streak",
        requirement: 30,
        requirementType: "consecutive_days",
        rarity: "legendary",
        points: 500,
        unlocksFeature: "exclusive_readings"
      },

      // Social achievements
      {
        name: "Social Mystic",
        description: "Share your first fortune",
        icon: "📱",
        category: "social",
        type: "milestone",
        requirement: 1,
        requirementType: "social_shares",
        rarity: "common",
        points: 15
      },
      {
        name: "Viral Visionary",
        description: "Share 10 fortunes",
        icon: "🌐",
        category: "social",
        type: "milestone",
        requirement: 10,
        requirementType: "social_shares",
        rarity: "rare",
        points: 75
      },

      // Collection achievements
      {
        name: "Fortune Collector",
        description: "Save your first fortune",
        icon: "💾",
        category: "engagement",
        type: "milestone",
        requirement: 1,
        requirementType: "saved_fortunes",
        rarity: "common",
        points: 10
      },
      {
        name: "Treasure Keeper",
        description: "Save 20 fortunes",
        icon: "💎",
        category: "engagement",
        type: "milestone",
        requirement: 20,
        requirementType: "saved_fortunes",
        rarity: "epic",
        points: 150
      },

      // Special achievements
      {
        name: "Night Owl",
        description: "Use the app between midnight and 3 AM",
        icon: "🦉",
        category: "special",
        type: "special_event",
        requirement: 1,
        requirementType: "night_usage",
        rarity: "rare",
        points: 50,
        isHidden: true
      },
      {
        name: "Lucky Number Seven",
        description: "Generate exactly 7 fortunes in one day",
        icon: "🍀",
        category: "special",
        type: "special_event",
        requirement: 7,
        requirementType: "daily_fortunes",
        rarity: "epic",
        points: 100,
        isHidden: true
      }
    ];

    for (const achievement of defaultAchievements) {
      try {
        await db.insert(achievements).values(achievement).onConflictDoNothing();
      } catch (error) {
        console.log(`Achievement "${achievement.name}" already exists or error occurred`);
      }
    }
  }

  /**
   * Get or create user stats
   */
  async getUserStats(userId: number): Promise<UserStats> {
    let [userStats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));

    if (!userStats) {
      const newStats: InsertUserStats = {
        userId,
        totalFortunes: 0,
        totalHoroscopes: 0,
        totalTarotReadings: 0,
        socialShares: 0,
        savedFortunes: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalAchievementPoints: 0,
        level: 1,
        experiencePoints: 0,
        lastActiveDate: new Date(),
        premiumMember: false,
        consecutiveMembershipDays: 0,
        membershipStartDate: null
      };

      [userStats] = await db.insert(userStats).values(newStats).returning();
    }

    return userStats;
  }

  /**
   * Update user stats and check for achievements
   */
  async updateUserStats(userId: number, updates: Partial<InsertUserStats>): Promise<void> {
    await db
      .update(userStats)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(userStats.userId, userId));

    // Check for new achievements after updating stats
    await this.checkAchievements(userId);
  }

  /**
   * Track user activity and update streaks
   */
  async trackUserActivity(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    const today = new Date();
    const lastActive = stats.lastActiveDate;
    
    // Calculate streak
    let currentStreak = stats.currentStreak;
    if (lastActive) {
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        currentStreak++;
      } else if (daysDiff > 1) {
        // Streak broken
        currentStreak = 1;
      }
      // If daysDiff === 0, it's the same day, no change to streak
    } else {
      currentStreak = 1;
    }

    const longestStreak = Math.max(currentStreak, stats.longestStreak);

    await this.updateUserStats(userId, {
      lastActiveDate: today,
      currentStreak,
      longestStreak
    });
  }

  /**
   * Track fortune generation
   */
  async trackFortuneGenerated(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    await this.updateUserStats(userId, {
      totalFortunes: stats.totalFortunes + 1,
      experiencePoints: stats.experiencePoints + 5 // 5 XP per fortune
    });
  }

  /**
   * Track horoscope viewing
   */
  async trackHoroscopeViewed(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    await this.updateUserStats(userId, {
      totalHoroscopes: stats.totalHoroscopes + 1,
      experiencePoints: stats.experiencePoints + 2 // 2 XP per horoscope
    });
  }

  /**
   * Track social sharing
   */
  async trackSocialShare(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    await this.updateUserStats(userId, {
      socialShares: stats.socialShares + 1,
      experiencePoints: stats.experiencePoints + 10 // 10 XP per share
    });
  }

  /**
   * Track fortune saving
   */
  async trackFortuneSaved(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    await this.updateUserStats(userId, {
      savedFortunes: stats.savedFortunes + 1,
      experiencePoints: stats.experiencePoints + 3 // 3 XP per save
    });
  }

  /**
   * Track consecutive membership days
   */
  async trackMembershipDay(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    
    if (stats.premiumMember) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if user was active yesterday to maintain streak
      if (stats.lastActiveDate && stats.lastActiveDate >= yesterday) {
        await this.updateUserStats(userId, {
          consecutiveMembershipDays: stats.consecutiveMembershipDays + 1
        });
      } else {
        // Reset streak if gap in membership activity
        await this.updateUserStats(userId, {
          consecutiveMembershipDays: 1,
          membershipStartDate: today
        });
      }
    }
  }

  /**
   * Check and unlock achievements
   */
  async checkAchievements(userId: number): Promise<UserAchievement[]> {
    const stats = await this.getUserStats(userId);
    const unlockedAchievements: UserAchievement[] = [];

    // Get all achievements
    const allAchievements = await db.select().from(achievements);

    // Get user's current achievements
    const userCurrentAchievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const completedAchievementIds = userCurrentAchievements
      .filter(ua => ua.isCompleted)
      .map(ua => ua.achievementId);

    for (const achievement of allAchievements) {
      if (completedAchievementIds.includes(achievement.id)) {
        continue; // Already completed
      }

      let currentProgress = 0;
      let shouldUnlock = false;

      // Calculate progress based on requirement type
      switch (achievement.requirementType) {
        case 'fortunes_generated':
          currentProgress = stats.totalFortunes;
          break;
        case 'horoscopes_viewed':
          currentProgress = stats.totalHoroscopes;
          break;
        case 'consecutive_days':
          currentProgress = stats.currentStreak;
          break;
        case 'social_shares':
          currentProgress = stats.socialShares;
          break;
        case 'saved_fortunes':
          currentProgress = stats.savedFortunes;
          break;
        case 'consecutive_membership_days':
          currentProgress = stats.consecutiveMembershipDays || 0;
          break;
        // Add more cases as needed
      }

      shouldUnlock = currentProgress >= achievement.requirement;

      // Find existing user achievement record
      let userAchievement = userCurrentAchievements.find(ua => ua.achievementId === achievement.id);

      if (!userAchievement) {
        // Create new achievement record
        const newUserAchievement: InsertUserAchievement = {
          userId,
          achievementId: achievement.id,
          progress: currentProgress,
          isCompleted: shouldUnlock,
          completedAt: shouldUnlock ? new Date() : undefined,
          notificationSent: false
        };

        [userAchievement] = await db.insert(userAchievements).values(newUserAchievement).returning();
      } else {
        // Update existing record
        await db
          .update(userAchievements)
          .set({
            progress: currentProgress,
            isCompleted: shouldUnlock,
            completedAt: shouldUnlock ? new Date() : userAchievement.completedAt
          })
          .where(eq(userAchievements.id, userAchievement.id));

        userAchievement.progress = currentProgress;
        userAchievement.isCompleted = shouldUnlock;
      }

      if (shouldUnlock && !userCurrentAchievements.some(ua => ua.achievementId === achievement.id && ua.isCompleted)) {
        unlockedAchievements.push(userAchievement);
        
        // Award achievement points
        await this.updateUserStats(userId, {
          totalAchievementPoints: stats.totalAchievementPoints + achievement.points,
          experiencePoints: stats.experiencePoints + achievement.points
        });

        // Create milestone record
        const milestone: InsertUserMilestone = {
          userId,
          milestoneType: 'achievement_unlocked',
          milestoneValue: achievement.id,
          description: `Unlocked "${achievement.name}" achievement`,
          rewardType: 'points',
          rewardValue: achievement.points.toString(),
          celebrationShown: false
        };

        await db.insert(userMilestones).values(milestone);
      }
    }

    // Check for level up
    await this.checkLevelUp(userId);

    return unlockedAchievements;
  }

  /**
   * Check and handle level up
   */
  async checkLevelUp(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    const newLevel = this.calculateLevel(stats.experiencePoints);

    if (newLevel > stats.level) {
      await this.updateUserStats(userId, { level: newLevel });

      // Create level up milestone
      const milestone: InsertUserMilestone = {
        userId,
        milestoneType: 'level_up',
        milestoneValue: newLevel,
        description: `Reached level ${newLevel}!`,
        rewardType: 'level',
        rewardValue: JSON.stringify({ newLevel, bonusXP: newLevel * 10 }),
        celebrationShown: false
      };

      await db.insert(userMilestones).values(milestone);
    }
  }

  /**
   * Calculate user level based on experience points
   */
  private calculateLevel(experiencePoints: number): number {
    // Level formula: level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(experiencePoints / 100)) + 1;
  }

  /**
   * Calculate XP needed for next level
   */
  getNextLevelRequirement(currentLevel: number): number {
    // XP for level = (level - 1)^2 * 100
    return Math.pow(currentLevel, 2) * 100;
  }

  /**
   * Get user level information
   */
  async getUserLevel(userId: number): Promise<UserLevel> {
    const stats = await this.getUserStats(userId);
    const currentLevelXP = this.getNextLevelRequirement(stats.level - 1);
    const nextLevelXP = this.getNextLevelRequirement(stats.level);
    const progressXP = stats.experiencePoints - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    
    return {
      level: stats.level,
      currentXP: stats.experiencePoints,
      nextLevelXP,
      progressPercentage: Math.min(100, (progressXP / requiredXP) * 100)
    };
  }

  /**
   * Get user achievement progress
   */
  async getUserAchievements(userId: number): Promise<AchievementProgress[]> {
    const userAchievements = await db
      .select({
        achievementId: userAchievements.achievementId,
        progress: userAchievements.progress,
        isCompleted: userAchievements.isCompleted,
        requirement: achievements.requirement,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        rarity: achievements.rarity,
        points: achievements.points
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.isCompleted), achievements.points);

    return userAchievements;
  }

  /**
   * Get user milestones
   */
  async getUserMilestones(userId: number, limit: number = 10): Promise<UserMilestone[]> {
    return await db
      .select()
      .from(userMilestones)
      .where(eq(userMilestones.userId, userId))
      .orderBy(desc(userMilestones.achievedAt))
      .limit(limit);
  }

  /**
   * Mark celebration as shown
   */
  async markCelebrationShown(milestoneId: number): Promise<void> {
    await db
      .update(userMilestones)
      .set({ celebrationShown: true })
      .where(eq(userMilestones.id, milestoneId));
  }
}

export const achievementService = new AchievementService();