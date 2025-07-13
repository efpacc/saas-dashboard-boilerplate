// =============================================================================
// STRIPE WEBHOOKS API ROUTE
// =============================================================================
// Handles Stripe webhook events for subscription lifecycle management
// Processes events like subscription creation, updates, cancellation, and payments
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getStripeConfig, constructWebhookEvent, logStripeEvent } from '@/lib/stripe';
import { WebhookEventData, StripeWebhookEventType } from '@/lib/types/stripe';

export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();
    const config = getStripeConfig();

    // Verify webhook signature
    let event: WebhookEventData;
    try {
      event = constructWebhookEvent(body, signature, config.webhookSecret) as WebhookEventData;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // Check if event has already been processed
    const isProcessed = await checkIfEventProcessed(event.id);
    if (isProcessed) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }

    // Log event for debugging
    logStripeEvent(event.type, event.data);

    // Process the event based on type
    try {
      await processWebhookEvent(event);
      
      // Mark event as processed
      await markEventAsProcessed(event.id, event.type, 'processed');
      
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error(`Error processing webhook event ${event.id}:`, error);
      
      // Mark event as failed
      await markEventAsProcessed(event.id, event.type, 'failed', error instanceof Error ? error.message : 'Unknown error');
      
      return NextResponse.json(
        { error: 'Failed to process webhook event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in webhook route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// WEBHOOK EVENT PROCESSING
// =============================================================================

async function processWebhookEvent(event: WebhookEventData) {
  const eventType = event.type as StripeWebhookEventType;
  
  switch (eventType) {
    case 'customer.created':
      await handleCustomerCreated(event);
      break;
    
    case 'customer.updated':
      await handleCustomerUpdated(event);
      break;
    
    case 'customer.deleted':
      await handleCustomerDeleted(event);
      break;
    
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event);
      break;
    
    case 'customer.subscription.trial_will_end':
      await handleTrialWillEnd(event);
      break;
    
    case 'invoice.created':
      await handleInvoiceCreated(event);
      break;
    
    case 'invoice.updated':
      await handleInvoiceUpdated(event);
      break;
    
    case 'invoice.paid':
      await handleInvoicePaid(event);
      break;
    
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event);
      break;
    
    case 'invoice.finalized':
      await handleInvoiceFinalized(event);
      break;
    
    case 'payment_method.attached':
      await handlePaymentMethodAttached(event);
      break;
    
    case 'payment_method.detached':
      await handlePaymentMethodDetached(event);
      break;
    
    case 'payment_method.updated':
      await handlePaymentMethodUpdated(event);
      break;
    
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event);
      break;
    
    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutSessionAsyncPaymentSucceeded(event);
      break;
    
    case 'checkout.session.async_payment_failed':
      await handleCheckoutSessionAsyncPaymentFailed(event);
      break;
    
    default:
      console.log(`Unhandled event type: ${eventType}`);
      // Mark as ignored rather than failed
      await markEventAsProcessed(event.id, event.type, 'ignored');
  }
}

// =============================================================================
// WEBHOOK EVENT HANDLERS
// =============================================================================

async function handleCustomerCreated(event: WebhookEventData) {
  const customer = event.data.object;
  
  // TODO: Insert customer into database
  console.log('Customer created:', customer.id);
  
  // Example database insertion (you would implement this with your database)
  /*
  await db.insert('billing.customers', {
    stripe_customer_id: customer.id,
    email: customer.email,
    name: customer.name,
    user_id: customer.metadata?.user_id,
    created_at: new Date(),
    updated_at: new Date(),
  });
  */
}

async function handleCustomerUpdated(event: WebhookEventData) {
  const customer = event.data.object;
  
  // TODO: Update customer in database
  console.log('Customer updated:', customer.id);
  
  // Example database update
  /*
  await db.update('billing.customers', 
    { stripe_customer_id: customer.id },
    {
      email: customer.email,
      name: customer.name,
      updated_at: new Date(),
    }
  );
  */
}

async function handleCustomerDeleted(event: WebhookEventData) {
  const customer = event.data.object;
  
  // TODO: Handle customer deletion
  console.log('Customer deleted:', customer.id);
  
  // Usually you'd soft delete or archive the customer
  /*
  await db.update('billing.customers', 
    { stripe_customer_id: customer.id },
    { deleted_at: new Date() }
  );
  */
}

async function handleSubscriptionCreated(event: WebhookEventData) {
  const subscription = event.data.object;
  
  // TODO: Insert subscription into database
  console.log('Subscription created:', subscription.id);
  
  // Example database insertion
  /*
  await db.insert('billing.subscriptions', {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    status: subscription.status,
    stripe_price_id: subscription.items.data[0].price.id,
    plan_name: subscription.items.data[0].price.nickname || 'Unknown',
    plan_amount: subscription.items.data[0].price.unit_amount,
    plan_currency: subscription.items.data[0].price.currency,
    plan_interval: subscription.items.data[0].price.recurring.interval,
    plan_interval_count: subscription.items.data[0].price.recurring.interval_count,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    metadata: subscription.metadata,
    created_at: new Date(),
    updated_at: new Date(),
  });
  */
}

