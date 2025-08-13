import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faCrown, faCoins, faStar, faFire, faGem, faTrophy, faLock, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface DailyReward {
  day: number;
  reward: string;
  icon: any;
  value: number;
  color: string;
  claimed: boolean;
}

export default function DailyRewardSystem() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const { toast } = useToast();

  const dailyRewards: DailyReward[] = [
    { day: 1, reward: "50 Mystic Coins", icon: faCoins, value: 50, color: "from-yellow-400 to-amber-500", claimed: false },
    { day: 2, reward: "100 Mystic Coins", icon: faCoins, value: 100, color: "from-yellow-400 to-amber-500", claimed: false },
    { day: 3, reward: "Free Fortune Reading", icon: faStar, value: 1, color: "from-purple-400 to-indigo-500", claimed: false },
    { day: 4, reward: "150 Mystic Coins", icon: faCoins, value: 150, color: "from-yellow-400 to-amber-500", claimed: false },
    { day: 5, reward: "Premium Tarot Spread", icon: faGem, value: 1, color: "from-blue-400 to-cyan-500", claimed: false },
    { day: 6, reward: "200 Mystic Coins", icon: faCoins, value: 200, color: "from-yellow-400 to-amber-500", claimed: false },
    { day: 7, reward: "Weekly Bonus Pack", icon: faCrown, value: 500, color: "from-amber-400 to-yellow-600", claimed: false }
  ];

  useEffect(() => {
    // Load saved data from localStorage
    const savedStreak = localStorage.getItem('dailyStreak');
    const savedLastClaim = localStorage.getItem('lastClaimDate');
    const savedCoins = localStorage.getItem('mysticCoins');
    
    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedLastClaim) setLastClaimDate(savedLastClaim);
    if (savedCoins) setTotalCoins(parseInt(savedCoins));
    
    // Check if user can claim today
    const today = new Date().toDateString();
    if (savedLastClaim !== today) {
      setCanClaimToday(true);
      
      // Check if streak should be reset (missed a day)
      if (savedLastClaim) {
        const lastClaim = new Date(savedLastClaim);
        const daysDiff = Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) {
          setCurrentStreak(0);
          localStorage.setItem('dailyStreak', '0');
        }
      }
    }
  }, []);

  const claimDailyReward = () => {
    if (!canClaimToday) {
      toast({
        title: "Already Claimed",
        description: "Come back tomorrow for your next reward!",
        variant: "destructive"
      });
      return;
    }

    const newStreak = currentStreak + 1;
    const today = new Date().toDateString();
    const rewardIndex = ((newStreak - 1) % 7);
    const todayReward = dailyRewards[rewardIndex];
    
    // Update state
    setCurrentStreak(newStreak);
    setLastClaimDate(today);
    setCanClaimToday(false);
    setShowRewardAnimation(true);
    
    // Update coins if it's a coin reward
    if (todayReward.icon === faCoins) {
      const newTotal = totalCoins + todayReward.value;
      setTotalCoins(newTotal);
      localStorage.setItem('mysticCoins', newTotal.toString());
    }
    
    // Save to localStorage
    localStorage.setItem('dailyStreak', newStreak.toString());
    localStorage.setItem('lastClaimDate', today);
    
    // Show success message
    toast({
      title: "Reward Claimed!",
      description: `You received ${todayReward.reward}! Current streak: ${newStreak} days`,
    });
    
    // Hide animation after 3 seconds
    setTimeout(() => setShowRewardAnimation(false), 3000);
  };

  const getStreakBonus = () => {
    if (currentStreak >= 30) return { multiplier: 3, title: "Legendary Mystic" };
    if (currentStreak >= 14) return { multiplier: 2, title: "Master Fortune Teller" };
    if (currentStreak >= 7) return { multiplier: 1.5, title: "Apprentice Seer" };
    return { multiplier: 1, title: "Novice Seeker" };
  };

  const streakBonus = getStreakBonus();

  return (
    <section className="py-12 relative">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 py-3 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 flex items-center justify-center gap-3"
        >
          <FontAwesomeIcon icon={faGift} className="text-2xl text-white animate-bounce" />
          <h2 className="font-['Cinzel'] text-xl md:text-2xl text-white font-bold">
            Daily Rewards Available!
          </h2>
          <FontAwesomeIcon icon={faStar} className="text-2xl text-white animate-pulse" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-6xl mx-auto">
          {/* Streak & Coins Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Current Streak */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 border-2 border-amber-500/50 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Current Streak</p>
                  <p className="text-3xl font-bold text-white flex items-center gap-2">
                    {currentStreak}
                    <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                  </p>
                  <p className="text-amber-400 text-xs mt-1">{streakBonus.title}</p>
                </div>
                <FontAwesomeIcon icon={faTrophy} className="text-4xl text-amber-500" />
              </div>
            </motion.div>

            {/* Mystic Coins */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-amber-900 to-yellow-900 rounded-xl p-6 border-2 border-amber-500/50 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-300 text-sm">Mystic Coins</p>
                  <p className="text-3xl font-bold text-white">{totalCoins.toLocaleString()}</p>
                  <p className="text-amber-400 text-xs mt-1">x{streakBonus.multiplier} Bonus Active</p>
                </div>
                <FontAwesomeIcon icon={faCoins} className="text-4xl text-yellow-500" />
              </div>
            </motion.div>

            {/* Claim Button */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <Button
                onClick={claimDailyReward}
                disabled={!canClaimToday}
                className={`w-full h-full py-8 text-lg font-bold shadow-2xl transform transition-all ${
                  canClaimToday 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-purple-950 hover:scale-105 animate-pulse" 
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {canClaimToday ? (
                  <>
                    <FontAwesomeIcon icon={faGift} className="mr-2 text-2xl" />
                    Claim Today's Reward
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="mr-2 text-2xl" />
                    Claimed! Come Back Tomorrow
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Weekly Rewards Grid */}
          <div className="bg-purple-950/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30">
            <h3 className="font-['Cinzel'] text-2xl text-amber-400 mb-4 text-center">
              7-Day Reward Cycle
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {dailyRewards.map((reward, index) => {
                const isCurrentDay = (currentStreak % 7) === index;
                const isClaimed = (currentStreak % 7) > index || (currentStreak > 0 && index === 6 && (currentStreak % 7) === 0);
                const isLocked = !isClaimed && !isCurrentDay && !canClaimToday;
                
                return (
                  <motion.div
                    key={reward.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-lg p-4 text-center border-2 transition-all ${
                      isCurrentDay && canClaimToday
                        ? "border-amber-500 bg-gradient-to-br from-amber-900/50 to-yellow-900/50 scale-105 shadow-xl" 
                        : isClaimed
                        ? "border-green-500/50 bg-green-900/20"
                        : "border-purple-600/50 bg-purple-900/30"
                    }`}
                  >
                    {/* Day Number */}
                    <div className="text-xs text-purple-300 mb-2">Day {reward.day}</div>
                    
                    {/* Reward Icon */}
                    <div className={`mb-2 ${isLocked ? "opacity-50" : ""}`}>
                      <FontAwesomeIcon 
                        icon={isLocked ? faLock : reward.icon} 
                        className={`text-3xl ${
                          isClaimed ? "text-green-500" : 
                          isCurrentDay && canClaimToday ? "text-amber-500 animate-bounce" : 
                          "text-purple-400"
                        }`}
                      />
                    </div>
                    
                    {/* Reward Text */}
                    <p className={`text-xs ${
                      isClaimed ? "text-green-400" : 
                      isCurrentDay && canClaimToday ? "text-amber-400 font-bold" : 
                      "text-purple-300"
                    }`}>
                      {reward.reward}
                    </p>
                    
                    {/* Status Badge */}
                    {isClaimed && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <FontAwesomeIcon icon={faCheck} className="text-xs text-white" />
                      </div>
                    )}
                    
                    {isCurrentDay && canClaimToday && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1 animate-pulse">
                        <FontAwesomeIcon icon={faStar} className="text-xs text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-purple-300 mb-2">
                <span>Weekly Progress</span>
                <span>{(currentStreak % 7) || (currentStreak > 0 ? 7 : 0)}/7 Days</span>
              </div>
              <Progress value={((currentStreak % 7) || (currentStreak > 0 ? 7 : 0)) * 14.3} className="h-3" />
            </div>
          </div>

          {/* Reward Animation Overlay */}
          <AnimatePresence>
            {showRewardAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FontAwesomeIcon icon={faGift} className="text-8xl text-amber-500 mb-4" />
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-['Cinzel'] text-4xl text-amber-500 font-bold"
                  >
                    Reward Claimed!
                  </motion.h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}