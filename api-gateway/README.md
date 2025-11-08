# API Gateway

API Gateway cho Carbon Credit Trading Platform - Routing requests đến các microservices.

## 🚀 Features

- ✅ Proxy requests đến 8 microservices
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ Error handling
- ✅ Health check endpoint

## 📡 Service Routes

| Route | Service | Port | Description |
|-------|---------|------|-------------|
| `/api/users`, `/api/auth` | User Service | 3001 | Authentication & User Management |
| `/api/vehicles`, `/api/trips`, `/api/co2` | EV Data Service | 3002 | Vehicles & CO2 Calculation |
| `/api/wallet`, `/api/credits` | Carbon Credit Service | 3003 | Wallet & Credits Management |
| `/api/listings`, `/api/orders` | Marketplace Service | 3004 | Marketplace & Trading |
| `/api/payments`, `/api/transactions` | Payment Service | 3005 | Payment Processing |
| `/api/verification`, `/api/kyc`, `/api/certificates`, `/api/issuances` | Verification Service | 3006 | CVA & Verification |
| `/api/notifications` | Notification Service | 3007 | Notifications & Emails |
| `/api/reports`, `/api/analytics` | Reporting Service | 3008 | Reports & Analytics |
| `/api/ai` | AI Service | 3009 | AI Price Prediction |

## 🛠️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=8000
CORS_ORIGIN=http://localhost:5173

USER_SERVICE_URL=http://localhost:3001
EV_DATA_SERVICE_URL=http://localhost:3002
# ... other services
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 📝 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "success": true,
  "message": "API Gateway is running",
  "timestamp": "2025-11-08T...",
  "services": { ... }
}
```

## 🔧 Configuration

### CORS
Configure allowed origins in `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

For multiple origins, modify `src/index.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Add New Service Route
```typescript
app.use('/api/new-route', createProxyMiddleware(createProxyOptions(services.newService)));
```

## 🐳 Docker

Build image:
```bash
docker build -t api-gateway .
```

Run container:
```bash
docker run -p 8000:8000 --env-file .env api-gateway
```

## 📊 Logging

All proxy requests are logged:
```
[PROXY] GET /api/users/profile -> http://localhost:3001/api/users/profile
```

## ⚠️ Error Handling

### Service Unavailable (502)
When a microservice is down:
```json
{
  "success": false,
  "message": "Service temporarily unavailable",
  "error": "connect ECONNREFUSED"
}
```

### Route Not Found (404)
```json
{
  "success": false,
  "message": "Route not found",
  "path": "/api/unknown"
}
```

## 🧪 Testing

Test health check:
```bash
curl http://localhost:8000/health
```

Test proxy:
```bash
curl http://localhost:8000/api/users
```

## 👥 Author

**Team Thai** - Issue #19

## 📄 License

MIT
