-- ============================================================================
-- STRIPE BILLING DATABASE SCHEMA
-- ============================================================================
-- Optimized for PostgreSQL/Neon Database
-- Compatible with Stripe API v2023-10-16+
-- 
-- Usage: Run these commands in order using Neon MCP tools
-- Note: Assumes neon_auth.users_sync table exists (from Stack Auth setup)
-- ============================================================================

-- Create billing schema for organization
CREATE SCHEMA IF NOT EXISTS billing;

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
-- Links Stripe customers to authenticated users
CREATE TABLE billing.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for customers
CREATE INDEX idx_customers_user_id ON billing.customers(user_id);
CREATE INDEX idx_customers_stripe_id ON billing.customers(stripe_customer_id);
CREATE INDEX idx_customers_email ON billing.customers(email);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Main subscription data synchronized with Stripe
CREATE TABLE billing.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'incomplete', 'incomplete_expired', 'trialing', 'active', 
        'past_due', 'canceled', 'unpaid', 'paused'
    )),
    
    -- Pricing information
    stripe_price_id TEXT NOT NULL,
    plan_name TEXT NOT NULL, -- e.g., 'Basic', 'Pro', 'Enterprise'
    plan_amount INTEGER NOT NULL, -- Amount in cents
    plan_currency TEXT NOT NULL DEFAULT 'usd',
    plan_interval TEXT NOT NULL CHECK (plan_interval IN ('day', 'week', 'month', 'year')),
    plan_interval_count INTEGER NOT NULL DEFAULT 1,
    
    -- Subscription lifecycle
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_customer_id ON billing.subscriptions(customer_id);
CREATE INDEX idx_subscriptions_stripe_id ON billing.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON billing.subscriptions(status);
CREATE INDEX idx_subscriptions_current_period ON billing.subscriptions(current_period_start, current_period_end);
CREATE INDEX idx_subscriptions_plan_name ON billing.subscriptions(plan_name);

-- ============================================================================
-- SUBSCRIPTION ITEMS TABLE
-- ============================================================================
-- Individual line items within a subscription (for usage-based billing)
CREATE TABLE billing.subscription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id) ON DELETE CASCADE,
    stripe_subscription_item_id TEXT NOT NULL UNIQUE,
    stripe_price_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Pricing details
    price_amount INTEGER NOT NULL, -- Amount in cents
    price_currency TEXT NOT NULL DEFAULT 'usd',
    price_type TEXT NOT NULL CHECK (price_type IN ('one_time', 'recurring')),
    price_interval TEXT CHECK (price_interval IN ('day', 'week', 'month', 'year')),
    price_interval_count INTEGER DEFAULT 1,
    
    -- Usage tracking
    usage_type TEXT CHECK (usage_type IN ('licensed', 'metered')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscription items
CREATE INDEX idx_subscription_items_subscription_id ON billing.subscription_items(subscription_id);
CREATE INDEX idx_subscription_items_stripe_id ON billing.subscription_items(stripe_subscription_item_id);
CREATE INDEX idx_subscription_items_price_id ON billing.subscription_items(stripe_price_id);

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
-- Payment history and invoice records
CREATE TABLE billing.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES billing.subscriptions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    
    -- Invoice details
    invoice_number TEXT,
    status TEXT NOT NULL CHECK (status IN (
        'draft', 'open', 'paid', 'uncollectible', 'void'
    )),
    
    -- Amounts (in cents)
    amount_due INTEGER NOT NULL,
    amount_paid INTEGER NOT NULL DEFAULT 0,
    amount_remaining INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL,
    tax INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    
    -- Currency
    currency TEXT NOT NULL DEFAULT 'usd',
    
    -- Dates
    invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- URLs
    hosted_invoice_url TEXT,
    invoice_pdf_url TEXT,
    
    -- Metadata
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for invoices
CREATE INDEX idx_invoices_customer_id ON billing.invoices(customer_id);
CREATE INDEX idx_invoices_subscription_id ON billing.invoices(subscription_id);
CREATE INDEX idx_invoices_stripe_id ON billing.invoices(stripe_invoice_id);
CREATE INDEX idx_invoices_status ON billing.invoices(status);
CREATE INDEX idx_invoices_date ON billing.invoices(invoice_date);
CREATE INDEX idx_invoices_due_date ON billing.invoices(due_date);

-- ============================================================================
-- USAGE RECORDS TABLE
-- ============================================================================
-- Track usage for metered billing
CREATE TABLE billing.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_item_id UUID NOT NULL REFERENCES billing.subscription_items(id) ON DELETE CASCADE,
    stripe_usage_record_id TEXT UNIQUE,
    
    -- Usage tracking
    quantity INTEGER NOT NULL,
    usage_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    action TEXT CHECK (action IN ('increment', 'set')) DEFAULT 'increment',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for usage records
CREATE INDEX idx_usage_records_subscription_item_id ON billing.usage_records(subscription_item_id);
CREATE INDEX idx_usage_records_timestamp ON billing.usage_records(usage_timestamp);
CREATE INDEX idx_usage_records_stripe_id ON billing.usage_records(stripe_usage_record_id);

-- ============================================================================
-- WEBHOOK EVENTS TABLE
-- ============================================================================
-- Track processed Stripe webhook events to prevent duplicate processing
CREATE TABLE billing.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event data
    api_version TEXT,
    object_id TEXT, -- ID of the object the event relates to
    object_type TEXT, -- Type of object (subscription, invoice, etc.)
    
    -- Processing status
    status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'failed', 'ignored')) DEFAULT 'pending',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Raw event data for debugging
    raw_event JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for webhook events
