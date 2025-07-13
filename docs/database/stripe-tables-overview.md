# Stripe Billing Tables Overview

## 📋 Database Schema Structure

The Stripe billing schema consists of 7 core tables organized in the `billing` schema, designed to work seamlessly with Stack Auth's `neon_auth.users_sync` table.

## 🗃️ Core Tables

### 1. **billing.customers**

**Purpose**: Links Stripe customers to authenticated users from Stack Auth

**Key Fields**:

- `user_id` → References `neon_auth.users_sync(id)`
- `stripe_customer_id` → Unique Stripe customer identifier
- `email`, `name` → Customer contact information

**Relationships**:

- **Parent**: `neon_auth.users_sync` (via `user_id`)
- **Children**: `subscriptions`, `invoices`, `payment_methods`

**Usage Examples**:

```sql
-- Find customer by auth user ID
SELECT * FROM billing.customers WHERE user_id = 'auth_user_123';

-- Get all customers with their auth user details
SELECT c.*, u.name as auth_name, u.email as auth_email
FROM billing.customers c
LEFT JOIN neon_auth.users_sync u ON c.user_id = u.id
WHERE u.deleted_at IS NULL;
```

---

### 2. **billing.subscriptions**

**Purpose**: Main subscription data synchronized with Stripe subscriptions

**Key Fields**:

- `stripe_subscription_id` → Unique Stripe subscription identifier
- `status` → Current subscription status (active, canceled, etc.)
- `plan_name`, `plan_amount` → Subscription plan details
- `current_period_start/end` → Billing period dates
- `trial_start/end` → Trial period dates (if applicable)

**Relationships**:

- **Parent**: `billing.customers` (via `customer_id`)
- **Children**: `subscription_items`, `invoices`

**Usage Examples**:

```sql
-- Get all active subscriptions
SELECT * FROM billing.subscriptions
WHERE status IN ('active', 'trialing');

-- Find user's current subscription
SELECT s.* FROM billing.subscriptions s
JOIN billing.customers c ON s.customer_id = c.id
WHERE c.user_id = 'auth_user_123' AND s.status = 'active';
```

---

### 3. **billing.subscription_items**

**Purpose**: Individual line items within subscriptions (for usage-based billing)

**Key Fields**:

- `stripe_subscription_item_id` → Unique Stripe subscription item identifier
- `stripe_price_id` → Stripe price/product identifier
- `quantity` → Number of units
- `usage_type` → 'licensed' or 'metered' billing

**Relationships**:

- **Parent**: `billing.subscriptions` (via `subscription_id`)
- **Children**: `usage_records`

**Usage Examples**:

```sql
-- Get all items for a subscription
SELECT * FROM billing.subscription_items
WHERE subscription_id = 'subscription_uuid_123';

-- Find metered billing items
SELECT * FROM billing.subscription_items
WHERE usage_type = 'metered';
```

---

### 4. **billing.invoices**

**Purpose**: Payment history and invoice records from Stripe

**Key Fields**:

- `stripe_invoice_id` → Unique Stripe invoice identifier
- `status` → Invoice status (paid, open, void, etc.)
- `amount_due`, `amount_paid`, `total` → Financial amounts in cents
- `invoice_date`, `due_date` → Important dates
- `hosted_invoice_url` → Stripe-hosted invoice URL

**Relationships**:

- **Parent**: `billing.customers` (via `customer_id`)
- **Parent**: `billing.subscriptions` (via `subscription_id`, optional)

**Usage Examples**:

```sql
-- Get all paid invoices for a customer
SELECT * FROM billing.invoices
WHERE customer_id = 'customer_uuid_123' AND status = 'paid';

-- Calculate total revenue
SELECT SUM(total) as total_revenue_cents
FROM billing.invoices
WHERE status = 'paid';
```

---

### 5. **billing.usage_records**

**Purpose**: Track usage for metered billing subscriptions

**Key Fields**:

- `stripe_usage_record_id` → Unique Stripe usage record identifier
- `quantity` → Usage amount
- `usage_timestamp` → When usage occurred
- `action` → 'increment' or 'set'

**Relationships**:

- **Parent**: `billing.subscription_items` (via `subscription_item_id`)

**Usage Examples**:

```sql
-- Get usage for a specific subscription item
SELECT * FROM billing.usage_records
WHERE subscription_item_id = 'item_uuid_123'
ORDER BY usage_timestamp DESC;

-- Calculate monthly usage
SELECT DATE_TRUNC('month', usage_timestamp) as month,
       SUM(quantity) as total_usage
FROM billing.usage_records
WHERE subscription_item_id = 'item_uuid_123'
GROUP BY month;
```

---

### 6. **billing.webhook_events**

**Purpose**: Track processed Stripe webhook events to prevent duplicate processing

**Key Fields**:

- `stripe_event_id` → Unique Stripe event identifier
- `event_type` → Type of event (subscription.created, invoice.paid, etc.)
- `status` → Processing status (pending, processed, failed)
- `object_id`, `object_type` → Related object information
- `raw_event` → Full event JSON for debugging

**Relationships**:

- **Standalone**: No foreign keys, references objects by ID

**Usage Examples**:

```sql
-- Check if event was already processed
SELECT * FROM billing.webhook_events
WHERE stripe_event_id = 'evt_stripe_123';

-- Get failed webhook events for retry
SELECT * FROM billing.webhook_events
WHERE status = 'failed' AND retry_count < 3;
```

---

### 7. **billing.payment_methods**

**Purpose**: Store customer payment methods (cards, bank accounts)

**Key Fields**:

