# Verification Service

## Mô tả
Service kiểm toán và xác minh carbon (CVA)

## Chức năng
- Kiểm tra dữ liệu phát thải & hồ sơ tín chỉ
- Duyệt hoặc từ chối yêu cầu phát hành tín chỉ
- Cấp chứng nhận (certificate)
- KYC verification cho users
- Xuất báo cáo xác minh

## Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM

## APIs
- POST /kyc/submit - Nộp KYC
- GET /kyc/status/:userId - Kiểm tra trạng thái
- POST /credits/verify - Xác minh tín chỉ
- POST /credits/approve - Duyệt
- POST /credits/reject - Từ chối

## Port
3006
