import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, X, Lightbulb, Sparkles } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandSparkles, faMagic } from "@fortawesome/free-solid-svg-icons";

interface TourStep {
  id: string;
  title: string;
  content: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  spotlight?: boolean;
}

interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '✨ Welcome to MysticFortune!',
    content: 'Let me show you around your personalized mystical experience. This will only take a minute!',
    targetSelector: 'body',
    position: 'center',
    spotlight: true
  },
  {
    id: 'hero',
    title: '🔮 Your Mystical Journey Begins',
    content: 'This is where your destiny unfolds! Click the button below to get your first free reading.',
    targetSelector: '[href="#fortune-teller"]',
    position: 'bottom',
    spotlight: true
  },
  {
    id: 'crystal-ball',
    title: '🎭 Choose Your Fortune Teller',
    content: 'Select different categories for personalized insights: Love, Career, or General guidance. Each reading is AI-powered and unique to you!',
    targetSelector: '#fortune-teller',
    position: 'top',
    spotlight: true
  },
  {
    id: 'categories',
    title: '📊 Fortune Categories',
    content: 'Pick what speaks to your heart today. Your zodiac sign and preferences make each reading special!',
    targetSelector: '.grid-cols-3',
    position: 'right',
    spotlight: true
  },
  {
    id: 'daily-streak',
    title: '🔥 Daily Mystical Streaks',
    content: 'Come back daily to build your streak and unlock special rewards! The longer your streak, the better your bonuses.',
    targetSelector: '[data-tour="daily-streak"]',
    position: 'left'
  },
  {
    id: 'share',
    title: '📱 Share Your Fortunes',
    content: 'Got an amazing reading? Share it with friends and earn mystical points! Beautiful shareable images are generated automatically.',
    targetSelector: '[data-tour="share-system"]',
    position: 'top'
  },
  {
    id: 'premium',
    title: '💎 Premium Mystical Experience',
    content: 'Unlock advanced features, detailed insights, and exclusive AI artwork with our premium experience.',
    targetSelector: '[href="/premium"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: '🎉 You\'re Ready!',
    content: 'You\'re all set to explore the mystical universe! Remember, your first reading is completely free. Enjoy your journey!',
    targetSelector: 'body',
    position: 'center',
    spotlight: true
  }
];

