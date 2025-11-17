# 📋 TODOLIST - Carbon Credit Trading Platform

## ⏰ Timeline: 31/10/2025 - 18/11/2025 (19 ngày)

---

## 🎯 Phase 1: Setup & Planning (31/10 - 03/11) - 4 ngày

### Week 1 - Sprint 1

#### 1️⃣ Project Setup & Infrastructure
- [ ] **[SETUP-01]** Tạo repository structure cho microservices
  - [ ] Tạo folders cho 9 services
  - [ ] Setup Git workflow (branch strategy: main, develop, feature/*)
  - [ ] Configure .gitignore
  - **Assignee**: Team Lead
  - **Priority**: HIGH
  - **Deadline**: 31/10

- [ ] **[SETUP-02]** Setup Docker environment
  - [ ] Viết Dockerfile cho từng service
  - [ ] Tạo docker-compose.yml cho local development
  - [ ] Configure network & volumes
  - **Assignee**: DevOps Engineer
  - **Priority**: HIGH
  - **Deadline**: 01/11

- [ ] **[SETUP-03]** Setup API Gateway
  - [ ] Cấu hình Nginx/Kong
  - [ ] Setup routing rules
  - [ ] Configure CORS
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 02/11

#### 2️⃣ Documentation (Confluence/Wiki) - BẮT BUỘC
- [ ] **[DOC-01]** Viết System Architecture Document
  - [ ] Microservices diagram
  - [ ] Database schema design
  - [ ] API flow diagrams
  - [ ] Technology stack
  - **Assignee**: Team Lead + All
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 02/11

- [ ] **[DOC-02]** Viết Business Requirements Document
  - [ ] User stories cho 4 actors
  - [ ] Use case diagrams
  - [ ] Business flow
  - **Assignee**: Business Analyst
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 02/11

- [ ] **[DOC-03]** Viết API Documentation Template
  - [ ] REST API standards
  - [ ] Request/Response format
  - [ ] Error handling
  - **Assignee**: Backend Developer 1
  - **Priority**: MEDIUM
  - **Deadline**: 03/11

#### 3️⃣ Database Design
- [ ] **[DB-01]** Thiết kế Database Schema cho User Service
  - [ ] Users table
  - [ ] Roles & Permissions
  - [ ] Authentication tokens
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 02/11

- [ ] **[DB-02]** Thiết kế Database Schema cho EV Data Service
  - [ ] Vehicles table
  - [ ] Trip/Journey data
  - [ ] CO2 calculation data
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 02/11

- [ ] **[DB-03]** Thiết kế Database Schema cho Carbon Credit Service
  - [ ] Carbon credits/wallet
  - [ ] Credit transactions
  - [ ] Verification status
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 02/11

- [ ] **[DB-04]** Thiết kế Database Schema cho Marketplace & Payment
  - [ ] Listings (fixed price/auction)
  - [ ] Orders & Transactions
  - [ ] Payment records
  - **Assignee**: Backend Developer 4
  - **Priority**: HIGH
  - **Deadline**: 03/11

#### 4️⃣ Planning & Task Management
- [ ] **[PLAN-01]** Setup GitHub Projects
  - [ ] Tạo board: Todo, In Progress, Review, Done
  - [ ] Tạo tất cả Issues từ todolist này
  - [ ] Assign labels (feature, bug, docs, etc.)
  - **Assignee**: Team Lead
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 31/10

- [ ] **[PLAN-02]** Setup Sprint Planning
  - [ ] Sprint 1: 31/10-06/11 (Setup & Core)
  - [ ] Sprint 2: 07/11-13/11 (Features & Integration)
  - [ ] Sprint 3: 14/11-18/11 (Testing & Deployment)
  - **Assignee**: Team Lead
  - **Priority**: HIGH
  - **Deadline**: 31/10

---

## 🔧 Phase 2: Core Services Development (04/11 - 10/11) - 7 ngày

### Week 2 - Sprint 2

#### 5️⃣ User Service (Authentication & Authorization)
- [ ] **[USER-01]** Implement User Registration
  - [ ] API: POST /api/users/register
  - [ ] Validation & password hashing
  - [ ] Email verification (optional)
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 05/11

- [ ] **[USER-02]** Implement Login & JWT
  - [ ] API: POST /api/users/login
  - [ ] JWT token generation
  - [ ] Refresh token mechanism
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 05/11

- [ ] **[USER-03]** Implement Role-based Access Control (RBAC)
  - [ ] Middleware cho EV Owner, Buyer, CVA, Admin
  - [ ] Permission checking
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 06/11

- [ ] **[USER-04]** User Profile Management
  - [ ] API: GET/PUT /api/users/profile
  - [ ] Update user info
  - **Assignee**: Backend Developer 1
  - **Priority**: MEDIUM
  - **Deadline**: 07/11

#### 6️⃣ EV Data Service
- [ ] **[EV-01]** Implement Vehicle Registration
  - [ ] API: POST /api/vehicles
  - [ ] Link vehicle to user
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 05/11

- [ ] **[EV-02]** Import Trip Data (from file)
  - [ ] API: POST /api/vehicles/{id}/trips
  - [ ] Parse CSV/JSON file
  - [ ] Store trip data
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 06/11

- [ ] **[EV-03]** Calculate CO2 Reduction
  - [ ] Implement calculation algorithm
  - [ ] API: GET /api/vehicles/{id}/co2-savings
  - [ ] Compare with gasoline car baseline
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 07/11

- [ ] **[EV-04]** Convert CO2 to Carbon Credits
  - [ ] API: POST /api/vehicles/{id}/generate-credits
  - [ ] Conversion rate logic
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 08/11

#### 7️⃣ Carbon Credit Service
- [ ] **[CC-01]** Implement Carbon Wallet
  - [ ] API: GET /api/wallet/{userId}
  - [ ] Balance tracking
  - [ ] Transaction history
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 06/11

- [ ] **[CC-02]** Create Credit Request (for verification)
  - [ ] API: POST /api/credits/request
  - [ ] Submit to CVA for approval
  - [ ] Status: PENDING, APPROVED, REJECTED
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 07/11

- [ ] **[CC-03]** Credit Issuance (after CVA approval)
  - [ ] API: POST /api/credits/issue
  - [ ] Add credits to wallet
  - [ ] Generate certificate
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 08/11

#### 8️⃣ Verification Service (CVA)
- [ ] **[CVA-01]** Review Credit Requests
  - [ ] API: GET /api/verification/requests
  - [ ] List pending requests
  - **Assignee**: Backend Developer 4
  - **Priority**: HIGH
  - **Deadline**: 07/11

- [ ] **[CVA-02]** Approve/Reject Credits
  - [ ] API: POST /api/verification/approve/{requestId}
  - [ ] API: POST /api/verification/reject/{requestId}
  - [ ] Notify EV Owner
  - **Assignee**: Backend Developer 4
  - **Priority**: HIGH
  - **Deadline**: 08/11

- [ ] **[CVA-03]** Generate Verification Report
  - [ ] API: GET /api/verification/report/{requestId}
  - [ ] PDF export
  - **Assignee**: Backend Developer 4
  - **Priority**: MEDIUM
  - **Deadline**: 09/11

#### 9️⃣ Marketplace Service
- [ ] **[MKT-01]** List Credits for Sale (Fixed Price)
  - [ ] API: POST /api/marketplace/listings
  - [ ] Set price & quantity
  - **Assignee**: Backend Developer 1
  - **Priority**: HIGH
  - **Deadline**: 08/11

- [ ] **[MKT-02]** List Credits for Auction
  - [ ] API: POST /api/marketplace/auctions
  - [ ] Starting price, end time
  - **Assignee**: Backend Developer 1
  - **Priority**: MEDIUM
  - **Deadline**: 09/11

- [ ] **[MKT-03]** Browse & Search Listings
  - [ ] API: GET /api/marketplace/listings
  - [ ] Filter: price, quantity, location
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 08/11

- [ ] **[MKT-04]** Buy Credits (Direct Purchase)
  - [ ] API: POST /api/marketplace/buy/{listingId}
  - [ ] Create order
  - **Assignee**: Backend Developer 2
  - **Priority**: HIGH
  - **Deadline**: 09/11

- [ ] **[MKT-05]** Place Bid (Auction)
  - [ ] API: POST /api/marketplace/auctions/{id}/bid
  - [ ] Track highest bid
  - **Assignee**: Backend Developer 2
  - **Priority**: MEDIUM
  - **Deadline**: 10/11

- [ ] **[MKT-06]** Manage Listings (Cancel/Update)
  - [ ] API: PUT/DELETE /api/marketplace/listings/{id}
  - **Assignee**: Backend Developer 1
  - **Priority**: MEDIUM
  - **Deadline**: 10/11

#### 🔟 Payment Service
- [ ] **[PAY-01]** Process Payment
  - [ ] API: POST /api/payments/process
  - [ ] Mock payment gateway (Stripe/VNPay)
  - [ ] Update wallet balances
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 09/11

- [ ] **[PAY-02]** Withdrawal Request
  - [ ] API: POST /api/payments/withdraw
  - [ ] Transfer credits → money
  - **Assignee**: Backend Developer 3
  - **Priority**: HIGH
  - **Deadline**: 10/11

- [ ] **[PAY-03]** Payment History
  - [ ] API: GET /api/payments/history
  - **Assignee**: Backend Developer 3
  - **Priority**: MEDIUM
  - **Deadline**: 10/11

---

## 🚀 Phase 3: Advanced Features & Frontend (11/11 - 14/11) - 4 ngày

#### 1️⃣1️⃣ Reporting Service
- [ ] **[RPT-01]** Personal Dashboard (EV Owner)
  - [ ] API: GET /api/reports/personal
  - [ ] Total CO2 saved, credits earned, revenue
  - **Assignee**: Backend Developer 4
  - **Priority**: HIGH
  - **Deadline**: 11/11

- [ ] **[RPT-02]** Admin Dashboard
  - [ ] API: GET /api/reports/admin
  - [ ] Total transactions, users, credits traded
  - **Assignee**: Backend Developer 4
  - **Priority**: HIGH
  - **Deadline**: 12/11

- [ ] **[RPT-03]** Transaction Reports
  - [ ] API: GET /api/reports/transactions
  - [ ] Export CSV/PDF
  - **Assignee**: Backend Developer 4
  - **Priority**: MEDIUM
  - **Deadline**: 13/11

#### 1️⃣2️⃣ AI Service (Price Suggestion)
- [ ] **[AI-01]** Price Prediction Model (Simple)
  - [ ] API: GET /api/ai/suggest-price
  - [ ] Based on: supply, demand, history
  - [ ] Can use simple average/median for MVP
  - **Assignee**: Backend Developer 2 or 3
  - **Priority**: LOW (Nice to have)
  - **Deadline**: 14/11

#### 1️⃣3️⃣ Notification Service
- [ ] **[NOTIF-01]** Email Notifications
  - [ ] Credit approved/rejected
  - [ ] Sale completed
  - [ ] Payment received
  - **Assignee**: Backend Developer 1
  - **Priority**: MEDIUM
  - **Deadline**: 12/11

- [ ] **[NOTIF-02]** In-app Notifications
  - [ ] API: GET /api/notifications
  - [ ] WebSocket for real-time (optional)
  - **Assignee**: Backend Developer 1
  - **Priority**: LOW
  - **Deadline**: 13/11

#### 1️⃣4️⃣ Frontend Development
- [ ] **[FE-01]** Setup Frontend Project (React/Vue)
  - [ ] Create project structure
  - [ ] Setup routing
  - [ ] Configure API client (Axios)
  - **Assignee**: Frontend Developer
  - **Priority**: HIGH
  - **Deadline**: 05/11

- [ ] **[FE-02]** Login & Registration Pages
  - [ ] Login form
  - [ ] Register form (4 roles)
  - **Assignee**: Frontend Developer
  - **Priority**: HIGH
  - **Deadline**: 06/11

- [ ] **[FE-03]** EV Owner Dashboard
  - [ ] Upload trip data
  - [ ] View CO2 savings
  - [ ] Carbon wallet
  - [ ] Create listing
  - **Assignee**: Frontend Developer
  - **Priority**: HIGH
  - **Deadline**: 09/11

- [ ] **[FE-04]** Marketplace Page (Buyer)
  - [ ] Browse listings
  - [ ] Search & filter
  - [ ] Buy credits
  - **Assignee**: Frontend Developer
  - **Priority**: HIGH
  - **Deadline**: 10/11

- [ ] **[FE-05]** CVA Dashboard
  - [ ] Review requests
  - [ ] Approve/reject
  - **Assignee**: Frontend Developer
  - **Priority**: MEDIUM
  - **Deadline**: 11/11

- [ ] **[FE-06]** Admin Dashboard
  - [ ] User management
  - [ ] Transaction monitoring
  - [ ] Reports
  - **Assignee**: Frontend Developer
  - **Priority**: MEDIUM
  - **Deadline**: 12/11

- [ ] **[FE-07]** Payment & Transaction Pages
  - [ ] Checkout page
  - [ ] Payment history
  - [ ] Withdrawal page
  - **Assignee**: Frontend Developer
  - **Priority**: HIGH
  - **Deadline**: 13/11

#### 1️⃣5️⃣ Service Integration
- [ ] **[INT-01]** Connect Frontend to Backend
  - [ ] API integration
  - [ ] Error handling
  - [ ] Loading states
  - **Assignee**: Frontend + Backend
  - **Priority**: HIGH
  - **Deadline**: 13/11

- [ ] **[INT-02]** Microservices Communication
  - [ ] Setup message queue (RabbitMQ)
  - [ ] Inter-service communication
  - [ ] Event-driven architecture
  - **Assignee**: Backend Team
  - **Priority**: HIGH
  - **Deadline**: 12/11

---

## 🧪 Phase 4: Testing & Deployment (15/11 - 18/11) - 4 ngày

#### 1️⃣6️⃣ Testing
- [ ] **[TEST-01]** Unit Testing
  - [ ] Backend services: 70% coverage
  - [ ] Frontend components
  - **Assignee**: All Developers
  - **Priority**: HIGH
  - **Deadline**: 16/11

- [ ] **[TEST-02]** Integration Testing
  - [ ] API endpoints
  - [ ] Microservices communication
  - **Assignee**: Backend Team
  - **Priority**: HIGH
  - **Deadline**: 16/11

- [ ] **[TEST-03]** End-to-End Testing
  - [ ] Complete user flows
  - [ ] All 4 actors scenarios
  - **Assignee**: QA/All Team
  - **Priority**: HIGH
  - **Deadline**: 17/11

- [ ] **[TEST-04]** Bug Fixing
  - [ ] Fix issues from testing
  - [ ] Code review
  - **Assignee**: All Developers
  - **Priority**: HIGH
  - **Deadline**: 17/11

#### 1️⃣7️⃣ Documentation (Final) - BẮT BUỘC
- [ ] **[DOC-04]** Complete API Documentation
  - [ ] All endpoints documented
  - [ ] Request/Response examples
  - [ ] Postman collection
  - **Assignee**: Backend Team
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 16/11

- [ ] **[DOC-05]** User Manual
  - [ ] How to use for each actor
  - [ ] Screenshots
  - **Assignee**: Frontend Developer
  - **Priority**: MEDIUM
  - **Deadline**: 17/11

- [ ] **[DOC-06]** Deployment Guide
  - [ ] Docker setup
  - [ ] Environment variables
  - [ ] Troubleshooting
  - **Assignee**: DevOps
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 17/11

- [ ] **[DOC-07]** Technical Documentation (Confluence)
  - [ ] Architecture overview
  - [ ] Database schema
  - [ ] API design
  - [ ] Sequence diagrams
  - **Assignee**: Team Lead + All
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 18/11

#### 1️⃣8️⃣ Deployment
- [ ] **[DEPLOY-01]** Docker Compose Setup
  - [ ] All services containerized
  - [ ] docker-compose.yml tested
  - **Assignee**: DevOps
  - **Priority**: HIGH
  - **Deadline**: 17/11

- [ ] **[DEPLOY-02]** Deploy to Server (Optional)
  - [ ] AWS/GCP/Azure
  - [ ] Or local demo
  - **Assignee**: DevOps
  - **Priority**: LOW
  - **Deadline**: 18/11

- [ ] **[DEPLOY-03]** Demo Preparation
  - [ ] Seed data
  - [ ] Demo script
  - [ ] Presentation slides
  - **Assignee**: All Team
  - **Priority**: HIGH
  - **Deadline**: 18/11

#### 1️⃣9️⃣ Final Review
- [ ] **[FINAL-01]** Code Review
  - [ ] Review all code
  - [ ] Refactoring
  - **Assignee**: All Team
  - **Priority**: HIGH
  - **Deadline**: 17/11

- [ ] **[FINAL-02]** Documentation Review
  - [ ] Check all docs complete
  - [ ] Update README
  - **Assignee**: Team Lead
  - **Priority**: HIGH (BẮT BUỘC)
  - **Deadline**: 18/11

- [ ] **[FINAL-03]** Git Repository Cleanup
  - [ ] Merge all branches
  - [ ] Tag release v1.0.0
  - [ ] Clean commit history
  - **Assignee**: Team Lead
  - **Priority**: HIGH
  - **Deadline**: 18/11

---

## 📊 Phân chia Công việc (4-5 người)

### **Thành viên 1: Team Lead + Backend Developer**
- User Service
- Marketplace Service (partial)
- Notification Service
- Project management & documentation

### **Thành viên 2: Backend Developer**
- EV Data Service
- AI Service
- Marketplace Service (partial)

### **Thành viên 3: Backend Developer**
- Carbon Credit Service
- Payment Service

### **Thành viên 4: Backend Developer**
- Verification Service
- Reporting Service
- Admin features

### **Thành viên 5: Frontend Developer (hoặc Full-stack)**
- Frontend development
- UI/UX
- Frontend documentation

**Lưu ý**: DevOps tasks sẽ được phân bổ cho người có kinh nghiệm nhất về Docker.

---

## ⚠️ Rủi ro & Giải pháp

### Rủi ro cao:
1. **Microservices phức tạp** → Start simple, không cần tất cả services
2. **Thiếu thời gian** → Focus core features, cắt bớt features không quan trọng
3. **Docker issues** → Prepare backup plan với monolith

### MVP Features (Priority cao):
- User authentication
- EV data import & CO2 calculation
- Carbon credit wallet
- Simple marketplace (fixed price only)
- Basic payment
- CVA verification
- Simple reports

### Optional Features (có thể skip):
- Auction
- AI price suggestion
- Real-time notifications
- Advanced analytics
- Email notifications

---

## ✅ Definition of Done

Mỗi task được coi là "Done" khi:
- [ ] Code written & tested
- [ ] Unit tests passed
- [ ] Code reviewed
- [ ] API documented
- [ ] Merged to develop branch
- [ ] Updated in GitHub Projects

---

## 🎓 Checklist Cuối cùng (18/11/2025)

- [ ] ✅ GitHub repository với toàn bộ source code
- [ ] ✅ Docker & docker-compose.yml hoạt động
- [ ] ✅ Tài liệu Confluence/Wiki đầy đủ
- [ ] ✅ README.md chi tiết
- [ ] ✅ API documentation
- [ ] ✅ Demo video/slides
- [ ] ✅ Tất cả 4 actors có thể sử dụng hệ thống
- [ ] ✅ GitHub Issues/Projects đầy đủ

---

**Deadline cuối cùng: 18/11/2025** ⏰

Good luck! 🚀
