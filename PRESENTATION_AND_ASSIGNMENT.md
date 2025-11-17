# 📊 NỘI DUNG TRÌNH BÀY VÀ PHÂN CÔNG NHIỆM VỤ

**Dự án:** Carbon Credit Trading Platform for Electric Vehicle Owners  
**Timeline:** 31/10/2025 - 18/11/2025 (19 ngày)  
**Team:** 5 thành viên  
**Deadline:** 18/11/2025

---

## 🎯 PHẦN 1: NỘI DUNG TRÌNH BÀY (7-10 phút)

### **1. GIỚI THIỆU DỰ ÁN (1 phút)**

**Vấn đề:**
- Chủ xe điện giảm CO₂ nhưng không có lợi ích kinh tế
- Các tổ chức cần mua tín chỉ carbon nhưng thiếu nền tảng minh bạch

**Giải pháp:**
- Nền tảng giao dịch tín chỉ carbon tự động
- Chủ xe điện → Kiếm tiền từ việc giảm phát thải
- Người mua → Mua tín chỉ dễ dàng, minh bạch

**Actors:**
- EV Owner (Chủ xe điện)
- Buyer (Người mua credit)
- CVA (Carbon Verification & Audit)
- Admin (Quản trị viên)

---

### **2. KIẾN TRÚC HỆ THỐNG (2 phút)**

**Microservices Architecture - 9 Services:**

```
                    API Gateway (Nginx)
                            ↓
    ┌──────────────┬────────┴────────┬──────────────┐
    ↓              ↓                  ↓              ↓
User Service   EV Data      Carbon Credit    Marketplace
(Port 3001)    (Port 3002)  (Port 3003)      (Port 3004)
PostgreSQL     MongoDB      PostgreSQL       PostgreSQL

    ↓              ↓                  ↓              ↓
Payment        Verification  Notification   Reporting
(Port 3005)    (Port 3006)   (Port 3007)    (Port 3008)
PostgreSQL     PostgreSQL    PostgreSQL     MongoDB

                AI Service (Port 3009)
                Python + FastAPI
```

**Infrastructure:**
- RabbitMQ: Message Queue giữa services
- Redis: Caching và rate limiting
- Docker: Container hóa toàn bộ platform

---

### **3. TECH STACK (1 phút)**

**Backend:**
- Node.js 18 + TypeScript 5.3
- Express.js 4.18
- PostgreSQL 15 (6 services)
- MongoDB 7 (2 services)
- Python + FastAPI (AI service)

**Security:**
- JWT Authentication (24h expiration)
- Bcrypt password hashing (salt 12)
- Joi input validation
- Helmet + CORS middleware

**DevOps:**
- Docker + Docker Compose
- Nginx API Gateway
- RabbitMQ Message Queue
- Redis Cache

**Frontend:**
- React.js 18 + TypeScript
- Material-UI / Ant Design
- Zustand state management
- Axios API client

---

### **4. TIẾN ĐỘ HIỆN TẠI (1 phút)**

**✅ Đã hoàn thành (4 issues):**

1. **Issue #1:** Repository Structure
   - 9 service folders
   - Git workflow setup

2. **Issue #2:** Docker Environment
   - 9 Dockerfiles
   - docker-compose.yml (orchestrate toàn bộ)
   - Nginx API Gateway config

3. **Issue #3:** System Architecture Document
   - 753 dòng markdown
   - Microservices diagram
   - Database schemas
   - API documentation

4. **Issue #4:** User Registration API
   - POST /api/users/register
   - POST /api/users/login
   - JWT authentication
   - Password hashing
   - 720 dòng code
   - 8 unit test cases
   - 0 vulnerabilities

---

### **5. DEMO TRỰC TIẾP (2 phút)**

**Bước 1: Show Docker Compose**
```bash
docker-compose up -d
# 9 services + 8 databases khởi động
```

**Bước 2: Test API User Service**
```bash
# Đăng ký user
POST http://localhost/api/users/register
{
  "email": "demo@example.com",
  "password": "SecurePass123!",
  "full_name": "Demo User",
  "role": "ev_owner"
}
# → Trả về JWT token
```

**Bước 3: Show Database**
```bash
docker exec -it user-db psql -U admin -d user_service_db
SELECT * FROM users;
# → User đã được insert
```

