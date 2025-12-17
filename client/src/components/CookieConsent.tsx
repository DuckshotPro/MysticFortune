import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CookieConsentProps {
    onAccept?: () => void;
    onDecline?: () => void;
}

/**
 * GDPR/CCPA Compliant Cookie Consent Banner
 * 
 * Displays on first visit and allows users to opt-in/out of:
 * - Analytics tracking
 * - AdSense personalized ads
 * - Data collection for aggregated sales
 */
export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage?.getItem('cookie_consent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage?.setItem('cookie_consent', 'accepted');
        localStorage?.setItem('analytics_consent', 'true');
        localStorage?.setItem('ads_consent', 'true');
        setVisible(false);
        onAccept?.();
    };

    const handleDecline = () => {
        localStorage?.setItem('cookie_consent', 'declined');
        localStorage?.setItem('analytics_consent', 'false');
        localStorage?.setItem('ads_consent', 'false');
        setVisible(false);
        onDecline?.();
    };

    const handleEssentialOnly = () => {
        localStorage?.setItem('cookie_consent', 'essential');
        localStorage?.setItem('analytics_consent', 'false');
        localStorage?.setItem('ads_consent', 'false');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
            <Card className="max-w-4xl mx-auto p-6 bg-primary/95 backdrop-blur-lg border-2 border-purple-500/50 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                            🍪 We Value Your Privacy
                        </h3>

                        {!showDetails ? (
                            <p className="text-gray-200 mb-4">
                                We use cookies and similar technologies to enhance your experience, provide personalized content,
                                serve relevant ads, and analyze our traffic. We also collect anonymized analytics data for
                                business intelligence purposes.
                            </p>
                        ) : (
                            <div className="text-gray-200 mb-4 space-y-2">
                                <p><strong>Essential Cookies:</strong> Required for basic site functionality (always enabled)</p>
                                <p><strong>Analytics:</strong> Help us understand how visitors use our site (Google Analytics, Plausible)</p>
                                <p><strong>Advertising:</strong> Enable personalized ads via Google AdSense</p>
                                <p><strong>Data Collection:</strong> We collect non-identifiable behavioral data (browsing patterns, content preferences, usage statistics) which may be aggregated and sold to third parties for market research. This data is completely anonymized and cannot be traced back to you.</p>
                                <p className="text-sm mt-2">
                                    You can change your preferences anytime in Settings. For more details, see our{' '}
                                    <a href="/privacy" className="text-purple-300 hover:text-purple-200 underline">Privacy Policy</a>
                                    {' '}and{' '}
                                    <a href="/terms" className="text-purple-300 hover:text-purple-200 underline">Terms of Service</a>.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleAccept}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Accept All
                            </Button>
                            <Button
                                onClick={handleEssentialOnly}
                                variant="outline"
                                className="border-purple-400 text-purple-100 hover:bg-purple-950"
                            >
                                Essential Only
                            </Button>
                            <Button
                                onClick={handleDecline}
                                variant="ghost"
                                className="text-gray-300 hover:text-white"
                            >
                                Decline All
                            </Button>
                            <Button
                                onClick={() => setShowDetails(!showDetails)}
                                variant="link"
                                className="text-purple-300 hover:text-purple-200"
                            >
                                {showDetails ? 'Hide' : 'Show'} Details
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={handleEssentialOnly}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white flex-shrink-0"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}

/**
 * Utility functions to check consent status
 */
export const hasAnalyticsConsent = (): boolean => {
    return localStorage?.getItem('analytics_consent') === 'true';
};

export const hasAdsConsent = (): boolean => {
    return localStorage?.getItem('ads_consent') === 'true';
};

export const hasCookieConsent = (): boolean => {
    return localStorage?.getItem('cookie_consent') !== null;
};

export const resetConsent = (): void => {
    localStorage?.removeItem('cookie_consent');
    localStorage?.removeItem('analytics_consent');
    localStorage?.removeItem('ads_consent');
    window.location.reload();
};
