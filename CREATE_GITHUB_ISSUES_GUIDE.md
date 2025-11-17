# 🚀 SCRIPT TẠO GITHUB ISSUES CHO TEAM

## 📋 Hướng Dẫn Tạo Tất Cả Issues

### Bước 1: Truy cập GitHub
```
https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
```

### Bước 2: Tạo Issues Theo Thứ Tự

---

## 🎯 **ISSUE 1: [EV Owner] WalletPage - Quản lý ví và giao dịch (5h)**

**Tiêu đề:** `[EV Owner] WalletPage - Quản lý ví và giao dịch (5h)`

**Assignee:** @thanhvien1

**Labels:** `enhancement`, `role:ev-owner`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo trang WalletPage hoàn chỉnh với hiển thị số dư, lịch sử giao dịch, và chức năng rút tiền. Sử dụng DataGrid để hiển thị lịch sử và thêm nút Export CSV.

## 📋 Yêu Cầu Chi Tiết
- [ ] Hiển thị số dư hiện tại với gradient background xanh lá
- [ ] Hiển thị tổng tiền đã kiếm và đã chi
- [ ] DataGrid hiển thị lịch sử giao dịch với cột: Date, Type, Description, Amount
- [ ] Icon cho loại giao dịch (EARN/SPEND) với màu xanh/đỏ
- [ ] Nút Export CSV cho lịch sử giao dịch
- [ ] Loading states và error handling
- [ ] Responsive design cho mobile

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/wallet/my-wallet` - Lấy thông tin ví
- `GET /api/wallet/transactions` - Lấy lịch sử giao dịch

## 🎨 UI/UX Requirements
- Theo pattern của BuyerDashboard
- Material-UI components (Card, DataGrid, Button)
- Gradient background cho balance card
- Icons cho transaction types
- Proper spacing và typography

## ✅ Tiêu Chí Hoàn Thành
- [ ] Code không có lỗi TypeScript
- [ ] UI hiển thị đúng trên mobile/desktop
- [ ] Tích hợp API đầy đủ với error handling
- [ ] Export CSV hoạt động
- [ ] Test basic functionality

## 📁 Files Cần Tạo/Chỉnh Sửa
- `frontend/src/pages/owner/WalletPage.tsx` (đã có skeleton, cần hoàn thiện)

## 📝 Notes
- Sử dụng walletService.getMyWallet() và walletService.getTransactions()
- Format tiền tệ: $xx.xx
- Format ngày: MMM dd, yyyy HH:mm
```

---

## 🎯 **ISSUE 2: [EV Owner] ListingsPage - Quản lý listings carbon credit (5h)**

**Tiêu đề:** `[EV Owner] ListingsPage - Quản lý listings carbon credit (5h)`

**Assignee:** @thanhvien1

**Labels:** `enhancement`, `role:ev-owner`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo trang ListingsPage cho việc quản lý các listing carbon credit. Bao gồm: hiển thị danh sách listing của user, tạo listing mới, chỉnh sửa giá, hủy listing.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid hiển thị listings với cột: ID, Quantity, Price/Unit, Total Price, Status, Actions
- [ ] Status badges: ACTIVE, SOLD, CANCELLED
- [ ] Nút Create New Listing mở dialog
- [ ] Actions: Edit Price, Cancel Listing
- [ ] Dialog tạo/chỉnh sửa listing với form validation
- [ ] Confirm dialog cho việc hủy listing
- [ ] Real-time cập nhật sau actions

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/listings/seller` - Lấy listings của user
- `POST /api/listings` - Tạo listing mới
- `PUT /api/listings/:id` - Cập nhật listing
- `DELETE /api/listings/:id` - Hủy listing

## 🎨 UI/UX Requirements
- DataGrid với sorting và filtering
- Dialog forms với proper validation
- Action buttons với icons
- Status chips với colors
- Loading states cho tất cả actions

## ✅ Tiêu Chí Hoàn Thành
- [ ] Code không có lỗi TypeScript
- [ ] CRUD operations hoạt động đầy đủ
- [ ] Form validation hoàn chỉnh
- [ ] UI responsive và user-friendly
- [ ] Error handling cho tất cả API calls

## 📁 Files Cần Tạo
- `frontend/src/pages/owner/ListingsPage.tsx`
- `frontend/src/components/forms/ListingFormDialog.tsx` (tùy chọn)

## 📝 Notes
- Sử dụng marketplaceService
- Validate quantity > 0, price > 0
- Confirm trước khi cancel listing
```

