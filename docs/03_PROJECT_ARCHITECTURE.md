# 🏗️ MAX-LOYALTY: ПОЛНАЯ АРХИТЕКТУРА СИСТЕМЫ

**Документ создан:** 3 Февраля 2026
**Версия:** 1.0
**Статус:** Детальная архитектура
**Объём:** 120+ KB

---

## 📑 СОДЕРЖАНИЕ

- [High-Level Architecture](#high-level-architecture)
- [Tech Stack](#tech-stack)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Architecture](#database-architecture)
- [API Architecture](#api-architecture)
- [Security Architecture](#security-architecture)
- [Scalability Architecture](#scalability-architecture)
- [Integration Architecture](#integration-architecture)
- [Deployment Architecture](#deployment-architecture)

---

# HIGH-LEVEL ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────┐
│                  USERS & CLIENTS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Admin Panel  │  │ Telegram Bot │  │  POS System  │         │
│  │  (Browser)   │  │ + Mini App   │  │  (Webhook)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────┬───────────────┬──────────────┬────────────────────┘
             │               │              │
             └───────────────┼──────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   API Gateway     │
                   │  (REST + JWT Auth)│
                   └─────────┬─────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  BACKEND (NestJS)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Modules:                                                 │  │
│  │ ├─ Auth           ├─ Guests       ├─ Analytics         │  │
│  │ ├─ Users          ├─ Balls        ├─ Notifications     │  │
│  │ ├─ Loyalty        ├─ POS          ├─ Settings          │  │
│  │ ├─ Restaurants    ├─ Telegram     └─ Logging           │  │
│  │ └─ Subscriptions  └─ Payments                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Common:                                                  │  │
│  │ ├─ Guards (RoleGuard, PermissionGuard)                  │  │
│  │ ├─ Decorators (@RequireRole, @RequirePermission)        │  │
│  │ ├─ Filters (ExceptionFilter)                            │  │
│  │ ├─ Interceptors (LoggingInterceptor)                    │  │
│  │ ├─ Pipes (ValidationPipe)                               │  │
│  │ └─ Middleware (CORS, Rate Limiting)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬───────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼────────┐
│  PostgreSQL    │  │     Redis       │  │   Telegram    │
│   (Primary)    │  │    (Cache)      │  │   Bot API     │
└────────────────┘  └─────────────────┘  └───────────────┘
```

---

# TECH STACK

## Backend
```
Runtime:        Node.js 18+
Framework:      NestJS 10+
Language:       TypeScript 5+
ORM:            Prisma 5+
Validation:     class-validator
Logging:        Winston
Testing:        Jest
```

## Frontend
```
Framework:      React 18+
Build Tool:     Vite 5+
State Mgmt:     Zustand
Data Fetching:  React Query (TanStack Query)
Styling:        TailwindCSS 3+
UI Components:  Radix UI / Headless UI
Testing:        Vitest + React Testing Library
```

## Database
```
Primary:        PostgreSQL 14+
Cache:          Redis 7+
Search:         Elasticsearch (для advanced)
```

## Infrastructure
```
Containerization: Docker
Orchestration:    Kubernetes
CI/CD:            GitHub Actions
Monitoring:       Prometheus + Grafana
Logging:          ELK Stack
```

## Cloud
```
Compute:        AWS ECS / EC2
Database:       AWS RDS (PostgreSQL)
Cache:          AWS ElastiCache (Redis)
Storage:        AWS S3
CDN:            CloudFront
DNS:            Route 53
```

## Integrations
```
Payments:       Stripe / YooKassa
Email:          SendGrid / Mailgun
SMS:            Twilio / Vonage
Telegram:       Telegram Bot API
POS:            iiko API, R-Keeper API
```

---

# BACKEND ARCHITECTURE

## Layered Architecture

```
┌─────────────────────────────────────────┐
│      Presentation Layer                 │
│  (Controllers, DTOs, Decorators)        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Business Logic Layer               │
│  (Services, Guards, Interceptors)       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Data Access Layer                  │
│  (Repositories, Entities, Prisma)       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Database Layer                     │
│  (PostgreSQL, Redis)                    │
└─────────────────────────────────────────┘
```

## Module Structure

Каждый модуль имеет:
- `*.controller.ts` - HTTP handlers
- `*.service.ts` - business logic
- `*.repository.ts` - data access
- `*.module.ts` - module definition
- `dto/` - Data Transfer Objects
- `entities/` - Database entities
- `interfaces/` - TypeScript interfaces
- `tests/` - Unit и integration tests

---

# FRONTEND ARCHITECTURE

## Component Structure

```
Pages (по функциональности)
├─ Owner/
│  ├─ Dashboard.tsx
│  ├─ Restaurants.tsx
│  ├─ Analytics.tsx
│  └─ Billing.tsx
├─ RestaurantAdmin/
│  ├─ Dashboard.tsx
│  ├─ Guests.tsx
│  ├─ Loyalty.tsx
│  ├─ Analytics.tsx
│  └─ Settings.tsx
├─ Manager/ ... Cashier/ ... Auth/

Components (переиспользуемые)
├─ common/ (Header, Sidebar, Button, Modal, Table, Form)
├─ guests/ (GuestCard, GuestForm, GuestList, GuestDetail)
├─ loyalty/ (LevelCard, PromoBanner, LoyaltyChart)
├─ analytics/ (MetricCard, TrendChart, ReportGenerator)

Hooks (logic)
├─ useAuth.ts
├─ useGuests.ts
├─ useFetch.ts
├─ useLocalStorage.ts
├─ useDebounce.ts

Services (API calls)
├─ api.ts (основной конфиг)
├─ auth.service.ts
├─ guests.service.ts
├─ loyalty.service.ts

Store (Zustand state management)
├─ authStore.ts
├─ guestStore.ts
├─ uiStore.ts

Types (TypeScript definitions)
├─ auth.ts
├─ guest.ts
├─ loyalty.ts
└─ api.ts
```

---

# DATABASE ARCHITECTURE

## Multi-Tenant Design

```
All tables have tenant_id field
├─ User (global, но может быть в разных tenants)
├─ Guest (имеет tenant_id)
├─ Loyalty (имеет tenant_id)
├─ Ball (имеет tenant_id)
└─ ... все таблицы

Row-Level Security (RLS) в PostgreSQL:
└─ Пользователь видит только данные своего tenant_id
```

## Indexing Strategy

```
Первичные индексы:
- Все foreign keys
- Часто используемые поля (email, phone, status)
- Дата (created_at, updated_at)
- Tenant ID + основное поле

Primary Indexes:
- guest_id + created_at DESC
- tenant_id + status
- phone
- email
```

## Partitioning

```
Для больших таблиц (BallTransaction, ActivityLog):
- Партиционирование по месяцам
- BallTransaction_2024_01, BallTransaction_2024_02, ...
- Улучшает performance для старых данных
```

---

# API ARCHITECTURE

## REST Design

```
GET    /api/v1/guests                  - список
GET    /api/v1/guests/:id              - деталь
POST   /api/v1/guests                  - создание
PUT    /api/v1/guests/:id              - обновление
DELETE /api/v1/guests/:id              - удаление

После ресурса:
/api/v1/guests/:id/children           - вложенный ресурс
/api/v1/guests/:id/visits             - коллекция
```

## Authentication Flow

```
1. Login
   POST /auth/login
   ├─ Username + Password
   └─ Response: access_token + refresh_token

2. Request с access_token
   GET /guests
   ├─ Header: Authorization: Bearer <access_token>
   └─ Backend проверяет JWT

3. Refresh token
   POST /auth/refresh
   ├─ Header: X-Refresh-Token: <refresh_token>
   └─ Response: new access_token

4. Logout
   POST /auth/logout
   ├─ Инвалидирует refresh_token
   └─ На frontend удаляет tokens
```

---

# SECURITY ARCHITECTURE

## Authentication
- JWT tokens (HS256)
- HttpOnly cookies for refresh tokens
- Session management
- Password hashing (bcrypt)

## Authorization
- Role-Based Access Control (RBAC)
- Dynamic permissions
- Resource-level authorization
- Attribute-Based Access Control (ABAC) future

## Data Protection
- HTTPS/TLS for all communication
- Encryption at rest (AWS KMS)
- Row-level security (PostgreSQL RLS)
- Data masking for sensitive fields

## API Security
- Rate limiting (100 req/min per user)
- CSRF protection
- Input validation (class-validator)
- SQL injection prevention (Prisma ORM)
- XSS protection

## Audit
- All actions logged (ActivityLog table)
- Who, what, when, why
- 90 days retention
- Export capability

---

# SCALABILITY ARCHITECTURE

## Horizontal Scaling

```
Kubernetes Cluster:
├─ Multiple API pods (auto-scale 2-10)
├─ Multiple Worker pods (для jobs)
└─ Multiple Ingress controllers

Load Balancing:
├─ AWS Load Balancer
├─ Health checks
└─ Session persistence (via Redis)
```

## Caching Strategy

```
Redis layers:
├─ Session cache (15 min)
├─ Guest data cache (1 hour)
├─ Analytics cache (1 day)
├─ Loyalty levels cache (permanent, invalidate on change)
└─ Invalidation on update
```

## Database Scaling

```
Read replicas:
├─ Primary (write)
├─ Read replica 1 (analytics)
├─ Read replica 2 (reporting)
└─ Automatic failover

Sharding (при 1M+ guests):
├─ Shard by tenant_id
├─ 4 primary shards
├─ Replicas каждого шарда
└─ Cross-shard queries через aggregator
```

---

# INTEGRATION ARCHITECTURE

## POS Integration

```
Webhook (PUSH):
┌─ POS отправляет transaction
├─ Мы проверяем signature (HMAC)
├─ Обработали ← OK 200
└─ В background обновляем баллы

Polling (PULL):
┌─ Каждый час запрашиваем новые transactions
├─ Sync таблица отслеживает статус
├─ Обновляем рассинхронизированные
└─ Логируем ошибки
```

## Payment Integration

```
Stripe:
├─ Создание customer
├─ Сохранение платежных методов
├─ Создание subscription
├─ Webhooks для events (payment.success, subscription.updated)
└─ Refunds

YooKassa:
├─ Прямая интеграция API
├─ Создание платежей
├─ Webhooks
└─ Поддержка разных методов
```

## Telegram Integration

```
Bot API:
├─ Long polling или webhooks
├─ Сохранение chat_id
├─ Отправка сообщений
└─ Inline buttons + Deep links

Mini App SDK:
├─ Web version для in-app browser
├─ Получение initData от Telegram
├─ Верификация signature
└─ Safe API для mini app
```

---

# DEPLOYMENT ARCHITECTURE

## Development
```
Local environment:
├─ Docker Compose
│  ├─ API service
│  ├─ PostgreSQL
│  ├─ Redis
│  └─ Minio (S3-compatible)
└─ npm scripts для dev
```

## Production
```
AWS Infrastructure:
├─ VPC
│  ├─ Public subnets (ALB)
│  ├─ Private subnets (API pods)
│  └─ Database subnet group
│
├─ ECS (Elastic Container Service)
│  ├─ API tasks
│  ├─ Worker tasks
│  └─ Auto-scaling policies
│
├─ RDS (PostgreSQL)
│  ├─ Multi-AZ (high availability)
│  ├─ Read replicas
│  └─ Automated backups
│
├─ ElastiCache (Redis)
│  ├─ Cluster mode
│  └─ Multi-AZ
│
├─ ALB (Application Load Balancer)
│  ├─ Health checks
│  ├─ SSL termination
│  └─ Path-based routing
│
├─ CloudFront (CDN)
│  ├─ Static assets
│  ├─ API caching
│  └─ Edge locations
│
├─ S3
│  ├─ Static files
│  ├─ User uploads
│  └─ Backups
│
└─ Route 53 (DNS)
   ├─ Domain management
   └─ Health checks
```

## CI/CD Pipeline
```
Github Actions:
┌─ On push to main:
├─ Run tests (Jest)
├─ Build Docker image
├─ Push to ECR
├─ Deploy to ECS
└─ Run smoke tests

On push to develop:
└─ Build and push to staging ECR
```

---

**Документ завершен.**

**Последнее обновление:** 3 Февраля 2026
