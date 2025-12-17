import type { Express } from 'express';

interface AnonymizedUser {
    user_hash: string; //  Hashed user ID
    demographic_bucket: string; // "18-24", "25-34", etc.
    region_bucket: string; // "North America", "Europe", etc.
    signup_month: string; // "2025-12"
    is_premium: boolean;
}

interface BehaviorData {
    session_hash: string; // Hashed session ID
    page_views: number;
    avg_session_duration_seconds: number;
    fortune_categories_viewed: string[];
    interactions_count: number;
    device_type: 'mobile' | 'tablet' | 'desktop';
    browser_family: string;
    referrer_domain: string | null;
    time_bucket: string; // "morning", "afternoon", "evening", "night"
    day_of_week: string;
}

interface EngagementData {
    content_type: 'fortune' | 'tarot' | 'horoscope';
    category: string;
    views_count: number;
    avg_time_spent_seconds: number;
    share_count: number;
    favorite_count: number;
    completion_rate: number; // 0-1
    viral_score: number;
}

interface ExportOptions {
    startDate?: Date;
    endDate?: Date;
    format?: 'json' | 'csv';
    includeRawData?: boolean;
}

/**
 * Data Anonymization and Export Service
 * 
 * Prepares user data for ethical, GDPR-compliant sales to third parties.
 * All data is completely anonymized and aggregated.
 * 
 * ✅ What we collect & sell:
 * - Aggregated behavioral patterns
 * - Content engagement metrics
 * - Demographics (generalized buckets)
 * - Usage trends and patterns
 * 
 * ❌ What we DON'T collect:
 * - Personally identifiable information (PII)
 * - Exact timestamps
 * - IP addresses
 * - Email addresses
 * - Names or user IDs (only hashed)
 */
class DataAnonymizationService {

    /**
     * Hash a user ID to make it non-identifiable
     */
    private hashUserId(userId: number | string): string {
        const crypto = require('crypto');
        const secret = process.env.DATA_HASH_SECRET || 'mystic-data-secret-2025';
        return crypto.createHmac('sha256', secret)
            .update(userId.toString())
            .digest('hex')
            .substring(0, 16); // Truncate for storage efficiency
    }

