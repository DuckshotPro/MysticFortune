import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Flame, 
  Share2, 
  BookOpen, 
  Crown,
  Zap,
  Gift,
  Award,
  Calendar,
  Users,
  Heart
} from 'lucide-react';

interface UserStats {
  totalFortunes: number;
  totalHoroscopes: number;
  totalTarotReadings: number;
  socialShares: number;
  savedFortunes: number;
  currentStreak: number;
  longestStreak: number;
  totalAchievementPoints: number;
  level: number;
  experiencePoints: number;
  lastActiveDate: string;
  premiumMember: boolean;
  favoriteCategory: string;
}

interface Achievement {
  achievementId: number;
  progress: number;
  requirement: number;
  isCompleted: boolean;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
}

interface UserLevel {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

interface Milestone {
  id: number;
  milestoneType: string;
  milestoneValue: number;
  description: string;
  rewardType: string;
  rewardValue: string;
  achievedAt: string;
  celebrationShown: boolean;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'legendary': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-900/20 to-gray-800/20';
    case 'rare': return 'from-blue-900/20 to-cyan-900/20';
    case 'epic': return 'from-purple-900/20 to-pink-900/20';
    case 'legendary': return 'from-amber-900/20 to-orange-900/20';
    default: return 'from-gray-900/20 to-gray-800/20';
  }
};

interface AchievementDashboardProps {
  userId: number;
}

export default function AchievementDashboard({ userId }: AchievementDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/user-stats', userId],
    refetchInterval: 30000
  });

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user-achievements', userId],
    refetchInterval: 30000
  });

  // Fetch user level info
  const { data: userLevel, isLoading: levelLoading } = useQuery<UserLevel>({
    queryKey: ['/api/user-level', userId],
    refetchInterval: 30000
  });

  // Fetch recent milestones
  const { data: milestones, isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ['/api/user-milestones', userId],
    refetchInterval: 30000
  });

  if (statsLoading || achievementsLoading || levelLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-purple-800/30 rounded-lg w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-purple-800/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedAchievements = achievements?.filter(a => a.isCompleted) || [];
  const inProgressAchievements = achievements?.filter(a => !a.isCompleted) || [];

  return (
    <div className="p-6 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-['Cinzel'] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
            Your Mystical Journey
          </h1>
          <p className="text-purple-300 text-lg">
            Track your progress and unlock rewards on your path to enlightenment
          </p>
        </motion.div>

        {/* User Level Card */}
        {userLevel && userStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Crown className="h-12 w-12 text-amber-400" />
                      <Badge className="absolute -top-2 -right-2 bg-amber-500 text-black font-bold">
                        {userLevel.level}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-amber-400">Level {userLevel.level} Mystic</h2>
                      <p className="text-amber-300">
                        {userLevel.currentXP.toLocaleString()} / {userLevel.nextLevelXP.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-400">
                      {userStats.totalAchievementPoints}
                    </div>
                    <div className="text-amber-300 text-sm">Achievement Points</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-amber-300">
                    <span>Progress to Level {userLevel.level + 1}</span>
                    <span>{userLevel.progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={userLevel.progressPercentage} 
                    className="h-3 bg-amber-900/30"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-200">{userStats.totalFortunes}</div>
                  <div className="text-xs text-purple-300">Fortunes</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-200">{userStats.totalHoroscopes}</div>
                  <div className="text-xs text-blue-300">Horoscopes</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border-pink-500/30">
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-200">{userStats.totalTarotReadings}</div>
                  <div className="text-xs text-pink-300">Tarot Readings</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-200">{userStats.currentStreak}</div>
                  <div className="text-xs text-orange-300">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <Share2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-200">{userStats.socialShares}</div>
                  <div className="text-xs text-green-300">Shares</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/30">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-200">{userStats.savedFortunes}</div>
                  <div className="text-xs text-amber-300">Saved</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-purple-900/50">
                <TabsTrigger value="completed" className="data-[state=active]:bg-purple-700">
                  <Trophy className="h-4 w-4 mr-2" />
                  Completed ({completedAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-purple-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  In Progress ({inProgressAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="milestones" className="data-[state=active]:bg-purple-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Recent Milestones
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {completedAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.achievementId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className={`bg-gradient-to-br ${getRarityGradient(achievement.rarity)} border-2 ${getRarityColor(achievement.rarity).split(' ')[2]} relative overflow-hidden`}>
                        <div className="absolute top-2 right-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="text-4xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-white">{achievement.name}</h3>
                              <p className="text-sm text-gray-300">{achievement.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-amber-400" />
                              <span className="text-amber-400 font-semibold">+{achievement.points} XP</span>
                            </div>
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {inProgressAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.achievementId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className={`bg-gradient-to-br ${getRarityGradient(achievement.rarity)} border ${getRarityColor(achievement.rarity).split(' ')[2]} relative overflow-hidden opacity-80`}>
                        <div className="absolute top-2 right-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="text-4xl opacity-60">{achievement.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-white">{achievement.name}</h3>
                              <p className="text-sm text-gray-300">{achievement.description}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Progress</span>
                              <span className="text-white font-semibold">
                                {achievement.progress} / {achievement.requirement}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.requirement) * 100} 
                              className="h-2"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-amber-400" />
                                <span className="text-amber-400 font-semibold">+{achievement.points} XP</span>
                              </div>
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {Math.round((achievement.progress / achievement.requirement) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="milestones">
              <div className="space-y-4">
                {milestones && milestones.length > 0 ? (
                  milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Gift className="h-8 w-8 text-purple-400" />
                              <div>
                                <h3 className="font-bold text-lg text-white">{milestone.description}</h3>
                                <p className="text-sm text-purple-300">
                                  {new Date(milestone.achievedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {milestone.rewardType}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 border-gray-500/30">
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No Milestones Yet</h3>
                      <p className="text-gray-400">
                        Start your mystical journey to unlock your first milestones!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}