CREATE INDEX idx_webhook_events_stripe_id ON billing.webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_type ON billing.webhook_events(event_type);
CREATE INDEX idx_webhook_events_status ON billing.webhook_events(status);
CREATE INDEX idx_webhook_events_object ON billing.webhook_events(object_type, object_id);
CREATE INDEX idx_webhook_events_processed_at ON billing.webhook_events(processed_at);

-- ============================================================================
-- PAYMENT METHODS TABLE
-- ============================================================================
-- Store customer payment methods
CREATE TABLE billing.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    
    -- Payment method details
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'sepa_debit', 'ideal', 'paypal')),
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Card details (if applicable)
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    card_funding TEXT CHECK (card_funding IN ('credit', 'debit', 'prepaid', 'unknown')),
    
    -- Bank account details (if applicable)
    bank_name TEXT,
    bank_account_last4 TEXT,
    bank_account_type TEXT CHECK (bank_account_type IN ('checking', 'savings')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payment methods
CREATE INDEX idx_payment_methods_customer_id ON billing.payment_methods(customer_id);
CREATE INDEX idx_payment_methods_stripe_id ON billing.payment_methods(stripe_payment_method_id);
CREATE INDEX idx_payment_methods_default ON billing.payment_methods(customer_id, is_default);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION billing.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON billing.customers FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON billing.subscriptions FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();
CREATE TRIGGER update_subscription_items_updated_at BEFORE UPDATE ON billing.subscription_items FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON billing.invoices FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();
CREATE TRIGGER update_webhook_events_updated_at BEFORE UPDATE ON billing.webhook_events FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON billing.payment_methods FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active subscriptions with customer details
CREATE VIEW billing.active_subscriptions AS
SELECT 
    s.id,
    s.stripe_subscription_id,
    s.plan_name,
    s.plan_amount,
    s.plan_currency,
    s.plan_interval,
    s.status,
    s.current_period_start,
    s.current_period_end,
    c.user_id,
    c.email,
    c.name,
    u.id as auth_user_id,
    u.name as auth_user_name,
    u.email as auth_user_email
FROM billing.subscriptions s
JOIN billing.customers c ON s.customer_id = c.id
LEFT JOIN neon_auth.users_sync u ON c.user_id = u.id
WHERE s.status IN ('active', 'trialing', 'past_due')
  AND u.deleted_at IS NULL;

-- Customer billing summary
CREATE VIEW billing.customer_summary AS
SELECT 
    c.id as customer_id,
    c.user_id,
    c.email,
    c.name,
    COUNT(DISTINCT s.id) as subscription_count,
    COUNT(DISTINCT CASE WHEN s.status IN ('active', 'trialing') THEN s.id END) as active_subscriptions,
    SUM(CASE WHEN s.status IN ('active', 'trialing') THEN s.plan_amount ELSE 0 END) as monthly_revenue_cents,
    MAX(s.current_period_end) as next_billing_date,
    COUNT(DISTINCT i.id) as total_invoices,
    SUM(CASE WHEN i.status = 'paid' THEN i.total ELSE 0 END) as total_paid_cents
FROM billing.customers c
LEFT JOIN billing.subscriptions s ON c.id = s.customer_id
LEFT JOIN billing.invoices i ON c.id = i.customer_id
GROUP BY c.id, c.user_id, c.email, c.name;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment these lines to insert sample data for testing

-- Sample customer (replace with actual user_id from neon_auth.users_sync)
/*
INSERT INTO billing.customers (user_id, stripe_customer_id, email, name) 
VALUES ('sample_user_id', 'cus_sample123', 'test@example.com', 'Test User');
*/

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================
-- Grant appropriate permissions to your application role
-- Replace 'your_app_role' with your actual application database role

-- GRANT USAGE ON SCHEMA billing TO your_app_role;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA billing TO your_app_role;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA billing TO your_app_role;
-- GRANT SELECT ON billing.active_subscriptions TO your_app_role;
-- GRANT SELECT ON billing.customer_summary TO your_app_role; 