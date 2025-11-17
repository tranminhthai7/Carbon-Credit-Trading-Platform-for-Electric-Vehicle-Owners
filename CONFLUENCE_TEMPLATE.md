# 📚 Template Tài liệu Confluence

## 🎯 Cấu trúc Tài liệu (BẮT BUỘC)

Tất cả các phần sau ĐỀU PHẢI có trong Confluence/Wiki của team.

---

## 📖 1. Project Overview

### 1.1 Giới thiệu Dự án
- **Tên dự án**: Carbon Credit Trading Platform for Electric Vehicle Owners
- **Mục đích**: Nền tảng giao dịch tín chỉ carbon cho chủ xe điện
- **Team size**: 4-5 sinh viên
- **Timeline**: 31/10/2025 - 18/11/2025 (19 ngày)
- **Deadline**: 18/11/2025

### 1.2 Problem Statement
- Chủ xe điện giảm phát thải CO₂ nhưng không được lợi ích kinh tế
- Các tổ chức cần mua tín chỉ carbon để bù đắp phát thải
- Thiếu nền tảng kết nối 2 bên này

### 1.3 Solution
- Marketplace giao dịch tín chỉ carbon
- Tự động tính toán CO₂ từ dữ liệu hành trình
- Xác minh bởi tổ chức CVA
- Thanh toán online tự động

### 1.4 Business Value
- EV Owners: Kiếm tiền từ việc giảm phát thải
- Buyers: Mua tín chỉ carbon dễ dàng
- Society: Khuyến khích sử dụng xe điện

---

## 👥 2. Stakeholders & Actors

### 2.1 EV Owner (Chủ sở hữu xe điện)
**Mô tả**: Người sở hữu xe điện, muốn kiếm tiền từ việc giảm CO₂

**Use Cases**:
1. Đăng ký và đăng nhập
2. Kết nối xe điện (import data)
3. Xem lượng CO₂ đã giảm
4. Tạo yêu cầu phát hành tín chỉ
5. Niêm yết tín chỉ để bán
6. Nhận thanh toán và rút tiền
7. Xem báo cáo doanh thu

**User Stories**:
```
As an EV Owner,
I want to upload my trip data,
So that I can calculate how much CO₂ I have saved.
```

### 2.2 Carbon Credit Buyer (Người mua tín chỉ)
**Mô tả**: Tổ chức/cá nhân cần mua tín chỉ carbon để bù đắp phát thải

**Use Cases**:
1. Đăng ký và đăng nhập
2. Tìm kiếm tín chỉ
3. Mua tín chỉ (direct/auction)
4. Thanh toán online
5. Nhận chứng nhận
6. Xem lịch sử mua hàng

**User Stories**:
```
As a Buyer,
I want to search for available carbon credits,
So that I can purchase credits to offset my emissions.
```

### 2.3 Carbon Verification & Audit (CVA)
**Mô tả**: Tổ chức kiểm toán, xác minh tính chính xác của tín chỉ

**Use Cases**:
1. Đăng nhập (được admin cấp account)
2. Xem danh sách yêu cầu phát hành tín chỉ
3. Kiểm tra dữ liệu phát thải
4. Phê duyệt/từ chối yêu cầu
5. Cấp tín chỉ vào ví
6. Xuất báo cáo kiểm toán

**User Stories**:
```
As a CVA,
I want to review credit issuance requests,
So that I can verify the legitimacy before approving.
```

### 2.4 Admin (Quản trị viên)
**Mô tả**: Quản lý toàn bộ hệ thống

**Use Cases**:
1. Quản lý người dùng (tất cả roles)
2. Quản lý giao dịch
3. Xử lý tranh chấp
4. Xem báo cáo tổng hợp
5. Cấu hình hệ thống

---

## 🏗️ 3. System Architecture

### 3.1 Architecture Style
**Microservices Architecture** (BẮT BUỘC)

### 3.2 Architecture Diagram
*(Chèn diagram từ ARCHITECTURE.md hoặc vẽ lại)*

```
[Client] → [API Gateway] → [Microservices] → [Databases]
                    ↓
              [Message Queue]
```

### 3.3 Microservices List

| Service | Port | Database | Responsibility |
|---------|------|----------|----------------|
| User Service | 3001 | PostgreSQL | Authentication & User Management |
| EV Data Service | 3002 | PostgreSQL | Vehicle & Trip Data, CO₂ Calculation |
| Carbon Credit Service | 3003 | PostgreSQL | Wallet & Credit Management |
| Marketplace Service | 3004 | PostgreSQL | Listings, Orders, Auctions |
| Payment Service | 3005 | PostgreSQL | Payments & Withdrawals |
| Verification Service | 3006 | PostgreSQL | CVA Review & Approval |
| Notification Service | 3007 | MongoDB | Notifications & Alerts |
| Reporting Service | 3008 | PostgreSQL | Analytics & Reports |
| AI Service | 3009 | Redis | Price Suggestion (Optional) |

