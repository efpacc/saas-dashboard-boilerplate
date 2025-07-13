// =============================================================================
// STRIPE CHECKOUT API ROUTE
// =============================================================================
// Creates Stripe checkout sessions for subscription payments
// Handles both monthly and yearly billing cycles
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getStripeClient, getStripeConfig, createMetadata, validatePriceId, handleStripeError, isStripeError } from '@/lib/stripe';
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@/lib/types/stripe';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateCheckoutSessionRequest = await request.json();
    const { priceId, billingCycle, successUrl, cancelUrl, allowPromotionCodes, metadata } = body;

    // Validate required fields
    if (!priceId || !validatePriceId(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle' },
        { status: 400 }
      );
    }

    // Get Stripe client and configuration
    const stripe = getStripeClient();
    const config = getStripeConfig();

    // Create or retrieve Stripe customer
    let stripeCustomer;
    try {
      // First, try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: user.primaryEmail!,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomer = existingCustomers.data[0];
      } else {
        // Create new customer
        stripeCustomer = await stripe.customers.create({
          email: user.primaryEmail!,
          name: user.displayName || undefined,
          metadata: createMetadata(user.id, {
            stack_user_id: user.id,
            billing_cycle: billingCycle,
          }),
        });
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      
      if (isStripeError(error)) {
        const billingError = handleStripeError(error);
        return NextResponse.json(
          { error: billingError.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    // Create checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl || config.successUrl,
        cancel_url: cancelUrl || config.cancelUrl,
        allow_promotion_codes: allowPromotionCodes ?? config.allowPromotionCodes,
        billing_address_collection: config.billingAddressCollection,
        automatic_tax: config.automaticTaxEnabled ? { enabled: true } : undefined,
        subscription_data: {
          metadata: createMetadata(user.id, {
            stack_user_id: user.id,
            billing_cycle: billingCycle,
            ...metadata,
          }),
        },
        metadata: createMetadata(user.id, {
          stack_user_id: user.id,
          billing_cycle: billingCycle,
          ...metadata,
        }),
      });

      const response: CreateCheckoutSessionResponse = {
        sessionId: session.id,
        url: session.url!,
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      if (isStripeError(error)) {
        const billingError = handleStripeError(error);
        return NextResponse.json(
          { error: billingError.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in checkout route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 