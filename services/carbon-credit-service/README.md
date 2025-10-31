# Carbon Credit Service

## Mô tả
Service tính toán CO₂, quy đổi tín chỉ carbon và quản lý ví

## Chức năng
- Tính toán CO₂ giảm phát thải: (120g/km - 20g/km) × distance
- Quy đổi CO₂ → Carbon Credits (1 credit = 1 tấn CO₂)
- Quản lý ví carbon (balance, transactions)
- Mint/Transfer/Burn credits

## Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM

## APIs
- POST /calculate/co2 - Tính CO₂
- POST /wallet/create - Tạo ví
- GET /wallet/:userId - Xem số dư
- POST /wallet/mint - Phát hành credits
- POST /wallet/transfer - Chuyển credits

## Port
3003