---

## 🎯 **ISSUE 3: [Buyer] BuyerDashboard - Hoàn thiện dashboard (3h)**

**Tiêu đề:** `[Buyer] BuyerDashboard - Hoàn thiện dashboard (3h)`

**Assignee:** @thanhvien2

**Labels:** `enhancement`, `role:buyer`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Hoàn thiện BuyerDashboard (sample đã có). Thêm chart thống kê mua hàng theo tháng, hiển thị certificates đã nhận, và thêm section so sánh giá trên thị trường.

## 📋 Yêu Cầu Chi Tiết
- [ ] Chart thống kê đơn hàng theo tháng (BarChart)
- [ ] Section hiển thị certificates đã nhận
- [ ] So sánh giá thị trường (min/max/avg price)
- [ ] Recent orders section (đã có)
- [ ] Quick actions (đã có)
- [ ] Real-time data fetching

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/listings/orders` - Lấy orders của buyer
- `GET /api/certificates` - Lấy certificates (cần tạo endpoint)
- `GET /api/marketplace/stats` - Thống kê thị trường

## 🎨 UI/UX Requirements
- MUI X Charts cho visualizations
- StatsCard components
- Responsive grid layout
- Loading và error states

## ✅ Tiêu Chí Hoàn Thành
- [ ] Charts hiển thị đúng dữ liệu
- [ ] Certificates section hoàn chỉnh
- [ ] Market comparison section
- [ ] No TypeScript errors
- [ ] Responsive design

## 📁 Files Cần Chỉnh Sửa
- `frontend/src/pages/buyer/BuyerDashboard.tsx` (sample có sẵn)

## 📝 Notes
- Tham khảo BuyerDashboard hiện tại
- Thêm MUI X Charts dependencies nếu cần
```

---

## 🎯 **ISSUE 4: [Buyer] OrdersPage - Quản lý đơn hàng (4h)**

**Tiêu đề:** `[Buyer] OrdersPage - Quản lý đơn hàng (4h)`

**Assignee:** @thanhvien2

**Labels:** `enhancement`, `role:buyer`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo OrdersPage hiển thị tất cả đơn hàng của buyer. Bao gồm: danh sách orders với trạng thái, chi tiết đơn hàng, lịch sử thanh toán, và chức năng hủy đơn.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid với cột: Order ID, Date, Total Amount, Status, Actions
- [ ] Status chips: PENDING, COMPLETED, CANCELLED
- [ ] Chi tiết đơn hàng khi click vào row
- [ ] Lịch sử thanh toán cho mỗi order
- [ ] Nút Cancel Order (chỉ cho PENDING orders)
- [ ] Filter theo status và date range
- [ ] Export orders to CSV

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/listings/orders` - Lấy tất cả orders
- `GET /api/orders/:id` - Chi tiết order
- `DELETE /api/orders/:id` - Hủy order
- `GET /api/orders/:id/payments` - Lịch sử thanh toán

## 🎨 UI/UX Requirements
- Master-detail layout
- Expandable rows cho chi tiết
- Action buttons với confirm dialogs
- Status-based styling
- Search và filter controls

## ✅ Tiêu Chí Hoàn Thành
- [ ] Full CRUD cho orders
- [ ] Detail view hoàn chỉnh
- [ ] Payment history
- [ ] Cancel functionality với confirmation
- [ ] Export feature

## 📁 Files Cần Tạo
- `frontend/src/pages/buyer/OrdersPage.tsx`

## 📝 Notes
- Sử dụng marketplaceService.getMyOrders()
- Implement optimistic updates
```

---

## 🎯 **ISSUE 5: [Buyer] CertificatesPage - Quản lý chứng chỉ (4h)**

**Tiêu đề:** `[Buyer] CertificatesPage - Quản lý chứng chỉ (4h)`

**Assignee:** @thanhvien2

**Labels:** `enhancement`, `role:buyer`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo CertificatesPage để quản lý carbon credit certificates. Hiển thị danh sách certificates với thông tin chi tiết, tải xuống PDF, chia sẻ certificates.

