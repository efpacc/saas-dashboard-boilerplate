// =============================================================================
// STRIPE TYPES AND INTERFACES
// =============================================================================
// TypeScript types for Stripe billing integration
// Compatible with Stripe API v2023-10-16+
// =============================================================================

export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: SubscriptionStatus;
  stripe_price_id: string;
  plan_name: string;
  plan_amount: number; // in cents
  plan_currency: string;
  plan_interval: PlanInterval;
  plan_interval_count: number;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;
  cancel_at?: string;
  ended_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StripeInvoice {
  id: string;
  customer_id: string;
  subscription_id?: string;
  stripe_invoice_id: string;
  stripe_customer_id: string;
  invoice_number?: string;
  status: InvoiceStatus;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  invoice_date: string;
  due_date?: string;
  period_start?: string;
  period_end?: string;
  paid_at?: string;
  hosted_invoice_url?: string;
  invoice_pdf_url?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StripePaymentMethod {
  id: string;
  customer_id: string;
  stripe_payment_method_id: string;
  stripe_customer_id: string;
  type: PaymentMethodType;
  is_default: boolean;
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  card_funding?: CardFunding;
  bank_name?: string;
  bank_account_last4?: string;
  bank_account_type?: BankAccountType;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StripeUsageRecord {
  id: string;
  subscription_item_id: string;
  stripe_usage_record_id?: string;
  quantity: number;
  usage_timestamp: string;
  action: UsageAction;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface StripeWebhookEvent {
  id: string;
  stripe_event_id: string;
  event_type: string;
  processed_at: string;
  api_version?: string;
  object_id?: string;
  object_type?: string;
  status: WebhookStatus;
  error_message?: string;
  retry_count: number;
  raw_event?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// ENUMS AND UNION TYPES
// =============================================================================

export type SubscriptionStatus = 
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export type InvoiceStatus = 
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void';

export type PaymentMethodType = 
  | 'card'
  | 'bank_account'
  | 'sepa_debit'
  | 'ideal'
  | 'paypal';

export type CardFunding = 
  | 'credit'
  | 'debit'
  | 'prepaid'
  | 'unknown';

export type BankAccountType = 
  | 'checking'
  | 'savings';

export type PlanInterval = 
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export type UsageAction = 
  | 'increment'
  | 'set';

export type WebhookStatus = 
  | 'pending'
  | 'processed'
  | 'failed'
  | 'ignored';

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

export interface CreateCheckoutSessionRequest {
  priceId: string;
  billingCycle: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
  allowPromotionCodes?: boolean;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CreateCustomerPortalSessionRequest {
  returnUrl?: string;
}

export interface CreateCustomerPortalSessionResponse {
  url: string;
}

export interface SubscriptionUpdateRequest {
  priceId?: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

export interface UsageUpdateRequest {
  subscriptionItemId: string;
  quantity: number;
  action?: UsageAction;
  timestamp?: string;
}

export interface BillingDetailsResponse {
  customer: StripeCustomer;
  subscription?: StripeSubscription;
  paymentMethod?: StripePaymentMethod;
  upcomingInvoice?: {
    amount_due: number;
    currency: string;
    period_start: string;
    period_end: string;
  };
  invoices: StripeInvoice[];
  usage?: StripeUsageRecord[];
}

// =============================================================================
// PLAN CONFIGURATION TYPES
// =============================================================================

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: {
    monthly: {
      priceId: string;
      amount: number; // in cents
      currency: string;
    };
    yearly: {
      priceId: string;
      amount: number; // in cents
      currency: string;
    };
  };
  popular?: boolean;
  enterprise?: boolean;
  trialDays?: number;
  usageType?: 'licensed' | 'metered';
  metadata?: Record<string, string>;
}

export interface SubscriptionPlan {
  basic: PlanConfig;
  pro: PlanConfig;
  enterprise: PlanConfig;
}

// =============================================================================
// WEBHOOK EVENT TYPES
// =============================================================================

export interface WebhookEventData {
  id: string;
  type: string;
  api_version: string;
  created: number;
  data: {
    object: any;
    previous_attributes?: any;
  };
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

export type StripeWebhookEventType = 
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.subscription.trial_will_end'
  | 'invoice.created'
  | 'invoice.updated'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'invoice.finalized'
  | 'payment_method.attached'
  | 'payment_method.detached'
  | 'payment_method.updated'
  | 'checkout.session.completed'
  | 'checkout.session.async_payment_succeeded'
  | 'checkout.session.async_payment_failed';

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface StripeError {
  type: 'stripe_error';
  code?: string;
  message: string;
  param?: string;
  statusCode?: number;
}

export interface BillingError {
  type: 'billing_error';
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type BillingErrorCode = 
  | 'CUSTOMER_NOT_FOUND'
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'INVALID_PLAN'
  | 'PAYMENT_FAILED'
  | 'WEBHOOK_VERIFICATION_FAILED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_REQUEST'
  | 'INTERNAL_ERROR';

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  total?: number;
  nextCursor?: string;
}

export interface BillingMetrics {
  totalCustomers: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number; // in cents
  annualRecurringRevenue: number; // in cents
  churnRate: number; // percentage
  averageRevenuePerUser: number; // in cents
  conversionRate: number; // percentage
  trialConversionRate: number; // percentage
}

export interface SubscriptionUsage {
  subscriptionId: string;
  items: Array<{
    id: string;
    priceId: string;
    currentUsage: number;
    limit?: number;
    period: {
      start: string;
      end: string;
    };
  }>;
}

// =============================================================================
// HELPER TYPES
// =============================================================================

export type RequiredEnvVars = 
  | 'STRIPE_SECRET_KEY'
  | 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  | 'STRIPE_WEBHOOK_SECRET'
  | 'NEON_DATABASE_URL'
  | 'NEXT_PUBLIC_APP_URL';

export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  priceIds: {
    basic: {
      monthly: string;
      yearly: string;
    };
    pro: {
      monthly: string;
      yearly: string;
    };
  };
  successUrl: string;
  cancelUrl: string;
  allowPromotionCodes: boolean;
  billingAddressCollection: 'auto' | 'required';
  automaticTaxEnabled: boolean;
}

export interface DatabaseConfig {
  url: string;
  projectId: string;
  maxConnections?: number;
  connectionTimeout?: number;
} 