/**
 * Advanced Analytics Service for Phase 3
 * Provides comprehensive user behavior tracking, content engagement analysis,
 * and intelligent insights for mystical fortune telling platform
 */

import { db } from "./db";
import { 
  userSessions, 
  userInteractions, 
  contentEngagement, 
  abTestResults, 
  viralMetrics,
  type InsertUserSession,
  type InsertUserInteraction,
  type InsertContentEngagement,
  type InsertAbTestResult,
  type InsertViralMetric,
  type UserSession,
  type UserInteraction,
  type ContentEngagement,
  type FortuneCategoryType
} from "@shared/schema";
import { eq, desc, count, avg, sum, and, gte, lte, sql } from "drizzle-orm";

interface DeviceInfo {
  userAgent: string;
  screen: { width: number; height: number };
  timezone: string;
  language: string;
}

interface SessionData {
  sessionId: string;
  userId?: number;
  device: string;
  browser: string;
  country?: string;
  referrer?: string;
}

interface UserBehaviorMetrics {
  totalSessions: number;
  avgSessionDuration: number;
  avgPageViews: number;
  mostActiveHours: number[];
  topCategories: { category: string; count: number }[];
  conversionRate: number;
  retentionRate: number;
}

interface ContentPerformanceMetrics {
  contentType: string;
  contentId: string;
  totalViews: number;
  avgEngagementTime: number;
  shareCount: number;
  saveCount: number;
  conversionRate: number;
  viralScore: number;
}

interface PlatformAnalytics {
  platform: string;
  totalShares: number;
  avgViralScore: number;
  peakEngagementHour: number;
  topHashtags: string[];
  conversionRate: number;
}

class AnalyticsService {
  /**
   * Session Management
   */
  async startSession(sessionData: SessionData): Promise<UserSession> {
    const [session] = await db.insert(userSessions).values({
      ...sessionData,
      startTime: new Date(),
      pageViews: 1,
      fortunesGenerated: 0,
      horoscopesViewed: 0,
      tarotReadings: 0
    }).returning();
    
    return session;
  }

