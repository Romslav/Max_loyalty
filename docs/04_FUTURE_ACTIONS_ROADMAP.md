# 🚀 MAX-LOYALTY: 40-НЕДЕЛЬНЫЙ ROADMAP

**Документ создан:** 3 Февраля 2026
**Версия:** 1.0
**Статус:** Подробный план разработки
**Объём:** 120+ KB

---

## 📑 СОДЕРЖАНИЕ

- [Фазы разработки](#фазы-разработки)
- [ФАЗА 1: Foundation](#фаза-1-foundation-недели-1-8)
- [ФАЗА 2: Core Features](#фаза-2-core-features-недели-9-20)
- [ФАЗА 3: Advanced Features](#фаза-3-advanced-features-недели-21-32)
- [ФАЗА 4: Polish & Testing](#фаза-4-polish--testing-недели-33-40)
- [Что еще нужно уточнить](#что-еще-нужно-уточнить)
- [Risk Management](#risk-management)
- [Критические пути](#критические-пути)

---

# ФАЗЫ РАЗРАБОТКИ

```
Фаза 1: FOUNDATION (8 недель)
├─ Project Setup
├─ Infrastructure
├─ Database
├─ Authentication
└─ Frontend Auth UI

Фаза 2: CORE FEATURES (12 недель)
├─ Guests & Loyalty Cards
├─ Balls & Transactions
├─ Loyalty System
└─ Frontend UI

Фаза 3: ADVANCED FEATURES (12 недель)
├─ POS Integration
├─ Telegram Bot
├─ Analytics
└─ Reporting

Фаза 4: POLISH & TESTING (8 недель)
├─ Testing & QA
├─ Documentation
├─ Optimization
└─ Deployment
```

---

# ФАЗА 1: FOUNDATION (НЕДЕЛИ 1-8)

## Неделя 1: Project Setup

### Backend
- [ ] Создать NestJS проект
- [ ] Установить зависимости
- [ ] Настроить ESLint & Prettier
- [ ] Создать структуру проекта
- [ ] Первая commit на GitHub

### Frontend
- [ ] Создать React + Vite проект
- [ ] Установить TailwindCSS
- [ ] Установить Zustand
- [ ] Структура проекта
- [ ] GitHub workflow

### DevOps
- [ ] GitHub Actions setup
- [ ] Docker setup (backend, frontend)
- [ ] Docker Compose для локальной разработки
- [ ] AWS account setup

**Deliverable:** Готовый к разработке stack

---

## Неделя 2-3: Database Setup

### PostgreSQL Schema
- [ ] Создать User таблицы
- [ ] Создать Tenant таблицы
- [ ] Создать Guest таблицы
- [ ] Создать Loyalty таблицы
- [ ] Создать POS таблицы
- [ ] Indexing
- [ ] Миграции (Prisma)

### Redis Setup
- [ ] Redis configuration
- [ ] Cache strategy
- [ ] Session storage

**Deliverable:** Full DB schema in Prisma

---

## Неделя 4-5: Authentication

### JWT Implementation
- [ ] JWT strategy (NestJS)
- [ ] Login endpoint
- [ ] Register endpoint
- [ ] Refresh token logic
- [ ] Password hashing (bcrypt)
- [ ] Email verification

### Frontend Auth
- [ ] Login page
- [ ] Register page
- [ ] Token management
- [ ] Protected routes

**Deliverable:** Complete auth flow

---

## Неделя 6-8: Authorization & Core

### Authorization System
- [ ] Role-Based Access Control (RBAC)
- [ ] Dynamic permissions
- [ ] Guard implementation
- [ ] Decorator creation

### API Foundation
- [ ] Base controller structure
- [ ] Error handling
- [ ] Logging
- [ ] Validation pipes

### Frontend Foundation
- [ ] Layout (Header, Sidebar)
- [ ] Navigation
- [ ] Basic components (Button, Modal, Form)

**Deliverable:** Auth system ready, basic UI

**PHASE 1 COMPLETE: Week 8**

---

# ФАЗА 2: CORE FEATURES (НЕДЕЛИ 9-20)

## Неделя 9-10: User Management

### Backend
- [ ] GET /users
- [ ] GET /users/:id
- [ ] POST /users (admin create)
- [ ] PUT /users/:id
- [ ] DELETE /users (soft delete)
- [ ] Permission endpoints

### Frontend
- [ ] Users list page
- [ ] User detail page
- [ ] User create modal
- [ ] Permission management

**Deliverable:** Full user management

---

## Неделя 11-13: Guest Management

### Backend
- [ ] GET /guests
- [ ] GET /guests/:id
- [ ] POST /guests
- [ ] PUT /guests/:id
- [ ] DELETE /guests
- [ ] Guest profile endpoints
- [ ] Children management

### Frontend
- [ ] Guests list page (with filters, sort)
- [ ] Guest detail page
- [ ] Guest form (create/edit)
- [ ] Children management UI

**Deliverable:** Complete guest management

---

## Неделя 14-15: Loyalty Cards & System

### Backend
- [ ] Create guest card
- [ ] Generate QR code
- [ ] Generate 6-digit code
- [ ] Loyalty system endpoints
- [ ] Loyalty levels CRUD
- [ ] Update guest level on purchase

### Frontend
- [ ] Guest card display
- [ ] Level progress visualization
- [ ] Loyalty settings page

**Deliverable:** Loyalty system functional

---

## Неделя 16-17: Balls Management

### Backend
- [ ] POST /balls/accrual
- [ ] POST /balls/manual
- [ ] GET /balls/history
- [ ] Expiration job (180 days)
- [ ] Ball calculation logic
- [ ] Notifications for expiration

### Frontend
- [ ] Balls history page
- [ ] Manual operation form
- [ ] Expiration warnings

**Deliverable:** Full balls system

---

## Неделя 18-20: Dashboard & Analytics

### Backend
- [ ] GET /analytics/dashboard
- [ ] GET /analytics/guests
- [ ] GET /analytics/revenue
- [ ] Aggregate data job
- [ ] Report generation

### Frontend
- [ ] Owner dashboard
- [ ] Restaurant admin dashboard
- [ ] Analytics page
- [ ] Charts & visualizations

**Deliverable:** Full dashboard & analytics

**PHASE 2 COMPLETE: Week 20**

---

# ФАЗА 3: ADVANCED FEATURES (НЕДЕЛИ 21-32)

## Неделя 21-24: POS Integration

### Backend
- [ ] POSIntegration configuration
- [ ] Webhook endpoint
- [ ] Webhook signature verification (HMAC)
- [ ] Idempotency key handling
- [ ] Transaction sync logic
- [ ] Ball accrual on purchase
- [ ] Error handling & retry logic
- [ ] Polling mechanism (hourly)

### Frontend
- [ ] POS integration settings page
- [ ] Configuration wizard
- [ ] Sync status monitoring

**Deliverable:** Full POS integration (Webhook + Polling)

---

## Неделя 25-27: Telegram Bot & Mini App

### Telegram Bot
- [ ] Bot setup (token, webhook)
- [ ] Command handlers
- [ ] Message handlers
- [ ] Inline buttons
- [ ] Deep links
- [ ] Notifications

### Telegram Mini App
- [ ] Auth via initData
- [ ] Card display (QR + 6-digit)
- [ ] Balance display
- [ ] History page
- [ ] Profile edit
- [ ] Responsive design

### Backend
- [ ] Telegram API endpoints
- [ ] Mini app auth
- [ ] initData verification

**Deliverable:** Full Telegram integration

---

## Неделя 28-32: Subscriptions & Billing

### Backend
- [ ] Subscription management
- [ ] Pricing plans
- [ ] Payment processing (Stripe/YooKassa)
- [ ] Webhook handling (payment.success)
- [ ] Billing system
- [ ] Invoice generation
- [ ] Upgrade/Downgrade logic
- [ ] Limits enforcement

### Frontend
- [ ] Pricing page
- [ ] Subscription page
- [ ] Upgrade modal
- [ ] Payment form
- [ ] Invoice history

**Deliverable:** Full billing system

**PHASE 3 COMPLETE: Week 32**

---

# ФАЗА 4: POLISH & TESTING (НЕДЕЛИ 33-40)

## Неделя 33-35: Testing & QA

### Unit Tests
- [ ] Services tests (80%+ coverage)
- [ ] Controllers tests
- [ ] Repository tests
- [ ] Frontend component tests

### Integration Tests
- [ ] API endpoint tests
- [ ] Database tests
- [ ] Auth flow tests
- [ ] POS webhook tests

### E2E Tests
- [ ] Complete user flows
- [ ] Guest creation to payment
- [ ] Ball accrual flow

### QA
- [ ] Manual testing
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] Security testing

**Deliverable:** 80%+ test coverage

---

## Неделя 36-37: Documentation

### Code Documentation
- [ ] API documentation (Swagger)
- [ ] Backend code comments
- [ ] Frontend component docs

### User Documentation
- [ ] Admin manual
- [ ] User guides
- [ ] FAQ
- [ ] Video tutorials

### Developer Documentation
- [ ] Setup guide
- [ ] Contributing guide
- [ ] Architecture docs
- [ ] Deployment guide

**Deliverable:** Complete documentation

---

## Неделя 38-39: Optimization & Deployment

### Performance Optimization
- [ ] Frontend bundle optimization
- [ ] API query optimization
- [ ] Database query optimization
- [ ] Caching improvements

### DevOps
- [ ] AWS infrastructure setup
- [ ] CI/CD pipeline
- [ ] Monitoring & Logging (Prometheus, Grafana)
- [ ] Backup strategy
- [ ] Disaster recovery

### Security Audit
- [ ] Penetration testing
- [ ] Code review
- [ ] Dependencies audit (snyk)
- [ ] Compliance check

**Deliverable:** Production-ready infrastructure

---

## Неделя 40: Launch Preparation & Final Polish

### Pre-Launch Checklist
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Infrastructure monitored
- [ ] Backup tested
- [ ] Performance benchmarks met
- [ ] Security audit complete

### Launch
- [ ] Deploy to production
- [ ] Monitor closely
- [ ] Customer support ready
- [ ] Metrics tracking

**Deliverable:** PRODUCT LAUNCH! 🎉

---

# ЧТО ЕЩЕ НУЖНО УТОЧНИТЬ

## С ПОС системами
- [ ] Точная версия iiko API
- [ ] R-Keeper интеграция документация
- [ ] Тестовые account у провайдеров
- [ ] Webhook URL и сертификаты
- [ ] Обработка ошибок и timeout

## С платежными системами
- [ ] Выбор между Stripe vs YooKassa
- [ ] Нужна ли поддержка обеих?
- [ ] Webhook signatures
- [ ] Dispute handling
- [ ] Refund policy

## Внешние сервисы
- [ ] Email провайдер (SendGrid/Mailgun)
- [ ] SMS провайдер (Twilio/Vonage)
- [ ] Телефонный номер для поддержки
- [ ] Лицензии на ПО

## Специфика рынка
- [ ] Регуляторные требования РФ
- [ ] Налоговые требования
- [ ] GDPR compliance (если есть EU гости)
- [ ] Данные по процентам комиссии

---

# RISK MANAGEMENT

## Риск 1: Задержка POS интеграции
**Вероятность:** Высокая  
**Влияние:** Высокое  
**План:** Параллельная разработка mock POS для тестирования

## Риск 2: Производительность при масштабировании
**Вероятность:** Средняя  
**Влияние:** Высокое  
**План:** Performance testing с 10K+ гостей, Kubernetes ready

## Риск 3: Безопасность данных
**Вероятность:** Низкая  
**Влияние:** Критическое  
**План:** Security audit на неделе 35, penetration testing

## Риск 4: Telegram API changes
**Вероятность:** Низкая  
**Влияние:** Среднее  
**План:** Следить за обновлениями, versioning API

---

# КРИТИЧЕСКИЕ ПУТИ

```
Датайный путь:
└─ Database schema (неделя 2-3) ← обязательно
   ├─ User management (неделя 9-10)
   ├─ Guest management (неделя 11-13)
   └─ Loyalty system (неделя 14-15)
      └─ Balls system (неделя 16-17)
         └─ Analytics (неделя 18-20)
            └─ POS integration (неделя 21-24)
               └─ Testing & Deploy (неделя 33-40)

Критические задачи:
1. Database schema (если задержка → все задерживается)
2. Authentication (если неправильно → вся система уязвима)
3. POS integration (если не работает → бизнес не может работать)
4. Testing (если пропустить → production issues)
```

---

**Документ завершен.**

**Последнее обновление:** 3 Февраля 2026
