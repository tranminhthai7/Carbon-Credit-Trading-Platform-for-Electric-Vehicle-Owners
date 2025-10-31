# Notification Service

## Mô tả
Service gửi thông báo (email, push notification, certificate)

## Chức năng
- Gửi email thông báo giao dịch
- Gửi certificate sau khi mua tín chỉ
- Push notifications
- Email templates (đăng ký, mua/bán thành công)
- Async queue với Redis

## Tech Stack
- Node.js + Express + TypeScript
- Redis (Queue)
- Nodemailer / SendGrid

## APIs
- POST /notifications/email - Gửi email
- POST /notifications/push - Push notification
- POST /notifications/certificate - Gửi certificate

## Port
3007