  async updateSession(sessionId: string, updates: Partial<InsertUserSession>): Promise<void> {
    await db.update(userSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSessions.sessionId, sessionId));
  }

  async endSession(sessionId: string): Promise<void> {
    const endTime = new Date();
    const session = await this.getSession(sessionId);
    
    if (session) {
      const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
      
      await db.update(userSessions)
        .set({ endTime, duration })
        .where(eq(userSessions.sessionId, sessionId));
    }
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    const [session] = await db.select()
      .from(userSessions)
      .where(eq(userSessions.sessionId, sessionId))
      .limit(1);
    
    return session;
  }

  /**
   * User Interaction Tracking
   */
  async trackInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    const [tracked] = await db.insert(userInteractions)
      .values(interaction)
      .returning();
    
    // Update session counters based on action
    if (interaction.sessionId) {
      const updateData: Partial<InsertUserSession> = {};
      
      switch (interaction.action) {
        case 'fortune_generated':
          updateData.fortunesGenerated = sql`${userSessions.fortunesGenerated} + 1`;
          break;
        case 'horoscope_viewed':
          updateData.horoscopesViewed = sql`${userSessions.horoscopesViewed} + 1`;
          break;
        case 'tarot_read':
          updateData.tarotReadings = sql`${userSessions.tarotReadings} + 1`;
          break;
        case 'page_view':
          updateData.pageViews = sql`${userSessions.pageViews} + 1`;
          break;
      }
      
      if (Object.keys(updateData).length > 0) {
        await db.update(userSessions)
          .set(updateData)
          .where(eq(userSessions.sessionId, interaction.sessionId));
      }
    }
    
    return tracked;
  }

  /**
   * Content Engagement Tracking
   */
  async trackContentEngagement(engagement: InsertContentEngagement): Promise<ContentEngagement> {
    const [tracked] = await db.insert(contentEngagement)
      .values(engagement)
      .returning();
    
    return tracked;
  }

  /**
   * A/B Testing
   */
  async recordAbTestResult(result: InsertAbTestResult): Promise<void> {
    await db.insert(abTestResults).values(result);
  }

  async getAbTestResults(testName: string): Promise<any> {
    const results = await db.select({
      variant: abTestResults.variant,
      metric: abTestResults.metric,
      avgValue: avg(abTestResults.value),
      count: count()
    })
    .from(abTestResults)
    .where(eq(abTestResults.testName, testName))
    .groupBy(abTestResults.variant, abTestResults.metric);

    return results.reduce((acc, row) => {
      if (!acc[row.variant]) acc[row.variant] = {};
      acc[row.variant][row.metric] = {
        average: row.avgValue,
        count: row.count
      };
      return acc;
    }, {} as any);
  }

  /**
   * Viral Metrics Tracking
   */
  async recordViralMetrics(metrics: InsertViralMetric): Promise<void> {
    await db.insert(viralMetrics).values(metrics);
  }

  async updateViralMetrics(contentId: string, platform: string, actualData: {
    shares: number;
    likes: number;
    comments: number;
  }): Promise<void> {
    const [existing] = await db.select()
      .from(viralMetrics)
      .where(and(
        eq(viralMetrics.contentId, contentId),
        eq(viralMetrics.platform, platform)
      ))
      .limit(1);

    if (existing && existing.predictedScore) {
      const actualScore = (actualData.shares * 3) + (actualData.likes * 1) + (actualData.comments * 2);
      const accuracy = 1 - Math.abs(existing.predictedScore - actualScore) / Math.max(existing.predictedScore, actualScore);
      
      await db.update(viralMetrics)
        .set({
          actualShares: actualData.shares,
          actualLikes: actualData.likes,
          actualComments: actualData.comments,
          accuracy
        })
        .where(and(
          eq(viralMetrics.contentId, contentId),
          eq(viralMetrics.platform, platform)
        ));
    }
  }

  /**
   * Analytics Insights
   */
  async getUserBehaviorMetrics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<UserBehaviorMetrics> {
    const startDate = new Date();
    switch (timeframe) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Get session metrics
    const sessionMetrics = await db.select({
      totalSessions: count(),
      avgDuration: avg(userSessions.duration),
      avgPageViews: avg(userSessions.pageViews)
    })
    .from(userSessions)
    .where(gte(userSessions.startTime, startDate));

    // Get top categories
    const categoryMetrics = await db.select({
      category: userInteractions.category,
      count: count()
    })
    .from(userInteractions)
    .where(and(
      gte(userInteractions.timestamp, startDate),
      sql`${userInteractions.category} IS NOT NULL`
    ))
    .groupBy(userInteractions.category)
    .orderBy(desc(count()))
    .limit(5);

    // Get conversion rate (users who performed premium actions)
    const conversionData = await db.select({
      total: count(),
      conversions: sum(sql`CASE WHEN ${userSessions.conversionEvent} IS NOT NULL THEN 1 ELSE 0 END`)
    })
    .from(userSessions)
    .where(gte(userSessions.startTime, startDate));

    return {
      totalSessions: sessionMetrics[0]?.totalSessions || 0,
      avgSessionDuration: sessionMetrics[0]?.avgDuration || 0,
      avgPageViews: sessionMetrics[0]?.avgPageViews || 0,
      mostActiveHours: await this.getMostActiveHours(startDate),
      topCategories: categoryMetrics.map(c => ({ category: c.category || '', count: c.count })),
      conversionRate: conversionData[0]?.total ? 
        (Number(conversionData[0].conversions) / conversionData[0].total) * 100 : 0,
      retentionRate: await this.calculateRetentionRate(startDate)
    };
  }

  async getContentPerformance(contentType?: string): Promise<ContentPerformanceMetrics[]> {
    let query = db.select({
      contentType: contentEngagement.contentType,
      contentId: contentEngagement.contentId,
      totalViews: count(),
      avgEngagementTime: avg(contentEngagement.engagementValue),
      shareCount: sum(sql`CASE WHEN ${contentEngagement.engagementType} = 'share' THEN 1 ELSE 0 END`),
      saveCount: sum(sql`CASE WHEN ${contentEngagement.engagementType} = 'save' THEN 1 ELSE 0 END`)
    })
    .from(contentEngagement);

    if (contentType) {
      query = query.where(eq(contentEngagement.contentType, contentType));
    }

    const results = await query
      .groupBy(contentEngagement.contentType, contentEngagement.contentId)
      .orderBy(desc(count()));

    return results.map(result => ({
      contentType: result.contentType,
      contentId: result.contentId,
      totalViews: result.totalViews,
      avgEngagementTime: result.avgEngagementTime || 0,
      shareCount: Number(result.shareCount) || 0,
      saveCount: Number(result.saveCount) || 0,
      conversionRate: 0, // Calculate based on specific conversion events
      viralScore: 0 // Calculate from viral metrics
    }));
  }

  async getPlatformAnalytics(): Promise<PlatformAnalytics[]> {
    const platformData = await db.select({
      platform: viralMetrics.platform,
      totalShares: sum(viralMetrics.actualShares),
      avgViralScore: avg(viralMetrics.viralScore),
      hashtags: sql<string[][] | null>`json_agg(${viralMetrics.hashtags})`,
      count: count()
    })
    .from(viralMetrics)
    .groupBy(viralMetrics.platform);

    return platformData.map(data => {
      // Extract and count hashtags
      const allHashtags = (data.hashtags || [])
        .flat()
        .filter((tag): tag is string => typeof tag === 'string' && tag.length > 0);

      const hashtagCounts = allHashtags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topHashtags = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);

      return {
        platform: data.platform,
        totalShares: Number(data.totalShares) || 0,
        avgViralScore: Number(data.avgViralScore) || 0,
        peakEngagementHour: 18, // TODO: Calculate from actual data
        topHashtags,
        conversionRate: 0 // TODO: Calculate from conversion events
      };
    });
  }

  private async getMostActiveHours(startDate: Date): Promise<number[]> {
    const hourlyData = await db.select({
      hour: sql`EXTRACT(HOUR FROM ${userInteractions.timestamp})`,
      count: count()
    })
    .from(userInteractions)
    .where(gte(userInteractions.timestamp, startDate))
    .groupBy(sql`EXTRACT(HOUR FROM ${userInteractions.timestamp})`)
    .orderBy(desc(count()))
    .limit(3);

    return hourlyData.map(row => Number(row.hour));
  }

  private async calculateRetentionRate(startDate: Date): Promise<number> {
    // Calculate 7-day retention rate
    const retentionDate = new Date(startDate);
    retentionDate.setDate(retentionDate.getDate() + 7);

    const newUsers = await db.select({ count: count() })
      .from(userSessions)
      .where(gte(userSessions.startTime, startDate));

    const returningUsers = await db.select({ count: count() })
      .from(userSessions)
      .where(and(
        gte(userSessions.startTime, startDate),
        lte(userSessions.startTime, retentionDate)
      ))
      .groupBy(userSessions.userId)
      .having(sql`COUNT(*) > 1`);

    const newUserCount = newUsers[0]?.count || 0;
    const returningUserCount = returningUsers.length;

    return newUserCount > 0 ? (returningUserCount / newUserCount) * 100 : 0;
  }

  /**
   * Real-time Analytics
   */
  async getLiveMetrics(): Promise<any> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [activeSessions, recentInteractions, topContent] = await Promise.all([
      // Active sessions in last hour
      db.select({ count: count() })
        .from(userSessions)
        .where(and(
          gte(userSessions.startTime, oneHourAgo),
          sql`${userSessions.endTime} IS NULL`
        )),

      // Recent interactions
      db.select({
        action: userInteractions.action,
        count: count()
      })
      .from(userInteractions)
      .where(gte(userInteractions.timestamp, oneHourAgo))
      .groupBy(userInteractions.action),

      // Top content in last hour
      db.select({
        contentType: contentEngagement.contentType,
        contentId: contentEngagement.contentId,
        engagements: count()
      })
      .from(contentEngagement)
      .where(gte(contentEngagement.timestamp, oneHourAgo))
      .groupBy(contentEngagement.contentType, contentEngagement.contentId)
      .orderBy(desc(count()))
      .limit(5)
    ]);

    return {
      activeSessions: activeSessions[0]?.count || 0,
      recentInteractions: recentInteractions,
      topContent: topContent,
      timestamp: now
    };
  }
}

export const analyticsService = new AnalyticsService();