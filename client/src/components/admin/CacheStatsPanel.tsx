import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Image, DollarSign, TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';

interface CacheStats {
  totalCachedImages: number;
  totalImageReuses: number;
  estimatedCostSaved: number;
  averageReusePerImage: number;
  uniqueViewers: number;
  totalViews: number;
  recentViews: number;
  cacheEfficiency: string;
}

export default function CacheStatsPanel() {
  const { data: stats, isLoading, error } = useQuery<CacheStats>({
    queryKey: ['/api/admin/cache-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-2 text-purple-300">Loading cache statistics...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
        <CardContent className="p-6">
          <p className="text-red-300">Failed to load cache statistics</p>
        </CardContent>
      </Card>
    );
  }

  const efficiencyPercentage = parseFloat(stats.cacheEfficiency);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-['Cinzel'] text-amber-400">AI Image Cache Optimization</h3>
        <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/50">
          Live Stats
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cost Savings */}
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${stats.estimatedCostSaved.toFixed(3)}
            </div>
            <p className="text-xs text-green-300 mt-1">
              Hugging Face API costs avoided
            </p>
          </CardContent>
        </Card>

        {/* Cache Efficiency */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-300 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Cache Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {stats.cacheEfficiency}%
            </div>
            <Progress 
              value={efficiencyPercentage} 
              className="mt-2 h-2"
            />
            <p className="text-xs text-blue-300 mt-1">
              Images reused vs generated
            </p>
          </CardContent>
        </Card>

        {/* Total Images */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-300 flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Cached Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalCachedImages}
            </div>
            <p className="text-xs text-purple-300 mt-1">
              Unique AI images stored
            </p>
          </CardContent>
        </Card>

        {/* Unique Viewers */}
        <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-300 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Unique Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {stats.uniqueViewers}
            </div>
            <p className="text-xs text-amber-300 mt-1">
              Different users/sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-purple-300 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-300">Total Image Reuses:</span>
              <span className="text-purple-100 font-semibold">{stats.totalImageReuses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-300">Average Reuse/Image:</span>
              <span className="text-purple-100 font-semibold">{stats.averageReusePerImage.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-300">Total Views:</span>
              <span className="text-purple-100 font-semibold">{stats.totalViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-300">Recent Views (24h):</span>
              <span className="text-purple-100 font-semibold">{stats.recentViews}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-green-300 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Cost Optimization Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-2">Smart Image Caching</h4>
              <p className="text-green-200 text-sm">
                Our intelligent caching system prevents users from seeing the same character image repeatedly, 
                while maximizing reuse for cost efficiency. Each cached image saves approximately $0.02 in AI generation costs.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-300">Images that would be generated:</span>
                <span className="text-green-100">{stats.totalViews}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-300">Images actually generated:</span>
                <span className="text-green-100">{stats.totalCachedImages}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-green-500/30 pt-2">
                <span className="text-green-300">Cost reduction:</span>
                <span className="text-green-400">{efficiencyPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Update Indicator */}
      <div className="text-center">
        <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/50 text-xs">
          📊 Statistics update every 30 seconds • Cache optimization active
        </Badge>
      </div>
    </div>
  );
}