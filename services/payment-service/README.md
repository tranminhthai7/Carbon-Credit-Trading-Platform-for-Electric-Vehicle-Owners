# Payment Service

## Mô tả
Service xử lý thanh toán và rút tiền

## Chức năng
- Thanh toán online (e-wallet, banking)
- Xử lý escrow (giữ tiền an toàn)
- Rút tiền sau khi bán tín chỉ
- Quản lý dòng tiền
- Integration với payment gateway (Stripe/PayPal)

## Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM
- Stripe API / PayPal API

## APIs
- POST /payments/process - Thanh toán
- GET /payments/history - Lịch sử
- POST /payments/withdraw - Rút tiền
- POST /payments/refund - Hoàn tiền

## Port
3005
