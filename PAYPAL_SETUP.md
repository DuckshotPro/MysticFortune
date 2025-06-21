
# PayPal Integration Setup

## Getting Started with PayPal

Your app now supports PayPal payments! Here's how to set it up:

## 1. Create PayPal Developer Account

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal account (or create one)
3. Create a new app in the Developer Dashboard

## 2. Get Your Credentials

From your PayPal app dashboard, you'll need:
- **Client ID** (Safe to use in frontend)
- **Client Secret** (Keep this secure, server-side only)

## 3. Environment Variables

Add these to your Replit Secrets:

```
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox  # Use 'live' for production
```

## 4. Testing

- **Sandbox Mode**: Use PayPal's test environment
- **Test Accounts**: Create buyer/seller test accounts in PayPal Developer
- **Test Cards**: PayPal provides test credit card numbers

## 5. Going Live

1. Switch `PAYPAL_MODE` to `live`
2. Use your live PayPal app credentials
3. Test with small amounts first

## Current Status

✅ **Demo Mode**: PayPal integration works in demo mode  
⚠️ **Production**: Add your PayPal credentials to enable real payments  

## Benefits of PayPal

- ✅ No business license required for personal accounts
- ✅ Lower barrier to entry than Stripe
- ✅ Buyers can pay without creating accounts
- ✅ International support
- ✅ Mobile-friendly checkout

Your app will automatically detect when PayPal credentials are added and switch from demo to live mode!
