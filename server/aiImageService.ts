import { FortuneCategoryType, UserProfile } from "@shared/schema";
import fs from 'fs';
import path from 'path';

interface HuggingFaceImageResponse {
  blob: () => Promise<Blob>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

interface HuggingFaceTextResponse {
  generated_text: string;
}

interface UserProfile {
  birthDate?: Date;
  preferences?: string[];
  readingHistory?: string[];
  favoriteCategories?: FortuneCategoryType[];
}

class AIImageService {
  private apiKey: string;
  private imageBaseUrl = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4";
  private textBaseUrl = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

  constructor() {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY environment variable is required");
    }
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
  }

  private async generateImage(prompt: string): Promise<Buffer> {
    try {
      const response = await fetch(this.imageBaseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true
          }
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.log("Hugging Face API unavailable, using fallback SVG generation");
    }

    // Fallback: Generate beautiful SVG artwork
    return this.generateFallbackSVG(prompt);
  }

  private generateFallbackSVG(prompt: string): Buffer {
    const colors = {
      love: ["#ff6b9d", "#c44569", "#f8b500", "#feca57"],
      career: ["#3742fa", "#2f3542", "#ff4757", "#ffa726"],
      general: ["#5f27cd", "#00d2d3", "#ff9ff3", "#54a0ff"]
    };

    const category = prompt.includes("love") ? "love" : 
                    prompt.includes("career") ? "career" : "general";
    const colorPalette = colors[category];

    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${colorPalette[0]};stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:${colorPalette[1]};stop-opacity:0.3"/>
          </radialGradient>
          <linearGradient id="figure" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colorPalette[2]};stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:${colorPalette[3]};stop-opacity:0.7"/>
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#bg)"/>
        <circle cx="256" cy="180" r="80" fill="url(#figure)" opacity="0.8"/>
        <path d="M176 260 Q256 280 336 260 Q336 360 256 380 Q176 360 176 260" fill="url(#figure)" opacity="0.6"/>
        <circle cx="220" cy="160" r="8" fill="${colorPalette[3]}"/>
        <circle cx="292" cy="160" r="8" fill="${colorPalette[3]}"/>
        <path d="M230 190 Q256 200 282 190" stroke="${colorPalette[3]}" stroke-width="3" fill="none"/>
        <g transform="translate(256,400)">
          ${Array.from({length: 12}, (_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x = Math.cos(angle) * 60;
            const y = Math.sin(angle) * 60;
            return `<circle cx="${x}" cy="${y}" r="3" fill="${colorPalette[i % 4]}" opacity="0.6"/>`;
          }).join('')}
        </g>
        <text x="256" y="480" text-anchor="middle" fill="${colorPalette[3]}" font-family="serif" font-size="16" opacity="0.8">
          Mystical AI Artwork
        </text>
      </svg>
    `;

    return Buffer.from(svg, 'utf-8');
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
        "ethereal goddess of love with flowing golden hair, surrounded by rose petals and soft pink light, mystical fantasy art, divine beauty",
        "enchanting fairy of romance with butterfly wings, holding a glowing heart crystal, magical forest setting, fantasy illustration",
        "celestial angel of love with silver wings, gentle smile, surrounded by floating hearts and stardust, heavenly atmosphere",
        "mystical venus goddess emerging from pearl shell, ocean waves, romantic sunset, classical beauty with magical aura"
      ],
      career: [
        "powerful sorceress with golden staff, flowing robes, casting success spells, magical library background, fantasy art",
        "elegant businesswoman with mystical aura, surrounded by floating coins and success symbols, professional fantasy portrait",
        "wise oracle with crystal ball showing visions of success, flowing mystical robes, ancient temple setting",
        "divine goddess of wisdom with owl companion, holding scrolls of knowledge, mystical golden light"
      ],
      general: [
        "mystical fortune teller with crystal ball, flowing cosmic robes, surrounded by tarot cards and candles, magical atmosphere",
        "ethereal cosmic goddess floating in starry space, flowing hair like nebula, celestial beauty, fantasy art",
        "enchanting witch with purple hair, casting magical spells, surrounded by glowing crystals and mystical symbols",
        "divine oracle priestess in ancient temple, holding mystical artifacts, soft magical lighting, fantasy portrait"
      ]
    };

    return basePrompts[category] || basePrompts.general;
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
      "mystical crystal ball with swirling cosmic energy, magical fortune telling setup, candles and tarot cards, atmospheric lighting",
      "beautiful tarot card spread on velvet cloth, crystals and candles around, mystical atmosphere, magical lighting",
      "enchanting fortune teller's room with crystal balls, ancient books, mystical artifacts, soft magical glow",
      "cosmic galaxy with constellation patterns forming mystical symbols, deep space, spiritual energy, divine light"
    ];

    const selectedPrompt = promotionalPrompts[Math.floor(Math.random() * promotionalPrompts.length)];
    const enhancedPrompt = `${selectedPrompt}, high quality, professional, mystical branding, magical atmosphere, premium quality`;

    const imageBuffer = await this.generateImage(enhancedPrompt);

    return {
      imageBuffer,
      prompt: enhancedPrompt
    };
  }
}

export const aiImageService = new AIImageService();