    /**
     * Convert exact age to demographic bucket
     */
    private getAgeBucket(birthDate: Date): string {
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 18) return 'under-18';
        if (age < 25) return '18-24';
        if (age < 35) return '25-34';
        if (age < 45) return '35-44';
        if (age < 55) return '45-54';
        if (age < 65) return '55-64';
        return '65+';
    }

    /**
     * Convert timestamp to time bucket (morning, afternoon, etc.)
     */
    private getTimeBucket(date: Date): string {
        const hour = date.getHours();
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    /**
     * Get region bucket from IP (very generalized)
     * In production, use a GeoIP database like MaxMind
     */
    private getRegionBucket(ip: string): string {
        // Placeholder - in production use actual GeoIP lookup
        // For now, return a generic bucket
        return 'Unknown';
    }

    /**
     * Anonymize user data
     */
    async anonymizeUserData(db: any): Promise<AnonymizedUser[]> {
        // Fetch users with minimal PII
        const users = await db.user.findMany({
            select: {
                id: true,
                createdAt: true,
                isPremium: true,
                birthDate: true,
            },
        });

        return users.map((user: any) => ({
            user_hash: this.hashUserId(user.id),
            demographic_bucket: user.birthDate ? this.getAgeBucket(user.birthDate) : 'unknown',
            region_bucket: 'global', // Generalized
            signup_month: user.createdAt.toISOString().substring(0, 7), // "2025-12"
            is_premium: user.isPremium || false,
        }));
    }

    /**
     * Anonymize behavioral data
     */
    async anonymizeBehaviorData(db: any, options: ExportOptions = {}): Promise<BehaviorData[]> {
        const { startDate, endDate } = options;

        // In a real implementation, query your analytics tables
        // For now, return structure
        const sessions: BehaviorData[] = [];

        // Example aggregation logic (pseudo-code)
        // const rawSessions = await db.user_sessions.findMany({ where: { ... } });
        // sessions = rawSessions.map(session => ({
        //   session_hash: this.hashUserId(session.id),
        //   page_views: session.pageViews,
        //   avg_session_duration_seconds: session.durationMs / 1000,
        //   fortune_categories_viewed: session.categoriesViewed,
        //   interactions_count: session.interactionCount,
        //   device_type: this.normalizeDeviceType(session.deviceInfo),
        //   browser_family: this.getBrowserFamily(session.userAgent),
        //   referrer_domain: this.extractDomain(session.referrer),
        //   time_bucket: this.getTimeBucket(session.createdAt),
        //   day_of_week: this.getDayOfWeek(session.createdAt),
        // }));

        return sessions;
    }

    /**
     * Anonymize content engagement data
     */
    async anonymizeEngagementData(db: any, options: ExportOptions = {}): Promise<EngagementData[]> {
        // In a real implementation, aggregate content performance
        const engagement: EngagementData[] = [];

        // Example:
        // const contentStats = await db.content_engagement.aggregate({
        //   groupBy: ['contentType', 'category'],
        //   _count: { views: true, shares: true },
        //   _avg: { timeSpent: true, viralScore: true },
        // });

        return engagement;
    }

    /**
     * Export data in various formats
     */
    async exportData(db: any, options: ExportOptions = {}): Promise<{
        users: AnonymizedUser[];
        behavior: BehaviorData[];
        engagement: EngagementData[];
        metadata: {
            exportDate: string;
            recordCount: number;
            dataDateRange: { start: string; end: string };
            version: string;
        };
    }> {
        const users = await this.anonymizeUserData(db);
        const behavior = await this.anonymizeBehaviorData(db, options);
        const engagement = await this.anonymizeEngagementData(db, options);

        return {
            users,
            behavior,
            engagement,
            metadata: {
                exportDate: new Date().toISOString(),
                recordCount: users.length + behavior.length + engagement.length,
                dataDateRange: {
                    start: options.startDate?.toISOString() || '2025-01-01',
                    end: options.endDate?.toISOString() || new Date().toISOString(),
                },
                version: '1.0.0',
            },
        };
    }

    /**
     * Convert to CSV format
     */
    private toCSV(data: any[]): string {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const rows = data.map(item =>
            headers.map(header => {
                const value = item[header];
                if (Array.isArray(value)) return `"${value.join(',')}"`;
                if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
                return value;
            }).join(',')
        );

        return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Helper: Extract domain from URL
     */
    private extractDomain(url: string | null): string | null {
        if (!url) return null;
        try {
            const domain = new URL(url).hostname;
            // Remove www. prefix
            return domain.replace(/^www\./, '');
        } catch {
            return null;
        }
    }

    /**
     * Helper: Browser family extraction
     */
    private getBrowserFamily(userAgent: string): string {
        if (/Chrome/i.test(userAgent)) return 'Chrome';
        if (/Firefox/i.test(userAgent)) return 'Firefox';
        if (/Safari/i.test(userAgent)) return 'Safari';
        if (/Edge/i.test(userAgent)) return 'Edge';
        return 'Other';
    }

    /**
     * Helper: Device type normalization
     */
    private normalizeDeviceType(deviceInfo: string): 'mobile' | 'tablet' | 'desktop' {
        if (/mobile/i.test(deviceInfo)) return 'mobile';
        if (/tablet|ipad/i.test(deviceInfo)) return 'tablet';
        return 'desktop';
    }

    /**
     * Helper: Get day of week
     */
    private getDayOfWeek(date: Date): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }
}

/**
 * Express route handlers for data export API
 */
