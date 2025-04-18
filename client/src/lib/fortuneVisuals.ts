/**
 * This module provides visual backgrounds and snippets for different fortune types
 * to enhance shareability and user engagement
 */

import { FortuneCategoryType } from "@shared/schema";

// Generate SVG backgrounds for different fortune types
export const generateFortuneBackground = (category: FortuneCategoryType, title: string): string => {
  // Color schemes based on fortune category
  const colorSchemes = {
    love: {
      primary: "#E91E63",
      secondary: "#9C27B0",
      accent: "#FF9CAE",
      symbol: "❤️"
    },
    career: {
      primary: "#3F51B5", 
      secondary: "#1A237E",
      accent: "#8C9EFF",
      symbol: "💼"
    },
    general: {
      primary: "#9C27B0",
      secondary: "#4A148C",
      accent: "#D1C4E9",
      symbol: "✨"
    }
  };
  
  const scheme = colorSchemes[category];
  
  // Create a data URL with SVG
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${scheme.primary}" />
          <stop offset="100%" stop-color="${scheme.secondary}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
          <feOffset dx="0" dy="0" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect width="1200" height="630" fill="url(#bg)" />
      
      <circle cx="1000" cy="100" r="80" fill="${scheme.accent}" opacity="0.3" />
      <circle cx="200" cy="500" r="120" fill="${scheme.accent}" opacity="0.2" />
      
      <text x="600" y="180" font-family="Cinzel, serif" font-size="50" fill="white" text-anchor="middle" filter="url(#shadow)">
        Mystic Fortune
      </text>
      
      <text x="600" y="260" font-family="Cinzel, serif" font-size="36" fill="${scheme.accent}" text-anchor="middle">
        ${title}
      </text>
      
      <text x="600" y="320" font-family="serif" font-size="150" fill="white" text-anchor="middle" opacity="0.2">
        ${scheme.symbol}
      </text>
      
      <text x="600" y="530" font-family="Montserrat, sans-serif" font-size="24" fill="white" text-anchor="middle">
        Discover your cosmic destiny at
      </text>
      
      <text x="600" y="570" font-family="Montserrat, sans-serif" font-size="28" fill="${scheme.accent}" text-anchor="middle" font-weight="bold">
        mysticfortune.app
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Engaging snippets for different types of fortunes
export const generateFortuneSnippet = (content: string, category: FortuneCategoryType): string => {
  // Limit content to a reasonable length for sharing
  const trimmedContent = content.length > 100 ? content.substring(0, 100) + "..." : content;
  
  // Engaging intros based on fortune category
  const intros = {
    love: [
      "❤️ The stars have revealed my love fortune: ",
      "💫 My cosmic love reading just revealed: ",
      "✨ My mystic love prediction says: "
    ],
    career: [
      "💼 Just received this career guidance from the cosmos: ",
      "⚡ My professional fortune has been revealed: ",
      "🌟 My career path according to the stars: "
    ],
    general: [
      "✨ The universe just sent me this message: ",
      "🔮 My mystical fortune for today: ",
      "🌌 The cosmic forces have spoken: "
    ]
  };
  
  // Choose a random intro for variety
  const randomIntro = intros[category][Math.floor(Math.random() * intros[category].length)];
  
  // Add tracking UTM parameters for different platforms
  const trackingUrl = "mysticfortune.app/?utm_source={platform}&utm_medium=share&utm_campaign=fortune";
  
  return `${randomIntro}${trimmedContent}\n\nReveal your own fortune at ${trackingUrl}`;
};

// Generate call-to-action text for different platforms
export const generateCallToAction = (platform: string): string => {
  const ctas = {
    facebook: "Discover your own cosmic destiny!",
    twitter: "What does the universe have in store for you? Find out now!",
    snapchat: "Swipe up to reveal your mystical fortune!",
    whatsapp: "Click to uncover your own spiritual guidance ✨",
    telegram: "Tap to see what the stars have in store for you!",
    pinterest: "Save this mystical wisdom and find your own fortune!",
    copy: "Share this mystical insight with friends who need guidance!"
  };
  
  return ctas[platform as keyof typeof ctas] || ctas.copy;
};