# 🚀 Stripe Billing Integration Setup Guide

## 📋 Overview

This guide will help you set up the complete Stripe billing integration for your dashboard application. The integration includes:

- **Database schema** for storing billing data
- **API routes** for checkout, webhooks, and customer portal
- **UI components** for subscription management
- **Complete billing workflow** from signup to management

## 🛠️ Prerequisites

Before starting, ensure you have:

- ✅ **Stripe account** (free at [stripe.com](https://stripe.com))
- ✅ **Neon database** set up and accessible
- ✅ **Stack Auth** configured and working
- ✅ **Next.js application** running

## 📦 Step 1: Install Dependencies

Install the required Stripe package:

```bash
npm install stripe
```

The package has already been added to your `package.json` - just run the install command.

## 🔧 Step 2: Environment Variables

Copy the environment variables from `docs/stripe-env-example.txt` to your `.env.local` file:

```bash
# Copy the example file
cp docs/stripe-env-example.txt .env.local
```

Then fill in your actual values:

### **Stripe Configuration**

Get these from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Application URLs**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SUCCESS_URL=http://localhost:3000/upgrade/success
STRIPE_CANCEL_URL=http://localhost:3000/upgrade
```

## 🗄️ Step 3: Database Setup

### **Option A: Automatic Setup (Recommended)**

Tell an AI assistant to set up the database:

> "Set up the Stripe billing tables using the schema files in `/docs/database/`. Use the project ID `your-neon-project-id`."

The AI will automatically:

1. Create the `billing` schema
2. Set up all 7 billing tables
3. Create indexes and triggers
4. Set up helpful views

### **Option B: Manual Setup**

If you prefer to set up manually:

1. **Run the schema file**: Use the SQL commands in `docs/database/stripe-schema.sql`
2. **Follow the step-by-step guide**: Use `docs/database/stripe-setup-instructions.md`

## 🎯 Step 4: Create Stripe Products

In your [Stripe Dashboard](https://dashboard.stripe.com/products):

### **Create Products**

1. Go to Products → Add Product
2. Create these products:
   - **Basic Plan**: $9/month, $99/year
   - **Pro Plan**: $29/month, $299/year

### **Copy Price IDs**

After creating products, copy the price IDs to your `.env.local`:

```env
STRIPE_BASIC_PRICE_ID=price_1234567890abcdef
STRIPE_BASIC_PRICE_ID_YEARLY=price_0987654321fedcba
STRIPE_PRO_PRICE_ID=price_abcdef1234567890
STRIPE_PRO_PRICE_ID_YEARLY=price_fedcba0987654321
```

## 🔗 Step 5: Configure Webhook

### **Create Webhook Endpoint**

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **URL**: `https://your-domain.com/api/stripe/webhooks`
4. **Events**: Select these events:
   - `customer.created`
   - `customer.updated`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.created`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `checkout.session.completed`

### **Copy Webhook Secret**

After creating the webhook, copy the signing secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔧 Step 6: Update Upgrade Page

Connect the upgrade page to your Stripe checkout by updating the button handlers in `src/app/(main)/upgrade/page.tsx`:

```typescript
// Add this function to handle upgrade button clicks
const handleUpgrade = async (
  planId: string,
  billingCycle: "monthly" | "yearly"
) => {
  try {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: getPriceId(planId, billingCycle),
        billingCycle,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error("Checkout error:", error);
  }
};

// Helper function to get price ID
const getPriceId = (planId: string, billingCycle: "monthly" | "yearly") => {
  const priceIds = {
    basic: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
      yearly: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID_YEARLY,
    },
    pro: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY,
    },
  };

  return priceIds[planId][billingCycle];
};
```

## 🔧 Step 7: Add Billing to Settings

Update your settings page to include billing management:

```typescript
// Add this to your settings page
const handleManageBilling = async () => {
  try {
    const response = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnUrl: window.location.href,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error("Portal error:", error);
  }
};
```

## 🧪 Step 8: Test the Integration

### **Test Checkout Flow**

1. Go to `/upgrade`
2. Click "Upgrade to Pro"
3. Complete test payment with card `4242 4242 4242 4242`
4. Should redirect to `/upgrade/success`

### **Test Webhook**

1. Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

### **Test Customer Portal**

1. Go to `/settings`
2. Click "Manage Billing"
3. Should redirect to Stripe Customer Portal

## 📊 Step 9: Database Integration

Update the webhook handlers in `src/app/api/stripe/webhooks/route.ts` to actually save data to your database. Replace the `TODO` comments with actual database operations using your preferred method (Neon's serverless driver, Prisma, etc.).

Example with Neon:

```typescript
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

