# 🔌 MAX-LOYALTY: API ENDPOINTS SPECIFICATION

**Все 80+ endpoints с полным описанием.**

**Главное:** Все endpoints нредунтвованы JWT token (доступ только для авторизованных пользователей).

---

## AUTH ENDPOINTS

### POST /api/v1/auth/register
**Регистрация нового пользователя (открытые)**

**Request:**
```json
{
  "email": "owner@restaurant.com",
  "phone": "+79991234567",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "organization_name": "My Restaurant LLC"
}
```

**Response (201):**
```json
{
  "id": "user_123",
  "email": "owner@restaurant.com",
  "phone": "+79991234567",
  "role": "OWNER",
  "tenant_id": "tenant_456",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /api/v1/auth/login
**Выход особых личных или телефонных**

**Request:**
```json
{
  "email_or_phone": "+79991234567",
  "password": "SecurePassword123!",
  "remember_me": true
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "owner@restaurant.com",
    "phone": "+79991234567",
    "role": "OWNER"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /api/v1/auth/refresh
**Обновление JWT token**

**Headers:**
```
X-Refresh-Token: eyJhbGciOiJIUzI1NiIs...
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /api/v1/auth/logout
**Отключение**

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## GUEST ENDPOINTS

### GET /api/v1/guests
**Получить список гостей**

**Query Parameters:**
```
page=1&per_page=20&search=john&sort_by=created_at&order=DESC
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "guest_123",
      "name": "John Doe",
      "phone": "+79991234567",
      "email": "john@example.com",
      "status": "ACTIVE",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1234,
    "page": 1,
    "per_page": 20,
    "total_pages": 62
  }
}
```

---

### POST /api/v1/guests
**Создать нового гостя**

**Request:**
```json
{
  "phone": "+79991234567",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "gender": "MALE",
  "birth_date": "1990-01-15",
  "city": "Moscow",
  "registration_source": "POS"
}
```

**Response (201):**
```json
{
  "id": "guest_123",
  "phone": "+79991234567",
  "card": {
    "qr_code": "data:image/png;base64,...",
    "code_6_digit": "123456",
    "balance": 0
  },
  "message": "Guest created successfully"
}
```

---

### GET /api/v1/guests/:id
**Получить детали гостя**

**Response (200):**
```json
{
  "id": "guest_123",
  "phone": "+79991234567",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "gender": "MALE",
  "birth_date": "1990-01-15",
  "city": "Moscow",
  "avatar_url": "https://...",
  "card": {
    "qr_code": "data:image/png;base64,...",
    "code_6_digit": "123456",
    "balance": 500,
    "level": "SILVER",
    "lifetime_spent": 25000,
    "total_visits": 15
  },
  "marketing_accepted": true,
  "last_visit_at": "2024-01-20T10:00:00Z",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

## BALL ENDPOINTS

### GET /api/v1/guests/:id/balls
**Получить историю баллов**

**Query Parameters:**
```
page=1&per_page=50&type=ACCRUAL&from=2024-01-01&to=2024-01-31
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "txn_123",
      "type": "ACCRUAL",
      "amount": 500,
      "reason": "Purchase at restaurant",
      "balance_after": 500,
      "expires_at": "2024-07-31T23:59:59Z",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "txn_124",
      "type": "REDEMPTION",
      "amount": -50,
      "reason": "Free drink",
      "balance_after": 450,
      "created_at": "2024-01-20T15:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 50
  }
}
```

---

### POST /api/v1/guests/:id/balls/accrual
**Начислить баллы вручную**

**Request:**
```json
{
  "amount": 500,
  "reason": "Bonus for birthday",
  "source": "MANUAL"
}
```

**Response (201):**
```json
{
  "transaction_id": "txn_999",
  "previous_balance": 100,
  "new_balance": 600,
  "message": "Balls accrued successfully"
}
```

---

## LOYALTY ENDPOINTS

### GET /api/v1/loyalty-systems
**Получить настройки лояльности**

**Response (200):**
```json
{
  "id": "loyalty_123",
  "type": "POINTS",
  "mode": "UNIFIED",
  "levels": [
    {
      "id": "level_bronze",
      "name": "BRONZE",
      "min_spent": 0,
      "percentage": 5,
      "icon_url": "https://..."
    },
    {
      "id": "level_silver",
      "name": "SILVER",
      "min_spent": 10000,
      "percentage": 10
    },
    {
      "id": "level_gold",
      "name": "GOLD",
      "min_spent": 50000,
      "percentage": 15
    }
  ]
}
```

---

## POS INTEGRATION ENDPOINTS

### POST /api/v1/pos/webhook
**Вымот webhook от ПОС**

**Headers:**
```
X-Signature: sha256=...
X-Idempotency-Key: unique-id
```

**Request (from POS):**
```json
{
  "event_type": "check_completed",
  "data": {
    "check_number": "12345",
    "guest_phone": "+79991234567",
    "check_amount": 2500,
    "items": [
      {
        "name": "Burger",
        "price": 500,
        "quantity": 2
      }
    ],
    "timestamp": "2024-01-20T15:00:00Z"
  }
}
```

**Response (200):**
```json
{
  "status": "ok",
  "balls_accrued": 250,
  "guest_id": "guest_123"
}
```

---

## TELEGRAM ENDPOINTS

### GET /api/v1/telegram/card
**Получить карту для Telegram mini app**

**Headers:**
```
Authorization: Bearer <tg_init_data>
```

**Response (200):**
```json
{
  "card": {
    "qr_code": "data:image/png;base64,...",
    "code_6_digit": "123456",
    "balance": 500,
    "level": "SILVER",
    "next_level_at": 50000,
    "progress": 45,
    "expires_soon": false
  },
  "restaurants": [
    {
      "id": "rest_123",
      "name": "My Restaurant",
      "address": "Moscow, Street 1"
    }
  ]
}
```

---

## ANALYTICS ENDPOINTS

### GET /api/v1/analytics/dashboard
**Аналитика для ресторана**

**Query Parameters:**
```
period=month&from=2024-01-01&to=2024-01-31
```

**Response (200):**
```json
{
  "summary": {
    "total_guests": 150,
    "new_guests": 25,
    "total_visits": 450,
    "total_revenue": 150000,
    "avg_check": 333.33
  },
  "levels": {
    "BRONZE": 100,
    "SILVER": 40,
    "GOLD": 10
  },
  "daily_data": [
    {
      "date": "2024-01-01",
      "visits": 12,
      "revenue": 5000
    }
  ],
  "trends": {
    "revenue_trend": "+15%",
    "guest_trend": "+8%"
  }
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "phone": "Invalid phone format"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid token"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "required_role": "RESTAURANT_ADMIN"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Guest not found"
  }
}
```

### 409 Conflict
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Guest with this phone already exists"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after_seconds": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "request_id": "req_123abc"
  }
}
```

---

## STATUS CODES

```
200 OK              - Успешный респонс
201 Created         - Есрсоурс создан
204 No Content      - Успешно, но нет данных
400 Bad Request     - Неверные данные
401 Unauthorized    - Нет token
403 Forbidden       - Нет прав
404 Not Found       - Нет ресурса
409 Conflict        - Конфликт данных
429 Too Many Req    - Превышен лимит
500 Server Error    - Ошибка сервера
503 Service Unavail - Сервис недоступен
```

---

## RATE LIMITING

```
Limits per user:
- 100 requests / minute
- 1000 requests / hour
- 10000 requests / day

Headers:
- X-RateLimit-Limit: 100
- X-RateLimit-Remaining: 95
- X-RateLimit-Reset: 1705755600
```

---

## PAGINATION

```
Default:
- page: 1
- per_page: 20
- max per_page: 100

Response format:
{
  "data": [...],
  "pagination": {
    "total": 1234,
    "page": 1,
    "per_page": 20,
    "total_pages": 62
  }
}
```

---

**Документ описывает основные endpoints (всего 80+).**

**Полная Орангва swagger спецификация доступна по GET /api/docs**

**Последнее обновление:** 3 Февраля 2026
