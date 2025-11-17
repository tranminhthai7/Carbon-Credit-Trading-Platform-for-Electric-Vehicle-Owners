# 🏗️ Kiến trúc Microservices - Carbon Credit Trading Platform

## 📊 Tổng quan Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Web App     │  │  Mobile App  │  │  Admin Panel │          │
│  │  (React/Vue) │  │  (Optional)  │  │  (React)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Nginx/Kong)                    │
│  - Routing                                                       │
│  - Load Balancing                                                │
│  - Authentication (JWT verification)                             │
│  - Rate Limiting                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ User Service │    │ EV Data      │    │ Carbon Credit│
│              │    │ Service      │    │ Service      │
│ Port: 3001   │    │ Port: 3002   │    │ Port: 3003   │
│              │    │              │    │              │
│ - Auth       │    │ - Vehicle    │    │ - Wallet     │
│ - Users      │    │ - Trips      │    │ - Credits    │
│ - Roles      │    │ - CO2 calc   │    │ - Requests   │
│              │    │              │    │              │
│ PostgreSQL   │    │ PostgreSQL   │    │ PostgreSQL   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Message Queue   │
                    │  (RabbitMQ)      │
                    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Marketplace  │    │ Payment      │    │ Verification │
│ Service      │    │ Service      │    │ Service      │
│ Port: 3004   │    │ Port: 3005   │    │ Port: 3006   │
│              │    │              │    │              │
│ - Listings   │    │ - Payments   │    │ - CVA Review │
│ - Auctions   │    │ - Withdrawals│    │ - Approve    │
│ - Orders     │    │ - Wallet     │    │ - Reports    │
│              │    │              │    │              │
│ PostgreSQL   │    │ PostgreSQL   │    │ PostgreSQL   │
└──────────────┘    └──────────────┘    └──────────────┘

        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Notification │    │ Reporting    │    │ AI Service   │
│ Service      │    │ Service      │    │ (Optional)   │
│ Port: 3007   │    │ Port: 3008   │    │ Port: 3009   │
│              │    │              │    │              │
│ - Email      │    │ - Analytics  │    │ - Price      │
│ - In-app     │    │ - Dashboard  │    │   Suggest    │
│ - WebSocket  │    │ - Export     │    │              │
│              │    │              │    │              │
│ MongoDB      │    │ PostgreSQL   │    │ Redis Cache  │
└──────────────┘    └──────────────┘    └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Redis    │  │ RabbitMQ │  │PostgreSQL│  │ MongoDB  │       │
│  │ (Cache)  │  │ (Queue)  │  │ (Main DB)│  │ (Logs)   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Monitoring (Optional)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │Prometheus│  │ Grafana  │  │ ELK Stack│                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Chi tiết các Microservices

### 1️⃣ User Service (Authentication & Authorization)
**Port**: 3001  
**Database**: PostgreSQL  
**Responsibilities**:
- User registration & login
- JWT token generation & validation
- Role-based access control (EV Owner, Buyer, CVA, Admin)
- User profile management
- Password reset

**Endpoints**:
```
POST   /api/users/register
POST   /api/users/login
POST   /api/users/logout
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/refresh-token
```

**Database Schema**:
```sql
Users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  role ENUM('EV_OWNER', 'BUYER', 'CVA', 'ADMIN'),
  full_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

Sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users,
  token VARCHAR,
  expires_at TIMESTAMP
)
```

---

### 2️⃣ EV Data Service
**Port**: 3002  
**Database**: PostgreSQL  
**Responsibilities**:
- Vehicle registration & management
- Import trip data (from CSV/JSON file)
- Calculate CO2 emissions saved
- Convert CO2 to carbon credits
- Historical trip data

**Endpoints**:
```
POST   /api/vehicles
GET    /api/vehicles
GET    /api/vehicles/{id}
POST   /api/vehicles/{id}/trips
GET    /api/vehicles/{id}/trips
GET    /api/vehicles/{id}/co2-savings
POST   /api/vehicles/{id}/generate-credits
```

**Database Schema**:
```sql
Vehicles (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES Users,
  make VARCHAR,
  model VARCHAR,
  year INT,
  battery_capacity DECIMAL,
  registration_number VARCHAR,
  created_at TIMESTAMP
)

Trips (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES Vehicles,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  distance_km DECIMAL,
  energy_consumed_kwh DECIMAL,
  co2_saved_kg DECIMAL,
  created_at TIMESTAMP
)
```

