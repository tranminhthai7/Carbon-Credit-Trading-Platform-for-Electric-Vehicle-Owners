# Reporting Service

## Mô tả
Service tạo báo cáo và analytics

## Chức năng
- Báo cáo cá nhân EV Owner (CO₂ giảm, doanh thu)
- Báo cáo tổng hợp cho Admin
- Analytics giao dịch tín chỉ trên platform
- Export reports (PDF/CSV)
- Dashboard data

## Tech Stack
- Node.js + Express + TypeScript
- MongoDB (Analytics data)

## APIs
- GET /reports/personal/:userId - Báo cáo cá nhân
- GET /reports/platform - Báo cáo tổng hợp
- GET /reports/transactions - Báo cáo giao dịch
- GET /reports/analytics - Analytics data

## Port
3008