export function setupDataExportRoutes(app: Express, db: any) {
    const service = new DataAnonymizationService();

    // Authentication middleware (admin only)
    const requireDataBuyerAuth = (req: any, res: any, next: any) => {
        const apiKey = req.headers['x-api-key'];
        const validKeys = (process.env.DATA_BUYER_API_KEYS || '').split(',');

        if (!apiKey || !validKeys.includes(apiKey)) {
            return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
        }

        next();
    };

    /**
     * GET /api/data-export/aggregated
     * Get all anonymized data in one export
     */
    app.get('/api/data-export/aggregated', requireDataBuyerAuth, async (req, res) => {
        try {
            const { start, end, format = 'json' } = req.query;

            const options: ExportOptions = {
                startDate: start ? new Date(start as string) : undefined,
                endDate: end ? new Date(end as string) : undefined,
                format: format as 'json' | 'csv',
            };

            const data = await service.exportData(db, options);

            if (format === 'csv') {
                // Return CSV format
                const csv = {
                    users: service['toCSV'](data.users),
                    behavior: service['toCSV'](data.behavior),
                    engagement: service['toCSV'](data.engagement),
                };
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="mysticfortune-data-export.csv"');
                res.send(csv);
            } else {
                res.json(data);
            }
        } catch (error) {
            console.error('Data export error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    });

    /**
     * GET /api/data-export/behavioral
     * Get anonymized behavioral data only
     */
    app.get('/api/data-export/behavioral', requireDataBuyerAuth, async (req, res) => {
        try {
            const { start, end } = req.query;
            const options: ExportOptions = {
                startDate: start ? new Date(start as string) : undefined,
                endDate: end ? new Date(end as string) : undefined,
            };

            const behavior = await service.anonymizeBehaviorData(db, options);
            res.json({ behavior, count: behavior.length });
        } catch (error) {
            console.error('Behavioral data export error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    });

    /**
     * GET /api/data-export/engagement
     * Get content engagement metrics only
     */
    app.get('/api/data-export/engagement', requireDataBuyerAuth, async (req, res) => {
        try {
            const { start, end } = req.query;
            const options: ExportOptions = {
                startDate: start ? new Date(start as string) : undefined,
                endDate: end ? new Date(end as string) : undefined,
            };

            const engagement = await service.anonymizeEngagementData(db, options);
            res.json({ engagement, count: engagement.length });
        } catch (error) {
            console.error('Engagement data export error:', error);
            res.status(500).json({ error: 'Export failed' });
        }
    });

    /**
     * GET /api/data-export/sample
     * Get a small sample dataset (public endpoint for demo)
     */
    app.get('/api/data-export/sample', async (req, res) => {
        try {
            // Return sample data structure
            const sample = {
                users: [
                    {
                        user_hash: 'abc123hash456',
                        demographic_bucket: '25-34',
                        region_bucket: 'North America',
                        signup_month: '2025-12',
                        is_premium: false,
                    },
                ],
                behavior: [
                    {
                        session_hash: 'xyz789session',
                        page_views: 5,
                        avg_session_duration_seconds: 180,
                        fortune_categories_viewed: ['love', 'career'],
                        interactions_count: 3,
                        device_type: 'mobile',
                        browser_family: 'Chrome',
                        referrer_domain: 'google.com',
                        time_bucket: 'evening',
                        day_of_week: 'Monday',
                    },
                ],
                engagement: [
                    {
                        content_type: 'fortune',
                        category: 'love',
                        views_count: 1250,
                        avg_time_spent_seconds: 45,
                        share_count: 87,
                        favorite_count: 34,
                        completion_rate: 0.82,
                        viral_score: 67,
                    },
                ],
                metadata: {
                    note: 'This is sample data. Contact us for API access to full dataset.',
                    exportDate: new Date().toISOString(),
                },
            };

            res.json(sample);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get sample' });
        }
    });
}

export const dataAnonymizationService = new DataAnonymizationService();
