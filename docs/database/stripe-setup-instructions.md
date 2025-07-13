# Stripe Billing Database Setup Instructions

## 📋 Prerequisites

Before setting up the Stripe billing tables, ensure:

- ✅ Neon database project is created and accessible
- ✅ Stack Auth is configured (creates `neon_auth.users_sync` table)
- ✅ You have the Neon project ID ready
- ✅ Database connection is established

## 🚀 Setup Commands for AI Assistants

### Step 1: Create the Billing Schema

```bash
# Create the billing schema
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE SCHEMA IF NOT EXISTS billing;"
})
```

### Step 2: Create Core Tables (in order)

#### 2.1 Create Customers Table

```bash
# Create customers table (links Stripe customers to auth users)
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.2 Create Customers Indexes

```bash
# Create indexes for customers table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_customers_user_id ON billing.customers(user_id);",
    "CREATE INDEX idx_customers_stripe_id ON billing.customers(stripe_customer_id);",
    "CREATE INDEX idx_customers_email ON billing.customers(email);"
  ]
})
```

#### 2.3 Create Subscriptions Table

```bash
# Create subscriptions table
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'incomplete', 'incomplete_expired', 'trialing', 'active',
        'past_due', 'canceled', 'unpaid', 'paused'
    )),
    stripe_price_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    plan_amount INTEGER NOT NULL,
    plan_currency TEXT NOT NULL DEFAULT 'usd',
    plan_interval TEXT NOT NULL CHECK (plan_interval IN ('day', 'week', 'month', 'year')),
    plan_interval_count INTEGER NOT NULL DEFAULT 1,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.4 Create Subscriptions Indexes

```bash
# Create indexes for subscriptions table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_subscriptions_customer_id ON billing.subscriptions(customer_id);",
    "CREATE INDEX idx_subscriptions_stripe_id ON billing.subscriptions(stripe_subscription_id);",
    "CREATE INDEX idx_subscriptions_status ON billing.subscriptions(status);",
    "CREATE INDEX idx_subscriptions_current_period ON billing.subscriptions(current_period_start, current_period_end);",
    "CREATE INDEX idx_subscriptions_plan_name ON billing.subscriptions(plan_name);"
  ]
})
```

#### 2.5 Create Subscription Items Table

```bash
# Create subscription items table (for usage-based billing)
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.subscription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id) ON DELETE CASCADE,
    stripe_subscription_item_id TEXT NOT NULL UNIQUE,
    stripe_price_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_amount INTEGER NOT NULL,
    price_currency TEXT NOT NULL DEFAULT 'usd',
    price_type TEXT NOT NULL CHECK (price_type IN ('one_time', 'recurring')),
    price_interval TEXT CHECK (price_interval IN ('day', 'week', 'month', 'year')),
    price_interval_count INTEGER DEFAULT 1,
    usage_type TEXT CHECK (usage_type IN ('licensed', 'metered')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.6 Create Subscription Items Indexes

```bash
# Create indexes for subscription items table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_subscription_items_subscription_id ON billing.subscription_items(subscription_id);",
    "CREATE INDEX idx_subscription_items_stripe_id ON billing.subscription_items(stripe_subscription_item_id);",
    "CREATE INDEX idx_subscription_items_price_id ON billing.subscription_items(stripe_price_id);"
  ]
})
```

#### 2.7 Create Invoices Table

```bash
# Create invoices table
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES billing.subscriptions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    invoice_number TEXT,
    status TEXT NOT NULL CHECK (status IN (
        'draft', 'open', 'paid', 'uncollectible', 'void'
    )),
    amount_due INTEGER NOT NULL,
    amount_paid INTEGER NOT NULL DEFAULT 0,
    amount_remaining INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL,
    tax INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    hosted_invoice_url TEXT,
    invoice_pdf_url TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.8 Create Invoices Indexes

```bash
# Create indexes for invoices table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_invoices_customer_id ON billing.invoices(customer_id);",
    "CREATE INDEX idx_invoices_subscription_id ON billing.invoices(subscription_id);",
    "CREATE INDEX idx_invoices_stripe_id ON billing.invoices(stripe_invoice_id);",
    "CREATE INDEX idx_invoices_status ON billing.invoices(status);",
    "CREATE INDEX idx_invoices_date ON billing.invoices(invoice_date);",
    "CREATE INDEX idx_invoices_due_date ON billing.invoices(due_date);"
  ]
})
```

#### 2.9 Create Usage Records Table

```bash
# Create usage records table (for metered billing)
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_item_id UUID NOT NULL REFERENCES billing.subscription_items(id) ON DELETE CASCADE,
    stripe_usage_record_id TEXT UNIQUE,
    quantity INTEGER NOT NULL,
    usage_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    action TEXT CHECK (action IN ('increment', 'set')) DEFAULT 'increment',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.10 Create Usage Records Indexes

```bash
# Create indexes for usage records table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_usage_records_subscription_item_id ON billing.usage_records(subscription_item_id);",
    "CREATE INDEX idx_usage_records_timestamp ON billing.usage_records(usage_timestamp);",
    "CREATE INDEX idx_usage_records_stripe_id ON billing.usage_records(stripe_usage_record_id);"
  ]
})
```

#### 2.11 Create Webhook Events Table

```bash
# Create webhook events table (prevent duplicate processing)
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    api_version TEXT,
    object_id TEXT,
    object_type TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'failed', 'ignored')) DEFAULT 'pending',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    raw_event JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.12 Create Webhook Events Indexes

