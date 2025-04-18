import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faLock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface PremiumFeatureProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  isPremium?: boolean; // If true, the feature is unlocked for premium users
}

export function PremiumFeature({ 
  title, 
  description, 
  icon, 
  className = '',
  isPremium = false
}: PremiumFeatureProps) {
  return (
    <Card className={`overflow-hidden ${isPremium ? 'border-amber-500/30' : 'border-purple-700/70'} ${className}`}>
      <div className="relative">
        {!isPremium && (
          <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-purple-900/80 p-5 rounded-lg border border-purple-700 text-center max-w-xs"
            >
              <FontAwesomeIcon 
                icon={faLock} 
                className="text-amber-500 text-2xl mb-3" 
              />
              <h4 className="font-['Cinzel'] text-lg text-amber-500 mb-2">Premium Feature</h4>
              <p className="text-white/80 text-sm mb-4">
                This advanced feature is available exclusively to premium subscribers.
              </p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950">
                  <FontAwesomeIcon icon={faCrown} className="mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
        
        <CardContent className={`p-5 ${!isPremium && 'blur-[2px]'}`}>
          <div className="flex items-start gap-4">
            {icon && (
              <div className="text-amber-500 text-2xl mt-1">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-['Cinzel'] text-lg text-amber-500 mb-2">{title}</h3>
              <p className="text-white/80 text-sm">{description}</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}