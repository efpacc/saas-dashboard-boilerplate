// =============================================================================
// STRIPE CUSTOMER PORTAL API ROUTE
// =============================================================================
// Creates Stripe customer portal sessions for self-service billing management
// Allows customers to update payment methods, download invoices, and manage subscriptions
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getStripeClient, getStripeConfig, handleStripeError, isStripeError } from '@/lib/stripe';
import { CreateCustomerPortalSessionRequest, CreateCustomerPortalSessionResponse } from '@/lib/types/stripe';

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
    const body: CreateCustomerPortalSessionRequest = await request.json();
    const { returnUrl } = body;

    // Get Stripe client and configuration
    const stripe = getStripeClient();
    const config = getStripeConfig();

    // Find existing Stripe customer
    let stripeCustomer;
    try {
      const existingCustomers = await stripe.customers.list({
        email: user.primaryEmail!,
        limit: 1,
      });

      if (existingCustomers.data.length === 0) {
        return NextResponse.json(
          { error: 'No subscription found. Please subscribe first.' },
          { status: 404 }
        );
      }

      stripeCustomer = existingCustomers.data[0];
    } catch (error) {
      console.error('Error finding customer:', error);
      
      if (isStripeError(error)) {
        const billingError = handleStripeError(error);
        return NextResponse.json(
          { error: billingError.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to find customer' },
        { status: 500 }
      );
    }

    // Create customer portal session
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomer.id,
        return_url: returnUrl || `${config.successUrl.split('/upgrade')[0]}/settings`,
      });

      const response: CreateCustomerPortalSessionResponse = {
        url: portalSession.url,
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      
      if (isStripeError(error)) {
        const billingError = handleStripeError(error);
        return NextResponse.json(
          { error: billingError.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create customer portal session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in customer portal route:', error);
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