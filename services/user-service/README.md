# User Service

## Mô tả
Service quản lý người dùng (EV Owner, CC Buyer, CVA, Admin)

## Chức năng
- Đăng ký / Đăng nhập
- JWT Authentication
- Quản lý profile
- Phân quyền (RBAC)

## Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM
- JWT + Bcrypt

## APIs
- POST /auth/register
- POST /auth/login
- GET /users/profile
- PUT /users/profile

## Port
3001
