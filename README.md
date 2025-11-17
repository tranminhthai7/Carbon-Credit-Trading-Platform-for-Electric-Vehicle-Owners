# Carbon Credit Trading Platform for Electric Vehicle Owners

## 📋 Giới thiệu Dự án
Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện - một marketplace cho phép chủ xe điện kiếm tiền từ việc giảm phát thải CO₂, và cho phép các tổ chức/cá nhân mua tín chỉ carbon để bù đắp lượng khí thải của họ.

## 👥 Thông tin Team
- **Team Size**: 4-5 sinh viên
- **Deadline**: 18/11/2025
- **Repository**: [GitHub](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners)

## 🎯 Actors & Chức năng

### 1. EV Owner (Chủ sở hữu xe điện)
- Kết nối và đồng bộ dữ liệu hành trình từ xe điện
- Tính toán lượng CO₂ giảm phát thải và quy đổi sang tín chỉ carbon
- Quản lý ví carbon
- Niêm yết tín chỉ carbon (fixed price/auction)
- Quản lý giao dịch
- Thanh toán & rút tiền
- Xem báo cáo cá nhân
- AI gợi ý giá bán

### 2. Carbon Credit Buyer (Người mua tín chỉ)
- Tìm kiếm & lọc tín chỉ
- Mua tín chỉ (direct/auction)
- Thanh toán online
- Nhận chứng nhận tín chỉ
- Quản lý lịch sử mua

### 3. Carbon Verification & Audit (CVA)
- Kiểm tra dữ liệu phát thải
- Duyệt/từ chối yêu cầu phát hành tín chỉ
- Cấp tín chỉ vào ví carbon
- Xuất báo cáo

### 4. Admin (Quản trị viên)
- Quản lý người dùng
- Quản lý giao dịch & tranh chấp
- Quản lý ví điện tử
- Tạo báo cáo tổng hợp

## 🏗️ Kiến trúc Hệ thống (Microservices)

### Core Services:
1. **User Service** - Quản lý người dùng, authentication, authorization
2. **EV Data Service** - Xử lý dữ liệu xe điện, tính toán CO₂
3. **Carbon Credit Service** - Quản lý tín chỉ carbon, ví carbon
4. **Marketplace Service** - Niêm yết, giao dịch, đấu giá
5. **Payment Service** - Xử lý thanh toán, rút tiền
6. **Verification Service** - Kiểm toán và xác minh
7. **Notification Service** - Gửi thông báo
8. **Reporting Service** - Tạo báo cáo, analytics
9. **AI Service** - Gợi ý giá bán

### Infrastructure:
- **API Gateway** - Nginx/Kong
- **Service Discovery** - Consul/Eureka
- **Message Queue** - RabbitMQ/Kafka
- **Database** - PostgreSQL (per service), MongoDB (logs)
- **Cache** - Redis
- **Docker** - Containerization
- **Docker Compose** - Local development

## 🛠️ Tech Stack Đề xuất

### Backend:
- **Language**: Java (Spring Boot) / Node.js (NestJS) / Python (FastAPI)
- **API**: REST + gRPC
- **Database**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Message Broker**: RabbitMQ

### Frontend:
- **Framework**: React.js / Vue.js
- **UI Library**: Material-UI / Ant Design

### DevOps:
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (optional)

## 📦 Yêu cầu Bắt buộc

- ✅ **Microservice Architecture** - Bắt buộc
- ✅ **Docker** - Containerize tất cả services
- ✅ **GitHub** - Quản lý mã nguồn (bắt buộc)
- ✅ **Documentation** - Confluence/Wiki (bắt buộc)
- ✅ **Planning** - GitHub Projects/Issues hoặc Jira

## 📂 Cấu trúc Dự án

```
Carbon-Credit-Trading-Platform/
├── services/
│   ├── user-service/
│   ├── ev-data-service/
│   ├── carbon-credit-service/
│   ├── marketplace-service/
│   ├── payment-service/
│   ├── verification-service/
│   ├── notification-service/
│   ├── reporting-service/
│   └── ai-service/
├── api-gateway/
├── frontend/
├── docker-compose.yml
├── docs/
│   ├── architecture/
│   ├── api/
│   └── deployment/
└── README.md
```

## 🚀 Hướng dẫn Cài đặt

### Prerequisites:
- Docker & Docker Compose
- Git
- Node.js / Java / Python (tùy tech stack)

### Clone & Run:
```bash
git clone https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners.git
cd Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
docker-compose up -d
```

## 📝 Planning & Task Management

**GitHub Issues & Projects**: [Xem Todolist](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues)

## 📊 Timeline

- **Week 1 (31/10 - 06/11)**: Setup project, thiết kế DB, viết docs
- **Week 2 (07/11 - 13/11)**: Phát triển core services, integration
- **Week 3 (14/11 - 18/11)**: Testing, deployment, hoàn thiện docs

## 📖 Documentation

- [Confluence/Wiki](link-to-confluence)
- [API Documentation](docs/api/)
- [Architecture Design](docs/architecture/)

## 🤝 Contributing

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình làm việc.

## 📧 Contact

- **Repository**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
- **Issues**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues
