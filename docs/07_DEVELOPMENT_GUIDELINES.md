# 📚 MAX-LOYALTY: DEVELOPMENT GUIDELINES

**Все стандарты и Best Practices** для разработки MAX-LOYALTY.

## CODE STANDARDS

### TypeScript Configuration

**tsconfig.json - Strict Mode**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint Rules (CORE)
```js
- no-console: warn (allow warn, error)
- no-debugger: error
- no-implicit-any: error
- no-explicit-any: error
- max-len: error (100 chars)
- semi: error
- quotes: [error, 'single']
```

---

## PROJECT STRUCTURE

### Backend (src/ directory)

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── interfaces/
│   │   │   └── jwt-payload.interface.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   └── auth.module.ts
│   │
│   ├── guests/
│   │   ├── guests.controller.ts
│   │   ├── guests.service.ts
│   │   ├── guests.repository.ts
│   │   ├── dto/
│   │   │   ├── create-guest.dto.ts
│   │   │   └── update-guest.dto.ts
│   │   ├── entities/
│   │   │   └── guest.entity.ts
│   │   └── guests.module.ts
│   │
│   ├── balls/
│   ├── loyalty/
│   ├── subscriptions/
│   ├── analytics/
│   ├── pos-integration/
│   └── telegram/
│
├── common/
│   ├── guards/
│   │   ├── role.guard.ts
│   │   ├── permission.guard.ts
│   │   └── tenant.guard.ts
│   │
│   ├── decorators/
│   │   ├── @RequireRole()
│   │   └── @RequirePermission()
│   │
│   ├── filters/
│   │   └── exception.filter.ts
│   │
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   │
│   ├── pipes/
│   │   └── validation.pipe.ts
│   │
│   └── interfaces/
│       ├── paginated-response.interface.ts
│       └── jwt-user.interface.ts
│
├── database/
│   ├── entities/
│   ├── repositories/
│   ├── migrations/
│   └── seeds/
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   └── external-services.config.ts
│
├── utils/
│   ├── validators/
│   ├── formatters/
│   ├── helpers/
│   └── constants/
│
├── app.module.ts
└── main.ts
```

### Frontend (src/ directory)

```
src/
├── pages/
│   ├── Owner/
│   │   ├── Dashboard.tsx
│   │   ├── Restaurants.tsx
│   │   ├── Analytics.tsx
│   │   └── Billing.tsx
│   │
│   ├── RestaurantAdmin/
│   │   ├── Dashboard.tsx
│   │   ├── Guests.tsx
│   │   ├── Loyalty.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   │
│   ├── Manager/
│   ├── Cashier/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   │
│   └── NotFound.tsx
│
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Form.tsx
│   │   └── Toast.tsx
│   │
│   ├── guests/
│   │   ├── GuestCard.tsx
│   │   ├── GuestForm.tsx
│   │   ├── GuestList.tsx
│   │   └── GuestDetail.tsx
│   │
│   ├── loyalty/
│   ├── analytics/
│   └── forms/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useGuests.ts
│   ├── useFetch.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── guests.service.ts
│   ├── loyalty.service.ts
│   └── analytics.service.ts
│
├── store/
│   ├── authStore.ts
│   ├── guestStore.ts
│   ├── uiStore.ts
│   └── index.ts
│
├── types/
│   ├── auth.ts
│   ├── guest.ts
│   ├── loyalty.ts
│   ├── api.ts
│   └── index.ts
│
├── utils/
│   ├── format.ts
│   ├── validate.ts
│   ├── storage.ts
│   └── constants.ts
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── tailwind.config.js
│
├── App.tsx
└── main.tsx
```

---

## NAMING CONVENTIONS

### Files & Folders

```
Compartments:     PascalCase (.tsx)
  components/GuestCard.tsx

Hooks:            camelCase (useXxx, .ts)
  hooks/useAuth.ts
  hooks/useGuests.ts

Services:         camelCase (.service.ts)
  services/auth.service.ts
  services/guests.service.ts

Types:            PascalCase (.ts)
  types/User.ts
  types/Guest.ts

