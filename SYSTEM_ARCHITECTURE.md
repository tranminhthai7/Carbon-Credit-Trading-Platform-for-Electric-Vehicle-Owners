# 📚 System Architecture Document - Carbon Credit Trading Platform

**Project**: Carbon Credit Trading Platform for Electric Vehicle Owners  
**Team**: 5 members  
**Timeline**: 31/10/2025 - 18/11/2025  
**Version**: 1.0  
**Last Updated**: 31/10/2025

---

## 📖 1. PROJECT OVERVIEW

### 1.1 Introduction
**Carbon Credit Trading Platform** là nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện, cho phép họ kiếm tiền từ việc giảm phát thải CO₂, đồng thời tạo marketplace để các tổ chức/cá nhân mua tín chỉ carbon.

### 1.2 Problem Statement
- Chủ xe điện giảm phát thải CO₂ nhưng không nhận được lợi ích kinh tế
- Các tổ chức cần mua tín chỉ carbon để bù đắp phát thải của họ
- Thiếu nền tảng minh bạch kết nối hai bên

### 1.3 Solution
- **Tự động tính toán CO₂**: Từ dữ liệu hành trình xe điện
- **Xác minh độc lập**: Bởi Carbon Verification & Audit (CVA)
- **Marketplace**: Giao dịch fixed price và auction
- **Thanh toán online**: Tự động và an toàn
- **AI Price Prediction**: Gợi ý giá bán tối ưu

### 1.4 Business Value
- **EV Owners**: Thu nhập thụ động từ việc lái xe điện
- **CC Buyers**: Mua tín chỉ carbon dễ dàng, minh bạch
- **CVA**: Thu phí xác minh
- **Platform**: Thu phí giao dịch
- **Society**: Khuyến khích sử dụng xe sạch, giảm ô nhiễm

---

## 👥 2. STAKEHOLDERS & ACTORS

### 2.1 EV Owner (Chủ xe điện)
**Chức năng**:
1. Kết nối và import dữ liệu hành trình từ xe điện
2. Xem lượng CO₂ đã giảm theo ngày/tháng/năm
3. Tạo yêu cầu phát hành tín chỉ carbon
4. Niêm yết tín chỉ (fixed price hoặc auction)
5. Quản lý ví carbon và lịch sử giao dịch
6. Nhận thanh toán và rút tiền
7. Xem AI prediction giá bán tối ưu
8. Xem báo cáo doanh thu cá nhân

### 2.2 Carbon Credit Buyer (Người mua tín chỉ)
**Chức năng**:
1. Tìm kiếm và lọc tín chỉ carbon
2. Xem thông tin chi tiết tín chỉ
3. Mua tín chỉ (direct purchase hoặc bidding)
4. Thanh toán online (Stripe/PayPal/VNPay)
5. Nhận chứng nhận tín chỉ carbon
6. Quản lý lịch sử mua hàng
7. Xuất hóa đơn

### 2.3 Carbon Verification & Audit (CVA)
**Chức năng**:
1. Xem danh sách yêu cầu phát hành tín chỉ
2. Kiểm tra dữ liệu hành trình và tính toán CO₂
3. Duyệt hoặc từ chối yêu cầu
4. Cấp tín chỉ vào ví carbon
5. Xuất báo cáo xác minh
6. Quản lý chứng nhận đã cấp

### 2.4 Admin (Quản trị viên)
**Chức năng**:
1. Quản lý người dùng (4 loại actors)
2. Quản lý giao dịch và giải quyết tranh chấp
3. Quản lý ví điện tử và thanh toán
4. Xem báo cáo tổng hợp platform
5. Cấu hình hệ thống và quy tắc business
6. Monitor logs và security

---

## 🏗️ 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Pattern
**Microservices Architecture** với 9 services độc lập:

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway (Nginx)                       │
│                         Port: 80                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  User Service   │ │ EV Data Service │ │Carbon Credit    │
│   Port: 3001    │ │   Port: 3002    │ │Service:3003     │
│  PostgreSQL     │ │    MongoDB      │ │  PostgreSQL     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Marketplace    │ │ Payment Service │ │ Verification    │
│ Service: 3004   │ │   Port: 3005    │ │Service: 3006    │
│  PostgreSQL     │ │  PostgreSQL     │ │  PostgreSQL     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Notification   │ │ Reporting       │ │   AI Service    │
│Service: 3007    │ │Service: 3008    │ │   Port: 3009    │
│  PostgreSQL     │ │    MongoDB      │ │   Python/ML     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│     Redis       │ │   RabbitMQ      │ │   Frontend      │
│  Cache & Queue  │ │  Message Queue  │ │   React.js      │
│   Port: 6379    │ │   Port: 5672    │ │   Port: 3000    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 Microservices Details