**CO2 Calculation**:
```
Gasoline car: 0.12 kg CO2 / km
Electric car: 0.02 kg CO2 / km (grid electricity)
CO2 Saved = (0.12 - 0.02) × distance_km = 0.10 × distance_km

Carbon Credit = CO2_Saved_kg / 1000 (1 credit = 1 ton CO2)
```

---

### 3️⃣ Carbon Credit Service
**Port**: 3003  
**Database**: PostgreSQL  
**Responsibilities**:
- Carbon wallet management
- Credit issuance requests
- Track credit balance
- Transaction history
- Certificate generation

**Endpoints**:
```
GET    /api/wallet/{userId}
POST   /api/credits/request
GET    /api/credits/requests
PUT    /api/credits/requests/{id}
POST   /api/credits/issue
GET    /api/credits/history
GET    /api/credits/certificate/{id}
```

**Database Schema**:
```sql
CarbonWallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users,
  balance DECIMAL DEFAULT 0,
  total_earned DECIMAL DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  updated_at TIMESTAMP
)

CreditRequests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users,
  vehicle_id UUID REFERENCES Vehicles,
  co2_saved_kg DECIMAL,
  credits_requested DECIMAL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED'),
  verification_data JSON,
  created_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES Users
)

CreditTransactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES CarbonWallets,
  type ENUM('EARN', 'SPEND', 'TRANSFER'),
  amount DECIMAL,
  description VARCHAR,
  created_at TIMESTAMP
)
```

---

### 4️⃣ Marketplace Service
**Port**: 3004  
**Database**: PostgreSQL  
**Responsibilities**:
- List credits for sale (fixed price or auction)
- Search & filter listings
- Create orders
- Manage listings (cancel/update)
- Auction bidding

**Endpoints**:
```
POST   /api/marketplace/listings
GET    /api/marketplace/listings
GET    /api/marketplace/listings/{id}
PUT    /api/marketplace/listings/{id}
DELETE /api/marketplace/listings/{id}
POST   /api/marketplace/buy/{listingId}

POST   /api/marketplace/auctions
GET    /api/marketplace/auctions
POST   /api/marketplace/auctions/{id}/bid
```

**Database Schema**:
```sql
Listings (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES Users,
  credit_amount DECIMAL,
  price_per_credit DECIMAL,
  total_price DECIMAL,
  listing_type ENUM('FIXED', 'AUCTION'),
  status ENUM('ACTIVE', 'SOLD', 'CANCELLED'),
  location VARCHAR,
  description TEXT,
  created_at TIMESTAMP,
  expires_at TIMESTAMP
)

Auctions (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES Listings,
  starting_price DECIMAL,
  current_bid DECIMAL,
  highest_bidder_id UUID REFERENCES Users,
  end_time TIMESTAMP
)

Bids (
  id UUID PRIMARY KEY,
  auction_id UUID REFERENCES Auctions,
  bidder_id UUID REFERENCES Users,
  amount DECIMAL,
  created_at TIMESTAMP
)

Orders (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES Listings,
  buyer_id UUID REFERENCES Users,
  seller_id UUID REFERENCES Users,
  credit_amount DECIMAL,
  total_price DECIMAL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
)
```

---

### 5️⃣ Payment Service
**Port**: 3005  
**Database**: PostgreSQL  
**Responsibilities**:
- Process payments (mock payment gateway)
- Wallet balance management
- Withdrawal requests
- Payment history
- Transaction reconciliation

**Endpoints**:
```
POST   /api/payments/process
POST   /api/payments/withdraw
GET    /api/payments/history
GET    /api/payments/balance
```

**Database Schema**:
```sql
PaymentWallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users,
  balance DECIMAL DEFAULT 0,
  currency VARCHAR DEFAULT 'VND',
  updated_at TIMESTAMP
)

Payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES Orders,
  payer_id UUID REFERENCES Users,
  payee_id UUID REFERENCES Users,
  amount DECIMAL,
  payment_method ENUM('WALLET', 'BANK', 'CARD'),
  status ENUM('PENDING', 'COMPLETED', 'FAILED'),
  transaction_id VARCHAR,
  created_at TIMESTAMP
)

Withdrawals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users,
  amount DECIMAL,
  bank_account VARCHAR,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'),
  created_at TIMESTAMP,
  processed_at TIMESTAMP
)
```

---

### 6️⃣ Verification Service (CVA)
**Port**: 3006  
**Database**: PostgreSQL  
**Responsibilities**:
- Review credit requests
- Approve/reject requests
- Issue credits to wallets
- Generate verification reports
- Audit trail

**Endpoints**:
```
GET    /api/verification/requests
GET    /api/verification/requests/{id}
POST   /api/verification/approve/{id}
POST   /api/verification/reject/{id}
GET    /api/verification/reports
```

