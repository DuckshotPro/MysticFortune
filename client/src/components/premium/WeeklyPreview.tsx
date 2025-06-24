import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCalendarWeek, faStar } from "@fortawesome/free-solid-svg-icons";
import { getWeeklyPreview, getDayTheme } from "@/lib/contentRotation";
import { hasPremiumAccess } from "@/lib/premiumUtils";

export function WeeklyPreview() {
  const [showPreview, setShowPreview] = useState(false);
  const weeklyData = getWeeklyPreview();
  const todayTheme = getDayTheme();
  const isPremium = hasPremiumAccess();

  if (!showPreview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-4 border border-amber-500/30"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarWeek} className="text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Weekly Fortune Preview</h3>
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <FontAwesomeIcon icon={faCrown} className="mr-1 text-xs" />
              Premium
            </Badge>
          </div>
        </div>
        
        <p className="text-white/80 text-sm mb-4">
          Get a sneak peek at this week's cosmic themes and energy patterns. Today's theme: <span className="text-amber-400 font-semibold">{todayTheme.theme}</span>
        </p>
        
        <Button
          onClick={() => setShowPreview(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-purple-950"
          disabled={!isPremium}
        >
          <FontAwesomeIcon icon={faStar} className="mr-2" />
          {isPremium ? "View Weekly Preview" : "Upgrade for Weekly Preview"}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-amber-400">This Week's Cosmic Journey</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(false)}
          className="text-white/70 hover:text-white"
        >
          Close Preview
        </Button>
      </div>

      <div className="grid gap-3">
        {weeklyData.map((day, index) => {
          const isToday = day.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
          
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${
                isToday 
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 border-amber-500/50' 
                  : 'bg-purple-900/30 border-purple-700/50'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-sm ${isToday ? 'text-amber-400' : 'text-white'}`}>
                      {day.day}
                      {isToday && <Badge className="ml-2 bg-amber-500 text-purple-950">Today</Badge>}
                    </CardTitle>
                    <span className={`text-xs ${isToday ? 'text-amber-300' : 'text-white/60'}`}>
                      {day.energy}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className={`font-semibold mb-1 ${isToday ? 'text-amber-300' : 'text-purple-300'}`}>
                    {day.theme}
                  </h4>
                  <p className={`text-xs ${isToday ? 'text-white' : 'text-white/80'}`}>
                    {day.focus}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}