## 📋 Yêu Cầu Chi Tiết
- [ ] Grid hiển thị certificates với thumbnail
- [ ] Chi tiết: Certificate Number, Issue Date, Credit Amount, PDF URL
- [ ] Nút Download PDF cho mỗi certificate
- [ ] Nút Share certificate (copy link)
- [ ] Filter theo date range và status
- [ ] Search theo certificate number
- [ ] Certificate verification (QR code hoặc link)

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/certificates` - Lấy certificates của user
- `GET /api/certificates/:id/pdf` - Download PDF
- `POST /api/certificates/:id/share` - Tạo share link

## 🎨 UI/UX Requirements
- Card-based layout cho certificates
- PDF viewer hoặc download
- Share functionality với copy-to-clipboard
- Certificate verification
- Mobile-friendly design

## ✅ Tiêu Chí Hoàn Thành
- [ ] Certificate display hoàn chỉnh
- [ ] PDF download hoạt động
- [ ] Share functionality
- [ ] Search và filter
- [ ] Verification feature

## 📁 Files Cần Tạo
- `frontend/src/pages/buyer/CertificatesPage.tsx`

## 📝 Notes
- Implement PDF download
- Add share functionality
- Certificate verification logic
```

---

## 🎯 **ISSUE 6: [CVA] CVADashboard - Dashboard xác minh (3h)**

**Tiêu đề:** `[CVA] CVADashboard - Dashboard xác minh (3h)`

**Assignee:** @thanhvien3

**Labels:** `enhancement`, `role:cva`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo CVADashboard hiển thị thống kê công việc xác minh. Bao gồm: số lượng trips đang chờ xác minh, đã xác minh trong tuần/tháng, tỷ lệ chấp nhận/từ chối.

## 📋 Yêu Cầu Chi Tiết
- [ ] Stats cards: Pending Verifications, Verified This Week, Approval Rate
- [ ] Priority queue cho trips cần xác minh gấp
- [ ] Recent verification activities
- [ ] Charts: Verification trends, Approval/Rejection ratio
- [ ] Quick actions: Start Verification, View Queue

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/verifications/stats` - Thống kê verification
- `GET /api/verifications/pending` - Trips đang chờ
- `GET /api/verifications/recent` - Activities gần đây

## 🎨 UI/UX Requirements
- Dashboard layout với stats cards
- Charts cho trends
- Priority indicators
- Action buttons

## ✅ Tiêu Chí Hoàn Thành
- [ ] Stats hiển thị đúng
- [ ] Charts hoạt động
- [ ] Priority queue
- [ ] Navigation to verification pages

## 📁 Files Cần Tạo
- `frontend/src/pages/cva/CVADashboard.tsx`

## 📝 Notes
- Follow AdminDashboard pattern
- Real-time updates nếu có thể
```

---

## 🎯 **ISSUE 7: [CVA] CVAReportsPage - Báo cáo xác minh (5h)**

**Tiêu đề:** `[CVA] CVAReportsPage - Báo cáo xác minh (5h)`

**Assignee:** @thanhvien3

**Labels:** `enhancement`, `role:cva`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo CVAReportsPage cho việc tạo báo cáo xác minh. Bao gồm: báo cáo theo thời gian, theo khu vực, thống kê hiệu suất CVA, xuất báo cáo.

## 📋 Yêu Cầu Chi Tiết
- [ ] Date range picker cho báo cáo
- [ ] Filter theo region/area
- [ ] Charts: Verification volume, Approval rates, Performance metrics
- [ ] Export to PDF/Excel
- [ ] Summary statistics
- [ ] Detailed breakdown tables

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/reports/verifications` - Dữ liệu báo cáo
- `POST /api/reports/generate` - Tạo báo cáo

## 🎨 UI/UX Requirements
- Report builder interface
- Charts và tables
- Export functionality
- Date range controls

## ✅ Tiêu Chí Hoàn Thành
- [ ] Report generation
- [ ] Charts và visualizations
- [ ] Export features
- [ ] Filter controls

## 📁 Files Cần Tạo
- `frontend/src/pages/cva/CVAReportsPage.tsx`

## 📝 Notes
- Complex reporting interface
- Multiple chart types
- Export capabilities
```

---

## 🎯 **ISSUE 8: [Admin] AdminDashboard - Hoàn thiện dashboard (4h)**

