// =============================================================================
// STRIPE UTILITY LIBRARY
// =============================================================================
// Comprehensive Stripe integration utilities
// Handles configuration, validation, and common operations
// =============================================================================

import Stripe from 'stripe';
import { StripeConfig, BillingError, BillingErrorCode } from './types/stripe';

// =============================================================================
// STRIPE CONFIGURATION
// =============================================================================

export const getStripeConfig = (): StripeConfig => {
  const requiredEnvVars = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL,
  };

  // Validate required environment variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    secretKey: requiredEnvVars.secretKey!,
    publishableKey: requiredEnvVars.publishableKey!,
    webhookSecret: requiredEnvVars.webhookSecret!,
    priceIds: {
      basic: {
        monthly: process.env.STRIPE_BASIC_PRICE_ID || '',
        yearly: process.env.STRIPE_BASIC_PRICE_ID_YEARLY || '',
      },
      pro: {
        monthly: process.env.STRIPE_PRO_PRICE_ID || '',
        yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || '',
      },
    },
    successUrl: process.env.STRIPE_SUCCESS_URL || `${requiredEnvVars.appUrl}/upgrade/success`,
    cancelUrl: process.env.STRIPE_CANCEL_URL || `${requiredEnvVars.appUrl}/upgrade`,
    allowPromotionCodes: process.env.STRIPE_ALLOW_PROMOTION_CODES === 'true',
    billingAddressCollection: (process.env.STRIPE_BILLING_ADDRESS_COLLECTION as 'auto' | 'required') || 'auto',
    automaticTaxEnabled: process.env.STRIPE_AUTOMATIC_TAX_ENABLED === 'true',
  };
};

// =============================================================================
// STRIPE CLIENT INITIALIZATION
// =============================================================================

let stripeInstance: Stripe | null = null;