**Bước 4: Show GitHub**
- Issues: 4 closed, 21 open
- Project Board: All tasks organized

---

### **6. KẾ HOẠCH 2 TUẦN TỚI (1 phút)**

**Tuần 1 (31/10 - 06/11):**
- Issue #5: Vehicle Registration (MongoDB)
- Issue #6: CO₂ Calculation
- Issue #7: Carbon Wallet (PostgreSQL)
- Issue #8: Marketplace Listing
- Issue #11: Payment Service
- Issue #12: Verification Service
- Issue #17: Notification Service
- Issue #18: Reporting Service

**Tuần 2 (07/11 - 13/11):**
- Issue #9: Frontend React.js (4 dashboards)
- Integration Testing
- Bug fixes

**Tuần 3 (14/11 - 18/11):**
- Final testing
- Demo video
- Documentation
- **SUBMIT: 18/11/2025**

---

### **7. Q&A (2 phút)**

**Câu hỏi thường gặp:**

**Q: Tại sao dùng Microservices?**
A: Độc lập, dễ scale, technology flexibility

**Q: Tại sao MongoDB cho EV Data?**
A: Schema linh hoạt, mỗi hãng xe có features khác nhau

**Q: Làm sao test khi chưa có Frontend?**
A: Dùng Postman/Thunder Client test APIs

**Q: 19 ngày có đủ không?**
A: Có kế hoạch chi tiết, ưu tiên core features

--- 

## 👥 PHẦN 2: PHÂN CÔNG NHIỆM VỤ CHI TIẾT

### **📋 BẢNG TỔNG HỢP:**

| Member | GitHub Issues | Services | APIs | Database | Deadline |
|--------|---------------|----------|------|----------|----------|
| **Bạn (Lead)** | #5, #6 | EV Data Service | 7 APIs | MongoDB | 04/11 |
| **Bạn 1** | #7, #8 | Carbon Credit + Marketplace | 7 APIs | PostgreSQL ×2 | 06/11 |
| **Bạn 2** | #11, #12 | Payment + Verification | 6 APIs | PostgreSQL ×2 | 07/11 |
| **Bạn 3** | #17, #18 | Notification + Reporting | 6 APIs | PostgreSQL + MongoDB | 08/11 |
| **Bạn 4** | #9 | Frontend React.js | 19 pages | Mock data | 13/11 |

---

## 🚗 **BẠN (TEAM LEAD): ISSUE #5 + #6**

### **Service:** EV Data Service (Port 3002)

### **Database:** MongoDB
- Container: `ev-mongodb` (Port 27017)
- Database: `ev_data_db`
- Collection: `vehicles`

### **Issue #5: Vehicle Registration**

**Làm gì:**
Tạo API đăng ký xe điện vào hệ thống

**Files cần tạo:**
```
services/ev-data-service/
├── package.json                      ← npm install mongoose, express
├── tsconfig.json                     ← Copy từ user-service
├── .env.example                      ← MONGODB_URI, PORT=3002
├── src/
│   ├── index.ts                      ← Server Express
│   ├── config/database.ts            ← Kết nối MongoDB
│   ├── models/vehicle.model.ts       ← Schema: make, model, year, battery
│   ├── controllers/vehicle.controller.ts  ← Logic CRUD
│   ├── routes/vehicle.routes.ts      ← API routes
│   ├── validators/vehicle.validator.ts    ← Joi validation
│   └── middleware/auth.middleware.ts      ← Verify JWT
```

**APIs tạo:**
- `POST /api/vehicles` - Đăng ký xe mới
- `GET /api/vehicles` - Lấy danh sách xe của user
- `GET /api/vehicles/:id` - Chi tiết 1 xe
- `PUT /api/vehicles/:id` - Sửa thông tin xe
- `DELETE /api/vehicles/:id` - Xóa xe

**Bước làm:**
1. Tạo package.json → `npm install`
2. Tạo database.ts → Kết nối MongoDB
3. Tạo vehicle.model.ts → Mongoose schema
4. Tạo controller → registerVehicle(), getVehicles()
5. Tạo routes → Mapping endpoints
6. Tạo index.ts → Start server port 3002
7. Test với Postman

**Deadline:** 02/11/2025

---

### **Issue #6: CO₂ Calculation**

**Làm gì:**
Tính CO₂ tiết kiệm từ các chuyến đi