**Tiêu đề:** `[Admin] AdminDashboard - Hoàn thiện dashboard (4h)`

**Assignee:** @thanhvien4

**Labels:** `enhancement`, `role:admin`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Hoàn thiện AdminDashboard (sample đã có). Thêm charts thống kê platform, hiển thị recent activities, system alerts.

## 📋 Yêu Cầu Chi Tiết
- [ ] Platform revenue chart (time series)
- [ ] User registration trends
- [ ] System health indicators
- [ ] Recent activities feed
- [ ] Critical alerts section
- [ ] Quick admin actions

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/admin/stats` - Platform stats
- `GET /api/admin/activities` - Recent activities
- `GET /api/admin/health` - System health

## 🎨 UI/UX Requirements
- Advanced dashboard layout
- Real-time updates
- Alert system
- Action shortcuts

## ✅ Tiêu Chí Hoàn Thành
- [ ] Enhanced charts
- [ ] Activity feed
- [ ] Alert system
- [ ] Admin actions

## 📁 Files Cần Chỉnh Sửa
- `frontend/src/pages/admin/AdminDashboard.tsx` (sample có sẵn)

## 📝 Notes
- Build upon existing AdminDashboard
- Add real-time features
```

---

## 🎯 **ISSUE 9: [Admin] UsersPage - Quản lý users (6h)**

**Tiêu đề:** `[Admin] UsersPage - Quản lý users (6h)`

**Assignee:** @thanhvien4

**Labels:** `enhancement`, `role:admin`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
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
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/ban` - Ban user
- `GET /api/admin/users/:id/activity` - User activity

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
- `frontend/src/pages/admin/UsersPage.tsx`

## 📝 Notes
- Admin-only permissions
- Audit logging
- Email notifications for bans
```

---

## 🎯 **ISSUE 10: [Admin] TransactionsPage - Quản lý giao dịch (5h)**

**Tiêu đề:** `[Admin] TransactionsPage - Quản lý giao dịch (5h)`

**Assignee:** @thanhvien4

**Labels:** `enhancement`, `role:admin`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo TransactionsPage hiển thị tất cả giao dịch trên platform. Bao gồm: danh sách transactions với bộ lọc nâng cao, chi tiết giao dịch, xuất báo cáo.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid: Date, User, Type, Amount, Status, Details
- [ ] Advanced filters: Date range, User, Type, Amount range
- [ ] Transaction detail modal
- [ ] Export to CSV/Excel
- [ ] Fraud detection indicators
- [ ] Transaction search

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/admin/transactions` - List transactions
- `GET /api/admin/transactions/:id` - Transaction detail

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
- `frontend/src/pages/admin/TransactionsPage.tsx`

## 📝 Notes
- Sensitive financial data
- Audit requirements
- Performance considerations for large datasets
```

---

## 🎯 **ISSUE 11: [Admin] AnalyticsPage - Phân tích dữ liệu (6h)**

**Tiêu đề:** `[Admin] AnalyticsPage - Phân tích dữ liệu (6h)`

**Assignee:** @thanhvien4

**Labels:** `enhancement`, `role:admin`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo AnalyticsPage với dashboard phân tích chi tiết. Bao gồm: biểu đồ doanh thu theo thời gian, phân tích hành vi user, thống kê carbon credits.

## 📋 Yêu Cầu Chi Tiết
- [ ] Revenue time series chart
- [ ] User behavior analytics
- [ ] Carbon credit statistics
- [ ] Market trends
- [ ] Geographic distribution
- [ ] Custom date ranges
- [ ] Export analytics data

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/carbon` - Carbon statistics

## 🎨 UI/UX Requirements
- Advanced charting dashboard
- Interactive filters
- Export capabilities
- Real-time updates

## ✅ Tiêu Chí Hoàn Thành
- [ ] Multiple chart types
- [ ] Interactive analytics
- [ ] Data export
- [ ] Custom time ranges

## 📁 Files Cần Tạo
- `frontend/src/pages/admin/AnalyticsPage.tsx`

## 📝 Notes
- Complex data visualizations
- Performance optimization
- Real-time data considerations
```

---

## 🎯 **ISSUE 12: [Admin] SettingsPage - Cấu hình hệ thống (4h)**

**Tiêu đề:** `[Admin] SettingsPage - Cấu hình hệ thống (4h)`

