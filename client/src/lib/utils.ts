import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getZodiacDateRange(sign: string): string {
  const ranges = {
    aries: "March 21 - April 19",
    taurus: "April 20 - May 20",
    gemini: "May 21 - June 20",
    cancer: "June 21 - July 22",
    leo: "July 23 - August 22",
    virgo: "August 23 - September 22",
    libra: "September 23 - October 22",
    scorpio: "October 23 - November 21",
    sagittarius: "November 22 - December 21",
    capricorn: "December 22 - January 19",
    aquarius: "January 20 - February 18",
    pisces: "February 19 - March 20"
  };
  
  return ranges[sign as keyof typeof ranges] || "";
}

export function getStarRating(rating: number): { filled: number; empty: number } {
  return {
    filled: Math.min(Math.max(rating, 0), 5),
    empty: 5 - Math.min(Math.max(rating, 0), 5)
  };
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