**Files cần tạo/sửa:**
```
services/ev-data-service/  (Cùng service)
├── src/
│   ├── controllers/trip.controller.ts      ← Thêm trip, tính CO₂
│   ├── routes/trip.routes.ts               ← Trip routes
│   └── models/vehicle.model.ts             ← Thêm trips: [] array
```

**Công thức:**
```
CO₂ saved (kg) = 0.10 × distance (km)
```

**APIs tạo:**
- `POST /api/vehicles/:id/trips` - Thêm chuyến đi (tính CO₂ tự động)
- `GET /api/vehicles/:id/trips` - Lịch sử trips
- `GET /api/vehicles/:id/co2-savings?period=month` - Tổng CO₂ theo tháng

**Bước làm:**
1. Sửa vehicle.model.ts → Thêm trips array
2. Tạo trip.controller.ts → addTrip() + calculateCO2()
3. Tạo aggregate function → Sum CO₂ by month
4. Test APIs

**Deadline:** 04/11/2025

---

## 💰 **BẠN 1: ISSUE #7 + #8**

### **Service 1:** Carbon Credit Service (Port 3003)
### **Service 2:** Marketplace Service (Port 3004)

### **Database:** PostgreSQL ×2
- `carbon_credit_db` (Port 5433)
- `marketplace_db` (Port 5434)

### **Issue #7: Carbon Wallet**

**Làm gì:**
Quản lý ví chứa carbon credits

**Files cần tạo:**
```
services/carbon-credit-service/
├── package.json                      ← pg, express
├── src/
│   ├── index.ts
│   ├── config/database.ts            ← PostgreSQL + tạo 2 tables
│   ├── controllers/
│   │   ├── wallet.controller.ts      ← getWallet, credit, debit
│   │   └── transaction.controller.ts ← Lịch sử giao dịch
│   ├── routes/wallet.routes.ts
│   └── validators/wallet.validator.ts
```

**Database Schema:**
```sql
-- Table 1: wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    total_sold DECIMAL(10,2) DEFAULT 0
);

-- Table 2: transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    wallet_id UUID,
    type VARCHAR(10),  -- 'credit' or 'debit'
    amount DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP
);
```

**APIs tạo:**
- `GET /api/wallet/:userId` - Xem ví
- `POST /api/wallet/credit` - Cộng credits (CVA dùng)
- `POST /api/wallet/debit` - Trừ credits (khi bán)
- `GET /api/wallet/:userId/transactions` - Lịch sử

**Deadline:** 03/11/2025

---

### **Issue #8: Marketplace Listing**

**Làm gì:**
Niêm yết credits để bán

**Files cần tạo:**
```
services/marketplace-service/
├── package.json                      ← pg, express, axios
├── src/
│   ├── index.ts
│   ├── config/database.ts            ← PostgreSQL + tạo 2 tables
│   ├── controllers/listing.controller.ts
│   ├── routes/listing.routes.ts
│   └── services/wallet.service.ts    ← Gọi API Wallet Service (#7)
```

**Database Schema:**
```sql
-- Table 1: listings
CREATE TABLE listings (
    id UUID PRIMARY KEY,
    seller_id UUID,
    quantity DECIMAL(10,2),
    price_per_credit DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(20),  -- 'active', 'sold', 'cancelled'
    created_at TIMESTAMP
);

-- Table 2: orders
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    buyer_id UUID,
    listing_id UUID,
    quantity DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP
);
```

**APIs tạo:**
- `POST /api/marketplace/listings` - Tạo listing (lock credits)
- `GET /api/marketplace/listings` - Danh sách bán
- `GET /api/marketplace/listings/:id` - Chi tiết
- `POST /api/marketplace/listings/:id/purchase` - Mua
- `DELETE /api/marketplace/listings/:id` - Hủy (unlock)

**Liên kết với Issue #7:**
- Khi tạo listing → Gọi API Wallet để lock credits
- Khi mua → Chuyển credits giữa wallets

**Deadline:** 06/11/2025

---

## 💳 **BẠN 2: ISSUE #11 + #12**

### **Service 1:** Payment Service (Port 3005)
### **Service 2:** Verification Service (Port 3006)

### **Database:** PostgreSQL ×2
- `payment_db` (Port 5435)
- `verification_db` (Port 5436)

