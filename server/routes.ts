import { Router } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { aiImageService } from "./aiImageService";
import { promotionService } from "./promotionService";
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

// PayPal configuration check
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.warn('Missing PayPal environment variables. PayPal features will be available in demo mode.');
}

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

  // PayPal routes
  router.post("/create-paypal-order", async (req, res) => {
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

      // In production, you would create a PayPal order here
      // For demo purposes, we'll simulate the PayPal order creation
      if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
        // Real PayPal integration would go here
        // This would typically use the PayPal SDK to create an order
        console.log(`Creating PayPal order for $${amount} (${plan || 'one-time'})`);
        
        res.json({ 
          orderId: `PAYPAL_ORDER_${Date.now()}`,
          amount: amount,
          plan: plan || 'one-time',
          approvalUrl: `https://www.paypal.com/checkoutnow?token=DEMO_TOKEN`
        });
      } else {
        // Demo mode - simulate successful order creation
        console.log(`Demo PayPal order created for $${amount} (${plan || 'one-time'})`);
        
        res.json({ 
          orderId: `DEMO_PAYPAL_ORDER_${Date.now()}`,
          amount: amount,
          plan: plan || 'one-time',
          approvalUrl: 'https://demo.paypal.com/checkout',
          message: 'Demo mode: PayPal order created successfully'
        });
      }
    } catch (error: any) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({ 
        message: "PayPal order creation error: " + error.message 
      });
    }
  });

  router.post("/capture-paypal-order", async (req, res) => {
    try {
      const schema = z.object({
        orderId: z.string(),
        payerId: z.string().optional()
      });

      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid PayPal capture data", 
          errors: validationResult.error.errors 
        });
      }
      
      const { orderId, payerId } = validationResult.data;

      // In production, you would capture the PayPal payment here
      console.log(`Capturing PayPal order: ${orderId} for payer: ${payerId}`);
      
      res.json({ 
        orderId,
        status: 'COMPLETED',
        payerId,
        captureId: `CAPTURE_${Date.now()}`,
        message: 'Payment captured successfully'
      });
    } catch (error: any) {
      console.error("Error capturing PayPal order:", error);
      res.status(500).json({ 
        message: "PayPal capture error: " + error.message 
      });
    }
  });

  // Personalized AI Fortune Routes
  app.post("/api/personalized-fortune", async (req, res) => {
    try {
      const { category, userId, birthDate, preferences } = req.body;
      
      const userProfile = {
        birthDate: birthDate ? new Date(birthDate) : undefined,
        preferences: preferences || [],
        readingHistory: [],
        favoriteCategories: []
      };

      const personalizedFortune = await aiImageService.generatePersonalizedFortune(category, userProfile);
      
      res.json(personalizedFortune);
    } catch (error) {
      console.error("Personalized fortune generation failed:", error);
      res.status(500).json({ message: "Failed to generate personalized fortune" });
    }
  });

  // AI Tarot Reading Routes
  app.post("/api/ai-tarot-reading", async (req, res) => {
    try {
      const { cardName, userQuestion, userId, birthDate } = req.body;
      
      const userProfile = {
        birthDate: birthDate ? new Date(birthDate) : undefined,
        preferences: [],
        readingHistory: [],
        favoriteCategories: []
      };

      const tarotInterpretation = await aiImageService.generateTarotInterpretation(cardName, userQuestion, userProfile);
      
      res.json(tarotInterpretation);
    } catch (error) {
      console.error("AI tarot reading failed:", error);
      res.status(500).json({ message: "Failed to generate tarot reading" });
    }
  });

  // AI Image Generation Routes
  app.post("/api/premium/generate-artwork", async (req, res) => {
    try {
      const { category } = req.body;
      const artwork = await aiImageService.generateMysticalArtwork(category);
      
      // Check if it's SVG content
      const isWebPImage = artwork.imageBuffer.slice(0, 4).toString() === 'RIFF';
      const isPNG = artwork.imageBuffer.slice(0, 8).toString('hex').startsWith('89504e47');
      const isSVG = artwork.imageBuffer.toString().includes('<svg');
      
      let imageDataUrl: string;
      if (isSVG) {
        const base64Svg = artwork.imageBuffer.toString('base64');
        imageDataUrl = `data:image/svg+xml;base64,${base64Svg}`;
      } else if (isPNG) {
        const base64Image = artwork.imageBuffer.toString('base64');
        imageDataUrl = `data:image/png;base64,${base64Image}`;
      } else {
        const base64Image = artwork.imageBuffer.toString('base64');
        imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
      }
      
      res.json({
        imageUrl: imageDataUrl,
        prompt: artwork.prompt,
        category: artwork.category
      });
    } catch (error) {
      console.error("AI artwork generation failed:", error);
      res.status(500).json({ message: "Failed to generate artwork" });
    }
  });

  // Promotional Content Routes
  app.post("/api/promotion/generate-content", async (req, res) => {
    try {
      const { category } = req.body;
      const content = await promotionService.generatePromotionalContent(category);
      res.json(content);
    } catch (error) {
      console.error("Promotional content generation failed:", error);
      res.status(500).json({ message: "Failed to generate promotional content" });
    }
  });

  app.post("/api/promotion/create-asset", async (req, res) => {
    try {
      const { category } = req.body;
      const asset = await promotionService.createPromotionalAsset(category);
      res.json(asset);
    } catch (error) {
      console.error("Promotional asset creation failed:", error);
      res.status(500).json({ message: "Failed to create promotional asset" });
    }
  });

  app.post("/api/promotion/schedule-posts", async (req, res) => {
    try {
      const { frequency } = req.body;
      const posts = await promotionService.scheduleOptimizedPosts(frequency);
      res.json({ scheduledPosts: posts });
    } catch (error) {
      console.error("Post scheduling failed:", error);
      res.status(500).json({ message: "Failed to schedule posts" });
    }
  });

  app.get("/api/promotion/scheduled-posts", async (req, res) => {
    try {
      const posts = promotionService.getScheduledPosts();
      res.json({ posts });
    } catch (error) {
      console.error("Failed to get scheduled posts:", error);
      res.status(500).json({ message: "Failed to get scheduled posts" });
    }
  });

  app.post("/api/promotion/viral-content", async (req, res) => {
    try {
      const content = await promotionService.generateViralContent();
      res.json(content);
    } catch (error) {
      console.error("Viral content generation failed:", error);
      res.status(500).json({ message: "Failed to generate viral content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
