
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

export default function PerformanceMonitor() {
  const { data: performance, isLoading } = useQuery({
    queryKey: ['admin', 'performance'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/performance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch performance data');
      return response.json();
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading performance metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performance?.cpu || 0}%</div>
            <Progress value={performance?.cpu || 0} className="h-2 mt-2" />
            <p className="text-xs text-blue-300 mt-1">
              {performance?.cpuTrend === 'up' ? (
                <TrendingUp className="h-3 w-3 inline mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 inline mr-1" />
              )}
              {performance?.cpuChange || 0}% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performance?.memory || 0}%</div>
            <Progress value={performance?.memory || 0} className="h-2 mt-2" />
            <p className="text-xs text-green-300 mt-1">
              {performance?.memoryUsed || 0} MB / {performance?.memoryTotal || 0} MB
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performance?.responseTime || 0}ms</div>
            <p className="text-xs text-purple-300 mt-2">
              API average response time
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Active Requests</CardTitle>
            <Wifi className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performance?.activeRequests || 0}</div>
            <p className="text-xs text-orange-300 mt-2">
              Current concurrent connections
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">API Endpoint Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performance?.endpoints?.map((endpoint: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-purple-900/30">
                <div>
                  <div className="text-purple-200 font-medium">{endpoint.method} {endpoint.path}</div>
                  <div className="text-xs text-purple-300">
                    {endpoint.requests} requests | {endpoint.avgTime}ms avg
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={endpoint.status === 'healthy' ? 'default' : 'destructive'}>
                    {endpoint.status}
                  </Badge>
                  {endpoint.errorRate > 5 && (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