#### Service 1: User Service (Port 3001)
**Responsibility**: Authentication, Authorization, User Management  
**Database**: PostgreSQL (user_service_db)  
**Key Features**:
- JWT-based authentication
- Role-based access control (RBAC) for 4 actors
- User profile management
- Session management

**APIs**:
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

---

#### Service 2: EV Data Service (Port 3002)
**Responsibility**: Vehicle data management, trip tracking, CO₂ calculation  
**Database**: MongoDB (ev_data_db)  
**Key Features**:
- Vehicle registration and management
- Trip data import (CSV/JSON)
- Real-time CO₂ calculation
- Historical data storage

**CO₂ Calculation Formula**:
```
Gasoline Car Emission = 120 g CO₂/km
Electric Vehicle Emission = 20 g CO₂/km (grid electricity)

CO₂ Saved = (120 - 20) × distance_km = 100 g CO₂/km
Carbon Credits = CO₂_Saved_kg / 1000

Example: 1000 km → 100 kg CO₂ → 0.1 credits
```

**APIs**:
- `POST /api/vehicles` - Register vehicle
- `POST /api/vehicles/:id/trips` - Import trip data
- `GET /api/vehicles/:id/trips` - Get trip history
- `GET /api/vehicles/:id/co2-savings` - Calculate CO₂ savings
- `POST /api/vehicles/:id/generate-credits` - Request credit generation

---

#### Service 3: Carbon Credit Service (Port 3003)
**Responsibility**: Carbon credit wallet, credit issuance, balance management  
**Database**: PostgreSQL (carbon_credit_db)  
**Key Features**:
- Carbon wallet CRUD
- Credit issuance after CVA approval
- Balance management
- Transaction history

**APIs**:
- `GET /api/wallet/:userId` - Get wallet balance
- `POST /api/credits/request` - Request credit issuance
- `POST /api/credits/issue` - Issue credits (CVA only)
- `GET /api/credits/history/:userId` - Transaction history
- `PUT /api/credits/transfer` - Transfer credits

---

#### Service 4: Marketplace Service (Port 3004)
**Responsibility**: Listing management, order processing, auction  
**Database**: PostgreSQL (marketplace_db)  
**Key Features**:
- Fixed price and auction listings
- Search and filter
- Order management
- Bidding system

**APIs**:
- `POST /api/marketplace/listings` - Create listing
- `GET /api/marketplace/listings` - Search listings
- `GET /api/marketplace/listings/:id` - Get listing details
- `POST /api/marketplace/orders` - Create order
- `POST /api/marketplace/bids` - Place bid
- `GET /api/marketplace/orders/:userId` - User orders

---

#### Service 5: Payment Service (Port 3005)
**Responsibility**: Payment processing, escrow, withdrawals  
**Database**: PostgreSQL (payment_db)  
**Key Features**:
- Stripe/PayPal integration
- Escrow system for safe transactions
- Automatic payouts to sellers
- Withdrawal processing

**APIs**:
- `POST /api/payments/checkout` - Create payment
- `POST /api/payments/webhook` - Payment gateway webhook
- `GET /api/payments/:orderId` - Get payment status
- `POST /api/payments/withdraw` - Request withdrawal
- `GET /api/payments/balance/:userId` - Get balance

---

#### Service 6: Verification Service (Port 3006)
**Responsibility**: Credit verification by CVA, KYC  
**Database**: PostgreSQL (verification_db)  
**Key Features**:
- Credit request verification
- Approve/reject workflow
- Certificate generation
- KYC verification

**APIs**:
- `GET /api/verification/requests` - Get pending requests
- `GET /api/verification/requests/:id` - Get request details
- `POST /api/verification/approve/:id` - Approve request
- `POST /api/verification/reject/:id` - Reject request
- `GET /api/verification/certificates/:userId` - Get certificates

---

#### Service 7: Notification Service (Port 3007)
**Responsibility**: Email notifications, in-app alerts  
**Database**: PostgreSQL (notification_db)  
**Key Features**:
- Email templates
- Redis queue for async sending
- Notification history
- Push notifications

**APIs**:
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

---

#### Service 8: Reporting Service (Port 3008)
**Responsibility**: Analytics, reports for users and admins  
**Database**: MongoDB (reporting_db)  
**Key Features**:
- Personal CO₂ reports
- Revenue reports
- Platform analytics
- Admin dashboard data

**APIs**:
- `GET /api/reports/personal/:userId` - Personal report
- `GET /api/reports/co2-savings/:userId` - CO₂ savings report
- `GET /api/reports/revenue/:userId` - Revenue report
- `GET /api/reports/platform` - Platform analytics (Admin only)