**Assignee:** @thanhvien4

**Labels:** `enhancement`, `role:admin`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo SettingsPage cho các cấu hình hệ thống. Bao gồm: cấu hình phí giao dịch, quy tắc xác minh, email templates, system notifications.

## 📋 Yêu Cầu Chi Tiết
- [ ] Transaction fee settings
- [ ] Verification rules configuration
- [ ] Email template editor
- [ ] System notification settings
- [ ] Backup configuration
- [ ] API rate limiting
- [ ] Save và validation

## 🔗 API Endpoints Cần Sử Dụng
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## 🎨 UI/UX Requirements
- Form-based interface
- Validation feedback
- Save indicators
- Confirmation dialogs

## ✅ Tiêu Chí Hoàn Thành
- [ ] Settings management
- [ ] Form validation
- [ ] Save functionality
- [ ] Confirmation dialogs

## 📁 Files Cần Tạo
- `frontend/src/pages/admin/SettingsPage.tsx`

## 📝 Notes
- Critical system settings
- Validation requirements
- Backup before changes
```

---

## 🎯 **ISSUE 13: [Integration] Common Components - Cải thiện components (4h)**

**Tiêu đề:** `[Integration] Common Components - Cải thiện components (4h)`

**Assignee:** @thanhvien5

**Labels:** `enhancement`, `integration`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Xem xét và cải thiện các common components. Thêm ErrorBoundary, LoadingSkeleton, ConfirmDialog nếu chưa có. Tối ưu performance và accessibility.

## 📋 Yêu Cầu Chi Tiết
- [ ] Add ErrorBoundary component
- [ ] Add LoadingSkeleton component
- [ ] Add ConfirmDialog component
- [ ] Optimize existing components
- [ ] Add accessibility features
- [ ] Performance improvements

## 🔗 Dependencies
- Material-UI components
- React best practices

## 🎨 UI/UX Requirements
- Consistent design language
- Accessibility compliance
- Performance optimized

## ✅ Tiêu Chí Hoàn Thành
- [ ] ErrorBoundary implemented
- [ ] LoadingSkeleton added
- [ ] ConfirmDialog created
- [ ] Components optimized
- [ ] Accessibility improved

## 📁 Files Cần Tạo/Chỉnh Sửa
- `frontend/src/components/common/ErrorBoundary.tsx`
- `frontend/src/components/common/LoadingSkeleton.tsx`
- `frontend/src/components/common/ConfirmDialog.tsx`
- Improve existing common components

## 📝 Notes
- Follow React best practices
- Test accessibility
- Performance monitoring
```

---

## 🎯 **ISSUE 14: [Integration] Custom Hooks - Tạo custom hooks (4h)**

**Tiêu đề:** `[Integration] Custom Hooks - Tạo custom hooks (4h)`

**Assignee:** @thanhvien5

**Labels:** `enhancement`, `integration`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Tạo custom hooks cho shared logic. Bao gồm: useApi (xử lý loading/error), useLocalStorage, useDebounce, usePagination.

## 📋 Yêu Cầu Chi Tiết
- [ ] useApi hook for API calls
- [ ] useLocalStorage hook
- [ ] useDebounce hook
- [ ] usePagination hook
- [ ] useAuth hook improvements
- [ ] Documentation

## 🔗 Dependencies
- React hooks
- API services

## ✅ Tiêu Chí Hoàn Thành
- [ ] All hooks implemented
- [ ] Proper TypeScript typing
- [ ] Error handling
- [ ] Documentation added

## 📁 Files Cần Tạo
- `frontend/src/hooks/useApi.ts`
- `frontend/src/hooks/useLocalStorage.ts`
- `frontend/src/hooks/useDebounce.ts`
- `frontend/src/hooks/usePagination.ts`

