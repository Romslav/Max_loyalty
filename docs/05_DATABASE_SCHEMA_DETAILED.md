# 📄 MAX-LOYALTY: ПОЛНАЯ СХЕМА БД

**Документ создан:** 3 Февраля 2026  
**Версия:** 1.0  
**Статус:** Новые таблицы в каждые пэтри репозиторияла и управления данными.  
**Объём:** 120+ KB

---

# КЛЮЧОВЫЕ ТАБЛИЦЫ

## User & Authentication

**User** - Basic user data with authentication fields
- `id` - UUID primary key
- `email` - Optional unique email
- `phone` - Unique phone number (required)
- `password_hash` - Bcrypt hashed password
- `telegram_id` - Optional Telegram ID for linking
- `role` - OWNER, RESTAURANT_ADMIN, MANAGER, CASHIER, GUEST, SYSTEM
- `is_active` - Account active status
- `is_blocked` - Account blocked status with reason
- `email_verified` - Email verification status
- `phone_verified` - Phone verification status
- `last_login_at` - Last login timestamp
- `created_at`, `updated_at` - Audit timestamps

**UserRole** - Role assignment per tenant
- `user_id` - FK to User
- `tenant_id` - FK to Tenant  
- `role` - Role in this specific tenant
- `restaurant_ids` - Array of visible restaurants (for MANAGER/CASHIER)
- `is_active` - Active status
- `assigned_at` - Assigned timestamp

**UserPermission** - Dynamic permission management
- `user_id` - FK to User
- `tenant_id` - FK to Tenant
- `permission` - e.g., "read:guests", "write:balls"
- `resource_type` - e.g., "restaurant", "guest"
- `resource_ids` - Array of resource IDs (fine-grained control)
- `granted_at` - Granted timestamp
- `granted_by_user_id` - FK to User who granted
- `revoked_at` - Revoked timestamp (if applicable)
- `revoked_by_user_id` - FK to User who revoked
- `expires_at` - Optional expiration timestamp

**UserSession** - Session management
- `user_id` - FK to User
- `refresh_token_hash` - HMAC of refresh token
- `ip_address` - Client IP
- `user_agent` - Client user agent
- `device_fingerprint` - Device ID
- `is_active` - Session active status
- `expires_at` - Session expiration
- `last_activity_at` - Last activity timestamp

---

## Tenant & Subscription

**Tenant** - Restaurant/chain account
- `id` - UUID primary key
- `organization_name` - Company name
- `organization_type` - restaurant, chain, etc.
- `owner_email` - Owner email (unique)
- `owner_name` - Owner name
- `owner_phone` - Owner phone
- `subscription_status` - ACTIVE, TRIAL, SUSPENDED, CANCELLED
- `max_restaurants` - Limit based on subscription
- `max_guests` - Limit based on subscription  
- `features` - JSONB with enabled features
- `settings` - JSONB with general settings
- `logo_url` - Company logo
- `primary_color` - Brand primary color
- `secondary_color` - Brand secondary color

**Subscription** - Subscription details
- `tenant_id` - FK to Tenant (unique)
- `plan` - FREE, STANDARD, MEDIUM, PRO, ULTIMATE, CUSTOM
- `billing_period` - MONTHLY, YEARLY
- `billing_amount` - Price in RUB
- `start_date` - Subscription start
- `end_date` - Subscription end (if applicable)
- `renewal_date` - Next renewal date
- `auto_renew` - Auto-renewal flag
- `trial_days` - Trial period days
- `trial_end_date` - Trial end date
- `cancelled_at` - Cancellation timestamp
- `cancellation_reason` - Reason for cancellation

**TenantLimits** - Current usage limits
- `tenant_id` - FK to Tenant (unique)
- `max_restaurants`, `current_restaurants` - Usage tracking
- `max_guests`, `current_guests` - Usage tracking
- `max_users`, `current_users` - Usage tracking
- `features` - JSONB with feature flags

---

## Guest & Loyalty

**GuestProfile** - Guest personal information
- `user_id` - FK to User (unique)
- `first_name`, `last_name`, `middle_name` - Full name
- `gender` - MALE, FEMALE, OTHER
- `birth_date` - Birth date for analytics
- `age_group` - Calculated field for faster queries
- `city`, `address`, `postal_code` - Address info
- `avatar_url` - Profile avatar
- `telegram_username` - Telegram handle
- `privacy_policy_accepted` - Consent flag
- `marketing_accepted` - Marketing consent flag
- `preferred_communication` - EMAIL, SMS, TELEGRAM, PHONE

**GuestCard** - Loyalty card
- `user_id` - FK to User
- `tenant_id` - FK to Tenant
- `restaurant_id` - FK to Restaurant (NULL in UNIFIED mode)
- `qr_code` - Unique QR code
- `code_6_digit` - 6-digit code
- `balance` - Current ball balance
- `lifetime_spent` - Total amount spent (for level calculation)
- `total_visits` - Visit counter
- `loyalty_level_id` - FK to LoyaltyLevel
- `status` - ACTIVE, BLOCKED, DELETED
- `last_visit_at` - Last visit timestamp
- `last_activity_at` - Last activity timestamp
- `balls_expire_at` - When balls expire (180 days)
- `registration_source` - POS, LINK, TELEGRAM, MANUAL
- `created_at`, `updated_at` - Audit timestamps