**Database Schema**:
```sql
VerificationRecords (
  id UUID PRIMARY KEY,
  credit_request_id UUID REFERENCES CreditRequests,
  verifier_id UUID REFERENCES Users,
  status ENUM('APPROVED', 'REJECTED'),
  notes TEXT,
  verification_data JSON,
  created_at TIMESTAMP
)
```

---

### 7️⃣ Notification Service
**Port**: 3007  
**Database**: MongoDB  
**Responsibilities**:
- Send email notifications
- In-app notifications
- Real-time updates (WebSocket - optional)
- Notification preferences

**Endpoints**:
```
GET    /api/notifications
POST   /api/notifications/mark-read/{id}
PUT    /api/notifications/preferences
```

**Events to notify**:
- Credit request approved/rejected
- Sale completed
- Payment received
- New bid on auction
- Listing expiring soon

---

### 8️⃣ Reporting Service
**Port**: 3008  
**Database**: PostgreSQL (read replicas)  
**Responsibilities**:
- Personal dashboards
- Admin analytics
- Transaction reports
- Export to CSV/PDF
- Data aggregation

**Endpoints**:
```
GET    /api/reports/personal
GET    /api/reports/admin
GET    /api/reports/transactions
GET    /api/reports/export/{type}
```

---

### 9️⃣ AI Service (Optional)
**Port**: 3009  
**Database**: Redis (cache)  
**Responsibilities**:
- Price prediction/suggestion
- Market analysis
- Historical data trends
- Simple ML model (or rule-based for MVP)

**Endpoints**:
```
GET    /api/ai/suggest-price
GET    /api/ai/market-trends
```

---

## 🔄 Service Communication

### Synchronous (REST/HTTP):
- Client → API Gateway → Services
- Service-to-Service (when needed)

### Asynchronous (Message Queue - RabbitMQ):
**Events**:
```
CreditApproved       → Notification Service, Carbon Credit Service
PaymentCompleted     → Marketplace Service, Notification Service
OrderCreated         → Payment Service, Notification Service
ListingCreated       → Notification Service
AuctionEnded         → Marketplace Service, Payment Service
```

---

## 🗄️ Database Strategy

### Per-Service Databases (Microservice pattern):
- **User Service**: PostgreSQL
- **EV Data Service**: PostgreSQL
- **Carbon Credit Service**: PostgreSQL
- **Marketplace Service**: PostgreSQL
- **Payment Service**: PostgreSQL
- **Verification Service**: PostgreSQL
- **Reporting Service**: PostgreSQL (read replicas)
- **Notification Service**: MongoDB (flexible schema)

### Shared Services:
- **Redis**: Caching, session store
- **RabbitMQ**: Message broker

---

## 🐳 Docker Setup

### docker-compose.yml structure:
```yaml
services:
  # Infrastructure
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: carbon_platform
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "80:80"
    depends_on:
      - user-service
      - ev-data-service

  # Microservices
  user-service:
    build: ./services/user-service
    ports:
      - "3001:3001"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

  ev-data-service:
    build: ./services/ev-data-service
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - rabbitmq

  # ... other services ...
```

---

## 🚀 Deployment Strategy

### Local Development:
```bash
docker-compose up -d
```

### Production (Optional):
- Kubernetes
- AWS ECS
- Docker Swarm

---

## 📊 Monitoring & Logging (Optional)

### Metrics:
- Prometheus + Grafana
- Service health checks
- Request/response times
- Error rates

### Logging:
- Centralized logging (ELK Stack)
- Structured logs (JSON)
- Correlation IDs

---

## 🔒 Security

### Authentication:
- JWT tokens
- Refresh tokens
- Token expiration

### Authorization:
- Role-based access control
- Service-to-service authentication (API keys)

### Data Security:
- Password hashing (bcrypt)
- HTTPS/TLS
- Input validation
- SQL injection prevention

---

## ✅ Best Practices

1. **Each service is independent** - Can be deployed separately
2. **Database per service** - No shared database
3. **API versioning** - /api/v1/...
4. **Health check endpoints** - GET /health
5. **Graceful shutdown** - Handle SIGTERM
6. **Circuit breakers** - Prevent cascade failures
7. **Retry logic** - For transient errors
8. **Timeouts** - All external calls
9. **Logging** - Structured, with correlation IDs
10. **Documentation** - OpenAPI/Swagger

---

**Tài liệu này sẽ được publish lên Confluence (BẮT BUỘC)** 📚

Deadline: 18/11/2025 ⏰