async function handleSubscriptionUpdated(event: WebhookEventData) {
  const subscription = event.data.object;
  
  // TODO: Update subscription in database
  console.log('Subscription updated:', subscription.id);
  
  // Example database update
  /*
  await db.update('billing.subscriptions', 
    { stripe_subscription_id: subscription.id },
    {
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      updated_at: new Date(),
    }
  );
  */
}

async function handleSubscriptionDeleted(event: WebhookEventData) {
  const subscription = event.data.object;
  
  // TODO: Handle subscription cancellation
  console.log('Subscription deleted:', subscription.id);
  
  // Mark subscription as canceled
  /*
  await db.update('billing.subscriptions', 
    { stripe_subscription_id: subscription.id },
    {
      status: 'canceled',
      ended_at: new Date(),
      updated_at: new Date(),
    }
  );
  */
}

async function handleTrialWillEnd(event: WebhookEventData) {
  const subscription = event.data.object;
  
  // TODO: Send trial ending notification
  console.log('Trial will end:', subscription.id);
  
  // This is a good place to send email notifications
  // about upcoming trial expiration
}

async function handleInvoiceCreated(event: WebhookEventData) {
  const invoice = event.data.object;
  
  // TODO: Insert invoice into database
  console.log('Invoice created:', invoice.id);
}

async function handleInvoiceUpdated(event: WebhookEventData) {
  const invoice = event.data.object;
  
  // TODO: Update invoice in database
  console.log('Invoice updated:', invoice.id);
}

async function handleInvoicePaid(event: WebhookEventData) {
  const invoice = event.data.object;
  
  // TODO: Update invoice as paid
  console.log('Invoice paid:', invoice.id);
  
  // This is where you'd:
  // 1. Mark invoice as paid in database
  // 2. Send payment confirmation email
  // 3. Activate/extend subscription features
}

async function handleInvoicePaymentFailed(event: WebhookEventData) {
  const invoice = event.data.object;
  
  // TODO: Handle payment failure
  console.log('Invoice payment failed:', invoice.id);
  
  // This is where you'd:
  // 1. Mark invoice as failed
  // 2. Send payment failure notification
  // 3. Potentially suspend account access
}

async function handleInvoiceFinalized(event: WebhookEventData) {
  const invoice = event.data.object;
  
  // TODO: Handle invoice finalization
  console.log('Invoice finalized:', invoice.id);
}

async function handlePaymentMethodAttached(event: WebhookEventData) {
  const paymentMethod = event.data.object;
  
  // TODO: Store payment method
  console.log('Payment method attached:', paymentMethod.id);
}

async function handlePaymentMethodDetached(event: WebhookEventData) {
  const paymentMethod = event.data.object;
  
  // TODO: Remove payment method
  console.log('Payment method detached:', paymentMethod.id);
}

async function handlePaymentMethodUpdated(event: WebhookEventData) {
  const paymentMethod = event.data.object;
  
  // TODO: Update payment method
  console.log('Payment method updated:', paymentMethod.id);
}

async function handleCheckoutSessionCompleted(event: WebhookEventData) {
  const session = event.data.object;
  
  // TODO: Handle successful checkout
  console.log('Checkout session completed:', session.id);
  
  // This is where you'd:
  // 1. Activate subscription features
  // 2. Send welcome email
  // 3. Set up user account
}

async function handleCheckoutSessionAsyncPaymentSucceeded(event: WebhookEventData) {
  const session = event.data.object;
  
  // TODO: Handle async payment success
  console.log('Checkout session async payment succeeded:', session.id);
}

async function handleCheckoutSessionAsyncPaymentFailed(event: WebhookEventData) {
  const session = event.data.object;
  
  // TODO: Handle async payment failure
  console.log('Checkout session async payment failed:', session.id);
}

// =============================================================================
// WEBHOOK EVENT TRACKING
// =============================================================================

async function checkIfEventProcessed(eventId: string): Promise<boolean> {
  // TODO: Check if event exists in database
  // This prevents duplicate processing of the same event
  
  // Example implementation:
  /*
  const existingEvent = await db.selectFirst('billing.webhook_events', {
    stripe_event_id: eventId
  });
  
  return existingEvent !== null;
  */
  
  return false; // For now, always process events
}

async function markEventAsProcessed(
  eventId: string,
  eventType: string,
  status: 'processed' | 'failed' | 'ignored',
  errorMessage?: string
) {
  // TODO: Insert/update event in database
  
  // Example implementation:
  /*
  await db.upsert('billing.webhook_events', 
    { stripe_event_id: eventId },
    {
      stripe_event_id: eventId,
      event_type: eventType,
      status: status,
      error_message: errorMessage,
      processed_at: new Date(),
      retry_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }
  );
  */
  
  console.log(`Event ${eventId} marked as ${status}`);
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