### **Issue #11: Payment Service**

**Làm gì:**
Xử lý thanh toán khi buyer mua credits

**Files cần tạo:**
```
services/payment-service/
├── package.json                      ← pg, express
├── src/
│   ├── index.ts
│   ├── config/database.ts
│   ├── controllers/payment.controller.ts
│   └── routes/payment.routes.ts
```

**Database Schema:**
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    buyer_id UUID,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),  -- 'stripe', 'paypal', 'bank_transfer'
    status VARCHAR(20),  -- 'pending', 'completed', 'failed'
    transaction_id VARCHAR(255),
    created_at TIMESTAMP
);
```

**APIs tạo:**
- `POST /api/payments/create` - Tạo payment intent
- `POST /api/payments/confirm` - Xác nhận đã thanh toán
- `GET /api/payments/:userId/history` - Lịch sử thanh toán

**Deadline:** 05/11/2025

---

### **Issue #12: Verification Service**

**Làm gì:**
CVA duyệt CO₂ để cấp credits vào ví

**Files cần tạo:**
```
services/verification-service/
├── package.json
├── src/
│   ├── index.ts
│   ├── config/database.ts
│   ├── controllers/verification.controller.ts
│   ├── routes/verification.routes.ts
│   └── services/wallet.service.ts    ← Gọi Wallet API để cấp credits
```

**Database Schema:**
```sql
CREATE TABLE verifications (
    id UUID PRIMARY KEY,
    user_id UUID,
    vehicle_id UUID,
    co2_amount DECIMAL(10,2),  -- kg
    trips_count INT,    
    status VARCHAR(20),  -- 'pending', 'approved', 'rejected'
    cva_id UUID,
    notes TEXT,
    created_at TIMESTAMP,
    reviewed_at TIMESTAMP
);
```

**APIs tạo:**
- `GET /api/verification/pending` - CVA xem pending
- `POST /api/verification/approve` - Duyệt → Gọi Wallet cấp credits
- `POST /api/verification/reject` - Từ chối

**Deadline:** 07/11/2025

---

## 🔔 **BẠN 3: ISSUE #17 + #18**

### **Service 1:** Notification Service (Port 3007)
### **Service 2:** Reporting Service (Port 3008)

### **Database:**
- PostgreSQL: `notification_db` (Port 5437)
- MongoDB: `reporting_db` (Port 27018)

### **Issue #17: Notification Service**

**Làm gì:**
Gửi email/push notifications

**Files cần tạo:**
```
services/notification-service/
├── package.json                      ← nodemailer, firebase-admin (optional)
├── src/
│   ├── index.ts
│   ├── config/database.ts
│   ├── controllers/notification.controller.ts
│   ├── routes/notification.routes.ts
│   └── services/
│       ├── email.service.ts          ← Gửi email với nodemailer
│       └── push.service.ts           ← Push notification (optional)
```

**Database Schema:**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID,
    type VARCHAR(50),  -- 'email', 'push', 'in_app'
    title VARCHAR(255),
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP
);
```

**APIs tạo:**
- `POST /api/notifications/send` - Gửi notification
- `GET /api/notifications/:userId` - Lấy notifications của user
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

**Deadline:** 06/11/2025

---

### **Issue #18: Reporting Service**

**Làm gì:**
Báo cáo và analytics

**Files cần tạo:**
```
services/reporting-service/
├── package.json                      ← mongoose, express
├── src/
│   ├── index.ts
│   ├── config/database.ts            ← MongoDB
│   ├── controllers/report.controller.ts
│   └── routes/report.routes.ts
```

**MongoDB Collections:**
- Personal reports
- Platform analytics
- Revenue reports

**APIs tạo:**
- `GET /api/reports/personal/:userId` - Báo cáo cá nhân
- `GET /api/reports/co2-savings/:userId` - CO₂ savings report
- `GET /api/reports/revenue/:userId` - Revenue report
- `GET /api/reports/platform` - Platform analytics (Admin only)

**Deadline:** 08/11/2025

---

## 🎨 **BẠN 4: ISSUE #9 - FRONTEND**

### **Framework:** React.js + TypeScript + Vite
### **Port:** 3000

### **Chiến lược 2 giai đoạn:**