async function handleSubscriptionCreated(event: WebhookEventData) {
  const subscription = event.data.object;

  // Save to database
  await sql`
    INSERT INTO billing.subscriptions (
      stripe_subscription_id,
      stripe_customer_id,
      status,
      stripe_price_id,
      plan_name,
      plan_amount,
      plan_currency,
      plan_interval,
      current_period_start,
      current_period_end,
      created_at,
      updated_at
    ) VALUES (
      ${subscription.id},
      ${subscription.customer},
      ${subscription.status},
      ${subscription.items.data[0].price.id},
      ${subscription.items.data[0].price.nickname || "Pro"},
      ${subscription.items.data[0].price.unit_amount},
      ${subscription.items.data[0].price.currency},
      ${subscription.items.data[0].price.recurring.interval},
      ${new Date(subscription.current_period_start * 1000).toISOString()},
      ${new Date(subscription.current_period_end * 1000).toISOString()},
      ${new Date().toISOString()},
      ${new Date().toISOString()}
    )
  `;
}
```

## 🚀 Step 10: Deploy to Production

### **Update Environment Variables**

1. Replace test keys with live keys from Stripe
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Update webhook endpoint URL in Stripe Dashboard

### **Test Production**

1. Make a small test purchase
2. Verify webhooks are being received
3. Check database for correct data

## 🎯 Features Included

### **✅ Complete Billing Flow**

- Subscription signup with Stripe Checkout
- Success/cancel page handling
- Email receipts from Stripe

### **✅ Subscription Management**

- Customer portal for self-service
- Update payment methods
- Download invoices
- Cancel subscriptions

### **✅ Database Integration**

- Complete schema for billing data
- Webhook event tracking
- Subscription lifecycle management

### **✅ Security**

- Webhook signature verification
- User authentication required
- Secure API endpoints

### **✅ Error Handling**

- Comprehensive error handling
- Retry logic for webhooks
- User-friendly error messages

## 🔧 Customization

### **Plans & Pricing**

Update the plans in `lib/stripe.ts` to match your needs:

```typescript
export const getPlansConfig = () => {
  return {
    basic: {
      id: "basic",
      name: "Basic",
      description: "Essential features for individual users",
      features: [
        "Your features here",
        // Add your features
      ],
      prices: {
        monthly: { priceId: "...", amount: 999 }, // $9.99
        yearly: { priceId: "...", amount: 9999 }, // $99.99
      },
    },
    // Add more plans
  };
};
```

### **Webhook Events**

Add more event handlers in `src/app/api/stripe/webhooks/route.ts` for additional functionality like:

- Email notifications
- User account updates
- Analytics tracking
- Third-party integrations

## 🐛 Troubleshooting

### **Common Issues**

1. **Webhook signature verification failed**

   - Check that `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook endpoint is publicly accessible

2. **Customer not found**

   - Verify user email matches Stripe customer
   - Check that customer was created properly

3. **Price ID errors**

   - Ensure price IDs are copied correctly from Stripe
   - Check that prices are active in Stripe

4. **Database connection errors**
   - Verify `NEON_DATABASE_URL` is correct
   - Check that tables exist in database

### **Debug Tips**

1. **Check webhook logs** in Stripe Dashboard
2. **Use Stripe CLI** for local webhook testing
3. **Enable debug logging** in development
4. **Check database** for expected data

## 📞 Support

- **Documentation**: Check the files in `/docs/database/`
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Stack Auth**: [stack-auth.com](https://stack-auth.com)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)

## 🎉 You're Done!

Your Stripe billing integration is now complete! Users can:

1. **Subscribe** to plans from the upgrade page
2. **Manage subscriptions** through the customer portal
3. **View billing details** in settings
4. **Get email receipts** automatically

The integration handles the complete billing lifecycle and provides a professional subscription experience.

---

**Happy billing!** 💰
