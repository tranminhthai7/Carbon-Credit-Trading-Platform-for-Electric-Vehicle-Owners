# Script tạo tất cả GitHub issues

# Issue 3: CVADashboard
gh issue create --title "[CVA] CVADashboard - Dashboard xác minh (3h)" --body "## 🎯 Mục Tiêu
Tạo CVADashboard hiển thị thống kê công việc xác minh. Bao gồm: số lượng trips đang chờ xác minh, đã xác minh trong tuần/tháng, tỷ lệ chấp nhận/từ chối.

## 📋 Yêu Cầu Chi Tiết
- [ ] Stats cards: Pending Verifications, Verified This Week, Approval Rate
- [ ] Priority queue cho trips cần xác minh gấp
- [ ] Recent verification activities
- [ ] Charts: Verification trends, Approval/Rejection ratio
- [ ] Quick actions: Start Verification, View Queue

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/verifications/stats\` - Thống kê verification
- \`GET /api/verifications/pending\` - Trips đang chờ
- \`GET /api/verifications/recent\` - Activities gần đây

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
- \`frontend/src/pages/cva/CVADashboard.tsx\`

## 📝 Notes
- Follow AdminDashboard pattern
- Real-time updates nếu có thể"

# Issue 4: BuyerDashboard
gh issue create --title "[Buyer] BuyerDashboard - Hoàn thiện dashboard (3h)" --body "## 🎯 Mục Tiêu
Hoàn thiện BuyerDashboard (sample đã có). Thêm chart thống kê mua hàng theo tháng, hiển thị certificates đã nhận, và thêm section so sánh giá trên thị trường.

## 📋 Yêu Cầu Chi Tiết
- [ ] Chart thống kê đơn hàng theo tháng (BarChart)
- [ ] Section hiển thị certificates đã nhận
- [ ] So sánh giá thị trường (min/max/avg price)
- [ ] Recent orders section (đã có)
- [ ] Quick actions (đã có)
- [ ] Real-time data fetching

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/listings/orders\` - Lấy orders của buyer
- \`GET /api/certificates\` - Lấy certificates (cần tạo endpoint)
- \`GET /api/marketplace/stats\` - Thống kê thị trường

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
- \`frontend/src/pages/buyer/BuyerDashboard.tsx\` (sample có sẵn)

## 📝 Notes
- Tham khảo BuyerDashboard hiện tại
- Thêm MUI X Charts dependencies nếu cần"

# Issue 5: OrdersPage
gh issue create --title "[Buyer] OrdersPage - Quản lý đơn hàng (4h)" --body "## 🎯 Mục Tiêu
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
- \`GET /api/listings/orders\` - Lấy tất cả orders
- \`GET /api/orders/:id\` - Chi tiết order
- \`DELETE /api/orders/:id\` - Hủy order
- \`GET /api/orders/:id/payments\` - Lịch sử thanh toán

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
- \`frontend/src/pages/buyer/OrdersPage.tsx\`

## 📝 Notes
- Sử dụng marketplaceService.getMyOrders()
- Implement optimistic updates"

# Issue 6: CertificatesPage
gh issue create --title "[Buyer] CertificatesPage - Quản lý chứng chỉ (4h)" --body "## 🎯 Mục Tiêu
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
- \`GET /api/certificates\` - Lấy certificates của user
- \`GET /api/certificates/:id/pdf\` - Download PDF
- \`POST /api/certificates/:id/share\` - Tạo share link

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
- \`frontend/src/pages/buyer/CertificatesPage.tsx\`

## 📝 Notes
- Implement PDF download
- Add share functionality
- Certificate verification logic"