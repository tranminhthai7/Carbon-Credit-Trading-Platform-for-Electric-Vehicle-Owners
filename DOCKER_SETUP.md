# 🐳 Docker Setup Guide

## Prerequisites

- Docker Desktop installed and running
- Docker Compose version 2.0+

## Quick Start

### 1. Copy environment file
```bash
cp .env.example .env
```

### 2. Start all services
```bash
docker-compose up -d
```

### 3. Check status
```bash
docker-compose ps
```

### 4. View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
```

### 5. Stop all services
```bash
docker-compose down
```

## Services & Ports

### Databases
- **PostgreSQL** (User Service): `localhost:5432`
- **PostgreSQL** (Carbon Credit): `localhost:5433`
- **PostgreSQL** (Marketplace): `localhost:5434`
- **PostgreSQL** (Payment): `localhost:5435`
- **PostgreSQL** (Verification): `localhost:5436`
- **PostgreSQL** (Notification): `localhost:5437`
- **MongoDB** (EV Data): `localhost:27017`
- **MongoDB** (Reporting): `localhost:27018`
- **Redis**: `localhost:6379`
- **RabbitMQ**: `localhost:5672` (AMQP), `localhost:15672` (Management UI)

### Microservices
- **User Service**: `localhost:3001`
- **EV Data Service**: `localhost:3002`
- **Carbon Credit Service**: `localhost:3003`
- **Marketplace Service**: `localhost:3004`
- **Payment Service**: `localhost:3005`
- **Verification Service**: `localhost:3006`
- **Notification Service**: `localhost:3007`
- **Reporting Service**: `localhost:3008`
- **AI Service**: `localhost:3009`

### Frontend & Gateway
- **API Gateway**: `localhost:80`
- **Frontend**: `localhost:3000`

## Environment Variables

Edit `.env` file:

```env
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123

# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=secret123

# Redis
REDIS_PASSWORD=secret123

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=secret123

# JWT
JWT_SECRET=change-this-to-random-string
JWT_EXPIRES_IN=24h

# Email (Optional)
EMAIL_SERVICE=smtp
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Gateway
PAYMENT_GATEWAY_KEY=test-key-12345
```

## Useful Commands

### Rebuild services
```bash
docker-compose build
docker-compose up -d --build
```

### Restart specific service
```bash
docker-compose restart user-service
```

### Clean up (remove volumes)
```bash
docker-compose down -v
```

### Access database
```bash
# PostgreSQL
docker exec -it user-db psql -U admin -d user_service_db

# MongoDB
docker exec -it ev-mongodb mongosh -u admin -p secret123
```

### Access RabbitMQ Management
Open browser: http://localhost:15672
- Username: admin
- Password: secret123

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs -f

# Check health
docker-compose ps
```

### Port conflicts
Edit `docker-compose.yml` to change ports:
```yaml
ports:
  - "5433:5432"  # Change 5433 to another port
```

### Database connection errors
Wait for health checks to pass:
```bash
docker-compose ps
# Wait until all services show "healthy"
```

## Development Mode

Services are configured with volume mounts for hot-reload:
```yaml
volumes:
  - ./services/user-service:/app
  - /app/node_modules
```

Changes to source code will automatically restart the service.

## Production Deployment

For production, modify:
1. Remove volume mounts
2. Change `NODE_ENV=production`
3. Use production secrets
4. Remove `command: npm run dev`
5. Use `CMD ["npm", "start"]` in Dockerfile