export const getStripeClient = (): Stripe => {
  if (!stripeInstance) {
    const config = getStripeConfig();
    stripeInstance = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }
  return stripeInstance;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const formatCurrency = (
  amount: number,
  currency: string = 'usd',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export const formatDate = (
  date: string | number | Date,
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (
  date: string | number | Date,
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return dateObj.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateSavings = (
  monthlyAmount: number,
  yearlyAmount: number
): { amount: number; percentage: number } => {
  const monthlyTotal = monthlyAmount * 12;
  const savings = monthlyTotal - yearlyAmount;
  const percentage = Math.round((savings / monthlyTotal) * 100);
  return { amount: savings, percentage };
};

export const isSubscriptionActive = (status: string): boolean => {
  return ['active', 'trialing', 'past_due'].includes(status);
};

export const isSubscriptionCanceled = (status: string): boolean => {
  return ['canceled', 'unpaid', 'incomplete_expired'].includes(status);
};

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'trialing':
      return 'text-blue-600 bg-blue-50';
    case 'past_due':
      return 'text-yellow-600 bg-yellow-50';
    case 'canceled':
    case 'unpaid':
      return 'text-red-600 bg-red-50';
    case 'incomplete':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getSubscriptionStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'trialing':
      return 'Trial';
    case 'past_due':
      return 'Past Due';
    case 'canceled':
      return 'Canceled';
    case 'unpaid':
      return 'Unpaid';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Expired';
    case 'paused':
      return 'Paused';
    default:
      return 'Unknown';
  }
};

// =============================================================================
// PLAN CONFIGURATION
// =============================================================================

export const getPlansConfig = () => {
  const config = getStripeConfig();
  
  return {
    basic: {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for individual users',
      features: [
        'Up to 25 projects',
        'Premium templates and tools',
        'HD export formats',
        'Email support',
        'Advanced analytics',
        'Priority processing',
        'Custom branding removal',
        'API access (basic)',
      ],
      prices: {
        monthly: {
          priceId: config.priceIds.basic.monthly,
          amount: 900, // $9.00
          currency: 'usd',
        },
        yearly: {
          priceId: config.priceIds.basic.yearly,
          amount: 9900, // $99.00
          currency: 'usd',
        },
      },
      popular: false,
      trialDays: 7,
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals and growing teams',
      features: [
        'Unlimited projects',
        'All premium features',
        'Team collaboration (up to 10 users)',
        'Priority support',
        'Advanced integrations',
        'Custom domains',
        'Advanced analytics & reporting',
        'API access (full)',
        'White-label solutions',
        'Advanced security features',
      ],
      prices: {
        monthly: {
          priceId: config.priceIds.pro.monthly,
          amount: 2900, // $29.00
          currency: 'usd',
        },
        yearly: {
          priceId: config.priceIds.pro.yearly,
          amount: 29900, // $299.00
          currency: 'usd',
        },
      },
      popular: true,
      trialDays: 14,
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced admin controls',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security & compliance',
        'Custom training & onboarding',
        'Priority feature requests',
        'Custom deployment options',
      ],
      prices: {
        monthly: {
          priceId: '',
          amount: 0,
          currency: 'usd',
        },
        yearly: {
          priceId: '',
          amount: 0,
          currency: 'usd',
        },
      },
      popular: false,
      enterprise: true,
    },
  };
};

export const getPlanByPriceId = (priceId: string) => {
  const plans = getPlansConfig();
  
  for (const plan of Object.values(plans)) {
    if (plan.prices.monthly.priceId === priceId || plan.prices.yearly.priceId === priceId) {
      return plan;
    }
  }
  
  return null;
};

export const getPlanPrice = (planId: string, interval: 'monthly' | 'yearly') => {
  const plans = getPlansConfig();
  const plan = plans[planId as keyof typeof plans];
  
  if (!plan) {
    return null;
  }
  
  return plan.prices[interval];
};

// =============================================================================
// WEBHOOK UTILITIES
// =============================================================================

export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const stripe = getStripeClient();
    stripe.webhooks.constructEvent(payload, signature, secret);
    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

export const constructWebhookEvent = (
  payload: string,
  signature: string,
  secret: string
): Stripe.Event => {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

// =============================================================================
// ERROR HANDLING
// =============================================================================

export const createBillingError = (
  code: BillingErrorCode,
  message: string,
  details?: Record<string, any>
): BillingError => {
  return {
    type: 'billing_error',
    code,
    message,
    details,
  };
};

export const isStripeError = (error: any): error is Stripe.StripeError => {
  return error && error.type && typeof error.type === 'string' && error.type.includes('stripe');
};

export const handleStripeError = (error: Stripe.StripeError): BillingError => {
  switch (error.type) {
    case 'card_error':
      return createBillingError(
        'PAYMENT_FAILED',
        error.message || 'Payment failed',
        { code: error.code, param: error.param }
      );
    case 'invalid_request_error':
      return createBillingError(
        'INVALID_REQUEST',
        error.message || 'Invalid request',
        { param: error.param }
      );
    case 'rate_limit_error':
      return createBillingError(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.'
      );
    case 'authentication_error':
      return createBillingError(
        'INSUFFICIENT_PERMISSIONS',
        'Authentication failed'
      );
    case 'api_connection_error':
    case 'api_error':
    default:
      return createBillingError(
        'INTERNAL_ERROR',
        'An unexpected error occurred. Please try again.'
      );
  }
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export const validatePriceId = (priceId: string): boolean => {
  return Boolean(priceId && priceId.startsWith('price_'));
};

export const validateCustomerId = (customerId: string): boolean => {
  return Boolean(customerId && customerId.startsWith('cus_'));
};

export const validateSubscriptionId = (subscriptionId: string): boolean => {
  return Boolean(subscriptionId && subscriptionId.startsWith('sub_'));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// =============================================================================
// METADATA UTILITIES
// =============================================================================

export const createMetadata = (
  userId: string,
  additionalData?: Record<string, string>
): Record<string, string> => {
  return {
    user_id: userId,
    created_at: new Date().toISOString(),
    ...additionalData,
  };
};

export const parseMetadata = (metadata: Record<string, string> | null) => {
  if (!metadata) return {};
  return metadata;
};

// =============================================================================
// RETRY UTILITIES
// =============================================================================

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// =============================================================================
// DEVELOPMENT UTILITIES
// =============================================================================

export const isTestMode = (): boolean => {
  const config = getStripeConfig();
  return config.secretKey.includes('test') || config.publishableKey.includes('test');
};

export const logStripeEvent = (eventType: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Stripe Event] ${eventType}:`, data);
  }
};

// =============================================================================
// EXPORT COMMONLY USED ITEMS
// =============================================================================

export {
  Stripe,
  getStripeClient as stripe,
  getStripeConfig as config,
  getPlansConfig as plans,
}; 