---

#### Service 9: AI Service (Port 3009)
**Responsibility**: ML-based price prediction  
**Tech Stack**: Python + FastAPI + scikit-learn  
**Key Features**:
- Historical price analysis
- Supply/demand prediction
- Optimal price suggestion

**APIs**:
- `POST /api/ai/predict-price` - Get price prediction
- `GET /api/ai/market-trends` - Get market trends

---

## 💾 4. DATABASE DESIGN

### 4.1 Database Per Service Strategy
Mỗi microservice có database riêng để đảm bảo loose coupling.

### 4.2 PostgreSQL Databases (6 services)

#### user_service_db
```sql
-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ev_owner, buyer, cva, admin
    full_name VARCHAR(255),
    phone VARCHAR(50),
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### carbon_credit_db
```sql
-- wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    balance DECIMAL(20, 6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- credit_requests table
CREATE TABLE credit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    co2_saved_kg DECIMAL(15, 3) NOT NULL,
    credits_requested DECIMAL(15, 6) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    verification_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- credit_transactions table
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- issue, transfer, sale, purchase
    amount DECIMAL(15, 6) NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### marketplace_db
```sql
-- listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL,
    credits_amount DECIMAL(15, 6) NOT NULL,
    price_per_credit DECIMAL(15, 2) NOT NULL,
    listing_type VARCHAR(50) NOT NULL, -- fixed, auction
    status VARCHAR(50) DEFAULT 'active', -- active, sold, cancelled
    auction_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    credits_amount DECIMAL(15, 6) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
    payment_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- bids table (for auctions)
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    bidder_id UUID NOT NULL,
    bid_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### payment_db
```sql
-- payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    payer_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50), -- stripe, paypal, vnpay
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    gateway_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- withdrawals table
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    bank_account VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### verification_db
```sql
-- verification_requests table (same as credit_requests but for CVA)
CREATE TABLE verification_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_request_id UUID NOT NULL,
    cva_id UUID,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    credits_amount DECIMAL(15, 6) NOT NULL,
    certificate_number VARCHAR(100) UNIQUE,
    issue_date TIMESTAMP DEFAULT NOW(),
    pdf_url VARCHAR(500)
);
```

#### notification_db
```sql
-- notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, in_app, sms
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 MongoDB Databases (2 services)

#### ev_data_db (MongoDB)
```javascript
// vehicles collection
{
  _id: ObjectId,
  user_id: UUID,
  make: String,
  model: String,
  year: Number,
  vin: String,
  registered_at: Date
}

// trips collection
{
  _id: ObjectId,
  vehicle_id: UUID,
  date: Date,
  start_time: Date,
  end_time: Date,
  distance_km: Number,
  energy_consumed_kwh: Number,
  start_location: {
    lat: Number,
    lng: Number,
    address: String
  },
  end_location: {
    lat: Number,
    lng: Number,
    address: String
  },
  co2_saved_kg: Number,
  created_at: Date
}
```

#### reporting_db (MongoDB)
```javascript
// reports collection
{
  _id: ObjectId,
  user_id: UUID,
  report_type: String, // personal, platform
  period: String, // daily, monthly, yearly
  data: {
    total_distance_km: Number,
    total_co2_saved_kg: Number,
    total_credits_earned: Number,
    total_revenue: Number
  },
  generated_at: Date
}
```

---

## 🔌 5. API DOCUMENTATION

### 5.1 Authentication
All APIs (except register/login) require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### 5.2 API Flow Examples

#### Flow 1: EV Owner tạo và bán tín chỉ
```
1. POST /api/vehicles (Register vehicle)
2. POST /api/vehicles/:id/trips (Import trip data)
3. GET /api/vehicles/:id/co2-savings (View CO₂ saved)
4. POST /api/credits/request (Request credit issuance)
5. [CVA] POST /api/verification/approve/:id (CVA approves)
6. POST /api/marketplace/listings (List credits for sale)
7. [Buyer] POST /api/marketplace/orders (Buyer creates order)
8. [Buyer] POST /api/payments/checkout (Buyer pays)
9. POST /api/payments/withdraw (EV Owner withdraws money)
```

#### Flow 2: Buyer mua tín chỉ
```
1. GET /api/marketplace/listings (Browse listings)
2. GET /api/marketplace/listings/:id (View details)
3. POST /api/marketplace/orders (Create order)
4. POST /api/payments/checkout (Make payment)
5. GET /api/verification/certificates/:userId (Receive certificate)
```

---

## 🔐 6. SECURITY

### 6.1 Authentication & Authorization
- **JWT tokens** with 24-hour expiration
- **Refresh tokens** for seamless re-authentication
- **Role-based access control (RBAC)** for 4 actor types
- **Password hashing** with bcrypt (cost factor: 12)

### 6.2 API Security
- **Rate limiting**: 100 requests/minute per IP
- **CORS** configuration for trusted domains only
- **Input validation** on all endpoints
- **SQL injection prevention** with parameterized queries
- **XSS protection** with content sanitization

### 6.3 Data Security
- **Encryption at rest** for sensitive data
- **TLS/SSL** for data in transit
- **Environment variables** for secrets (.env)
- **Database access** restricted by service

### 6.4 Payment Security
- **PCI DSS compliance** via Stripe/PayPal
- **Escrow system** to prevent fraud
- **Webhook signature verification**

---

## 🚀 7. DEPLOYMENT

### 7.1 Docker Compose (Local Development)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 7.2 Environment Variables
Required in `.env` file:
```env
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
MONGO_USER=admin
MONGO_PASSWORD=secret123

