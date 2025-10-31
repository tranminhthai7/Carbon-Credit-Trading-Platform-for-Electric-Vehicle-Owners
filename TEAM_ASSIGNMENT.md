# 👥 PHÂN CÔNG CÔNG VIỆC - TEAM 5 NGƯỜI

**Dự án:** Carbon Credit Trading Platform for Electric Vehicle Owners  
**Thời gian:** 31/10/2025 - 18/11/2025 (19 ngày)  
**Deadline:** 18/11/2025

---

## 📋 SPRINT 1: SETUP & CORE (31/10 - 06/11)

### 👨‍💼 **TEAM LEAD (BẠN)**

#### ✅ **Issue #1: [SETUP-01] Tạo Repository Structure**
- **Assignee:** `@your-github-username`
- **Timeline:** 31/10 - 02/11 (2 ngày)
- **Tasks:**
  - [ ] Tạo folder structure cho 9 services
  - [ ] Tạo folder frontend, api-gateway, docs, scripts
  - [ ] Setup .gitignore
  - [ ] Tạo README.md cho mỗi service
  - [ ] Setup .env.example
  - [ ] Push lên GitHub

#### ✅ **Issue #2: [SETUP-02] Setup Docker Environment**
- **Assignee:** `@your-github-username`
- **Timeline:** 31/10 - 03/11 (3 ngày)
- **Tasks:**
  - [ ] Viết docker-compose.yml (6 PostgreSQL + 2 MongoDB + Redis + RabbitMQ)
  - [ ] Viết Dockerfile cho từng service
  - [ ] Test `docker-compose up` thành công
  - [ ] Setup volumes và networks
  - [ ] Viết hướng dẫn chạy Docker

#### ✅ **Issue #3: [DOC-01] Viết Confluence Documentation (BẮT BUỘC)**
- **Assignee:** `@your-github-username` (Lead) + All team review
- **Timeline:** 01/11 - 04/11 (3 ngày)
- **Tasks:**
  - [ ] System Overview (bạn viết)
  - [ ] Architecture Design (bạn viết)
  - [ ] API Documentation (team hỗ trợ)
  - [ ] Database Design (team hỗ trợ)
  - [ ] Security Architecture (bạn viết)
  - [ ] Deployment Guide (bạn viết)
  - [ ] Review và publish

#### ✅ **Issue #4: [USER-01] User Registration API**
- **Assignee:** `@your-github-username`
- **Timeline:** 03/11 - 06/11 (3 ngày)
- **Tasks:**
  - [ ] Setup User Service (Node.js + TypeScript)
  - [ ] API register, login, logout
  - [ ] JWT authentication
  - [ ] Bcrypt password hashing
  - [ ] PostgreSQL schema: users, user_profiles
  - [ ] Unit tests (70% coverage)
  - [ ] Swagger documentation

---

### 👨‍💻 **BACKEND DEVELOPER 1**

#### ✅ **Issue #5: [EV-01] Implement Vehicle Registration**
- **Assignee:** `@backend-dev-1-username`
- **Timeline:** 07/11 - 09/11 (2 ngày)
- **Tasks:**
  - [ ] Setup EV Data Service (Node.js + MongoDB)
  - [ ] API: POST/GET/PUT/DELETE /vehicles
  - [ ] API: POST/GET /vehicles/:id/trips
  - [ ] MongoDB schema: vehicles, trips
  - [ ] Unit tests
  - [ ] Integration với User Service

#### ✅ **Issue #6: [EV-03] Calculate CO2 Reduction**
- **Assignee:** `@backend-dev-1-username`
- **Timeline:** 08/11 - 10/11 (2 ngày)
- **Tasks:**
  - [ ] Viết logic tính CO2: (120-20) × distance_km / 1000
  - [ ] API: POST /calculate/co2
  - [ ] API: POST /calculate/credits
  - [ ] Convert CO2 → Carbon Credits
  - [ ] Unit tests với sample data
  - [ ] Documentation

#### ✅ **Issue #7: [CC-01] Implement Carbon Wallet**
- **Assignee:** `@backend-dev-1-username`
- **Timeline:** 09/11 - 11/11 (2 ngày)
- **Tasks:**
  - [ ] Setup Carbon Credit Service (Node.js + PostgreSQL)
  - [ ] API: Wallet CRUD
  - [ ] API: Mint/Transfer/Burn credits
  - [ ] PostgreSQL schema: carbon_wallets, carbon_transactions
  - [ ] ACID transaction handling
  - [ ] Unit tests (80% coverage)

