/**
 * Admin Dashboard - Complete Management Console
 * Provides administrative access to all platform features and analytics
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import CacheStatsPanel from './CacheStatsPanel';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  Activity,
  DollarSign,
  Globe,
  Zap,
  Eye,
  Share2,
  Target,
  Image
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFortunes: number;
  premiumUsers: number;
  revenue: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admin stats');
      return response.json() as AdminStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading admin overview...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-blue-300">
            {stats?.activeUsers || 0} active today
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-200">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">${stats?.revenue || 0}</div>
          <p className="text-xs text-green-300">
            {stats?.premiumUsers || 0} premium subscribers
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-200">Content</CardTitle>
          <Eye className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats?.totalFortunes || 0}</div>
          <p className="text-xs text-purple-300">
            Total fortunes generated
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-200">System Health</CardTitle>
          <Activity className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white capitalize">
            {stats?.systemHealth || 'Unknown'}
          </div>
          <Progress 
            value={stats?.systemHealth === 'healthy' ? 100 : stats?.systemHealth === 'warning' ? 70 : 30} 
            className="h-2 mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagement() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-purple-200">User Management</CardTitle>
        <CardDescription className="text-purple-300">
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">Loading users...</div>
        ) : (
          <div className="space-y-4">
            {users?.slice(0, 10).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-900/30">
                <div>
                  <div className="text-purple-200 font-medium">{user.username}</div>
                  <div className="text-xs text-purple-300">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isPremium ? "default" : "secondary"}>
                    {user.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContentManagement() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['admin', 'content'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Fortune Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['love', 'career', 'general'].map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-purple-200 capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {content?.[category]?.count || 0} fortunes
                  </Badge>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Viral Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Total Shares</span>
              <span className="text-white font-medium">{content?.totalShares || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Viral Score</span>
              <span className="text-white font-medium">{content?.avgViralScore || 0}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-200">A/B Tests Active</span>
              <span className="text-white font-medium">{content?.activeABTests || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin', 'logs'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-purple-200">System Logs</CardTitle>
        <CardDescription className="text-purple-300">
          Real-time application logs and error tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="animate-pulse">Loading logs...</div>
          ) : (
            logs?.map((log: any, index: number) => (
              <div key={index} className={`p-2 rounded text-xs font-mono ${
                log.level === 'error' ? 'bg-red-900/30 text-red-200' :
                log.level === 'warn' ? 'bg-yellow-900/30 text-yellow-200' :
                'bg-blue-900/30 text-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <Badge variant={
                    log.level === 'error' ? 'destructive' :
                    log.level === 'warn' ? 'secondary' : 'default'
                  }>
                    {log.level}
                  </Badge>
                </div>
                <div className="mt-1">{log.message}</div>
                {log.meta && (
                  <div className="mt-1 text-gray-500">{JSON.stringify(log.meta)}</div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PromotionManager() {
  const queryClient = useQueryClient();
  
  const generateAd = useMutation({
    mutationFn: async (adType: string) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/generate-ad', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adType })
      });
      if (!response.ok) throw new Error('Failed to generate ad');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
    }
  });

  const { data: promotions } = useQuery({
    queryKey: ['admin', 'promotions'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/promotions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch promotions');
      return response.json();
    }
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Self-Promotion Generator</CardTitle>
          <CardDescription className="text-purple-300">
            Generate ads to promote Mystic Fortune on other platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => generateAd.mutate('social_media')}
              disabled={generateAd.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Social Media Ad
            </Button>
            <Button 
              onClick={() => generateAd.mutate('banner')}
              disabled={generateAd.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Banner Ad
            </Button>
            <Button 
              onClick={() => generateAd.mutate('video')}
              disabled={generateAd.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Video Ad
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Generated Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotions?.map((promo: any, index: number) => (
              <div key={index} className="p-4 rounded-lg bg-purple-900/30">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{promo.type}</Badge>
                  <span className="text-xs text-purple-300">
                    {new Date(promo.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-purple-200 text-sm mb-2">{promo.content}</div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">Copy</Button>
                  <Button size="sm" variant="outline">Download</Button>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
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
              Admin Dashboard
            </h1>
            <p className="text-purple-300 mt-2">
              Complete management console for Mystic Fortune platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-400">
              System Online
            </Badge>
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout} className="text-red-400 border-red-400/50">
                Logout
              </Button>
            )}
          </div>
        </div>

        <AdminOverview />

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-purple-900/50">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="cache">
              <Image className="h-4 w-4 mr-1" />
              Cache
            </TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  Real-time analytics data is collected automatically. Phase 3 analytics engine is active.
                </AlertDescription>
              </Alert>
              {/* Import AnalyticsDashboard component */}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="cache">
            <CacheStatsPanel />
          </TabsContent>

          <TabsContent value="promotion">
            <PromotionManager />
          </TabsContent>

          <TabsContent value="logs">
            <SystemLogs />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-200">System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">AI Features</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Analytics Tracking</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Viral Marketing</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}