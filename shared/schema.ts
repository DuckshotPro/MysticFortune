import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const fortunes = pgTable("fortunes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const savedFortunes = pgTable("saved_fortunes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fortuneTitle: text("fortune_title").notNull(),
  fortuneContent: text("fortune_content").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  sign: text("sign").notNull(),
  content: text("content").notNull(),
  loveRating: integer("love_rating").notNull(),
  careerRating: integer("career_rating").notNull(),
  healthRating: integer("health_rating").notNull(),
  luckyNumber: integer("lucky_number").notNull(),
  compatibleSign: text("compatible_sign").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  birthDate: timestamp("birth_date"),
  preferences: text("preferences").array(),
  readingHistory: text("reading_history").array(),
  favoriteCategories: text("favorite_categories").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Enhanced Analytics Tables for Phase 3
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull().unique(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  pageViews: integer("page_views").default(0),
  fortunesGenerated: integer("fortunes_generated").default(0),
  horoscopesViewed: integer("horoscopes_viewed").default(0),
  tarotReadings: integer("tarot_readings").default(0),
  device: text("device"), // mobile, tablet, desktop
  browser: text("browser"),
  country: text("country"),
  referrer: text("referrer"),
  conversionEvent: text("conversion_event"), // premium_signup, fortune_shared, etc.
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userInteractions = pgTable("user_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").references(() => userSessions.sessionId),
  action: text("action").notNull(), // fortune_generated, horoscope_viewed, tarot_read, share_clicked, etc.
  category: text("category"), // fortune category or interaction type
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  pageUrl: text("page_url"),
  duration: integer("duration"), // time spent on action in seconds
  deviceInfo: text("device_info") // JSON string with device details
});

export const contentEngagement = pgTable("content_engagement", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // fortune, horoscope, tarot
  contentId: text("content_id").notNull(), // specific content identifier
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").references(() => userSessions.sessionId),
  engagementType: text("engagement_type").notNull(), // view, share, save, like, time_spent
  engagementValue: real("engagement_value"), // time in seconds, share count, etc.
  platform: text("platform"), // for shares: facebook, twitter, instagram, etc.
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: text("metadata") // additional engagement data
});

export const abTestResults = pgTable("ab_test_results", {
  id: serial("id").primaryKey(),
  testName: text("test_name").notNull(),
  variant: text("variant").notNull(), // A, B, C, etc.
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").references(() => userSessions.sessionId),
  metric: text("metric").notNull(), // conversion_rate, engagement_time, share_rate, etc.
  value: real("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: text("metadata") // test-specific data
});

export const viralMetrics = pgTable("viral_metrics", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(),
  platform: text("platform").notNull(),
  viralScore: real("viral_score").notNull(),
  actualShares: integer("actual_shares").default(0),
  actualLikes: integer("actual_likes").default(0),
  actualComments: integer("actual_comments").default(0),
  predictedScore: real("predicted_score"),
  accuracy: real("accuracy"), // how close prediction was to actual
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  hashtags: text("hashtags").array(),
  peakEngagementTime: timestamp("peak_engagement_time")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFortuneSchema = createInsertSchema(fortunes).pick({
  title: true,
  content: true,
  category: true,
});

export const insertSavedFortuneSchema = createInsertSchema(savedFortunes).pick({
  userId: true,
  fortuneTitle: true,
  fortuneContent: true,
  category: true,
});

export const insertHoroscopeSchema = createInsertSchema(horoscopes).pick({
  sign: true,
  content: true,
  loveRating: true,
  careerRating: true,
  healthRating: true,
  luckyNumber: true,
  compatibleSign: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  birthDate: true,
  preferences: true,
  readingHistory: true,
  favoriteCategories: true,
});

// Analytics Insert Schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).pick({
  userId: true,
  sessionId: true,
  startTime: true,
  endTime: true,
  duration: true,
  pageViews: true,
  fortunesGenerated: true,
  horoscopesViewed: true,
  tarotReadings: true,
  device: true,
  browser: true,
  country: true,
  referrer: true,
  conversionEvent: true,
});

export const insertUserInteractionSchema = createInsertSchema(userInteractions).pick({
  userId: true,
  sessionId: true,
  action: true,
  category: true,
  metadata: true,
  pageUrl: true,
  duration: true,
  deviceInfo: true,
});

export const insertContentEngagementSchema = createInsertSchema(contentEngagement).pick({
  contentType: true,
  contentId: true,
  userId: true,
  sessionId: true,
  engagementType: true,
  engagementValue: true,
  platform: true,
  metadata: true,
});

export const insertAbTestResultSchema = createInsertSchema(abTestResults).pick({
  testName: true,
  variant: true,
  userId: true,
  sessionId: true,
  metric: true,
  value: true,
  metadata: true,
});

export const insertViralMetricSchema = createInsertSchema(viralMetrics).pick({
  contentId: true,
  contentType: true,
  platform: true,
  viralScore: true,
  actualShares: true,
  actualLikes: true,
  actualComments: true,
  predictedScore: true,
  accuracy: true,
  hashtags: true,
  peakEngagementTime: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFortune = z.infer<typeof insertFortuneSchema>;
export type Fortune = typeof fortunes.$inferSelect;

export type InsertSavedFortune = z.infer<typeof insertSavedFortuneSchema>;
export type SavedFortune = typeof savedFortunes.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Analytics Types
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;

export type InsertUserInteraction = z.infer<typeof insertUserInteractionSchema>;
export type UserInteraction = typeof userInteractions.$inferSelect;

export type InsertContentEngagement = z.infer<typeof insertContentEngagementSchema>;
export type ContentEngagement = typeof contentEngagement.$inferSelect;

export type InsertAbTestResult = z.infer<typeof insertAbTestResultSchema>;
export type AbTestResult = typeof abTestResults.$inferSelect;

export type InsertViralMetric = z.infer<typeof insertViralMetricSchema>;
export type ViralMetric = typeof viralMetrics.$inferSelect;

export const FortuneCategory = {
  LOVE: "love",
  CAREER: "career",
  GENERAL: "general",
} as const;

export type FortuneCategoryType = typeof FortuneCategory[keyof typeof FortuneCategory];

export const ZodiacSigns = {
  ARIES: "aries",
  TAURUS: "taurus",
  GEMINI: "gemini",
  CANCER: "cancer",
  LEO: "leo",
  VIRGO: "virgo",
  LIBRA: "libra",
  SCORPIO: "scorpio",
  SAGITTARIUS: "sagittarius",
  CAPRICORN: "capricorn",
  AQUARIUS: "aquarius",
  PISCES: "pisces",
} as const;

export type ZodiacSignType = typeof ZodiacSigns[keyof typeof ZodiacSigns];
