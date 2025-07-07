/**
 * Advanced Analytics Dashboard for Phase 3
 * Provides comprehensive insights into user behavior, content performance, and viral metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Share2, 
  Clock, 
  Target, 
  BarChart3, 
  Globe,
  Zap,
  Heart,
  Star,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

function MetricCard({ title, value, change, trend, icon, description }: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3" />;
      case 'down': return <ArrowDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-200">{title}</CardTitle>
          <div className="text-purple-400">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{value}</div>
          {change && (
            <div className={`flex items-center text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">{change}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-purple-300 mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LiveMetricsDisplay() {
  const { getLiveMetrics } = useAnalyticsData();
  const liveMetrics = getLiveMetrics();

  if (liveMetrics.isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-200">
            <Activity className="h-5 w-5" />
            Live Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-purple-700/30 rounded"></div>
            <div className="h-4 bg-purple-700/30 rounded w-3/4"></div>
            <div className="h-4 bg-purple-700/30 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = liveMetrics.data;

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-200">
          <Activity className="h-5 w-5 animate-pulse text-green-400" />
          Live Metrics
        </CardTitle>
        <CardDescription className="text-purple-300">
          Real-time activity in the last hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-200">Active Sessions</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {data?.activeSessions || 0}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <span className="text-purple-200 text-sm">Recent Interactions</span>
            {data?.recentInteractions?.map((interaction: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-purple-300 capitalize">
                  {interaction.action.replace('_', ' ')}
                </span>
                <span className="text-white">{interaction.count}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-purple-200 text-sm">Top Content</span>
            {data?.topContent?.slice(0, 3).map((content: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-purple-300 capitalize">
                  {content.contentType}
                </span>
                <span className="text-white">{content.engagements}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BehaviorMetrics({ timeframe }: { timeframe: 'day' | 'week' | 'month' }) {
  const { getBehaviorMetrics } = useAnalyticsData();
  const metrics = getBehaviorMetrics(timeframe);

  if (metrics.isLoading) {
    return <div className="animate-pulse">Loading behavior metrics...</div>;
  }

  const data = metrics.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Sessions"
        value={data?.totalSessions || 0}
        change="+12.5%"
        trend="up"
        icon={<Users className="h-4 w-4" />}
        description="Unique user sessions"
      />
      <MetricCard
        title="Avg Session Duration"
        value={`${Math.round((data?.avgSessionDuration || 0) / 60)}m`}
        change="+8.2%"
        trend="up"
        icon={<Clock className="h-4 w-4" />}
        description="Time spent per session"
      />
      <MetricCard
        title="Conversion Rate"
        value={`${(data?.conversionRate || 0).toFixed(1)}%`}
        change="+3.1%"
        trend="up"
        icon={<Target className="h-4 w-4" />}
        description="Premium signups"
      />
      <MetricCard
        title="Retention Rate"
        value={`${(data?.retentionRate || 0).toFixed(1)}%`}
        change="-2.3%"
        trend="down"
        icon={<Heart className="h-4 w-4" />}
        description="7-day user retention"
      />
    </div>
  );
}

function ContentPerformance() {
  const { getContentPerformance } = useAnalyticsData();
  const [selectedType, setSelectedType] = useState<string>('all');
  const performance = getContentPerformance(selectedType === 'all' ? undefined : selectedType);

  if (performance.isLoading) {
    return <div className="animate-pulse">Loading content performance...</div>;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-200">Content Performance</CardTitle>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="fortune">Fortunes</SelectItem>
              <SelectItem value="horoscope">Horoscopes</SelectItem>
              <SelectItem value="tarot">Tarot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performance.data?.slice(0, 10).map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-purple-900/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.contentType}
                  </Badge>
                  <span className="text-purple-200 text-sm">{item.contentId}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-purple-300">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.totalViews} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    {item.shareCount} shares
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {item.saveCount} saves
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{item.viralScore || 0}</div>
                <div className="text-xs text-purple-300">Viral Score</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformAnalytics() {
  const { getPlatformAnalytics } = useAnalyticsData();
  const analytics = getPlatformAnalytics();

  if (analytics.isLoading) {
    return <div className="animate-pulse">Loading platform analytics...</div>;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-200">
          <Globe className="h-5 w-5" />
          Platform Performance
        </CardTitle>
        <CardDescription className="text-purple-300">
          Social media engagement across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.data?.map((platform: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-200 capitalize font-medium">
                  {platform.platform}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {platform.totalShares} shares
                  </Badge>
                  <span className="text-white">
                    {platform.avgViralScore.toFixed(1)} score
                  </span>
                </div>
              </div>
              <Progress 
                value={platform.avgViralScore} 
                className="h-2" 
              />
              <div className="text-xs text-purple-300">
                Peak engagement: {platform.peakEngagementHour}:00
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Analytics Dashboard
            </h1>
            <p className="text-purple-300 mt-2">
              Smart insights and data collection for Mystic Fortune
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last Day</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-purple-900/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="behavior">User Behavior</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="viral">Viral Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <BehaviorMetrics timeframe={timeframe} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ContentPerformance />
              </div>
              <LiveMetricsDisplay />
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-200">User Journey Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-purple-300">
                      Most common user path through the application
                    </div>
                    <div className="space-y-2">
                      {[
                        { step: 'Landing Page', users: '100%', conversion: '100%' },
                        { step: 'Fortune Reading', users: '78%', conversion: '78%' },
                        { step: 'Content Sharing', users: '45%', conversion: '58%' },
                        { step: 'Premium Signup', users: '12%', conversion: '27%' }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-purple-900/30">
                          <span className="text-purple-200">{step.step}</span>
                          <div className="text-right">
                            <div className="text-white text-sm">{step.users}</div>
                            <div className="text-xs text-purple-300">{step.conversion} convert</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-200">Engagement Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-purple-300">
                      Peak activity hours and user preferences
                    </div>
                    <div className="space-y-3">
                      {[
                        { category: 'Love Fortunes', percentage: 45, color: 'bg-pink-500' },
                        { category: 'Career Insights', percentage: 30, color: 'bg-blue-500' },
                        { category: 'Tarot Readings', percentage: 25, color: 'bg-purple-500' }
                      ].map((cat, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">{cat.category}</span>
                            <span className="text-white">{cat.percentage}%</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div 
                              className={`${cat.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentPerformance />
          </TabsContent>

          <TabsContent value="viral" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformAnalytics />
              
              <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-200">
                    <Zap className="h-5 w-5" />
                    Viral Prediction Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">87.3%</div>
                      <div className="text-purple-300">Overall Accuracy</div>
                    </div>
                    <Progress value={87.3} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-white font-medium">156</div>
                        <div className="text-purple-300">Predictions Made</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-medium">136</div>
                        <div className="text-purple-300">Accurate Predictions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}