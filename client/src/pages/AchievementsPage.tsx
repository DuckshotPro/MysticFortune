import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import AchievementDashboard from '@/components/achievements/AchievementDashboard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
  // Mock user ID for demo - in a real app this would come from authentication
  const userId = 1;

  useEffect(() => {
    // Track that user visited achievements page
    fetch(`/api/track-activity/${userId}`, { method: 'POST' })
      .catch(error => console.error('Failed to track activity:', error));
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950">
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-purple-950/80 backdrop-blur-md border-b border-purple-800/30"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fortune Teller
              </Button>
            </Link>
            <h1 className="text-xl font-['Cinzel'] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
              Achievement Center
            </h1>
            <div></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </motion.div>

      {/* Achievement Dashboard */}
      <AchievementDashboard userId={userId} />
    </div>
  );
}