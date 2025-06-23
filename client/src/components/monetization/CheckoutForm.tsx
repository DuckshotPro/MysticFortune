import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { setPremiumStatus } from '@/lib/premiumUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

// This component handles the Stripe payment flow without directly using Stripe Elements
// As we need to check for API keys first, we'll show a placeholder UI

interface CheckoutFormProps {
  amount: number;
  planType: 'monthly' | 'annual';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({ amount, planType, onSuccess, onCancel }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      // Check if the API keys are configured
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount,
        plan: planType
      });

      const data = await response.json();

      if (response.status === 503) {
        // Stripe not configured
        setMessage(data.message || 'Payment processing is not available at the moment.');
        toast({
          title: 'Payment Processing Unavailable',
          description: 'Our payment system is currently being set up. Please check back later.',
          variant: 'destructive',
        });
      } else if (!response.ok) {
        throw new Error(data.message || 'Something went wrong with the payment.');
      } else {
        // In a real app, this would use the client secret to open Stripe's checkout
        toast({
          title: 'Payment Method Ready',
          description: 'In a production environment, you would be redirected to complete your payment.',
        });
        
        // Simulate success for demo purposes
        setTimeout(() => {
          // Set premium status in local storage
          setPremiumStatus(true);
          
          toast({
            title: 'Premium Activated!',
            description: `You've successfully subscribed to our ${planType} premium plan.`,
            variant: 'default',
          });
          
          if (onSuccess) onSuccess();
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred during payment processing.',
        variant: 'destructive',
      });
      setMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSubmit = async () => {
    setIsProcessingPayPal(true);
    setMessage('');

    try {
      const response = await apiRequest('POST', '/api/create-paypal-order', {
        amount,
        plan: planType
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'PayPal payment failed');
      }

      // In a real app, this would redirect to PayPal checkout
      toast({
        title: 'PayPal Payment Ready',
        description: 'In production, you would be redirected to PayPal to complete payment.',
      });

      // Simulate PayPal success
      setTimeout(() => {
        setPremiumStatus(true);
        
        toast({
          title: 'Premium Activated via PayPal!',
          description: `You've successfully subscribed to our ${planType} premium plan.`,
          variant: 'default',
        });
        
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (error: any) {
      toast({
        title: 'PayPal Payment Error',
        description: error.message || 'An unexpected error occurred with PayPal processing.',
        variant: 'destructive',
      });
      setMessage(error.message || 'PayPal payment failed');
    } finally {
      setIsProcessingPayPal(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="p-6 bg-purple-900/50 rounded-lg border border-purple-700">
      <h3 className="font-['Cinzel'] text-xl text-amber-500 mb-4">Complete Your Purchase</h3>
      
      <div className="mb-6">
        <p className="text-lg font-semibold text-white mb-1">
          {planType === 'monthly' ? 'Monthly Premium' : 'Annual Premium'}
        </p>
        <p className="text-2xl font-bold text-amber-400 mb-2">
          ${planType === 'monthly' ? '9.99' : '95.88'} 
          <span className="text-sm text-white/60">
            {planType === 'monthly' ? '/month' : '/year (save 20%)'}
          </span>
        </p>
        <ul className="text-sm text-white/80 space-y-1 mt-4">
          <li>• Ad-free experience</li>
          <li>• Detailed astrological analysis</li>
          <li>• Personalized monthly forecasts</li>
          <li>• Premium readings & interpretations</li>
        </ul>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Choose Payment Method</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`p-3 rounded-lg border transition-all ${
              paymentMethod === 'stripe'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-purple-700 bg-purple-800/30 text-white/70 hover:bg-purple-800/50'
            }`}
          >
            <FontAwesomeIcon icon={faCreditCard} className="mb-1" />
            <div className="text-xs">Credit Card</div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-3 rounded-lg border transition-all ${
              paymentMethod === 'paypal'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-purple-700 bg-purple-800/30 text-white/70 hover:bg-purple-800/50'
            }`}
          >
            <FontAwesomeIcon icon={faPaypal} className="mb-1" />
            <div className="text-xs">PayPal</div>
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-white text-sm">
          {message}
        </div>
      )}

      {paymentMethod === 'stripe' ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <Spinner className="w-4 h-4 mr-2" /> Processing...
                </span>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Pay with Card
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handlePayPalSubmit}
            disabled={isProcessingPayPal}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold"
          >
            {isProcessingPayPal ? (
              <span className="flex items-center">
                <Spinner className="w-4 h-4 mr-2" /> Processing...
              </span>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaypal} className="mr-2" />
                Pay with PayPal
              </>
            )}
          </Button>
        </div>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        disabled={isProcessing || isProcessingPayPal}
        className="w-full mt-3 border-white/30 text-white/70 hover:text-white hover:bg-purple-800"
      >
        Cancel
      </Button>
    </div>
  );
}