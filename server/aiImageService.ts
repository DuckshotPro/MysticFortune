import { FortuneCategoryType, UserProfile, InsertAiImageCache, AiImageCache, InsertUserImageView } from "@shared/schema";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from './db';
import { aiImageCache, userImageViews } from '@shared/schema';
import { eq, and, desc, lt, sql, not, inArray } from 'drizzle-orm';

// Custom AI image generation service - no external API dependencies

// UserProfile interface imported from schema

class AIImageService {
  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      path.join(process.cwd(), "client", "public", "generated-characters"),
      path.join(process.cwd(), "client", "public", "generated-assets")
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Generate MD5 hash for prompt caching
  private hashPrompt(prompt: string, characterId?: string, emotion?: string): string {
    const combined = `${prompt}-${characterId || ''}-${emotion || ''}`;
    return crypto.createHash('md5').update(combined).digest('hex');
  }

  // Check cache for existing image and avoid showing same image to user
  private async getCachedImage(promptHash: string, userId?: number, sessionId?: string): Promise<AiImageCache | null> {
    try {
      // First check if we have this exact prompt cached
      const [existingImage] = await db
        .select()
        .from(aiImageCache)
        .where(eq(aiImageCache.promptHash, promptHash))
        .limit(1);

      if (!existingImage) return null;

      // If user is provided, check if they've seen this image recently
      if (userId || sessionId) {
        const recentView = await db
          .select()
          .from(userImageViews)
          .where(
            and(
              eq(userImageViews.imageId, existingImage.id),
              userId ? eq(userImageViews.userId, userId) : sql`true`,
              sessionId ? eq(userImageViews.sessionId, sessionId) : sql`true`,
              // Only check views from last 24 hours for variety
              sql`${userImageViews.viewedAt} > NOW() - INTERVAL '24 hours'`
            )
          )
          .limit(1);

        // If user has seen this image recently, try to find an alternative
        if (recentView.length > 0) {
          const [alternativeImage] = await db
            .select()
            .from(aiImageCache)
            .where(
              and(
                existingImage.characterId ? eq(aiImageCache.characterId, existingImage.characterId) : sql`${aiImageCache.characterId} IS NULL`,
                existingImage.emotion ? eq(aiImageCache.emotion, existingImage.emotion) : sql`${aiImageCache.emotion} IS NULL`,
                not(eq(aiImageCache.id, existingImage.id)),
                // Make sure they haven't seen this alternative either
                not(inArray(aiImageCache.id, 
                  db.select({ id: userImageViews.imageId })
                    .from(userImageViews)
                    .where(
                      and(
                        userId ? eq(userImageViews.userId, userId) : sql`true`,
                        sessionId ? eq(userImageViews.sessionId, sessionId) : sql`true`,
                        sql`${userImageViews.viewedAt} > NOW() - INTERVAL '24 hours'`
                      )
                    )
                ))
              )
            )
            .orderBy(desc(aiImageCache.lastUsed))
            .limit(1);

          if (alternativeImage) {
            return alternativeImage;
          }
        }
      }

      return existingImage;
    } catch (error) {
      console.error('Error checking image cache:', error);
      return null;
    }
  }

  // Save image to cache
  private async saveToCache(
    promptHash: string, 
    imageUrl: string, 
    prompt: string,
    characterId?: string,
    emotion?: string,
    category?: string,
    fileSize?: number
  ): Promise<AiImageCache> {
    try {
      const cacheEntry: InsertAiImageCache = {
        promptHash,
        imageUrl,
        characterId,
        emotion,
        category,
        promptText: prompt,
        usageCount: 1,
        fileSize,
        generationCost: 0.02, // Approximate Hugging Face cost per image
      };

      const [saved] = await db
        .insert(aiImageCache)
        .values(cacheEntry)
        .returning();

      return saved;
    } catch (error) {
      console.error('Error saving to cache:', error);
      throw error;
    }
  }

  // Update cache usage
  private async updateCacheUsage(imageId: number): Promise<void> {
    try {
      await db
        .update(aiImageCache)
        .set({ 
          usageCount: sql`${aiImageCache.usageCount} + 1`,
          lastUsed: new Date()
        })
        .where(eq(aiImageCache.id, imageId));
    } catch (error) {
      console.error('Error updating cache usage:', error);
    }
  }