**GIAI ĐOẠN 1 (07-10/11): Code UI với Mock Data**
- Tạo components và pages
- Hard-code dữ liệu mẫu
- Không cần backend

**GIAI ĐOẠN 2 (11-13/11): Integrate APIs**
- Thay mock data → API calls
- Test với backend thật
- Fix bugs

---

### **Files cần tạo:**

```
frontend/
├── package.json                      ← React, axios, material-ui
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx                      ← Entry point
│   ├── App.tsx                       ← Route theo role
│   ├── mocks/
│   │   └── mockData.ts               ← HARD-CODE dữ liệu giả ⭐
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── evowner/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── TripCard.tsx
│   │   │   └── CO2Chart.tsx
│   │   ├── buyer/
│   │   │   ├── ListingCard.tsx
│   │   │   └── CertificateCard.tsx
│   │   ├── cva/
│   │   │   └── VerificationCard.tsx
│   │   └── admin/
│   │       ├── UserTable.tsx
│   │       ├── TransactionTable.tsx
│   │       └── StatsCard.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx             ← 1 page chung
│   │   ├── evowner/                  ← 5 pages
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── VehiclesPage.tsx    
│   │   │   ├── TripsPage.tsx
│   │   │   ├── WalletPage.tsx
│   │   │   └── SellCreditsPage.tsx
│   │   ├── buyer/                    ← 4 pages
│   │   │   ├── BuyerDashboard.tsx
│   │   │   ├── MarketplacePage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   └── CertificatesPage.tsx
│   │   ├── cva/                      ← 3 pages
│   │   │   ├── CVADashboard.tsx
│   │   │   ├── PendingQueue.tsx
│   │   │   └── VerificationHistory.tsx
│   │   └── admin/                    ← 6 pages
│   │       ├── AdminDashboard.tsx
│   │       ├── UserManagement.tsx
│   │       ├── TransactionManagement.tsx
│   │       ├── VerificationQueue.tsx
│   │       ├── PlatformReports.tsx
│   │       └── SystemSettings.tsx
│   ├── routes/
│   │   ├── OwnerRoutes.tsx
│   │   ├── BuyerRoutes.tsx
│   │   ├── CVARoutes.tsx
│   │   └── AdminRoutes.tsx
│   ├── services/
│   │   └── api.ts                    ← Axios config (giai đoạn 2)
│   └── utils/
│       └── formatters.ts
```

---

### **Mock Data Example:**

```typescript
// src/mocks/mockData.ts

export const mockUsers = {
  currentUser: {
    id: "user-123",
    email: "john@example.com",
    full_name: "John Doe",
    role: "ev_owner",
    token: "mock-jwt-token"
  }
};

export const mockVehicles = [
  {
    id: "vehicle-1",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    battery_capacity: 75,
    total_co2_saved: 125.0
  }
];

export const mockWallet = {
  balance: 15.5,
  total_earned: 20.0,
  total_sold: 4.5
};

export const mockListings = [
  {
    id: "listing-1",
    seller: "Alice Smith",
    quantity: 10,
    price_per_credit: 12,
    total_price: 120
  }
];
```

---

### **Pages cần tạo: 19 PAGES**

**Tổng cộng:**
- Login: 1 page
- EV Owner: 5 pages
- Buyer: 4 pages
- CVA: 3 pages
- Admin: 6 pages

**Routing theo role:**
- Login → Check JWT token → Route to dashboard by role
- EV Owner → OwnerRoutes
- Buyer → BuyerRoutes
- CVA → CVARoutes
- Admin → AdminRoutes

**Deadline:** 13/11/2025

---

## 📅 TIMELINE TỔNG THỂ

### **TUẦN 1 (31/10 - 06/11):**

```
Ngày 31/10 - 01/11:
├── Bạn: Issue #5 (Vehicle Registration)
├── Bạn 1: Issue #7 (Carbon Wallet)
└── Bạn 2, 3: Setup services

Ngày 02/11 - 03/11:
├── Bạn: Issue #6 (CO₂ Calculation)
├── Bạn 1: Issue #8 (Marketplace)
├── Bạn 2: Issue #11 (Payment)
└── Bạn 3: Issue #17 (Notification)

Ngày 04/11 - 06/11:
├── Testing backend APIs
├── Bạn 2: Issue #12 (Verification)
└── Bạn 3: Issue #18 (Reporting)
```

---

