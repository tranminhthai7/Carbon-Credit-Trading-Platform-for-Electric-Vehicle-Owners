# 🐳 Docker Setup Guide

## 📋 Tổng quan

Hướng dẫn setup và chạy toàn bộ hệ thống Carbon Credit Trading Platform bằng Docker.

---

## 📦 Prerequisites

### Cài đặt Docker:
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Mac**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### Verify installation:
```powershell
docker --version
# Docker version 24.0.0 or later

docker-compose --version
# Docker Compose version v2.20.0 or later
```

---

## 🏗️ Project Structure

```
Carbon-Credit-Trading-Platform/
├── docker-compose.yml              # Main orchestration file
├── .env                            # Environment variables
├── .dockerignore                   # Files to ignore
│
├── api-gateway/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ...
│
├── services/
│   ├── user-service/
│   │   ├── Dockerfile
│   │   ├── package.json (or pom.xml)
│   │   └── src/
│   │
│   ├── ev-data-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── carbon-credit-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── marketplace-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── payment-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── verification-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── notification-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   ├── reporting-service/
│   │   ├── Dockerfile
│   │   └── ...
│   │
│   └── ai-service/
│       ├── Dockerfile
│       └── ...
│
└── frontend/
    ├── Dockerfile
    └── ...
```

---

## 📝 docker-compose.yml

```yaml
version: '3.8'

services:
  # ===== Infrastructure Services =====
  
  postgres:
    image: postgres:15-alpine
    container_name: carbon-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-admin}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      POSTGRES_DB: carbon_platform
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - carbon-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  mongodb:
    image: mongo:6
    container_name: carbon-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-secret123}
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - carbon-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: carbon-redis
    ports:
      - "6379:6379"
    networks:
      - carbon-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: carbon-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-secret123}
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # Management UI
    networks:
      - carbon-network
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 10s
      timeout: 5s
      retries: 5

  # ===== API Gateway =====
  
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    container_name: carbon-api-gateway
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - user-service
      - ev-data-service
      - carbon-credit-service
      - marketplace-service
      - payment-service
      - verification-service
      - notification-service
      - reporting-service
    networks:
      - carbon-network
    restart: unless-stopped

  # ===== Microservices =====
  
  user-service:
    build:
      context: ./services/user-service
      dockerfile: Dockerfile
    container_name: carbon-user-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: user_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-change-in-production}
      JWT_EXPIRES_IN: 24h
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ev-data-service:
    build:
      context: ./services/ev-data-service
      dockerfile: Dockerfile
    container_name: carbon-ev-data-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3002
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ev_data_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
    ports:
      - "3002:3002"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  carbon-credit-service:
    build:
      context: ./services/carbon-credit-service
      dockerfile: Dockerfile
    container_name: carbon-credit-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3003
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: carbon_credit_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
    ports:
      - "3003:3003"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  marketplace-service:
    build:
      context: ./services/marketplace-service
      dockerfile: Dockerfile
    container_name: carbon-marketplace-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3004
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: marketplace_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
    ports:
      - "3004:3004"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  payment-service:
    build:
      context: ./services/payment-service
      dockerfile: Dockerfile
    container_name: carbon-payment-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3005
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: payment_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
      PAYMENT_GATEWAY_KEY: ${PAYMENT_GATEWAY_KEY:-test-key}
    ports:
      - "3005:3005"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  verification-service:
    build:
      context: ./services/verification-service
      dockerfile: Dockerfile
    container_name: carbon-verification-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3006
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: verification_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
    ports:
      - "3006:3006"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  notification-service:
    build:
      context: ./services/notification-service
      dockerfile: Dockerfile
    container_name: carbon-notification-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3007
      MONGO_HOST: mongodb
      MONGO_PORT: 27017
      MONGO_DB: notification_db
      MONGO_USER: ${MONGO_USER:-admin}
      MONGO_PASSWORD: ${MONGO_PASSWORD:-secret123}
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASSWORD:-secret123}@rabbitmq:5672
      EMAIL_SERVICE: ${EMAIL_SERVICE:-smtp}
      EMAIL_USER: ${EMAIL_USER}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
    ports:
      - "3007:3007"
    depends_on:
      mongodb:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  reporting-service:
    build:
      context: ./services/reporting-service
      dockerfile: Dockerfile
    container_name: carbon-reporting-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3008
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: reporting_db
      DB_USER: ${POSTGRES_USER:-admin}
      DB_PASSWORD: ${POSTGRES_PASSWORD:-secret123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "3008:3008"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  ai-service:
    build:
      context: ./services/ai-service
      dockerfile: Dockerfile
    container_name: carbon-ai-service
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3009
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "3009:3009"
    depends_on:
      redis:
        condition: service_healthy
    networks:
      - carbon-network
    restart: unless-stopped

  # ===== Frontend =====
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: http://localhost/api
    container_name: carbon-frontend
    ports:
      - "3000:80"
    depends_on:
      - api-gateway
    networks:
      - carbon-network
    restart: unless-stopped

# ===== Networks =====
networks:
  carbon-network:
    driver: bridge

# ===== Volumes =====
volumes:
  postgres_data:
    driver: local
  mongodb_data:
    driver: local
```

