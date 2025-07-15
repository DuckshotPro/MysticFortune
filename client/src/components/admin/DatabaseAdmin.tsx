
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

export default function DatabaseAdmin() {
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const { data: dbStats, isLoading } = useQuery({
    queryKey: ['admin', 'database-stats'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/database-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch database stats');
      return response.json();
    },
    refetchInterval: 30000
  });

  const optimizeDatabase = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/optimize-database', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to optimize database');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'database-stats'] });
    }
  });

  const exportData = useMutation({
    mutationFn: async (table: string) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/export-data/${table}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to export data');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });

  const cleanupLogs = useMutation({
    mutationFn: async (days: number) => {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/cleanup-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ days })
      });
      if (!response.ok) throw new Error('Failed to cleanup logs');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'database-stats'] });
    }
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading database administration...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Health Overview
          </CardTitle>
          <CardDescription className="text-purple-300">
            Monitor database performance and manage data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Total Records</span>
                <span className="text-white font-medium">{dbStats?.totalRecords || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Database Size</span>
                <span className="text-white font-medium">{dbStats?.sizeGB || 0} GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Connection Pool</span>
                <Badge variant={dbStats?.poolHealth === 'healthy' ? 'default' : 'destructive'}>
                  {dbStats?.poolHealth || 'Unknown'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Avg Query Time</span>
                <span className="text-white font-medium">{dbStats?.avgQueryTime || 0}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Slow Queries</span>
                <span className="text-orange-400 font-medium">{dbStats?.slowQueries || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Cache Hit Rate</span>
                <span className="text-green-400 font-medium">{dbStats?.cacheHitRate || 0}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => optimizeDatabase.mutate()}
                disabled={optimizeDatabase.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Optimize Database
              </Button>
              <Button 
                onClick={() => cleanupLogs.mutate(30)}
                disabled={cleanupLogs.isPending}
                variant="outline"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cleanup Old Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Table Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbStats?.tables?.map((table: any) => (
              <div key={table.name} className="p-4 rounded-lg bg-purple-900/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 font-medium">{table.name}</span>
                  <Badge variant="secondary">{table.records} records</Badge>
                </div>
                <div className="text-xs text-purple-300 mb-3">
                  Size: {table.sizeKB} KB | Last Updated: {new Date(table.lastUpdate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => exportData.mutate(table.name)}
                    disabled={exportData.isPending}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {dbStats?.alerts && dbStats.alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Database alerts: {dbStats.alerts.join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
