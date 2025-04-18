import { Router } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFortuneSchema, 
  insertSavedFortuneSchema, 
  insertHoroscopeSchema,
  FortuneCategory,
  ZodiacSigns
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();
  
  // Prefix all routes with /api
  app.use("/api", router);
  
  // Get random fortune by category
  router.get("/fortunes/:category", async (req, res) => {
    try {
      const categorySchema = z.enum([
        FortuneCategory.LOVE, 
        FortuneCategory.CAREER, 
        FortuneCategory.GENERAL
      ]);
      
      const categoryResult = categorySchema.safeParse(req.params.category);
      
      if (!categoryResult.success) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      const fortune = await storage.getRandomFortune(categoryResult.data);
      
      if (!fortune) {
        return res.status(404).json({ message: "No fortunes found for this category" });
      }
      
      res.json(fortune);
    } catch (error) {
      res.status(500).json({ message: "Failed to get fortune" });
    }
  });
  
  // Get all saved fortunes for a user
  router.get("/saved-fortunes/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const savedFortunes = await storage.getSavedFortunes(userId);
      res.json(savedFortunes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get saved fortunes" });
    }
  });
  
  // Get saved fortunes by category for a user
  router.get("/saved-fortunes/:userId/:category", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const categorySchema = z.enum([
        FortuneCategory.LOVE, 
        FortuneCategory.CAREER, 
        FortuneCategory.GENERAL
      ]);
      
      const categoryResult = categorySchema.safeParse(req.params.category);
      
      if (!categoryResult.success) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      const savedFortunes = await storage.getSavedFortunesByCategory(
        userId, 
        categoryResult.data
      );
      
      res.json(savedFortunes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get saved fortunes by category" });
    }
  });
  
  // Save a fortune
  router.post("/save-fortune", async (req, res) => {
    try {
      const validatedData = insertSavedFortuneSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid fortune data" });
      }
      
      const savedFortune = await storage.saveFortune(validatedData.data);
      res.status(201).json(savedFortune);
    } catch (error) {
      res.status(500).json({ message: "Failed to save fortune" });
    }
  });
  
  // Delete a saved fortune
  router.delete("/saved-fortunes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid fortune ID" });
      }
      
      const success = await storage.deleteSavedFortune(id);
      
      if (!success) {
        return res.status(404).json({ message: "Saved fortune not found" });
      }
      
      res.status(200).json({ message: "Fortune deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete saved fortune" });
    }
  });
  
  // Get horoscope by zodiac sign
  router.get("/horoscopes/:sign", async (req, res) => {
    try {
      const signSchema = z.enum([
        ZodiacSigns.ARIES,
        ZodiacSigns.TAURUS,
        ZodiacSigns.GEMINI,
        ZodiacSigns.CANCER,
        ZodiacSigns.LEO,
        ZodiacSigns.VIRGO,
        ZodiacSigns.LIBRA,
        ZodiacSigns.SCORPIO,
        ZodiacSigns.SAGITTARIUS,
        ZodiacSigns.CAPRICORN,
        ZodiacSigns.AQUARIUS,
        ZodiacSigns.PISCES
      ]);
      
      const signResult = signSchema.safeParse(req.params.sign);
      
      if (!signResult.success) {
        return res.status(400).json({ message: "Invalid zodiac sign" });
      }
      
      const horoscope = await storage.getHoroscopeBySign(signResult.data);
      
      if (!horoscope) {
        return res.status(404).json({ message: "Horoscope not found for this sign" });
      }
      
      res.json(horoscope);
    } catch (error) {
      res.status(500).json({ message: "Failed to get horoscope" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
