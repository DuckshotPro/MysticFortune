// Simple utility to manage premium status
// In a real app, this would check authentication and subscription status from a database

// For demo purposes, we'll use localStorage to simulate premium status
// In a production app, this would be tied to user authentication and verified on the server

/**
 * Check if the user has premium access
 */
export function hasPremiumAccess(): boolean {
  // For demo purposes, check localStorage
  return localStorage.getItem('mysticFortune_premiumStatus') === 'active';
}

/**
 * Set premium status (for demo purposes)
 */
export function setPremiumStatus(isActive: boolean): void {
  if (isActive) {
    localStorage.setItem('mysticFortune_premiumStatus', 'active');
  } else {
    localStorage.removeItem('mysticFortune_premiumStatus');
  }
}

/**
 * Checks if a given feature requires premium
 * @param featureId Identifier for the feature
 */
export function isPremiumFeature(featureId: string): boolean {
  const premiumFeatures = [
    'expert-analysis',
    'relationship-compatibility',
    'year-forecast',
    'personalized-readings',
    'advanced-horoscope',
    'ad-free'
  ];
  
  return premiumFeatures.includes(featureId);
}

/**
 * Removes ads if user has premium
 */
export function shouldShowAds(): boolean {
  return !hasPremiumAccess();
}