export default function GuidedTour({ isActive, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = tourSteps[currentStep];

  useEffect(() => {
    if (!isActive) return;

    let retryCount = 0;
    const maxRetries = 50; // 5 seconds at 100ms interval
    let retryInterval: NodeJS.Timeout;

    const findTarget = () => {
      const target = document.querySelector(step.targetSelector) as HTMLElement;
      
      if (target) {
        setTargetElement(target);
        // Only clear interval if we successfully found target
        if (retryInterval) clearInterval(retryInterval);
        
        if (step.position !== 'center') {
          const rect = target.getBoundingClientRect();
          const tooltipOffset = 20;

          let x = rect.left + rect.width / 2;
          let y = rect.top;

          switch (step.position) {
            case 'top':
              y = rect.top - tooltipOffset;
              break;
            case 'bottom':
              y = rect.bottom + tooltipOffset;
              break;
            case 'left':
              x = rect.left - tooltipOffset;
              y = rect.top + rect.height / 2;
              break;
            case 'right':
              x = rect.right + tooltipOffset;
              y = rect.top + rect.height / 2;
              break;
          }

          setTooltipPosition({ x, y });
        }
      } else {
        // Increment retry count
        retryCount++;
        if (retryCount >= maxRetries && retryInterval) {
          clearInterval(retryInterval);
          console.warn(`Tour step target not found: ${step.targetSelector}`);
        }
        
        // If it's a center position step (like welcome), we might not need a specific target
        // allowing the modal to show even if target isn't found
        if (step.position === 'center') {
           setTargetElement(document.body);
        }
      }
    };

    // Initial check
    findTarget();
    
    // Retry mechanism to handle dynamic loading or layout shifts
    retryInterval = setInterval(findTarget, 100);

    // Re-find target on resize
    window.addEventListener('resize', findTarget);

    return () => {
      window.removeEventListener('resize', findTarget);
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [step, isActive]);

  useEffect(() => {
    if (!isActive) return;

    // Scroll target into view
    if (targetElement && step.position !== 'center') {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }

    // Execute step action if any
    if (step.action) {
      setTimeout(step.action, 500);
    }
  }, [currentStep, targetElement, isActive]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('mystic-tour-completed', 'true');
    onComplete();
  };

  const skipTour = () => {
    localStorage.setItem('mystic-tour-skipped', 'true');
    onSkip();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay with spotlight effect */}
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 pointer-events-auto"
        style={{
          background: step.spotlight && targetElement 
            ? `radial-gradient(circle at ${targetElement.getBoundingClientRect().left + targetElement.getBoundingClientRect().width/2}px ${targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height/2}px, transparent 100px, rgba(0,0,0,0.8) 200px)`
            : 'rgba(0,0,0,0.7)'
        }}
      />

      {/* Target highlight */}
      {targetElement && step.spotlight && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute border-2 border-amber-400 rounded-lg shadow-lg shadow-amber-400/50 pointer-events-none"
          style={{
            left: targetElement.getBoundingClientRect().left - 4,
            top: targetElement.getBoundingClientRect().top - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8
          }}
        />
      )}

      {/* Pulsing indicator */}
      {targetElement && step.spotlight && (
        <motion.div
          className="absolute w-4 h-4 bg-amber-400 rounded-full pointer-events-none"
          style={{
            left: targetElement.getBoundingClientRect().right - 8,
            top: targetElement.getBoundingClientRect().top - 8
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Tour tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="absolute pointer-events-auto"
          style={{
            left: step.position === 'center' ? '50%' : tooltipPosition.x,
            top: step.position === 'center' ? '50%' : tooltipPosition.y,
            transform: step.position === 'center' ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
            maxWidth: '90vw',
            width: step.position === 'center' ? '400px' : '300px'
          }}
        >
          <Card className="bg-gradient-to-br from-purple-950 to-indigo-950 border border-amber-500 shadow-xl shadow-purple-500/20">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <FontAwesomeIcon icon={faHandSparkles} className="text-amber-400" />
                  </motion.div>
                  <span className="text-sm text-amber-400 font-medium">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={skipTour}
                  className="text-white/70 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-purple-900/50 rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="font-['Cinzel'] text-xl text-amber-400 mb-2">
                  {step.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {step.content}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-purple-600 text-white hover:bg-purple-800"
                >
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Back
                </Button>

                <div className="flex space-x-2">
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipTour}
                        className="text-white/70 hover:text-white"
                      >
                        Skip Tour
                      </Button>
                      <Button
                        size="sm"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600"
                      >
                        Next
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={completeTour}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      <FontAwesomeIcon icon={faMagic} className="mr-2" />
                      Start Exploring!
                    </Button>
                  )}
                </div>
              </div>

              {/* Helpful tip */}
              {step.id !== 'complete' && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">
                      {getContextualTip(step.id)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arrow pointer for positioned tooltips */}
          {step.position !== 'center' && (
            <div
              className={`absolute w-4 h-4 bg-purple-950 border border-amber-500 transform rotate-45 ${
                step.position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
                step.position === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2' :
                step.position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2' :
                'left-[-8px] top-1/2 -translate-y-1/2'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating mystical elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 20}%`,
              top: '80%'
            }}
          >
            <Sparkles className="text-amber-400 w-4 h-4" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function getContextualTip(stepId: string): string {
  const tips: Record<string, string> = {
    'hero': 'Pro tip: Your first reading is completely free and personalized to your zodiac sign!',
    'crystal-ball': 'Try different categories to see how our AI adapts to your interests.',
    'categories': 'Your birth date influences the cosmic insights you receive.',
    'daily-streak': 'Daily visitors get the best rewards and unlock special features.',
    'share': 'Sharing your fortunes on social media earns you mystical points!',
    'premium': 'Premium users get unlimited readings and exclusive AI artwork.'
  };
  
  return tips[stepId] || 'Take your time exploring - everything is designed for your mystical journey.';
}