## 📝 Notes
- Reusable across components
- Proper error handling
- TypeScript support
```

---

## 🎯 **ISSUE 15: [Integration] Unit Tests - Viết unit tests (8h)**

**Tiêu đề:** `[Integration] Unit Tests - Viết unit tests (8h)`

**Assignee:** @thanhvien5

**Labels:** `testing`, `integration`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Viết unit tests cho các components quan trọng. Sử dụng Jest + React Testing Library. Đạt coverage tối thiểu 70%.

## 📋 Yêu Cầu Chi Tiết
- [ ] Setup Jest + RTL
- [ ] Test common components
- [ ] Test page components
- [ ] Test custom hooks
- [ ] Test utilities
- [ ] Achieve 70% coverage
- [ ] CI/CD integration

## 🔗 Dependencies
- Jest
- React Testing Library
- Testing utilities

## ✅ Tiêu Chí Hoàn Thành
- [ ] Test setup complete
- [ ] Core components tested
- [ ] 70% coverage achieved
- [ ] CI/CD pipeline updated

## 📁 Files Cần Tạo
- `frontend/src/__tests__/`
- `jest.config.js`
- Test files for components

## 📝 Notes
- Follow testing best practices
- Mock external dependencies
- Integration with CI/CD
```

---

## 🎯 **ISSUE 16: [Integration] E2E Tests - Thiết lập E2E testing (8h)**

**Tiêu đề:** `[Integration] E2E Tests - Thiết lập E2E testing (8h)`

**Assignee:** @thanhvien5

**Labels:** `testing`, `integration`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Thiết lập E2E testing với Playwright hoặc Cypress. Tạo test cases cho các user flows quan trọng.

## 📋 Yêu Cầu Chi Tiết
- [ ] Setup Playwright/Cypress
- [ ] Test user registration
- [ ] Test login flow
- [ ] Test trip recording
- [ ] Test carbon credit purchase
- [ ] Test verification process
- [ ] CI/CD integration

## 🔗 Test Cases
- User registration và login
- EV owner: Record trip, view wallet, create listing
- Buyer: Browse marketplace, purchase credits, view certificates
- CVA: Verify trips, generate reports
- Admin: User management, view analytics

## ✅ Tiêu Chí Hoàn Thành
- [ ] E2E framework setup
- [ ] Critical user flows tested
- [ ] CI/CD integration
- [ ] Test reports generated

## 📁 Files Cần Tạo
- `e2e/` directory
- Test configuration
- Test scripts

## 📝 Notes
- Critical user journey testing
- Cross-browser testing
- Performance monitoring
```

---

## 🎯 **ISSUE 17: [Integration] API Integration - Tích hợp API (4h)**

**Tiêu đề:** `[Integration] API Integration - Tích hợp API (4h)`

**Assignee:** @thanhvien5

**Labels:** `integration`, `api`, `frontend`

**Description:**
```markdown
## 🎯 Mục Tiêu
Kiểm tra và hoàn thiện tích hợp API. Đảm bảo tất cả endpoints hoạt động đúng, error handling đầy đủ.

## 📋 Yêu Cầu Chi Tiết
- [ ] Test all API endpoints
- [ ] Verify error handling
- [ ] Check data validation
- [ ] Performance optimization
- [ ] API documentation update
- [ ] Mock data for development

## 🔗 API Services
- Auth service
- Trip service
- Marketplace service
- Verification service
- Report service
- Wallet service

## ✅ Tiêu Chí Hoàn Thành
- [ ] All endpoints tested
- [ ] Error handling complete
- [ ] Data validation working
- [ ] Performance optimized
- [ ] Documentation updated

## 📁 Files Cần Kiểm Tra
- `frontend/src/services/*.ts`
- API integration points
- Error handling logic

## 📝 Notes
- End-to-end API testing
- Error boundary testing
- Performance monitoring
- Documentation updates
```

---

## 🚀 **Bước 3: Tạo GitHub Project Board**

Sau khi tạo xong tất cả issues:

1. Tạo GitHub Project mới
2. Add tất cả 17 issues vào board
3. Tạo columns: **Backlog** → **In Progress** → **Review** → **Done**
4. Set up automation rules
5. Assign issues cho team members

## 📊 **Timeline & Milestones**

- **Phase 1 (7-10 ngày)**: Issues 3, 6, 8 (Core Dashboards)
- **Phase 2 (5-7 ngày)**: Issues 1, 2, 4, 5, 7, 9, 10, 11, 12 (Features)
- **Phase 3 (3-5 ngày)**: Issues 13-17 (Testing & Integration)

## 🎯 **Bắt Đầu Tạo Issues Ngay!**

Copy-paste từng issue description vào GitHub Issues và assign cho thành viên tương ứng. Mỗi issue đã có đầy đủ chi tiết để team hiểu và bắt đầu làm việc ngay.