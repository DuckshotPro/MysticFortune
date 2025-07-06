import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