- `stripe_payment_method_id` → Unique Stripe payment method identifier
- `type` → Payment method type (card, bank_account, etc.)
- `is_default` → Whether this is the default payment method
- `card_brand`, `card_last4` → Card details (if applicable)
- `bank_name`, `bank_account_last4` → Bank details (if applicable)

**Relationships**:

- **Parent**: `billing.customers` (via `customer_id`)

**Usage Examples**:

```sql
-- Get customer's default payment method
SELECT * FROM billing.payment_methods
WHERE customer_id = 'customer_uuid_123' AND is_default = true;

-- Get all active cards for a customer
SELECT * FROM billing.payment_methods
WHERE customer_id = 'customer_uuid_123' AND type = 'card';
```

---

## 🔗 Table Relationships Diagram

```
neon_auth.users_sync
        ↓
billing.customers
        ↓
        ├── billing.subscriptions
        │   ├── billing.subscription_items
        │   │   └── billing.usage_records
        │   └── billing.invoices
        ├── billing.invoices
        └── billing.payment_methods

billing.webhook_events (standalone)
```

## 📊 Useful Views

### **billing.active_subscriptions**

Combines subscription and customer data for active subscriptions:

```sql
SELECT * FROM billing.active_subscriptions
WHERE auth_user_id = 'user_123';
```

### **billing.customer_summary**

Provides billing summary for each customer:

```sql
SELECT * FROM billing.customer_summary
WHERE active_subscriptions > 0;
```

## 🎯 Common Query Patterns

### 1. **Check User's Subscription Status**

```sql
SELECT s.status, s.plan_name, s.current_period_end
FROM billing.subscriptions s
JOIN billing.customers c ON s.customer_id = c.id
WHERE c.user_id = 'auth_user_123'
  AND s.status IN ('active', 'trialing', 'past_due')
ORDER BY s.created_at DESC
LIMIT 1;
```

### 2. **Get User's Billing History**

```sql
SELECT i.invoice_date, i.total, i.status, i.hosted_invoice_url
FROM billing.invoices i
JOIN billing.customers c ON i.customer_id = c.id
WHERE c.user_id = 'auth_user_123'
ORDER BY i.invoice_date DESC;
```

### 3. **Calculate Monthly Recurring Revenue (MRR)**

```sql
SELECT SUM(
  CASE
    WHEN plan_interval = 'month' THEN plan_amount
    WHEN plan_interval = 'year' THEN plan_amount / 12
    ELSE 0
  END
) as mrr_cents
FROM billing.subscriptions
WHERE status IN ('active', 'trialing');
```

### 4. **Find Customers with Expired Trials**

```sql
SELECT c.user_id, c.email, s.trial_end
FROM billing.customers c
JOIN billing.subscriptions s ON c.id = s.customer_id
WHERE s.status = 'trialing'
  AND s.trial_end < NOW();
```

### 5. **Get Usage-Based Billing Data**

```sql
SELECT
  c.user_id,
  si.stripe_price_id,
  SUM(ur.quantity) as total_usage,
  COUNT(ur.id) as usage_events
FROM billing.customers c
JOIN billing.subscriptions s ON c.id = s.customer_id
JOIN billing.subscription_items si ON s.id = si.subscription_id
JOIN billing.usage_records ur ON si.id = ur.subscription_item_id
WHERE ur.usage_timestamp >= DATE_TRUNC('month', NOW())
GROUP BY c.user_id, si.stripe_price_id;
```

## 🔧 Performance Optimization

### **Indexes for Common Queries**

All necessary indexes are included in the schema:

- **User lookups**: `idx_customers_user_id`
- **Stripe ID lookups**: `idx_*_stripe_id` on all tables
- **Status filtering**: `idx_subscriptions_status`
- **Date range queries**: `idx_subscriptions_current_period`, `idx_invoices_date`
- **Usage tracking**: `idx_usage_records_timestamp`

### **Query Optimization Tips**

1. **Always filter by user_id first** when looking up customer data
2. **Use the views** (`active_subscriptions`, `customer_summary`) for common queries
3. **Filter by status** when querying subscriptions
4. **Use date indexes** for billing period queries
5. **Avoid SELECT \*** on large tables, especially `webhook_events`

## 🚨 Data Integrity Rules

### **Foreign Key Constraints**

- All child tables cascade delete when parent is deleted
- `invoices.subscription_id` sets to NULL if subscription is deleted
- `customers.user_id` references `neon_auth.users_sync(id)`

### **Check Constraints**

- Subscription status must be valid Stripe status
- Payment method type must be supported
- Plan intervals must be valid (day, week, month, year)
- Amounts stored in cents (integers)

### **Unique Constraints**

- All Stripe IDs must be unique
- Customer can have only one default payment method
- Webhook events are unique by Stripe event ID

## 📝 Best Practices

### **Data Synchronization**

1. **Webhook-driven updates**: Use Stripe webhooks to keep data in sync
2. **Idempotency**: Check `webhook_events` table before processing
3. **Error handling**: Store failed events for retry
4. **Audit trail**: Keep raw event data for debugging

### **Security**

1. **Verify webhooks**: Always verify Stripe webhook signatures
2. **Encrypt sensitive data**: Consider encrypting payment method details
3. **Access control**: Limit database access to billing-related operations
4. **Data retention**: Implement policies for old invoice/usage data

### **Performance**

1. **Pagination**: Use LIMIT/OFFSET for large result sets
2. **Caching**: Cache frequently accessed subscription data
3. **Archiving**: Archive old webhook events and usage records
4. **Monitoring**: Track query performance and optimize as needed