---

## 📄 .env File

Create `.env` file in root directory:

```env
# Node Environment
NODE_ENV=development

# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123

# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=secret123

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=secret123

# JWT
JWT_SECRET=change-this-to-random-string-in-production
JWT_EXPIRES_IN=24h

# Email (Optional)
EMAIL_SERVICE=smtp
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Gateway (Mock)
PAYMENT_GATEWAY_KEY=test-key-12345

# Frontend
REACT_APP_API_URL=http://localhost/api
```

**⚠️ IMPORTANT**: Thêm `.env` vào `.gitignore`!

---

## 🐳 Dockerfile Examples

### Node.js Service (User Service example):

```dockerfile
# services/user-service/Dockerfile

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["npm", "start"]
```

### Java Service (Alternative):

```dockerfile
# services/user-service/Dockerfile

FROM openjdk:17-jdk-slim

# Create app directory
WORKDIR /app

# Copy JAR file
COPY target/user-service-1.0.0.jar app.jar

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (React):

```dockerfile
# frontend/Dockerfile

# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 🚀 Commands

### Start all services:
```powershell
docker-compose up -d
```

### View logs:
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
```

### Stop all services:
```powershell
docker-compose down
```

### Stop and remove volumes (clean slate):
```powershell
docker-compose down -v
```

### Rebuild services:
```powershell
docker-compose build

# Rebuild specific service
docker-compose build user-service
```

### Restart specific service:
```powershell
docker-compose restart user-service
```

### Check service status:
```powershell
docker-compose ps
```

### Execute command in container:
```powershell
# Access PostgreSQL
docker exec -it carbon-postgres psql -U admin -d carbon_platform

# Access container shell
docker exec -it carbon-user-service sh
```

---

## 🔍 Testing

### Check all services are running:
```powershell
docker-compose ps
```

Expected output: All services should be "Up"

### Test API Gateway:
```powershell
curl http://localhost/health
```

### Test individual services:
```powershell
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # EV Data Service
curl http://localhost:3003/health  # Carbon Credit Service
```

### Access RabbitMQ Management UI:
```
http://localhost:15672
Username: admin
Password: secret123
```

### Access Frontend:
```
http://localhost:3000
```

---

## 🔧 Troubleshooting

### Problem: Port already in use
```powershell
# Check which process uses port
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### Problem: Container won't start
```powershell
# Check logs
docker-compose logs <service-name>

# Check container status
docker inspect <container-name>
```

### Problem: Database connection failed
```powershell
# Check if PostgreSQL is ready
docker exec -it carbon-postgres pg_isready -U admin

# Restart database
docker-compose restart postgres
```

### Problem: Out of disk space
```powershell
# Clean up Docker
docker system prune -a --volumes

# WARNING: This removes ALL unused Docker data!
```

### Problem: Build fails
```powershell
# Clear build cache
docker-compose build --no-cache <service-name>
```

---

## 📊 Monitoring

### Resource usage:
```powershell
docker stats
```

### Disk usage:
```powershell
docker system df
```

---

## 🔐 Security Best Practices

1. **Change default passwords** in `.env`
2. **Use secrets management** (Docker Secrets or environment variables)
3. **Don't commit `.env`** to Git
4. **Use multi-stage builds** to reduce image size
5. **Run as non-root user** in containers
6. **Scan images for vulnerabilities**:
   ```powershell
   docker scan <image-name>
   ```

---

## 📝 .dockerignore

Create `.dockerignore` in each service folder:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
.idea
*.md
.DS_Store
coverage
.nyc_output
dist
build
```

---

## 🚢 Production Deployment (Optional)

### Using Docker Swarm:
```powershell
docker swarm init
docker stack deploy -c docker-compose.yml carbon-platform
```

### Using Kubernetes:
Convert docker-compose to Kubernetes manifests:
```powershell
kompose convert -f docker-compose.yml
```

---

## ✅ Checklist

- [ ] Docker & Docker Compose installed
- [ ] `.env` file created with secure passwords
- [ ] All Dockerfiles created for services
- [ ] `docker-compose.yml` configured
- [ ] `.dockerignore` files created
- [ ] Health checks implemented
- [ ] Services can communicate
- [ ] Database migrations run successfully
- [ ] Frontend can access backend via API Gateway
- [ ] All 4 actors can use the system

---

**Deadline: 17/11/2025** ⏰

Good luck! 🚀