```bash
# Create indexes for webhook events table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_webhook_events_stripe_id ON billing.webhook_events(stripe_event_id);",
    "CREATE INDEX idx_webhook_events_type ON billing.webhook_events(event_type);",
    "CREATE INDEX idx_webhook_events_status ON billing.webhook_events(status);",
    "CREATE INDEX idx_webhook_events_object ON billing.webhook_events(object_type, object_id);",
    "CREATE INDEX idx_webhook_events_processed_at ON billing.webhook_events(processed_at);"
  ]
})
```

#### 2.13 Create Payment Methods Table

```bash
# Create payment methods table
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE TABLE billing.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'sepa_debit', 'ideal', 'paypal')),
    is_default BOOLEAN DEFAULT FALSE,
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    card_funding TEXT CHECK (card_funding IN ('credit', 'debit', 'prepaid', 'unknown')),
    bank_name TEXT,
    bank_account_last4 TEXT,
    bank_account_type TEXT CHECK (bank_account_type IN ('checking', 'savings')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
})
```

#### 2.14 Create Payment Methods Indexes

```bash
# Create indexes for payment methods table
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE INDEX idx_payment_methods_customer_id ON billing.payment_methods(customer_id);",
    "CREATE INDEX idx_payment_methods_stripe_id ON billing.payment_methods(stripe_payment_method_id);",
    "CREATE INDEX idx_payment_methods_default ON billing.payment_methods(customer_id, is_default);"
  ]
})
```

### Step 3: Create Update Triggers

#### 3.1 Create Update Function

```bash
# Create function to update updated_at timestamp
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE OR REPLACE FUNCTION billing.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';"
})
```

#### 3.2 Create Update Triggers

```bash
# Create triggers for all tables with updated_at columns
mcp_Neon_run_sql_transaction({
  "projectId": "your-neon-project-id",
  "sqlStatements": [
    "CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON billing.customers FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();",
    "CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON billing.subscriptions FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();",
    "CREATE TRIGGER update_subscription_items_updated_at BEFORE UPDATE ON billing.subscription_items FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();",
    "CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON billing.invoices FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();",
    "CREATE TRIGGER update_webhook_events_updated_at BEFORE UPDATE ON billing.webhook_events FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();",
    "CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON billing.payment_methods FOR EACH ROW EXECUTE FUNCTION billing.update_updated_at_column();"
  ]
})
```

### Step 4: Create Useful Views

#### 4.1 Create Active Subscriptions View

```bash
# Create view for active subscriptions with customer details
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE VIEW billing.active_subscriptions AS
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
  AND u.deleted_at IS NULL;"
})
```

#### 4.2 Create Customer Summary View

```bash
# Create view for customer billing summary
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "CREATE VIEW billing.customer_summary AS
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
GROUP BY c.id, c.user_id, c.email, c.name;"
})
```

### Step 5: Verify Installation

#### 5.1 List All Tables

```bash
# Verify all tables were created
mcp_Neon_get_database_tables({
  "projectId": "your-neon-project-id"
})
```

#### 5.2 Check Specific Table Schema

```bash
# Check the structure of the customers table
mcp_Neon_describe_table_schema({
  "projectId": "your-neon-project-id",
  "tableName": "customers",
  "databaseName": "neondb"
})
```

#### 5.3 Test Views

```bash
# Test the active subscriptions view
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "SELECT * FROM billing.active_subscriptions LIMIT 1;"
})
```

## 🔧 Troubleshooting

### Common Issues

1. **Foreign Key Errors**: Ensure `neon_auth.users_sync` table exists before creating customers table
2. **Permission Errors**: Make sure the database user has CREATE privileges
3. **Schema Errors**: Verify the billing schema was created successfully

### Verification Commands

```bash
# Check if neon_auth schema exists
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'neon_auth';"
})

# Check if users_sync table exists
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "SELECT table_name FROM information_schema.tables WHERE table_schema = 'neon_auth' AND table_name = 'users_sync';"
})
```

## 🎯 Quick Setup (All at Once)

For experienced users, you can also run the entire schema at once:

```bash
# Run the entire schema file (use with caution)
mcp_Neon_run_sql({
  "projectId": "your-neon-project-id",
  "sql": "-- Paste the entire contents of stripe-schema.sql here"
})
```

## 📝 Next Steps

After creating the database schema:

1. **Set up Stripe environment variables** in your `.env.local`
2. **Create API routes** for Stripe webhooks and checkout
3. **Implement subscription management** in your application
4. **Test with Stripe test mode** before going live

## 🚨 Important Notes

- Always use **test mode** when developing
- Set up **webhook endpoints** to keep data synchronized
- Implement **proper error handling** for failed payments
- Consider **data retention policies** for compliance
- Test **edge cases** like failed payments and cancellations