#### ✅ **Issue #11: [AI-01] AI Prediction Service**
- **Assignee:** `@backend-dev-1-username`
- **Timeline:** 11/11 - 13/11 (2 ngày)
- **Tasks:**
  - [ ] Setup AI Service (Python + FastAPI)
  - [ ] API: POST /predict/carbon-credits
  - [ ] Load ML model (TensorFlow/scikit-learn)
  - [ ] Input validation
  - [ ] Unit tests (pytest)

---

### 👨‍💻 **BACKEND DEVELOPER 2**

#### ✅ **Issue #12: [VER-01] Verification Service**
- **Assignee:** `@backend-dev-2-username`
- **Timeline:** 31/10 - 02/11 (2 ngày)
- **Tasks:**
  - [ ] Setup Verification Service (Node.js + PostgreSQL)
  - [ ] API: POST /kyc/submit
  - [ ] API: GET /kyc/status/:userId
  - [ ] API: POST /credits/verify
  - [ ] PostgreSQL schema: kyc_submissions
  - [ ] Unit tests

#### ✅ **Issue #13: [NOTIF-01] Notification Service**
- **Assignee:** `@backend-dev-2-username`
- **Timeline:** 03/11 - 04/11 (1 ngày)
- **Tasks:**
  - [ ] Setup Notification Service (Node.js + Redis)
  - [ ] API: POST /notifications/email
  - [ ] Redis queue cho async sending
  - [ ] Email templates
  - [ ] Unit tests

#### ✅ **Issue #14: [REPORT-01] Reporting Service**
- **Assignee:** `@backend-dev-2-username`
- **Timeline:** 05/11 - 06/11 (1 ngày)
- **Tasks:**
  - [ ] Setup Reporting Service (Node.js + MongoDB)
  - [ ] API: GET /reports/analytics
  - [ ] API: GET /reports/users/:id
  - [ ] Aggregate data từ services khác
  - [ ] Unit tests

---

### 👨‍💻 **BACKEND DEVELOPER 3**

#### ✅ **Issue #8: [MKT-01] Marketplace Service**
- **Assignee:** `@backend-dev-3-username`
- **Timeline:** 10/11 - 13/11 (3 ngày)
- **Tasks:**
  - [ ] Setup Marketplace Service (Node.js + PostgreSQL)
  - [ ] API: Listings CRUD (POST/GET/PUT/DELETE /listings)
  - [ ] API: POST /listings/:id/purchase
  - [ ] API: GET /listings/search
  - [ ] PostgreSQL schema: listings, orders, reviews
  - [ ] Business logic: transaction fee 2.5%
  - [ ] Unit tests

#### ✅ **Issue #15: [PAY-01] Payment Service**
- **Assignee:** `@backend-dev-3-username`
- **Timeline:** 07/11 - 10/11 (3 ngày)
- **Tasks:**
  - [ ] Setup Payment Service (Node.js + PostgreSQL)
  - [ ] API: POST /payments/process
  - [ ] API: GET /payments/history
  - [ ] API: POST /payments/refund
  - [ ] Integration Stripe/PayPal mock
  - [ ] Escrow logic
  - [ ] Unit tests

---

### 👩‍💻 **FRONTEND DEVELOPER**

#### ✅ **Issue #9: [FE-01] Setup Frontend Project**
- **Assignee:** `@frontend-dev-username`
- **Timeline:** 14/11 - 16/11 (2 ngày)
- **Tasks:**
  - [ ] Setup React + TypeScript + Vite
  - [ ] Install: react-router-dom, redux, axios, material-ui
  - [ ] Setup folder structure
  - [ ] Setup Redux store
  - [ ] Setup axios instance với JWT interceptor
  - [ ] Viết 9 pages:
    - [ ] Login/Register
    - [ ] Dashboard
    - [ ] Vehicle Management
    - [ ] Carbon Wallet
    - [ ] Marketplace
    - [ ] Order History
    - [ ] Profile
    - [ ] Analytics
    - [ ] Landing Page
  - [ ] Responsive design
  - [ ] API integration với backend

#### ✅ **Issue #10: [TEST-01] Unit Testing**
- **Assignee:** `@frontend-dev-username` + All team
- **Timeline:** 16/11 - 18/11 (2 ngày)
- **Tasks:**
  - [ ] Unit tests cho 9 backend services (70% coverage)
  - [ ] Integration tests
  - [ ] E2E testing toàn bộ flow
  - [ ] Bug fixing
  - [ ] Performance testing

---

## 📋 SPRINT 2: FEATURES & INTEGRATION (07/11 - 13/11)

### 👨‍💼 **TEAM LEAD (BẠN)**

