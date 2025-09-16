import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flame, Gift, Star, Trophy, Zap } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faCrown, faMagic } from "@fortawesome/free-solid-svg-icons";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  totalVisits: number;
  todaysClaimed: boolean;
  weeklyBonus: boolean;
}

interface DailyReward {
  day: number;
  type: 'reading' | 'premium' | 'special';
  title: string;
  description: string;
  icon: any;
  claimed: boolean;
  available: boolean;
}

export default function DailyStreakTracker() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0,
    todaysClaimed: false,
    weeklyBonus: false
  });

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [todaysReward, setTodaysReward] = useState<DailyReward | null>(null);

  // Initialize streak data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('mystic-streak-data');
    const today = new Date().toDateString();
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const lastVisitDate = new Date(parsed.lastVisit).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      // Check if streak should continue or reset
      if (lastVisitDate === today) {
        // Same day visit
        setStreakData(parsed);
      } else if (lastVisitDate === yesterday) {
        // Consecutive day - increment streak
        const newStreak = parsed.currentStreak + 1;
        const updatedData = {
          ...parsed,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, parsed.longestStreak),
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1,
          todaysClaimed: false,
          weeklyBonus: newStreak % 7 === 0
        };
        setStreakData(updatedData);
        localStorage.setItem('mystic-streak-data', JSON.stringify(updatedData));
        
        // Show reward if not claimed today
        if (!updatedData.todaysClaimed) {
          setTodaysReward(getDailyReward(newStreak));
          setShowRewardModal(true);
        }
      } else {
        // Streak broken - reset
        const resetData = {
          currentStreak: 1,
          longestStreak: parsed.longestStreak,
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1,
          todaysClaimed: false,
          weeklyBonus: false
        };
        setStreakData(resetData);
        localStorage.setItem('mystic-streak-data', JSON.stringify(resetData));
        setTodaysReward(getDailyReward(1));
        setShowRewardModal(true);
      }
    } else {
      // First time visitor
      const newData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        todaysClaimed: false,
        weeklyBonus: false
      };
      setStreakData(newData);
      localStorage.setItem('mystic-streak-data', JSON.stringify(newData));
      setTodaysReward(getDailyReward(1));
      setShowRewardModal(true);
    }
  }, []);

  const getDailyReward = (streakDay: number): DailyReward => {
    const rewards = {
      1: { type: 'reading', title: 'Welcome Gift!', description: 'Free personalized reading', icon: faMagic },
      2: { type: 'reading', title: 'Streak Starter', description: 'Enhanced love reading', icon: faGem },
      3: { type: 'special', title: 'Mystic Boost', description: 'AI artwork generation', icon: faMagic },
      4: { type: 'reading', title: 'Career Insight', description: 'Professional guidance reading', icon: faGem },
      5: { type: 'premium', title: 'Premium Preview', description: '1-day premium features', icon: faCrown },
      6: { type: 'special', title: 'Fortune Saver', description: 'Unlimited fortune saves', icon: faMagic },
      7: { type: 'premium', title: 'Weekly Master!', description: '3-day premium unlock', icon: faCrown }
    };

    const baseReward = rewards[Math.min(streakDay, 7) as keyof typeof rewards] || rewards[7];
    
    return {
      day: streakDay,
      type: baseReward.type as 'reading' | 'premium' | 'special',
      title: baseReward.title,
      description: baseReward.description,
      icon: baseReward.icon,
      claimed: false,
      available: true
    };
  };

  const claimReward = () => {
    if (todaysReward) {
      const updatedData = {
        ...streakData,
        todaysClaimed: true
      };
      setStreakData(updatedData);
      localStorage.setItem('mystic-streak-data', JSON.stringify(updatedData));
      
      // Trigger reward logic (add to user's account)
      applyReward(todaysReward);
      
      setShowRewardModal(false);
    }
  };

  const applyReward = (reward: DailyReward) => {
    // Store reward in localStorage for the app to use
    const rewards = JSON.parse(localStorage.getItem('mystic-active-rewards') || '[]');
    rewards.push({
      ...reward,
      claimedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });
    localStorage.setItem('mystic-active-rewards', JSON.stringify(rewards));
  };

  const getStreakTier = (streak: number) => {
    if (streak >= 30) return { name: 'Cosmic Master', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
    if (streak >= 14) return { name: 'Mystical Adept', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (streak >= 7) return { name: 'Spiritual Seeker', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (streak >= 3) return { name: 'Fortune Explorer', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { name: 'Mystic Novice', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
  };

  const tier = getStreakTier(streakData.currentStreak);

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border-purple-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-orange-400" />
              <span className="font-['Cinzel'] text-amber-400">Daily Mystical Streak</span>
            </div>
            <Badge className={`${tier.bgColor} ${tier.color} border-current`}>
              {tier.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Streak Counter */}
          <div className="text-center">
            <motion.div
              key={streakData.currentStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative inline-block"
            >
              <div className="text-4xl font-bold text-amber-400 mb-1">
                {streakData.currentStreak}
              </div>
              <div className="text-sm text-white/70">day streak</div>
              
              {/* Flame animation */}
              {streakData.currentStreak > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Flame className="text-orange-400 w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Progress to next reward */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>Next reward in:</span>
              <span>{7 - (streakData.currentStreak % 7) || 7} days</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((streakData.currentStreak % 7) / 7) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <Trophy className="mx-auto mb-1 text-yellow-400 w-5 h-5" />
              <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-white/60">Best Streak</div>
            </div>
            <div className="text-center">
              <Calendar className="mx-auto mb-1 text-blue-400 w-5 h-5" />
              <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-white/60">Total Visits</div>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-1 text-purple-400 w-5 h-5" />
              <div className="text-lg font-bold text-white">{Math.floor(streakData.totalVisits / 7)}</div>
              <div className="text-xs text-white/60">Weeks Active</div>
            </div>
          </div>

          {/* Daily Reward Button */}
          {!streakData.todaysClaimed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <Button
                onClick={() => setShowRewardModal(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-400/50"
              >
                <Gift className="mr-2 w-4 h-4" />
                Claim Today's Reward
              </Button>
            </motion.div>
          )}

          {streakData.todaysClaimed && (
            <div className="text-center text-green-400 text-sm">
              ✅ Today's reward claimed! Come back tomorrow
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && todaysReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRewardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-950 to-indigo-950 border border-amber-500 rounded-xl p-8 max-w-md w-full text-center"
            >
              {/* Celebration Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: 3,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={todaysReward.icon} className="text-3xl text-white" />
                </div>
              </motion.div>

              <h3 className="font-['Cinzel'] text-2xl text-amber-400 mb-2">
                Day {streakData.currentStreak} Reward!
              </h3>
              
              <h4 className="text-xl text-white mb-2">
                {todaysReward.title}
              </h4>
              
              <p className="text-white/80 mb-6">
                {todaysReward.description}
              </p>

              {streakData.currentStreak % 7 === 0 && (
                <div className="mb-4 p-3 bg-purple-600/30 rounded-lg border border-purple-400">
                  <p className="text-purple-200 text-sm">
                    🎉 Weekly Milestone Bonus! Extra premium features unlocked!
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRewardModal(false)}
                  className="flex-1 border-purple-600 text-white hover:bg-purple-800"
                >
                  Claim Later
                </Button>
                <Button
                  onClick={claimReward}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  <Zap className="mr-2 w-4 h-4" />
                  Claim Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}