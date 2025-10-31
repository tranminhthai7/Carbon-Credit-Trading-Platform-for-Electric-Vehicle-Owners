# EV Data Service

## Mô tả
Service quản lý dữ liệu xe điện và hành trình

## Chức năng
- Kết nối và đọc dữ liệu từ xe điện (giả lập từ file)
- Ghi nhận chuyến đi (trips)
- Tính toán quãng đường, thời gian
- Theo dõi lịch sử hành trình

## Tech Stack
- Node.js + Express + TypeScript
- MongoDB + Mongoose

## APIs
- POST /vehicles - Đăng ký xe
- GET /vehicles - Danh sách xe
- POST /vehicles/:id/trips - Ghi chuyến đi
- GET /vehicles/:id/trips - Lịch sử trips

## Port
3002