  // Track user image view
  private async trackImageView(
    imageId: number, 
    userId?: number, 
    sessionId?: string, 
    context?: string
  ): Promise<void> {
    try {
      if (!userId && !sessionId) return;

      const viewRecord: InsertUserImageView = {
        userId,
        imageId,
        sessionId,
        context,
      };

      await db.insert(userImageViews).values(viewRecord);
    } catch (error) {
      console.error('Error tracking image view:', error);
    }
  }

  private async generateImage(prompt: string): Promise<Buffer> {
    // Direct AI image generation using provocative visual style
    return this.generateSeductiveCharacterSVG(prompt);
  }

  private generateSeductiveCharacterSVG(prompt: string): Buffer {
    // Analyze prompt to determine character type and style
    const isMale = prompt.toLowerCase().includes('man') || prompt.toLowerCase().includes('male');
    const category = prompt.includes("love") ? "love" : 
                    prompt.includes("career") ? "career" : "general";
    
    // Enhanced color scheme matching your vision: warm terracotta, cool teal, deep purple, gold
    const colors = {
      deepPurple: "#2E0854",
      purpleGradient: ["#6A1B9A", "#4A148C", "#2E0854"],
      terracotta: ["#CD5C5C", "#D2691E", "#B8860B"],
      teal: ["#008B8B", "#20B2AA", "#48CCCC"],
      gold: ["#FFD700", "#FFA500", "#FF8C00"],
      skin: isMale ? ["#D2B48C", "#DEB887", "#F5DEB3"] : ["#FDBCB4", "#F4A460", "#DDA0DD"]
    };

    // Generate random variation for uniqueness
    const variations = [
      { pose: "front", lighting: "dramatic", expression: "seductive" },
      { pose: "side", lighting: "soft", expression: "mysterious" },
      { pose: "three-quarter", lighting: "intense", expression: "alluring" },
      { pose: "looking-up", lighting: "golden", expression: "enchanting" }
    ];
    
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const goldColor = colors.gold[Math.floor(Math.random() * colors.gold.length)];
    const skinColor = colors.skin[Math.floor(Math.random() * colors.skin.length)];
    const terracottaColor = colors.terracotta[Math.floor(Math.random() * colors.terracotta.length)];
    const tealColor = colors.teal[Math.floor(Math.random() * colors.teal.length)];

    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Background gradient -->
          <radialGradient id="bgGrad" cx="50%" cy="30%" r="80%">
            <stop offset="0%" style="stop-color:#6A1B9A;stop-opacity:1"/>
            <stop offset="50%" style="stop-color:#4A148C;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#2E0854;stop-opacity:1"/>
          </radialGradient>
          
          <!-- Dramatic lighting gradients -->
          <linearGradient id="lightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${terracottaColor};stop-opacity:0.8"/>
            <stop offset="50%" style="stop-color:${goldColor};stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:${tealColor};stop-opacity:0.4"/>
          </linearGradient>
          
          <!-- Skin gradient -->
          <radialGradient id="skinGrad" cx="40%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:${skinColor};stop-opacity:1"/>
            <stop offset="70%" style="stop-color:${terracottaColor};stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:${colors.deepPurple};stop-opacity:0.2"/>
          </radialGradient>
          
          <!-- Hair gradient -->
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2C1810;stop-opacity:1"/>
            <stop offset="50%" style="stop-color:${tealColor};stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:#1A0F08;stop-opacity:1"/>
          </linearGradient>
          
          <!-- Eye gradient -->
          <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${tealColor};stop-opacity:1"/>
            <stop offset="80%" style="stop-color:${goldColor};stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#000;stop-opacity:1"/>
          </radialGradient>
        </defs>
        
        <!-- Background -->
        <rect width="512" height="512" fill="url(#bgGrad)"/>
        
        <!-- Dramatic lighting overlay -->
        <ellipse cx="350" cy="150" rx="200" ry="300" fill="url(#lightGrad)" opacity="0.4"/>
        
        <!-- Character silhouette/body -->
        ${this.generateCharacterBody(isMale, skinColor, terracottaColor, tealColor, variation)}
        
        <!-- Hair -->
        ${this.generateSeductiveHair(isMale, variation)}
        
        <!-- Face -->
        ${this.generateSeductiveFace(isMale, skinColor, tealColor, goldColor, variation)}
        
        <!-- Mystical elements -->
        ${this.generateMysticalElements(goldColor, tealColor)}
        
        <!-- Header text with dramatic styling -->
        <text x="256" y="45" text-anchor="middle" font-family="serif" font-size="32" font-weight="bold" fill="${goldColor}" stroke="#2E0854" stroke-width="1">
          Mystic Fortune
        </text>
        <!-- Text shadow effect -->
        <text x="258" y="47" text-anchor="middle" font-family="serif" font-size="32" font-weight="bold" fill="#2E0854" opacity="0.4">
          Mystic Fortune
        </text>
        
        <!-- Zodiac/mystical symbols -->
        ${this.generateZodiacSymbols(goldColor)}
      </svg>
    `;

    return Buffer.from(svg, 'utf-8');
  }

  private generateCharacterBody(isMale: boolean, skinColor: string, terracottaColor: string, tealColor: string, variation: any): string {
    if (isMale) {
      return `
        <!-- Male torso with enhanced definition -->
        <path d="M190 280 Q256 260 322 280 Q340 380 256 420 Q172 380 190 280" fill="url(#skinGrad)" opacity="0.95"/>
        <!-- Muscular chest -->
        <ellipse cx="235" cy="310" rx="28" ry="22" fill="${terracottaColor}" opacity="0.4"/>
        <ellipse cx="277" cy="310" rx="28" ry="22" fill="${terracottaColor}" opacity="0.4"/>
        <!-- Defined abs -->
        <ellipse cx="256" cy="340" rx="12" ry="8" fill="${terracottaColor}" opacity="0.3"/>
        <ellipse cx="256" cy="355" rx="12" ry="8" fill="${terracottaColor}" opacity="0.3"/>
        <ellipse cx="256" cy="370" rx="12" ry="8" fill="${terracottaColor}" opacity="0.3"/>
        <!-- Shoulder definition -->
        <ellipse cx="200" cy="285" rx="15" ry="25" fill="${tealColor}" opacity="0.3"/>
        <ellipse cx="312" cy="285" rx="15" ry="25" fill="${tealColor}" opacity="0.3"/>
      `;
    } else {
      return `
        <!-- Female torso with enhanced curves -->
        <path d="M200 280 Q256 265 312 280 Q325 380 256 410 Q187 380 200 280" fill="url(#skinGrad)" opacity="0.95"/>
        <!-- Enhanced bust -->
        <ellipse cx="230" cy="305" rx="32" ry="28" fill="${terracottaColor}" opacity="0.35"/>
        <ellipse cx="282" cy="305" rx="32" ry="28" fill="${terracottaColor}" opacity="0.35"/>
        <!-- Cleavage shadow -->
        <path d="M245 290 Q256 300 267 290" stroke="${terracottaColor}" stroke-width="2" fill="none" opacity="0.4"/>
        <!-- Waist curve -->
        <ellipse cx="256" cy="350" rx="40" ry="18" fill="${skinColor}" opacity="0.9"/>
        <!-- Hip curve -->
        <ellipse cx="256" cy="385" rx="55" ry="25" fill="${skinColor}" opacity="0.8"/>
        <!-- Sensual highlighting -->
        <ellipse cx="215" cy="320" rx="8" ry="20" fill="${tealColor}" opacity="0.2"/>
        <ellipse cx="297" cy="320" rx="8" ry="20" fill="${tealColor}" opacity="0.2"/>
      `;
    }
  }

  private generateSeductiveHair(isMale: boolean, variation: any): string {
    if (isMale) {
      return `
        <!-- Male styled hair with dramatic flair -->
        <path d="M165 110 Q256 65 347 110 Q360 150 340 175 Q320 190 300 185 Q280 180 256 170 Q232 180 212 185 Q192 190 172 175 Q152 150 165 110" fill="url(#hairGrad)" opacity="0.92"/>
        <!-- Hair volume and texture -->
        <path d="M180 125 Q220 115 256 120 Q292 115 332 125" stroke="#1A0F08" stroke-width="2.5" fill="none" opacity="0.7"/>
        <path d="M190 140 Q230 130 256 135 Q282 130 322 140" stroke="#2A1F18" stroke-width="1.5" fill="none" opacity="0.5"/>
        <!-- Side sweep -->
        <path d="M175 130 Q200 125 225 130 Q240 135 255 140" stroke="#0A0A0A" stroke-width="1" fill="none" opacity="0.6"/>
      `;
    } else {
      return `
        <!-- Female voluminous flowing hair -->
        <path d="M150 110 Q256 55 362 110 Q385 180 370 240 Q355 280 335 310 Q315 330 295 340 Q275 320 256 300 Q237 320 217 340 Q197 330 177 310 Q157 280 142 240 Q127 180 150 110" fill="url(#hairGrad)" opacity="0.94"/>
        <!-- Hair layers and volume -->
        <path d="M160 130 Q200 120 240 125 Q280 120 320 130 Q340 140 360 155" stroke="#1A0F08" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M170 160 Q210 150 250 155 Q290 150 330 160 Q350 170 365 185" stroke="#2A1F18" stroke-width="1.8" fill="none" opacity="0.5"/>
        <path d="M175 190 Q215 180 255 185 Q295 180 335 190 Q355 200 370 215" stroke="#0A0A0A" stroke-width="1.5" fill="none" opacity="0.4"/>
        <!-- Flowing strands -->
        <path d="M180 220 Q200 210 220 220 Q240 210 260 220 Q280 210 300 220 Q320 210 340 220" stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.35"/>
        <path d="M185 250 Q205 240 225 250 Q245 240 265 250 Q285 240 305 250 Q325 240 345 250" stroke="#1A0F08" stroke-width="1" fill="none" opacity="0.3"/>
        <!-- Hair highlights -->
        <path d="M200 140 Q230 135 260 140" stroke="#4A3F38" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M190 170 Q220 165 250 170" stroke="#4A3F38" stroke-width="1" fill="none" opacity="0.3"/>
      `;
    }
  }

  private generateSeductiveFace(isMale: boolean, skinColor: string, tealColor: string, goldColor: string, variation: any): string {
    const eyeY = isMale ? 160 : 155;
    const lipY = isMale ? 195 : 190;
    
    return `
      <!-- Face shape -->
      <ellipse cx="256" cy="170" rx="65" ry="75" fill="url(#skinGrad)" opacity="0.98"/>
      
      <!-- Enhanced eyes with sultry look -->
      <ellipse cx="235" cy="${eyeY}" rx="15" ry="10" fill="white" opacity="0.9"/>
      <ellipse cx="277" cy="${eyeY}" rx="15" ry="10" fill="white" opacity="0.9"/>
      <ellipse cx="235" cy="${eyeY}" rx="12" ry="8" fill="${tealColor}" opacity="0.9"/>
      <ellipse cx="277" cy="${eyeY}" rx="12" ry="8" fill="${tealColor}" opacity="0.9"/>
      <circle cx="235" cy="${eyeY}" r="7" fill="url(#eyeGrad)"/>
      <circle cx="277" cy="${eyeY}" r="7" fill="url(#eyeGrad)"/>
      <circle cx="237" cy="${eyeY - 2}" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="279" cy="${eyeY - 2}" r="2.5" fill="white" opacity="0.9"/>
      
      <!-- Dramatic eyelashes -->
      <path d="M220 ${eyeY - 8} Q230 ${eyeY - 12} 240 ${eyeY - 10} Q245 ${eyeY - 11} 250 ${eyeY - 8}" stroke="#000" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M262 ${eyeY - 8} Q267 ${eyeY - 11} 272 ${eyeY - 10} Q282 ${eyeY - 12} 292 ${eyeY - 8}" stroke="#000" stroke-width="2" fill="none" opacity="0.8"/>
      
      <!-- Seductive eyebrows -->
      <path d="M218 ${eyeY - 18} Q235 ${eyeY - 22} 252 ${eyeY - 18}" stroke="#2A2A2A" stroke-width="3" fill="none" opacity="0.9"/>
      <path d="M260 ${eyeY - 18} Q277 ${eyeY - 22} 294 ${eyeY - 18}" stroke="#2A2A2A" stroke-width="3" fill="none" opacity="0.9"/>
      
      <!-- Eye makeup/shadow -->
      <ellipse cx="235" cy="${eyeY - 5}" rx="18" ry="8" fill="${goldColor}" opacity="0.3"/>
      <ellipse cx="277" cy="${eyeY - 5}" rx="18" ry="8" fill="${goldColor}" opacity="0.3"/>
      
      <!-- Refined nose -->
      <ellipse cx="256" cy="178" rx="4" ry="8" fill="${skinColor}" opacity="0.6"/>
      <path d="M252 182 Q256 185 260 182" stroke="${skinColor}" stroke-width="1" fill="none" opacity="0.4"/>
      
      <!-- Full, sensual lips -->
      <ellipse cx="256" cy="${lipY}" rx="18" ry="7" fill="#D85570" opacity="0.9"/>
      <ellipse cx="256" cy="${lipY - 1}" rx="16" ry="5" fill="#E86580" opacity="0.8"/>
      <path d="M238 ${lipY} Q256 ${lipY + 5} 274 ${lipY}" stroke="#C44560" stroke-width="1.5" fill="none" opacity="0.7"/>
      <ellipse cx="256" cy="${lipY - 2}" rx="8" ry="2" fill="white" opacity="0.4"/>
      
      <!-- Enhanced cheekbones -->
      <ellipse cx="215" cy="175" rx="12" ry="20" fill="${goldColor}" opacity="0.25"/>
      <ellipse cx="297" cy="175" rx="12" ry="20" fill="${goldColor}" opacity="0.25"/>
      
      <!-- Jawline definition -->
      <path d="M200 200 Q256 215 312 200" stroke="${goldColor}" stroke-width="1" fill="none" opacity="0.3"/>
    `;
  }

  private generateMysticalElements(goldColor: string, tealColor: string): string {
    return `
      <!-- Dramatic mystical orbs -->
      <circle cx="120" cy="380" r="12" fill="${goldColor}" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="12;15;12" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="392" cy="380" r="12" fill="${tealColor}" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="12;15;12" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Energy swirls -->
      <path d="M100 360 Q130 340 160 360 Q190 380 220 360" stroke="${goldColor}" stroke-width="2" fill="none" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite"/>
      </path>
      <path d="M412 360 Q382 340 352 360 Q322 380 292 360" stroke="${tealColor}" stroke-width="2" fill="none" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.5s" repeatCount="indefinite"/>
      </path>
      
      <!-- Floating energy particles -->
      <g opacity="0.6">
        <circle cx="160" cy="320" r="3" fill="${goldColor}">
          <animate attributeName="cy" values="320;300;320" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="352" cy="340" r="3" fill="${tealColor}">
          <animate attributeName="cy" values="340;320;340" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="180" cy="450" r="2.5" fill="${goldColor}">
          <animate attributeName="cy" values="450;430;450" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="332" cy="470" r="2.5" fill="${tealColor}">
          <animate attributeName="cy" values="470;450;470" dur="4.5s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      <!-- Dramatic corner ornaments -->
      <g opacity="0.6" fill="${goldColor}">
        <path d="M40 40 Q60 50 80 40 Q60 60 40 80 Q50 60 40 40"/>
        <path d="M472 40 Q452 50 432 40 Q452 60 472 80 Q462 60 472 40"/>
        <path d="M40 472 Q60 462 80 472 Q60 452 40 432 Q50 452 40 472"/>
        <path d="M472 472 Q452 462 432 472 Q452 452 472 432 Q462 452 472 472"/>
      </g>
    `;
  }

  private generateZodiacSymbols(goldColor: string): string {
    const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const positions = [
      { x: 80, y: 150 }, { x: 432, y: 150 }, { x: 80, y: 300 }, { x: 432, y: 300 }
    ];
    
    return positions.map((pos, i) => `
      <circle cx="${pos.x}" cy="${pos.y}" r="20" fill="${goldColor}" opacity="0.3"/>
      <text x="${pos.x}" y="${pos.y + 6}" text-anchor="middle" font-family="serif" font-size="20" fill="${goldColor}" opacity="0.8">
        ${symbols[i * 3 % symbols.length]}
      </text>
    `).join('');
  }

  private generateFallbackSVG(prompt: string): Buffer {
    // Use the new seductive character generation as fallback too
    return this.generateSeductiveCharacterSVG(prompt);
  }

  private async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.textBaseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 150,
            temperature: 0.8,
            do_sample: true,
            return_full_text: false
          },
          options: {
            wait_for_model: true
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.generated_text || result[0]?.generated_text || "";
      }
    } catch (error) {
      console.log("Hugging Face text API unavailable, using fallback generation");
    }

    // Fallback: Generate contextual content based on prompt
    return this.generateFallbackText(prompt);
  }

  private generateFallbackText(prompt: string): string {
    const templates = {
      fortune: [
        "The cosmic energies align in your favor, revealing new opportunities on the horizon.",
        "Your inner wisdom guides you toward a path of transformation and growth.",
        "The universe whispers secrets of change, encouraging you to embrace new beginnings.",
        "Ancient forces stir around you, bringing clarity to long-standing questions.",
        "Your spiritual journey takes a meaningful turn, opening doors to deeper understanding."
      ],
      tarot: [
        "This card speaks of transformation and the courage to face new challenges.",
        "The energy here suggests a time of reflection and inner growth.",
        "This symbol represents balance and the need to trust your intuition.",
        "The message reveals hidden strengths and untapped potential within you.",
        "This card illuminates the path forward with wisdom and clarity."
      ]
    };

    const type = prompt.toLowerCase().includes('tarot') ? 'tarot' : 'fortune';
    const options = templates[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  async generatePersonalizedFortune(category: FortuneCategoryType, userProfile: UserProfile): Promise<{
    content: string;
    title: string;
    personalization: string;
  }> {
    const zodiacSign = this.getZodiacSign(userProfile.birthDate);
    const preferences = userProfile.preferences?.join(", ") || "general guidance";

    const personalizedPrompt = `Generate a personalized ${category} fortune for someone born under ${zodiacSign} who values ${preferences}. Focus on spiritual insights and positive guidance.`;

    const aiContent = await this.generateText(personalizedPrompt);

    // Enhance with personalized elements
    const personalizedContent = this.enhanceWithPersonalization(aiContent, userProfile, category);

    return {
      content: personalizedContent.content,
      title: personalizedContent.title,
      personalization: personalizedContent.personalization
    };
  }

  private getZodiacSign(birthDate?: Date): string {
    if (!birthDate) return "the cosmos";

    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    const signs = [
      { name: "Capricorn", start: [12, 22], end: [1, 19] },
      { name: "Aquarius", start: [1, 20], end: [2, 18] },
      { name: "Pisces", start: [2, 19], end: [3, 20] },
      { name: "Aries", start: [3, 21], end: [4, 19] },
      { name: "Taurus", start: [4, 20], end: [5, 20] },
      { name: "Gemini", start: [5, 21], end: [6, 20] },
      { name: "Cancer", start: [6, 21], end: [7, 22] },
      { name: "Leo", start: [7, 23], end: [8, 22] },
      { name: "Virgo", start: [8, 23], end: [9, 22] },
      { name: "Libra", start: [9, 23], end: [10, 22] },
      { name: "Scorpio", start: [10, 23], end: [11, 21] },
      { name: "Sagittarius", start: [11, 22], end: [12, 21] }
    ];

    for (const sign of signs) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }

    return "the cosmos";
  }

  private enhanceWithPersonalization(aiContent: string, userProfile: UserProfile, category: FortuneCategoryType): {
    content: string;
    title: string;
    personalization: string;
  } {
    const zodiacSign = this.getZodiacSign(userProfile.birthDate);
    const categoryTitles = {
      love: "💕 Your Love Journey",
      career: "🌟 Your Professional Path",
      general: "✨ Your Life's Direction"
    };

    const personalizationNote = `Personalized for ${zodiacSign} energy`;

    // If AI content is too short, enhance with fallback
    let enhancedContent = aiContent;
    if (aiContent.length < 50) {
      const fallbackEnhancement = this.generateFallbackText(`${category} fortune for ${zodiacSign}`);
      enhancedContent = `${aiContent} ${fallbackEnhancement}`;
    }

    return {
      content: enhancedContent,
      title: categoryTitles[category],
      personalization: personalizationNote
    };
  }

  async generateTarotInterpretation(cardName: string, userQuestion: string, userProfile: UserProfile): Promise<{
    interpretation: string;
    personalMessage: string;
    actionAdvice: string;
  }> {
    const zodiacSign = this.getZodiacSign(userProfile.birthDate);
    const prompt = `Interpret the tarot card "${cardName}" for someone born under ${zodiacSign} asking "${userQuestion}". Provide spiritual guidance and actionable advice.`;

    const aiInterpretation = await this.generateText(prompt);

    return {
      interpretation: aiInterpretation || `The ${cardName} card speaks to your current situation with profound wisdom.`,
      personalMessage: `For ${zodiacSign} energy, this card represents a time of spiritual growth and transformation.`,
      actionAdvice: "Trust your intuition and take deliberate steps toward your goals. The universe supports your journey."
    };
  }

  private getMysticalPrompts(category: FortuneCategoryType): string[] {
    const basePrompts = {
      love: [
        "A barely-there figure draped in whisper-thin silk, standing amidst a soft haze of morning light. Slender, almost translucent form sculpted from mist and memory. Fine threads of silver and pale gold shimmer across fabric like dew on gossamer. Expression calm, wistful, eyes half-lowered in gentle reverie. Color palette: ivory, blush, pale lilac, moon-glow white. No sharp edges, breath of elegance suspended in time. Fantasy portrait inspired by silent dream.",
        "Ethereal love oracle with gossamer-like qualities, draped in whisper-thin silk that catches morning light. Translucent form with silver and pale gold threads shimmering like dew. Gentle, wistful expression with eyes in peaceful reverie. Ivory, blush, pale lilac palette with moon-glow white accents. Soft, elegant, suspended in dreamlike silence.",
        "Mystical figure of love guidance, barely visible through morning mist, wearing translucent silk that flows like liquid moonlight. Delicate features with gentle, knowing smile. Silver threads catch light like spider silk with dew. Color harmony of ivory, soft blush, pale lilac. No drama, just pure ethereal elegance in timeless moment.",
        "Love priestess emerging from dawn light, form sculpted from gossamer and memory. Whisper-thin silk drapes catch silver and gold threads that shimmer with ethereal beauty. Calm, serene expression with half-closed eyes in meditation. Palette of ivory, blush, pale lilac, moon-glow white. Fantasy portrait of quiet elegance."
      ],
      career: [
        "Ethereal guide figure with translucent, gossamer-like form draped in whisper-thin silk. Standing in soft morning light with silver and pale gold threads shimmering across fabric. Wise, contemplative expression with gentle confidence. Color palette of ivory, blush, pale lilac, moon-glow white. No sharp edges, breath of elegant wisdom suspended in time. Silent dream aesthetic.",
        "Career oracle with barely-there presence, sculpted from mist and memory. Whisper-thin silk catches morning light with fine silver threads like dew on gossamer. Calm, knowing expression with eyes half-lowered in gentle wisdom. Soft palette: ivory, blush, pale lilac, moon-glow white. Timeless elegance without drama.",
        "Mystical career advisor emerging from dawn mist, translucent form draped in flowing silk that shimmers with silver and gold threads. Serene, wise expression with gentle smile. Delicate features catching soft morning light. Color harmony of ivory, soft blush, pale lilac. Fantasy portrait of quiet authority and grace.",
        "Success guide with ethereal qualities, barely visible through morning haze. Gossamer silk drapes with silver threads that catch light like spider webs with dew. Peaceful, contemplative expression with inner wisdom shining through gentle eyes. Palette of ivory, blush, pale lilac, moon-glow white. Breath of elegance in timeless moment."
      ],
      general: [
        "A barely-there fortune teller figure draped in whisper-thin silk, standing amidst soft haze of morning light. Slender form almost translucent, sculpted from mist and memory. Fine silver and pale gold threads shimmer across gossamer fabric. Calm, wistful expression with eyes half-lowered in gentle reverie. Color palette: ivory, blush, pale lilac, moon-glow white. No sharp edges, no drama, just breath of elegance suspended in time. Fantasy portrait inspired by silent dream.",
        "Ethereal mystic with gossamer-like presence, draped in translucent silk that catches morning light. Silver threads shimmer like dew across whisper-thin fabric. Gentle, serene expression with peaceful eyes in quiet meditation. Soft color harmony of ivory, blush, pale lilac, moon-glow white. Timeless elegance without drama or sharp edges.",
        "Mystical oracle emerging from dawn mist, barely visible form sculpted from gossamer and memory. Whisper-thin silk flows with silver and gold threads that catch light ethereally. Calm, knowing expression with gentle wisdom. Delicate features in soft morning light. Palette of ivory, soft blush, pale lilac. Fantasy portrait of quiet mystical grace.",
        "Fortune guide with translucent, ethereal form draped in flowing silk that shimmers with silver threads like spider webs with morning dew. Peaceful, contemplative expression with half-closed eyes in gentle reverie. Color palette of ivory, blush, pale lilac, moon-glow white. No sharp edges, just pure elegance suspended in dreamlike silence."
      ]
    };

    return basePrompts[category] || basePrompts.general;
  }

  async generateCharacterImage(prompt: string, characterId: string, emotion: string, userId?: number, sessionId?: string): Promise<{
    imageBuffer: Buffer;
    imageUrl: string;
    characterId: string;
    emotion: string;
    cached: boolean;
    costSaved: number;
  }> {
    try {
      const promptHash = this.hashPrompt(prompt, characterId, emotion);
      
      // Check cache first for cost optimization
      const cachedImage = await this.getCachedImage(promptHash, userId, sessionId);
      
      if (cachedImage) {
        // Update usage tracking
        await this.updateCacheUsage(cachedImage.id);
        await this.trackImageView(cachedImage.id, userId, sessionId, 'character_generation');
        
        const fullPath = path.join(process.cwd(), "client", "public", cachedImage.imageUrl);
        let imageBuffer: Buffer;
        
        if (fs.existsSync(fullPath)) {
          imageBuffer = fs.readFileSync(fullPath);
        } else {
          // File missing, regenerate but keep cache entry
          imageBuffer = await this.generateImage(prompt);
          const filename = cachedImage.imageUrl.split('/').pop() || `${characterId}-${emotion}-${Date.now()}.png`;
          const filepath = path.join(process.cwd(), "client", "public", "generated-characters", filename);
          fs.writeFileSync(filepath, imageBuffer);
        }
        
        return {
          imageBuffer,
          imageUrl: cachedImage.imageUrl,
          characterId,
          emotion,
          cached: true,
          costSaved: 0.02, // $0.02 saved per reused image
        };
      }
      
      // Generate new image
      const imageBuffer = await this.generateImage(prompt);
      
      // Check if it's SVG content and encode properly
      const isSVG = imageBuffer.toString().includes('<svg');
      let imageUrl: string;
      
      if (isSVG) {
        // For SVG, use proper data URL encoding
        const base64Svg = imageBuffer.toString('base64');
        imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
      } else {
        // Save image to public directory for serving
        const assetsDir = path.join(process.cwd(), "client", "public", "generated-characters");
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        const timestamp = Date.now();
        const filename = `${characterId}-${emotion}-${timestamp}.png`;
        const filepath = path.join(assetsDir, filename);
        
        fs.writeFileSync(filepath, imageBuffer);
        imageUrl = `/generated-characters/${filename}`;
      }
      
      // Cache the new image for future use
      const savedCache = await this.saveToCache(
        promptHash,
        imageUrl,
        prompt,
        characterId,
        emotion,
        'character',
        imageBuffer.length
      );
      
      // Track the initial view
      await this.trackImageView(savedCache.id, userId, sessionId, 'character_generation');
      
      return {
        imageBuffer,
        imageUrl,
        characterId,
        emotion,
        cached: false,
        costSaved: 0,
      };
    } catch (error) {
      console.error("Error generating character image:", error);
      
      // Generate fallback SVG as backup
      const fallbackSVG = this.generateFallbackSVG(prompt);
      const filename = `fallback-${characterId}-${emotion}-${Date.now()}.svg`;
      const filepath = path.join(process.cwd(), "client", "public", "generated-characters", filename);
      
      fs.writeFileSync(filepath, fallbackSVG);
      
      return {
        imageBuffer: fallbackSVG,
        imageUrl: `/generated-characters/${filename}`,
        characterId,
        emotion,
        cached: false,
        costSaved: 0,
      };
    }
  }

  async generateMysticalArtwork(category: FortuneCategoryType): Promise<{
    imageBuffer: Buffer;
    prompt: string;
    category: FortuneCategoryType;
  }> {
    const prompts = this.getMysticalPrompts(category);
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Add quality enhancers
    const enhancedPrompt = `${selectedPrompt}, high quality, detailed, beautiful, artistic, professional photography, soft lighting, elegant pose`;

    const imageBuffer = await this.generateImage(enhancedPrompt);

    return {
      imageBuffer,
      prompt: enhancedPrompt,
      category
    };
  }

  async generatePromotionalArtwork(): Promise<{
    imageBuffer: Buffer;
    prompt: string;
  }> {
    const promotionalPrompts = [
      "seductive mystical fortune teller with piercing gaze, dramatic terracotta and teal lighting, deep purple background, gold Mystic Fortune header, sultry pose, borderline NSFW appeal",
      "alluring tarot reader with hypnotic beauty, flowing hair, intense dramatic shadows, warm golden glow, mystical symbols, sensual expression, high contrast lighting",
      "captivating oracle with mesmerizing eyes, eerie atmospheric lighting, terracotta skin tones, cool teal accents, deep purple void background, golden ornamental details",
      "enchanting cosmic goddess with voluptuous curves, vibrant color palette, retro art style, complex mystical ornamentation, dramatic pose, borderline safe-for-work sex appeal",
      "mysterious fortune teller with seductive smile, candlelight ambiance, flowing robes, enhanced feminine features, golden mystical aura, deep purple mystical background",
      "bewitching mystic with alluring gaze, dramatic chiaroscuro lighting, warm terracotta skin, cool teal highlights, ornate golden jewelry, provocative but tasteful pose"
    ];

    const selectedPrompt = promotionalPrompts[Math.floor(Math.random() * promotionalPrompts.length)];
    const enhancedPrompt = `${selectedPrompt}, high quality, professional mystical branding, maximum viral appeal`;

    const imageBuffer = await this.generateImage(enhancedPrompt);

    return {
      imageBuffer,
      prompt: enhancedPrompt
    };
  }
}

export const aiImageService = new AIImageService();