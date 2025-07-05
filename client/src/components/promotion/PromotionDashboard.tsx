import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  TrendingUp, 
  Calendar, 
  Share2, 
  BarChart3, 
  Sparkles,
  Instagram,
  Twitter,
  Facebook
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FortuneCategory, type FortuneCategoryType } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface SocialMediaPost {
  id: string;
  content: string;
  imageUrl?: string;
  platform: string;
  scheduledTime: Date;
  status: 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface PromotionalContent {
  fortuneContent: string;
  imagePrompt: string;
  socialCaptions: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
  };
  hashtags: string[];
}

interface ViralContent {
  hook: string;
  content: string;
  imageUrl: string;
  platforms: Record<string, string>;
}

export function PromotionDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategoryType>(FortuneCategory.GENERAL);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('daily');
  const { toast } = useToast();

  // Generate promotional content
  const generateContentMutation = useMutation({
    mutationFn: async (category: FortuneCategoryType): Promise<PromotionalContent> => {
      const response = await apiRequest("POST", "/api/promotion/generate-content", { category });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content Generated!",
        description: "Promotional content created successfully.",
      });
    }
  });

  // Schedule automated posts
  const schedulePostsMutation = useMutation({
    mutationFn: async (frequency: 'daily' | 'weekly'): Promise<{ scheduledPosts: SocialMediaPost[] }> => {
      const response = await apiRequest("POST", "/api/promotion/schedule-posts", { frequency });
      return await response.json();
    },
    onSuccess: (data: { scheduledPosts: SocialMediaPost[] }) => {
      toast({
        title: "Posts Scheduled!",
        description: `${data.scheduledPosts.length} posts scheduled successfully.`,
      });
      scheduledPostsQuery.refetch();
    }
  });

  // Generate viral content
  const viralContentMutation = useMutation({
    mutationFn: async (): Promise<ViralContent> => {
      const response = await apiRequest("POST", "/api/promotion/viral-content");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Viral Content Created!",
        description: "Ready-to-post viral content generated.",
      });
    }
  });

  // Get scheduled posts  
  const scheduledPostsQuery = useQuery({
    queryKey: ["/api/promotion/scheduled-posts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/promotion/scheduled-posts");
      return await response.json();
    }
  });

  const handleCopyContent = async (content: string, platform: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${platform} content copied to clipboard.`,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <TrendingUp className="h-5 w-5" />
            Automated Promotion System
          </CardTitle>
          <CardDescription>
            Generate and schedule social media content to grow your audience
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="schedule">Auto Schedule</TabsTrigger>
          <TabsTrigger value="viral">Viral Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Generator
              </CardTitle>
              <CardDescription>Create promotional content for specific categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fortune Category</label>
                <Select value={selectedCategory} onValueChange={(value: FortuneCategoryType) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FortuneCategory.LOVE}>Love & Romance</SelectItem>
                    <SelectItem value={FortuneCategory.CAREER}>Career & Success</SelectItem>
                    <SelectItem value={FortuneCategory.GENERAL}>General Wisdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => generateContentMutation.mutate(selectedCategory)}
                disabled={generateContentMutation.isPending}
                className="w-full"
              >
                {generateContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>

              <AnimatePresence>
                {generateContentMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries((generateContentMutation.data as PromotionalContent).socialCaptions).map(([platform, caption]) => (
                        <Card key={platform} className="border-gray-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2 capitalize">
                              {getPlatformIcon(platform)}
                              {platform}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm text-gray-600">{caption}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyContent(caption, platform)}
                              className="w-full"
                            >
                              Copy Content
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Auto Scheduler
              </CardTitle>
              <CardDescription>Schedule posts automatically across platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Posting Frequency</label>
                <Select value={selectedFrequency} onValueChange={(value: 'daily' | 'weekly') => setSelectedFrequency(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Posts</SelectItem>
                    <SelectItem value="weekly">Weekly Posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => schedulePostsMutation.mutate(selectedFrequency)}
                disabled={schedulePostsMutation.isPending}
                className="w-full"
              >
                {schedulePostsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Posts
                  </>
                )}
              </Button>

              {scheduledPostsQuery.data && (
                <div className="space-y-2">
                  <h4 className="font-medium">Scheduled Posts</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(scheduledPostsQuery.data as { posts: SocialMediaPost[] }).posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(post.platform)}
                          <span className="text-sm font-medium capitalize">{post.platform}</span>
                        </div>
                        <Badge variant="secondary">{post.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Viral Content Creator
              </CardTitle>
              <CardDescription>Generate content optimized for viral growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => viralContentMutation.mutate()}
                disabled={viralContentMutation.isPending}
                className="w-full"
              >
                {viralContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Viral Content...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Viral Content
                  </>
                )}
              </Button>

              <AnimatePresence>
                {viralContentMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg">{(viralContentMutation.data as ViralContent).hook}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={(viralContentMutation.data as ViralContent).imageUrl}
                          alt="Viral content"
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                        <p className="text-sm text-gray-600 mb-3">{(viralContentMutation.data as ViralContent).content}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyContent((viralContentMutation.data as ViralContent).hook + "\n\n" + (viralContentMutation.data as ViralContent).content, "viral")}
                        >
                          Copy Viral Content
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Track your promotional campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {scheduledPostsQuery.data ? (scheduledPostsQuery.data as { posts: SocialMediaPost[] }).posts.length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Scheduled Posts</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {scheduledPostsQuery.data ? 
                      (scheduledPostsQuery.data as { posts: SocialMediaPost[] }).posts.filter(p => p.status === 'posted').length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Posts Published</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}