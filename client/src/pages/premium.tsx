import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCheck, faTimes, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { CheckoutForm } from "@/components/monetization/CheckoutForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { hasPremiumAccess, setPremiumStatus } from "@/lib/premiumUtils";

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const { toast } = useToast();
  
  // Check for existing premium status on load
  useEffect(() => {
    const premiumStatus = hasPremiumAccess();
    setHasPremium(premiumStatus);
    setIsPurchaseComplete(premiumStatus);
  }, []);
  
  const handleSubscribe = (plan: "monthly" | "annual") => {
    if (hasPremium) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active premium subscription.",
        variant: "default",
      });
      return;
    }
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };
  
  const handleCancelSubscription = () => {
    setPremiumStatus(false);
    setHasPremium(false);
    setIsPurchaseComplete(false);
    toast({
      title: "Subscription Cancelled",
      description: "Your premium subscription has been cancelled.",
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-purple-950 text-white font-['Montserrat']">
      <Header />
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h1 className="font-['Cinzel'] text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
                Unlock Your Full Mystical Potential
              </h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Become a premium member to access exclusive fortune readings, in-depth insights, 
                and personalized guidance on your spiritual journey.
              </p>
            </div>
            
            <div className="flex justify-center mb-10">
              <div className="bg-purple-900/50 p-1 rounded-full">
                <Button 
                  className={`rounded-full px-8 ${selectedPlan === 'monthly' ? 'bg-purple-800' : 'bg-transparent hover:bg-purple-800/50'}`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  Monthly
                </Button>
                <Button 
                  className={`rounded-full px-8 ${selectedPlan === 'annual' ? 'bg-purple-800' : 'bg-transparent hover:bg-purple-800/50'}`}
                  onClick={() => setSelectedPlan('annual')}
                >
                  Annual <span className="ml-1 text-xs bg-amber-500 text-purple-950 px-2 py-0.5 rounded-full">Save 20%</span>
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-gradient-to-b from-purple-900/60 to-purple-800/40 border border-purple-700/50 rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-purple-700/40">
                  <h2 className="font-['Cinzel'] text-2xl text-white mb-2">Free Plan</h2>
                  <p className="text-3xl font-bold text-white">
                    $0 <span className="text-sm font-normal text-white/60">forever</span>
                  </p>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Basic fortune readings</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Daily horoscope</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Tarot card readings</span>
                    </li>
                    <li className="flex items-start opacity-50">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400/50 mt-1 mr-3" />
                      <span>Ad-supported experience</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 bg-white/10 hover:bg-white/20 border border-white/30">
                    Current Plan
                  </Button>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-gradient-to-b from-indigo-900 to-purple-900 border border-amber-500/30 rounded-xl overflow-hidden shadow-xl relative">
                {!hasPremium && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-purple-950 px-4 py-1 font-bold text-sm">
                    RECOMMENDED
                  </div>
                )}
                
                {hasPremium && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 font-bold text-sm">
                    ACTIVE
                  </div>
                )}
                
                <div className="p-6 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCrown} className="text-amber-400" />
                    <h2 className="font-['Cinzel'] text-2xl text-amber-400">Premium</h2>
                  </div>
                  {!hasPremium ? (
                    <p className="text-3xl font-bold text-white mt-2">
                      {selectedPlan === 'monthly' ? '$9.99' : '$7.99'} 
                      <span className="text-sm font-normal text-white/60">
                        /{selectedPlan === 'monthly' ? 'month' : 'month, billed annually'}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-green-400 mt-2 flex items-center">
                      <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                      Active Subscription
                    </p>
                  )}
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>All basic features</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span><b>Ad-free</b> experience</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Detailed astrological analysis</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Personalized monthly forecasts</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Compatibility insights</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 mt-1 mr-3" />
                      <span>Premium readings & interpretations</span>
                    </li>
                  </ul>
                  
                  {!hasPremium ? (
                    <Button 
                      className="w-full mt-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold border-none"
                      onClick={() => handleSubscribe(selectedPlan)}
                    >
                      <FontAwesomeIcon icon={faCrown} className="mr-2" />
                      Subscribe Now
                    </Button>
                  ) : (
                    <div className="mt-8 space-y-3">
                      <div className="p-3 bg-green-900/30 border border-green-600/30 rounded-md text-sm text-white">
                        You are currently enjoying all premium features. Thank you for your support!
                      </div>
                      <Button 
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/30"
                        onClick={handleCancelSubscription}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12 text-white/70 max-w-2xl mx-auto">
              <p className="text-sm">
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                You can cancel your subscription at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-purple-900 to-purple-950 border-purple-700">
          <CheckoutForm 
            amount={selectedPlan === 'monthly' ? 9.99 : 95.88}
            planType={selectedPlan}
            onSuccess={() => {
              setIsCheckoutOpen(false);
              setIsPurchaseComplete(true);
              toast({
                title: "Premium Activated!",
                description: "You now have access to all premium features.",
                variant: "default",
              });
            }}
            onCancel={() => setIsCheckoutOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}