# Redis & RabbitMQ
REDIS_PASSWORD=secret123
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=secret123

# JWT
JWT_SECRET=random-secret-key
JWT_EXPIRES_IN=24h

# Payment
PAYMENT_GATEWAY_KEY=stripe-key

# Email
EMAIL_SERVICE=smtp
EMAIL_USER=email@domain.com
EMAIL_PASSWORD=app-password
```

### 7.3 Port Mapping
```
API Gateway:        80
Frontend:           3000
User Service:       3001
EV Data Service:    3002
Carbon Credit:      3003
Marketplace:        3004
Payment:            3005
Verification:       3006
Notification:       3007
Reporting:          3008
AI Service:         3009

PostgreSQL DBs:     5432-5437
MongoDB:            27017-27018
Redis:              6379
RabbitMQ:           5672, 15672 (Management UI)
```

---

## 📊 8. MONITORING & LOGGING

### 8.1 Health Checks
All services implement `/health` endpoint:
```javascript
GET /health
Response: {
  "status": "healthy",
  "timestamp": "2025-10-31T12:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

### 8.2 Logging Strategy
- **Centralized logging** with RabbitMQ
- **Log levels**: ERROR, WARN, INFO, DEBUG
- **Structured logs** in JSON format
- **Correlation IDs** for request tracing

### 8.3 Metrics (Optional)
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Key metrics**: Request rate, error rate, latency, database connections

---

## 🧪 9. TESTING STRATEGY

### 9.1 Unit Testing
- **Coverage target**: 70%+
- **Tools**: Jest (Node.js), pytest (Python)
- **Run**: `npm test` or `pytest`

### 9.2 Integration Testing
- Test inter-service communication
- Test database operations
- Test RabbitMQ message flow

### 9.3 E2E Testing
- Test complete user journeys
- Test payment flows
- Test auction bidding

---

## 📈 10. TECHNOLOGY STACK

### Backend
- **User, EV Data, Carbon Credit, Marketplace, Payment, Verification, Notification, Reporting Services**: Node.js 18 + Express + TypeScript
- **AI Service**: Python 3.11 + FastAPI + scikit-learn

### Databases
- **PostgreSQL 15**: Relational data (6 services)
- **MongoDB 7**: Document data (2 services)
- **Redis 7**: Caching & queuing

### Infrastructure
- **API Gateway**: Nginx
- **Message Queue**: RabbitMQ 3
- **Containerization**: Docker + Docker Compose

### Frontend
- **Framework**: React.js + TypeScript + Vite
- **UI Library**: Material-UI or Ant Design
- **State Management**: Redux or Zustand

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Documentation**: Confluence

---

## ✅ 11. DEFINITION OF DONE

### For Each Feature:
- [ ] Code implemented and follows coding standards
- [ ] Unit tests written (70%+ coverage)
- [ ] Integration tests passed
- [ ] API documented in this Confluence page
- [ ] Code reviewed and approved
- [ ] Merged to main branch
- [ ] Deployed and verified in staging

### For Project Completion:
- [ ] All 28 GitHub Issues closed
- [ ] Docker compose works (`docker-compose up`)
- [ ] All services healthy
- [ ] Confluence documentation complete (this document)
- [ ] README.md updated
- [ ] Demo video recorded
- [ ] Code submitted on time (18/11/2025)

---

## 📚 12. REFERENCES

- [GitHub Repository](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners)
- [GitHub Issues](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues)
- [Docker Documentation](https://docs.docker.com/)
- [Microservices Best Practices](https://microservices.io/)

---

**Document Maintained By**: Team Lead  
**Last Review Date**: 31/10/2025  
**Next Review**: 07/11/2025
