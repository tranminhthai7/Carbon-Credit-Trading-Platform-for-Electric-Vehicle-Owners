gh issue create --title "[Admin] UsersPage - Quản lý users (6h)" --body "## 🎯 Mục Tiêu
Tạo UsersPage cho việc quản lý users. Bao gồm: danh sách tất cả users với bộ lọc theo role, tìm kiếm, chỉnh sửa thông tin user, khóa/mở khóa tài khoản.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid với columns: ID, Name, Email, Role, Status, Created Date, Actions
- [ ] Filters: Role, Status, Date range
- [ ] Search by name/email
- [ ] Edit user dialog (name, email, phone)
- [ ] Ban/Unban user functionality
- [ ] User detail view với activity history
- [ ] Bulk actions (ban multiple users)

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/admin/users\` - List users
- \`PUT /api/admin/users/:id\` - Update user
- \`POST /api/admin/users/:id/ban\` - Ban user
- \`GET /api/admin/users/:id/activity\` - User activity

## 🎨 UI/UX Requirements
- Advanced DataGrid with filtering
- Modal dialogs cho edit
- Status indicators
- Bulk action controls

## ✅ Tiêu Chí Hoàn Thành
- [ ] Full user management
- [ ] Search và filter
- [ ] Edit functionality
- [ ] Ban/unban features
- [ ] Activity tracking

## 📁 Files Cần Tạo
- \`frontend/src/pages/admin/UsersPage.tsx\`

## 📝 Notes
- Admin-only permissions
- Audit logging
- Email notifications for bans"

gh issue create --title "[Admin] TransactionsPage - Quản lý giao dịch (5h)" --body "## 🎯 Mục Tiêu
Tạo TransactionsPage hiển thị tất cả giao dịch trên platform. Bao gồm: danh sách transactions với bộ lọc nâng cao, chi tiết giao dịch, xuất báo cáo.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid: Date, User, Type, Amount, Status, Details
- [ ] Advanced filters: Date range, User, Type, Amount range
- [ ] Transaction detail modal
- [ ] Export to CSV/Excel
- [ ] Fraud detection indicators
- [ ] Transaction search

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/admin/transactions\` - List transactions
- \`GET /api/admin/transactions/:id\` - Transaction detail

## 🎨 UI/UX Requirements
- Advanced filtering interface
- Detail modals
- Export functionality
- Fraud indicators

## ✅ Tiêu Chí Hoàn Thành
- [ ] Transaction listing
- [ ] Advanced filtering
- [ ] Detail views
- [ ] Export features
- [ ] Fraud detection UI

## 📁 Files Cần Tạo
- \`frontend/src/pages/admin/TransactionsPage.tsx\`

## 📝 Notes
- Sensitive financial data
- Audit requirements
- Performance considerations for large datasets"