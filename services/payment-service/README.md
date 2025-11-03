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
- POST /payments/create - Tạo thanh toán
- POST /payments/confirm - Xác nhận thanh toán
- GET /payments/history - Lịch sử  thanh toán
- POST /payments/escrow/create - Tạo ký quỹ
- POST /payments/escrow/release - Giải ngân ký quỹ
- POST /payments/withdrawal/create - Tạo yêu cầu rút tiền
- POST /payments/withdrawal/process - Xử lý rút tiền
- GET /payments/:user_id/dashboard - Dashboard quản lý dòng tiền

## Port
3005
