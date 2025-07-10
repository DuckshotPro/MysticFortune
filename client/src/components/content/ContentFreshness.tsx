
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faClock, faStar } from "@fortawesome/free-solid-svg-icons";

export function ContentFreshness() {
  const [dailyContentCount, setDailyContentCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Calculate how much content is available today
    const today = new Date();
    const categories = 3; // love, career, general
    const fortuneVariations = 8; // per category
    const seasonalVariations = 4; // per season
    const dailyThemeBonus = 1; // daily theme modifier
    
    const totalDaily = categories * fortuneVariations * seasonalVariations * dailyThemeBonus;
    setDailyContentCount(totalDaily);
    setLastUpdated(today.toLocaleTimeString());

    // Update every hour
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className="bg-purple-900/95 border-amber-500/50 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-white">
            <FontAwesomeIcon icon={faRefresh} className="text-amber-500 animate-pulse" />
            <div className="text-xs">
              <div className="font-semibold">{dailyContentCount}+ Fresh</div>
              <div className="text-white/70">Updated {lastUpdated}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
</motion.div>

export default ContentFreshness;