#### ✅ **Issue #16: [GATEWAY-01] API Gateway**
- **Assignee:** `@your-github-username`
- **Timeline:** 07/11 - 08/11 (1 ngày)
- **Tasks:**
  - [ ] Setup API Gateway (Express/Nginx)
  - [ ] Routing đến 9 services
  - [ ] Authentication middleware
  - [ ] Rate limiting
  - [ ] CORS configuration

#### ✅ **Issue #17: [MSG-01] RabbitMQ Setup**
- **Assignee:** `@your-github-username`
- **Timeline:** 09/11 - 10/11 (1 ngày)
- **Tasks:**
  - [ ] Setup RabbitMQ trong Docker
  - [ ] Event-driven communication
  - [ ] Queue: user.created → wallet.create
  - [ ] Queue: trip.completed → co2.calculate
  - [ ] Testing message flow

#### ✅ **Issue #18: [INT-01] Service Integration**
- **Assignee:** `@your-github-username`
- **Timeline:** 11/11 - 13/11 (2 ngày)
- **Tasks:**
  - [ ] Integration testing toàn bộ services
  - [ ] Testing complete flow
  - [ ] Fix bugs
  - [ ] Performance optimization

---

## 📋 SPRINT 3: TESTING & DEPLOYMENT (14/11 - 18/11)

### 👨‍💼 **TEAM LEAD (BẠN)**

#### ✅ **Issue #19: [CICD-01] CI/CD Pipeline**
- **Assignee:** `@your-github-username`
- **Timeline:** 14/11 - 15/11 (1 ngày)
- **Tasks:**
  - [ ] Setup GitHub Actions
  - [ ] Auto run tests khi push
  - [ ] Auto build Docker images
  - [ ] Deploy to staging

#### ✅ **Issue #20: [DEPLOY-01] Production Deployment**
- **Assignee:** `@your-github-username`
- **Timeline:** 16/11 - 18/11 (2 ngày)
- **Tasks:**
  - [ ] Deploy to production
  - [ ] Setup monitoring & logging
  - [ ] Security audit
  - [ ] Load testing
  - [ ] Chuẩn bị demo
  - [ ] Viết User Manual

---

## 📊 TÓM TẮT PHÂN CÔNG

| Người | Số Issues | Services | Workload |
|-------|-----------|----------|----------|
| **Team Lead (Bạn)** | 9 issues | User + Infrastructure + DevOps | ⭐⭐⭐⭐⭐ |
| **Backend Dev 1** | 4 issues | EV + Carbon + AI | ⭐⭐⭐⭐ |
| **Backend Dev 2** | 3 issues | Verification + Notification + Reporting | ⭐⭐⭐ |
| **Backend Dev 3** | 2 issues | Marketplace + Payment | ⭐⭐⭐⭐ |
| **Frontend Dev** | 2 issues | React App + Testing | ⭐⭐⭐ |

---

## 🔗 LINKS

- **Repository:** https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
- **Project Board:** https://github.com/users/tranminhthai7/projects/2
- **Milestones:** https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/milestones

---

## ✅ HƯỚNG DẪN SỬ DỤNG FILE NÀY

### **Bước 1: Mời team members**
```
1. Vào repo: Settings → Collaborators → Add people
2. Nhập GitHub username của 4 người
3. Gửi invitation
```

### **Bước 2: Assign Issues trên GitHub**
```
1. Vào từng Issue trên GitHub
2. Click "Assignees" bên phải
3. Chọn người phụ trách
```

### **Bước 3: Thay thế placeholders**
```
Tìm và thay thế trong file này:
- @your-github-username → username thật của bạn
- @backend-dev-1-username → username thật của Backend Dev 1
- @backend-dev-2-username → username thật của Backend Dev 2
- @backend-dev-3-username → username thật của Backend Dev 3
- @frontend-dev-username → username thật của Frontend Dev
```

### **Bước 4: Share file này với team**
```
1. Commit file này lên GitHub
2. Pin file trong Discord/Slack
3. Mọi người tham khảo và check off tasks
```

---

## 📝 CHECKLIST HÀNG NGÀY

### **Daily Standup (9:00 AM):**
- [ ] Hôm qua làm gì?
- [ ] Hôm nay làm gì?
- [ ] Có vấn đề gì cần hỗ trợ?

### **Daily Tasks:**
- [ ] Code + commit thường xuyên
- [ ] Viết unit tests song song
- [ ] Update GitHub Issues
- [ ] Code review lẫn nhau

### **End of Day (5:00 PM):**
- [ ] Push code lên branch
- [ ] Update progress trên Project Board
- [ ] Communication với team

---

**Cập nhật lần cuối:** 31/10/2025
