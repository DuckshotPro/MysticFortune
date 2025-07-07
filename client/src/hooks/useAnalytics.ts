/**
 * Analytics Hook for Phase 3 - Smart Data Collection
 * Provides comprehensive user behavior tracking and engagement analytics
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AnalyticsConfig {
  sessionId: string;
  userId?: number;
  enableTracking: boolean;
}

interface UserInteraction {
  action: string;
  category?: string;
  metadata?: any;
  pageUrl?: string;
  duration?: number;
  deviceInfo?: any;
}

interface ContentEngagement {
  contentType: string;
  contentId: string;
  engagementType: string;
  engagementValue?: number;
  platform?: string;
  metadata?: any;
}

export function useAnalytics(config: AnalyticsConfig) {
  const queryClient = useQueryClient();
  const sessionStartTime = useRef<Date>(new Date());
  const pageStartTime = useRef<Date>(new Date());
  const interactionTimes = useRef<Map<string, Date>>(new Map());

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Get device information
  const getDeviceInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }, []);

  // Detect device type
  const getDeviceType = useCallback(() => {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  }, []);

  // Get browser name
  const getBrowserName = useCallback(() => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }, []);

  // Start session mutation
  const startSession = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/analytics/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (!response.ok) throw new Error('Failed to start session');
      return response.json();
    }
  });

  // End session mutation
  const endSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch('/api/analytics/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (!response.ok) throw new Error('Failed to end session');
      return response.json();
    }
  });

  // Track interaction mutation
  const trackInteraction = useMutation({
    mutationFn: async (interaction: UserInteraction) => {
      const response = await fetch('/api/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...interaction,
          userId: config.userId,
          sessionId: config.sessionId,
          timestamp: new Date(),
          pageUrl: window.location.pathname,
          deviceInfo: JSON.stringify(getDeviceInfo())
        })
      });
      if (!response.ok) throw new Error('Failed to track interaction');
      return response.json();
    }
  });

  // Track engagement mutation
  const trackEngagement = useMutation({
    mutationFn: async (engagement: ContentEngagement) => {
      const response = await fetch('/api/analytics/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...engagement,
          userId: config.userId,
          sessionId: config.sessionId,
          timestamp: new Date()
        })
      });
      if (!response.ok) throw new Error('Failed to track engagement');
      return response.json();
    }
  });

  // Initialize session on mount
  useEffect(() => {
    if (!config.enableTracking) return;

    const initSession = async () => {
      try {
        await startSession.mutateAsync({
          sessionId: config.sessionId,
          userId: config.userId,
          device: getDeviceType(),
          browser: getBrowserName(),
          referrer: document.referrer,
          startTime: sessionStartTime.current
        });
      } catch (error) {
        console.error('Failed to initialize analytics session:', error);
      }
    };

    initSession();

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession.mutate(config.sessionId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [config.enableTracking, config.sessionId]);

  // Track page views
  useEffect(() => {
    if (!config.enableTracking) return;

    trackInteraction.mutate({
      action: 'page_view',
      pageUrl: window.location.pathname,
      metadata: JSON.stringify({
        title: document.title,
        referrer: document.referrer,
        timestamp: new Date()
      })
    });

    pageStartTime.current = new Date();
  }, [window.location.pathname, config.enableTracking]);

  // Utility functions for components to use
  const trackFortuneGenerated = useCallback((category: string, fortuneId: string) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'fortune_generated',
      category,
      metadata: JSON.stringify({ fortuneId, timestamp: new Date() })
    });

    trackEngagement.mutate({
      contentType: 'fortune',
      contentId: fortuneId,
      engagementType: 'generate'
    });
  }, [config.enableTracking]);

  const trackHoroscopeViewed = useCallback((sign: string, horoscopeId: string, duration?: number) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'horoscope_viewed',
      category: sign,
      duration,
      metadata: JSON.stringify({ horoscopeId, sign, timestamp: new Date() })
    });

    trackEngagement.mutate({
      contentType: 'horoscope',
      contentId: horoscopeId,
      engagementType: 'view',
      engagementValue: duration
    });
  }, [config.enableTracking]);

  const trackTarotReading = useCallback((cardName: string, reading: any) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'tarot_read',
      category: 'tarot',
      metadata: JSON.stringify({ cardName, reading, timestamp: new Date() })
    });

    trackEngagement.mutate({
      contentType: 'tarot',
      contentId: cardName,
      engagementType: 'read'
    });
  }, [config.enableTracking]);

  const trackContentShared = useCallback((contentType: string, contentId: string, platform: string) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'content_shared',
      category: contentType,
      metadata: JSON.stringify({ contentId, platform, timestamp: new Date() })
    });

    trackEngagement.mutate({
      contentType,
      contentId,
      engagementType: 'share',
      platform
    });
  }, [config.enableTracking]);

  const trackContentSaved = useCallback((contentType: string, contentId: string) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'content_saved',
      category: contentType,
      metadata: JSON.stringify({ contentId, timestamp: new Date() })
    });

    trackEngagement.mutate({
      contentType,
      contentId,
      engagementType: 'save'
    });
  }, [config.enableTracking]);

  const trackTimeSpent = useCallback((contentType: string, contentId: string, startTime: Date) => {
    if (!config.enableTracking) return;
    
    const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    trackEngagement.mutate({
      contentType,
      contentId,
      engagementType: 'time_spent',
      engagementValue: duration
    });
  }, [config.enableTracking]);

  const trackConversion = useCallback((eventType: string, metadata?: any) => {
    if (!config.enableTracking) return;
    
    trackInteraction.mutate({
      action: 'conversion',
      category: eventType,
      metadata: JSON.stringify({ eventType, ...metadata, timestamp: new Date() })
    });
  }, [config.enableTracking]);

  const startTimeTracking = useCallback((actionId: string) => {
    interactionTimes.current.set(actionId, new Date());
  }, []);

  const endTimeTracking = useCallback((actionId: string, action: string, category?: string) => {
    const startTime = interactionTimes.current.get(actionId);
    if (startTime && config.enableTracking) {
      const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      trackInteraction.mutate({
        action,
        category,
        duration,
        metadata: JSON.stringify({ actionId, timestamp: new Date() })
      });
      interactionTimes.current.delete(actionId);
    }
  }, [config.enableTracking]);

  return {
    // Tracking functions
    trackFortuneGenerated,
    trackHoroscopeViewed,
    trackTarotReading,
    trackContentShared,
    trackContentSaved,
    trackTimeSpent,
    trackConversion,
    startTimeTracking,
    endTimeTracking,
    
    // Manual tracking
    trackInteraction: trackInteraction.mutate,
    trackEngagement: trackEngagement.mutate,
    
    // Session management
    endSession: () => endSession.mutate(config.sessionId),
    
    // Loading states
    isTracking: trackInteraction.isPending || trackEngagement.isPending
  };
}

// Hook for fetching analytics data
export function useAnalyticsData() {
  const getBehaviorMetrics = (timeframe: 'day' | 'week' | 'month' = 'week') => 
    useQuery({
      queryKey: ['analytics', 'behavior', timeframe],
      queryFn: async () => {
        const response = await fetch(`/api/analytics/behavior/${timeframe}`);
        if (!response.ok) throw new Error('Failed to fetch behavior metrics');
        return response.json();
      },
      refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
    });

  const getContentPerformance = (contentType?: string) =>
    useQuery({
      queryKey: ['analytics', 'content', contentType],
      queryFn: async () => {
        const url = contentType ? `/api/analytics/content/${contentType}` : '/api/analytics/content';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch content performance');
        return response.json();
      },
      refetchInterval: 5 * 60 * 1000
    });

  const getPlatformAnalytics = () =>
    useQuery({
      queryKey: ['analytics', 'platforms'],
      queryFn: async () => {
        const response = await fetch('/api/analytics/platforms');
        if (!response.ok) throw new Error('Failed to fetch platform analytics');
        return response.json();
      },
      refetchInterval: 5 * 60 * 1000
    });

  const getLiveMetrics = () =>
    useQuery({
      queryKey: ['analytics', 'live'],
      queryFn: async () => {
        const response = await fetch('/api/analytics/live');
        if (!response.ok) throw new Error('Failed to fetch live metrics');
        return response.json();
      },
      refetchInterval: 30 * 1000 // Refetch every 30 seconds for live data
    });

  return {
    getBehaviorMetrics,
    getContentPerformance,
    getPlatformAnalytics,
    getLiveMetrics
  };
}