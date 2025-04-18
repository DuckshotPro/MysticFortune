import { Router } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertFortuneSchema, 
  insertSavedFortuneSchema, 
  insertHoroscopeSchema,
  FortuneCategory,
  ZodiacSigns
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe if secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe features will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

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

  // Stripe payment routes
  if (stripe) {
    // Create payment intent for one-time payments
    router.post("/create-payment-intent", async (req, res) => {
      try {
        const schema = z.object({
          amount: z.number().positive(),
          plan: z.enum(['monthly', 'annual']).optional()
        });

        const validationResult = schema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Invalid payment data", 
            errors: validationResult.error.errors 
          });
        }
        
        const { amount, plan } = validationResult.data;
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            plan: plan || 'one-time'
          }
        });
        
        res.json({ 
          clientSecret: paymentIntent.client_secret,
          amount: amount,
          plan: plan || 'one-time'
        });
      } catch (error: any) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ 
          message: "Payment processing error: " + error.message 
        });
      }
    });

    // Create subscription
    router.post("/create-subscription", async (req, res) => {
      try {
        const schema = z.object({
          email: z.string().email(),
          paymentMethodId: z.string(),
          plan: z.enum(['monthly', 'annual'])
        });

        const validationResult = schema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Invalid subscription data", 
            errors: validationResult.error.errors 
          });
        }
        
        const { email, paymentMethodId, plan } = validationResult.data;
        
        // This would typically come from an environment variable or database
        const priceId = plan === 'monthly' 
          ? process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder'
          : process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder';
        
        // Create or retrieve customer
        let customer;
        const customers = await stripe.customers.list({ email });
        
        if (customers.data.length > 0) {
          customer = customers.data[0];
        } else {
          customer = await stripe.customers.create({ email });
        }
        
        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });
        
        // Set as default payment method
        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        
        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: priceId }],
          expand: ["latest_invoice.payment_intent"],
        });
        
        res.json({ 
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          status: subscription.status
        });
      } catch (error: any) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ 
          message: "Subscription processing error: " + error.message 
        });
      }
    });
  } else {
    // Mock Stripe routes if Stripe is not configured
    router.post("/create-payment-intent", (req, res) => {
      res.status(503).json({ 
        message: "Payment processing is not available. STRIPE_SECRET_KEY is missing." 
      });
    });
    
    router.post("/create-subscription", (req, res) => {
      res.status(503).json({ 
        message: "Subscription processing is not available. STRIPE_SECRET_KEY is missing." 
      });
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