### **TUẦN 2 (07/11 - 13/11):**

```
Ngày 07/11 - 08/11:
├── Bạn 4: Setup Frontend + Mock data
└── Backend team: Bug fixes

Ngày 09/11 - 10/11:
├── Bạn 4: Code UI Pages với mock
└── Backend team: Optimize APIs

Ngày 11/11 - 13/11:
├── Bạn 4: Integrate APIs
└── Tất cả: Integration testing
```

---

### **TUẦN 3 (14/11 - 18/11):**

```
Ngày 14/11 - 16/11:
├── Bug fixes toàn bộ platform
├── UI polish
└── Performance optimization

Ngày 17/11:
├── Final testing
├── Record demo video
└── Prepare documentation

Ngày 18/11:
└── 🎉 SUBMIT!
```

---

## 🔗 DEPENDENCIES (PHỤ THUỘC)

### **Ai phụ thuộc ai:**

```
Issue #6 → Cần Issue #5 xong (vehicle model)
Issue #8 → Cần Issue #7 xong (wallet API)
Issue #12 → Cần Issue #7 xong (để cấp credits)
Issue #9 (Frontend) → Cần TẤT CẢ backend xong
```

### **Thứ tự an toàn:**

#### **Bước 1: Bạn làm Issue #5 (31/10-02/11) → Commit**
**Service:** EV Data Service (Port 3002)  
**Folder:** `services/ev-data-service/`  

**Cấu trúc cần tạo:**
```
ev-data-service/
├── package.json              (dependencies: mongoose, express, joi, jwt)
├── tsconfig.json             (TypeScript config)
├── .env.example              (MONGODB_URI, PORT)
├── Dockerfile                (đã có)
└── src/
    ├── index.ts              (Server khởi động Express)
    ├── config/
    │   └── database.ts       (Kết nối MongoDB)
    ├── models/
    │   └── vehicle.model.ts  (Schema: make, model, year, battery, trips[])
    ├── controllers/
    │   └── vehicle.controller.ts  (CRUD logic: create, read, update, delete)
    ├── routes/
    │   └── vehicle.routes.ts      (API routes mapping)
    ├── validators/
    │   └── vehicle.validator.ts   (Joi validation cho input)
    └── middleware/
        └── auth.middleware.ts     (Verify JWT token)
```

**Công việc:**
- Tạo 10 files
- 5 APIs: POST, GET (all), GET (id), PUT, DELETE
- MongoDB collection: `vehicles`
- Test với Postman
- **Commit lên GitHub** → Bạn 1 và các bạn khác pull về để dùng model

---

#### **Bước 2: Bạn 1 làm Issue #7 song song (31/10-03/11) → Commit**
**Service:** Carbon Credit Service (Port 3003)  
**Folder:** `services/carbon-credit-service/`  

**Cấu trúc cần tạo:**
```
carbon-credit-service/
├── package.json              (dependencies: pg, express, joi, jwt)
├── tsconfig.json
├── .env.example              (POSTGRES_URI, PORT)
├── Dockerfile                (đã có)
└── src/
    ├── index.ts              (Server khởi động)
    ├── config/
    │   └── database.ts       (Kết nối PostgreSQL + CREATE TABLE auto)
    ├── controllers/
    │   ├── wallet.controller.ts       (getWallet, creditWallet, debitWallet)
    │   └── transaction.controller.ts  (getTransactionHistory)
    ├── routes/
    │   └── wallet.routes.ts
    └── validators/
        └── wallet.validator.ts
```

**Công việc:**
- Tạo 8 files
- 4 APIs: GET wallet, POST credit, POST debit, GET transactions
- PostgreSQL tables: `wallets`, `transactions`
- Test với Postman
- **Commit lên GitHub** → Bạn làm #6 và Bạn 1 làm #8 sẽ cần gọi APIs này

---