Controllers:      camelCase (.controller.ts)
  auth.controller.ts

DTOs:             PascalCase (.dto.ts)
  CreateUserDto.ts
  UpdateGuestDto.ts

Repositories:     PascalCase (.repository.ts)
  GuestRepository.ts
```

### Variables & Functions

```typescript
// Variables (camelCase)
const userName = 'John';
const totalVisits = 10;
const isActive = true;

// Functions (camelCase)
function calculateBalance(): number {}
function getUserById(id: string): Promise<User> {}

// Classes (PascalCase)
class AuthService {}
class GuestRepository {}

// Enums (PascalCase)
enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'RESTAURANT_ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  GUEST = 'GUEST'
}

// Interfaces (PascalCase)
interface User {}
interface IGuestCard {}

// Constants (UPPER_SNAKE_CASE)
const MAX_GUESTS_PER_PLAN = 5000;
const BALL_EXPIRATION_DAYS = 180;
const JWT_EXPIRATION_TIME = 900000;
```

---

## DESIGN PATTERNS

### Backend: Service Pattern

```typescript
@Injectable()
export class GuestService {
  constructor(
    private readonly guestRepository: GuestRepository,
    private readonly ballService: BallService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async createGuest(
    data: CreateGuestDto,
    tenantId: string,
    createdByUserId: string
  ): Promise<Guest> {
    // 1. Validation
    if (!this.validatePhoneNumber(data.phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    // 2. Check existing
    const existing = await this.guestRepository.findByPhone(
      data.phone,
      tenantId
    );
    if (existing) {
      throw new ConflictException('Guest already exists');
    }

    // 3. Business logic
    const guest = await this.guestRepository.create({
      ...data,
      tenant_id: tenantId,
    });

    // 4. Generate card codes
    const cardData = this.generateCardCodes();

    // 5. Create card
    const card = await this.guestRepository.createCard({
      guest_id: guest.id,
      ...cardData,
    });

    // 6. Log activity
    await this.activityLogService.log({
      user_id: createdByUserId,
      action: 'CREATE_GUEST',
      entity_type: 'GUEST',
      entity_id: guest.id,
      tenant_id: tenantId,
    });

    return guest;
  }
}
```

### Frontend: Hooks Pattern

```typescript
export function useAuth() {
  const store = useAuthStore();

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login({ email, password });
      store.setUser(response.user);
      store.setToken(response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    store.clear();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    login,
    logout,
  };
}
```

---

## TESTING STRATEGY

### Unit Tests (80%+ coverage)

```typescript
describe('GuestService', () => {
  let service: GuestService;
  let repository: GuestRepository;

  beforeEach(() => {
    const module: TestingModule = Test.createTestingModule({
      providers: [
        GuestService,
        {
          provide: GuestRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByPhone: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GuestService>(GuestService);
    repository = module.get<GuestRepository>(GuestRepository);
  });

  describe('createGuest', () => {
    it('should create guest successfully', async () => {
      const dto: CreateGuestDto = {
        name: 'John Doe',
        phone: '+79991234567',
        email: 'john@example.com',
      };

      const expected: Guest = {
        id: 'guest_123',
        ...dto,
        created_at: new Date(),
      };

      jest.spyOn(repository, 'create').mockResolvedValue(expected);

      const result = await service.createGuest(dto, 'tenant_123', 'user_123');

      expect(result).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining(dto)
      );
    });
  });
});
```

---

## GIT WORKFLOW

### Branch Naming

```
feature/add-loyalty-system
bugfix/fix-ball-expiration
hotfix/critical-payment-bug
docs/api-documentation
refactor/simplify-guest-service
```

### Commit Messages

```
feat: add guest creation endpoint
  - Implement POST /guests endpoint
  - Add validation for phone and email
  - Send welcome email

fix: correct ball expiration logic
  - Fix timezone issue
  - Update calculation
  - Add tests

Fixes #123
```

---

**Документ сн всеми guidelines и standards.**

**Последнее обновление:** 3 Февраля 2026
