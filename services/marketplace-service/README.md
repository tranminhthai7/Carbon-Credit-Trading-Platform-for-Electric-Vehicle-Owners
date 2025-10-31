# Marketplace Service

## Mô tả
Service quản lý sàn giao dịch carbon credits (Fixed Price & Auction)

## Chức năng
- Niêm yết tín chỉ carbon để bán (fixed price / auction)
- Tìm kiếm & lọc listings
- Mua trực tiếp hoặc đấu giá
- Quản lý orders
- Theo dõi, hủy, hoàn tất giao dịch

## Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM

## APIs
- POST /listings - Đăng bán
- GET /listings - Browse listings
- POST /listings/:id/purchase - Mua credits
- GET /orders - Lịch sử orders
- POST /listings/:id/bid - Đấu giá (auction)

## Port
3004