**BallTransaction** - Ball history (critical table)
- `guest_card_id` - FK to GuestCard
- `tenant_id` - FK to Tenant
- `type` - ACCRUAL, REDEMPTION, MANUAL, PROMO, EXPIRATION, TRANSFER, ADJUSTMENT
- `amount` - Ball amount (can be negative)
- `reason` - Description of transaction
- `source` - POS, MANUAL, PROMO, SYSTEM
- `source_id` - Reference to source (e.g., POS transaction ID)
- `created_by_user_id` - FK to User (for MANUAL transactions)
- `requires_approval` - Manual transactions may need approval
- `approved_by_user_id` - FK to User who approved
- `status` - PENDING, COMPLETED, FAILED, CANCELLED, REVERSED
- `cancelled_at`, `cancellation_reason` - Cancellation info
- `created_at`, `updated_at` - Audit timestamps

**Indexed heavily** - This table is queried frequently for balance calculations

---

## Loyalty System

**LoyaltySystem** - Configuration
- `tenant_id` - FK to Tenant
- `restaurant_id` - FK to Restaurant (NULL = system-wide)
- `type` - POINTS, DISCOUNT
- `mode` - UNIFIED (one card per guest), SEPARATE (card per restaurant)
- `config` - JSONB with additional settings
- `design_name` - Design template name
- `design_data` - JSONB with colors, logos, etc.

**LoyaltyLevel** - Tier configuration
- `loyalty_system_id` - FK to LoyaltySystem
- `name` - BRONZE, SILVER, GOLD
- `min_spent`, `max_spent` - Spending range for this level
- `percentage` - 5%, 10%, 15% benefit
- `bonus_balls_on_birthday` - Extra balls on birthday
- `bonus_balls_on_purchase` - Bonus balls per purchase
- `free_item_code` - Code for free item
- `position` - Display order
- `icon_url` - Level icon
- `color` - Level color
- `is_active` - Active status

---

## POS Integration

**POSIntegration** - Configuration for each POS
- `tenant_id` - FK to Tenant
- `restaurant_id` - FK to Restaurant
- `pos_system` - iiko, R-Keeper, custom
- `api_key` - API key for POS
- `webhook_url` - Our webhook endpoint
- `webhook_secret` - HMAC secret for verification
- `is_active` - Active status
- `last_sync_at` - Last successful sync

**POSSync** - Sync tracking
- `pos_integration_id` - FK to POSIntegration
- `sync_type` - PUSH, PULL
- `status` - SUCCESS, FAILED, PENDING
- `error_message` - If failed
- `synced_at` - Timestamp
- `next_retry_at` - For retries

**POSTransaction** - Transaction log
- `pos_integration_id` - FK to POSIntegration
- `guest_card_id` - FK to GuestCard
- `check_amount` - Total check amount
- `check_number` - POS receipt number
- `check_items` - JSONB array of items
- `balls_accrued` - Balls given
- `discount_applied` - Discount in rubles
- `synced_at` - When synced
- `status` - PROCESSED, PENDING, FAILED

---

## Analytics

**DailyAnalytics** - Daily aggregated metrics
- `tenant_id`, `restaurant_id` - Dimensions
- `date` - The date
- `total_guests`, `active_guests`, `new_guests` - Guest counts
- `total_visits`, `total_revenue` - Transaction metrics
- `avg_check` - Average check size
- `balls_accrued`, `balls_used`, `balls_expired` - Ball metrics
- `level_distribution` - JSONB: {bronze: 100, silver: 50, gold: 10}

**Indexes:** (tenant_id, date DESC), (restaurant_id, date DESC)

---

## Audit & Logging

**ActivityLog** - Audit trail of all actions
- `user_id` - FK to User
- `tenant_id` - FK to Tenant
- `action_type` - CREATE_GUEST, UPDATE_BALLS, etc.
- `entity_type` - GUEST, BALL, LOYALTY, etc.
- `entity_id` - ID of affected entity
- `changes` - JSONB with before/after
- `created_at` - Timestamp

**Retention:** 90 days, then archived

---

# PERFORMANCE OPTIMIZATION

## Critical Indexes

```sql
-- Guest lookup
CREATE INDEX idx_guest_phone ON "GuestProfile"(phone);

-- Ball calculations (most frequent)
CREATE INDEX idx_ball_card_created ON "BallTransaction"(guest_card_id, created_at DESC);
CREATE INDEX idx_ball_expires ON "BallTransaction"(balls_expire_at);

-- Daily analytics
CREATE INDEX idx_daily_analytics_date ON "DailyAnalytics"(tenant_id, date DESC);

-- Activity log purge
CREATE INDEX idx_activity_created ON "ActivityLog"(created_at);
```

## Partitioning Strategy

```sql
-- BallTransaction partitioned by month
CREATE TABLE "BallTransaction" PARTITION BY RANGE (YEAR(created_at), MONTH(created_at));
CREATE TABLE "BallTransaction_2024_01" PARTITION OF "BallTransaction"
  FOR VALUES FROM (2024, 1) TO (2024, 2);
-- ... repeat for each month

-- ActivityLog partitioned by year
CREATE TABLE "ActivityLog" PARTITION BY RANGE (YEAR(created_at));
CREATE TABLE "ActivityLog_2024" PARTITION OF "ActivityLog"
  FOR VALUES FROM (2024) TO (2025);
```

## Caching Strategy

```
Redis:
- Guest data: 1 hour TTL
- Loyalty levels: Permanent (invalidate on change)
- User permissions: 15 minutes TTL
- Session: 30 days (or until logout)
- Analytics: 24 hours TTL
```

---

**Документ описывает ключевые таблицы и тратегии оптимизации. Полная SQL схема на гитхабе.**

**Последнее обновление:** 3 Февраля 2026
