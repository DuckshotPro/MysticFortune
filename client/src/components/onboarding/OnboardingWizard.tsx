import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Heart, Briefcase, Star, ArrowRight, ArrowLeft, Gift } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHandSparkles } from "@fortawesome/free-solid-svg-icons";

interface OnboardingData {
  name: string;
  birthDate: string;
  primaryInterest: 'love' | 'career' | 'general';
  experience: 'beginner' | 'curious' | 'experienced';
  goals: string[];
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    birthDate: '',
    primaryInterest: 'general',
    experience: 'curious',
    goals: []
  });

  // Eye-catching floating elements animation
  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 3 + Math.random() * 2
  }));

  const steps = [
    {
      title: "✨ Welcome to Your Mystical Journey",
      subtitle: "Let's personalize your fortune-telling experience",
      component: WelcomeStep
    },
    {
      title: "🌟 Tell us about yourself",
      subtitle: "Your cosmic signature helps us provide better guidance",
      component: PersonalInfoStep
    },
    {
      title: "🔮 What draws you to mystical wisdom?",
      subtitle: "Understanding your path helps us guide you better",
      component: InterestStep
    },
    {
      title: "⭐ Your mystical experience level",
      subtitle: "This helps us tailor the perfect experience for you",
      component: ExperienceStep
    },
    {
      title: "🎯 What would you like guidance on?",
      subtitle: "Select all areas where you seek insight",
      component: GoalsStep
    },
    {
      title: "🎉 Your personalized experience awaits!",
      subtitle: "We've prepared something special just for you",
      component: CompletionStep
    }
  ];

  const currentStep = steps[step];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-60"
            animate={{
              y: [-20, -100],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-amber-400 font-medium">Step {step + 1} of {steps.length}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSkip}
                className="text-white/60 hover:text-white"
              >
                Skip for now
              </Button>
            </div>
            <div className="w-full bg-purple-800 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <Card className="bg-black/20 border-purple-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-['Cinzel'] text-3xl mb-2 text-amber-400">
                    {currentStep.title}
                  </h2>
                  <p className="text-white/80 text-lg">
                    {currentStep.subtitle}
                  </p>
                </div>

                <currentStep.component 
                  data={data} 
                  updateData={updateData}
                  onNext={nextStep}
                />
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="border-purple-600 text-white hover:bg-purple-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {step < steps.length - 1 && (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(step, data)}
                    className="bg-amber-500 hover:bg-amber-600 text-purple-950"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Individual Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-8">
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <FontAwesomeIcon icon={faGem} className="text-6xl text-amber-400" />
      </motion.div>
      
      <p className="text-xl text-white/90 mb-8">
        You're about to embark on a personalized mystical journey. We'll create a unique experience 
        tailored just for you based on your cosmic signature and spiritual interests.
      </p>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <Heart className="mx-auto mb-2 text-pink-400" size={32} />
          <p className="text-sm text-white/80">Love & Relationships</p>
        </div>
        <div className="text-center">
          <Briefcase className="mx-auto mb-2 text-blue-400" size={32} />
          <p className="text-sm text-white/80">Career & Success</p>
        </div>
        <div className="text-center">
          <Star className="mx-auto mb-2 text-yellow-400" size={32} />
          <p className="text-sm text-white/80">Life Guidance</p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        size="lg"
        className="bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 text-white px-8 py-3"
      >
        <FontAwesomeIcon icon={faHandSparkles} className="mr-2" />
        Begin My Journey
      </Button>
    </div>
  );
}

function PersonalInfoStep({ data, updateData }: { data: OnboardingData, updateData: (updates: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-amber-400 font-medium">What should we call you?</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter your name or mystical alias"
          className="mt-2 bg-purple-900/50 border-purple-700 text-white placeholder:text-white/50"
        />
        <p className="text-sm text-white/60 mt-1">This helps us personalize your experience</p>
      </div>

      <div>
        <Label htmlFor="birthDate" className="text-amber-400 font-medium">Your birth date (for zodiac insights)</Label>
        <Input
          id="birthDate"
          type="date"
          value={data.birthDate}
          onChange={(e) => updateData({ birthDate: e.target.value })}
          className="mt-2 bg-purple-900/50 border-purple-700 text-white"
        />
        <p className="text-sm text-white/60 mt-1">We'll use this to determine your zodiac sign and cosmic influences</p>
      </div>
    </div>
  );
}

function InterestStep({ data, updateData }: { data: OnboardingData, updateData: (updates: Partial<OnboardingData>) => void }) {
  const interests = [
    { id: 'love' as const, icon: Heart, label: 'Love & Relationships', desc: 'Romantic guidance and relationship insights' },
    { id: 'career' as const, icon: Briefcase, label: 'Career & Success', desc: 'Professional growth and life purpose' },
    { id: 'general' as const, icon: Star, label: 'General Life Guidance', desc: 'Overall life direction and spiritual growth' }
  ];

  return (
    <div className="grid gap-4">
      {interests.map((interest) => {
        const Icon = interest.icon;
        const isSelected = data.primaryInterest === interest.id;
        
        return (
          <motion.div
            key={interest.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-amber-500/20 border-amber-500 shadow-lg' 
                  : 'bg-purple-900/30 border-purple-700 hover:bg-purple-800/30'
              }`}
              onClick={() => updateData({ primaryInterest: interest.id })}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <Icon className={`h-8 w-8 ${isSelected ? 'text-amber-400' : 'text-white/70'}`} />
                <div>
                  <h3 className={`font-medium ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                    {interest.label}
                  </h3>
                  <p className="text-sm text-white/60">{interest.desc}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <FontAwesomeIcon icon={faGem} className="text-amber-400" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function ExperienceStep({ data, updateData }: { data: OnboardingData, updateData: (updates: Partial<OnboardingData>) => void }) {
  const experiences = [
    { id: 'beginner' as const, label: 'New to this', desc: 'I\'m just starting to explore mystical guidance' },
    { id: 'curious' as const, label: 'Casually curious', desc: 'I enjoy fortune telling for fun and insights' },
    { id: 'experienced' as const, label: 'Spiritually experienced', desc: 'I regularly seek mystical guidance in my life' }
  ];

  return (
    <div className="grid gap-4">
      {experiences.map((exp) => {
        const isSelected = data.experience === exp.id;
        
        return (
          <motion.div
            key={exp.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-amber-500/20 border-amber-500' 
                  : 'bg-purple-900/30 border-purple-700 hover:bg-purple-800/30'
              }`}
              onClick={() => updateData({ experience: exp.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                      {exp.label}
                    </h3>
                    <p className="text-sm text-white/60 mt-1">{exp.desc}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Sparkles className="text-amber-400" size={24} />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function GoalsStep({ data, updateData }: { data: OnboardingData, updateData: (updates: Partial<OnboardingData>) => void }) {
  const goals = [
    'Find love or improve relationships',
    'Advance my career or find my purpose',
    'Make important life decisions',
    'Understand myself better',
    'Navigate challenging situations',
    'Explore my spiritual side',
    'Have fun and entertainment',
    'Connect with cosmic wisdom'
  ];

  const toggleGoal = (goal: string) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : [...data.goals, goal];
    updateData({ goals: newGoals });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {goals.map((goal, index) => {
        const isSelected = data.goals.includes(goal);
        
        return (
          <motion.div
            key={goal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-500' 
                  : 'bg-purple-900/30 border-purple-700 hover:bg-purple-800/30'
              }`}
              onClick={() => toggleGoal(goal)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <span className={`text-sm ${isSelected ? 'text-amber-400 font-medium' : 'text-white'}`}>
                  {goal}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-amber-400"
                  >
                    ✨
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function CompletionStep({ data, onNext }: { data: OnboardingData, onNext: () => void }) {
  const getZodiacSign = (birthDate: string) => {
    if (!birthDate) return "mystic soul";
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified zodiac calculation
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    // Add more signs as needed...
    return "cosmic being";
  };

  return (
    <div className="text-center py-6">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <Gift className="mx-auto text-6xl text-amber-400" />
      </motion.div>

      <h3 className="text-2xl font-['Cinzel'] text-amber-400 mb-4">
        Perfect, {data.name || "mystical seeker"}!
      </h3>
      
      <div className="bg-purple-900/50 rounded-lg p-6 mb-6">
        <p className="text-white/90 mb-4">
          We've prepared a personalized mystical experience for you as a {getZodiacSign(data.birthDate)} seeking {data.primaryInterest} guidance.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {data.goals.slice(0, 3).map((goal) => (
            <span key={goal} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
              {goal}
            </span>
          ))}
          {data.goals.length > 3 && (
            <span className="bg-purple-700/50 text-white/70 px-3 py-1 rounded-full text-sm">
              +{data.goals.length - 3} more
            </span>
          )}
        </div>
      </div>

      <p className="text-lg text-white/80 mb-6">
        🎁 As a welcome gift, you'll get your first personalized reading absolutely free!
      </p>

      <Button 
        onClick={onNext}
        size="lg"
        className="bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 hover:from-amber-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg"
      >
        <FontAwesomeIcon icon={faGem} className="mr-2" />
        Enter My Mystical Experience
      </Button>
    </div>
  );
}

// Validation function
function isStepValid(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 0: return true; // Welcome step
    case 1: return data.name.trim().length > 0; // Name is required
    case 2: return !!data.primaryInterest; // Interest is required
    case 3: return !!data.experience; // Experience level required
    case 4: return data.goals.length > 0; // At least one goal
    case 5: return true; // Completion step
    default: return true;
  }
}