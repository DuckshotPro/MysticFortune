import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap, Star, Gift, Lock, Check, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faCrystalBall, faMagic, faInfinity } from "@fortawesome/free-solid-svg-icons";

interface PremiumShowcaseProps {
  onUpgrade: () => void;
  currentPlan?: 'free' | 'premium' | 'mystic';
}

export default function PremiumShowcase({ onUpgrade, currentPlan = 'free' }: PremiumShowcaseProps) {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'mystic'>('premium');
  const [showComparison, setShowComparison] = useState(false);
  const [userSavings, setUserSavings] = useState(0);

  // Calculate potential savings based on usage
  useEffect(() => {
    const dailyReadings = parseInt(localStorage.getItem('daily-readings-count') || '3');
    const monthlySavings = dailyReadings * 0.99 * 30; // $0.99 per reading
    setUserSavings(monthlySavings);
  }, []);

  const plans = {
    premium: {
      name: "Mystical Premium",
      price: 9.99,
      originalPrice: 19.99,
      icon: faGem,
      color: "from-purple-500 to-pink-500",
      features: [
        "Unlimited personalized readings",
        "AI-generated mystical artwork",
        "Advanced zodiac compatibility",
        "Daily cosmic insights",
        "Priority customer support",
        "No ads experience",
        "Share unlimited fortunes",
        "Weekly detailed horoscopes"
      ],
      badge: "Most Popular",
      badgeColor: "bg-green-500"
    },
    mystic: {
      name: "Cosmic Master",
      price: 19.99,
      originalPrice: 39.99,
      icon: faCrystalBall,
      color: "from-amber-500 to-orange-500",
      features: [
        "Everything in Premium",
        "Personal mystical advisor",
        "Custom tarot readings",
        "Detailed life path analysis",
        "Monthly 1-on-1 consultation",
        "Exclusive AI models",
        "Early access to features",
        "Mystical community access",
        "Personalized crystals guide"
      ],
      badge: "Ultimate Experience",
      badgeColor: "bg-amber-500"
    }
  };

  const freeFeatures = [
    "3 daily readings",
    "Basic horoscopes",
    "Limited sharing",
    "Standard support"
  ];

  const plan = plans[selectedPlan];

  return (
    <div className="space-y-6">
      {/* Value Proposition Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Crown className="text-amber-400 w-8 h-8" />
          </motion.div>
          <h2 className="font-['Cinzel'] text-3xl text-amber-400">Unlock Your Mystical Potential</h2>
        </div>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Join thousands who've discovered their true destiny through our premium mystical experience
        </p>
      </motion.div>

      {/* Urgency Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-lg text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <p className="text-white font-medium relative z-10">
          🔥 Limited Time: 50% OFF Premium Plans • Only 24 hours left!
        </p>
      </motion.div>

      {/* Plan Selection Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-purple-950/50 p-1 rounded-lg border border-purple-700">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((planKey) => (
            <button
              key={planKey}
              onClick={() => setSelectedPlan(planKey)}
              className={`px-6 py-2 rounded-md transition-all relative ${
                selectedPlan === planKey
                  ? 'bg-amber-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {plans[planKey].name}
              {plans[planKey].badge && selectedPlan === planKey && (
                <motion.div
                  layoutId="selected-plan"
                  className={`absolute -top-2 -right-2 ${plans[planKey].badgeColor} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {plans[planKey].badge}
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Selected Plan Card */}
        <motion.div
          key={selectedPlan}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`bg-gradient-to-br ${plan.color} border-0 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <FontAwesomeIcon icon={plan.icon} className="text-4xl" />
                {plan.badge && (
                  <Badge className={`${plan.badgeColor} text-white border-0`}>
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-['Cinzel']">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-lg">/month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 line-through">${plan.originalPrice}</span>
                  <Badge className="bg-green-500 text-white border-0">
                    Save ${plan.originalPrice - plan.price}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                onClick={onUpgrade}
                className="w-full bg-white text-purple-900 hover:bg-white/90 font-bold py-3 text-lg"
                size="lg"
              >
                <Crown className="mr-2 w-5 h-5" />
                Upgrade Now
              </Button>

              <p className="text-center text-white/70 text-sm mt-3">
                ✨ 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits & Social Proof */}
        <div className="space-y-6">
          {/* User Savings Calculator */}
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-['Cinzel'] text-green-400 mb-4">
                💰 Your Potential Savings
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${userSavings.toFixed(0)}/month
              </div>
              <p className="text-white/80 text-sm">
                Based on your reading frequency vs. individual pricing
              </p>
            </CardContent>
          </Card>

          {/* Feature Comparison */}
          <Card className="bg-purple-950/30 border-purple-700">
            <CardHeader>
              <CardTitle className="text-amber-400 font-['Cinzel'] flex items-center">
                <Zap className="mr-2" />
                Free vs Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Free Plan</h4>
                  <ul className="space-y-1">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-white/70">
                        <X className="w-4 h-4 text-red-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-amber-400 font-medium mb-2">Premium Benefits</h4>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-white/90">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-amber-400 font-bold">12,847 mystic seekers</div>
                  <div className="text-white/70 text-sm">upgraded this month</div>
                </div>
              </div>
              
              <div className="bg-purple-950/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-white/80 text-sm">4.9/5 average rating</span>
                </div>
                <p className="text-white/90 italic">
                  "The AI insights are incredibly accurate. I've made major life decisions based on the guidance!"
                </p>
                <p className="text-white/60 text-sm mt-2">- Sarah M., Premium Member</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="bg-purple-950/30 border-purple-700">
        <CardHeader>
          <CardTitle className="text-amber-400 font-['Cinzel']">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! Cancel your subscription anytime with one click. No hidden fees or commitments."
            },
            {
              q: "How accurate are the AI predictions?",
              a: "Our AI combines ancient mystical wisdom with modern algorithms, trained on thousands of accurate readings."
            },
            {
              q: "What makes premium readings different?",
              a: "Premium readings include detailed analysis, personalized artwork, and deeper insights based on your complete astrological profile."
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-purple-700/50 pb-4 last:border-b-0">
              <h4 className="text-white font-medium mb-2">{faq.q}</h4>
              <p className="text-white/70">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Final CTA */}
      <motion.div
        className="text-center py-8"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Button
          onClick={onUpgrade}
          size="lg"
          className={`bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold px-12 py-4 text-xl border-0`}
        >
          <FontAwesomeIcon icon={faMagic} className="mr-3" />
          Unlock My Destiny - ${plan.price}/month
        </Button>
        <p className="text-white/60 text-sm mt-3">
          Join now and get your first premium reading free!
        </p>
      </motion.div>
    </div>
  );
}