#### **Bước 3: Bạn làm Issue #6 (03-04/11) - dùng model từ #5**
**Service:** EV Data Service (tiếp tục service #5)  
**Folder:** `services/ev-data-service/` (cùng folder)  

**Cấu trúc bổ sung:**
```
ev-data-service/src/
├── models/
│   └── vehicle.model.ts      (Đã có - chỉ sửa thêm trips array)
├── controllers/
│   └── trip.controller.ts    (MỚI: addTrip, calculateCO2, getCO2Report)
├── routes/
│   └── trip.routes.ts        (MỚI: Trip routes)
└── utils/
    └── co2Calculator.ts      (MỚI: Hàm tính CO₂ = 0.10 × km)
```

**Công việc:**
- Tạo 3 files mới
- Sửa 1 file cũ (vehicle.model.ts thêm trips)
- 3 APIs: POST trip, GET trips, GET CO₂ report
- Logic: Tự động tính CO₂ khi thêm trip
- Aggregate function: Sum CO₂ by month/year
- Test với Postman

---

#### **Bước 4: Bạn 1 làm Issue #8 (04-06/11) - dùng wallet từ #7**
**Service:** Marketplace Service (Port 3004)  
**Folder:** `services/marketplace-service/`  

**Cấu trúc cần tạo:**
```
marketplace-service/
├── package.json              (dependencies: pg, express, axios, joi, jwt)
├── tsconfig.json
├── .env.example
├── Dockerfile                (đã có)
└── src/
    ├── index.ts
    ├── config/
    │   └── database.ts       (PostgreSQL + 2 tables)
    ├── controllers/
    │   └── listing.controller.ts  (createListing, getListings, purchase)
    ├── routes/
    │   └── listing.routes.ts
    ├── services/
    │   └── wallet.service.ts      (MỚI: Gọi API Wallet Service #7)
    └── validators/
        └── listing.validator.ts
```

**Công việc:**
- Tạo 9 files
- 5 APIs: POST listing, GET listings, GET detail, POST purchase, DELETE listing
- PostgreSQL tables: `listings`, `orders`
- **Integration:** Gọi API Wallet từ Issue #7
  - Khi tạo listing → Lock credits (debit wallet)
  - Khi mua → Transfer credits giữa seller/buyer
- Test với Postman (cần Wallet Service chạy)

---

#### **Bước 5: Bạn 2, 3 làm services (độc lập)**

**BẠN 2 - Issue #11: Payment Service (05/11)**  
**Folder:** `services/payment-service/`  
```
payment-service/
├── package.json
├── src/
    ├── index.ts
    ├── config/database.ts    (PostgreSQL: payments table)
    ├── controllers/payment.controller.ts
    └── routes/payment.routes.ts
```
- 3 APIs: Create payment, Confirm payment, Get history
- PostgreSQL table: `payments`
- Mock Stripe/PayPal (không cần thật)

**BẠN 2 - Issue #12: Verification Service (07/11)**  
**Folder:** `services/verification-service/`  
```
verification-service/
├── package.json
├── src/
    ├── index.ts
    ├── config/database.ts    (PostgreSQL: verifications table)
    ├── controllers/verification.controller.ts
    ├── routes/verification.routes.ts
    └── services/wallet.service.ts  (Gọi Wallet API để cấp credits)
```
- 3 APIs: Get pending, Approve (grant credits), Reject
- PostgreSQL table: `verifications`
- **Integration:** Gọi Wallet API khi approve

---

**BẠN 3 - Issue #17: Notification Service (06/11)**  
**Folder:** `services/notification-service/`  
```
notification-service/
├── package.json              (nodemailer, firebase-admin optional)
├── src/
    ├── index.ts
    ├── config/database.ts    (PostgreSQL: notifications table)
    ├── controllers/notification.controller.ts
    ├── routes/notification.routes.ts
    └── services/
        ├── email.service.ts  (Gửi email với nodemailer)
        └── push.service.ts   (Optional: Push notification)
```
- 3 APIs: Send notification, Get notifications, Mark read
- PostgreSQL table: `notifications`
- Email service (nodemailer)

**BẠN 3 - Issue #18: Reporting Service (08/11)**  
**Folder:** `services/reporting-service/`  
```
reporting-service/
├── package.json              (mongoose, express)
├── src/
    ├── index.ts
    ├── config/database.ts    (MongoDB: reports collection)
    ├── controllers/report.controller.ts
    └── routes/report.routes.ts
```
- 4 APIs: Personal report, CO₂ savings, Revenue report, Platform analytics
- MongoDB collection: `reports`
- Aggregate functions cho analytics

---

#### **Bước 6: Bạn 4 làm Frontend cuối (07-13/11)**
**Folder:** `frontend/`  

**Cấu trúc cần tạo:**
```
frontend/
├── package.json              (react, axios, material-ui, zustand)
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx              (Entry point)
    ├── App.tsx               (Router theo role)
    ├── mocks/
    │   └── mockData.ts       (Hard-code data giả - GIAI ĐOẠN 1)
    ├── components/           (50+ components)
    │   ├── common/           (Layout, Header, Sidebar)
    │   ├── evowner/          (VehicleCard, TripCard, CO2Chart)
    │   ├── buyer/            (ListingCard, CertificateCard)
    │   ├── cva/              (VerificationCard)
    │   └── admin/            (UserTable, TransactionTable, StatsCard)
    ├── pages/                (19 pages)
    │   ├── LoginPage.tsx
    │   ├── evowner/          (5 pages)
    │   ├── buyer/            (4 pages)
    │   ├── cva/              (3 pages)
    │   └── admin/            (6 pages)
    ├── routes/               (4 route files theo role)
    ├── services/
    │   └── api.ts            (Axios config - GIAI ĐOẠN 2)
    └── utils/
        └── formatters.ts     (Format date, currency, CO₂)
```

**Công việc:**
- **GIAI ĐOẠN 1 (07-10/11):** Tạo UI với mock data
  - Tạo ~100+ files (components + pages)
  - Hard-code dữ liệu trong mockData.ts
  - Test UI không cần backend
  
- **GIAI ĐOẠN 2 (11-13/11):** Integrate APIs
  - Thay mockData → axios.get/post
  - Connect đến 8 backend services
  - Test integration
  - Fix bugs---

## 🛠️ CÔNG CỤ SỬ DỤNG

### **Development:**
- VS Code + Extensions (GitHub Copilot, Docker, MongoDB, PostgreSQL)
- Postman / Thunder Client (test APIs)
- Docker Desktop

### **Version Control:**
- Git + GitHub
- GitHub CLI: `gh issue list`, `gh issue close`
- GitHub Projects: Kanban board

### **Documentation:**
- Markdown files
- Confluence-style docs
- API documentation

### **Testing:**
- Jest (unit tests)
- Postman (integration tests)
- Manual testing

---

## 📊 WORKLOAD ANALYSIS

| Member | Độ khó | Số APIs | Số pages | Database | Workload |
|--------|--------|---------|----------|----------|----------|
| **Bạn** | ⭐⭐⭐⭐ | 7 | - | MongoDB | Cao |
| **Bạn 1** | ⭐⭐⭐⭐ | 7 | - | PostgreSQL ×2 | Cao |
| **Bạn 2** | ⭐⭐⭐ | 6 | - | PostgreSQL ×2 | Trung bình |
| **Bạn 3** | ⭐⭐⭐ | 6 | - | PostgreSQL + MongoDB | Trung bình |
| **Bạn 4** | ⭐⭐⭐⭐⭐ | - | 19 | Mock data | Rất cao |

---

## ✅ DEFINITION OF DONE

### **Mỗi Issue hoàn thành khi:**
- [ ] Code implemented và chạy được
- [ ] APIs test thành công với Postman
- [ ] Database schema đã tạo
- [ ] Unit tests (optional nhưng khuyến khích)
- [ ] Code pushed lên GitHub
- [ ] Issue closed trên GitHub

### **Dự án hoàn thành khi:**
- [ ] Tất cả 9 services chạy được
- [ ] Frontend hiển thị đầy đủ 4 dashboards
- [ ] Docker compose up thành công
- [ ] Demo video hoàn chỉnh
- [ ] Documentation đầy đủ
- [ ] Nộp bài đúng hạn (18/11/2025)

---

## 📞 LIÊN HỆ & LINKS

**GitHub Repository:**
https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners

**GitHub Issues:**
https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues

**Project Board:**
https://github.com/users/tranminhthai7/projects/2

**System Architecture:**
/SYSTEM_ARCHITECTURE.md

---

## 🎯 SUCCESS METRICS

**Code Quality:**
- 0 vulnerabilities
- Clean git history
- Proper error handling

**Functionality:**
- All APIs working
- All dashboards functional
- Data flow correct

**Timeline:**
- Issues completed on time
- No blocking dependencies
- Submit before deadline

---

**GOOD LUCK TEAM! 🚀**

**Deadline: 18/11/2025 - Còn 18 ngày!**
