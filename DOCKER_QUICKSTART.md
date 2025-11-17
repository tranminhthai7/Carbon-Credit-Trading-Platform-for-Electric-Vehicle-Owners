# 🐳 Docker Quick Start Guide

## 🚀 Chạy TẤT CẢ Services với 1 lệnh duy nhất!

### ⚡ Quick Start (30 giây)

```powershell
# Bước 1: Start tất cả services
docker-compose up -d

# Bước 2: Xem logs để check
docker-compose logs -f

# Bước 3: Truy cập ứng dụng
# Frontend: http://localhost:5173
# API Gateway: http://localhost:8000
```

---

## 📦 Services được start:

### **Databases:**
- ✅ PostgreSQL (port 5432-5436) - 5 databases
- ✅ MongoDB (port 27017) - 2 databases  
- ✅ Redis (port 6379) - Queue system

### **Microservices:**
- ✅ User Service (3001)
- ✅ EV Data Service (3002)
- ✅ Carbon Credit Service (3003)
- ✅ Marketplace Service (3004)
- ✅ Payment Service (3005)
- ✅ Verification Service (3006)
- ✅ Notification Service (3007)
- ✅ Reporting Service (3008)
- ✅ AI Service (3009) - Optional

### **Gateway & Frontend:**
- ✅ API Gateway (8000) - Express proxy
- ✅ Frontend (5173) - React + Vite

**TỔNG: 11 services + 3 databases = 14 containers**

---

## 📝 Các lệnh thường dùng:

### Start Services
```powershell
# Start tất cả
docker-compose up -d

# Start + rebuild (khi code thay đổi)
docker-compose up -d --build

# Start chỉ databases
docker-compose up -d user-db carbon-db marketplace-db payment-db verification-db ev-mongodb reporting-mongodb redis
```

### Stop Services
```powershell
# Stop tất cả
docker-compose down

# Stop + xóa volumes (reset DB)
docker-compose down -v

# Stop 1 service
docker-compose stop user-service
```

### Logs & Monitoring
```powershell
# Xem logs tất cả services
docker-compose logs -f

# Xem logs 1 service cụ thể
docker-compose logs -f user-service
docker-compose logs -f api-gateway

# Xem logs cuối 100 dòng
docker-compose logs --tail=100 user-service

# Kiểm tra status
docker-compose ps
```

### Restart Services
```powershell
# Restart 1 service
docker-compose restart user-service

# Restart tất cả
docker-compose restart
```

### Exec vào container
```powershell
# Vào bash của service
docker-compose exec user-service sh

# Chạy lệnh trong container
docker-compose exec user-service npm run test
```

---

## 🔧 Troubleshooting

### Lỗi: Port đã được sử dụng
```powershell
# Kiểm tra port nào đang dùng
netstat -ano | findstr :5432
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F

# Hoặc đổi port trong docker-compose.yml
ports:
  - "5433:5432"  # External:Internal
```

### Lỗi: Service không start
```powershell
# Xem logs chi tiết
docker-compose logs user-service

# Rebuild service
docker-compose up -d --build user-service

# Xóa và tạo lại
docker-compose rm -f user-service
docker-compose up -d user-service
```

### Lỗi: Database connection failed
```powershell
# Kiểm tra database có chạy không
docker-compose ps user-db

# Restart database
docker-compose restart user-db

# Kiểm tra logs
docker-compose logs user-db
```

### Reset toàn bộ (Cẩn thận: Mất hết data!)
```powershell
# Stop và xóa tất cả
docker-compose down -v --remove-orphans

# Xóa images (optional)
docker-compose down --rmi all

# Rebuild từ đầu
docker-compose up -d --build
```

---

## 🎯 Development Workflow

### 1. Sáng vào làm việc
```powershell
# Start tất cả services
docker-compose up -d

# Xem logs để check
docker-compose logs -f
```

### 2. Khi sửa code
```powershell
# Nếu chỉ sửa code (có hot-reload)
# → Không cần làm gì, code tự reload

# Nếu thêm dependencies (npm install)
docker-compose restart user-service

# Nếu sửa Dockerfile
docker-compose up -d --build user-service
```

### 3. Test API
```powershell
# Qua API Gateway
curl http://localhost:8000/api/users

# Trực tiếp service
curl http://localhost:3001/api/users
```

### 4. Tối về nhà
```powershell
# Stop tất cả (giữ data)
docker-compose stop

# Hoặc chạy tiếp ngày mai
# → Không cần stop, để chạy qua đêm
```

---

## 📊 Health Checks

### Check tất cả services
```powershell
# API Gateway
curl http://localhost:8000/health

# User Service
curl http://localhost:3001/health

# EV Data Service
curl http://localhost:3002/health

# Carbon Credit Service
curl http://localhost:3003/health

# Marketplace Service
curl http://localhost:3004/health

# Payment Service
curl http://localhost:3005/health

# Verification Service
curl http://localhost:3006/health

# Notification Service  
curl http://localhost:3007/health

# Reporting Service
curl http://localhost:3008/health
```

---

## 💡 Tips & Best Practices

### 1. Development Mode
```yaml
# Trong docker-compose.yml đã có:
volumes:
  - ./services/user-service:/app  # Code sync
  - /app/node_modules             # Isolated dependencies
```
→ Sửa code trên máy local, tự động sync vào container!

### 2. Environment Variables
```powershell
# Tạo file .env ở root project
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
NODE_ENV=development
```

### 3. Resource Limits
```yaml
# Thêm vào service cần limit:
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

### 4. Logging
```powershell
# Giới hạn log size
docker-compose logs --tail=100 -f

# Export logs ra file
docker-compose logs > logs.txt
```

---

## 🎓 Ví dụ Use Cases

### Use Case 1: Start development environment
```powershell
docker-compose up -d
code .
# Open http://localhost:5173
```

### Use Case 2: Test một service riêng
```powershell
# Start chỉ service đó + dependencies
docker-compose up -d user-db redis
docker-compose up -d user-service
```

### Use Case 3: Debug service
```powershell
# Stop service
docker-compose stop user-service

# Chạy local để debug
cd services/user-service
npm run dev
```

### Use Case 4: Production deployment
```powershell
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📌 Summary

**1 LỆNH CHẠY TẤT CẢ:**
```powershell
docker-compose up -d
```

**Sau đó truy cập:**
- Frontend: http://localhost:5173
- API: http://localhost:8000

**Done! 🎉**

---

## 🆘 Need Help?

```powershell
# Docker Compose help
docker-compose --help

# Service-specific help
docker-compose logs <service-name>
docker-compose exec <service-name> sh
```
