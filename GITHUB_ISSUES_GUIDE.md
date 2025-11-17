# Hướng Dẫn Tạo GitHub Issues Cho Đội Ngũ Phát Triển

## Tổng Quan Dự Án
**Carbon Credit Trading Platform for Electric Vehicle Owners**

Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện với 5 thành viên phát triển.

## Phân Chia Nhiệm Vụ Theo Thành Viên

### 👤 **Thành Viên 1: EV Owner Features** (10 giờ)
- WalletPage (5h): Quản lý ví và giao dịch
- ListingsPage (5h): Quản lý listings carbon credit

### 👤 **Thành Viên 2: Buyer Features** (11 giờ)
- BuyerDashboard (3h): Dashboard người mua
- OrdersPage (4h): Quản lý đơn hàng
- CertificatesPage (4h): Quản lý chứng chỉ

### 👤 **Thành Viên 3: CVA Features** (8 giờ)
- CVADashboard (3h): Dashboard xác minh
- CVAReportsPage (5h): Báo cáo xác minh

### 👤 **Thành Viên 4: Admin Features** (25 giờ)
- AdminDashboard (4h): Dashboard quản trị
- UsersPage (6h): Quản lý người dùng
- TransactionsPage (5h): Quản lý giao dịch
- AnalyticsPage (6h): Phân tích dữ liệu
- SettingsPage (4h): Cấu hình hệ thống

### 👤 **Thành Viên 5: Integration & Testing** (28 giờ)
- Common Components (4h): Components dùng chung
- Custom Hooks (4h): Custom hooks
- Unit Tests (8h): Unit testing
- E2E Tests (8h): End-to-end testing
- API Integration (4h): Tích hợp API

## Template Tạo Issue

### Tiêu Đề Issue:
```
[Role] TênTrang - Mô tả ngắn (Thời gian)
```

### Nội Dung Issue (Description):

```markdown
## 🎯 Mục Tiêu
[Mô tả chi tiết công việc cần làm]

## 📋 Yêu Cầu Chi Tiết
- [ ] Yêu cầu 1
- [ ] Yêu cầu 2
- [ ] Yêu cầu 3

## 🔗 API Endpoints Cần Sử Dụng
- `GET/POST/PUT/DELETE /api/endpoint` - Mô tả

## 🎨 UI/UX Requirements
- Thiết kế theo pattern của BuyerDashboard/AdminDashboard sample
- Sử dụng Material-UI components
- Responsive design
- Loading states và error handling

## ✅ Tiêu Chí Hoàn Thành
- [ ] Code không có lỗi TypeScript
- [ ] UI hiển thị đúng trên mobile/desktop
- [ ] Tích hợp API đầy đủ
- [ ] Test basic functionality

## 📁 Files Cần Tạo/Chỉnh Sửa
- `frontend/src/pages/role/TênPage.tsx`
- [Các file khác nếu cần]

## 🔗 Related Issues
- Liên kết với các issues liên quan

## 📝 Notes
[Thông tin bổ sung, lưu ý đặc biệt]
```

## Các Issues Cần Tạo

### Issues Cho Thành Viên 1 (EV Owner)
1. **WalletPage - Quản lý ví và giao dịch (5h)**
2. **ListingsPage - Quản lý listings carbon credit (5h)**

### Issues Cho Thành Viên 2 (Buyer)
3. **BuyerDashboard - Dashboard người mua (3h)**
4. **OrdersPage - Quản lý đơn hàng (4h)**
5. **CertificatesPage - Quản lý chứng chỉ (4h)**

### Issues Cho Thành Viên 3 (CVA)
6. **CVADashboard - Dashboard xác minh (3h)**
7. **CVAReportsPage - Báo cáo xác minh (5h)**

### Issues Cho Thành Viên 4 (Admin)
8. **AdminDashboard - Dashboard quản trị (4h)**
9. **UsersPage - Quản lý người dùng (6h)**
10. **TransactionsPage - Quản lý giao dịch (5h)**
11. **AnalyticsPage - Phân tích dữ liệu (6h)**
12. **SettingsPage - Cấu hình hệ thống (4h)**

### Issues Cho Thành Viên 5 (Integration)
13. **Common Components - Components dùng chung (4h)**
14. **Custom Hooks - Custom hooks (4h)**
15. **Unit Tests - Unit testing (8h)**
16. **E2E Tests - End-to-end testing (8h)**
17. **API Integration - Tích hợp API (4h)**

## Quy Trình Thực Hiện

### Bước 1: Tạo Issues
1. Truy cập GitHub repository
2. Click "Issues" → "New Issue"
3. Sử dụng template ở trên
4. Gán cho thành viên tương ứng
5. Thêm labels: `enhancement`, `role:ev-owner`, `role:buyer`, etc.

### Bước 2: Tạo Project Board
1. Tạo GitHub Project mới
2. Thêm các issues vào board
3. Tạo columns: Backlog, In Progress, Review, Done

### Bước 3: Phân Công
1. Assign issues cho từng thành viên
2. Set due dates theo timeline
3. Tạo milestone cho từng phase

## Timeline Dự Kiến

### Phase 1 (Tuần 1-2): Core Dashboards
- BuyerDashboard, CVADashboard, AdminDashboard
- Thời gian: 7-10 ngày

### Phase 2 (Tuần 3-4): Advanced Features
- Tất cả pages còn lại
- Thời gian: 5-7 ngày

### Phase 3 (Tuần 5): Testing & Polish
- Unit tests, E2E tests, API integration
- Thời gian: 3-5 ngày

## Best Practices

### Code Quality
- Tuân thủ TypeScript strict mode
- Sử dụng ESLint rules
- Follow existing code patterns
- Test trên multiple browsers

### Git Workflow
- Tạo branch cho mỗi issue: `feat/wallet-page`
- Commit thường xuyên với message rõ ràng
- Tạo PR khi hoàn thành
- Code review trước merge

### Communication
- Daily standup updates
- Báo cáo progress trong issues
- Đề cập blockers sớm
- Hỏi support khi cần

## Sample Code References
- Xem `BuyerDashboard.tsx` và `AdminDashboard.tsx` đã được implement
- Sử dụng các common components có sẵn
- Follow API service patterns
- Tham khảo Material-UI documentation

## Support & Resources
- Discord/Slack channel cho team
- Shared documentation trong repo
- Code review guidelines
- Testing environment setup