### 3.4 Technology Stack

**Backend**:
- Language: Node.js / Java / Python
- Framework: Express / Spring Boot / FastAPI
- Database: PostgreSQL, MongoDB
- Cache: Redis
- Message Queue: RabbitMQ
- API: REST

**Frontend**:
- Framework: React.js / Vue.js
- UI Library: Material-UI / Ant Design

**DevOps**:
- Docker & Docker Compose
- Git & GitHub
- CI/CD: GitHub Actions (optional)

---

## 🗄️ 4. Database Design

### 4.1 Database Schema Diagram
*(Chèn ER Diagram)*

### 4.2 Tables per Service

#### User Service:
```sql
Users (
  id, email, password_hash, role, full_name, phone, 
  created_at, updated_at
)

Sessions (
  id, user_id, token, expires_at
)
```

#### EV Data Service:
```sql
Vehicles (
  id, owner_id, make, model, year, battery_capacity, 
  registration_number, created_at
)

Trips (
  id, vehicle_id, start_time, end_time, distance_km, 
  energy_consumed_kwh, co2_saved_kg, created_at
)
```

#### Carbon Credit Service:
```sql
CarbonWallets (
  id, user_id, balance, total_earned, total_spent, updated_at
)

CreditRequests (
  id, user_id, vehicle_id, co2_saved_kg, credits_requested,
  status, verification_data, created_at, reviewed_at, reviewed_by
)

CreditTransactions (
  id, wallet_id, type, amount, description, created_at
)
```

*(Tiếp tục cho các services khác...)*

### 4.3 Relationships
- Users → Vehicles (1:N)
- Vehicles → Trips (1:N)
- Users → CarbonWallets (1:1)
- Users → Listings (1:N)
- Listings → Orders (1:N)

---

## 🔌 5. API Documentation

### 5.1 API Design Principles
- RESTful API
- Versioning: `/api/v1/...`
- Authentication: JWT Bearer Token
- Response format: JSON

### 5.2 Common Response Format

**Success Response**:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found"
  }
}
```

### 5.3 Authentication
**Login**:
```
POST /api/v1/users/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "EV_OWNER"
    }
  }
}
```

**Protected Endpoints**:
```
Authorization: Bearer <token>
```

### 5.4 API Endpoints

#### User Service (Port 3001)
```
POST   /api/v1/users/register       - Register new user
POST   /api/v1/users/login          - Login
GET    /api/v1/users/profile        - Get user profile
PUT    /api/v1/users/profile        - Update profile
POST   /api/v1/users/refresh-token  - Refresh JWT token
```

#### EV Data Service (Port 3002)
```
POST   /api/v1/vehicles                      - Register vehicle
GET    /api/v1/vehicles                      - List vehicles
POST   /api/v1/vehicles/{id}/trips           - Upload trip data
GET    /api/v1/vehicles/{id}/co2-savings     - Get CO₂ savings
POST   /api/v1/vehicles/{id}/generate-credits - Generate credits
```

#### Carbon Credit Service (Port 3003)
```
GET    /api/v1/wallet/{userId}           - Get wallet balance
POST   /api/v1/credits/request           - Request credit issuance
GET    /api/v1/credits/requests          - List all requests
GET    /api/v1/credits/certificate/{id}  - Get certificate
```

#### Marketplace Service (Port 3004)
```
POST   /api/v1/marketplace/listings      - Create listing
GET    /api/v1/marketplace/listings      - Browse listings
POST   /api/v1/marketplace/buy/{id}      - Buy credits
POST   /api/v1/marketplace/auctions      - Create auction
POST   /api/v1/marketplace/auctions/{id}/bid - Place bid
```

#### Payment Service (Port 3005)
```
POST   /api/v1/payments/process          - Process payment
POST   /api/v1/payments/withdraw         - Request withdrawal
GET    /api/v1/payments/history          - Payment history
```

#### Verification Service (Port 3006)
```
GET    /api/v1/verification/requests     - List pending requests
POST   /api/v1/verification/approve/{id} - Approve request
POST   /api/v1/verification/reject/{id}  - Reject request
GET    /api/v1/verification/report/{id}  - Get report
```

#### Reporting Service (Port 3008)
```
GET    /api/v1/reports/personal          - Personal dashboard
GET    /api/v1/reports/admin             - Admin dashboard
GET    /api/v1/reports/transactions      - Transaction reports
```

### 5.5 Postman Collection
*(Đính kèm file JSON hoặc link Postman)*

---

## 🔄 6. Business Flows

### 6.1 Flow: EV Owner tạo và bán tín chỉ

```
1. EV Owner đăng ký tài khoản
2. Thêm thông tin xe điện
3. Upload dữ liệu hành trình (CSV/JSON)
4. Hệ thống tính CO₂ đã giảm
5. Tạo yêu cầu phát hành tín chỉ
6. CVA review và approve
7. Tín chỉ được cấp vào ví
8. EV Owner niêm yết tín chỉ (fixed price hoặc auction)
9. Buyer mua tín chỉ
10. Payment được xử lý
11. Tín chỉ chuyển sang ví Buyer
12. EV Owner rút tiền
```

### 6.2 Sequence Diagram
*(Chèn sequence diagram)*

### 6.3 Flow: Buyer mua tín chỉ

```
1. Buyer đăng ký tài khoản
2. Nạp tiền vào ví (optional)
3. Tìm kiếm listings
4. Chọn và mua tín chỉ
5. Thanh toán
6. Tín chỉ được chuyển vào ví
7. Nhận certificate
```

---

## 🧪 7. Testing Strategy

### 7.1 Testing Pyramid
- **Unit Tests**: 70% coverage minimum
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user flows

### 7.2 Test Cases

**Example - User Registration**:
```
Test Case ID: TC-USER-001
Title: Register new EV Owner
Preconditions: None
Steps:
  1. POST /api/v1/users/register
  2. Provide valid email, password, role=EV_OWNER
Expected Result:
  - Status 201 Created
  - User created in database
  - JWT token returned
```

### 7.3 Testing Tools
- Jest / Mocha / JUnit
- Postman / Insomnia
- Cypress / Selenium (E2E)

---

## 🐳 8. Deployment

### 8.1 Docker Setup
**docker-compose.yml** có:
- 9 microservices
- PostgreSQL, MongoDB, Redis, RabbitMQ
- API Gateway
- Frontend

### 8.2 Deployment Steps
```powershell
# Clone repository
git clone https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners.git

# Navigate to project
cd Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners

# Create .env file
# (copy from .env.example)

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 8.3 Environment Variables
*(List all required environment variables)*

### 8.4 Health Checks
```
GET /health - Each service must implement
```

---

## 📊 9. Monitoring & Logging (Optional)

### 9.1 Metrics
- Request rate
- Error rate
- Response time
- Service health

### 9.2 Logging
- Centralized logging (ELK Stack)
- Log levels: ERROR, WARN, INFO, DEBUG
- Correlation IDs for tracing

---

## 🔒 10. Security

### 10.1 Authentication
- JWT tokens (expires in 24h)
- Refresh tokens
- Password hashing (bcrypt)

### 10.2 Authorization
- Role-based access control (RBAC)
- EV_OWNER, BUYER, CVA, ADMIN

### 10.3 Data Protection
- HTTPS/TLS
- Input validation
- SQL injection prevention
- XSS protection

---

## 📝 11. User Manual

### 11.1 For EV Owner
**Đăng ký**:
1. Vào trang chủ
2. Click "Register"
3. Chọn role "EV Owner"
4. Điền thông tin
5. Click "Sign Up"

**Upload trip data**:
1. Login
2. Vào "My Vehicles"
3. Click "Add Vehicle"
4. Upload CSV file với format:
   ```
   date,distance_km,energy_kwh
   2024-01-01,50,10
   ```

*(Tiếp tục với screenshots...)*

### 11.2 For Buyer
*(Tương tự)*

### 11.3 For CVA
*(Tương tự)*

### 11.4 For Admin
*(Tương tự)*

---

## 🐛 12. Troubleshooting

### Issue: Cannot login
**Solution**: Check if user exists, password correct, JWT secret configured

### Issue: Docker container won't start
**Solution**: Check logs with `docker-compose logs <service>`

---

## 📚 13. References

- [Project Repository](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners)
- [TODOLIST.md](./TODOLIST.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## ✅ 14. Checklist Hoàn thành

- [ ] Project overview written
- [ ] All actors documented
- [ ] Architecture diagram included
- [ ] Database schema documented
- [ ] All API endpoints documented
- [ ] Business flows explained
- [ ] Testing strategy defined
- [ ] Deployment guide complete
- [ ] User manual with screenshots
- [ ] Troubleshooting section

---

**Tài liệu này PHẢI có trên Confluence trước 18/11/2025!** 📚

---

## 💡 Tips viết Confluence

1. **Use templates** - Confluence có sẵn templates
2. **Add diagrams** - Draw.io, Lucidchart
3. **Screenshots** - Dùng Snagit, Lightshot
4. **Code blocks** - Syntax highlighting
5. **Tables** - Organize information
6. **Links** - Cross-reference pages
7. **Labels** - Tag pages for search
8. **Page hierarchy** - Parent/child structure
9. **Collaborate** - Invite team members
10. **Version control** - Confluence auto-saves versions

Good luck! 🚀
